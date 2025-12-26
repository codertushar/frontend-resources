
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, Layers, Map, Mail, Github, Linkedin } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { XIcon } from './SocialIcons';
import { motion } from 'framer-motion';

import ThemeToggle from './ThemeToggle';
import NotificationPrompt from './NotificationPrompt';

const Logo = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M50 2 L58 28 L78 35 L58 42 L50 68 L42 42 L22 35 L42 28 Z" fill="url(#logoGrad)" />
    <circle cx="50" cy="82" r="14" fill="url(#logoGrad)" />
  </svg>
);

const Layout = ({ children }) => {
  // Always call hook unconditionally (React rules of hooks)
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="layout">
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <Link to="/" className="logo">
            <Logo className="logo-icon" />
            <span className="logo-text">
              <span className="logo-text-full">Frontend Resources</span>
              <span className="logo-text-short">FR</span>
            </span>
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
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="auth-section">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="auth-section">
                    <SignInButton mode="modal">
                      <button className="btn-auth btn-signin">Sign In</button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="btn-auth btn-signup">Sign Up</button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
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

      <NotificationPrompt />

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
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .logo-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .logo-text {
          display: flex;
          align-items: center;
          color: #8b5cf6;
        }

        .logo-text-short {
          display: none;
          font-weight: 800;
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

        .auth-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.5rem;
        }

        .btn-auth {
          padding: 0.5rem 1rem;
          border-radius: 99px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-signin {
          background: transparent;
          color: var(--text-main);
          border: 1px solid var(--border-color);
        }

        .btn-signin:hover {
          background: var(--surface-hover);
          border-color: var(--primary);
        }

        .btn-signup {
          background: var(--primary);
          color: white;
        }

        .btn-signup:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
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

          .logo-text-full {
            display: none;
          }

          .logo-text-short {
            display: inline;
            font-size: 1rem;
            font-weight: 800;
          }

          .logo-icon {
            width: 24px;
            height: 24px;
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

          .auth-section {
            display: flex;
            gap: 0.25rem;
          }

          .btn-auth {
            font-size: 0.75rem;
            padding: 0.4rem 0.6rem;
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
