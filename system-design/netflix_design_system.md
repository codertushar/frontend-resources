# 🎬 System Design: Netflix Design System (Frontend Interview Guide)

**Target Level:** Senior Frontend Engineer / Staff Engineer  
**Duration:** 45-60 minutes  
**Interview Focus:** Component Architecture, Design Tokens, Theming, Scalability, Performance

---

## Interview Approach & What Interviewers Look For

When asked to design Netflix's design system in a frontend interview, interviewers are evaluating:

1. **Component Architecture:** Can you design a scalable component library that works across web, TV, and mobile web?
2. **Design Tokens:** Do you understand how to manage design tokens (colors, typography, spacing) at scale?
3. **Theming:** Can you implement multi-brand theming for different regions and platforms?
4. **Performance:** How do you ensure fast loading times with tree-shaking and code-splitting?
5. **Developer Experience:** Can you create an ergonomic API that teams actually want to use?
6. **Consistency:** How do you enforce visual consistency across 100+ engineering teams?

**Pro Tip:** Start by understanding Netflix's unique constraints (TV interfaces, global scale, A/B testing culture), then design a system that solves their specific problems.

---

## 1. Clarifying Questions (First 5 minutes)

Before diving in, ask these questions to scope the problem:

**Functional Scope:**
- "Should the design system support web, mobile web, and TV platforms?"
- "Do we need to support multiple brands (Netflix, Netflix Games, etc.)?"
- "Should components be framework-agnostic or React-specific?"
- "Do we need right-to-left (RTL) language support for global markets?"

**Non-Functional Requirements:**
- "How many engineering teams will consume this? 10? 100? 1000+?"
- "What's the bundle size budget per page? <100KB? <200KB?"
- "Should we support server-side rendering (SSR) for SEO?"
- "What about accessibility standards? WCAG 2.1 AA compliance?"

**Technical Constraints:**
- "Can we use CSS-in-JS, or do we need static CSS extraction?"
- "Do we need to support legacy browsers (IE11)?"
- "Should components be versioned independently or as a monolithic package?"
- "What about A/B testing? Do components need variant support?"

---

## 2. High-Level Architecture (Draw This!)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Netflix Design System                        │
│                        (Hawkins UI)                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Design Token Layer                            │
│  ┌────────────┬────────────┬────────────┬────────────┐         │
│  │   Colors   │ Typography │  Spacing   │  Shadows   │         │
│  │  Palette   │   Scale    │   Scale    │   Depths   │         │
│  └────────────┴────────────┴────────────┴────────────┘         │
│                          ↓                                       │
│              Theme Provider (Context API)                        │
│         • Light/Dark Mode  • Regional Variants                  │
│         • Platform Tokens (Web, TV, Mobile)                     │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Component Library                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Primitive Components (Atoms)                      │  │
│  │  Button  Input  Text  Icon  Badge  Spinner  Tooltip      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      Composite Components (Molecules)                     │  │
│  │  Card  Modal  Dropdown  Tabs  Navigation  Form           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │       Pattern Components (Organisms)                      │  │
│  │  VideoPlayer  ContentRow  Billboard  SearchBar  Header   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Platform Adapters                              │
│  ┌──────────┬──────────┬──────────┬──────────┐                 │
│  │   Web    │    TV    │  Mobile  │  React   │                 │
│  │  (DOM)   │  (React  │   Web    │  Native  │                 │
│  │          │   TV)    │          │          │                 │
│  └──────────┴──────────┴──────────┴──────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              Build & Distribution Layer                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  • Tree-shakeable ESM modules                          │    │
│  │  • CommonJS for legacy support                         │    │
│  │  • TypeScript definitions                              │    │
│  │  • CSS extraction (for performance)                    │    │
│  │  • Component documentation (Storybook/Docsite)         │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Key Talking Points:**
- **Token-First Design:** All visual properties derive from tokens, making global changes easy
- **Atomic Design Principles:** Components are organized by complexity (atoms → molecules → organisms)
- **Platform Agnostic Core:** Adapters handle platform-specific rendering (DOM, React TV, etc.)
- **Performance Optimized:** Tree-shaking eliminates unused code, CSS extraction reduces bundle size

