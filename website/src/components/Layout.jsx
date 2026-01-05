import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, Mail, Github, Linkedin, LogOut, User, Crown, Sparkles, Music, Play, Pause, Volume2, VolumeX, RotateCcw, Flame, Code2, ChevronDown } from 'lucide-react';
import { XIcon } from './SocialIcons';

import ThemeToggle from './ThemeToggle';
import NotificationPrompt from './NotificationPrompt';
import AuthModal from './AuthModal';
import MegaMenu from './MegaMenu';
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

  // Clear any stored playing state on mount - user must manually play
  useEffect(() => {
    localStorage.setItem('musicPlaying', 'false');
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
      className={`focus-music-player ${isExpanded ? 'expanded' : ''} ${isPlaying ? 'playing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <audio ref={audioRef} src={LOFI_RADIO_URL} />

      <button
        className="music-toggle-btn"
        onClick={handleMobileToggle}
        title="Lofi Radio"
      >
        {isPlaying ? (
          <div className="music-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        ) : (
          <Music size={18} />
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

// Pre-generated particle positions (pure/deterministic)
const PARTICLES = [
  { id: 0, x: 12, y: 8, size: 3, duration: 18, delay: 1, xOffset: 5 },
  { id: 1, x: 85, y: 15, size: 2, duration: 22, delay: 0, xOffset: -8 },
  { id: 2, x: 45, y: 25, size: 4, duration: 15, delay: 2, xOffset: 10 },
  { id: 3, x: 72, y: 42, size: 2, duration: 25, delay: 3, xOffset: -5 },
  { id: 4, x: 28, y: 55, size: 3, duration: 20, delay: 1, xOffset: 7 },
  { id: 5, x: 92, y: 68, size: 2, duration: 17, delay: 4, xOffset: -10 },
  { id: 6, x: 8, y: 75, size: 4, duration: 23, delay: 0, xOffset: 8 },
  { id: 7, x: 55, y: 82, size: 2, duration: 19, delay: 2, xOffset: -6 },
  { id: 8, x: 38, y: 12, size: 3, duration: 21, delay: 3, xOffset: 9 },
  { id: 9, x: 65, y: 35, size: 2, duration: 16, delay: 1, xOffset: -7 },
  { id: 10, x: 18, y: 48, size: 4, duration: 24, delay: 4, xOffset: 6 },
  { id: 11, x: 78, y: 58, size: 2, duration: 18, delay: 0, xOffset: -9 },
  { id: 12, x: 52, y: 72, size: 3, duration: 22, delay: 2, xOffset: 8 },
  { id: 13, x: 25, y: 88, size: 2, duration: 15, delay: 3, xOffset: -5 },
  { id: 14, x: 88, y: 22, size: 4, duration: 20, delay: 1, xOffset: 10 },
  { id: 15, x: 5, y: 38, size: 2, duration: 26, delay: 4, xOffset: -8 },
  { id: 16, x: 42, y: 5, size: 3, duration: 17, delay: 0, xOffset: 7 },
  { id: 17, x: 68, y: 92, size: 2, duration: 23, delay: 2, xOffset: -6 },
  { id: 18, x: 95, y: 45, size: 4, duration: 19, delay: 3, xOffset: 9 },
  { id: 19, x: 32, y: 65, size: 2, duration: 21, delay: 1, xOffset: -10 },
];

// Interactive Constellation Network - Mouse-based connecting nodes
const InteractiveConstellation = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef([]);
  const animationRef = useRef(null);
  const isMobileRef = useRef(false);

  // Initialize nodes
  const initNodes = useCallback((width, height) => {
    const nodes = [];
    // Dramatically reduce nodes on mobile for performance
    const isMobile = width < 768;
    isMobileRef.current = isMobile;
    const nodeCount = isMobile
      ? Math.min(30, Math.floor((width * height) / 25000))  // 30 max on mobile
      : Math.min(80, Math.floor((width * height) / 15000)); // 80 max on desktop

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        baseRadius: Math.random() * 2 + 1,
      });
    }
    return nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      if (nodesRef.current.length === 0) {
        nodesRef.current = initNodes(width, height);
      }
    };

    setCanvasSize();

    const handleMouseMove = (e) => {
      if (isMobileRef.current) return; // Disable on mobile for performance
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleTouchMove = (e) => {
      if (!isMobileRef.current) return;
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleResize = () => {
      setCanvasSize();
      nodesRef.current = initNodes(width, height);
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;
      const nodes = nodesRef.current;
      const isMobile = isMobileRef.current;

      // Reduced distances on mobile for better performance
      const connectionDistance = isMobile ? 100 : 120;
      const mouseRadius = isMobile ? 150 : 200;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        // Mouse interaction - attract nodes slightly
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouseRadius && distToMouse > 0) {
          const force = (mouseRadius - distToMouse) / mouseRadius;
          node.x += dx * force * 0.004;
          node.y += dy * force * 0.004;
          node.radius = node.baseRadius + force * 3;
        } else {
          node.radius = node.baseRadius;
        }

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = other.x - node.x;
          const ndy = other.y - node.y;
          const dist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (dist < connectionDistance) {
            // Check if either node is near mouse for enhanced effect
            const node1ToMouse = Math.sqrt((mouse.x - node.x) ** 2 + (mouse.y - node.y) ** 2);
            const node2ToMouse = Math.sqrt((mouse.x - other.x) ** 2 + (mouse.y - other.y) ** 2);
            const nearMouse = node1ToMouse < mouseRadius || node2ToMouse < mouseRadius;

            const opacity = nearMouse
              ? (1 - dist / connectionDistance) * 0.8
              : (1 - dist / connectionDistance) * 0.15;

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);

            if (nearMouse) {
              // Gradient line for mouse-affected connections
              const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(236, 72, 153, ${opacity})`);
              gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity})`);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
              ctx.lineWidth = 0.5;
            }
            ctx.stroke();
          }
        }

        // Draw line from node to mouse if close enough
        if (distToMouse < mouseRadius && distToMouse > 0) {
          const opacity = (1 - distToMouse / mouseRadius) * 0.6;
          const gradient = ctx.createLinearGradient(node.x, node.y, mouse.x, mouse.y);
          gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
          gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity * 0.5})`);

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw node
        const nodeOpacity = distToMouse < mouseRadius ? 0.4 : 0.25;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 2
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${nodeOpacity})`);
        gradient.addColorStop(0.5, `rgba(236, 72, 153, ${nodeOpacity * 0.7})`);
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 60
        );
        mouseGlow.addColorStop(0, 'rgba(236, 72, 153, 0.15)');
        mouseGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
        mouseGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.fillStyle = mouseGlow;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -3,
      }}
    />
  );
};

const Layout = ({ children }) => {
  const { user, isSignedIn, isLoaded, signOut } = useAuth();
  const { isPremium, subscription } = useSubscription();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const megaMenuTimeoutRef = useRef(null);
  const megaMenuWrapperRef = useRef(null);
  const isMouseInMenuRef = useRef(false);
  const userIsPremium = isPremium();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mega menu when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isMegaMenuOpen) return;

    const handleClickOutside = (e) => {
      if (megaMenuWrapperRef.current && !megaMenuWrapperRef.current.contains(e.target)) {
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isMegaMenuOpen]);

  const handleMegaMenuEnter = () => {
    if (isMobile) return; // Disable hover on mobile
    isMouseInMenuRef.current = true;
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    if (isMobile) return; // Disable hover on mobile
    isMouseInMenuRef.current = false;
    megaMenuTimeoutRef.current = setTimeout(() => {
      // Only close if mouse is still outside
      if (!isMouseInMenuRef.current) {
        setIsMegaMenuOpen(false);
      }
    }, 100);
  };

  const handleMegaMenuClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setIsMegaMenuOpen(!isMegaMenuOpen);
    }
  };

  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
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
      {/* Interactive constellation network - mouse tracking */}
      <InteractiveConstellation />

      {/* Site-wide animated background particles */}
      <div className="site-particles-container">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="site-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `site-particle-float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              '--x-offset': `${particle.xOffset}px`,
            }}
          />
        ))}
      </div>
      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <Link to="/" className="logo">
            <Logo className="logo-icon" />
            <span className="logo-text">
              <span className="logo-text-full">CrackFrontend</span>
              <span className="logo-text-short">CF</span>
            </span>
          </Link>
          <div className="nav-links">
            <div
              className="nav-item-wrapper"
              ref={megaMenuWrapperRef}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <NavLink
                to="/library"
                className={({ isActive }) => `nav-item has-dropdown ${isActive ? 'active' : ''}`}
                onClick={handleMegaMenuClick}
              >
                <BookOpen size={18} />
                <span>Resources</span>
                <ChevronDown size={14} className={`nav-chevron ${isMegaMenuOpen ? 'open' : ''}`} />
              </NavLink>
              <MegaMenu
                isOpen={isMegaMenuOpen}
                onClose={closeMegaMenu}
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              />
            </div>
            <NavLink to="/practice" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Code2 size={18} />
              <span>Practice</span>
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
                        alt="User profile avatar"
                        className="avatar-img"
                        loading="lazy"
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
                <button className="btn-auth btn-signup" onClick={() => setIsAuthModalOpen(true)}>
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
          <div className="footer-main">
            <div className="footer-brand">
              <Logo className="footer-logo" />
              <span className="footer-brand-name">CrackFrontend</span>
            </div>
            <p className="footer-tagline">Your guide to mastering frontend interviews</p>
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h4>Resources</h4>
              <Link to="/library">Library</Link>
              <Link to="/practice">Practice</Link>
              <Link to="/pricing">Pricing</Link>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className="footer-bottom">
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
        </div>
      </footer>

      <NotificationPrompt />
      <FocusMusicPlayer />
      <PomodoroTimer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <style>{`
        /* Site-wide Animated Particles Background */
        .site-particles-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
          z-index: -2;
        }

        .layout {
          position: relative;
          min-height: 100vh;
        }

        .site-particle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--accent-pink));
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          animation: site-particle-float 18s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes site-particle-float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          25% {
            transform: translate(var(--x-offset, 5px), -30px);
            opacity: 0.5;
          }
          50% {
            transform: translate(calc(var(--x-offset, 5px) * 2), -60px);
            opacity: 0.8;
          }
          75% {
            transform: translate(var(--x-offset, 5px), -30px);
            opacity: 0.5;
          }
        }

        /* Reduce particle intensity on mobile */
        @media (max-width: 768px) {
          .site-particle {
            opacity: 0.3;
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
          }
        }

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
          overflow: visible;
        }

        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          overflow: visible;
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
            #06b6d4 0%,
            #3b82f6 20%,
            #8b5cf6 40%,
            #c084fc 50%,
            #8b5cf6 60%,
            #3b82f6 80%,
            #06b6d4 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: logo-gradient-shift 5s ease-in-out infinite;
        }

        @keyframes logo-gradient-shift {
          0%, 100% {
            background-position: 0% center;
            filter: brightness(1);
          }
          50% {
            background-position: 100% center;
            filter: brightness(1.2);
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
          overflow: visible;
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

        .nav-item-wrapper {
          position: relative;
        }

        .nav-item.has-dropdown {
          padding-right: 0.625rem;
        }

        .nav-chevron {
          transition: transform 0.2s ease;
          opacity: 0.6;
          margin-left: -0.125rem;
        }

        .nav-chevron.open {
          transform: rotate(180deg);
        }

        .nav-item:hover .nav-chevron {
          opacity: 1;
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
          background: linear-gradient(135deg, var(--primary) 0%, #6d28d9 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 99px;
          width: fit-content;
          transition: all 0.2s;
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
          background: var(--primary);
          color: white;
        }

        .btn-signup:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .main-content {
          padding-top: 6rem;
          padding-bottom: 4rem;
          min-height: 100vh;
        }

        .footer {
          position: relative;
          z-index: 60;
          padding: 4rem 0 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: auto;
          border-top: 1px solid var(--border-color);
          background: var(--bg-color);
        }

        .footer-content {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .footer-main {
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .footer-logo {
          width: 28px;
          height: 28px;
        }

        .footer-brand-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          background: linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tagline {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-section h4 {
          color: var(--text-main);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .footer-section a {
          color: var(--text-muted);
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-section a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .social-links {
          display: flex;
          align-items: center;
          gap: 1rem;
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

          .nav-chevron {
            display: flex;
            margin-left: -0.25rem;
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
            padding: 2rem 0 1.5rem;
          }

          .footer-content {
            gap: 2rem;
          }

          .footer-links {
            gap: 2rem;
          }

          .footer-bottom {
            padding-top: 1.5rem;
          }

          .social-links {
            gap: 0.75rem;
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
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
          flex-shrink: 0;
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
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          border-color: transparent;
          color: white;
        }

        .control-btn.play-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
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
          background: var(--primary);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: none;
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
