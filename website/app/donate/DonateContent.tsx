'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';

export const DonateContent = (): JSX.Element => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { isSignedIn, isLoaded, signInWithGoogle } = useAuth();
  const { initiateDonation } = useSubscription();

  const suggestedAmounts = [100, 200, 500, 1000]; // in INR

  const handleDonate = async (amountInRupees: number): Promise<void> => {
    setError(null);
    setIsProcessing(true);

    try {
      // Convert rupees to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = amountInRupees * 100;
      await initiateDonation(amountInPaise);
      setSuccess(true);
      setCustomAmount('');

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      if (err instanceof Error && err.message !== 'Payment cancelled') {
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomDonate = (): void => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount < 10) {
      setError('Please enter an amount of at least ₹10');
      return;
    }
    handleDonate(amount);
  };

  const handleSignIn = async (): Promise<void> => {
    const { error: signInError } = await signInWithGoogle();
    if (signInError) {
      setError('Sign in failed. Please try again.');
    }
  };

  return (
    <div className="donate-page">
      <div className="donate-container">
        <motion.div
          className="donate-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="icon-wrapper">
            <Coffee size={48} className="coffee-icon" />
            <Sparkles size={24} className="sparkle-icon" />
          </div>
          <h1>Buy Me a Coffee ☕</h1>
          <p className="subtitle">
            All content on CrackFrontend is <strong>completely free</strong>. If you find it helpful, consider supporting us with a voluntary donation!
          </p>
        </motion.div>

        <motion.div
          className="why-support"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2>Why Support Us?</h2>
          <div className="support-reasons">
            <div className="reason">
              <Check size={20} />
              <span>Help maintain and improve the platform</span>
            </div>
            <div className="reason">
              <Check size={20} />
              <span>Support creation of new content</span>
            </div>
            <div className="reason">
              <Check size={20} />
              <span>Keep the platform ad-free and accessible</span>
            </div>
            <div className="reason">
              <Check size={20} />
              <span>Encourage open education for everyone</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="donate-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!isLoaded ? (
            <div className="loading">Loading...</div>
          ) : !isSignedIn ? (
            <div className="signin-prompt">
              <Heart size={32} className="heart-icon" />
              <p>Sign in to make a donation</p>
              <button onClick={handleSignIn} className="btn-signin">
                Sign in with Google
              </button>
            </div>
          ) : success ? (
            <div className="success-message">
              <div className="success-icon">
                <Check size={48} />
              </div>
              <h3>Thank you for your support! ❤️</h3>
              <p>Your generosity helps keep this platform free for everyone.</p>
              <button onClick={() => setSuccess(false)} className="btn-secondary">
                Donate Again
              </button>
            </div>
          ) : (
            <>
              <div className="suggested-amounts">
                <h3>Choose an Amount</h3>
                <div className="amount-buttons">
                  {suggestedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleDonate(amount)}
                      disabled={isProcessing}
                      className="btn-amount"
                    >
                      <Coffee size={20} />
                      <span>₹{amount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="custom-amount">
                <h3>Or Enter Custom Amount</h3>
                <div className="custom-input-group">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    min="10"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (min ₹10)"
                    disabled={isProcessing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomDonate();
                      }
                    }}
                  />
                  <button
                    onClick={handleCustomDonate}
                    disabled={isProcessing || !customAmount}
                    className="btn-donate"
                  >
                    {isProcessing ? 'Processing...' : 'Donate'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="payment-note">
                <p>💳 Secure payment powered by Razorpay</p>
                <p>🔒 All donations are voluntary and non-refundable</p>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .donate-page {
          min-height: calc(100vh - 120px);
          padding: 3rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .donate-container {
          max-width: 650px;
          width: 100%;
        }

        .donate-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .icon-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .coffee-icon {
          color: var(--primary);
          filter: drop-shadow(0 8px 16px rgba(139, 92, 246, 0.4));
        }

        .sparkle-icon {
          position: absolute;
          top: -12px;
          right: -12px;
          color: #fbbf24;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2) rotate(180deg);
          }
        }

        .donate-header h1 {
          font-size: 2.75rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 1.125rem;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 550px;
          margin: 0 auto;
        }

        .subtitle strong {
          background: linear-gradient(135deg, var(--primary), var(--accent-pink));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .why-support {
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .why-support h2 {
          font-size: 1.375rem;
          font-weight: 700;
          margin-bottom: 1.75rem;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .support-reasons {
          display: flex;
          flex-direction: column;
          gap: 1.125rem;
        }

        .reason {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          color: var(--text-muted);
          font-size: 0.9375rem;
        }

        .reason :global(svg) {
          color: var(--success);
          flex-shrink: 0;
          filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3));
        }

        .donate-content {
          padding: 2.5rem;
        }

        .signin-prompt {
          text-align: center;
          padding: 2.5rem 0;
        }

        .heart-icon {
          color: #ef4444;
          margin-bottom: 1.25rem;
          animation: heartbeat 1.5s ease-in-out infinite;
          filter: drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3));
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .signin-prompt p {
          font-size: 1.125rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .btn-signin {
          background: var(--gradient-brand);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 12px;
          font-size: 1.0625rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .btn-signin:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4);
        }

        .success-message {
          text-align: center;
          padding: 2.5rem 0;
        }

        .success-icon {
          width: 88px;
          height: 88px;
          background: linear-gradient(135deg, var(--success), #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.75rem;
          color: white;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .success-message h3 {
          font-size: 1.625rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .success-message p {
          color: var(--text-muted);
          margin-bottom: 2rem;
          font-size: 1.0625rem;
        }

        .btn-secondary {
          background: var(--surface-hover);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          padding: 0.875rem 1.75rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: var(--border-color);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .suggested-amounts {
          margin-bottom: 2.25rem;
        }

        .suggested-amounts h3 {
          font-size: 1.1875rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.125rem;
        }

        .btn-amount {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          background: var(--surface-hover);
          border: 2px solid var(--border-color);
          padding: 1.25rem 1rem;
          border-radius: 12px;
          font-size: 1.1875rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .btn-amount::before {
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

        .btn-amount:hover:not(:disabled)::before {
          opacity: 1;
        }

        .btn-amount:hover:not(:disabled) {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.25);
        }

        .btn-amount :global(svg) {
          position: relative;
          z-index: 1;
          color: var(--primary);
        }

        .btn-amount span {
          position: relative;
          z-index: 1;
        }

        .btn-amount:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .custom-amount {
          margin-bottom: 2rem;
        }

        .custom-amount h3 {
          font-size: 1.1875rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          background: var(--gradient-brand);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .custom-input-group {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: var(--surface-hover);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          transition: all 0.3s ease;
        }

        .custom-input-group:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .currency-symbol {
          font-size: 1.3125rem;
          font-weight: 700;
          color: var(--primary);
        }

        .custom-input-group input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1.1875rem;
          font-weight: 600;
          color: var(--text-main);
          padding: 0.5rem;
        }

        .custom-input-group input::placeholder {
          color: var(--text-muted);
          font-weight: 500;
        }

        .btn-donate {
          background: var(--gradient-brand);
          color: white;
          border: none;
          padding: 0.875rem 1.75rem;
          border-radius: 10px;
          font-size: 1.0625rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .btn-donate:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
        }

        .btn-donate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 1.125rem;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 1.25rem;
          font-weight: 500;
        }

        .payment-note {
          text-align: center;
          font-size: 0.9375rem;
          color: var(--text-muted);
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .payment-note p {
          margin: 0.625rem 0;
        }

        .loading {
          text-align: center;
          padding: 2.5rem;
          color: var(--text-muted);
          font-size: 1.0625rem;
        }

        @media (max-width: 640px) {
          .donate-page {
            padding: 2rem 1rem;
          }

          .donate-header h1 {
            font-size: 2.25rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .amount-buttons {
            grid-template-columns: repeat(2, 1fr);
          }

          .donate-content {
            padding: 2rem;
          }

          .why-support {
            padding: 2rem;
          }

          .btn-amount {
            padding: 1.125rem 0.875rem;
            font-size: 1.0625rem;
          }

          .custom-input-group {
            padding: 0.625rem 1rem;
          }

          .custom-input-group input {
            font-size: 1.0625rem;
          }
        }
      `}</style>
    </div>
  );
};
