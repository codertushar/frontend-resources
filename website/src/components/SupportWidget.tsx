'use client';

import { Coffee, MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const SupportWidget = (): JSX.Element => {
  return (
    <motion.div
      className="support-widget glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="support-header">
        <Heart size={20} className="heart-icon" />
        <h3>Enjoying This Article?</h3>
      </div>

      <p className="support-description">
        All content is <strong>completely free</strong>. Your support helps keep it that way!
      </p>

      <div className="support-actions">
        <Link href="/donate" className="support-action coffee">
          <Coffee size={20} />
          <div className="action-text">
            <span className="action-title">Buy Me a Coffee</span>
            <span className="action-subtitle">Support this work</span>
          </div>
        </Link>

        <Link href="/contact" className="support-action feedback">
          <MessageCircle size={20} />
          <div className="action-text">
            <span className="action-title">Send Feedback</span>
            <span className="action-subtitle">Share your thoughts</span>
          </div>
        </Link>
      </div>

      <style jsx>{`
        .support-widget {
          padding: 1.25rem;
          border: 1px solid var(--border-color);
          background: var(--surface-color);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .support-widget:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
        }

        .support-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .heart-icon {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .support-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0;
        }

        .support-description {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0 0 1rem 0;
        }

        .support-description strong {
          color: var(--primary);
          font-weight: 600;
        }

        .support-actions {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .support-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .support-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .support-action.coffee {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05));
        }

        .support-action.coffee:hover {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.08));
        }

        .support-action.coffee :global(svg) {
          color: var(--primary);
        }

        .support-action.feedback :global(svg) {
          color: #06b6d4;
        }

        .support-action.feedback:hover {
          border-color: #06b6d4;
          background: rgba(6, 182, 212, 0.1);
        }

        .action-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .action-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .action-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .support-widget {
            padding: 1.25rem;
            margin-top: 1.5rem;
          }

          .support-header h3 {
            font-size: 1rem;
          }

          .support-description {
            font-size: 0.85rem;
          }

          .support-action {
            padding: 0.875rem;
          }

          .action-title {
            font-size: 0.9rem;
          }

          .action-subtitle {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
