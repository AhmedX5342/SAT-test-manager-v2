import './Support.css';

const FEATURES = [
  { icon: '🆓', title: 'Completely Free', desc: 'No subscriptions, no paywalls, no hidden fees. Forever.' },
  { icon: '🚫', title: 'Zero Ads', desc: 'No advertisements. Your study time is yours, undisturbed.' },
  { icon: '🔒', title: 'Private & Local', desc: 'All data stored locally in your browser. Nothing is sent to any server.' },
  { icon: '🤖', title: 'AI Correction', desc: 'Automatically grade tests using AI — just paste the answer key.' },
  { icon: '📊', title: 'Progress Analytics', desc: 'Track your improvement over time with score charts and statistics.' },
  { icon: '📁', title: 'Folder Organization', desc: 'Organize tests by subject, date, or any category you choose.' },
  { icon: '⏱', title: 'Timed Practice', desc: 'Simulate real exam conditions with a built-in countdown timer.' },
  { icon: '⌨️', title: 'Keyboard Shortcuts', desc: 'Answer questions blazing fast using keyboard shortcuts.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes during late-night study sessions.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Works great on phones, tablets, and desktops alike.' },
  { icon: '🔓', title: 'Open Source', desc: 'Fully open source. Inspect, modify, or contribute to the code.' },
];

export default function Support() {
  return (
    <div className="support-page page">
      <div className="support-hero">
        <div className="support-hero-icon">✦</div>
        <h1>SAT Practice Manager</h1>
        <p className="support-tagline">A free, open-source tool to help you ace the SAT</p>
      </div>

      <div className="features-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="support-links">
        <div className="support-card">
          <h2>🐙 Open Source</h2>
          <p>This project is open source and under active development. Contributions, suggestions, and feedback are very welcome!</p>
          <a
            href="https://github.com/AhmedX5342/SAT-test-manager-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View on GitHub →
          </a>
        </div>

        <div className="support-card">
          <h2>🐛 Found a Bug?</h2>
          <p>If you encounter any issues or bugs, please report them so they can be fixed for everyone. The more detail you include, the better!</p>
          <a href="mailto:ahmed.aaaeg@gmail.com" className="btn btn-outline">
            ✉️ ahmed.aaaeg@gmail.com
          </a>
        </div>

        <div className="support-card">
          <h2>💬 Feedback & Ideas</h2>
          <p>Have a feature request or just want to share how the app is helping you? Reach out — feedback makes this app better.</p>
          <a href="mailto:ahmed.aaaeg@gmail.com" className="btn btn-primary">
            Send Feedback
          </a>
        </div>
      </div>

      <div className="support-footer">
        <p>Built with ❤️ for SAT students everywhere · <a href="https://github.com/AhmedX5342/SAT-test-manager-v2" target="_blank" rel="noopener noreferrer">GitHub</a> · <a href="mailto:ahmed.aaaeg@gmail.com">Contact</a></p>
        <p className="version-note">Under active development — improvements are made consistently. Your feedback shapes this app.</p>
      </div>
    </div>
  );
}
