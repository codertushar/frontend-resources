import { Link } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';

const Paywall = ({ articleTitle }) => {
  const { signInWithGoogle } = useAuth();
  const { isSignedIn } = useSubscription();

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="paywall-container">
      {/* Multi-layer gradient overlay for premium blur effect */}
      <div className="paywall-blur-layer" />
      <div className="paywall-gradient" />

      {/* Decorative elements */}
      <div className="paywall-glow" />

      {/* Paywall content */}
      <div className="paywall-content">
        <div className="paywall-badge">
          <Crown size={14} />
          <span>Premium</span>
        </div>

        <div className="paywall-icon">
          <Lock size={28} />
          <div className="icon-ring" />
        </div>

        <h3 className="paywall-title">
          <Sparkles size={18} className="sparkle-icon" />
          Unlock This Content
        </h3>

        <p className="paywall-description">
          Get lifetime access to all premium articles, system design guides, and advanced coding patterns.
        </p>

        <div className="paywall-features">
          <div className="feature">
            <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>System Design guides</span>
          </div>
          <div className="feature">
            <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Advanced DSA patterns</span>
          </div>
          <div className="feature">
            <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Machine Coding solutions</span>
          </div>
          <div className="feature">
            <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Lifetime access</span>
          </div>
        </div>

        <div className="paywall-price">
          <span className="price-amount">₹2,000</span>
          <span className="price-note">one-time payment</span>
        </div>

        {!isSignedIn ? (
          <div className="paywall-actions">
            <button className="btn-primary" onClick={handleSignIn}>
              <span>Sign In to Unlock</span>
              <ArrowRight size={18} />
            </button>
            <p className="signin-note">Already purchased? Sign in to access.</p>
          </div>
        ) : (
          <Link to="/pricing" className="btn-primary">
            <span>Unlock Premium Access</span>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>

      <style>{`
        .paywall-container {
          position: relative;
          margin-top: -250px;
          padding-top: 250px;
          width: 100%;
        }

        .paywall-blur-layer {
          position: absolute;
          top: 0;
          left: -3rem;
          right: -3rem;
          height: 120px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          mask-image: linear-gradient(to bottom, transparent, black 50%, black);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 50%, black);
          pointer-events: none;
          z-index: 1;
        }

        /* Dark theme gradient */
        .paywall-gradient {
          position: absolute;
          top: 0;
          left: -3rem;
          right: -3rem;
          height: 250px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(3, 7, 18, 0.4) 20%,
            rgba(3, 7, 18, 0.7) 40%,
            rgba(3, 7, 18, 0.9) 60%,
            var(--bg-color) 80%
          );
          pointer-events: none;
          z-index: 2;
        }

        /* Light theme gradient override */
        :root.light .paywall-gradient {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(248, 250, 252, 0.5) 20%,
            rgba(248, 250, 252, 0.8) 40%,
            rgba(248, 250, 252, 0.95) 60%,
            var(--bg-color) 80%
          );
        }

        .paywall-glow {
          position: absolute;
          top: 180px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 250px;
          background: radial-gradient(
            ellipse at center,
            rgba(139, 92, 246, 0.12) 0%,
            rgba(139, 92, 246, 0.04) 40%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 3;
        }

        :root.light .paywall-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(124, 58, 237, 0.08) 0%,
            rgba(124, 58, 237, 0.02) 40%,
            transparent 70%
          );
        }

        .paywall-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2.5rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          width: 100%;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 20px 50px -12px rgba(0, 0, 0, 0.25);
        }

        :root.light .paywall-content {
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.03),
            0 20px 50px -12px rgba(0, 0, 0, 0.1),
            0 0 80px -20px rgba(124, 58, 237, 0.15);
        }

        .paywall-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }

        :root.light .paywall-badge {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(139, 92, 246, 0.1));
          border-color: rgba(124, 58, 237, 0.25);
          color: #7c3aed;
        }

        .paywall-icon {
          position: relative;
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          box-shadow:
            0 8px 24px -4px rgba(139, 92, 246, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        :root.light .paywall-icon {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          box-shadow:
            0 8px 24px -4px rgba(124, 58, 237, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }

        .icon-ring {
          position: absolute;
          inset: -4px;
          border-radius: 24px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          animation: pulse-ring 2s ease-in-out infinite;
        }

        :root.light .icon-ring {
          border-color: rgba(124, 58, 237, 0.25);
        }

        @keyframes pulse-ring {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.05);
          }
        }

        .paywall-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-main);
        }

        .sparkle-icon {
          color: #a78bfa;
        }

        :root.light .sparkle-icon {
          color: #7c3aed;
        }

        .paywall-description {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.75rem;
          font-size: 0.95rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .paywall-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.875rem;
          margin-bottom: 1.75rem;
          text-align: left;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .check-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: rgba(139, 92, 246, 0.15);
          border-radius: 6px;
          color: #a78bfa;
          flex-shrink: 0;
        }

        :root.light .check-icon {
          background: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
        }

        .paywall-price {
          margin-bottom: 1.75rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.1);
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }

        :root.light .paywall-price {
          background: rgba(124, 58, 237, 0.04);
          border-color: rgba(124, 58, 237, 0.12);
        }

        .price-amount {
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #c4b5fd);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        :root.light .price-amount {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .price-note {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .paywall-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.875rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          color: white !important;
          padding: 1rem 2rem;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          max-width: 300px;
          box-shadow:
            0 4px 14px -2px rgba(139, 92, 246, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }

        :root.light .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          box-shadow:
            0 4px 14px -2px rgba(124, 58, 237, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 28px -4px rgba(139, 92, 246, 0.5),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }

        :root.light .btn-primary:hover {
          box-shadow:
            0 12px 28px -4px rgba(124, 58, 237, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
        }

        .btn-primary:active {
          transform: translateY(-1px);
        }

        .signin-note {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .paywall-container {
            margin-top: -180px;
            padding-top: 180px;
          }

          .paywall-blur-layer {
            left: -1.5rem;
            right: -1.5rem;
            height: 80px;
          }

          .paywall-gradient {
            left: -1.5rem;
            right: -1.5rem;
            height: 180px;
          }

          .paywall-glow {
            top: 120px;
            width: 280px;
            height: 140px;
          }

          .paywall-content {
            padding: 1.75rem;
            border-radius: 20px;
          }

          .paywall-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
          }

          .paywall-features {
            grid-template-columns: 1fr;
            gap: 0.625rem;
          }

          .paywall-title {
            font-size: 1.25rem;
          }

          .price-amount {
            font-size: 1.875rem;
          }

          .btn-primary {
            padding: 0.875rem 1.5rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Paywall;
