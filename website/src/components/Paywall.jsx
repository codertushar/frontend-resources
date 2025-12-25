import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';
import { useSubscription } from '../context/SubscriptionContext';

const Paywall = ({ articleTitle }) => {
  const { isSignedIn } = useSubscription();

  return (
    <div className="paywall-container">
      {/* Gradient overlay that creates the blur/fade effect */}
      <div className="paywall-gradient" />

      {/* Paywall content */}
      <div className="paywall-content glass-panel">
        <div className="paywall-icon">
          <Lock size={32} />
        </div>

        <h3 className="paywall-title">
          <Sparkles size={20} className="sparkle-icon" />
          Premium Content
        </h3>

        <p className="paywall-description">
          This article is part of our premium collection. Get lifetime access to all {' '}
          premium articles with a one-time payment.
        </p>

        <div className="paywall-features">
          <div className="feature">
            <span className="check">✓</span>
            <span>System Design guides</span>
          </div>
          <div className="feature">
            <span className="check">✓</span>
            <span>Advanced DSA patterns</span>
          </div>
          <div className="feature">
            <span className="check">✓</span>
            <span>Machine Coding solutions</span>
          </div>
          <div className="feature">
            <span className="check">✓</span>
            <span>Lifetime access</span>
          </div>
        </div>

        <div className="paywall-price">
          <span className="price-amount">₹2,000</span>
          <span className="price-note">one-time</span>
        </div>

        {!isSignedIn ? (
          <div className="paywall-actions">
            <SignInButton mode="modal">
              <button className="btn-primary">
                Sign In to Unlock
                <ArrowRight size={18} />
              </button>
            </SignInButton>
            <p className="signin-note">Already purchased? Sign in to access.</p>
          </div>
        ) : (
          <Link to="/pricing" className="btn-primary">
            Unlock Premium Access
            <ArrowRight size={18} />
          </Link>
        )}
      </div>

      <style>{`
        .paywall-container {
          position: relative;
          margin-top: -200px;
          padding-top: 200px;
        }

        .paywall-gradient {
          position: absolute;
          top: 0;
          left: -3rem;
          right: -3rem;
          height: 200px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            var(--bg-primary, #0f0f1a) 100%
          );
          pointer-events: none;
        }

        .paywall-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2.5rem;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          max-width: 500px;
          margin: 0 auto;
        }

        .paywall-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .paywall-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .sparkle-icon {
          color: var(--primary);
        }

        .paywall-description {
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .paywall-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .check {
          color: var(--primary);
          font-weight: bold;
        }

        .paywall-price {
          margin-bottom: 1.5rem;
        }

        .price-amount {
          font-size: 2rem;
          font-weight: 700;
          background: var(--heading-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .price-note {
          display: block;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .paywall-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          color: white;
          padding: 0.875rem 1.75rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          max-width: 280px;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .signin-note {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .paywall-container {
            margin-top: -150px;
            padding-top: 150px;
          }

          .paywall-gradient {
            left: -1.5rem;
            right: -1.5rem;
            height: 150px;
          }

          .paywall-content {
            padding: 1.5rem;
          }

          .paywall-features {
            grid-template-columns: 1fr;
          }

          .paywall-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Paywall;
