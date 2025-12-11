
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Terminal, BookOpen, Layers, Map, Search, Mail, Github, Linkedin } from 'lucide-react';
import { XIcon } from './SocialIcons';
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
        <div className="container footer-content">
          <p>Built with ❤️ by Tushar Khanna</p>
          <div className="social-links">
            <a href="mailto:hellokhannatushar@gmail.com" className="social-link" title="Email">
              <Mail size={20} />
            </a>
            <a href="https://x.com/iamtusharkhanna" target="_blank" rel="noopener noreferrer" className="social-link" title="X (Twitter)">
              <XIcon size={18} />
            </a>
            <a href="https://www.linkedin.com/in/khannatushar/" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/codertushar/frontend-resources" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <Github size={20} />
            </a>
          </div>
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
          box-shadow:
            0 4px 20px -2px rgba(0, 0, 0, 0.15),
            0 0 40px -10px var(--primary-glow);
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
          padding: 3rem 0;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: auto;
          border-top: 1px solid var(--border-color);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .social-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .social-link {
          color: var(--text-muted);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
        }

        .social-link:hover {
          color: var(--primary);
          transform: translateY(-2px);
          border-color: var(--primary);
          background: var(--surface-hover);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .navbar {
            width: 95%;
            padding: 0.625rem 1rem;
          }

          .logo-text {
            display: none;
          }

          .nav-links {
            gap: 0.25rem;
          }

          .nav-item span {
            display: none;
          }

          .nav-item {
            padding: 0.5rem;
          }

          .nav-separator {
            margin: 0 0.25rem;
          }

          .main-content {
            padding-top: 5rem;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            width: 100%;
            top: 0;
            border-radius: 0 0 16px 16px;
          }

          .logo {
            font-size: 1rem;
          }

          .footer {
            padding: 2rem 0;
          }

          .footer-content {
            gap: 1rem;
          }

          .social-links {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
