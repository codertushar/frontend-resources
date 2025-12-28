---
date: 2025-12-16T07:13:20+05:30
description: Build cursor tracking systems with position monitoring, visual effects, analytics integration, and performance optimization for interactive web applications.
premium: true
---

# 🖱️ Cursor Tracking: Position Monitoring & Interactive Effects

> **Interview Importance:** 🟡 Important — Cursor tracking appears in 20% of frontend machine coding interviews, testing event handling, performance optimization, debouncing/throttling, and real-time UI updates. Common in companies building interactive experiences or analytics platforms.

---

## 1️⃣ What is Cursor Tracking?

**Cursor Tracking** is the process of monitoring and recording mouse cursor movements, positions, and interactions on a web page. It captures the x and y coordinates of the cursor in real-time and can be used to create interactive visual effects, collect user behavior analytics, implement custom cursors, or build collaborative features.

**Visual Representation:**

```
Browser Window (viewport)
+-----------------------------------------+
|  (0,0)                                  |
|    \                                    |
|                                         |
|           🖱️ (x: 450, y: 320)          |
|              Cursor Position            |
|                                         |
|                                         |
|                              (1920,1080)|
+-----------------------------------------+

Coordinate System:
- Origin (0,0) = Top-left corner
- X increases -> right
- Y increases -> down
- clientX/Y = relative to viewport
- pageX/Y = relative to document (includes scroll)
```

**Real-World Analogy:**

Think of cursor tracking like GPS tracking on your phone. Just as GPS continuously monitors your location to provide navigation or track your running route, cursor tracking monitors the mouse position to enable features like heatmaps showing where users click most, spotlight effects following the cursor, or custom cursors that change based on what you're hovering over.

---

## 2️⃣ Why Use Cursor Tracking? / Why Does This Matter?

| **Use Case** | **Problem** | **Solution with Cursor Tracking** |
|--------------|-------------|-----------------------------------|
| **Spotlight Effects** | Need to highlight area under cursor | Track position and render circular highlight div that follows cursor |
| **Custom Cursors** | Default cursor doesn't match brand/UX | Hide default cursor, render custom element at cursor coordinates |
| **User Analytics** | Don't know where users focus attention | Record cursor movements, generate heatmaps, identify UX issues |
| **Interactive Parallax** | Static backgrounds feel boring | Track cursor position to shift background layers, creating depth |
| **Tooltips & Popovers** | Need contextual information near cursor | Position tooltip elements relative to current cursor coordinates |
| **Drawing/Canvas Apps** | Need to capture user drawing input | Track cursor position and state to draw lines on canvas |
| **Collaborative Tools** | Team members can't see each other's cursors | Broadcast cursor positions via WebSocket, render multiple cursors |
| **Accessibility Testing** | Need to understand user navigation patterns | Record cursor trails to analyze how users explore the interface |

**Performance Benefits:**
- Real-time feedback: Updates at 60fps for smooth user experience
- Optimizable: Can use throttling/debouncing to reduce event frequency (from 100+ events/sec to 10-20)
- Composable: Works with other events (click, scroll, drag) for rich interactions
- Analytics-ready: Captures detailed user behavior data for UX improvements

---

## 3️⃣ How It Works — Basic Implementation

### Simple Cursor Position Display

```javascript
// Basic cursor tracker that displays x, y coordinates
const createCursorTracker = () => {
  // Create display element
  const display = document.createElement('div');
  display.id = 'cursor-position';
  display.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 14px;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(display);
  
  // Track cursor movement
  const handleMouseMove = (event) => {
    const { clientX, clientY, pageX, pageY } = event;
    
    // Update display with current position
    display.innerHTML = `
      <div>Client: (${clientX}, ${clientY})</div>
      <div>Page: (${pageX}, ${pageY})</div>
    `;
  };
  
  // Attach event listener
  document.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    display.remove();
  };
};

// Usage
const cleanup = createCursorTracker();
// Call cleanup() to remove tracker
```

### 🔍 Dry Run: Cursor Position Tracking

**Scenario:** User moves cursor from (100, 100) to (200, 150)

