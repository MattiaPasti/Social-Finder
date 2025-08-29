/* ============================================================================
 * Social Finder – Frontend JS (completo) – SSE + doppio toggle + no-results finale
 * ==========================================================================*/

/* ------------------------- CONFIG / COSTANTI ------------------------------*/
const PLATFORM = {
    "9gag.com": { icon: "ri-emotion-laugh-fill", brand: "9gag", label: "9GAG" },
    "academia.edu": { icon: "ri-graduation-cap-fill", brand: "academia", label: "Academia.edu" },
    "apple.com": { icon: "ri-apple-fill", brand: "apple", label: "Apple Discussions" },
    "artstation.com": { icon: "ri-brush-fill", brand: "artstation", label: "ArtStation" },
    "biggerpockets.com": { icon: "ri-home-4-fill", brand: "biggerpockets", label: "BiggerPockets" },
    "boardgamegeek.com": { icon: "ri-gamepad-fill", brand: "bgg", label: "BoardGameGeek" },
    "clubhouse.com": { icon: "ri-mic-fill", brand: "clubhouse", label: "Clubhouse" },
    "codepen.io": { icon: "ri-code-fill", brand: "codepen", label: "CodePen" },
    "cults3d.com": { icon: "ri-cube-fill", brand: "cults3d", label: "Cults3D" },
    "deviantart.com": { icon: "ri-palette-fill", brand: "deviantart", label: "DeviantArt" },
    "discord.com": { icon: "ri-discord-fill", brand: "discord", label: "Discord" },
    "dribbble.com": { icon: "ri-ball-pen-fill", brand: "dribbble", label: "Dribbble" },
    "drive2.ru": { icon: "ri-car-fill", brand: "drive2", label: "Drive2" },
    "duolingo.com": { icon: "ri-translate-2", brand: "duolingo", label: "Duolingo" },
    "eyeem.com": { icon: "ri-camera-3-fill", brand: "eyeem", label: "EyeEm" },
    "facebook.com": { icon: "ri-facebook-fill", brand: "facebook", label: "Facebook" },
    "freesound.org": { icon: "ri-volume-up-fill", brand: "freesound", label: "Freesound" },
    "freelance.habr.com": { icon: "ri-briefcase-4-fill", brand: "habr", label: "Freelance Habr" },
    "geocaching.com": { icon: "ri-compass-3-fill", brand: "geocaching", label: "Geocaching" },
    "gitlab.com": { icon: "ri-gitlab-fill", brand: "gitlab", label: "GitLab" },
    "gitlab.gnome.org": { icon: "ri-code-box-fill", brand: "gnome", label: "GNOME GitLab" },
    "giphy.com": { icon: "ri-image-2-fill", brand: "giphy", label: "Giphy" },
    "habr.com": { icon: "ri-terminal-window-fill", brand: "habr", label: "Habr" },
    "houzz.com": { icon: "ri-paint-brush-fill", brand: "houzz", label: "Houzz" },
    "hudsonrock.com": { icon: "ri-shield-user-fill", brand: "hudsonrock", label: "HudsonRock" },
    "imgur.com": { icon: "ri-image-fill", brand: "imgur", label: "Imgur" },
    "instagram.com": { icon: "ri-instagram-fill", brand: "instagram", label: "Instagram" },
    "interPals.net": { icon: "ri-user-heart-fill", brand: "interpals", label: "InterPals" },
    "kaskus.co.id": { icon: "ri-chat-3-fill", brand: "kaskus", label: "Kaskus" },
    "kick.com": { icon: "ri-game-fill", brand: "kick", label: "Kick" },
    "last.fm": { icon: "ri-music-fill", brand: "lastfm", label: "Last.fm" },
    "livelib.ru": { icon: "ri-book-read-fill", brand: "livelib", label: "LiveLib" },
    "linkedin.com": { icon: "ri-linkedin-fill", brand: "linkedin", label: "LinkedIn" },
    "mixcloud.com": { icon: "ri-cloud-fill", brand: "mixcloud", label: "MixCloud" },
    "myanimelist.net": { icon: "ri-emotion-happy-fill", brand: "myanimelist", label: "MyAnimeList" },
    "mydramalist.com": { icon: "ri-film-fill", brand: "dramalist", label: "MyDramaList" },
    "myspace.com": { icon: "ri-user-2-fill", brand: "myspace", label: "MySpace" },
    "omg.lol": { icon: "ri-earth-fill", brand: "omg", label: "OMG.lol" },
    "osu.ppy.sh": { icon: "ri-circle-fill", brand: "osu", label: "osu!" },
    "periscope.tv": { icon: "ri-eye-fill", brand: "periscope", label: "Periscope" },
    "reddit.com": { icon: "ri-reddit-fill", brand: "reddit", label: "Reddit" },
    "roblox.com": { icon: "ri-cube-fill", brand: "roblox", label: "Roblox" },
    "rumble.com": { icon: "ri-volume-down-fill", brand: "rumble", label: "Rumble" },
    "scribd.com": { icon: "ri-book-mark-fill", brand: "scribd", label: "Scribd" },
    "slideshare.net": { icon: "ri-slideshow-2-fill", brand: "slideshare", label: "SlideShare" },
    "smule.com": { icon: "ri-mic-fill", brand: "smule", label: "Smule" },
    "snapchat.com": { icon: "ri-snapchat-fill", brand: "snapchat", label: "Snapchat" },
    "soundcloud.com": { icon: "ri-soundcloud-fill", brand: "soundcloud", label: "SoundCloud" },
    "sporcle.com": { icon: "ri-question-fill", brand: "sporcle", label: "Sporcle" },
    "spotify.com": { icon: "ri-spotify-fill", brand: "spotify", label: "Spotify" },
    "starcitizen.com": { icon: "ri-rocket-2-fill", brand: "starcitizen", label: "Star Citizen" },
    "steamcommunity.com": { icon: "ri-steam-fill", brand: "steam", label: "Steam" },
    "strava.com": { icon: "ri-run-fill", brand: "strava", label: "Strava" },
    "telegram.org": { icon: "ri-telegram-fill", brand: "telegram", label: "Telegram" },
    "threads.net": { icon: "ri-at-line", brand: "threads", label: "Threads" },
    "torretgalaxy.to": { icon: "ri-cloud-download-fill", brand: "torrentgalaxy", label: "TorrentGalaxy" },
    "trello.com": { icon: "ri-layout-grid-fill", brand: "trello", label: "Trello" },
    "ultimate-guitar.com": { icon: "ri-guitar-fill", brand: "ultimate-guitar", label: "Ultimate Guitar" },
    "venmo.com": { icon: "ri-bank-card-fill", brand: "venmo", label: "Venmo" },
    "vk.com": { icon: "ri-vk-fill", brand: "vk", label: "VK" },
    "vsco.co": { icon: "ri-camera-fill", brand: "vsco", label: "VSCO" },
    "weblate.org": { icon: "ri-translate-2", brand: "weblate", label: "Weblate" },
    "wikipedia.org": { icon: "ri-book-open-fill", brand: "wikipedia", label: "Wikipedia" },
    "xboxgamertag.com": { icon: "ri-game-fill", brand: "xbox", label: "Xbox Gamertag" },
    "youtube.com": { icon: "ri-youtube-fill", brand: "youtube", label: "YouTube" }
};

