#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Social Finder – API backend (optimized & stricter 404 handling)
"""
from __future__ import annotations

import json
import os
import re
import signal
import subprocess
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Dict, Iterator, List, Sequence, Tuple
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from ddgs import DDGS
from flask import Flask, Response, jsonify, render_template, request
from requests.adapters import HTTPAdapter, Retry

# ──────────────────────────────────────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class Config:
    USER_AGENT: str = "Mozilla/5.0 (SocialFinder)"
    DUCK_RATE: float = float(os.getenv("DUCK_RATE", 0.25))  # sec tra query DDG
    PAGE_TIMEOUT: int = int(os.getenv("PAGE_TIMEOUT", 8))
    SHERLOCK_TIMEOUT: str = os.getenv("SHERLOCK_TIMEOUT", "5")
    SCRAPE_WORKERS: int = int(os.getenv("SCRAPE_WORKERS", 10))
    MAX_BODY_BYTES: int = int(os.getenv("MAX_BODY_BYTES", 20_480))
    SERPAPI_KEY: str | None = os.getenv("SERPAPI_KEY")


CFG = Config()

INVALID_HTML_PATTERNS: set[str] = {
    "sign in",
    "log in",
    "login required",
    "you need to sign in",
    "autenticati",
    "registrati per continuare",
    "captcha",
    "devi essere loggato",
    "area riservata",
    "contenuto privato",
    "restricted access",
    "acesso restrito",
    "accès restreint",
    "404",
    "page not found",
    "error 404",
    "error",
    "not found",
    "pagina non trovata",
    "pagina non disponibile",
    "we couldn't find",
    "sorry, this page isn't",
    "torna alla home",
    "contenuto non disponibile",
    "errore nel recupero della pagina",
    "sito non trovato",
    "nicht gefunden",
    "pas trouv",
    "no encontrada",
    "не найдена",
    "this page could not be found",
    "la pagina che stavi cercando non è stata trovata",
}

ERROR_INDICATORS: tuple[str, ...] = (
    "<title>404",
    "<title>page not found",
    "<title>error",
    "<title>pagina non trovata",
    'class="error',
    'class="notfound',
    'class="page-error',
    'class="404',
    'id="error',
    'id="notfound',
    'id="page-error',
    'id="404',
    'meta name="error"',
    'prerender-status-code" content="404',
    "error-page",
    "notfound-container",
)

HARSH_404_REGEX = re.compile(r"(404|not\s*found|pagina\s*non\s*trovata)", re.IGNORECASE)


# ──────────────────────────────────────────────────────────────────────────────
# LIMIT RATING REQUEST
# ──────────────────────────────────────────────────────────────────────────────

RATE_WINDOW = 5 * 60   # 5 minuti
RATE_MAX = 1           # 1 richiesta per finestra
_rate_lock = threading.Lock()
_rate_hits = {}  # { (route, ip): [t1, t2, ...] } timestamps secondi

def client_ip():
    # Se usi Proxy/Nginx/CF potresti voler leggere X-Forwarded-For
    fwd = request.headers.get("X-Forwarded-For", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.remote_addr or "unknown"

def rate_limit(route_key: str):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            ip = client_ip()
            now = time.time()
            key = (route_key, ip)
            with _rate_lock:
                hits = _rate_hits.get(key, [])
                # tieni solo gli hit negli ultimi 5 min
                hits = [t for t in hits if now - t < RATE_WINDOW]
                if len(hits) >= RATE_MAX:
                    # 429 con messaggio coerente
                    if request.path == "/api/search-stream":
                        return Response(
                            "event: message\ndata: ⚠️ Limite raggiunto. Riprova tra 5 minuti.\n\n",
                            status=429,
                            mimetype="text/event-stream"
                        )
                    abort(429, description="Troppi tentativi. Riprova tra 5 minuti.")
                hits.append(now)
                _rate_hits[key] = hits
            return fn(*args, **kwargs)
        # preserva nome e docstring (opzionale)
        wrapper.__name__ = fn.__name__
        wrapper.__doc__ = fn.__doc__
        return wrapper
    return decorator


# ──────────────────────────────────────────────────────────────────────────────
# HTTP session (retry/backoff)
# ──────────────────────────────────────────────────────────────────────────────


def build_session() -> requests.Session:
    sess = requests.Session()
    sess.headers.update({"User-Agent": CFG.USER_AGENT})
    retries = Retry(
        total=2,
        backoff_factor=0.3,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=("HEAD", "GET"),
        respect_retry_after_header=True,
    )
    adapter = HTTPAdapter(max_retries=retries, pool_maxsize=CFG.SCRAPE_WORKERS)
    sess.mount("http://", adapter)
    sess.mount("https://", adapter)
    return sess


SESSION = build_session()

# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────


def match_domain(url: str, wanted: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return host == wanted or host.endswith("." + wanted)


def build_username_variants(nome: str, cognome: str) -> list[str]:
    nome, cognome = (re.sub(r"\W+", "", s.lower()) for s in (nome, cognome))
    base = [
        f"{nome}{cognome}",
        f"{cognome}{nome}",
        f"{nome}.{cognome}",
        f"{nome}_{cognome}",
        f"{nome[:1]}{cognome}" if nome else "",
        f"{cognome}{nome[:1]}" if nome and cognome else "",
    ]
    extra = [f"{b}_" for b in base if b] + [f"{b}1" for b in base if b]
    return sorted({v for v in base + extra if v})


def sse(msg: str) -> str:
    return f"data: {msg}\n\n"


def stream_cmd(cmd: Sequence[str], label: str) -> Iterator[str]:
    yield sse(f"▶️  {' '.join(cmd)}")
    with subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1
    ) as proc:
        assert proc.stdout is not None
        for line in proc.stdout:
            yield sse(f"{label} | {line.rstrip()}")
    yield sse(f"✅ {label} terminato (exit {proc.returncode})")


def is_valid_page(url: str) -> Tuple[bool, str]:
    """Controllo avanzato validità pagina. Più severo su 404/not found."""
    if not url.lower().startswith(("http://", "https://")):
        return False, "URL deve iniziare con http:// o https://"

    try:
        parsed = urlparse(url)
        if not parsed.netloc:
            return False, "URL non valido: dominio mancante"
    except Exception as e:
        return False, f"Errore parsing URL: {e}"

    headers = {
        "Accept": "text/html,*/*",
        "Accept-Encoding": "identity",
        "Range": f"bytes=0-{CFG.MAX_BODY_BYTES - 1}",
    }

    try:
        resp = SESSION.head(
            url,
            headers=headers,
            allow_redirects=True,
            timeout=CFG.PAGE_TIMEOUT,
            verify=True,
        )
        if resp.status_code in (405, 501):  # HEAD non supportato
            resp = SESSION.get(
                url,
                headers=headers,
                allow_redirects=True,
                timeout=CFG.PAGE_TIMEOUT,
                stream=True,
            )
            if hasattr(resp, "raw") and resp.raw:
                resp.raw.read(CFG.MAX_BODY_BYTES)
                resp.close()

        status = resp.status_code
        if status == 200:
            status_reason = "200 OK"
        elif status in (202, 204):
            return True, f"{status} Accepted/No Content"
        elif status in (404, 410):
            return False, f"HTTP Status {status} (hard fail)"
        elif 300 <= status < 400:
            return False, f"Redirect non risolto ({status})"
        elif 400 <= status < 500:
            return False, f"HTTP Client Error {status}"
        else:
            return False, f"HTTP Server Error {status}"

        ctype = resp.headers.get("content-type", "").lower()
        if "text/html" not in ctype:
            return True, status_reason

        raw = resp.content[: CFG.MAX_BODY_BYTES]
        soup = BeautifulSoup(raw, "html.parser")
        main = soup.find("main") or soup.find("body") or soup
        text = main.get_text(separator=" ", strip=True).lower()
        html_str = str(main)

        if HARSH_404_REGEX.search(text):
            return False, f"{status_reason} + text 404"
        if any(p in text for p in INVALID_HTML_PATTERNS):
            return False, f"{status_reason} + pattern visibile"

        indicators_hit = [ind for ind in ERROR_INDICATORS if ind in html_str]
        if any("404" in ind or "notfound" in ind for ind in indicators_hit):
            return False, f"{status_reason} + html 404"
        if len(indicators_hit) >= 2:
            return False, f"{status_reason} + multiple error indicators"

        if re.search(r"<img[^>]+(404|notfound|error)[^>]*>", html_str):
            return False, f"{status_reason} + img 404"
        if re.search(r'class=["\'][^"\']*(error|notfound|404)[^"\']*["\']', html_str):
            return False, f"{status_reason} + class regex"

        return True, status_reason

    except requests.exceptions.TooManyRedirects:
        return False, "Troppi redirect (loop?)"
    except requests.exceptions.SSLError:
        return False, "Errore SSL/Certificato"
    except requests.exceptions.Timeout:
        return False, "Timeout connessione"
    except requests.exceptions.ConnectionError:
        return False, "Errore di connessione"
    except requests.exceptions.RequestException as e:
        return False, f"Errore richiesta: {e}"


# ──────────────────────────────────────────────────────────────────────────────
# Core search
# ──────────────────────────────────────────────────────────────────────────────


def search_dorks(fullname: str, seen: set[str]) -> List[str]:
    targets = {
        "facebook.com": f'"{fullname}" site:facebook.com',
        "instagram.com": f'"{fullname}" site:instagram.com',
        "linkedin.com": f'"{fullname}" site:linkedin.com',
        "twitter.com": f'"{fullname}" site:twitter.com',
        "tiktok.com": f'"{fullname}" site:tiktok.com',
        "youtube.com": f'"{fullname}" site:youtube.com',
    }

    engine = "SerpAPI" if CFG.SERPAPI_KEY else "DuckDuckGo"
    results: list[str] = []

    for dom, query in targets.items():
        try:
            if CFG.SERPAPI_KEY:
                data = SESSION.get(
                    "https://serpapi.com/search.json",
                    params={
                        "engine": "google",
                        "q": query,
                        "api_key": CFG.SERPAPI_KEY,
                        "num": 25,
                    },
                    timeout=15,
                ).json()
                raw_links = [
                    hit.get("link", "") for hit in data.get("organic_results", [])
                ]
            else:
                with DDGS(proxy=None, timeout=10) as ddgs:
                    raw_links = [h["href"] for h in ddgs.text(query, max_results=40)]
                    time.sleep(CFG.DUCK_RATE)
        except Exception:
            raw_links = []

        good = [u for u in raw_links if match_domain(u, dom) and u not in seen][:10]
        results.extend(good)
        seen.update(good)

    return results


def validate_links(urls: Sequence[str]) -> List[str]:
    valid: list[str] = []
    with ThreadPoolExecutor(max_workers=CFG.SCRAPE_WORKERS) as pool:
        futs = {pool.submit(is_valid_page, u): u for u in urls}
        for fut in as_completed(futs):
            url = futs[fut]
            ok, _ = fut.result()
            if ok:
                valid.append(url)
    return valid


# ──────────────────────────────────────────────────────────────────────────────
# Flask
# ──────────────────────────────────────────────────────────────────────────────

app = Flask(__name__, static_folder="static", static_url_path="/static")


@app.route("/")
# @rate_limit("main")
def home():
    return render_template("index.html")

@app.route("/disclaimer")
# @rate_limit("disclaimer")
def disclaimer():
    return render_template("disclaimer.html")

@app.route("/privacy")
# @rate_limit("privacy")
def privacy():
    return render_template("privacy.html")

@app.route("/api/search-stream")
# @rate_limit("search-stream")
def api_search_stream():
    nome = request.args.get("nome", "").strip()
    cognome = request.args.get("cognome", "").strip()
    fullname = f"{nome} {cognome}".strip()
    usernames = build_username_variants(nome, cognome)
    t0 = time.time()

    def generate() -> Iterator[str]:
        yield sse(f"🔎 Avvio ricerca per: {fullname or '(nessun nome)'}")
        yield sse(f"🧩 Username generati: {', '.join(usernames) or '(0)'}")

        # 1) Sherlock
        sherlock_links: Dict[str, List[str]] = {}
        with TemporaryDirectory() as tmp:
            yield sse("⏳ Esecuzione Sherlock…")
            cmd = [
                "sherlock",
                *usernames,
                "--folderoutput",
                tmp,
                "--print-found",
                "--timeout",
                CFG.SHERLOCK_TIMEOUT,
            ]
            for chunk in stream_cmd(cmd, "sherlock"):
                yield chunk
            for u in usernames:
                f = Path(tmp) / f"{u}.txt"
                urls: list[str] = []
                if f.exists():
                    for raw in f.read_text(encoding="utf-8").splitlines():
                        m = re.search(r"https?://\S+", raw)
                        if m:
                            urls.append(m.group(0))
                sherlock_links[u] = sorted(set(urls))
                yield sse(f"📦 {u}: {len(urls)} link trovati")

        # dedup
        all_links: list[str] = []
        seen: set[str] = set()
        for lst in sherlock_links.values():
            for u in lst:
                if u not in seen:
                    seen.add(u)
                    all_links.append(u)

        # 2) Dorks
        engine = "SerpAPI" if CFG.SERPAPI_KEY else "DuckDuckGo"
        yield sse(f"⏳ Avvio dork con {engine}…")
        dork_links = search_dorks(fullname, seen)
        all_links.extend(dork_links)
        yield sse(f"✅ {len(dork_links)} link validi dai dork")

        # 3) Verifica
        yield sse("⏳ Verifica validità link…")
        valid_links: list[str] = []
        with ThreadPoolExecutor(max_workers=CFG.SCRAPE_WORKERS) as pool:
            futs = {pool.submit(is_valid_page, u): u for u in all_links}
            for fut in as_completed(futs):
                url = futs[fut]
                ok, reason = fut.result()
                if ok:
                    valid_links.append(url)
                yield sse(f"🔗 {url} {'✅' if ok else '❌'} ({reason})")

        yield sse(f"✅ Link validi totali: {len(valid_links)}")
        payload = {
            "ok": True,
            "query": {"nome": nome, "cognome": cognome},
            "links": valid_links,
        }
        elapsed = int(time.time() - t0)
        yield sse(f"🎉 Ricerca terminata in {elapsed}s")
        yield sse(json.dumps({"done": True, "result": payload}))

    return Response(generate(), mimetype="text/event-stream")


@app.route("/api/search")
# @rate_limit("search")
def api_search():
    return jsonify({"ok": True, "links": []}), 200


LINK_CACHE = {}


@app.post("/api/link-check")
# @rate_limit("link-check")
def link_check():
    data = request.get_json(force=True, silent=True) or {}
    url = data.get("url")
    if not url:
        return jsonify({"error": "missing url"}), 400
    if url in LINK_CACHE:
        return jsonify(LINK_CACHE[url])

    valid, reason = is_valid_page(url)  # implementa la tua logica
    resp = {"url": url, "valid": valid, "reason": reason}
    LINK_CACHE[url] = resp
    return jsonify(resp)


# ──────────────────────────────────────────────────────────────────────────────
# Shutdown
# ──────────────────────────────────────────────────────────────────────────────


def _graceful_exit(*_):
    raise SystemExit(0)


signal.signal(signal.SIGINT, _graceful_exit)
signal.signal(signal.SIGTERM, _graceful_exit)


if __name__ == "__main__":
    app.run("0.0.0.0", 3000, debug=True)
