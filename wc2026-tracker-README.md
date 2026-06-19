# ⚽ FIFA World Cup 2026 — Live Tracker + Adaptive Predictor

A fully self-contained, single-file web app combining:
- **Live scores** — auto-refreshes every 60 seconds, tries free APIs first, falls back to verified static data
- **Real-time standings** — all 12 groups, correct qualification logic
- **Knockout bracket** — full Round of 32 pathway
- **Adaptive predictor** — ELO model that learns after every result you grade
- **Persistent learning** — prediction history and model weights saved to localStorage, survive browser restarts

## 🚀 Live at GitHub Pages

Once deployed, your site is at:
```
https://YOUR-USERNAME.github.io/wc2026-tracker/
```

---

## 📦 What's in the repo

```
wc2026-tracker/
├── index.html          ← Entire app. Single file. Open it anywhere.
└── README.md
```

No build step. No npm. No framework. Drop `index.html` anywhere and it works.

---

## 🌐 Deploy to GitHub Pages (2 minutes)

### Option A — GitHub Web UI (easiest)

1. Go to **github.com → New repository**
2. Name it `wc2026-tracker`
3. Make it **Public**
4. Click **Add file → Upload files**
5. Drag in `index.html` and `README.md`
6. Commit with message `"Initial deploy"`
7. Go to **Settings → Pages**
8. Under *Source*, select **main branch → / (root)**
9. Click **Save**
10. Your URL appears at the top: `https://YOUR-USERNAME.github.io/wc2026-tracker/`

### Option B — Git CLI

```bash
git clone https://github.com/YOUR-USERNAME/wc2026-tracker.git
cd wc2026-tracker
cp /path/to/index.html .
git add .
git commit -m "Deploy WC2026 tracker"
git push origin main
```

Then enable Pages in Settings → Pages → Source: main / root.

---

## 🎯 Predictor — How the Model Works

### 3-Layer Engine

| Layer | Weight | Description |
|-------|--------|-------------|
| ELO Rating | 60% | Seeded from FIFA Nov 2025 rankings. Updates after every result you grade. K=32. |
| Form | 25% | Last 3 results per team, newest weighted 40%, mid 35%, oldest 25%. |
| Learned Bias | 15% | Per-matchup correction applied after wrong predictions. Accumulates over tournament. |

### Learning Loop

1. Open **🎯 Predict** — see probability bars and predicted score for every upcoming match
2. Log your own pick with the buttons (saved instantly)  
3. After the match finishes → go to **✅ Grade** → enter real score → click **Submit & Learn**
4. The model: updates ELO for both teams, checks if it predicted correctly, applies Bayesian bias correction if wrong, increments model version
5. All learning saved to `localStorage` — persists when you close the tab

### What "learns" means specifically

- **Correct prediction**: ELO updates normally. Any existing bias for that matchup shrinks by 30%.
- **Wrong prediction**: ELO updates (bigger swing for the upset). A +8pt home/away bias is applied to that matchup for future predictions. Biases compound — get a matchup wrong twice and the correction doubles.

---

## 🔄 Keeping scores current

The app tries two live data sources on each refresh:
1. `worldcup2026api.vercel.app` — community-maintained live API
2. `openfootball/worldcup.json` — GitHub-hosted, updated daily

If both fail, it uses the hardcoded verified data (accurate as of **Jun 18 2026**).

**To update static fallback data:** Edit the `FALLBACK_RESULTS` and `FALLBACK_UPCOMING` arrays in `index.html`. Takes 2 minutes.

---

## 📱 Features

| Tab | What it shows |
|-----|---------------|
| 📊 Overview | Today's matches, recent results, all 12 standings |
| 🔴 Live | Live matches (auto-highlighted), next 8 fixtures with mini prediction bars |
| 🗂 Groups | Deep-dive per group: standings + all matches + predictions |
| ⚽ Results | All completed matches, newest first |
| 📅 Fixtures | Full upcoming schedule with times and venues |
| 🏆 Bracket | Round of 32 pathway + later rounds |
| 🎯 Predict | Full prediction cards with probability bars, your picks |
| 📈 Accuracy | Model performance, prediction history, learned biases |
| ⚡ ELO | Live ranking of all 48 teams with deltas |
| ✅ Grade | Enter real scores to train the model |

---

## ⚙️ Tech

- Pure HTML + CSS + Vanilla JS — no dependencies, no build step
- Google Fonts (Inter + JetBrains Mono) via CDN
- `localStorage` for prediction persistence
- Anthropic API for AI analyst (requires browser to reach `api.anthropic.com`)
- Auto-refresh every 60 seconds with manual override

---

*Built for the 2026 FIFA World Cup — USA · Canada · Mexico*
