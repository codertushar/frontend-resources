import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // Scroll modal into view when opened and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Scroll to top to ensure modal is visible
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Focus the modal for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error } = await signUpWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else if (data?.user?.identities?.length === 0) {
          setError('An account with this email already exists');
        } else {
          setSuccess('Check your email for a confirmation link!');
          setEmail('');
          setPassword('');
        }
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email before signing in');
          } else {
            setError(error.message);
          }
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setMode('signin');
    onClose();
  };

  const switchMode = () => {
    setError('');
    setSuccess('');
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return createPortal(
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" ref={modalRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="auth-modal-header">
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{mode === 'signin' ? 'Sign in to continue' : 'Sign up to get started'}</p>
        </div>

        <button className="google-signin-btn" onClick={handleGoogleSignIn}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 0 0 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.712A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.33z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0A8.997 8.997 0 0 0 .96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleEmailSubmit} className="auth-form">
          <div className="auth-input-group">
            <Mail size={18} className="auth-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <Lock size={18} className="auth-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="auth-message error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-message success">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'signin' ? (
            <p>Don&apos;t have an account? <button onClick={switchMode}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button onClick={switchMode}>Sign in</button></p>
          )}
        </div>

        <style>{`
          .auth-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 1rem;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .auth-modal {
            position: relative;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 2rem;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.2s ease-out;
          }

          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .auth-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--surface-hover);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-muted);
            transition: all 0.2s;
          }

          .auth-modal-close:hover {
            background: var(--border-color);
            color: var(--text-main);
          }

          .auth-modal-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .auth-modal-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-main);
            margin-bottom: 0.5rem;
          }

          .auth-modal-header p {
            color: var(--text-muted);
            font-size: 0.9rem;
          }

          .google-signin-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: var(--surface-hover);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--text-main);
            cursor: pointer;
            transition: all 0.2s;
          }

          .google-signin-btn:hover {
            background: var(--surface-card);
            border-color: var(--primary);
          }

          .auth-divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
          }

          .auth-divider::before,
          .auth-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-color);
          }

          .auth-divider span {
            padding: 0 1rem;
            color: var(--text-muted);
            font-size: 0.85rem;
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .auth-input-group {
            position: relative;
          }

          .auth-input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
          }

          .auth-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.75rem;
            background: var(--surface-hover);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            font-size: 0.95rem;
            color: var(--text-main);
            transition: all 0.2s;
          }

          .auth-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          }

          .auth-input::placeholder {
            color: var(--text-muted);
          }

          .auth-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
          }

          .auth-message.error {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
          }

          .auth-message.success {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
          }

          .auth-submit-btn {
            width: 100%;
            padding: 0.75rem 1rem;
            background: linear-gradient(135deg, var(--primary), #7c3aed);
            border: none;
            border-radius: 10px;
            font-size: 0.95rem;
            font-weight: 600;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
          }

          .auth-submit-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          }

          .auth-submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .auth-switch {
            text-align: center;
            margin-top: 1.5rem;
            color: var(--text-muted);
            font-size: 0.9rem;
          }

          .auth-switch button {
            background: none;
            border: none;
            color: var(--primary);
            font-weight: 600;
            cursor: pointer;
            transition: color 0.2s;
          }

          .auth-switch button:hover {
            color: var(--primary-hover);
            text-decoration: underline;
          }

          @media (max-width: 480px) {
            .auth-modal {
              padding: 1.5rem;
            }

            .auth-modal-header h2 {
              font-size: 1.25rem;
            }
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
