
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Database, Brain, Layout, Sparkles, BookOpen, Crown, Trophy, Terminal, Lightbulb } from 'lucide-react';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';

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
  const { getStats } = useProgress();
  const resourceCount = contentData.length;
  const premiumCount = contentData.filter(item => item.premium).length;
  const stats = getStats(resourceCount);

  // Calculate category counts
  const categoryCounts = contentData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

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
          <span>Curated Resources for Frontend Interviews</span>
        </motion.div>

        <motion.h1 variants={item} className="hero-title heading-gradient">
          Master Frontend<br />Engineering
        </motion.h1>
        <motion.p variants={item} className="hero-subtitle">
          A curated collection of in-depth resources, real-world patterns, and interview-focused guides to accelerate your frontend career.
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <Link to="/library" className="btn-primary">
            <span>Explore Library</span>
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
              <span className="stat-value">{resourceCount}</span>
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
            <Crown size={20} />
            <div className="stat-content">
              <span className="stat-value">{premiumCount}</span>
              <span className="stat-label">Premium</span>
            </div>
          </div>
        </motion.div>

        {stats.completed > 0 && (
          <motion.div variants={item} className="progress-banner glass-panel">
            <div className="progress-content">
              <div className="progress-info">
                <span className="progress-label">Your Progress</span>
                <span className="progress-value">{stats.completed} of {resourceCount} completed</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${stats.percentage}%` }}></div>
              </div>
              <span className="progress-percentage">{stats.percentage}%</span>
            </div>
            <Link to="/library" className="progress-cta">Continue Learning <ArrowRight size={16} /></Link>
          </motion.div>
        )}

        <motion.div variants={item} className="section-header">
          <h2>Explore by Category</h2>
          <p>Deep-dive into curated content tailored for frontend interviews and real-world development.</p>
        </motion.div>

        <motion.div variants={item} className="features-grid">
          <Link to="/library?category=js" className="feature-card glass-panel">
            <div className="feature-icon"><Code size={24} /></div>
            <div className="feature-content">
              <h3>JavaScript Deep Dives</h3>
              <p>Master the core language, from closures to event loops.</p>
            </div>
            <span className="feature-count">{categoryCounts['js'] || 0} articles</span>
          </Link>
          <Link to="/library?category=dsa" className="feature-card glass-panel">
            <div className="feature-icon"><Database size={24} /></div>
            <div className="feature-content">
              <h3>DSA for Frontend</h3>
              <p>Algorithms and data structures optimized for interviews.</p>
            </div>
            <span className="feature-count">{categoryCounts['dsa'] || 0} articles</span>
          </Link>
          <Link to="/library?category=machine-coding" className="feature-card glass-panel">
            <div className="feature-icon"><Terminal size={24} /></div>
            <div className="feature-content">
              <h3>Machine Coding</h3>
              <p>Real-world implementation challenges asked in interviews.</p>
            </div>
            <span className="feature-count">{categoryCounts['machine-coding'] || 0} articles</span>
          </Link>
          <Link to="/library?category=system-design" className="feature-card glass-panel">
            <div className="feature-icon"><Layout size={24} /></div>
            <div className="feature-content">
              <h3>System Design</h3>
              <p>Large-scale frontend architecture for senior interviews.</p>
            </div>
            <span className="feature-count">{categoryCounts['system-design'] || 0} articles</span>
          </Link>
          <Link to="/library?category=general" className="feature-card glass-panel">
            <div className="feature-icon"><Lightbulb size={24} /></div>
            <div className="feature-content">
              <h3>Browser & Patterns</h3>
              <p>Browser internals, rendering, and design patterns.</p>
            </div>
            <span className="feature-count">{categoryCounts['general'] || 0} articles</span>
          </Link>
          <Link to="/library?category=ai" className="feature-card glass-panel">
            <div className="feature-icon"><Brain size={24} /></div>
            <div className="feature-content">
              <h3>AI Engineering</h3>
              <p>Integrate modern AI tools into your workflows.</p>
            </div>
            <span className="feature-count">{categoryCounts['ai'] || 0} articles</span>
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
          margin-bottom: 2rem;
        }

        .progress-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          margin-bottom: 4rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .progress-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .progress-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .progress-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .progress-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .progress-bar-container {
          flex: 1;
          max-width: 300px;
          height: 8px;
          background: var(--surface-hover);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #ec4899);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-percentage {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          min-width: 50px;
        }

        .progress-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .progress-cta:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
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
          padding: 1.5rem;
          text-align: left;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
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

        .feature-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.375rem;
          color: var(--text-main);
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .feature-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
          background: rgba(139, 92, 246, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          position: relative;
          z-index: 1;
          align-self: flex-start;
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
            margin-bottom: 1.5rem;
          }

          .stat-item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-content {
            align-items: center;
            text-align: center;
          }

          .progress-banner {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            margin-bottom: 2.5rem;
          }

          .progress-content {
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
          }

          .progress-info {
            align-items: center;
            text-align: center;
          }

          .progress-bar-container {
            max-width: 100%;
            width: 100%;
          }

          .progress-cta {
            width: 100%;
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .feature-card {
            padding: 1.25rem;
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
