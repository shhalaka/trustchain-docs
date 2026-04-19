import { useState, useEffect } from 'react';
import './App.css';
import Issue from './pages/Issue';
import Verify from './pages/Verify';

function App() {
  const [page, setPage] = useState('issue');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className="app">
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>
      
      <div className="header">
        <h1>TrustChain Docs</h1>
        <p>Tamper-proof document verification on XDC blockchain</p>
      </div>

      <div className="nav">
        <button 
          className={page === 'issue' ? 'active' : ''}
          onClick={() => setPage('issue')}
        >
          Issue Document
        </button>
        <button 
          className={page === 'verify' ? 'active' : ''}
          onClick={() => setPage('verify')}
        >
          Verify Document
        </button>
      </div>

      {page === 'issue' ? <Issue /> : <Verify />}
    </div>
  );
}

export default App;