---

## 3. Core Technical Decisions

### 3.1 Design Tokens: The Foundation

Design tokens are the single source of truth for all design decisions. They enable:
- Consistent visual language across all platforms
- Easy rebranding and theme changes
- Programmatic design (dark mode, regional variants)

**Implementation:**

```javascript
// tokens/colors.js
const colors = {
  // Semantic tokens (what it means)
  brand: {
    primary: '#e50914',      // Netflix red
    secondary: '#b20710',
    accent: '#ffffff'
  },
  
  // Functional tokens (how it's used)
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.4)',
    error: '#e87c03'
  },
  
  background: {
    primary: '#141414',      // Netflix black
    secondary: '#2f2f2f',
    elevated: '#000000',
    overlay: 'rgba(0, 0, 0, 0.8)'
  },
  
  interactive: {
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.2)',
    focus: '#e50914'
  }
};

// tokens/spacing.js
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px'
};

// tokens/typography.js
const typography = {
  fontFamily: {
    primary: '"Netflix Sans", "Helvetica Neue", Arial, sans-serif',
    secondary: 'Arial, sans-serif'
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px'
  },
  
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
};

// Export as a cohesive theme object
export const theme = {
  colors,
  spacing,
  typography,
  // ... other token categories
};
```

---

### 3.2 Theme Provider: Context-Based Theming

The Theme Provider uses React Context to make tokens available to all components.

```javascript
// ThemeProvider.jsx
import React, { createContext, useContext, useMemo } from 'react';
import { theme as defaultTheme } from './tokens';

const ThemeContext = createContext(defaultTheme);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ 
  theme = defaultTheme, 
  mode = 'dark',
  children 
}) => {
  // Merge base theme with mode-specific overrides
  const computedTheme = useMemo(() => {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        // Apply mode-specific color overrides
        ...(mode === 'light' ? lightModeColors : darkModeColors)
      }
    };
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={computedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usage
const App = () => (
  <ThemeProvider mode="dark">
    <NetflixApp />
  </ThemeProvider>
);
```

---

### 3.3 Component Architecture: Atomic Design

Components are organized by complexity following Atomic Design principles:

**Atoms: Primitive Building Blocks**

```javascript
// components/Button/Button.jsx
import React from 'react';
import { useTheme } from '../../ThemeProvider';
import './Button.css';

export const Button = ({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  ...props 
}) => {
  const theme = useTheme();
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };
  
  return (
    <button
      className={`nf-button nf-button--${variant} nf-button--${size}`}
      disabled={disabled || loading}
      onClick={handleClick}
      style={{
        '--button-bg': theme.colors.brand.primary,
        '--button-color': theme.colors.text.primary,
        '--button-padding': theme.spacing[size],
      }}
      {...props}
    >
      {loading ? <Spinner size={size} /> : children}
    </button>
  );
};

// Button.css
.nf-button {
  font-family: var(--font-family-primary);
  background-color: var(--button-bg);
  color: var(--button-color);
  padding: var(--button-padding);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  font-weight: 700;
}

.nf-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(1.02);
}

.nf-button:active:not(:disabled) {
  transform: scale(0.98);
}

.nf-button--primary {
  background-color: var(--color-brand-primary);
}

.nf-button--secondary {
  background-color: var(--color-background-secondary);
}

.nf-button--small {
  padding: 8px 16px;
  font-size: 14px;
}

.nf-button--medium {
  padding: 12px 24px;
  font-size: 16px;
}

.nf-button--large {
  padding: 16px 32px;
  font-size: 18px;
}

.nf-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

**Molecules: Simple Composites**

```javascript
// components/Card/Card.jsx
import React from 'react';
import { useTheme } from '../../ThemeProvider';
import './Card.css';

