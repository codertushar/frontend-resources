# 🌐 Browser Rendering: How Browsers Display Web Pages

Here's the **full detailed flow** of how a browser renders a webpage, from receiving HTML to displaying pixels. This includes networking, parsing, DOM/CSSOM construction, layout, painting, and compositing.

> **📚 Want Deep Dive Details?** See [Critical Rendering Path](./critical_rendering_path.md) for comprehensive coverage of CRP, optimization strategies, and performance metrics.

---

## 💡 Understanding Render-Blocking

**Render-blocking** means the browser **pauses page rendering** and waits for a resource to be downloaded and processed before continuing. This delays when users see content on their screen.

**Key Render-Blocking Resources:**
- **CSS** (`<link rel="stylesheet">`) - Blocks rendering until parsed
- **JavaScript** (default `<script>`) - Blocks HTML parsing AND rendering
- **Fonts** (some scenarios) - Can delay text rendering
- **Images** - Generally don't block rendering (lazy load by default)

**Impact:** Every render-blocking resource adds time to **First Contentful Paint (FCP)** and **Largest Contentful Paint (LCP)**.

---

## 🧠 Full Webpage Rendering Flow

### 1. **Browser Requests Page**

* **DNS Lookup:** Translates domain to IP.
* **TCP Connection:** Handshake with server.
* **HTTP Request:** Browser sends `GET /` for HTML.

---

### 2. **Server Responds with HTML**

* Browser starts receiving HTML **as a stream** (not all at once).
* **Parsing begins immediately** as data arrives.

---

### 3. **HTML Parsing → DOM Tree**

* HTML is parsed **token by token** by the  **HTML parser** .
* Browser builds the  **DOM tree** :
  * `<html> → <head> + <body> → nested elements`
  * Each tag becomes a  **node** .
* **Render-blocking factor:** HTML parsing **does NOT block rendering by itself** unless a render-blocking resource is encountered (CSS or JS).

---

### 4. **CSS Parsing → CSSOM Tree** ⚠️ RENDER-BLOCKING

* `<link rel="stylesheet">` or `<style>` tags trigger **CSS download** and parsing.
* Builds a **CSSOM** (CSS Object Model) representing styles.

**Why CSS blocks rendering:**
- Browser needs all styles before creating render tree
- Without styles, content would render unstyled, then flash with styles (FOUC - Flash of Unstyled Content)
- **Blocks rendering** until CSSOM is complete

**Examples:**
```html
<!-- ✅ BLOCKING: Render waits for styles.css -->
<link rel="stylesheet" href="styles.css">

<!-- ⚠️ BLOCKING until parsed -->
<style>
  body { font-size: 16px; }
</style>

<!-- ✅ NOT BLOCKING: Print stylesheet (no block) -->
<link rel="stylesheet" href="print.css" media="print">
```

---

### 5. **JavaScript Execution** ⚠️ RENDER-BLOCKING (Default)

* `<script>` tags pause parsing unless marked `async` or `defer`.
* JS can:
  * Modify DOM (`document.createElement()`)
  * Block rendering (non-deferred scripts)
  * Trigger reflows and repaints

**Why JavaScript blocks rendering:**

Default behavior (no attributes):
```html
<!-- ❌ BLOCKING: HTML parsing STOPS -->
<script src="app.js"></script>
```

**Flow:**
1. HTML parser encounters `<script>` tag
2. **Pauses HTML parsing** (parsing is blocked)
3. **Downloads** `app.js`
4. **Executes** JavaScript (JS blocks can modify DOM/CSS)
5. Resumes HTML parsing

**With `defer` attribute - Does NOT block rendering:**
```html
<!-- ✅ NOT BLOCKING: HTML parsing continues -->
<script src="app.js" defer></script>
```

Flow:
1. Download starts **in parallel** with HTML parsing
2. HTML parsing **continues uninterrupted**
3. After HTML parsing complete → Script executes
4. Does NOT block rendering

**With `async` attribute - Does NOT block HTML parsing:**
```html
<!-- ✅ NOT BLOCKING HTML: Executes as soon as ready -->
<script src="analytics.js" async></script>
```

Flow:
1. Download starts **in parallel**
2. HTML parsing **continues**
3. When download completes → Script executes immediately
4. May interrupt rendering if not yet complete

