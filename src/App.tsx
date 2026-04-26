import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Tests from './pages/Tests';
import Settings from './pages/Settings';
import Support from './pages/Support';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const TABS = [
  { id: 'home', label: 'Home', icon: '📊' },
  { id: 'tests', label: 'Test Management', icon: '📝' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'support', label: 'Support', icon: '💡' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">✦</span>
            <span className="brand-name">SAT Practice</span>
          </div>
          <nav className="tab-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main className="app-main">
        {activeTab === 'home' && <Home />}
        {activeTab === 'tests' && <Tests />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'support' && <Support />}
      </main>
    </div>
  );
}