```
Step 1: Initialize tracker
---------------------------------------------------------
  display element created and appended to body
  Event listener attached to document
  State: Waiting for mouse movement
  
Step 2: User moves cursor to (100, 100)
---------------------------------------------------------
  Event: mousemove fired
  event.clientX = 100
  event.clientY = 100
  event.pageX = 100  (no scroll)
  event.pageY = 100  (no scroll)
  Action: display.innerHTML updated
  Display shows: "Client: (100, 100), Page: (100, 100)"
  
Step 3: User moves cursor to (150, 125)
---------------------------------------------------------
  Event: mousemove fired again
  event.clientX = 150
  event.clientY = 125
  event.pageX = 150
  event.pageY = 125
  Action: display.innerHTML updated
  Display shows: "Client: (150, 125), Page: (150, 125)"
  
Step 4: User moves cursor to (200, 150)
---------------------------------------------------------
  Event: mousemove fired again
  event.clientX = 200
  event.clientY = 150
  event.pageX = 200
  event.pageY = 150
  Action: display.innerHTML updated
  Display shows: "Client: (200, 150), Page: (200, 150)"
  
Step 5: User scrolls page down by 500px, cursor at same viewport position
---------------------------------------------------------
  Event: mousemove fired (cursor technically moved in document)
  event.clientX = 200  (viewport position unchanged)
  event.clientY = 150  (viewport position unchanged)
  event.pageX = 200    (document X position same - horizontal scroll is 0)
  event.pageY = 650    (150 + 500 scroll offset)
  Action: display.innerHTML updated
  Display shows: "Client: (200, 150), Page: (200, 650)"
  
Result: Real-time position display tracking both viewport and document coordinates
```

**Key Insight:** The mousemove event fires approximately 60-100 times per second during movement, providing smooth real-time tracking.

---

## 4️⃣ Understanding Key Concepts

### Why Each Part Matters

#### 1. **Event Listener on document vs element**
```javascript
// ✅ GOOD: Track across entire page
document.addEventListener('mousemove', handler);

// ❌ LIMITED: Only tracks within specific element
element.addEventListener('mousemove', handler);
```
**What breaks without it:** If you attach to a specific element, you lose tracking when cursor moves outside that element. Document-level tracking ensures continuous monitoring.

#### 2. **clientX/Y vs pageX/Y vs screenX/Y**
```javascript
event.clientX  // Position relative to viewport (visible window area)
event.clientY  // Best for: positioning fixed elements, tooltips

event.pageX    // Position relative to entire document (includes scroll)
event.pageY    // Best for: absolute positioned elements, analytics

event.screenX  // Position relative to user's physical screen
event.screenY  // Best for: multi-monitor setups, rarely used
```
**What breaks without understanding:** Using clientX for absolute positioned elements causes misalignment when page is scrolled. Using pageX for fixed elements causes them to jump around.

#### 3. **pointer-events: none on tracking elements**
```javascript
display.style.pointerEvents = 'none';
```
**What breaks without it:** The tracking display itself blocks mouse events, creating a "cursor trap" where the cursor appears to flicker or the display blocks interactions with elements beneath it.

#### 4. **Cleanup/Removal**
```javascript
// Always return cleanup function
return () => {
  document.removeEventListener('mousemove', handleMouseMove);
  display.remove();
};
```
**What breaks without it:** Event listeners persist after component unmount, causing memory leaks. Multiple trackers accumulate, degrading performance. Zombie listeners fire for non-existent components.

#### 5. **Edge Cases**
- **Touch devices:** No cursor, events don't fire (need touch events)
- **Cursor leaves window:** Last known position persists
- **High frequency:** 60-100 events/sec can overwhelm slow handlers
- **Passive listeners:** Add `{ passive: true }` for better scroll performance

---

## 5️⃣ Production/Advanced Implementation

### Complete Cursor Tracker with Throttling & Analytics

