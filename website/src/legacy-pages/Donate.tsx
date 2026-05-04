import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';

const Donate = (): JSX.Element => {
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

      <style>{`
        .donate-page {
          min-height: calc(100vh - 120px);
          padding: 2rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .donate-container {
          max-width: 600px;
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
          color: var(--accent-color);
          filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3));
        }

        .sparkle-icon {
          position: absolute;
          top: -10px;
          right: -10px;
          color: #fbbf24;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2) rotate(180deg);
          }
        }

        .donate-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--accent-color), #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .subtitle strong {
          color: var(--accent-color);
          font-weight: 600;
        }

        .why-support {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .why-support h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .support-reasons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reason {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .reason svg {
          color: var(--accent-color);
          flex-shrink: 0;
        }

        .donate-content {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
        }

        .signin-prompt {
          text-align: center;
          padding: 2rem 0;
        }

        .heart-icon {
          color: #ef4444;
          margin-bottom: 1rem;
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

        .signin-prompt p {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .btn-signin {
          background: linear-gradient(135deg, var(--accent-color), #a78bfa);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-signin:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
        }

        .success-message {
          text-align: center;
          padding: 2rem 0;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .success-message h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }

        .success-message p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .btn-secondary {
          background: var(--surface-hover);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: var(--border-color);
        }

        .suggested-amounts {
          margin-bottom: 2rem;
        }

        .suggested-amounts h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .btn-amount {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--surface-hover);
          border: 2px solid var(--border-color);
          padding: 1rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-amount:hover:not(:disabled) {
          border-color: var(--accent-color);
          background: rgba(139, 92, 246, 0.1);
          transform: translateY(-2px);
        }

        .btn-amount:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .custom-amount {
          margin-bottom: 1.5rem;
        }

        .custom-amount h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .custom-input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--surface-hover);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem 1rem;
          transition: border-color 0.2s;
        }

        .custom-input-group:focus-within {
          border-color: var(--accent-color);
        }

        .currency-symbol {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .custom-input-group input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1.1rem;
          color: var(--text-main);
          padding: 0.5rem;
        }

        .custom-input-group input::placeholder {
          color: var(--text-muted);
        }

        .btn-donate {
          background: linear-gradient(135deg, var(--accent-color), #a78bfa);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .btn-donate:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-donate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
        }

        .payment-note {
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .payment-note p {
          margin: 0.5rem 0;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .donate-header h1 {
            font-size: 2rem;
          }

          .amount-buttons {
            grid-template-columns: repeat(2, 1fr);
          }

          .donate-content {
            padding: 1.5rem;
          }

          .why-support {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Donate;
