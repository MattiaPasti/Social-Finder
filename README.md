
# 🔎 Social Finder

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![OSINT](https://img.shields.io/badge/OSINT-FF6F00?style=for-the-badge&logo=hackaday&logoColor=white)

[![Demo](https://img.shields.io/badge/🌍_Live_Demo-Social_Finder-2E7D32?style=for-the-badge)](https://lovedy.org)

---

## 📌 Overview

**Social Finder** is an **OSINT web application** built with **Flask** and powered by [Sherlock](https://github.com/sherlock-project/sherlock).  
It allows you to **search for a username across hundreds of social networks** and get structured results in a modern web interface.  

The project is fully containerized with **Docker** and production-ready with **Gunicorn**.

---

## ✨ Features

- 🌐 Search usernames across multiple platforms (GitHub, Twitter, Instagram, etc.)  
- 📊 Clear and modern dashboard interface  
- 🐳 Docker-ready setup (easy deployment)  
- 🔒 Privacy-focused, no data stored  
- ⚡ Fast & concurrent checks using Sherlock  

---

## 🛠 Tech Stack

- **Backend:** Python, Flask, Gunicorn  
- **Frontend:** HTML, CSS, Vanilla JS  
- **OSINT Engine:** Sherlock  
- **Deployment:** Docker & Docker Compose  

---

## 🚀 Getting Started

### 🔧 Local Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/social-finder.git
cd social-finder/Social

# Install dependencies
pip install -r backend/requirements.txt

# Run the app
cd backend
python app.py
````

App will run on: `http://localhost:5000`

---

### 🐳 Docker Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/social-finder.git
cd social-finder/Social

# Build and run
docker compose up --build
```

App will run on: `http://localhost:8000`

---

## 🌍 Live Demo

You can test Social Finder directly at:
👉 [**social.lovedy.org**](https://lovedy.org)

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an [issue](https://github.com/MattiaPasti/social-finder/issues) or submit a pull request.

---

## 📌 Roadmap

* [ ] Add PDF export of search results
* [ ] Improve detection heuristics
* [ ] Extend supported platforms
* [ ] Add authentication layer for private instances

---

> ⚡ Built with ❤️ for OSINT & Cybersecurity research.

```

<img width="1913" height="896" alt="Screenshot 2025-08-29 215135" src="https://github.com/user-attachments/assets/e4e4fca4-4bd1-4eac-8cf4-0361eb50a33f" />


```
