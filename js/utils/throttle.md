# ⏱️ Throttle Function in JavaScript

Here's a **precise throttle implementation** in JavaScript and as a **React hook** — ideal for interviews.

---

## ✅ Implementation (Vanilla JS)

```js
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

---

### 🔁 Example Use

```js
const throttledLog = throttle(() => console.log("Throttled!"), 1000);
window.addEventListener("scroll", throttledLog);
```

---

### ✅ **Throttle as React Hook: `useThrottleCallback`**

```js
import { useRef, useCallback } from 'react';

function useThrottleCallback(callback, delay) {
  const lastCallRef = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}
```

---

### 🧪 React Example

```js
function ScrollLogger() {
  const log = useThrottleCallback(() => {
    console.log("Scroll event throttled at", Date.now());
  }, 1000);

  useEffect(() => {
    window.addEventListener("scroll", log);
    return () => window.removeEventListener("scroll", log);
  }, [log]);

  return <div style={{ height: '200vh' }}>Scroll me</div>;
}
```

---

### 🧠 Summary

* `throttle`: ensures a function is only called once per `delay` ms.
* React hook: stable callback with latest `callback`, preserves identity.
* Both implementations are  **side-effect-free** ,  **GC-safe** , and  **interview-ready** .
