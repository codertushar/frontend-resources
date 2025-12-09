
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    title: 'Foundations & Concepts',
    description: 'Understand the building blocks of modern implementations.',
    link: '/library?category=general',
    status: 'start'
  },
  {
    title: 'JavaScript Core',
    description: 'Deep dive into closures, prototypes, and ES6+ features.',
    link: '/library?category=js',
    status: 'upcoming'
  },
  {
    title: 'Asynchronous Mastery',
    description: 'Master Promises, Async/Await, and Event Loop.',
    link: '/library?q=promise',
    status: 'upcoming'
  },
  {
    title: 'Polyfills & Internals',
    description: 'Re-implement core methods to truly understand how they work.',
    link: '/library?q=polyfill',
    status: 'upcoming'
  },
  {
    title: 'Data Structures & Algo',
    description: 'Optimize your problem solving skills for frontend interviews.',
    link: '/library?category=dsa',
    status: 'upcoming'
  },
  {
    title: 'System Design',
    description: 'Master large-scale frontend architecture for senior/staff interviews.',
    link: '/library?category=system-design',
    status: 'upcoming'
  },
  {
    title: 'AI Engineering',
    description: 'The new frontier. Learn to integrate LLMs and agents.',
    link: '/library?category=ai',
    status: 'upcoming'
  }
];

const LearningPath = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Learning Path</h1>
        <p style={{ color: 'var(--text-muted)' }}>A structured guide to consuming this repository.</p>
      </div>

      <div className="timeline">
        {STEPS.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="timeline-item"
          >
            <div className="timeline-marker">
              <div className="marker-dot">
                <span className="step-number">{index + 1}</span>
              </div>
              {index !== STEPS.length - 1 && <div className="marker-line" />}
            </div>

            <Link to={step.link} className="timeline-content glass-panel">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="explore-link">Explore Module &rarr;</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>{`
        .timeline {
          max-width: 700px;
          margin: 0 auto;
        }

        .timeline-item {
          display: flex;
          gap: 2rem;
          padding-bottom: 3rem;
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
          border: 2px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 15px var(--primary-glow);
        }

        .step-number {
          font-weight: 700;
          color: var(--primary);
        }

        .marker-line {
          position: absolute;
          top: 40px;
          bottom: -20px; /* Connect to next */
          width: 2px;
          background: linear-gradient(to bottom, var(--primary), rgba(139, 92, 246, 0.1));
        }

        .timeline-content {
          flex: 1;
          padding: 1.5rem;
          transition: transform 0.2s;
          display: block;
        }

        .timeline-content:hover {
          transform: translateX(10px);
          background: var(--card-hover-bg);
        }

        .timeline-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .timeline-content p {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .explore-link {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default LearningPath;
