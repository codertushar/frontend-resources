Here’s the **full detailed flow** of how a browser renders a webpage, from receiving HTML to displaying pixels. This includes networking, parsing, DOM/CSSOM construction, layout, painting, and compositing.

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

---

### 4. **CSS Parsing → CSSOM Tree**

* `<link rel="stylesheet">` or `<style>` tags trigger **CSS download** and parsing.
* Builds a **CSSOM** (CSS Object Model) representing styles.

---

### 5. **JavaScript Execution**

* `<script>` tags pause parsing unless marked `async` or `defer`.
* JS can:
  * Modify DOM (`document.createElement()`)
  * Block rendering (non-deferred scripts)
  * Trigger reflows and repaints

---

### 6. **DOM + CSSOM → Render Tree**

* Combines structure (DOM) + styles (CSSOM) into  **render tree** :
  * Excludes invisible elements (`display: none`)
  * Each node has style and layout info

---

### 7. **Layout (Reflow)**

* Browser calculates:
  * Exact positions
  * Sizes
  * Box model for each render tree node
* Outputs a **layout box** for each visible node

---

### 8. **Painting**

* Render tree is **converted to pixels** on screen.
* Backgrounds, borders, text, shadows drawn.

---

### 9. **Compositing**

* Layers (e.g., with z-index, transforms) are  **stacked and blended** .
* Final bitmap sent to GPU for rendering.

---

### 10. **Displayed on Screen**

* Page becomes visible to the user.

---

## 🔁 Optimization Cycles

* **Reflow:** When DOM or styles change, layout recalculates.
* **Repaint:** When only visuals (e.g., color) change, not layout.
* **Compositing-only updates** : GPU re-blends layers without layout/paint.

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
- Scripts with no attr block parsing.
- `defer` scripts run **after DOM complete**, before `DOMContentLoaded`.
- `async` scripts can interrupt rendering, run **as soon as ready**.
- `DOMContentLoaded` fires **after DOM is ready**, **before** `load`.
- `load` fires **after** all resources (images, CSS, etc.) are loaded.
```

---

## Summary

| Stage              | Blocking | Parallel | Ordered | When Executes        |
| ------------------ | -------- | -------- | ------- | -------------------- |
| `<script>`       | ✅ Yes   | ❌ No    | ✅ Yes  | Immediately (blocks) |
| `<script defer>` | ❌ No    | ✅ Yes   | ✅ Yes  | After DOM complete   |
| `<script async>` | ❌ No    | ✅ Yes   | ❌ No   | When ready (early)   |
