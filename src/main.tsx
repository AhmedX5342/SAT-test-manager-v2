import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { DataProvider } from './context/DataContext.jsx'
import LandingPage from './components/LandingPage'
import App from './App.jsx'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
);