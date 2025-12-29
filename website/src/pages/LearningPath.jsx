
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BookOpen, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  {
    title: 'Browser & Patterns',
    description: 'Understand browser internals, rendering, and design patterns.',
    link: '/library?category=general',
    filter: (item) => item.category === 'general',
  },
  {
    title: 'JavaScript Core',
    description: 'Deep dive into closures, prototypes, and ES6+ features.',
    link: '/library?category=js',
    filter: (item) => item.category === 'js',
  },
  {
    title: 'Asynchronous Mastery',
    description: 'Master Promises, Async/Await, and Event Loop.',
    link: '/library?q=promise',
    filter: (item) => item.tags?.includes('promises') || item.tags?.includes('async') || item.title.toLowerCase().includes('promise'),
  },
  {
    title: 'Polyfills & Internals',
    description: 'Re-implement core methods to truly understand how they work.',
    link: '/library?tag=polyfill',
    filter: (item) => item.tags?.includes('polyfill') || item.subcategory === 'polyfills',
  },
  {
    title: 'Machine Coding',
    description: 'Practice real-world implementation challenges asked in interviews.',
    link: '/library?category=machine-coding',
    filter: (item) => item.category === 'machine-coding',
  },
  {
    title: 'Data Structures & Algo',
    description: 'Optimize your problem solving skills for frontend interviews.',
    link: '/library?category=dsa',
    filter: (item) => item.category === 'dsa',
  },
  {
    title: 'System Design',
    description: 'Master large-scale frontend architecture for senior/staff interviews.',
    link: '/library?category=system-design',
    filter: (item) => item.category === 'system-design',
  },
  {
    title: 'AI Engineering',
    description: 'The new frontier. Learn to integrate LLMs and agents.',
    link: '/library?category=ai',
    filter: (item) => item.category === 'ai',
  }
];

const LearningPath = () => {
  const { isRead, getStats } = useProgress();
  const { isSignedIn } = useAuth();

  // Calculate stats for each step
  const stepsWithStats = useMemo(() => {
    return STEPS.map(step => {
      const articles = contentData.filter(step.filter);
      const completedArticles = articles.filter(article => isRead(article.id));
      return {
        ...step,
        total: articles.length,
        completed: completedArticles.length,
        percentage: articles.length > 0 ? Math.round((completedArticles.length / articles.length) * 100) : 0,
      };
    });
  }, [isRead]);

  // Overall progress
  const overallStats = getStats(contentData.length);
  const totalCompleted = stepsWithStats.reduce((sum, step) => sum + step.completed, 0);
  const totalArticles = stepsWithStats.reduce((sum, step) => sum + step.total, 0);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Learning Path</h1>
        <p style={{ color: 'var(--text-muted)' }}>A structured guide to master frontend development.</p>
      </div>

      {isSignedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overall-progress glass-panel"
        >
          <div className="overall-progress-header">
            <Trophy size={24} className="trophy-icon" />
            <div className="overall-progress-text">
              <span className="overall-progress-title">Overall Progress</span>
              <span className="overall-progress-subtitle">{overallStats.completed} of {contentData.length} articles completed</span>
            </div>
            <span className="overall-progress-percentage">{overallStats.percentage}%</span>
          </div>
          <div className="overall-progress-bar-container">
            <div className="overall-progress-bar" style={{ width: `${overallStats.percentage}%` }}></div>
          </div>
        </motion.div>
      )}

      <div className="timeline">
        {stepsWithStats.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="timeline-item"
          >
            <div className="timeline-marker">
              <div className={`marker-dot ${step.percentage === 100 ? 'completed' : step.completed > 0 ? 'in-progress' : ''}`}>
                {step.percentage === 100 ? (
                  <CheckCircle size={20} />
                ) : (
                  <span className="step-number">{index + 1}</span>
                )}
              </div>
              {index !== stepsWithStats.length - 1 && <div className="marker-line" />}
            </div>

            <Link to={step.link} className={`timeline-content glass-panel animated-card ${step.percentage === 100 ? 'completed' : ''}`}>
              <div className="timeline-header">
                <h3>{step.title}</h3>
                <span className="article-count">
                  <BookOpen size={14} />
                  {step.total} articles
                </span>
              </div>
              <p>{step.description}</p>
              {isSignedIn && step.total > 0 && (
                <div className="step-progress">
                  <div className="step-progress-bar-container">
                    <div
                      className="step-progress-bar"
                      style={{ width: `${step.percentage}%` }}
                    ></div>
                  </div>
                  <span className="step-progress-text">
                    {step.completed}/{step.total} completed
                  </span>
                </div>
              )}
              <span className="explore-link">
                {step.percentage === 100 ? 'Review Module' : step.completed > 0 ? 'Continue Learning' : 'Start Module'} &rarr;
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>{`
        .overall-progress {
          max-width: 700px;
          margin: 0 auto 3rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .overall-progress-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .trophy-icon {
          color: #fbbf24;
        }

        .overall-progress-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .overall-progress-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .overall-progress-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .overall-progress-percentage {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary);
        }

        .overall-progress-bar-container {
          height: 8px;
          background: var(--surface-hover);
          border-radius: 4px;
          overflow: hidden;
        }

        .overall-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #ec4899);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .timeline {
          max-width: 700px;
          margin: 0 auto;
        }

        .timeline-item {
          display: flex;
          gap: 1.5rem;
          padding-bottom: 2rem;
        }

        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .marker-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface-hover);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .marker-dot.in-progress {
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .marker-dot.completed {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .step-number {
          font-weight: 700;
          color: var(--text-muted);
        }

        .marker-dot.in-progress .step-number {
          color: var(--primary);
        }

        .marker-line {
          position: absolute;
          top: 40px;
          bottom: -12px;
          width: 2px;
          background: var(--border-color);
        }

        .timeline-content {
          flex: 1;
          padding: 1.25rem 1.5rem;
          transition: all 0.2s ease;
          display: block;
        }

        .timeline-content:hover {
          transform: translateX(8px);
          background: var(--card-hover-bg);
          border-color: var(--primary);
        }

        .timeline-content.completed {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .timeline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }

        .timeline-content h3 {
          font-size: 1.15rem;
          color: var(--text-main);
          margin: 0;
        }

        .article-count {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--surface-hover);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          white-space: nowrap;
        }

        .timeline-content p {
          color: var(--text-muted);
          margin-bottom: 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .step-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .step-progress-bar-container {
          flex: 1;
          height: 6px;
          background: var(--surface-hover);
          border-radius: 3px;
          overflow: hidden;
        }

        .step-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #ec4899);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .step-progress-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .explore-link {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .overall-progress {
            margin-bottom: 2rem;
            padding: 1rem;
          }

          .overall-progress-header {
            flex-wrap: wrap;
          }

          .overall-progress-percentage {
            font-size: 1.5rem;
          }

          .timeline-item {
            gap: 1rem;
            padding-bottom: 1.5rem;
          }

          .marker-dot {
            width: 36px;
            height: 36px;
          }

          .timeline-content {
            padding: 1rem;
          }

          .timeline-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .timeline-content h3 {
            font-size: 1.05rem;
          }

          .timeline-content p {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LearningPath;
