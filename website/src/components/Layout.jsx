import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, Layers, Map, Mail, Github, Linkedin, LogOut, User, Crown, Sparkles, Music, Play, Pause, Volume2, VolumeX, RotateCcw, Flame } from 'lucide-react';
import { XIcon } from './SocialIcons';

import ThemeToggle from './ThemeToggle';
import NotificationPrompt from './NotificationPrompt';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { supabase } from '../lib/supabase';

// Lofi Hip Hop Radio - 24/7 chill beats for studying (via Zeno.FM)
const LOFI_RADIO_URL = 'https://stream.zeno.fm/0r0xa792kwzuv';

// Streak Counter Component
const StreakCounter = ({ userId }) => {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !supabase) return;

    const updateStreak = async () => {
      try {
        // Call the database function to update and get streak
        const { data, error } = await supabase
          .rpc('update_user_streak', { p_user_id: userId });

        if (error) {
          console.error('Error updating streak:', error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          setStreak(data[0].current_streak);
          setLongestStreak(data[0].longest_streak);
        }
      } catch (err) {
        console.error('Streak update failed:', err);
      } finally {
        setLoading(false);
      }
    };

    updateStreak();
  }, [userId]);

  if (loading) {
    return (
      <div className="streak-counter streak-loading">
        <Flame size={16} />
        <span className="streak-number">-</span>
      </div>
    );
  }

  return (
    <div
      className="streak-counter"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Flame size={16} className={streak >= 3 ? 'flame-active' : ''} />
      <span className="streak-number">{streak}</span>
      {showTooltip && (
        <div className="streak-tooltip">
          <div>{streak} day streak!</div>
          {longestStreak > streak && (
            <div className="streak-best">Best: {longestStreak} days</div>
          )}
          <div className="streak-hint">Keep learning daily</div>
        </div>
      )}
    </div>
  );
};

// Pomodoro Timer Component
const FOCUS_OPTIONS = [15, 25, 45, 60]; // minutes
const BREAK_OPTIONS = [5, 10, 15]; // minutes