const INVALID_HTML_PATTERNS = [
    "page not found", "pagina non trovata", "pagina non disponibile",
    "we couldn't find", "sorry, this page isn't", "sign in", "log in", "login required",
    "autenticati", "error 404", "not found", "torna alla home"
];

/* ---------------------------- STATE ---------------------------------------*/
const state = {
    sherlockFinished: false,
    pendingChecks: 0,
    cardsCount: 0,
    noResultTimer: null,
    abortCtrl: null,
    queue: [],
    running: 0,
    maxParallel: 5,
    validCount: 0,
    invalidCount: 0,
    consoleVisible: false,
    finishedFired: false
};

/* ---------------------------- DOM -----------------------------------------*/
const form = document.querySelector("#searchForm") || document.querySelector("#search-form");
const cardsContainer = document.querySelector("#cards") || document.querySelector("#cards-container");
const loadingOverlay = document.querySelector("#loading-overlay");
const loadingInline = document.querySelector("#loading-indicator");
const noResultsEl = document.querySelector("#no-results");
const consoleEl = document.querySelector("#console");
const dashboardEl = document.getElementById('dashboard');
const toggleConsoleBtn = document.getElementById('toggle-console');
const toggleDetailsBtn = document.getElementById('toggle-details');
const consoleContainer = document.getElementById('console-container');

/* counters */
const totalCountEl = document.getElementById('total-count');
const validCountEl = document.getElementById('valid-count');
const invalidCountEl = document.getElementById('invalid-count');
const pendingCountEl = document.getElementById('pending-count');

