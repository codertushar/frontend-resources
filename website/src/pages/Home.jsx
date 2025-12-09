
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Database, Brain, Layout } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Home = () => {
  return (
    <div className="container">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hero"
      >
        <motion.h1 variants={item} className="hero-title heading-gradient">
          Master Frontend<br />Engineering
        </motion.h1>
        <motion.p variants={item} className="hero-subtitle">
          A curated collection of resources, patterns, and guides to level up your development skills.
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <Link to="/library" className="btn-primary">
            Browse Library
          </Link>
          <Link to="/learning-path" className="btn-secondary">
            Start Learning Path
          </Link>
        </motion.div>

        <motion.div variants={item} className="features-grid">
          <Link to="/library?category=js" className="feature-card glass-panel">
            <div className="feature-icon"><Code size={24} /></div>
            <h3>JavaScript Deep Dives</h3>
            <p>Master the core language, from closures to event loops.</p>
          </Link>
          <Link to="/library?category=dsa" className="feature-card glass-panel">
            <div className="feature-icon"><Database size={24} /></div>
            <h3>DSA for Frontend</h3>
            <p>Algorithms and data structures optimized for interviews.</p>
          </Link>
          <Link to="/library?category=system-design" className="feature-card glass-panel">
            <div className="feature-icon"><Layout size={24} /></div>
            <h3>System Design</h3>
            <p>Large-scale frontend architecture for senior interviews.</p>
          </Link>
          <Link to="/library?category=ai" className="feature-card glass-panel">
            <div className="feature-icon"><Brain size={24} /></div>
            <h3>AI Engineering</h3>
            <p>Integrate modern AI tools into your workflows.</p>
          </Link>
        </motion.div>
      </motion.div>

      <style>{`
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 4rem 1rem;
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 5rem;
        }

        .btn-secondary {
          background: var(--btn-secondary-bg);
          color: var(--text-main);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: var(--btn-secondary-hover);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          width: 100%;
        }

        .feature-card {
          padding: 2rem;
          text-align: left;
          transition: transform 0.2s;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          background: var(--card-hover-bg);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: var(--surface-hover);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
