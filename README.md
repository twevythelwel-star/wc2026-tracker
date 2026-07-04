# ⚽ FIFA World Cup 2026 — Live Tracker & Predictor

A modern, highly optimized, and responsive Progressive Web App (PWA) designed to track matches, standings, and tournament statistics in real-time, combined with an adaptive ELO match predictor.

Hosted natively on GitHub Pages with automated CI/CD deployments.

---

## 🚀 Key Features

* **Real-Time Scoring & Auto-Refresh:** Score updates are fetched automatically every 30 seconds from multiple live API endpoints (ESPN, worldcup2026api, OpenFootball) with automatic fallback to verified static data if all APIs are down.
* **Chronological ELO Simulation Engine:** Matches are simulated chronologically using a 3-layer model:
  1. **Baseline ELO Ratings:** Seeded from FIFA historical ratings (November 2025).
  2. **Recent Team Form:** Calculated dynamically over the last three matches, with newer results weighted more heavily.
  3. **Bayesian Matchup Bias:** Auto-corrects systematically if the model predicts a result incorrectly, refining predictions for future match combinations.
* **Offline PWA Capabilities:** Service Worker caching stores all core application shells (`index.html`, `style.css`, `app.js`, manifest, and fonts) for immediate load times and offline accessibility (with a standalone app launch experience).
* **Local Offline AI Analyst:** Evaluates model predictions dynamically to surface:
  * **Highest-Uncertainty Matches:** Closest ELO pairings and draw probability.
  * **Systematic Blind Spots:** Pattern detection on model misses (e.g. underrating defensive draw strategies vs. overvaluing historic ratings).
  * **Highest-Confidence Picks:** Statistical probability leaders based on ELO gap and form edge.
* **Interactive Predictions & Custom Training:** Users can log their personal picks, submit custom scores (training the ELO engine with real-world outcomes), and see the model adapt (increasing its version and saving ELO updates to `localStorage`).
* **Instant Sharing & Syncing:** Users can generate shares of their prediction sheets with click-to-copy/web share APIs.

---

## 🛠️ Tech Stack & Architecture

This project is built as a zero-dependency, pure-client application:
* **HTML5:** Semantic markup structured for maximum readability and accessibility.
* **Vanilla CSS3:** Curated HSL color palette, dark/light modes, premium glassmorphism card designs, subtle hover animations, and fully responsive layouts.
* **Vanilla JavaScript (ES6+):** Pure functional state management, client-side simulation, storage caching, and API integration.
* **Service Workers & Web Manifests:** Powering the installable Progressive Web App (PWA).
* **GitHub Actions:** CI/CD workflow deploying to GitHub Pages on every push to the `main` branch.

---

## 📁 File Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml     # Automated GitHub Pages CI/CD workflow
├── app.js                 # Core logic: simulation, state, and UI rendering
├── index.html             # Clean markup and PWA service worker registration
├── style.css              # Premium theme, typography, layout, and animations
├── manifest.json          # Web App Manifest for mobile and desktop installability
├── icon-192.png           # PWA Launcher icon (192x192)
├── icon-512.png           # PWA Launcher icon (512x512)
└── README.md              # Technical documentation
```

---

## ⚡ Deployment & Local Setup

### Running Locally
To test the tracker locally, you can open `index.html` directly in a browser or spin up a simple static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

*Note: Progressive Web App (PWA) installation and Service Worker caching require a secure context (`https://` or `localhost`).*

### Deploying to GitHub Pages
This project includes a GitHub Actions configuration for automatic deployment:
1. Create a repository on GitHub.
2. Push this directory to the `main` branch.
3. In your GitHub Repository, navigate to **Settings > Pages**.
4. Set **Source** to **GitHub Actions**.
5. The workflow will automatically trigger, build, and deploy the tracker to `https://<your-username>.github.io/<repository-name>/`.
