'use client';

import { useState, useRef, useEffect, useCallback, ReactNode, CSSProperties, ChangeEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Mail, LogOut, User, Crown, Sparkles, Music, Play, Pause, Volume2, VolumeX, RotateCcw, Flame, Code2, ChevronDown } from 'lucide-react';
import { XIcon, LinkedInIcon, GitHubIcon } from './SocialIcons';

import ThemeToggle from './ThemeToggle';
import NotificationPrompt from './NotificationPrompt';
import AuthModal from './AuthModal';
import MegaMenuNext from './MegaMenuNext';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../context/MusicContext';
import { supabase } from '../lib/supabase';

// Type definitions
interface StreakCounterProps {
  userId: string;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  xOffset: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface LogoProps {
  className?: string;
}

interface LayoutProps {
  children: ReactNode;
}

interface NavLinkNextProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Next.js compatible NavLink that shows active state
const NavLinkNext = ({ href, children, className = '', onClick }: NavLinkNextProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Streak Counter Component
const StreakCounter = ({ userId }: StreakCounterProps) => {
  const [streak, setStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId || !supabase) return;

    const updateStreak = async () => {
      try {
        const { data, error } = await supabase
          .rpc('update_user_streak', { p_user_id: userId });

        if (error) {
          console.error('Error updating streak:', error);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const streakData = data[0] as StreakData;
          setStreak(streakData.current_streak);
          setLongestStreak(streakData.longest_streak);
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
const FOCUS_OPTIONS: number[] = [15, 25, 45, 60];
const BREAK_OPTIONS: number[] = [5, 10, 15];

type TimerMode = 'focus' | 'break';

const PomodoroTimer = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [focusMinutes, setFocusMinutes] = useState<number>(25);
  const [breakMinutes, setBreakMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const focusTime = focusMinutes * 60;
  const breakTime = breakMinutes * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(breakTime);
      } else {
        setMode('focus');
        setTimeLeft(focusTime);
      }
      setIsRunning(false);
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Mi42KgHRwaHqEjY2KhXtwam18ho+QjYZ9c2xveoaOkY+Lh3xybHJ+iJGSkY2Id3Nuc3+Jk5OSj4p9dG5yfomTk5KQi4F3cXF3gYmQkZGPi4Z+d3R1eoCGi46PjouHgXt3d3l8gIWJjI2Mi4iEgHx5eHp8f4OGiYqKiYeEgX58e3p7fH+ChYeHhoWDgYB+fHt7fH1/gYOEhYSDgYB/fnx8fH1+f4GCg4OCgYB/fn19fX5+f4CAgYGAgH9/fn5+fn5/f4CAgICAgH9/fn5+fn9/f4CAgICAf39/fn5+fn9/f4B/gICAf39/f35+fn9/f39/f4B/f39/f39+fn9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/fw==');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {
        // Audio play failed silently
      }
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

  const handleFocusChange = (mins: number) => {
    setFocusMinutes(mins);
    if (mode === 'focus' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const handleBreakChange = (mins: number) => {
    setBreakMinutes(mins);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds: number): string => {
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
          <ellipse cx="12" cy="14" rx="9" ry="8" fill="#ef4444"/>
          <ellipse cx="12" cy="14" rx="9" ry="8" fill="url(#tomatoGrad)"/>
          <ellipse cx="8" cy="11" rx="2" ry="1.5" fill="rgba(255,255,255,0.3)"/>
          <path d="M12 6 Q12 4 10 3" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M12 6 Q12 4 14 3" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <ellipse cx="12" cy="6.5" rx="2" ry="1" fill="#22c55e"/>
          <circle cx="12" cy="14" r="4" fill="rgba(255,255,255,0.9)"/>
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
  const { isPlaying, volume, isMuted, togglePlay, setVolume: setContextVolume, toggleMute } = useMusicPlayer();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContextVolume(Number.parseFloat(e.target.value));
  };

  return (
    <div
      className={`focus-music-player ${isExpanded ? 'expanded' : ''} ${isPlaying ? 'playing' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
            onClick={toggleMute}
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
          onChange={handleVolumeChange}
          className="volume-slider"
          title="Volume"
        />
      </div>
    </div>
  );
};

const Logo = ({ className }: LogoProps) => (
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

// Pre-generated particle positions
const PARTICLES: Particle[] = [
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

// Interactive Constellation Network
const InteractiveConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number | null>(null);
  const isMobileRef = useRef<boolean>(false);

  const initNodes = useCallback((width: number, height: number): Node[] => {
    const nodes: Node[] = [];
    const isMobile = width < 768;
    isMobileRef.current = isMobile;
    const nodeCount = isMobile
      ? Math.min(30, Math.floor((width * height) / 25000))
      : Math.min(80, Math.floor((width * height) / 15000));

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
    if (!ctx) return;

    // Skip animation on mobile to save battery and improve performance
    if (window.innerWidth < 768) return;

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

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isMobileRef.current) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (!isMobileRef.current) return;
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
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

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;
      const nodes = nodesRef.current;
      const isMobile = isMobileRef.current;

      const connectionDistance = isMobile ? 100 : 120;
      const mouseRadius = isMobile ? 150 : 200;

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

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

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ndx = other.x - node.x;
          const ndy = other.y - node.y;
          const dist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (dist < connectionDistance) {
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

        const nodeOpacity = distToMouse < mouseRadius ? 0.4 : 0.25;
        const nodeGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 2
        );
        nodeGradient.addColorStop(0, `rgba(139, 92, 246, ${nodeOpacity})`);
        nodeGradient.addColorStop(0.5, `rgba(236, 72, 153, ${nodeOpacity * 0.7})`);
        nodeGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();
      });

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

    // Defer animation start to avoid blocking initial render
    const startAnimation = () => { animate(); };
    const idleId = 'requestIdleCallback' in window
      ? (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(startAnimation)
      : setTimeout(startAnimation, 200) as unknown as number;

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if ('requestIdleCallback' in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
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

const LayoutNext = ({ children }: LayoutProps) => {
  const { user, isSignedIn, isLoaded, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaMenuWrapperRef = useRef<HTMLDivElement | null>(null);
  const isMouseInMenuRef = useRef<boolean>(false);

  // SSR-safe mounting check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMounted]);

  useEffect(() => {
    if (!isMobile || !isMegaMenuOpen) return;

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (megaMenuWrapperRef.current && !megaMenuWrapperRef.current.contains(e.target as globalThis.Node)) {
        setIsMegaMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isMegaMenuOpen]);

  const handleMegaMenuEnter = () => {
    if (isMobile) return;
    isMouseInMenuRef.current = true;
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    if (isMobile) return;
    isMouseInMenuRef.current = false;
    megaMenuTimeoutRef.current = setTimeout(() => {
      if (!isMouseInMenuRef.current) {
        setIsMegaMenuOpen(false);
      }
    }, 100);
  };

  const handleMegaMenuClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) {
      e.preventDefault();
      setIsMegaMenuOpen(!isMegaMenuOpen);
    }
  };

  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as globalThis.Node)) {
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
      {/* Only render browser-specific visual effects after hydration */}
      {isMounted && <InteractiveConstellation />}

      {isMounted && (
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
              } as CSSProperties}
            />
          ))}
        </div>
      )}

      <nav className="navbar glass-panel">
        <div className="container nav-content">
          <Link href="/" className="logo">
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
              <NavLinkNext
                href="/library"
                className={`nav-item has-dropdown`}
                onClick={handleMegaMenuClick}
              >
                <BookOpen size={18} />
                <span>Resources</span>
                <ChevronDown size={14} className={`nav-chevron ${isMegaMenuOpen ? 'open' : ''}`} />
              </NavLinkNext>
              <MegaMenuNext
                isOpen={isMegaMenuOpen}
                onClose={closeMegaMenu}
                onMouseEnter={handleMegaMenuEnter}
                onMouseLeave={handleMegaMenuLeave}
              />
            </div>
            <NavLinkNext href="/practice" className="nav-item">
              <Code2 size={18} />
              <span>Practice</span>
            </NavLinkNext>
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
                        <Link
                          href="/donate"
                          className="upgrade-link"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Sparkles size={12} />
                          <span>Support Us</span>
                        </Link>
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
                <button className="btn-auth btn-signup" onClick={() => { setIsMegaMenuOpen(false); setIsAuthModalOpen(true); }}>
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
              <Link href="/library">Library</Link>
              <Link href="/practice">Practice</Link>
              <Link href="/donate">Donate</Link>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Built with ❤️ by Tushar Khanna</p>
            <div className="social-links">
              <a href="mailto:iamtusharkhanna@gmail.com" className="social-link" title="Email">
                <Mail size={20} />
              </a>
              <a href="https://x.com/iamtusharkhanna" target="_blank" rel="noopener noreferrer" className="social-link" title="X (Twitter)">
                <XIcon size={18} />
              </a>
              <a href="https://www.linkedin.com/in/khannatushar/" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                <LinkedInIcon size={20} />
              </a>
              <a href="https://github.com/codertushar/frontend-resources" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                <GitHubIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {isMounted && (
        <>
          <NotificationPrompt />
          <FocusMusicPlayer />
          <PomodoroTimer />
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default LayoutNext;