**Comparison:**
```javascript
// ❌ BLOCKS HTML PARSING & RENDERING
<script src="heavy-calculation.js"></script>

// ✅ ALLOWS HTML PARSING & RENDERING
<script src="heavy-calculation.js" defer></script>

// ✅ RUNS ASAP BUT ALLOWS INITIAL RENDERING
<script src="analytics.js" async></script>
```

---

### 6. **DOM + CSSOM → Render Tree**

* Combines structure (DOM) + styles (CSSOM) into  **render tree** :
  * Excludes invisible elements (`display: none`)
  * Each node has style and layout info
* **Cannot start** until:
  - DOM has content to render
  - CSSOM is complete (because rendering needs all styles)

---

### 7. **Layout (Reflow)**

* Browser calculates:
  * Exact positions
  * Sizes
  * Box model for each render tree node
* Outputs a **layout box** for each visible node
* **This is an expensive operation** - causes reflows when triggered multiple times

---

### 8. **Painting**

* Render tree is **converted to pixels** on screen.
* Backgrounds, borders, text, shadows drawn.
* **Triggered by:** Style changes that don't affect layout (color, opacity, etc.)

---

### 9. **Compositing**

* Layers (e.g., with z-index, transforms) are  **stacked and blended** .
* Final bitmap sent to GPU for rendering.
* **GPU-accelerated** (most efficient rendering method)

---

### 10. **Displayed on Screen**

* Page becomes visible to the user.
* **First Contentful Paint (FCP)** - First pixels visible
* **Largest Contentful Paint (LCP)** - Largest element visible

---

## 🔁 Optimization Cycles

* **Reflow:** When DOM or styles change, layout recalculates. **Expensive operation.**
* **Repaint:** When only visuals (e.g., color) change, not layout. **Less expensive.**
* **Compositing-only updates** : GPU re-blends layers without layout/paint. **Most efficient.**

---

## 📊 Render-Blocking Resources Summary

| Resource | Blocks HTML Parsing | Blocks Rendering | Solution |
|----------|-------------------|------------------|----------|
| **CSS** (`<link>`) | ❌ No | ✅ Yes | Inline critical CSS, defer non-critical |
| **JS** (default) | ✅ Yes | ✅ Yes | Use `defer` or `async` |
| **JS** (`defer`) | ❌ No | ❌ No* | Ideal for most scripts |
| **JS** (`async`) | ❌ No | ❌ No* | Best for non-critical (analytics) |
| **Images** | ❌ No | ❌ No | Lazy load below fold |
| **Fonts** | ❌ No | ⚠️ Partial | Use `font-display: swap` |

*Will execute when downloaded; if downloaded before rendering completes, may delay initial render.

---

## 🧭 Visual Diagram

Here's a diagram capturing the above flow:

```plaintext
## 🧭 Browser Rendering Timeline (Text Diagram)

```plaintext
Time → →

1. ┌──────────────────────────┐
   │ Browser sends HTTP GET   │
   └──────────────────────────┘

2. ┌──────────────────────────┐
   │ Starts receiving HTML     │
   └──────────────────────────┘
            ↓
3. ┌──────────────────────────┐
   │ HTML Parsing Starts       │
   └──────────────────────────┘
            ↓
4. ┌──────────────┐     ┌────────────────────┐
   │ <link> tag   │ --> │ CSS fetch & parse  │
   └──────────────┘     └────────────────────┘
            ↓
5. ┌──────────────┐     ┌────────────────────────────┐
   │ <script> tag │ --> │ Depends on attributes:     │
   └──────────────┘     │                            │
                        │ • No attr:                 │
                        │   - Block HTML parsing     │
                        │   - Fetch JS               │
                        │   - Execute immediately    │
                        │                            │
                        │ • defer:                   │
                        │   - Fetch in parallel      │
                        │   - Wait until DOM ready   │
                        │   - Execute *in order*     │
                        │                            │
                        │ • async:                   │
                        │   - Fetch in parallel      │
                        │   - Execute *as soon* as   │
                        │     downloaded             │
                        │   - Does NOT wait for DOM  │
                        │   - Executes out-of-order  │
                        └────────────────────────────┘
            ↓
6. ┌──────────────────────────────┐
   │ HTML Parsing Finishes        │
   │ DOM Tree is complete         │
   └──────────────────────────────┘
            ↓
7. ┌──────────────────────────────┐
   │ CSSOM Construction Complete  │
   └──────────────────────────────┘
            ↓
