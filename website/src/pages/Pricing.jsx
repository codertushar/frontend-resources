import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, BookOpen, Code, Sparkles, Shield } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useSubscription } from '../context/SubscriptionContext';
import contentData from '../data/content.json';

const Pricing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  let user, isSignedIn, isLoaded;
  try {
    const clerkUser = useUser();
    user = clerkUser.user;
    isSignedIn = clerkUser.isSignedIn;
    isLoaded = clerkUser.isLoaded;
  } catch {
    user = null;
    isSignedIn = false;
    isLoaded = true;
  }

  const { isPremium, initiatePayment, refreshSubscription } = useSubscription();

  // Calculate stats
  const totalArticles = contentData.length;
  const premiumArticles = contentData.filter(a => a.premium).length;
  const freeArticles = totalArticles - premiumArticles;

  const handlePurchase = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      await initiatePayment();
      setSuccess(true);
      // Refresh subscription status after successful payment
      // Wait a bit for webhook to process
      setTimeout(async () => {
        await refreshSubscription();
      }, 2000);
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    { icon: BookOpen, text: `Access to all ${premiumArticles}+ premium articles` },
    { icon: Code, text: 'System Design & Machine Coding guides' },
    { icon: Zap, text: 'Advanced DSA patterns & solutions' },
    { icon: Sparkles, text: 'AI/ML engineering resources' },
    { icon: Shield, text: 'Lifetime access, one-time payment' },
    { icon: Star, text: 'Future content updates included' },
  ];

  if (success || (isLoaded && isPremium())) {
    return (
      <div className="container page-container">
        <div className="success-container glass-panel">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="success-icon"
          >
            <Check size={48} />
          </motion.div>
          <h1 className="heading-gradient">You're All Set!</h1>
          <p>You now have lifetime access to all premium content.</p>
          <a href="/library" className="btn-primary">
            Start Learning
          </a>
        </div>

        <style>{`
          .success-container {
            max-width: 500px;
            margin: 4rem auto;
            text-align: center;
            padding: 3rem;
          }

          .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            color: white;
          }

          .success-container h1 {
            margin-bottom: 1rem;
          }

          .success-container p {
            color: var(--text-muted);
            margin-bottom: 2rem;
          }

          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="pricing-header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="heading-gradient"
        >
          Unlock Premium Access
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pricing-subtitle"
        >
          One-time payment. Lifetime access. No subscriptions.
        </motion.p>
      </div>

      <div className="pricing-content">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stats-bar glass-panel"
        >
          <div className="stat">
            <span className="stat-value">{freeArticles}</span>
            <span className="stat-label">Free Articles</span>
          </div>
          <div className="stat-divider" />
          <div className="stat premium">
            <span className="stat-value">{premiumArticles}</span>
            <span className="stat-label">Premium Articles</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">{totalArticles}</span>
            <span className="stat-label">Total Resources</span>
          </div>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="pricing-card glass-panel"
        >
          <div className="card-badge">Best Value</div>

          <div className="price-section">
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">2,000</span>
            </div>
            <span className="price-note">One-time payment</span>
          </div>

          <div className="features-list">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="feature-item"
              >
                <feature.icon size={20} className="feature-icon" />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          {!isLoaded ? (
            <div className="loading-btn">Loading...</div>
          ) : !isSignedIn ? (
            <SignInButton mode="modal">
              <button className="purchase-btn">
                Sign In to Purchase
              </button>
            </SignInButton>
          ) : (
            <button
              className="purchase-btn"
              onClick={handlePurchase}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Get Lifetime Access
                </>
              )}
            </button>
          )}

          <p className="secure-note">
            <Shield size={14} />
            Secure payment via Razorpay
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="faq-section"
        >
          <h2>Frequently Asked Questions</h2>

          <div className="faq-grid">
            <div className="faq-item glass-panel">
              <h3>Is this a subscription?</h3>
              <p>No! This is a one-time payment for lifetime access. Pay once, learn forever.</p>
            </div>

            <div className="faq-item glass-panel">
              <h3>What payment methods are accepted?</h3>
              <p>We accept UPI, credit/debit cards, net banking, and wallets through Razorpay.</p>
            </div>

            <div className="faq-item glass-panel">
              <h3>Do I get future updates?</h3>
              <p>Yes! All future premium content is included in your lifetime access.</p>
            </div>

            <div className="faq-item glass-panel">
              <h3>Can I get a refund?</h3>
              <p>We offer a 7-day refund policy if you're not satisfied with the content.</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .page-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .pricing-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .pricing-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
        }

        .pricing-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .stat.premium .stat-value {
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        .pricing-card {
          padding: 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .card-badge {
          position: absolute;
          top: 1rem;
          right: -2rem;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          color: white;
          padding: 0.25rem 3rem;
          font-size: 0.75rem;
          font-weight: 600;
          transform: rotate(45deg);
          text-transform: uppercase;
        }

        .price-section {
          margin-bottom: 2rem;
        }

        .price {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 0.25rem;
        }

        .currency {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-main);
          margin-top: 0.5rem;
        }

        .amount {
          font-size: 4rem;
          font-weight: 800;
          background: var(--heading-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .price-note {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .features-list {
          text-align: left;
          margin-bottom: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .feature-item:last-child {
          border-bottom: none;
        }

        .feature-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .purchase-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .purchase-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4);
        }

        .purchase-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-btn {
          width: 100%;
          padding: 1rem 2rem;
          background: var(--surface-hover);
          border-radius: 12px;
          color: var(--text-muted);
          text-align: center;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .secure-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .faq-section {
          margin-top: 4rem;
        }

        .faq-section h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: var(--text-main);
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .faq-item {
          padding: 1.5rem;
        }

        .faq-item h3 {
          color: var(--text-main);
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .faq-item p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .pricing-header h1 {
            font-size: 2rem;
          }

          .stats-bar {
            flex-direction: column;
            gap: 1rem;
          }

          .stat-divider {
            width: 40px;
            height: 1px;
          }

          .pricing-card {
            padding: 1.5rem;
          }

          .amount {
            font-size: 3rem;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Pricing;