const PomodoroTimer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const focusTime = focusMinutes * 60;
  const breakTime = breakMinutes * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished - switch modes
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(breakTime);
      } else {
        setMode('focus');
        setTimeLeft(focusTime);
      }
      setIsRunning(false);
      // Play notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Mi42KgHRwaHqEjY2KhXtwam18ho+QjYZ9c2xveoaOkY+Lh3xybHJ+iJGSkY2Id3Nuc3+Jk5OSj4p9dG5yfomTk5KQi4F3cXF3gYmQkZGPi4Z+d3R1eoCGi46PjouHgXt3d3l8gIWJjI2Mi4iEgHx5eHp8f4OGiYqKiYeEgX58e3p7fH+ChYeHhoWDgYB+fHt7fH1/gYOEhYSDgYB/fnx8fH1+f4GCg4OCgYB/fn19fX5+f4CAgYGAgH9/fn5+fn5/f4CAgICAgH9/fn5+fn9/f4CAgICAf39/fn5+fn9/f4B/gICAf39/f35+fn9/f39/f4B/f39/f39+fn9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fw==');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {}
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode, focusTime, breakTime]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusTime : breakTime);
  };

  const handleFocusChange = (mins) => {
    setFocusMinutes(mins);
    if (mode === 'focus' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const handleBreakChange = (mins) => {
    setBreakMinutes(mins);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus'
    ? ((focusTime - timeLeft) / focusTime) * 100
    : ((breakTime - timeLeft) / breakTime) * 100;

  return (
    <div className={`pomodoro-timer ${isExpanded ? 'expanded' : ''}`}>
      <button
        className="pomodoro-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title="Pomodoro Timer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Tomato body */}
          <ellipse cx="12" cy="14" rx="9" ry="8" fill="#ef4444"/>
          <ellipse cx="12" cy="14" rx="9" ry="8" fill="url(#tomatoGrad)"/>
          {/* Highlight */}
          <ellipse cx="8" cy="11" rx="2" ry="1.5" fill="rgba(255,255,255,0.3)"/>
          {/* Stem */}
          <path d="M12 6 Q12 4 10 3" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M12 6 Q12 4 14 3" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="12" cy="6.5" rx="2" ry="1" fill="#22c55e"/>
          {/* Clock face */}
          <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.9)"/>
          {/* Clock hands */}
          <line x1="12" y1="14" x2="12" y2="11.5" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="12" y1="14" x2="14" y2="14" stroke="#dc2626" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="12" cy="14" r="0.5" fill="#dc2626"/>
          <defs>
            <linearGradient id="tomatoGrad" x1="3" y1="10" x2="21" y2="18">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
        </svg>
      </button>

      {isExpanded && (
        <div className="pomodoro-content">
          <div className="pomodoro-header">
            <div className="pomodoro-mode">{mode === 'focus' ? 'Focus' : 'Break'}</div>
            <button
              className="pomodoro-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙️
            </button>
          </div>

          {showSettings ? (
            <div className="pomodoro-settings">
              <div className="setting-group">
                <label>Focus</label>
                <div className="setting-options">
                  {FOCUS_OPTIONS.map(mins => (
                    <button
                      key={mins}
                      className={`setting-option ${focusMinutes === mins ? 'active' : ''}`}
                      onClick={() => handleFocusChange(mins)}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
              <div className="setting-group">
                <label>Break</label>
                <div className="setting-options">
                  {BREAK_OPTIONS.map(mins => (
                    <button
                      key={mins}
                      className={`setting-option ${breakMinutes === mins ? 'active' : ''}`}
                      onClick={() => handleBreakChange(mins)}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="pomodoro-time">{formatTime(timeLeft)}</div>
              <div className="pomodoro-progress">
                <div className="pomodoro-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="pomodoro-controls">
                <button onClick={toggleTimer} className="pomodoro-btn primary">
                  {isRunning ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button onClick={resetTimer} className="pomodoro-btn">
                  <RotateCcw size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};


// Focus Music Player Component
const FocusMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wantsToResume, setWantsToResume] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved ? parseFloat(saved) : 1;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('musicMuted') === 'true';
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if music was playing before refresh
  useEffect(() => {
    const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
    if (wasPlaying && audioRef.current) {
      // Try to auto-resume, but if blocked, show "wants to resume" state
      const timer = setTimeout(async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay blocked - show visual indicator
          console.log('Auto-resume blocked, showing resume indicator');
          setWantsToResume(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Save volume and mute state to localStorage
  useEffect(() => {
    localStorage.setItem('musicVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('musicMuted', isMuted.toString());
  }, [isMuted]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      hoverTimeoutRef.current = setTimeout(() => setIsHovered(false), 300);
    }
  };

  const handleMobileToggle = () => {
    if (isMobile) {
      setIsMobileExpanded(!isMobileExpanded);
    }
  };

  const isExpanded = isMobile ? isMobileExpanded : isHovered;

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
          localStorage.setItem('musicPlaying', 'false');
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
          setWantsToResume(false);
          localStorage.setItem('musicPlaying', 'true');
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
        localStorage.setItem('musicPlaying', 'false');
      }
    }
  };

  return (
    <div
      className={`focus-music-player ${isExpanded ? 'expanded' : ''} ${isPlaying ? 'playing' : ''} ${wantsToResume ? 'wants-resume' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src={LOFI_RADIO_URL} />

      <button
        className="music-toggle-btn"
        onClick={wantsToResume ? togglePlay : handleMobileToggle}
        title={wantsToResume ? 'Click to resume music' : 'Lofi Radio'}
      >
        {isPlaying ? (
          <div className="music-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        ) : (
          <Music size={18} className={wantsToResume ? 'resume-icon' : ''} />
        )}
      </button>

      <div className={`music-controls ${isExpanded ? 'visible' : ''}`}>
        <span className="track-name">Lofi Radio</span>

        <div className="music-buttons">
          <button onClick={togglePlay} className="control-btn play-btn" title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="control-btn"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
          title="Volume"
        />
      </div>
    </div>
  );
};

const Logo = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="logoGradAnimated" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6">
          <animate attributeName="stop-color" values="#8b5cf6;#ec4899;#06b6d4;#ec4899;#8b5cf6" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" stopColor="#ec4899">
          <animate attributeName="stop-color" values="#ec4899;#06b6d4;#8b5cf6;#06b6d4;#ec4899" dur="4s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" stopColor="#06b6d4">
          <animate attributeName="stop-color" values="#06b6d4;#8b5cf6;#ec4899;#8b5cf6;#06b6d4" dur="4s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
      {/* Glow filter */}
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#logoGlow)">
      <path d="M50 2 L58 28 L78 35 L58 42 L50 68 L42 42 L22 35 L42 28 Z" fill="url(#logoGradAnimated)" />
      <circle cx="50" cy="82" r="14" fill="url(#logoGradAnimated)" />
    </g>
  </svg>
);

const Layout = ({ children }) => {
  const { user, isSignedIn, isLoaded, signInWithGoogle, signOut } = useAuth();
  const { isPremium, subscription } = useSubscription();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userIsPremium = isPremium();

  const handleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('Sign in error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    signOut();
  };

  return (
    <div className="layout">
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <Link to="/" className="logo">
            <Logo className="logo-icon" />
            <span className="logo-text">
              <span className="logo-text-full">CrackFrontend</span>
              <span className="logo-text-short">FR</span>
            </span>
          </Link>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} />
              <span>Library</span>
            </NavLink>
            <NavLink to="/learning-path" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Map size={18} />
              <span>Path</span>
            </NavLink>
            <div className="nav-separator"></div>
            {isSignedIn && user?.id && <StreakCounter userId={user.id} />}
            <ThemeToggle />
            <div className="auth-section" ref={dropdownRef}>
              {!isLoaded ? (
                <div className="auth-placeholder" aria-hidden="true" />
              ) : isSignedIn ? (
                <>
                  <button
                    className="user-avatar-btn"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    {(user?.user_metadata?.avatar_url || user?.user_metadata?.picture) ? (
                      <img
                        src={user.user_metadata.avatar_url || user.user_metadata.picture}
                        alt="Profile"
                        className="avatar-img"
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </button>
                  {isDropdownOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <span className="dropdown-email">{user?.email}</span>
                        {userIsPremium ? (
                          <div className="premium-badge">
                            <Crown size={12} />
                            <span>Premium {subscription?.plan === 'lifetime' ? '(Lifetime)' : ''}</span>
                          </div>
                        ) : (
                          <Link
                            to="/pricing"
                            className="upgrade-link"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Sparkles size={12} />
                            <span>Upgrade to Premium</span>
                          </Link>
                        )}
                      </div>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={handleSignOut}>
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button className="btn-auth btn-signup" onClick={handleSignIn}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>Built with ❤️ by Tushar Khanna</p>
          <div className="social-links">
            <a href="mailto:hellokhannatushar@gmail.com" className="social-link" title="Email">
              <Mail size={20} />
            </a>
            <a href="https://x.com/iamtusharkhanna" target="_blank" rel="noopener noreferrer" className="social-link" title="X (Twitter)">
              <XIcon size={18} />
            </a>
            <a href="https://www.linkedin.com/in/khannatushar/" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/codertushar/frontend-resources" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>

      <NotificationPrompt />
      <FocusMusicPlayer />
      <PomodoroTimer />

      <style>{`
        .navbar {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 1000px;
          z-index: 100;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          box-shadow:
            0 4px 20px -2px rgba(0, 0, 0, 0.15),
            0 0 40px -10px var(--primary-glow);
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .logo-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .logo-text {
          display: flex;
          align-items: center;
        }

        .logo-text-full,
        .logo-text-short {
          background: linear-gradient(
            90deg,
            #8b5cf6 0%,
            #ec4899 25%,
            #06b6d4 50%,
            #ec4899 75%,
            #8b5cf6 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: logo-gradient-shift 4s linear infinite;
        }

        @keyframes logo-gradient-shift {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .logo-text-short {
          display: none;
          font-weight: 800;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-separator {
          width: 1px;
          height: 24px;
          background-color: var(--border-color);
          margin: 0 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 99px;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          color: var(--text-main);
          background: var(--surface-hover);
        }

        .nav-item.active {
          background: var(--surface-hover);
          color: var(--primary);
        }

        .auth-section {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: 0.5rem;
          min-width: 70px;
        }

        .auth-placeholder {
          width: 70px;
          height: 36px;
          border-radius: 99px;
          background: var(--surface-hover);
          opacity: 0.5;
        }

        .user-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-hover);
          border: 2px solid var(--primary);
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }

        .user-avatar-btn:hover {
          border-color: var(--primary-hover);
          transform: scale(1.05);
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          overflow: hidden;
        }

        :root.light .user-dropdown {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .dropdown-header {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dropdown-email {
          font-size: 0.85rem;
          color: var(--text-muted);
          word-break: break-all;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 99px;
          width: fit-content;
        }

        .upgrade-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: btn-gradient-shift 4s ease infinite;
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 99px;
          width: fit-content;
          transition: all 0.2s;
        }
        
        :root.light .upgrade-link {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2, #db2777, #7c3aed);
          background-size: 300% 300%;
        }

        .upgrade-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          color: var(--text-main);
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dropdown-item:hover {
          background: var(--surface-hover);
        }

        .btn-auth {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 99px;
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-signup {
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: btn-gradient-shift 4s ease infinite;
          color: white;
        }
        
        :root.light .btn-signup {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2, #db2777, #7c3aed);
          background-size: 300% 300%;
        }

        .btn-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(236, 72, 153, 0.3);
        }
        
        :root.light .btn-signup:hover {
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3), 0 2px 8px rgba(219, 39, 119, 0.2);
        }

        .main-content {
          padding-top: 6rem;
          padding-bottom: 4rem;
          min-height: 100vh;
        }

        .footer {
          padding: 3rem 0;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: auto;
          border-top: 1px solid var(--border-color);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .social-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .social-link {
          color: var(--text-muted);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 50%;
          background: var(--surface-card);
          border: 1px solid var(--border-color);
        }

        .social-link:hover {
          color: var(--primary);
          transform: translateY(-2px);
          border-color: var(--primary);
          background: var(--surface-hover);
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .navbar {
            width: 95%;
            padding: 0.625rem 1rem;
          }

          .logo-text-full {
            display: none;
          }

          .logo-text-short {
            display: inline;
            font-size: 1rem;
            font-weight: 800;
          }

          .logo-icon {
            width: 24px;
            height: 24px;
          }

          .nav-links {
            gap: 0.25rem;
          }

          .nav-item span {
            display: none;
          }

          .nav-item {
            padding: 0.5rem;
          }

          .nav-separator {
            margin: 0 0.25rem;
          }

          .auth-section {
            display: flex;
            gap: 0.25rem;
            min-width: 55px;
          }

          .auth-placeholder {
            width: 55px;
            height: 30px;
          }

          .user-avatar-btn {
            width: 32px;
            height: 32px;
          }

          .user-dropdown {
            min-width: 180px;
          }

          .btn-auth {
            font-size: 0.75rem;
            padding: 0.4rem 0.6rem;
          }

          .main-content {
            padding-top: 5rem;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            width: 100%;
            top: 0;
            border-radius: 0 0 16px 16px;
          }

          .logo {
            font-size: 1rem;
          }

          .footer {
            padding: 2rem 0;
          }

          .footer-content {
            gap: 1rem;
          }

          .social-links {
            gap: 1rem;
          }
        }

        /* Focus Music Player */
        .music-bars {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 3px;
          height: 16px;
          width: 16px;
        }

        .bar {
          width: 3px;
          background-color: white;
          border-radius: 2px;
          animation: music-bar-anim 0.8s ease-in-out infinite;
        }

        .bar:nth-child(1) { animation-delay: 0s; height: 60%; }
        .bar:nth-child(2) { animation-delay: 0.2s; height: 100%; }
        .bar:nth-child(3) { animation-delay: 0.4s; height: 80%; }

        @keyframes music-bar-anim {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }

        .focus-music-player {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          align-items: center;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 28px;
          padding: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: border-radius 0.3s ease,
                      padding 0.3s ease,
                      gap 0.3s ease,
                      box-shadow 0.3s ease,
                      border-color 0.3s ease;
        }

        .focus-music-player.playing {
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 4px 24px rgba(139, 92, 246, 0.2);
        }

        .focus-music-player.wants-resume {
          animation: wantsResume 2s ease-in-out infinite;
        }

        .focus-music-player.wants-resume .music-toggle-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        @keyframes wantsResume {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
          }
          50% {
            box-shadow: 0 4px 30px rgba(245, 158, 11, 0.6);
          }
        }

        .resume-icon {
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .focus-music-player.expanded {
          border-radius: 16px;
          padding: 10px 14px;
          gap: 12px;
        }

        .music-toggle-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: btn-gradient-shift 4s ease infinite;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
          flex-shrink: 0;
        }
        
        :root.light .music-toggle-btn {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2, #db2777, #7c3aed);
          background-size: 300% 300%;
        }

        .music-toggle-btn:hover {
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        .pulse-icon {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .music-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-width 0.25s ease-out,
                      opacity 0.2s ease-out;
          pointer-events: none;
        }

        .music-controls.visible {
          max-width: 320px;
          opacity: 1;
          pointer-events: auto;
          transition: max-width 0.3s ease-out,
                      opacity 0.25s ease-in 0.05s;
        }

        .track-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          white-space: nowrap;
          min-width: 85px;
        }

        .music-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .control-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--surface-hover);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .control-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transform: scale(1.1);
        }

        .control-btn.play-btn {
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: btn-gradient-shift 4s ease infinite;
          border-color: transparent;
          color: white;
        }
        
        :root.light .control-btn.play-btn {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2, #db2777, #7c3aed);
          background-size: 300% 300%;
        }

        .control-btn.play-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
        }
        
        :root.light .control-btn.play-btn:hover {
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
        }

        .volume-slider {
          width: 50px;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: var(--border-color);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          transition: width 0.3s ease;
        }

        .focus-music-player.expanded .volume-slider:hover {
          width: 70px;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4);
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        :root.light .volume-slider::-webkit-slider-thumb {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2);
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4);
          cursor: pointer;
          border: none;
        }
        
        :root.light .volume-slider::-moz-range-thumb {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2);
        }

        @media (max-width: 640px) {
          .focus-music-player {
            bottom: 16px;
            right: 16px;
          }

          .focus-music-player.expanded {
            flex-direction: column;
            align-items: stretch;
            padding: 12px;
            border-radius: 16px;
            gap: 10px;
          }

          .music-controls.visible {
            max-width: 100%;
            flex-direction: column;
            gap: 10px;
          }

          .track-name {
            text-align: center;
          }

          .music-buttons {
            justify-content: center;
          }

          .volume-slider {
            width: 100%;
          }

          .focus-music-player.expanded .volume-slider:hover {
            width: 100%;
          }
        }

        /* Streak Counter */
        .streak-counter {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: var(--surface-hover);
          border-radius: 99px;
          cursor: default;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .streak-counter svg {
          color: var(--text-muted);
          transition: color 0.3s ease;
        }

        .streak-counter svg.flame-active {
          color: #f97316;
          filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.5));
          animation: flicker 1.5s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .streak-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 12px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 400;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          text-align: center;
        }

        .streak-tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: var(--border-color);
        }

        .streak-best {
          color: #f97316;
          font-size: 0.7rem;
          margin-top: 2px;
        }

        .streak-hint {
          color: var(--text-muted);
          font-size: 0.7rem;
          margin-top: 4px;
        }

        .streak-loading {
          opacity: 0.6;
        }

        /* Pomodoro Timer */
        .pomodoro-timer {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .pomodoro-toggle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--surface-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          border: 1px solid var(--border-color);
        }

        .pomodoro-toggle:hover {
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
          transform: scale(1.08);
        }

        .pomodoro-content {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 16px;
          min-width: 160px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .pomodoro-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .pomodoro-mode {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ef4444;
        }

        .pomodoro-settings-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          padding: 2px;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }

        .pomodoro-settings-btn:hover {
          opacity: 1;
        }

        .pomodoro-settings {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .setting-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .setting-group label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .setting-options {
          display: flex;
          gap: 4px;
        }

        .setting-option {
          padding: 4px 8px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--surface-hover);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .setting-option:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .setting-option.active {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-color: transparent;
          color: white;
        }

        .pomodoro-time {
          font-size: 2rem;
          font-weight: 700;
          font-family: 'Space Grotesk', monospace;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .pomodoro-progress {
          width: 100%;
          height: 4px;
          background: var(--border-color);
          border-radius: 2px;
          margin: 12px 0;
          overflow: hidden;
        }

        .pomodoro-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ef4444, #dc2626);
          border-radius: 2px;
          transition: width 1s linear;
        }

        .pomodoro-controls {
          display: flex;
          gap: 8px;
        }

        .pomodoro-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--surface-hover);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pomodoro-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .pomodoro-btn.primary {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          color: white;
        }

        .pomodoro-btn.primary:hover {
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          transform: scale(1.1);
        }

        @media (max-width: 640px) {
          .pomodoro-timer {
            bottom: 16px;
            left: 16px;
          }

          .streak-counter {
            padding: 4px 8px;
            font-size: 0.8rem;
          }
        }

      `}</style>
    </div>
  );
};

export default Layout;