8. ┌──────────────────────────────┐
   │ Render Tree Built (DOM + CSS)│
   └──────────────────────────────┘
            ↓
9. ┌──────────────────────────────┐
   │ Layout (Reflow)              │
   └──────────────────────────────┘
            ↓
10.┌──────────────────────────────┐
   │ Paint                        │
   └──────────────────────────────┘
            ↓
11.┌──────────────────────────────┐
   │ Compositing (layers, GPU)    │
   └──────────────────────────────┘
            ↓
12.┌──────────────────────────────┐
   │ First Pixels Displayed       │
   └──────────────────────────────┘

──────────── EVENTS & TIMING ─────────────
- Scripts with no attr **block parsing** → also block rendering.
- CSS blocks rendering → Creates FOUC risk if not handled.
- `defer` scripts run **after DOM complete**, before `DOMContentLoaded`.
- `async` scripts can interrupt rendering, run **as soon as ready**.
- `DOMContentLoaded` fires **after DOM is ready**, **before** `load`.
- `load` fires **after** all resources (images, CSS, etc.) are loaded.
```

---

## ✅ Render-Blocking Strategies

### **Minimize CSS Render-Blocking**
```html
<!-- ❌ Blocks rendering until downloaded -->
<link rel="stylesheet" href="all-styles.css">