```javascript
class CursorTracker {
  constructor(options = {}) {
    // Configuration with defaults
    this.config = {
      throttleMs: options.throttleMs || 16,        // ~60fps
      enableAnalytics: options.enableAnalytics || false,
      enableVisual: options.enableVisual || true,
      recordHistory: options.recordHistory || false,
      maxHistorySize: options.maxHistorySize || 1000,
      onMove: options.onMove || null,              // Callback for custom handling
      ...options
    };
    
    // State
    this.position = { x: 0, y: 0, pageX: 0, pageY: 0, timestamp: null };
    this.history = [];
    this.isActive = false;
    this.visualElement = null;
    this.throttleTimer = null;
    this.lastEmitTime = 0;
    
    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }
  
  // Initialize tracker
  init() {
    if (this.isActive) {
      console.warn('CursorTracker: Already initialized');
      return;
    }
    
    // Create visual indicator if enabled
    if (this.config.enableVisual) {
      this.createVisualElement();
    }
    
    // Attach event listeners
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseleave', this.handleMouseLeave);
    document.addEventListener('mouseenter', this.handleMouseEnter);
    
    this.isActive = true;
    console.log('CursorTracker: Initialized');
  }
  
  // Create visual indicator element
  createVisualElement() {
    this.visualElement = document.createElement('div');
    this.visualElement.id = 'cursor-tracker-visual';
    this.visualElement.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.85);
      color: #00ff00;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    document.body.appendChild(this.visualElement);
  }
  
  // Update visual display
  updateVisual() {
    if (!this.visualElement) return;
    
    const { x, y, pageX, pageY, timestamp } = this.position;
    const historySize = this.history.length;
    
    this.visualElement.innerHTML = `
      <div style="margin-bottom: 4px; color: #00ffff;">📍 CURSOR TRACKER</div>
      <div>Viewport: (${x}, ${y})</div>
      <div>Document: (${pageX}, ${pageY})</div>
      <div style="margin-top: 4px; opacity: 0.7;">History: ${historySize} points</div>
    `;
  }
  
  // Throttled mouse move handler
  handleMouseMove(event) {
    const now = Date.now();
    
    // Throttle: only emit at specified interval
    if (now - this.lastEmitTime < this.config.throttleMs) {
      return;
    }
    
    this.lastEmitTime = now;
    
    // Update position
    this.position = {
      x: event.clientX,
      y: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      timestamp: now
    };
    
    // Record to history if enabled
    if (this.config.recordHistory) {
      this.addToHistory(this.position);
    }
    
    // Update visual display
    if (this.config.enableVisual) {
      this.updateVisual();
    }
    
    // Send to analytics if enabled
    if (this.config.enableAnalytics) {
      this.sendAnalytics(this.position);
    }
    
    // Call custom callback if provided
    if (typeof this.config.onMove === 'function') {
      this.config.onMove(this.position);
    }
  }
  
  // Add position to history with size limit
  addToHistory(position) {
    this.history.push({ ...position });
    
    // Trim history if exceeds max size
    if (this.history.length > this.config.maxHistorySize) {
      this.history.shift();
    }
  }
  
  // Handle cursor leaving window
  handleMouseLeave() {
    console.log('CursorTracker: Cursor left window');
  }
  
  // Handle cursor entering window
  handleMouseEnter() {
    console.log('CursorTracker: Cursor entered window');
  }
  
  // Send analytics data (mock implementation)
  sendAnalytics(position) {
    // In production, this would send to your analytics service
    // Examples: Google Analytics, Mixpanel, custom endpoint
    console.log('Analytics:', {
      event: 'cursor_move',
      x: position.x,
      y: position.y,
      timestamp: position.timestamp
    });
  }
  
  // Get current position
  getPosition() {
    return { ...this.position };
  }
  
  // Get movement history
  getHistory() {
    return [...this.history];
  }
  
  // Calculate cursor speed (pixels per second)
  getSpeed() {
    if (this.history.length < 2) return 0;
    
    const recent = this.history.slice(-10);
    let totalDistance = 0;
    
    for (let i = 1; i < recent.length; i++) {
      const dx = recent[i].x - recent[i-1].x;
      const dy = recent[i].y - recent[i-1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    
    const timeSpan = recent[recent.length - 1].timestamp - recent[0].timestamp;
    return (totalDistance / timeSpan) * 1000; // pixels per second
  }
  
  // Get heatmap data (simplified)
  getHeatmapData(gridSize = 50) {
    const heatmap = {};
    
    this.history.forEach(pos => {
      const gridX = Math.floor(pos.x / gridSize);
      const gridY = Math.floor(pos.y / gridSize);
      const key = `${gridX},${gridY}`;
      
      heatmap[key] = (heatmap[key] || 0) + 1;
    });
    
    return heatmap;
  }
  
  // Clear history
  clearHistory() {
    this.history = [];
    console.log('CursorTracker: History cleared');
  }
  
  // Destroy tracker and cleanup
  destroy() {
    if (!this.isActive) return;
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseleave', this.handleMouseLeave);
    document.removeEventListener('mouseenter', this.handleMouseEnter);
    
    // Remove visual element
    if (this.visualElement) {
      this.visualElement.remove();
      this.visualElement = null;
    }
    
    // Clear timers
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer);
    }
    
    // Reset state
    this.history = [];
    this.isActive = false;
    
    console.log('CursorTracker: Destroyed and cleaned up');
  }
}

// -------------------------
// 🧪 Usage Examples
// -------------------------

// Basic usage
const tracker = new CursorTracker({
  throttleMs: 16,           // 60fps
  enableAnalytics: false,
  enableVisual: true,
  recordHistory: true
});
tracker.init();

// With custom callback
const trackerWithCallback = new CursorTracker({
  throttleMs: 50,           // 20fps for better performance
  enableVisual: false,
  onMove: (position) => {
    console.log(`Cursor at (${position.x}, ${position.y})`);
  }
});
trackerWithCallback.init();

// Get analytics data
setTimeout(() => {
  const speed = tracker.getSpeed();
  const heatmap = tracker.getHeatmapData();
  console.log('Cursor speed:', speed, 'px/s');
  console.log('Heatmap data:', heatmap);
}, 5000);

// Cleanup when done
// tracker.destroy();
```

