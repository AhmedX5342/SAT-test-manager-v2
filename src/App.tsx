import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import Home from './pages/Home';
import Tests from './pages/Tests';
import Settings from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

const TABS = [
  { id: 'home', label: 'Home', icon: '📊', path: '/app' },
  { id: 'tests', label: 'Test Management', icon: '📝', path: '/app/tests' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/app/settings' },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/app' || path === '/app/') return 'home';
    if (path === '/app/tests') return 'tests';
    if (path === '/app/settings') return 'settings';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

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

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleTabChange = (tabId: string, path: string) => {
    setActiveTab(tabId);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand" onClick={handleLogoClick}>
            <img 
              src="/logo.png" 
              alt="American Diploma Test Master" 
              className="brand-logo"
            />
          </div>
          
          {/* Desktop Navigation */}
          <nav className="tab-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id, tab.path)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Hamburger Menu - Only visible on mobile */}
          <div className="hamburger-wrapper">
            <Hamburger 
              toggled={isMobileMenuOpen} 
              toggle={setIsMobileMenuOpen}
              size={24}
              color="currentColor"
            />
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-nav">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`mobile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id, tab.path)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}