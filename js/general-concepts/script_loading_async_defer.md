# 🔄 Script Loading: async vs defer vs Both

Understanding when to use `async`, `defer`, or both attributes on `<script>` tags to optimize page loading performance and avoid render-blocking issues.

---

## 💡 What are Script Loading Attributes?

Script loading attributes control **how and when** JavaScript files are downloaded and executed, preventing render-blocking and improving page performance.

**Why it matters:** Default `<script>` tags block HTML parsing and rendering, causing slow page loads and poor user experience.

---

## 🧠 Core Concepts

### **Default Behavior (No Attributes)**
```html
<!-- ❌ BLOCKS everything -->
<script src="app.js"></script>
```

**What happens:**
1. HTML parsing stops
2. Script downloads
3. Script executes immediately
4. HTML parsing resumes

**Impact:** Slows First Contentful Paint, blocks rendering.

### **`defer` Attribute**
```html
<!-- ✅ NON-blocking, executes in order -->
<script src="app.js" defer></script>
```

**What happens:**
1. Download starts in parallel with HTML parsing
2. HTML parsing continues uninterrupted
3. Script executes after DOM is complete
4. Multiple deferred scripts run in order

**Best for:** Application scripts that need DOM access.

### **`async` Attribute**
```html
<!-- ✅ NON-blocking, executes immediately when ready -->
<script src="analytics.js" async></script>
```

**What happens:**
1. Download starts in parallel with HTML parsing
2. HTML parsing continues
3. Script executes as soon as download completes
4. May interrupt HTML parsing if downloaded early

**Best for:** Independent scripts (analytics, ads, widgets).

### **`async defer` (Both)**
```html
<!-- ⚠️ NOT RECOMMENDED -->
<script src="script.js" async defer></script>
```

**What happens:** `async` takes precedence, `defer` is ignored. Same as `async` only.

---

## ✅ When to Use Each Approach

### **Use `defer` for:**
- **Application scripts** that manipulate DOM
- **Scripts that depend on each other** (maintains execution order)
- **Scripts that need DOM to be ready**
- **Most JavaScript in modern web apps**

```html
<!-- ✅ Good: Deferred app scripts -->
<script src="react.js" defer></script>
<script src="app.js" defer></script>  <!-- Runs after React -->
<script src="utils.js" defer></script> <!-- Runs in order -->
```

### **Use `async` for:**
- **Analytics and tracking** scripts
- **Social media widgets**
- **Ads and third-party scripts**
- **Independent utilities** that don't need DOM

```html
<!-- ✅ Good: Async independent scripts -->
<script src="analytics.js" async></script>
<script src="facebook-pixel.js" async></script>
<script src="ads.js" async></script>
```

### **Never use both:**
```html
<!-- ❌ Don't do this -->
<script src="script.js" async defer></script>
<!-- Same as async only, defer ignored -->
```

---

## 🧪 Practical Examples

### **E-commerce Site Loading Strategy**

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Critical CSS inline -->
    <style>body{margin:0}.loading{display:block}</style>
</head>
<body>
    <div class="loading">Loading...</div>

    <!-- ✅ Analytics (async - doesn't need DOM) -->
    <script src="analytics.js" async></script>

    <!-- ✅ Framework (defer - needs to load first) -->
    <script src="vue.js" defer></script>

    <!-- ✅ App code (defer - depends on framework) -->
    <script src="app.js" defer></script>

    <!-- ✅ Utilities (defer - may be needed by app) -->
    <script src="utils.js" defer></script>
</body>
</html>
```

### **Blog Site Loading Strategy**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Blog</title>
    <!-- Minimal critical styles -->
</head>
<body>
    <header>Blog Header</header>
    <main>Content loads fast...</main>

    <!-- ✅ Ads (async - independent) -->
    <script src="ads.js" async></script>

    <!-- ✅ Comments widget (async - doesn't block content) -->
    <script src="comments.js" async></script>

    <!-- ✅ Syntax highlighting (defer - needs DOM ready) -->
    <script src="prism.js" defer></script>
</body>
</html>
```

### **Single Page Application (SPA)**

```html
<!DOCTYPE html>
<html>
<head>
    <title>SPA</title>
</head>
<body>
    <div id="app"></div>

    <!-- ✅ All app scripts deferred -->
    <script src="vendor.js" defer></script>
    <script src="app.js" defer></script>
    <script src="routes.js" defer></script>
</body>
</html>
```

---

## ⚠️ Limitations & Considerations

### **Execution Order Issues**
```html
<!-- ❌ Async scripts run out of order -->
<script src="jquery.js" async></script>
<script src="app.js" async></script> <!-- May run before jQuery! -->

<!-- ✅ Defer maintains order -->
<script src="jquery.js" defer></script>
<script src="app.js" defer></script> <!-- Runs after jQuery -->
```

### **DOMContentLoaded Timing**
- **`defer` scripts** run before `DOMContentLoaded` event
- **`async` scripts** may run before or after `DOMContentLoaded`
- **Default scripts** run immediately (block `DOMContentLoaded`)

### **Module Scripts**
```html
<!-- Modern ES modules are deferred by default -->
<script type="module" src="app.js"></script>
<!-- Same as: <script src="app.js" defer></script> -->
```

### **Browser Support**
- **`defer`**: IE 10+, all modern browsers
- **`async`**: IE 10+, all modern browsers
- **Both attributes**: `async` takes precedence in all browsers

---

## 📊 Performance Comparison

| Attribute | Blocks HTML | Blocks Render | Execution Order | DOM Ready | Use Case |
|-----------|-------------|---------------|-----------------|-----------|----------|
| **None** | ✅ Yes | ✅ Yes | ✅ Ordered | ❌ Before | Legacy code |
| **`defer`** | ❌ No | ❌ No | ✅ Ordered | ✅ After | App scripts |
| **`async`** | ❌ No | ⚠️ Maybe | ❌ Unordered | ❓ Unpredictable | Widgets/ads |

---

## 🔍 Summary

- **`defer`**: Use for application JavaScript that needs DOM access and execution order
- **`async`**: Use for independent scripts like analytics, ads, and third-party widgets
- **Never both**: `async defer` is invalid - `async` takes precedence
- **Default**: Avoid unless you have legacy requirements

**Key Rule:** If script needs DOM or depends on other scripts → `defer`. If script is independent → `async`.

---

## 🌐 Related Resources

- [Browser Rendering Path](../general/browser_rendering.md) - How scripts affect rendering
- [Critical Rendering Path](../general/critical_rendering_path.md) - Advanced optimization
- [ES6 Modules](es6_modules.md) - Modern module loading
- [Promises](../promises/) - Async JavaScript patterns