### Additional Features

#### Spotlight Effect Implementation

```javascript
class SpotlightCursor {
  constructor(spotlightRadius = 150) {
    this.radius = spotlightRadius;
    this.spotlight = null;
    this.overlay = null;
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  
  init() {
    // Create dark overlay
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      pointer-events: none;
      z-index: 999998;
    `;
    document.body.appendChild(this.overlay);
    
    // Create spotlight circle
    this.spotlight = document.createElement('div');
    this.spotlight.style.cssText = `
      position: fixed;
      width: ${this.radius * 2}px;
      height: ${this.radius * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%);
      mix-blend-mode: destination-out;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(this.spotlight);
    
    document.addEventListener('mousemove', this.handleMouseMove);
  }
  
  handleMouseMove(event) {
    const { clientX, clientY } = event;
    this.spotlight.style.left = `${clientX}px`;
    this.spotlight.style.top = `${clientY}px`;
  }
  
  destroy() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    if (this.overlay) this.overlay.remove();
    if (this.spotlight) this.spotlight.remove();
  }
}

// Usage
const spotlight = new SpotlightCursor(200);
spotlight.init();
// spotlight.destroy(); // to remove
```

---

## 6️⃣ Real-World Examples

### React Implementation with Hooks

```javascript
import { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook for cursor tracking
const useCursorTracking = (options = {}) => {
  const {
    throttleMs = 16,
    enableHistory = false,
    maxHistorySize = 100
  } = options;
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const historyRef = useRef([]);
  const lastUpdateRef = useRef(0);
  
  const handleMouseMove = useCallback((event) => {
    const now = Date.now();
    
    // Throttle updates
    if (now - lastUpdateRef.current < throttleMs) {
      return;
    }
    
    lastUpdateRef.current = now;
    
    const newPosition = {
      x: event.clientX,
      y: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      timestamp: now
    };
    
    setPosition(newPosition);
    
    // Add to history if enabled
    if (enableHistory) {
      historyRef.current.push(newPosition);
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current.shift();
      }
    }
  }, [throttleMs, enableHistory, maxHistorySize]);
  
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);
  
  return {
    position,
    history: historyRef.current
  };
};

// Component using the hook
const CursorDisplay = () => {
  const { position } = useCursorTracking({ throttleMs: 16 });
  
  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: 5,
      fontFamily: 'monospace',
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      <div>X: {position.x}</div>
      <div>Y: {position.y}</div>
    </div>
  );
};

// Custom cursor component
const CustomCursor = () => {
  const { position } = useCursorTracking({ throttleMs: 8 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);
  
  // Check if hovering over interactive elements
  useEffect(() => {
    const checkHover = () => {
      const elements = document.elementsFromPoint(position.x, position.y);
      const interactive = elements.some(el => 
        el.tagName === 'A' || 
        el.tagName === 'BUTTON' || 
        el.onclick !== null
      );
      setIsHovering(interactive);
    };
    
    checkHover();
  }, [position]);
  
  return (
    <div style={{
      position: 'fixed',
      left: position.x,
      top: position.y,
      width: isHovering ? 40 : 20,
      height: isHovering ? 40 : 20,
      borderRadius: '50%',
      border: '2px solid #00ffff',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 999999,
      transition: 'width 0.2s, height 0.2s',
      mixBlendMode: 'difference'
    }} />
  );
};

export { useCursorTracking, CursorDisplay, CustomCursor };
```

