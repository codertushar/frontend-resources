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
          padding: 1.5rem;
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
          opacity: 0.7;
        }

        .support-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .header-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
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
          font-size: 1.05rem;
          font-weight: 700;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .support-description {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 1.25rem 0;
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
          gap: 0.75rem;
        }

        .support-action {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1rem 1.125rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .support-action::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-brand-subtle);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .support-action:hover::before {
          opacity: 1;
        }

        .support-action:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px rgba(139, 92, 246, 0.15),
            0 4px 12px rgba(236, 72, 153, 0.1);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .action-icon {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .coffee-icon {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1));
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .coffee-icon :global(svg) {
          color: var(--primary);
        }

        .support-action.coffee:hover .coffee-icon {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15));
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .feedback-icon {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(14, 165, 233, 0.1));
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .feedback-icon :global(svg) {
          color: var(--accent-cyan);
        }

        .support-action.feedback:hover .feedback-icon {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 165, 233, 0.15));
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .action-text {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          flex: 1;
        }

        .action-title {
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--text-main);
          transition: color 0.2s ease;
        }

        .support-action:hover .action-title {
          color: var(--primary);
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
            padding: 0.875rem 1rem;
          }

          .action-icon {
            width: 34px;
            height: 34px;
          }

          .action-title {
            font-size: 0.9rem;
          }

          .action-subtitle {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </motion.div>
  );
};