/* progress (se li usi) */
const verifyBox = document.querySelector("#verify-progress");
const vpDone = document.querySelector("#vp-done");
const vpTotal = document.querySelector("#vp-total");

/* ---------------------------- UTILS ---------------------------------------*/
const htmlEscape = s =>
    (s ?? "").replace(/[&<>"']/g, m =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );

function resolvePlatform(host) {
    const key = Object.keys(PLATFORM).find(d => host.endsWith(d));
    if (key) return PLATFORM[key];
    return { icon: "ri-link-m", brand: "generic", label: host.replace(/^www\./, "") };
}

function parseHost(url) { try { return new URL(url).hostname.toLowerCase(); } catch { return ""; } }

function show(el) { el && el.classList.remove('hidden'); }
function hide(el) { el && el.classList.add('hidden'); }

function appendConsoleLine(text) {
    if (!consoleEl) return;
    consoleEl.textContent += text + "\n";
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

function showLoading(on) {
    if (loadingOverlay) {
        loadingOverlay.classList.toggle('hidden', !on);
    } else if (loadingInline) {
        loadingInline.classList.toggle('hidden', !on);
    }
}

function updateDashboard() {
    totalCountEl.textContent = state.cardsCount;
    validCountEl.textContent = state.validCount;
    invalidCountEl.textContent = state.invalidCount;
    pendingCountEl.textContent = state.pendingChecks;
    if (state.cardsCount > 0 || state.pendingChecks > 0) {
        show(dashboardEl);
    } else {
        hide(dashboardEl);
    }
}

function startVerification(total) {
    if (!verifyBox) return;
    vpTotal.textContent = total;
    vpDone.textContent = 0;
    verifyBox.classList.remove("hidden");
}

function tickVerification() {
    if (!verifyBox) return;
    vpDone.textContent = Number(vpDone.textContent) + 1;
    if (vpDone.textContent === vpTotal.textContent) {
        verifyBox.classList.add('hidden');
    }
}

function cssEscape(str) { return str.replace(/(["'\\])/g, "\\$1"); }

/* ---------------------------- STREAM --------------------------------------*/
let evtSource = null;
function startStream(params) {
    stopStream();
    const q = new URLSearchParams(params).toString();
    evtSource = new EventSource(`/api/search-stream?${q}`);
    showLoading(true);

    evtSource.onmessage = e => {
        const line = e.data;
        if (!line) return;
        appendConsoleLine(line);

        // end signals
        if (
            line.includes("__SHERLOCK_DONE__") ||
            line.includes('"done":true') ||
            line.includes("✅ sherlock terminato") ||
            line.startsWith("🎉 Ricerca terminata")
        ) {
            state.sherlockFinished = true;
            finalizeIfDone();
        }

        // JSON payload finale
        if (line.startsWith('{')) {
            try {
                const obj = JSON.parse(line);
                if (obj?.result?.links?.length) {
                    addCards(obj.result.links);
                }
            } catch {/* ignore */ }
        }

        // "🔗 url ✅ (reason)"
        if (line.startsWith('🔗 ')) {
            const m = line.match(/^🔗\s+(\S+)\s+(✅|❌)\s+\((.+)\)$/);
            if (m) {
                const url = m[1];
                const ok = m[2] === '✅';
                const reason = m[3];

                if (!cardsContainer.querySelector(`article[data-url="${CSS.escape(url)}"]`)) {
                    state.cardsCount++;
                    cardsContainer.appendChild(makeCard({ url }));
                }

                if (ok) {
                    state.validCount++;
                    setStatus(url, 'valid', reason);
                } else {
                    state.invalidCount++;
                    setStatus(url, 'invalid', reason);
                }

                updateDashboard();
            }
        }
    };

    evtSource.onerror = () => {
        appendConsoleLine("❌ Stream interrotto.");
        state.sherlockFinished = true;
        finalizeIfDone();
        stopStream();
    };
}

function stopStream() {
    if (evtSource) { evtSource.close(); evtSource = null; }
}

/* ------------------------- LINK CHECK QUEUE -------------------------------*/
function enqueueVerification(url) {
    state.queue.push(url);
    pumpQueue();
    updateDashboard();
}

function pumpQueue() {
    while (state.running < state.maxParallel && state.queue.length) {
        const url = state.queue.shift();
        state.running++;
        state.pendingChecks++;
        updateDashboard();

        verifyLink(url, state.abortCtrl?.signal)
            .catch(() => null)
            .then(res => updateCard(url, res))
            .finally(() => {
                state.running--;
                state.pendingChecks--;
                tickVerification();
                finalizeIfDone();
                pumpQueue();
            });
    }
}

async function verifyLink(url, signal) {
    if (!url) return null;
    try {
        const res = await fetch("/api/link-check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
            signal
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* ----------------------------- CARDS --------------------------------------*/
function makeCard({ url }) {
    if (!url) return null;
    const host = parseHost(url);
    const { icon, brand, label } = resolvePlatform(host);

    const card = document.createElement("article");
    card.className = "profile-card fade-in";
    card.dataset.url = url;

    const iconHTML = `<i class="${icon}"></i>`;
    card.innerHTML = `
    <div class="card-header">
      <div class="platform-icon ${brand}">${iconHTML}</div>
      <div class="platform-info">
        <h3>${htmlEscape(label)}</h3>
        <p class="truncate">${htmlEscape(url)}</p>
        <div class="verification-status status-badge pending" data-state="pending">PENDING</div>
      </div>
    </div>
    <div class="card-body">
      <a class="btn disabled pointer-events-none opacity-60" href="javascript:void(0)">Verifica in corso...</a>
    </div>
  `;
    return card;
}

function updateCard(url, res) {
    const card = cardsContainer.querySelector(`article[data-url="${cssEscape(url)}"]`);
    if (!card) return;

    const statusEl = card.querySelector(".verification-status");
    const btn = card.querySelector(".btn");

    if (!res) {
        statusEl.className = "verification-status validation-badge unknown";
        statusEl.textContent = "⚠️ Verifica non riuscita";
        if (btn) {
            btn.textContent = "Apri comunque";
            btn.classList.remove('disabled', 'pointer-events-none', 'opacity-60');
            btn.href = url;
        }
        return;
    }

    if (res.valid) {
        statusEl.className = "verification-status validation-badge valid";
        statusEl.innerHTML = `✅ Pagina verificata${res.reason ? `<small class="reason"> (${htmlEscape(res.reason)})</small>` : ""}`;
        if (btn) {
            btn.textContent = "Visita";
            btn.classList.remove('disabled', 'pointer-events-none', 'opacity-60');
            btn.href = url;
        }
        state.validCount++;
    } else {
        statusEl.className = "verification-status validation-badge invalid";
        statusEl.innerHTML = `⚠️ Pagina non valida${res.reason ? `<small class="reason"> (${htmlEscape(res.reason)})</small>` : ""}`;
        btn?.remove();
        state.invalidCount++;
    }
    updateDashboard();
}

function setStatus(url, status, reason = '') {
    const card = cardsContainer.querySelector(`article[data-url="${cssEscape(url)}"]`);
    if (!card) return;
    const statusEl = card.querySelector(".verification-status");
    const btn = card.querySelector(".btn");

    if (status === 'valid') {
        statusEl.className = "verification-status status-badge valid";
        statusEl.innerHTML = `✅ Pagina verificata${reason ? `<small class="reason"> (${htmlEscape(reason)})</small>` : ""}`;
        if (btn) {
            btn.textContent = "Visita";
            btn.classList.remove('disabled', 'pointer-events-none', 'opacity-60');
            btn.href = card.dataset.url;
        }
    } else {
        statusEl.className = "verification-status status-badge invalid";
        statusEl.innerHTML = `⚠️ Pagina non valida${reason ? `<small class="reason"> (${htmlEscape(reason)})</small>` : ""}`;
        btn?.remove();
    }
}

/* ------------------------- ADD & FINALIZE ---------------------------------*/
function addCards(links) {
    if (!links?.length) return;

    if (state.pendingChecks === 0 && state.queue.length === 0) {
        startVerification(links.length);
    } else if (verifyBox && vpTotal) {
        vpTotal.textContent = Number(vpTotal.textContent) + links.length;
    }

    hide(noResultsEl);
    const frag = document.createDocumentFragment();
    links.forEach(url => {
        if (cardsContainer.querySelector(`article[data-url="${cssEscape(url)}"]`)) return;
        const c = makeCard({ url });
        if (c) {
            frag.appendChild(c);
            state.cardsCount++;
            enqueueVerification(url);
        }
    });
    cardsContainer.appendChild(frag);
    updateDashboard();
}

function finalizeIfDone() {
    // overlay off solo quando TUTTO è finito
    const done = state.sherlockFinished && state.pendingChecks === 0 && state.queue.length === 0 && state.running === 0;
    if (!done) return;
    if (state.finishedFired) return;
    state.finishedFired = true;

    showLoading(false);
    if (state.cardsCount === 0) {
        show(noResultsEl);
    }
}

/* ---------------------------- RESET ---------------------------------------*/
function fullResetUI() {
    stopStream();
    state.abortCtrl?.abort();

    consoleEl && (consoleEl.textContent = "");
    hide(noResultsEl);
    cardsContainer && (cardsContainer.innerHTML = "");
    hide(verifyBox);
    if (vpDone) vpDone.textContent = "0";
    if (vpTotal) vpTotal.textContent = "0";

    state.sherlockFinished = false;
    state.pendingChecks = 0;
    state.cardsCount = 0;
    state.noResultTimer = null;
    state.abortCtrl = null;
    state.queue = [];
    state.running = 0;
    state.validCount = 0;
    state.invalidCount = 0;
    state.consoleVisible = false;
    state.finishedFired = false;

    hide(dashboardEl);
    hide(consoleContainer);
    toggleConsoleBtn.textContent = 'Mostra console';
    toggleDetailsBtn.textContent = 'Mostra dettagli';
    cardsContainer.classList.add('details-hidden');

    showLoading(false);
}

/* ---------------------------- EVENTS --------------------------------------*/
form?.addEventListener("submit", async e => {
    e.preventDefault();
    const nome = (form.nome ? form.nome.value : form.query.value).trim();
    const cognome = (form.cognome ? form.cognome.value : "").trim();
    if (!nome && !cognome) return;

    fullResetUI();
    state.abortCtrl = new AbortController();

    appendConsoleLine(`[${new Date().toLocaleTimeString()}] Avvio ricerca per: ${nome} ${cognome}`);

    startStream({ nome, cognome });

    // eventuale fetch /api/search (se vuoi ancora usarlo)
    const data = await safeFetchJSON(`/api/search?nome=${encodeURIComponent(nome)}&cognome=${encodeURIComponent(cognome)}`, state.abortCtrl.signal);
    if (data?.links?.length) {
        addCards(data.links);
    }
});

toggleConsoleBtn?.addEventListener('click', () => {
    state.consoleVisible = !state.consoleVisible;
    if (state.consoleVisible) {
        show(consoleContainer);
        toggleConsoleBtn.textContent = 'Nascondi console';
    } else {
        hide(consoleContainer);
        toggleConsoleBtn.textContent = 'Mostra console';
    }
});

window.addEventListener("beforeunload", stopStream);
window.addEventListener("keydown", e => {
    if (e.key === "Escape" && state.abortCtrl) {
        state.abortCtrl.abort();
        stopStream();
        showLoading(false);
        appendConsoleLine(`[${new Date().toLocaleTimeString()}] Ricerca interrotta.`);
    }
});

/* -------------------------- SAFE FETCH JSON -------------------------------*/
async function safeFetchJSON(url, signal) {
    try {
        const res = await fetch(url, { signal });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* ------------------------- TOGGLE DETAILS (GLOBAL) -----------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const cardsWrapper = document.getElementById('cards') || document.getElementById('cards-container');
    const toggleDetailsBtn = document.getElementById('toggle-details');

    if (!cardsWrapper || !toggleDetailsBtn) return;

    // Funzione per aggiornare l'etichetta del pulsante
    const updateToggleBtnLabel = () => {
        const hidden = cardsWrapper.classList.contains('details-hidden');
        toggleDetailsBtn.textContent = hidden ? 'Mostra dettagli' : 'Nascondi dettagli';
    };

    // Toggle globale dei dettagli
    toggleDetailsBtn.addEventListener('click', () => {
        cardsWrapper.classList.toggle('details-hidden');
        updateToggleBtnLabel();
    });

    // Mostra il pulsante solo se ci sono card
    const showToggleIfCards = () => {
        const hasCards = cardsWrapper.children.length > 0;
        toggleDetailsBtn.classList.toggle('hidden', !hasCards);
    };

    // Osserva aggiunte/rimozioni di card
    const observer = new MutationObserver(showToggleIfCards);
    observer.observe(cardsWrapper, { childList: true });

    // Inizializza UI
    showToggleIfCards();
    updateToggleBtnLabel();
    cardsWrapper.classList.add('details-hidden'); // Dettagli nascosti di default
});

// Inizializza UI al caricamento
document.addEventListener('DOMContentLoaded', fullResetUI);