### Trail Effect Component

```javascript
const CursorTrail = () => {
  const [trail, setTrail] = useState([]);
  const maxTrailLength = 20;
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setTrail(prev => {
        const newTrail = [
          ...prev,
          { x: e.clientX, y: e.clientY, id: Date.now() }
        ];
        
        // Keep only last N points
        return newTrail.slice(-maxTrailLength);
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <>
      {trail.map((point, index) => (
        <div
          key={point.id}
          style={{
            position: 'fixed',
            left: point.x,
            top: point.y,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: `rgba(0, 255, 255, ${(index + 1) / maxTrailLength})`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 999999 - index
          }}
        />
      ))}
    </>
  );
};
```

---

## 7️⃣ Common Interview Questions

### Q1: How would you optimize cursor tracking for performance?

**Answer:** Several optimization strategies:

1. **Throttling**: Limit event processing frequency
```javascript
let lastTime = 0;
const throttleMs = 16; // ~60fps

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTime < throttleMs) return;
  lastTime = now;
  // Process event
});
```

2. **Passive event listeners**: Improve scroll performance
```javascript
document.addEventListener('mousemove', handler, { passive: true });
```

3. **RequestAnimationFrame**: Sync with browser paint cycles
```javascript
let rafId = null;
let lastPosition = null;

document.addEventListener('mousemove', (e) => {
  lastPosition = { x: e.clientX, y: e.clientY };
  
  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      updateVisual(lastPosition);
      rafId = null;
    });
  }
});
```

4. **Avoid DOM manipulation in event handler**: Batch updates
5. **Use transform instead of top/left**: Triggers GPU acceleration

### Q2: What's the difference between clientX, pageX, and screenX?

**Answer:**
- **clientX/clientY**: Relative to viewport (visible area). Best for fixed positioned elements like tooltips.
- **pageX/pageY**: Relative to entire document (includes scroll offset). Best for absolute positioned elements.
- **screenX/screenY**: Relative to user's physical screen. Rarely used, helpful for multi-monitor setups.

Example:
```javascript
// If viewport is scrolled 100px down
event.clientX = 200  // Position in visible window
event.pageX = 200    // Same X (no horizontal scroll)
event.clientY = 150  // Position in visible window
event.pageY = 250    // 150 + 100 scroll offset
```

### Q3: How would you implement cursor tracking that works on touch devices?

**Answer:** Use unified event handling for both mouse and touch:

```javascript
const getPosition = (event) => {
  // Touch event
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
  
  // Mouse event
  return {
    x: event.clientX,
    y: event.clientY
  };
};

const handleMove = (event) => {
  const pos = getPosition(event);
  updatePosition(pos);
};

// Listen to both event types
document.addEventListener('mousemove', handleMove);
document.addEventListener('touchmove', handleMove, { passive: false });
```

### Q4: How would you prevent memory leaks in cursor tracking?