export const Card = ({ 
  title,
  subtitle,
  imageSrc,
  imageAlt,
  onClick,
  children,
  ...props 
}) => {
  const theme = useTheme();
  
  return (
    <div 
      className="nf-card"
      onClick={onClick}
      style={{
        '--card-bg': theme.colors.background.secondary,
        '--card-padding': theme.spacing.md,
      }}
      {...props}
    >
      {imageSrc && (
        <div className="nf-card__image">
          <img src={imageSrc} alt={imageAlt} />
        </div>
      )}
      <div className="nf-card__content">
        {title && (
          <h3 className="nf-card__title">{title}</h3>
        )}
        {subtitle && (
          <p className="nf-card__subtitle">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
};
```

**Organisms: Complex Patterns**

```javascript
// components/ContentRow/ContentRow.jsx
import React, { useRef, useState } from 'react';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import './ContentRow.css';

export const ContentRow = ({ 
  title, 
  items = [],
  onItemClick,
  onSeeAll
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollAmount = container.offsetWidth * 0.8;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    // Update button states
    setTimeout(() => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.offsetWidth
      );
    }, 300);
  };
  
  return (
    <section className="nf-content-row">
      <div className="nf-content-row__header">
        <h2 className="nf-content-row__title">{title}</h2>
        {onSeeAll && (
          <Button variant="link" onClick={onSeeAll}>
            See All →
          </Button>
        )}
      </div>
      
      <div className="nf-content-row__container">
        {canScrollLeft && (
          <button 
            className="nf-content-row__nav nf-content-row__nav--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}
        
        <div 
          ref={scrollRef}
          className="nf-content-row__scroll"
        >
          {items.map((item, index) => (
            <Card
              key={item.id || index}
              title={item.title}
              subtitle={item.subtitle}
              imageSrc={item.image}
              imageAlt={item.title}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </div>
        
        {canScrollRight && (
          <button 
            className="nf-content-row__nav nf-content-row__nav--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
};
```

---

### 3.4 Performance Optimization

**Tree-Shaking for Minimal Bundle Size**

```javascript
// package.json
{
  "name": "@netflix/hawkins-ui",
  "version": "2.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "sideEffects": [
    "*.css"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./Button": {
      "import": "./dist/components/Button/index.esm.js",
      "require": "./dist/components/Button/index.cjs.js"
    },
    "./Card": {
      "import": "./dist/components/Card/index.esm.js",
      "require": "./dist/components/Card/index.cjs.js"
    }
  }
}

// Usage - Only imports what you need
import { Button } from '@netflix/hawkins-ui/Button';
// Instead of: import { Button } from '@netflix/hawkins-ui';
```

**CSS Extraction and Critical CSS**

```javascript
// build/extractCriticalCSS.js
const critical = require('critical');

const extractCriticalCSS = async (htmlPath) => {
  const { css } = await critical.generate({
    base: 'dist/',
    src: htmlPath,
    target: {
      css: 'critical.css',
      html: htmlPath,
      uncritical: 'rest.css'
    },
    width: 1920,
    height: 1080,
    inline: true // Inline critical CSS
  });
  
  return css;
};
```

**Code Splitting by Route**

```javascript
// App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from '@netflix/hawkins-ui';

// Lazy load route components
const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const Watch = lazy(() => import('./pages/Watch'));

export const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Spinner size="large" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

---

### 3.5 Accessibility (A11y) First

Every component must be accessible by default:

```javascript
// components/Modal/Modal.jsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';

export const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  ...props 
}) => {
  const modalRef = useRef(null);
  
  // Trap focus inside modal
  useEffect(() => {
    if (isOpen) {
      // Store last focused element
      const lastFocused = document.activeElement;
      
      // Set aria-hidden on main content
      document.getElementById('root')?.setAttribute('aria-hidden', 'true');
      
      return () => {
        // Restore focus and aria-hidden
        document.getElementById('root')?.removeAttribute('aria-hidden');
        lastFocused?.focus();
      };
    }
  }, [isOpen]);
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <FocusTrap>
      <div 
        className="nf-modal-overlay"
        onClick={onClose}
        role="presentation"
      >
        <div
          ref={modalRef}
          className="nf-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <div className="nf-modal__header">
            <h2 id="modal-title" className="nf-modal__title">
              {title}
            </h2>
            <button
              className="nf-modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div className="nf-modal__content">
            {children}
          </div>
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
};
```

---

## 4. Real-World Implementation Example

**Complete Netflix-Style Video Card with Hover Effect**

```javascript
// components/VideoCard/VideoCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../ThemeProvider';
import './VideoCard.css';

export const VideoCard = ({ 
  title,
  duration,
  thumbnail,
  previewVideo,
  rating,
  year,
  genres = [],
  onPlay,
  onAddToList,
  ...props 
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  
  // Delay preview video to avoid unnecessary loading
  useEffect(() => {
    if (isHovered) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
        videoRef.current?.play();
      }, 500); // 500ms delay before preview
    } else {
      clearTimeout(hoverTimeoutRef.current);
      setShowPreview(false);
      videoRef.current?.pause();
    }
    
    return () => clearTimeout(hoverTimeoutRef.current);
  }, [isHovered]);
  
  return (
    <div 
      className={`nf-video-card ${isHovered ? 'nf-video-card--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--card-scale': isHovered ? '1.4' : '1',
        '--card-z': isHovered ? '10' : '1',
      }}
      {...props}
    >
      <div className="nf-video-card__image">
        {showPreview && previewVideo ? (
          <video
            ref={videoRef}
            src={previewVideo}
            muted
            loop
            playsInline
            className="nf-video-card__preview"
          />
        ) : (
          <img src={thumbnail} alt={title} />
        )}
      </div>
      
      {isHovered && (
        <div className="nf-video-card__details">
          <div className="nf-video-card__actions">
            <button 
              className="nf-video-card__play-btn"
              onClick={onPlay}
              aria-label={`Play ${title}`}
            >
              ▶
            </button>
            <button 
              className="nf-video-card__add-btn"
              onClick={onAddToList}
              aria-label={`Add ${title} to list`}
            >
              +
            </button>
          </div>
          
          <div className="nf-video-card__metadata">
            <div className="nf-video-card__info">
              <span className="nf-video-card__rating">{rating}% Match</span>
              <span className="nf-video-card__year">{year}</span>
              <span className="nf-video-card__duration">{duration}</span>
            </div>
            <div className="nf-video-card__genres">
              {genres.slice(0, 3).map((genre, i) => (
                <span key={genre} className="nf-video-card__genre">
                  {genre}
                  {i < Math.min(genres.length, 3) - 1 && ' • '}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

**CSS for Netflix-Style Animations**

```css
/* VideoCard.css */
.nf-video-card {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: 
    transform 0.3s cubic-bezier(0.5, 0, 0.1, 1),
    z-index 0s 0.3s;
  transform: scale(var(--card-scale));
  z-index: var(--card-z);
  cursor: pointer;
}

.nf-video-card--hovered {
  transition: 
    transform 0.3s cubic-bezier(0.5, 0, 0.1, 1),
    z-index 0s 0s; /* Remove z-index delay on hover */
}

.nf-video-card__image {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #2f2f2f;
}

.nf-video-card__image img,
.nf-video-card__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nf-video-card__details {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nf-video-card__actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.nf-video-card__play-btn,
.nf-video-card__add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(42, 42, 42, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.nf-video-card__play-btn:hover,
.nf-video-card__add-btn:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  border-color: white;
}

.nf-video-card__metadata {
  color: white;
  font-size: 12px;
}

.nf-video-card__info {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}

.nf-video-card__rating {
  color: #46d369; /* Netflix green */
  font-weight: 700;
}

.nf-video-card__genres {
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## 5. Platform-Specific Adaptations

### 5.1 TV Interface (React TV)

Netflix TV apps use D-pad navigation. Here's how to adapt components:

```javascript
// hooks/useFocusable.js
import { useEffect, useRef } from 'react';

export const useFocusable = (onEnter, onBack) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'Enter':
          onEnter?.();
          break;
        case 'Backspace':
        case 'Escape':
          onBack?.();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // Handle spatial navigation
          e.preventDefault();
          navigateToNextFocusable(e.key);
          break;
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onBack]);
  
  return ref;
};

// components/TVButton/TVButton.jsx
export const TVButton = ({ onClick, children, ...props }) => {
  const buttonRef = useFocusable(onClick);
  
  return (
    <button
      ref={buttonRef}
      className="nf-tv-button"
      tabIndex={0}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 5.2 Mobile Web Optimizations

```javascript
// components/MobileCard/MobileCard.jsx
import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const MobileCard = ({ thumbnail, title, onVisible }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px' // Preload images 100px before viewport
  });
  
  useEffect(() => {
    if (isVisible) {
      onVisible?.();
    }
  }, [isVisible, onVisible]);
  
  return (
    <div ref={ref} className="nf-mobile-card">
      {isVisible && (
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};
```

---

## 6. Developer Experience (DX)

### 6.1 TypeScript Definitions

```typescript
// types/components.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export interface ThemeTokens {
  colors: {
    brand: {
      primary: string;
      secondary: string;
      accent: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      error: string;
    };
    // ... more color tokens
  };
  spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl', string>;
  typography: {
    fontFamily: Record<'primary' | 'secondary', string>;
    fontSize: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl', string>;
    fontWeight: Record<'regular' | 'medium' | 'bold', number>;
    lineHeight: Record<'tight' | 'normal' | 'relaxed', number>;
  };
}
```

### 6.2 Storybook Documentation

```javascript
// Button.stories.jsx
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'link']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export const Primary = {
  args: {
    children: 'Play Now',
    variant: 'primary'
  }
};

export const AllVariants = () => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
);
```

---

## 7. Common Interview Questions

### Q1: How would you handle theming for different regions (e.g., Netflix vs Netflix India)?

**Answer:**
```javascript
// Create region-specific theme overrides
const createRegionalTheme = (region) => {
  const baseTheme = defaultTheme;
  
  const regionalOverrides = {
    'in': { // India
      colors: {
        brand: {
          primary: '#d81f26', // Bollywood red
        }
      },
      typography: {
        fontFamily: {
          primary: 'Noto Sans, sans-serif' // Support for regional languages
        }
      }
    },
    'jp': { // Japan
      colors: {
        brand: {
          primary: '#c11119',
        }
      },
      spacing: {
        // Tighter spacing for denser Japanese text
        md: '12px'
      }
    }
  };
  
  return mergeDeep(baseTheme, regionalOverrides[region] || {});
};

// Usage
<ThemeProvider theme={createRegionalTheme('in')}>
  <App />
</ThemeProvider>
```

### Q2: How do you ensure components are performant when rendering 1000+ video cards?

**Answer:**
Use virtualization with react-window or react-virtuoso:

```javascript
import { FixedSizeGrid } from 'react-window';

const VideoGrid = ({ videos }) => {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 6 + columnIndex; // 6 columns
    const video = videos[index];
    
    if (!video) return null;
    
    return (
      <div style={style}>
        <VideoCard {...video} />
      </div>
    );
  };
  
  return (
    <FixedSizeGrid
      columnCount={6}
      columnWidth={280}
      height={800}
      rowCount={Math.ceil(videos.length / 6)}
      rowHeight={200}
      width={1680}
    >
      {Cell}
    </FixedSizeGrid>
  );
};
```

### Q3: How would you implement A/B testing at the component level?

**Answer:**
```javascript
// Create a feature flag wrapper component
const ABTest = ({ 
  experimentId,
  variant,
  variantA,
  variantB,
  children 
}) => {
  const userVariant = useExperiment(experimentId);
  
  if (userVariant === 'control') {
    return variantA;
  } else if (userVariant === 'treatment') {
    return variantB;
  }
  
  return children;
};

// Usage
<ABTest 
  experimentId="button-color-test"
  variantA={<Button variant="primary">Watch Now</Button>}
  variantB={<Button variant="accent">Watch Now</Button>}
/>
```

### Q4: How do you handle right-to-left (RTL) languages?

**Answer:**
```javascript
// ThemeProvider with RTL support
const ThemeProvider = ({ direction = 'ltr', children }) => {
  useEffect(() => {
    document.dir = direction;
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);
  
  return (
    <ThemeContext.Provider value={{ ...theme, direction }}>
      {children}
    </ThemeContext.Provider>
  );
};

// CSS with logical properties
.nf-button {
  margin-inline-start: 8px; /* Automatically flips in RTL */
  padding-inline: 16px;
  /* Instead of margin-left, padding-left/right */
}
```

### Q5: How would you version components to avoid breaking changes?

**Answer:**
```javascript
// Use semantic versioning and deprecation warnings
// v1/Button.jsx (deprecated)
export const Button = (props) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Button v1 is deprecated. Please migrate to @netflix/ui/v2/Button'
    );
  }
  return <ButtonV1 {...props} />;
};

// v2/Button.jsx (current)
export const Button = (props) => {
  return <ButtonV2 {...props} />;
};

// Package exports
{
  "exports": {
    "./Button": "./dist/v2/Button.js",
    "./v1/Button": "./dist/v1/Button.js",
    "./v2/Button": "./dist/v2/Button.js"
  }
}
```

### Q6: How do you ensure consistent spacing across the app?

**Answer:**
Use a spacing utility that enforces design tokens:

```javascript
// utils/spacing.js
import { theme } from '../tokens';

export const createSpacingUtility = () => {
  const spacingMap = theme.spacing;
  
  return {
    mt: (size) => ({ marginTop: spacingMap[size] }),
    mb: (size) => ({ marginBottom: spacingMap[size] }),
    ml: (size) => ({ marginLeft: spacingMap[size] }),
    mr: (size) => ({ marginRight: spacingMap[size] }),
    mx: (size) => ({ 
      marginLeft: spacingMap[size], 
      marginRight: spacingMap[size] 
    }),
    my: (size) => ({ 
      marginTop: spacingMap[size], 
      marginBottom: spacingMap[size] 
    }),
    p: (size) => ({ padding: spacingMap[size] }),
    px: (size) => ({ 
      paddingLeft: spacingMap[size], 
      paddingRight: spacingMap[size] 
    }),
    py: (size) => ({ 
      paddingTop: spacingMap[size], 
      paddingBottom: spacingMap[size] 
    }),
  };
};

// Usage
const spacing = createSpacingUtility();

<div style={spacing.mt('lg')}>Content</div>
<div style={{ ...spacing.px('md'), ...spacing.py('sm') }}>Content</div>
```

---

## 8. Common Pitfalls & Anti-Patterns

### ❌ Pitfall 1: Hardcoding Values Instead of Using Tokens

```javascript
// ❌ BAD: Hardcoded values
const Card = ({ children }) => (
  <div style={{ 
    padding: '20px',
    backgroundColor: '#2f2f2f',
    color: '#ffffff'
  }}>
    {children}
  </div>
);

// ✅ GOOD: Using design tokens
const Card = ({ children }) => {
  const theme = useTheme();
  
  return (
    <div style={{ 
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary
    }}>
      {children}
    </div>
  );
};
```

**Why it matters:** Hardcoded values make global theme changes impossible and create inconsistencies.

---

### ❌ Pitfall 2: Prop Drilling Instead of Context

```javascript
// ❌ BAD: Passing theme through props everywhere
<App theme={theme}>
  <Header theme={theme}>
    <Navigation theme={theme}>
      <Button theme={theme}>Click</Button>
    </Navigation>
  </Header>
</App>

// ✅ GOOD: Using Context API
<ThemeProvider theme={theme}>
  <App>
    <Header>
      <Navigation>
        <Button>Click</Button>
      </Navigation>
    </Header>
  </App>
</ThemeProvider>
```

**Why it matters:** Prop drilling is verbose, error-prone, and makes refactoring difficult.

---

### ❌ Pitfall 3: Not Planning for Variants

```javascript
// ❌ BAD: Creating separate components for each variant
const PrimaryButton = () => <button className="primary">Click</button>;
const SecondaryButton = () => <button className="secondary">Click</button>;
const GhostButton = () => <button className="ghost">Click</button>;

// ✅ GOOD: Single component with variant prop
const Button = ({ variant = 'primary', children }) => (
  <button className={`button button--${variant}`}>
    {children}
  </button>
);
```

**Why it matters:** Separate components lead to code duplication and maintenance nightmares.

---

### ❌ Pitfall 4: Ignoring Accessibility

```javascript
// ❌ BAD: Non-accessible modal
const Modal = ({ isOpen, children }) => (
  isOpen && (
    <div className="modal">
      <div>{children}</div>
    </div>
  )
);

// ✅ GOOD: Accessible modal
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      const previousFocus = document.activeElement;
      return () => previousFocus?.focus();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <FocusTrap>
      <div 
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal">
          <h2 id="modal-title">{title}</h2>
          {children}
          <button onClick={onClose} aria-label="Close modal">✕</button>
        </div>
      </div>
    </FocusTrap>
  );
};
```

**Why it matters:** Non-accessible components exclude users with disabilities and fail WCAG compliance.

---

## 9. Time & Space Complexity

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| Theme lookup | O(1) | O(1) | Context API provides O(1) access |
| Component render | O(n) | O(n) | Where n = number of children |
| Token calculation | O(1) | O(1) | Memoized theme computation |
| Tree-shaking | O(V + E) | O(V) | Build-time graph traversal |
| CSS-in-JS generation | O(m) | O(m) | Where m = number of style rules |

---

## 10. Summary & Key Takeaways

| Aspect | Implementation | Benefits |
|--------|---------------|----------|
| **Design Tokens** | Single source of truth for all design decisions | Easy theme changes, consistency |
| **Atomic Design** | Components organized by complexity (atoms → organisms) | Reusability, maintainability |
| **Theme Provider** | Context API for global theme access | No prop drilling, better DX |
| **Performance** | Tree-shaking, code-splitting, CSS extraction | Smaller bundles, faster loads |
| **Accessibility** | WCAG 2.1 AA compliance by default | Inclusive, legally compliant |
| **Platform Adapters** | Separate adapters for Web/TV/Mobile | Code reuse across platforms |
| **TypeScript** | Full type safety for all components | Fewer runtime errors, better IDE support |
| **Documentation** | Storybook with interactive examples | Easier adoption, faster onboarding |

### 🎯 Key Principles

1. **Token-First:** All visual decisions should reference design tokens
2. **Composability:** Complex components built from simple primitives
3. **Performance:** Bundle size matters - use tree-shaking and code-splitting
4. **Accessibility:** Not an afterthought, built-in from the start
5. **Developer Experience:** Great DX = faster development = better products
6. **Platform Agnostic:** Core logic separate from rendering layer
7. **Type Safety:** TypeScript catches errors before production
8. **Versioning:** Semantic versioning prevents breaking changes

---

## 📚 Further Reading

- [Netflix TechBlog: Building a Design System](https://netflixtechblog.com/)
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

## Final Thoughts

Netflix's design system is designed to scale across millions of users, hundreds of devices, and dozens of markets. The key to success is:

1. **Start with tokens** - They're the foundation of everything
2. **Think in components** - Atomic design principles work at scale
3. **Optimize aggressively** - Every kilobyte matters for global users
4. **Make it accessible** - It's not optional, it's essential
5. **Great DX = Great UX** - Happy developers build better products

When interviewing, demonstrate that you understand the **trade-offs** between flexibility and constraints, performance and developer experience, consistency and innovation. Show that you can design systems that solve real business problems, not just technical puzzles.
