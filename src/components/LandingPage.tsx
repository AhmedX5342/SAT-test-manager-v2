import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleEnterApp = () => {
    navigate('/app');
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className={`hero-content ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Free & Open Source</span>
          </div>
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
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
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
          <h2 className="section-title">Powerful Features for Test Success</h2>
          <p className="section-subtitle">Everything you need to excel, completely free</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Take Tests</h3>
              <p>Answer A–E questions with keyboard shortcuts or on-screen buttons. Auto-advance and jump to any question.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Correction</h3>
              <p>Paste any answer key and let Gemma AI grade your test automatically. Manual override available.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Analytics</h3>
              <p>Track raw and scaled scores over time with interactive charts. Filter by folder or date range.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>Folder Organization</h3>
              <p>Group tests by subject, date, or custom categories for better organization.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Timed Practice</h3>
              <p>Built-in countdown timer that auto-saves and ends the test when time is up.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Import / Export</h3>
              <p>Back up all your data as JSON or export a summary to CSV/Excel.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>Dark Mode</h3>
              <p>Easy on the eyes for late-night study sessions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Fully responsive design that works on phones and tablets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-block">
              <div className="stat-number">100%</div>
              <div className="stat-label">Privacy First</div>
              <div className="stat-desc">All data stays on your device</div>
            </div>
            <div className="stat-block">
              <div className="stat-number">∞</div>
              <div className="stat-label">Free Forever</div>
              <div className="stat-desc">No subscriptions or ads</div>
            </div>
            <div className="stat-block">
              <div className="stat-number">🤖</div>
              <div className="stat-label">AI-Powered</div>
              <div className="stat-desc">Gemma AI correction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to improve your scores?</h2>
            <p>Start practicing now - no signup required</p>
            <button className="btn-primary btn-large" onClick={handleEnterApp}>
              Launch App Now <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 American Diploma Test Master. MIT Licensed. Open source and community-driven.</p>
        </div>
      </footer>
    </div>
  );
}