**Answer:**

```javascript
class CursorTracker {
  constructor() {
    // Bind methods to preserve context
    this.handleMove = this.handleMove.bind(this);
  }
  
  init() {
    // Store reference for cleanup
    document.addEventListener('mousemove', this.handleMove);
  }
  
  destroy() {
    // Remove event listener using same reference
    document.removeEventListener('mousemove', this.handleMove);
    
    // Clear any timers
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer);
    }
    
    // Remove DOM elements
    if (this.visualElement) {
      this.visualElement.remove();
    }
    
    // Clear history array
    this.history = [];
  }
}
```

Key points:
- Always remove event listeners in cleanup
- Clear timers and intervals
- Remove added DOM elements
- Clear large data structures (history arrays)
- In React, use useEffect cleanup function

### Q5: How would you implement a heatmap from cursor tracking data?

**Answer:**

```javascript
class HeatmapGenerator {
  constructor(gridSize = 50) {
    this.gridSize = gridSize;
    this.heatmapData = new Map();
  }
  
  recordPosition(x, y) {
    // Convert to grid coordinates
    const gridX = Math.floor(x / this.gridSize);
    const gridY = Math.floor(y / this.gridSize);
    const key = `${gridX},${gridY}`;
    
    // Increment count
    const count = this.heatmapData.get(key) || 0;
    this.heatmapData.set(key, count + 1);
  }
  
  generateHeatmap() {
    const maxCount = Math.max(...this.heatmapData.values());
    const heatmap = [];
    
    this.heatmapData.forEach((count, key) => {
      const [x, y] = key.split(',').map(Number);
      const intensity = count / maxCount; // Normalize 0-1
      
      heatmap.push({
        x: x * this.gridSize,
        y: y * this.gridSize,
        intensity,
        count
      });
    });
    
    return heatmap;
  }
  
  renderHeatmap(container) {
    const heatmap = this.generateHeatmap();
    
    heatmap.forEach(cell => {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute;
        left: ${cell.x}px;
        top: ${cell.y}px;
        width: ${this.gridSize}px;
        height: ${this.gridSize}px;
        background: rgba(255, 0, 0, ${cell.intensity * 0.6});
        pointer-events: none;
      `;
      container.appendChild(div);
    });
  }
}
```

### Q6: How would you track cursor speed and acceleration?

**Answer:**

```javascript
class CursorSpeedTracker {
  constructor() {
    this.positions = [];
    this.maxHistorySize = 10;
  }
  
  recordPosition(x, y, timestamp) {
    this.positions.push({ x, y, timestamp });
    
    if (this.positions.length > this.maxHistorySize) {
      this.positions.shift();
    }
  }
  
  getSpeed() {
    if (this.positions.length < 2) return 0;
    
    let totalDistance = 0;
    const positions = this.positions;
    
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x;
      const dy = positions[i].y - positions[i-1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      totalDistance += distance;
    }
    
    const timeSpan = positions[positions.length - 1].timestamp - positions[0].timestamp;
    return (totalDistance / timeSpan) * 1000; // pixels per second
  }
  
  getAcceleration() {
    if (this.positions.length < 3) return 0;
    
    const positions = this.positions;
    const recentSpeeds = [];
    
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x;
      const dy = positions[i].y - positions[i-1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const time = positions[i].timestamp - positions[i-1].timestamp;
      const speed = (distance / time) * 1000;
      recentSpeeds.push(speed);
    }
    
    // Calculate acceleration (change in speed)
    let totalAccel = 0;
    for (let i = 1; i < recentSpeeds.length; i++) {
      totalAccel += recentSpeeds[i] - recentSpeeds[i-1];
    }
    
    return totalAccel / (recentSpeeds.length - 1);
  }
}
```

---

## 8️⃣ Common Pitfalls

### Pitfall 1: Not Throttling Events

❌ **BAD: Processing every mousemove event**
```javascript
// Fires 60-100 times per second!
document.addEventListener('mousemove', (e) => {
  // Heavy DOM manipulation
  updateComplexUI(e.clientX, e.clientY);
  
  // Network request on every move (terrible!)
  fetch('/api/track', {
    method: 'POST',
    body: JSON.stringify({ x: e.clientX, y: e.clientY })
  });
});
```
**Problem:** Causes severe performance degradation. Can freeze UI, drop frames, drain battery, overload server.

✅ **GOOD: Throttled event processing**
```javascript
let lastTime = 0;
const throttleMs = 50; // 20fps, good balance

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTime < throttleMs) return;
  
  lastTime = now;
  updateComplexUI(e.clientX, e.clientY);
});

