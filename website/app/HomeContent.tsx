'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Zap, Code, Database, Brain, Layout, Sparkles, BookOpen, Crown, Trophy, Terminal, Lightbulb, ArrowRight } from 'lucide-react';
import contentData from '../src/data/content.json';
import { useProgress, ProgressStats } from '../src/context/ProgressContext';
import AdUnit from '../src/components/AdUnit';
import type { Article } from '../src/types';

// Type the content data
const typedContentData = contentData as Article[];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Typewriter hook return type
interface TypewriterResult {
  displayText: string;
  isComplete: boolean;
}

// Typewriter hook
const useTypewriter = (text: string, speed: number = 50, delay: number = 500): TypewriterResult => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let charIndex = 0;

    const startTyping = (): void => {
      timeout = setTimeout(() => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1));
          charIndex++;
          startTyping();
        } else {
          setIsComplete(true);
        }
      }, speed);
    };

    const initialDelay = setTimeout(() => {
      startTyping();
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

// Category counts type
interface CategoryCounts {
  [key: string]: number;
}

// Stats type from getStats (subset we use)
interface HomeStats {
  completed: number;
  percentage: number;
}

export default function HomeContent() {
  const { getStats } = useProgress();
  const resourceCount: number = typedContentData.length;
  const progressStats: ProgressStats = getStats();

  // Map ProgressStats to HomeStats format
  const stats: HomeStats = {
    completed: progressStats.readCount,
    percentage: progressStats.percentage
  };

  const subtitleText: string = "A curated collection of in-depth resources, real-world patterns, and interview-focused guides to land your dream frontend role.";
  const { displayText, isComplete }: TypewriterResult = useTypewriter(subtitleText, 30, 800);

  // Calculate category counts
  const categoryCounts: CategoryCounts = typedContentData.reduce((acc: CategoryCounts, item: Article) => {
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

      {/* Animated Gradient Title with Glow */}
      <motion.div variants={item} className="hero-title-wrapper">
        <div className="hero-glow" />
        <h1 className="hero-title animated-gradient-text">
          Ace Your Frontend<br />Interviews
        </h1>
      </motion.div>

      {/* Typewriter Subtitle */}
      <motion.p variants={item} className="hero-subtitle">
        {displayText}
        <span className={`typing-cursor ${isComplete ? 'blink' : ''}`}>|</span>
      </motion.p>

      <motion.div variants={item} className="hero-actions">
        <Link href="/library" className="btn-primary">
          <Zap size={18} />
          <span>Dive In</span>
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
          <Link href="/library" className="progress-cta">Continue Learning <ArrowRight size={16} /></Link>
        </motion.div>
      )}

      <motion.div variants={item} className="section-header">
        <h2>Popular Topics</h2>
        <p>Jump straight to what you want to learn</p>
      </motion.div>

      <motion.div variants={item} className="popular-topics">
        <Link href="/library?tags=react" className="topic-tag">React</Link>
        <Link href="/library?subcategory=design-patterns" className="topic-tag">Design Patterns</Link>
        <Link href="/library?tags=promises" className="topic-tag">Promises</Link>
        <Link href="/library?subcategory=polyfills" className="topic-tag">Polyfills</Link>
        <Link href="/library?tags=closures" className="topic-tag">Closures</Link>
        <Link href="/library?tags=memoization" className="topic-tag">Memoization</Link>
        <Link href="/library?tags=async" className="topic-tag">Async Programming</Link>
        <Link href="/library?tags=performance" className="topic-tag">Performance</Link>
        <Link href="/library?tags=algorithms" className="topic-tag">Algorithms</Link>
        <Link href="/library?tags=dom" className="topic-tag">DOM Manipulation</Link>
      </motion.div>

      {/* Ad Unit */}
      <AdUnit style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <motion.div variants={item} className="section-header" style={{ marginTop: '4rem' }}>
        <h2>Browse by Category</h2>
        <p>Deep-dive into curated content tailored for frontend interviews and real-world development.</p>
      </motion.div>

      <motion.div variants={item} className="features-grid">
        <Link href="/library?category=js" className="feature-card glass-panel animated-card">
          <div className="feature-icon"><Code size={24} /></div>
          <div className="feature-content">
            <h3>JavaScript Deep Dives</h3>
            <p>Master the core language, from closures to event loops.</p>
          </div>
          <span className="feature-count">{categoryCounts['js'] || 0} articles</span>
        </Link>
        <Link href="/library?category=dsa" className="feature-card glass-panel animated-card">
          <div className="feature-icon"><Database size={24} /></div>
          <div className="feature-content">
            <h3>DSA for Frontend</h3>
            <p>Algorithms and data structures optimized for interviews.</p>
          </div>
          <span className="feature-count">{categoryCounts['dsa'] || 0} articles</span>
        </Link>
        <Link href="/library?category=machine-coding" className="feature-card glass-panel animated-card">
          <div className="feature-icon"><Terminal size={24} /></div>
          <div className="feature-content">
            <h3>Machine Coding</h3>
            <p>Real-world implementation challenges asked in interviews.</p>
          </div>
          <span className="feature-count">{categoryCounts['machine-coding'] || 0} articles</span>
        </Link>
        <Link href="/library?category=system-design" className="feature-card glass-panel animated-card">
          <div className="feature-icon"><Layout size={24} /></div>
          <div className="feature-content">
            <h3>System Design</h3>
            <p>Large-scale frontend architecture for senior interviews.</p>
          </div>
          <span className="feature-count">{categoryCounts['system-design'] || 0} articles</span>
        </Link>
        <Link href="/library?category=general" className="feature-card glass-panel animated-card">
          <div className="feature-icon"><Lightbulb size={24} /></div>
          <div className="feature-content">
            <h3>Browser & Patterns</h3>
            <p>Browser internals, rendering, and design patterns.</p>
          </div>
          <span className="feature-count">{categoryCounts['general'] || 0} articles</span>
        </Link>
        <Link href="/library?category=ai" className="feature-card glass-panel animated-card">
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
      /* Hero Section */
      .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 2rem 1rem;
        position: relative;
        overflow: hidden;
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
        position: relative;
        z-index: 1;
      }

      .hero-badge svg {
        color: var(--primary);
      }

      /* Title Wrapper with Glow */
      .hero-title-wrapper {
        position: relative;
        z-index: 1;
      }

      .hero-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120%;
        height: 150%;
        background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 40%, transparent 70%);
        filter: blur(40px);
        animation: pulse-glow 4s ease-in-out infinite;
        pointer-events: none;
      }

      @keyframes pulse-glow {
        0%, 100% {
          opacity: 0.6;
          transform: translate(-50%, -50%) scale(1);
        }
        50% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.1);
        }
      }

      /* Animated Gradient Text */
      .animated-gradient-text {
        background: linear-gradient(
          90deg,
          #8b5cf6 0%,
          #ec4899 25%,
          #06b6d4 50%,
          #ec4899 75%,
          #8b5cf6 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-shift 4s linear infinite;
      }

      @keyframes gradient-shift {
        0% {
          background-position: 0% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      .hero-title {
        font-size: 4rem;
        line-height: 1.1;
        font-weight: 800;
        margin-bottom: 1.5rem;
        letter-spacing: -0.03em;
        position: relative;
      }

      /* Typewriter Effect */
      .hero-subtitle {
        font-size: 1.25rem;
        color: var(--text-muted);
        max-width: 640px;
        margin-bottom: 2.5rem;
        line-height: 1.6;
        min-height: 3.2em;
        position: relative;
        z-index: 1;
      }

      .typing-cursor {
        display: inline-block;
        margin-left: 2px;
        color: var(--primary);
        font-weight: 400;
      }

      .typing-cursor.blink {
        animation: cursor-blink 1s step-end infinite;
      }

      @keyframes cursor-blink {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        margin-bottom: 3rem;
        position: relative;
        z-index: 1;
      }

      .hero-actions .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
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
        position: relative;
        z-index: 1;
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
        position: relative;
        z-index: 1;
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

      /* Popular Topics Tag Cloud */
      .popular-topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        max-width: 900px;
        margin: 0 auto 1rem;
        padding: 0 1rem;
        position: relative;
        z-index: 1;
      }

      .topic-tag {
        padding: 0.625rem 1.25rem;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 999px;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-main);
        transition: all 0.25s ease;
        cursor: pointer;
        text-decoration: none;
        white-space: nowrap;
      }

      .topic-tag:hover {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        width: 100%;
        position: relative;
        z-index: 1;
      }

      .feature-card {
        padding: 1.5rem;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: var(--surface-color);
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

        .hero-actions .btn-primary {
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
}
