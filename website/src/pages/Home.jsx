
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Database, Brain, Layout, Sparkles, BookOpen, Users, Trophy } from 'lucide-react';
import contentData from '../data/content.json';

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
  const resourceCount = contentData.length;

  return (
    <div className="container">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hero"
      >
        <motion.div variants={item} className="hero-badge">
          <Sparkles size={14} />
          <span>Open Source & Free Forever</span>
        </motion.div>

        <motion.h1 variants={item} className="hero-title heading-gradient">
          Master Frontend<br />Engineering
        </motion.h1>
        <motion.p variants={item} className="hero-subtitle">
          A curated collection of in-depth resources, real-world patterns, and interview-focused guides to accelerate your frontend career.
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <Link to="/library" className="btn-primary">
            <span>Explore {resourceCount}+ Resources</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/learning-path" className="btn-secondary">
            Start Learning Path
          </Link>
        </motion.div>

        <motion.div variants={item} className="stats-row">
          <div className="stat-item">
            <BookOpen size={20} />
            <div className="stat-content">
              <span className="stat-value">{resourceCount}+</span>
              <span className="stat-label">Resources</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Trophy size={20} />
            <div className="stat-content">
              <span className="stat-value">6</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Users size={20} />
            <div className="stat-content">
              <span className="stat-value">Free</span>
              <span className="stat-label">For Everyone</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="section-header">
          <h2>Explore by Category</h2>
          <p>Deep-dive into curated content tailored for frontend interviews and real-world development.</p>
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
          position: relative;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 500;
          margin-bottom: 2rem;
        }

        .hero-badge svg {
          color: var(--primary);
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 640px;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .hero-actions .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary {
          background: var(--btn-secondary-bg);
          color: var(--text-main);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }
        .btn-secondary:hover {
          background: var(--btn-secondary-hover);
          border-color: var(--text-muted);
          transform: translateY(-2px);
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 2.5rem;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          margin-bottom: 4rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .stat-item svg {
          color: var(--primary);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto;
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
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 0%, var(--primary-glow), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
          background: var(--card-hover-bg);
          border-color: var(--primary);
          box-shadow: 0 20px 40px -12px rgba(139, 92, 246, 0.25);
        }

        .feature-card:hover::before {
          opacity: 1;
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
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          background: var(--primary);
          color: white;
          transform: scale(1.05);
        }

        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          position: relative;
          z-index: 1;
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 2rem 1rem;
          }

          .hero-badge {
            margin-bottom: 1.5rem;
            font-size: 0.8rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
            margin-bottom: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            margin-bottom: 2rem;
          }

          .hero-actions .btn-primary,
          .hero-actions .btn-secondary {
            width: 100%;
            text-align: center;
            justify-content: center;
          }

          .stats-row {
            gap: 1rem;
            padding: 1.25rem 1rem;
            margin-bottom: 3rem;
          }

          .stat-item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-content {
            align-items: center;
            text-align: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .feature-card {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 1.5rem 0.5rem;
          }

          .hero-badge {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
          }

          .hero-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .hero-actions {
            margin-bottom: 1.5rem;
          }

          .stats-row {
            padding: 1rem 0.75rem;
            margin-bottom: 2rem;
            gap: 0.5rem;
          }

          .stat-item {
            gap: 0.375rem;
          }

          .stat-value {
            font-size: 1rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }

          .feature-card h3 {
            font-size: 1.125rem;
          }

          .feature-card p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