// Batch API calls every 5 seconds
const positionBuffer = [];
setInterval(() => {
  if (positionBuffer.length > 0) {
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({ positions: positionBuffer })
    });
    positionBuffer.length = 0;
  }
}, 5000);
```

---

### Pitfall 2: Forgetting to Clean Up Event Listeners

❌ **BAD: Memory leak in React component**
```javascript
const CursorTracker = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  // ❌ Event listener never removed!
  useEffect(() => {
    document.addEventListener('mousemove', (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    });
  }, []); // No cleanup function
  
  return <div>X: {pos.x}, Y: {pos.y}</div>;
};
```
**Problem:** Every time component remounts, a new listener is added. After 100 mounts, you have 100 listeners all updating state, causing severe performance issues and memory leaks.

✅ **GOOD: Proper cleanup**
```javascript
const CursorTracker = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    
    document.addEventListener('mousemove', handleMove);
    
    // ✅ Cleanup function removes listener
    return () => {
      document.removeEventListener('mousemove', handleMove);
    };
  }, []);
  
  return <div>X: {pos.x}, Y: {pos.y}</div>;
};
```

---

### Pitfall 3: Using Wrong Coordinate System

❌ **BAD: Using clientX for absolute positioned elements**
```javascript
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute'; // Wrong! Should be 'fixed' for clientX

document.addEventListener('mousemove', (e) => {
  // ❌ Breaks when page is scrolled
  tooltip.style.left = `${e.clientX}px`;
  tooltip.style.top = `${e.clientY}px`;
});
```
**Problem:** When user scrolls page down by 500px, tooltip appears 500px above cursor because clientX/Y is viewport-relative but absolute positioning is document-relative.

✅ **GOOD: Match coordinate system to positioning**
```javascript
const tooltip = document.createElement('div');
tooltip.style.position = 'fixed'; // ✅ Fixed with clientX

document.addEventListener('mousemove', (e) => {
  tooltip.style.left = `${e.clientX}px`;
  tooltip.style.top = `${e.clientY}px`;
});

// OR use absolute with pageX
const absoluteElement = document.createElement('div');
absoluteElement.style.position = 'absolute'; // ✅ Absolute with pageX

