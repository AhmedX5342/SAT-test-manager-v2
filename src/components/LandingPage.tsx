import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Hamburger from 'hamburger-react';
import './LandingPage.css';

const FEATURES = [
  { icon: '🆓', title: 'Completely Free', desc: 'No subscriptions, no paywalls, no hidden fees. Forever.' },
  { icon: '🚫', title: 'Zero Ads', desc: 'No advertisements. Your study time is yours, undisturbed.' },
  { icon: '🔒', title: 'Private & Local', desc: 'All data stored locally in your browser. Nothing is sent to any server.' },
  { icon: '🤖', title: 'AI Correction', desc: 'Automatically grade tests using AI — just paste the answer key.' },
  { icon: '📊', title: 'Progress Analytics', desc: 'Track your improvement over time with score charts and statistics.' },
  { icon: '📁', title: 'Folder Organization', desc: 'Organize tests by subject, date, or any category you choose.' },
  { icon: '⏱️', title: 'Timed Practice', desc: 'Simulate real exam conditions with a built-in countdown timer.' },
  { icon: '⌨️', title: 'Keyboard Shortcuts', desc: 'Answer questions blazing fast using keyboard shortcuts.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes during late-night study sessions.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Works great on phones, tablets, and desktops alike.' },
  { icon: '🔓', title: 'Open Source', desc: 'Fully open source. Inspect, modify, or contribute to the code.' },
  { icon: '📝', title: 'Take Tests', desc: 'Answer A–E questions with keyboard shortcuts or on-screen buttons. Auto-advance and jump to any question.' },
  { icon: '💾', title: 'Import / Export', desc: 'Back up all your data as JSON or export a summary to CSV/Excel.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Force light mode for landing page only
    document.documentElement.setAttribute('data-theme', 'light');

    // Cleanup - restore user's preference when leaving landing page
    return () => {
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme === 'true') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (savedTheme === 'false') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const handleEnterApp = () => {
    // Restore user's theme preference before entering app
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    navigate('/app');
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="American Diploma Test Master" className="landing-logo" />
          </div>

          {/* Desktop Navigation */}
          <nav className="landing-nav desktop-nav">
            <button onClick={scrollToFeatures} className="landing-nav-link">
              Features
            </button>
            <button onClick={handleContactClick} className="landing-nav-link">
              About & Contact
            </button>
            <button onClick={handleEnterApp} className="landing-nav-btn">
              Go to App <span className="btn-arrow">→</span>
            </button>
          </nav>

          {/* Hamburger Menu - Mobile */}
          <div className="landing-hamburger-wrapper">
            <Hamburger
              toggled={isMobileMenuOpen}
              toggle={setIsMobileMenuOpen}
              size={24}
              color="#fff"
            />
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="landing-mobile-nav">
              <button onClick={scrollToFeatures} className="landing-mobile-link">
                Features
              </button>
              <button onClick={handleContactClick} className="landing-mobile-link">
                About & Contact
              </button>
              <button onClick={handleEnterApp} className="landing-mobile-btn">
                Go to App <span className="btn-arrow">→</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className={`hero-content ${isVisible ? 'fade-in-up' : ''}`}>
          <h1 className="hero-title">
            Master Your<br />
            <span className="gradient-text">American Diploma</span>
          </h1>
          <p className="hero-description">
            Practice DSAT, ACT, and EST tests with AI-powered correction,
            detailed analytics, and complete privacy. All data stays on your device.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleEnterApp}>
              Go to App <span className="btn-arrow">→</span>
            </button>
            <button onClick={scrollToFeatures} className="btn-secondary">
              Learn More
            </button>
          </div>
          <div className="stats-badge">
            <span>⚡ 100% Local</span>
            <span>🔒 No Account Needed</span>
            <span>🎯 AI-Powered</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-subtitle">A complete, free toolkit for mastering your exams</p>

          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combined About & Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <h2 className="contact-title">About Me</h2>

            <div className="contact-bio">
              <p>
                I'm <strong>Ahmed Elgharabawy</strong>, a former American Diploma student who understands
                the challenges of preparing for these important exams firsthand.
              </p>
              <p>
                I created this website to help fellow students prepare effectively for their
                American Diploma tests (DSAT, ACT, EST) and track their progress in one place.
                This project is built with the belief that quality test preparation tools should
                be accessible to everyone, completely free.
              </p>
              <p className="development-note">
                🚀 <strong>This project is still under active development!</strong> I'm constantly
                adding new features and improvements. If you find any issues or have suggestions,
                please don't hesitate to reach out.
              </p>
            </div>

            <div className="contact-links">
              <div className="contact-card">
                <h3>📧 Email Me</h3>
                <p>For bug reports, feature requests, or general feedback</p>
                <a href="mailto:ahmed.aaaeg@gmail.com" className="contact-link">
                  ahmed.aaaeg@gmail.com
                </a>
              </div>

              <div className="contact-card">
                <h3>💬 WhatsApp</h3>
                <p>Quick questions or direct support</p>
                <a href="https://wa.me/201061644163" target="_blank" rel="noopener noreferrer" className="contact-link">
                  +20 106 164 4163
                </a>
              </div>

              <div className="contact-card">
                <h3>
                  <img src="/github.svg" alt="GitHub" width={20} height={20} style={{ display: 'inline', marginRight: '8px' }} />
                  GitHub
                </h3>
                <p>Open source, contributions welcome!</p>
                <a href="https://github.com/AhmedX5342/SAT-test-manager-v2" target="_blank" rel="noopener noreferrer" className="contact-link">
                  View on GitHub →
                </a>
              </div>
            </div>

            <div className="project-status">
              <p>
                <strong>MIT Licensed</strong> · Open Source · Free Forever
              </p>
              <p className="small-note">
                Your feedback shapes this app. Every report and suggestion helps make it better for everyone.
              </p>
              <p className="version-note">Under active development — improvements are made consistently</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}