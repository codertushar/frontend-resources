'use client';

import { Coffee, MessageCircle, Heart, Sparkles } from 'lucide-react';
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
        <div className="header-icon-wrapper">
          <Heart size={22} className="heart-icon" />
          <Sparkles size={12} className="sparkle-icon" />
        </div>
        <h3>Loved this article?</h3>
      </div>

      <p className="support-description">
        All content is <strong>100% free</strong>. Your support keeps it that way! ✨
      </p>

      <div className="support-actions">
        <Link href="/donate" className="support-action coffee">
          <div className="action-icon coffee-icon">
            <Coffee size={18} />
          </div>
          <div className="action-text">
            <span className="action-title">Buy Me a Coffee</span>
            <span className="action-subtitle">Support this work</span>
          </div>
        </Link>

        <Link href="/contact" className="support-action feedback">
          <div className="action-icon feedback-icon">
            <MessageCircle size={18} />
          </div>
          <div className="action-text">
            <span className="action-title">Send Feedback</span>
            <span className="action-subtitle">Share your thoughts</span>
          </div>
        </Link>
      </div>

      <style jsx>{`
        .support-widget {
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .support-widget::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-brand);
          opacity: 0.8;
        }

        .support-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .header-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .heart-icon {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        .sparkle-icon {
          position: absolute;
          top: -4px;
          right: -4px;
          color: #fbbf24;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.15) rotate(180deg);
          }
        }

        .support-header h3 {
          font-size: 0.95rem;
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
          background: linear-gradient(135deg, var(--primary), var(--accent-pink));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .support-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .support-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .support-action:hover {
          background: var(--surface-hover);
          border-color: var(--primary);
          transform: translateX(2px);
        }

        .action-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .coffee-icon {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .coffee-icon :global(svg) {
          color: var(--primary);
        }

        .support-action.coffee:hover .coffee-icon {
          background: rgba(139, 92, 246, 0.15);
        }

        .feedback-icon {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .feedback-icon :global(svg) {
          color: var(--accent-cyan);
        }

        .support-action.feedback:hover .feedback-icon {
          background: rgba(6, 182, 212, 0.15);
        }

        .action-text {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          flex: 1;
        }

        .action-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          transition: color 0.2s ease;
        }

        .support-action:hover .action-title {
          color: var(--primary);
        }

        .action-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .support-widget {
            padding: 1.25rem;
            margin-top: 1.5rem;
          }

          .support-header h3 {
            font-size: 0.9rem;
          }

          .support-description {
            font-size: 0.8rem;
          }

          .support-action {
            padding: 0.75rem 0.875rem;
          }

          .action-icon {
            width: 30px;
            height: 30px;
          }

          .action-title {
            font-size: 0.8rem;
          }

          .action-subtitle {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
