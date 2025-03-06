import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L2 10L16 18L30 10L16 2Z" fill="#4CAF50" />
              <path d="M16 20L2 12V26L16 30V20Z" fill="#4CAF50" />
              <path d="M16 20L30 12V26L16 30V20Z" fill="#4CAF50" />
            </svg>
          </div>
          <div className="company-name">Denali</div>
        </Link>
      </div>
      <nav className="nav-links">
        <a href="/pricing">Pricing</a>
        <a href="/docs">Docs</a>
        <a href="/signin">Sign In</a>
        <a href="/get-started">Get Started</a>
      </nav>
    </header>
  );
}

export default Header; 