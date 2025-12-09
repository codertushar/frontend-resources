
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Terminal, BookOpen, Layers, Map, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <Link to="/" className="logo">
            <Terminal className="logo-icon" size={24} />
            <span className="logo-text">Frontend Resources</span>
          </Link>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>Library</span>
            </NavLink>
            <NavLink to="/learning-path" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Map size={18} />
              <span>Path</span>
            </NavLink>
            <div className="nav-separator"></div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <p>Built with ❤️ by Tushar</p>
        </div>
      </footer>

      <style>{`
        .navbar {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1000px;
          z-index: 100;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .logo-icon {
          color: var(--primary);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-separator {
          width: 1px;
          height: 24px;
          background-color: var(--border-color);
          margin: 0 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 99px;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          color: var(--text-main);
          background: var(--surface-hover);
        }

        .nav-item.active {
          background: var(--surface-hover);
          color: var(--primary);
        }

        .main-content {
          padding-top: 6rem;
          padding-bottom: 4rem;
          min-height: 100vh;
        }

        .footer {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Layout;
