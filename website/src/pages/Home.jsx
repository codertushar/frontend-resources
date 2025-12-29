
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Code, Database, Brain, Layout, Sparkles, BookOpen, Crown, Trophy, Terminal, Lightbulb, Rocket, ArrowRight } from 'lucide-react';
import contentData from '../data/content.json';
import { useProgress } from '../context/ProgressContext';
import SEO from '../components/SEO';
import { WebsiteStructuredData } from '../components/StructuredData';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Typewriter hook
const useTypewriter = (text, speed = 50, delay = 500) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    let charIndex = 0;

    const startTyping = () => {
      timeout = setTimeout(() => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1));
          charIndex++;
          startTyping();
        } else {
          setIsComplete(true);
        }
      }, speed);
    };

    const initialDelay = setTimeout(() => {
      startTyping();
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
};

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

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="particles-container">
      {PARTICLES.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

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
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
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
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e) => {
      if (!isMobileRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
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

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      className="constellation-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0,
      }}
    />
  );
};

const Home = () => {
  const { getStats } = useProgress();
  const resourceCount = contentData.length;
  const premiumCount = contentData.filter(item => item.premium).length;
  const stats = getStats(resourceCount);

  const subtitleText = "A curated collection of in-depth resources, real-world patterns, and interview-focused guides to land your dream frontend role.";
  const { displayText, isComplete } = useTypewriter(subtitleText, 30, 800);

  // Calculate category counts
  const categoryCounts = contentData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <SEO
        title="CrackFrontend - Master Frontend Interviews"
        description="A curated collection of in-depth resources, real-world patterns, and interview-focused guides to land your dream frontend role. Learn JavaScript, React, System Design, and more."
        url="/"
        keywords="frontend interview, javascript interview, react interview, system design, coding interview prep, javascript polyfills, design patterns, DSA for frontend"
      />
      <WebsiteStructuredData />

      <div className="container">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="hero"
        >
          {/* Interactive Constellation Background */}
          <InteractiveConstellation />

          {/* Floating Particles Background */}
          <FloatingParticles />

        <motion.div variants={item} className="hero-badge">
          <Sparkles size={14} />
          <span>Curated Resources for Frontend Interviews</span>
        </motion.div>

        {/* Animated Gradient Title with Glow */}
        <motion.div variants={item} className="hero-title-wrapper">
          <div className="hero-glow" />
          <h1 className="hero-title animated-gradient-text">
            Ace Your Frontend<br />Interviews
          </h1>
        </motion.div>

        {/* Typewriter Subtitle */}
        <motion.p variants={item} className="hero-subtitle">
          {displayText}
          <span className={`typing-cursor ${isComplete ? 'blink' : ''}`}>|</span>
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <Link to="/library" className="btn-primary">
            <Zap size={18} />
            <span>Dive In</span>
          </Link>
          <Link to="/learning-path" className="btn-gradient-border">
            <Rocket size={18} />
            <span>Start Learning Path</span>
          </Link>
        </motion.div>

        <motion.div variants={item} className="stats-row">
          <div className="stat-item">
            <BookOpen size={20} />
            <div className="stat-content">
              <span className="stat-value">{resourceCount}</span>
              <span className="stat-label">Resources</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Trophy size={20} />
            <div className="stat-content">
              <span className="stat-value">6</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <Crown size={20} />
            <div className="stat-content">
              <span className="stat-value">{premiumCount}</span>
              <span className="stat-label">Premium</span>
            </div>
          </div>
        </motion.div>

        {stats.completed > 0 && (
          <motion.div variants={item} className="progress-banner glass-panel">
            <div className="progress-content">
              <div className="progress-info">
                <span className="progress-label">Your Progress</span>
                <span className="progress-value">{stats.completed} of {resourceCount} completed</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${stats.percentage}%` }}></div>
              </div>
              <span className="progress-percentage">{stats.percentage}%</span>
            </div>
            <Link to="/library" className="progress-cta">Continue Learning <ArrowRight size={16} /></Link>
          </motion.div>
        )}

        <motion.div variants={item} className="section-header">
          <h2>Popular Topics</h2>
          <p>Jump straight to what you want to learn</p>
        </motion.div>

        <motion.div variants={item} className="popular-topics">
          <Link to="/library?tag=react" className="topic-tag">React</Link>
          <Link to="/library?subcategory=design-patterns" className="topic-tag">Design Patterns</Link>
          <Link to="/library?tag=promises" className="topic-tag">Promises</Link>
          <Link to="/library?subcategory=polyfills" className="topic-tag">Polyfills</Link>
          <Link to="/library?tag=closures" className="topic-tag">Closures</Link>
          <Link to="/library?tag=memoization" className="topic-tag">Memoization</Link>
          <Link to="/library?tag=async" className="topic-tag">Async Programming</Link>
          <Link to="/library?tag=performance" className="topic-tag">Performance</Link>
          <Link to="/library?tag=algorithms" className="topic-tag">Algorithms</Link>
          <Link to="/library?tag=dom" className="topic-tag">DOM Manipulation</Link>
        </motion.div>

        <motion.div variants={item} className="section-header" style={{ marginTop: '4rem' }}>
          <h2>Browse by Category</h2>
          <p>Deep-dive into curated content tailored for frontend interviews and real-world development.</p>
        </motion.div>

        <motion.div variants={item} className="features-grid">
          <Link to="/library?category=js" className="feature-card glass-panel animated-card">
            <div className="feature-icon"><Code size={24} /></div>
            <div className="feature-content">
              <h3>JavaScript Deep Dives</h3>
              <p>Master the core language, from closures to event loops.</p>
            </div>
            <span className="feature-count">{categoryCounts['js'] || 0} articles</span>
          </Link>
          <Link to="/library?category=dsa" className="feature-card glass-panel animated-card">
            <div className="feature-icon"><Database size={24} /></div>
            <div className="feature-content">
              <h3>DSA for Frontend</h3>
              <p>Algorithms and data structures optimized for interviews.</p>
            </div>
            <span className="feature-count">{categoryCounts['dsa'] || 0} articles</span>
          </Link>
          <Link to="/library?category=machine-coding" className="feature-card glass-panel animated-card">
            <div className="feature-icon"><Terminal size={24} /></div>
            <div className="feature-content">
              <h3>Machine Coding</h3>
              <p>Real-world implementation challenges asked in interviews.</p>
            </div>
            <span className="feature-count">{categoryCounts['machine-coding'] || 0} articles</span>
          </Link>
          <Link to="/library?category=system-design" className="feature-card glass-panel animated-card">
            <div className="feature-icon"><Layout size={24} /></div>
            <div className="feature-content">
              <h3>System Design</h3>
              <p>Large-scale frontend architecture for senior interviews.</p>
            </div>
            <span className="feature-count">{categoryCounts['system-design'] || 0} articles</span>
          </Link>
          <Link to="/library?category=general" className="feature-card glass-panel animated-card">
            <div className="feature-icon"><Lightbulb size={24} /></div>
            <div className="feature-content">
              <h3>Browser & Patterns</h3>
              <p>Browser internals, rendering, and design patterns.</p>
            </div>
            <span className="feature-count">{categoryCounts['general'] || 0} articles</span>
          </Link>
          <Link to="/library?category=ai" className="feature-card glass-panel animated-card">
            <div className="feature-icon"><Brain size={24} /></div>
            <div className="feature-content">
              <h3>AI Engineering</h3>
              <p>Integrate modern AI tools into your workflows.</p>
            </div>
            <span className="feature-count">{categoryCounts['ai'] || 0} articles</span>
          </Link>
        </motion.div>
      </motion.div>

      <style>{`
        /* Floating Particles */
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #ec4899);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }

        /* Reduce particle intensity on mobile */
        @media (max-width: 768px) {
          .particle {
            opacity: 0.4;
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
          }
        }

        /* Hero Section */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 4rem 1rem;
          position: relative;
          overflow: hidden;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 500;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .hero-badge svg {
          color: var(--primary);
        }

        /* Title Wrapper with Glow */
        .hero-title-wrapper {
          position: relative;
          z-index: 1;
        }

        .hero-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 150%;
          background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 40%, transparent 70%);
          filter: blur(40px);
          animation: pulse-glow 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        /* Animated Gradient Text */
        .animated-gradient-text {
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
          animation: gradient-shift 4s linear infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .hero-title {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          position: relative;
        }

        /* Typewriter Effect */
        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 640px;
          margin-bottom: 2.5rem;
          line-height: 1.6;
          min-height: 3.2em;
          position: relative;
          z-index: 1;
        }

        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          color: var(--primary);
          font-weight: 400;
        }

        .typing-cursor.blink {
          animation: cursor-blink 1s step-end infinite;
        }

        @keyframes cursor-blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .hero-actions .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stats-row {
          position: relative;
          z-index: 1;
        }

        .section-header,
        .features-grid {
          position: relative;
          z-index: 1;
        }

        /* Gradient Border Button */
        .btn-gradient-border {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          color: var(--text-main);
          background: var(--surface-color);
          transition: all 0.3s ease;
          overflow: hidden;
          z-index: 1;
        }

        .btn-gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          padding: 2px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: gradient-rotate 4s linear infinite;
          z-index: -1;
        }

        .btn-gradient-border::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05), rgba(6, 182, 212, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .btn-gradient-border:hover::after {
          opacity: 1;
        }

        .btn-gradient-border:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2), 0 4px 15px rgba(236, 72, 153, 0.15);
        }

        .btn-gradient-border:hover svg {
          animation: rocket-bounce 0.6s ease-in-out;
        }

        @keyframes gradient-rotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes rocket-bounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-3px) rotate(-5deg);
          }
          50% {
            transform: translateY(-5px) rotate(0deg);
          }
          75% {
            transform: translateY(-3px) rotate(5deg);
          }
        }

        .btn-gradient-border svg {
          color: var(--accent-pink);
          transition: all 0.3s ease;
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.5rem 2.5rem;
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .progress-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          margin-bottom: 4rem;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05));
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .progress-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
        }

        .progress-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .progress-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .progress-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .progress-bar-container {
          flex: 1;
          max-width: 300px;
          height: 8px;
          background: var(--surface-hover);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), #ec4899);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-percentage {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          min-width: 50px;
        }

        .progress-cta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .progress-cta:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .stat-item svg {
          color: var(--primary);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        .section-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .section-header p {
          color: var(--text-muted);
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Popular Topics Tag Cloud */
        .popular-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
          max-width: 900px;
          margin: 0 auto 1rem;
          padding: 0 1rem;
          position: relative;
          z-index: 1;
        }

        .topic-tag {
          padding: 0.625rem 1.25rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-main);
          transition: all 0.25s ease;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }

        .topic-tag:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          width: 100%;
        }

        .feature-card {
          padding: 1.5rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: var(--surface-color);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: var(--surface-hover);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          background: var(--primary);
          color: white;
          transform: scale(1.05);
        }

        .feature-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.375rem;
          color: var(--text-main);
        }

        .feature-card p {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .feature-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
          background: rgba(139, 92, 246, 0.1);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          position: relative;
          z-index: 1;
          align-self: flex-start;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 2rem 1rem;
          }

          .hero-badge {
            margin-bottom: 1.5rem;
            font-size: 0.8rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
            margin-bottom: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            margin-bottom: 2rem;
          }

          .hero-actions .btn-primary,
          .hero-actions .btn-secondary {
            width: 100%;
            text-align: center;
            justify-content: center;
          }

          .stats-row {
            gap: 1rem;
            padding: 1.25rem 1rem;
            margin-bottom: 1.5rem;
          }

          .stat-item {
            flex-direction: column;
            gap: 0.5rem;
          }

          .stat-content {
            align-items: center;
            text-align: center;
          }

          .progress-banner {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
            margin-bottom: 2.5rem;
          }

          .progress-content {
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
          }

          .progress-info {
            align-items: center;
            text-align: center;
          }

          .progress-bar-container {
            max-width: 100%;
            width: 100%;
          }

          .progress-cta {
            width: 100%;
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .feature-card {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 1.5rem 0.5rem;
          }

          .hero-badge {
            font-size: 0.75rem;
            padding: 0.375rem 0.75rem;
          }

          .hero-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .hero-subtitle {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .hero-actions {
            margin-bottom: 1.5rem;
          }

          .stats-row {
            padding: 1rem 0.75rem;
            margin-bottom: 2rem;
            gap: 0.5rem;
          }

          .stat-item {
            gap: 0.375rem;
          }

          .stat-value {
            font-size: 1rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }

          .feature-card h3 {
            font-size: 1.125rem;
          }

          .feature-card p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default Home;
