# SAT Practice Manager v2

A free, open-source, privacy-first practice test manager for SAT and other MCQ-style exams. Built with React — no backend, no database, no ads, no subscriptions.

> ⚠️ **This project is under active development.** Features are being added and improved regularly. Feedback and bug reports are very welcome!

---

## Features

- **Take Tests** — Answer A–E questions with keyboard shortcuts or on-screen buttons. Auto-advance on answer, jump to any question via the grid.
- **AI Correction** — Paste any answer key and let the AI grade your test automatically. Manual override available for any mistakes.
- **Progress Analytics** — Score charts over time filtered by date range or folder. Track raw and scaled scores side by side.
- **Folder Organization** — Group tests into folders by subject, date, or any category you like.
- **Timed Practice** — Built-in countdown timer that auto-saves and ends the test when time is up.
- **Guessed / Requires Study** — Tag individual questions during the test for post-review.
- **Import / Export** — Back up all your data as JSON or export a summary to CSV/Excel.
- **Dark Mode** — Easy on the eyes for late-night study sessions.
- **Mobile Friendly** — Fully responsive on phones and tablets.
- **100% Local** — All data lives in your browser's localStorage. Nothing is ever sent to a server.
- **No Ads, No Paywall, No Accounts** — Completely free, always.

---

## Getting Started

```bash
git clone https://github.com/AhmedX5342/SAT-test-manager-v2.git
cd SAT-test-manager-v2
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack

- **React + Vite** — Fast, modern frontend tooling
- **localStorage** — All data persisted locally, no backend required
- **Google Gemma AI** — Powers the automatic answer key correction feature

---

## Roadmap / Under Improvement

- [ ] Per-question notes and explanations
- [ ] Study mode (review wrong/guessed questions)
- [ ] More detailed analytics (by question type, time-to-answer, etc.)
- [ ] PWA support (install as an app, offline use)
- [ ] Multiple scoring scales (SAT, ACT, custom)
- [ ] AI correction accuracy improvements

---

## Environment Setup

For AI correction feature to work, you need to configure your Google Gemma API key:

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Create a `.env` file in the project root and add your api key

---

## Feedback & Bug Reports

Found a bug? Have a feature idea? Please reach out — your feedback shapes this app.

📧 **Email:** [ahmed.aaaeg@gmail.com](mailto:ahmed.aaaeg@gmail.com)  
🐙 **GitHub Issues:** [Open an issue](https://github.com/AhmedX5342/SAT-test-manager-v2/issues)

All reports are reviewed and appreciated!

---

## License

MIT — free to use, modify, and distribute.