<!-- ✅ Inline critical CSS (above-the-fold) -->
<style>
  body { margin: 0; }
  header { background: #333; color: white; }
</style>

<!-- ✅ Defer non-critical CSS -->
<link rel="stylesheet" href="non-critical.css" media="print">

<!-- ✅ Load secondary CSS asynchronously -->
<link rel="preload" href="styles2.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### **Eliminate JavaScript Render-Blocking**
```html
<!-- ❌ BLOCKS RENDERING (default) -->
<script src="app.js"></script>

<!-- ✅ RECOMMENDED: Deferred execution -->
<script src="app.js" defer></script>

<!-- ✅ For analytics/tracking (non-critical) -->
<script src="analytics.js" async></script>

<!-- ✅ For third-party (non-critical) -->
<script src="ads.js" async></script>
```

### **Font Loading Optimization**
```html
<!-- ✅ Tell browser font will be needed -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- ✅ Font-display strategy: Show fallback immediately -->
<style>
  @font-face {
    font-family: 'MyFont';
    src: url('font.woff2') format('woff2');
    font-display: swap; /* Use fallback, swap when ready */
  }
</style>
```

---

## 🎮 Interactive Examples

### **Try It Yourself: Render-Blocking Demo**

```html
<!-- Copy this HTML and save as test.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Render-Blocking Demo</title>

    <!-- ⚠️ RENDER-BLOCKING: This CSS delays rendering -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">

    <style>
        body { font-family: Arial; padding: 20px; }
        .demo-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .blocking { background: #ffebee; border-color: #f44336; }
        .non-blocking { background: #e8f5e8; border-color: #4caf50; }
    </style>
</head>
<body>
    <h1>🔍 Render-Blocking Resources Demo</h1>

    <div class="demo-section blocking">
        <h3>⚠️ Blocking Resources (Delays Rendering)</h3>
        <p>This text appears AFTER Bootstrap CSS loads...</p>
        <button class="btn btn-primary">Bootstrap Button</button>
    </div>

    <!-- ❌ BLOCKING JavaScript (default) -->
    <script>
        console.log('Blocking script executed - page rendering was paused');
        // Simulate slow script (uncomment to test)
        // for(let i = 0; i < 100000000; i++) {}
    </script>

    <div class="demo-section non-blocking">
        <h3>✅ Non-Blocking Resources</h3>
        <p>This content loads immediately!</p>
    </div>

    <!-- ✅ NON-BLOCKING JavaScript -->
    <script async src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>

    <div class="demo-section">
        <h3>🧪 Test Different Loading Strategies</h3>
        <p>Open DevTools → Network tab → Check "Disable cache" → Reload</p>
        <p>Watch how different resources affect First Contentful Paint!</p>
    </div>
</body>
</html>
```

### **Performance Comparison Tool**

```javascript
// Add this to your page to measure render-blocking impact
(function() {
    const startTime = performance.now();

    // Track when page becomes visible
    new PerformanceObserver((list) => {
        const fcp = list.getEntries()[0];
        console.log(`🚀 First Contentful Paint: ${fcp.startTime.toFixed(2)}ms`);

        // Check if we have render-blocking resources
        const resources = performance.getEntriesByType('resource');
        let blockingTime = 0;

        resources.forEach(resource => {
            if (resource.name.includes('.css') || resource.name.includes('.js')) {
                const loadTime = resource.responseEnd - resource.requestStart;
                console.log(`📦 ${resource.name.split('/').pop()}: ${loadTime.toFixed(2)}ms`);

                // Estimate blocking time (simplified)
                if (resource.initiatorType === 'link' || resource.initiatorType === 'script') {
                    blockingTime += loadTime;
                }
            }
        });

        console.log(`⚠️ Estimated render-blocking time: ${blockingTime.toFixed(2)}ms`);
        console.log(`📊 Total page load: ${(performance.now() - startTime).toFixed(2)}ms`);
    }).observe({ entryTypes: ['paint'] });
})();
```

---

## ♿ Accessibility Impact of Render-Blocking

### **How Render-Blocking Affects Assistive Technologies**

```javascript
// Screen readers and other assistive technologies:
// 1. Wait for DOM to be complete
// 2. Parse content in document order
// 3. Announce content as it becomes available

// ❌ Render-blocking delays content announcement
// User hears nothing while waiting for CSS/JS

// ✅ Non-blocking allows progressive content access
// Screen reader can start reading immediately
```

### **Accessibility Best Practices**

```html
<!-- ✅ Critical accessibility styles inline -->
<style>
  /* Ensure focus indicators are visible immediately */
  *:focus { outline: 2px solid #007acc; outline-offset: 2px; }

  /* Screen reader only content visible immediately */
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }

  /* Skip links work immediately */
  .skip-link {
    position: absolute;
    top: -40px; left: 6px;
    background: #000; color: #fff;
    padding: 8px; text-decoration: none;
  }
  .skip-link:focus { top: 6px; }
</style>

<!-- ✅ Defer non-critical accessibility enhancements -->
<link rel="stylesheet" href="accessibility-enhancements.css" media="print" onload="this.media='all'">
```

### **Progressive Enhancement for Accessibility**

```javascript
// Load accessibility features progressively
function loadAccessibilityFeatures() {
  // Load after critical content
  import('./accessibility.js').then(module => {
    module.init();
  });
}

// Wait for page to be interactive
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAccessibilityFeatures);
} else {
  loadAccessibilityFeatures();
}
```

---

## 🌐 Network & CDN Optimization

### **CDN Selection for Render-Blocking Resources**

```javascript
// Choose CDNs based on render-blocking impact:

// ✅ LOW RISK: Use CDN for non-critical resources
// Analytics, tracking, social widgets
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

// ⚠️ MEDIUM RISK: Use CDN for framework libraries
// Consider self-hosting for better control
<script src="https://unpkg.com/react@18/umd/react.production.min.js" defer></script>

// ❌ HIGH RISK: Avoid CDN for critical CSS
// Self-host critical resources
<link rel="stylesheet" href="/css/critical.css">

// ✅ BEST: Use CDN with fallbacks
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
```

### **Network Condition Handling**

```javascript
// Detect network conditions and adjust loading strategy
function getConnectionSpeed() {
  const connection = navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) return 'unknown';

  // 2G, slow-2g, 2g, 3g, 4g
  return connection.effectiveType;
}

function loadResourcesBasedOnNetwork() {
  const speed = getConnectionSpeed();

  if (speed === 'slow-2g' || speed === '2g') {
    // Minimal resources for slow connections
    loadCriticalOnly();
  } else if (speed === '3g') {
    // Progressive loading
    loadCriticalThenEnhance();
  } else {
    // Full experience for fast connections
    loadEverything();
  }
}

window.addEventListener('load', loadResourcesBasedOnNetwork);
```

---

## 📋 Summary

| Stage              | Blocking | Parallel | Ordered | When Executes        |
| ------------------ | -------- | -------- | ------- | -------------------- |
| `<script>`       | ✅ Yes   | ❌ No    | ✅ Yes  | Immediately (blocks) |
| `<script defer>` | ❌ No    | ✅ Yes   | ✅ Yes  | After DOM complete   |
| `<script async>` | ❌ No    | ✅ Yes   | ❌ No   | When ready (early)   |
