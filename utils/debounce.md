Here's a clean and robust **debounce** implementation in JavaScript:

---

### ✅ **Debounce Function**

```js
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

---

### 🧠 **How It Works:**

* Clears the previous timer each time the returned function is called.
* Only runs `fn` after `delay` ms  **of inactivity** .
* Preserves `this` and passes all arguments.

---

### 🧪 **Usage Example:**

```js
function onResize() {
  console.log('Resized:', new Date().toISOString());
}

const debouncedResize = debounce(onResize, 300);

window.addEventListener('resize', debouncedResize);
```

---

### ⚙️ Options / Variations:

* **Immediate mode** : call on leading edge instead of trailing.
* **Max wait** : throttle fallback after N ms.


Let’s **dry run** this debounce implementation:

---

### 🧪 Use Case:

```js
function log(msg) {
  console.log(msg);
}

const debouncedLog = debounce(log, 1000);

// Simulate rapid calls:
debouncedLog("A");   // t = 0ms
debouncedLog("B");   // t = 300ms
debouncedLog("C");   // t = 600ms
// Wait... No further calls
```

---

### ⏱️ Dry Run Timeline:

#### t = 0ms → `debouncedLog("A")`

* `timerId` is undefined.
* `clearTimeout(timerId)` → no effect.
* `setTimeout(fn, 1000)` schedules `log("A")` at t=1000ms.

#### t = 300ms → `debouncedLog("B")`

* `clearTimeout(timerId)` → cancels previous timer (`log("A")`)
* `setTimeout(fn, 1000)` schedules `log("B")` at t=1300ms

#### t = 600ms → `debouncedLog("C")`

* `clearTimeout(timerId)` → cancels previous timer (`log("B")`)
* `setTimeout(fn, 1000)` schedules `log("C")` at t=1600ms

---

### ✅ Final Result:

Only **one call** happens:

```
log("C") at t = 1600ms
```

---

### 🔍 Summary:

* Only the **last call** ("C") is executed after 1000ms of silence.
* Intermediate calls are ignored due to timer reset.
* Useful for rate-limiting expensive operations like search, resize, or scroll.


Here's a **React hook** version of `debounce`, clean and idiomatic:

---

### ✅ `useDebounce` Hook

```js
import { useEffect, useRef } from 'react';

function useDebounce(callback, delay, deps = []) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [...deps, delay]);
}
```

---

### 🧪 Example Usage

```js
import React, { useState } from 'react';

function SearchBox() {
  const [query, setQuery] = useState('');

  useDebounce(() => {
    if (query) console.log('Search:', query);
  }, 500, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

---

### 🧠 Notes

* `callback`: function to execute.
* `delay`: debounce duration in ms.
* `deps`: dependency array — hook re-triggers when these change.
* Supports trailing edge by default.
* Leading edge requires a different pattern (custom `useDebouncedCallback`).

---

Let me know if you want:

* A **leading edge** version
* A hook that **returns a debounced callback** instead of executing it directly
