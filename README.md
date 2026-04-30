# 🎓 American Diploma Test Master

<div align="center">
  <img src="public/logo.png" alt="American Diploma Test Master Logo" width="600" />
  <h1>https://sat-test-manager-v2.pages.dev/<h1>
  <h3>Master Your American Diploma Journey</h3>
  <p>A free, open-source, privacy-first practice test manager for DSAT, ACT, and EST exams</p>
</div>

---

## 📖 About

**American Diploma Test Master** is a comprehensive test preparation platform designed specifically for students pursuing American Diploma certifications including DSAT, ACT, and EST. Built with React and powered by AI, this tool helps you practice, track progress, and improve your scores—all completely free and without any data leaving your device.

> 📝 **Note:** This project is a complete remake of the [SAT-MCQ-Practice-Tests-Manager](https://github.com/AhmedX5342/SAT-MCQ-Practice-Tests-Manager) with significant improvements including AI-powered correction, better UI/UX, advanced analytics, and full mobile responsiveness.

---

## ✨ Features

### ✅ Completed Features

- **📝 Take Tests** — Answer A–E questions with keyboard shortcuts or on-screen buttons. Auto-advance on answer, jump to any question via the grid.
- **🤖 AI Correction** — Paste any answer key and let Google Gemma AI grade your test automatically. Manual override available for any mistakes.
- **📊 Progress Analytics** — Score charts over time filtered by date range or folder. Track raw and scaled scores side by side.
- **📁 Folder Organization** — Group tests into folders by subject, date, or any category you like.
- **⏱️ Timed Practice** — Built-in countdown timer that auto-saves and ends the test when time is up.
- **🏷️ Smart Tagging** — Mark questions as "Guessed" or "Requires Study" during the test for post-review.
- **💾 Import / Export** — Back up all your data as JSON or export a summary to CSV/Excel.
- **🌙 Dark Mode** — Easy on the eyes for late-night study sessions.
- **📱 Mobile Friendly** — Fully responsive design with hamburger menu navigation on phones and tablets.
- **🔒 100% Local** — All data lives in your browser's localStorage. Nothing is ever sent to a server.
- **🚫 No Ads, No Paywall, No Accounts** — Completely free, always.
- **🎨 Beautiful Landing Page** — Stunning animated landing page showcasing all features.

### 🚧 Features Under Development

- **📚 Large Searchable Test Archive** — A comprehensive, searchable database containing hundreds of DSAT, ACT, and EST practice tests. Filter by subject, difficulty, year, and test type.
- **🧠 AI-Powered Insights** — Advanced AI analysis that identifies your weak areas, provides personalized study recommendations, and predicts your score based on performance patterns.
- **📄 PDF Annotation** — Upload, view, and annotate PDFs directly within the web app. Highlight text, add notes, and mark important sections without leaving the platform.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/AhmedX5342/SAT-test-manager-v2.git

# Navigate to project directory
cd SAT-test-manager-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **React 18 + Vite** — Fast, modern frontend tooling with HMR
- **React Router DOM** — Smooth navigation and routing
- **localStorage** — All data persisted locally, no backend required
- **Google Gemma AI** — Powers the automatic answer key correction feature
- **Hamburger-React** — Smooth mobile navigation menu
- **CSS Variables** — Dynamic theming with dark/light mode support

---

## 🔧 Environment Setup

For AI correction feature to work, you need to configure your Google Gemma API key:

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Create a `.env` file in the project root:
```bash
cp .env.example .env
```
3. Add your API key to `.env`:
```
VITE_GEMMA_API_KEY=your_actual_api_key_here
VITE_GEMMA_MODEL=gemma-3-27b-it
```

> ⚠️ **Security Note:** Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

---

## 📁 Project Structure

```
src/
├── main.tsx                    ← Router & providers setup
├── App.tsx                     ← Main app with header & navigation
├── components/
│   ├── LandingPage.tsx         ← Marketing/landing page
│   ├── TakeTest.tsx            ← Test-taking interface
│   ├── CorrectTest.tsx         ← AI grading modal
│   └── ViewDetails.tsx         ← Answer review & manual correction
├── pages/
│   ├── Home.tsx                ← Analytics dashboard & charts
│   ├── Tests.tsx               ← Test management & folder system
│   └── Settings.tsx            ← Import/export/delete data
├── context/
│   └── DataContext.tsx         ← Global state & CRUD operations
├── hooks/
│   └── useLocalStorage.ts      ← Local storage persistence
└── types.ts                    ← TypeScript definitions
```

---

## 📞 Support & Contact

### Get Help
- **Report a Bug** — [Open an issue](https://github.com/AhmedX5342/SAT-test-manager-v2/issues)
- **Feature Request** — Email or open an issue
- **General Questions** — Reach out via email or WhatsApp

### Contact Info
- 📧 **Email:** [ahmed.aaaeg@gmail.com](mailto:ahmed.aaaeg@gmail.com)
- 💬 **WhatsApp:** [+20 106 164 4163](https://wa.me/201061644163)
- <img src="public/github.svg" alt="GitHub" width="16" height="16" /> **GitHub:** [AhmedX5342](https://github.com/AhmedX5342)

---

## 📄 License

**MIT License** — Free to use, modify, and distribute. See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Google Gemma AI for providing powerful language model capabilities
- The open-source community for amazing tools and libraries
- All users who provide feedback and help improve the app

---

<div align="center">
  <strong>Made with compassion for students everywhere</strong>
  <br />
  <sub>Under active development — Your feedback shapes this app</sub>
</div>