document.addEventListener('mousemove', (e) => {
  absoluteElement.style.left = `${e.pageX}px`;
  absoluteElement.style.top = `${e.pageY}px`;
});
```

---

### Pitfall 4: Blocking Interactions with Tracking Elements

❌ **BAD: Tracker blocks mouse events**
```javascript
const tracker = document.createElement('div');
tracker.style.cssText = `
  position: fixed;
  top: 10px;
  left: 10px;
  width: 200px;
  height: 100px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
`;
// ❌ No pointer-events: none
document.body.appendChild(tracker);
```
**Problem:** Tracker blocks clicks and hovers on elements beneath it. Buttons become unclickable, links don't work in that area.

✅ **GOOD: Make tracking elements non-interactive**
```javascript
const tracker = document.createElement('div');
tracker.style.cssText = `
  position: fixed;
  top: 10px;
  left: 10px;
  width: 200px;
  height: 100px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  pointer-events: none; /* ✅ Allows events to pass through */
`;
document.body.appendChild(tracker);
```

---

## 9️⃣ Time & Space Complexity

| **Operation** | **Time Complexity** | **Space Complexity** | **Explanation** |
|---------------|---------------------|----------------------|-----------------|
| **Track single position** | O(1) | O(1) | Simple variable update |
| **Update visual element** | O(1) | O(1) | Direct DOM property modification |
| **Record to history (no limit)** | O(1) amortized | O(n) where n = history size | Array push is O(1), grows linearly |
| **Record to history (with limit)** | O(1) | O(k) where k = max size | Circular buffer or shift when full |
| **Calculate speed from history** | O(h) where h = recent points | O(1) | Loop through recent history |
| **Generate heatmap** | O(n) where n = positions | O(g) where g = grid cells | Grid-based bucketing |
| **Throttled event handling** | O(1) per event | O(1) | Simple timestamp comparison |
| **Render trail effect** | O(t) where t = trail length | O(t) | Create element for each trail point |
| **Cleanup/destroy** | O(1) | O(1) | Remove listener, clear references |

**Key Optimization Notes:**
- Throttling reduces effective events from O(n) to O(n/k) where k is throttle factor
- Using requestAnimationFrame syncs updates with 60fps render cycle (~16ms)
- Map-based heatmap generation is more efficient than array: O(1) lookup vs O(n)
- Passive event listeners don't affect time complexity but improve scroll performance

---

## 🔟 Summary

### Quick Reference Table

| **Feature** | **Use Case** | **Key Technique** |
|-------------|-------------|-------------------|
| Position display | Debug, dev tools | clientX/Y with fixed positioning |
| Custom cursor | Branding, UX enhancement | Hide default cursor, position element at coordinates |
| Spotlight effect | Focus attention, presentations | Overlay with radial gradient at cursor |
| Trail effect | Visual feedback, drawing apps | Array of recent positions with fade effect |
| Heatmap | Analytics, UX research | Grid-based bucketing of positions |
| Speed tracking | Gesture detection, gaming | Calculate distance between recent points |
| Drawing canvas | Signature, whiteboard | Track mousedown/move/up states |

### 5 Key Takeaways

1. **Always throttle or use RAF**: Mousemove fires 60-100x/sec. Throttle to 16ms (60fps) or 50ms (20fps) for complex operations. Use `requestAnimationFrame` for visual updates.

2. **Clean up event listeners**: Memory leaks occur when listeners persist after component unmount. Always return cleanup function in React useEffect or call `removeEventListener` in destroy methods.

3. **Match coordinates to positioning**: Use `clientX/Y` with `fixed` positioning, `pageX/Y` with `absolute` positioning. Mismatches cause position errors when scrolling.

4. **Optimize for performance**: Use `pointer-events: none` on tracking elements, `transform` instead of `top/left`, passive event listeners, and batch API calls instead of sending individually.

5. **Handle edge cases**: Account for touch devices (touchmove events), cursor leaving window (mouseleave), scroll offset differences (clientY vs pageY), and high-frequency event floods.

---

## 📚 Further Reading

- [MDN: MouseEvent API](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) - Complete reference for mouse event properties
- [MDN: Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) - Handling touch input on mobile devices
- [Web.dev: Optimize Input Delay](https://web.dev/optimize-input-delay/) - Performance optimization for input events
- [JavaScript Event Loop Article](../js/general-concepts/event_loop.md) - Understanding event processing
- [Debounce & Throttle Implementation](../js/utils/debounce_throttle.md) - Performance optimization patterns

---

<!-- quiz-start -->
### Q1: What is the key difference between `clientX/clientY` and `pageX/pageY` in mouse events?
- [ ] clientX/Y includes scroll offset, pageX/Y does not
- [x] clientX/Y is relative to viewport, pageX/Y is relative to document (includes scroll)
- [ ] They are identical and can be used interchangeably
- [ ] clientX/Y works only on mobile, pageX/Y only on desktop

### Q2: Why is `pointer-events: none` important for cursor tracking display elements?
- [ ] It improves performance by reducing event calculations
- [ ] It makes the element invisible to screen readers
- [x] It allows mouse events to pass through to elements beneath
- [ ] It enables touch events on the element

### Q3: What is the recommended approach to avoid performance issues when tracking mouse movement?
- [ ] Use setTimeout to delay processing
- [ ] Increase the polling interval to 1 second
- [x] Throttle the event handler to limit processing frequency (e.g., 16ms for 60fps)
- [ ] Disable tracking when the user is scrolling
<!-- quiz-end -->
