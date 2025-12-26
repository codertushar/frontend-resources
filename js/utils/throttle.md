---
date: 2025-03-27T07:19:24+05:30
description: Limits function execution to once per time period. Critical for scroll tracking, resize handling, and API rate limiting.
premium: true
---
# ⏱️ Throttle Function in JavaScript

> **Interview Importance:** 🔴 Critical — Often asked alongside debounce. Understanding the difference between throttle and debounce is essential for any frontend interview.

---

## 1️⃣ What is Throttle?

**Throttle** ensures a function is called **at most once** in a specified time period. Unlike debounce (which waits for silence), throttle guarantees regular execution during continuous events.

### Real-World Analogy

Think of a machine gun with a rate limiter:
- It can only fire once per second, no matter how fast you pull the trigger
- Even if you hold the trigger continuously, it fires at regular intervals

```
Without Throttle:           With Throttle (100ms):
------------------          ----------------------
Scroll event at 0ms  -> fn   Scroll event at 0ms   -> fn ✓
Scroll event at 10ms -> fn   Scroll event at 10ms  -> (ignored)
Scroll event at 20ms -> fn   Scroll event at 20ms  -> (ignored)
Scroll event at 30ms -> fn   ...
...                         Scroll event at 100ms -> fn ✓
Scroll event at 100ms -> fn  Scroll event at 110ms -> (ignored)
                            ...
100 calls in 1 second!      10 calls in 1 second!
```

---

## 2️⃣ Why Use Throttle?

### Common Use Cases

| Use Case | Problem Without Throttle | Solution With Throttle |
|----------|--------------------------|------------------------|
| **Scroll tracking** | Hundreds of events per scroll | Update at fixed intervals |
| **Resize handling** | Layout calculations on every pixel | Calculate every N ms |
| **Mouse move** | Tracking every pixel movement | Sample position periodically |
| **API rate limiting** | Overwhelming server with requests | Limit request frequency |
| **Game loop** | Inconsistent frame rates | Fixed update intervals |

### Performance Comparison

```javascript
// Scrolling for 2 seconds at ~60 events/second:
// Without throttle: ~120 function calls
// With 100ms throttle: ~20 function calls (83% reduction)
```

---

## 3️⃣ How Throttle Works — Implementation

### Basic Implementation (Leading Edge)

```javascript
function throttle(fn, delay) {
  let lastCall = 0;

  return function(...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

### 🔍 Dry Run: Step-by-Step Execution

```javascript
const log = (msg) => console.log(msg, Date.now());
const throttledLog = throttle(log, 1000);

// Rapid calls:
throttledLog("A");  // t = 0ms
throttledLog("B");  // t = 100ms
throttledLog("C");  // t = 200ms
throttledLog("D");  // t = 1000ms
throttledLog("E");  // t = 1100ms
```

```
Time      | Action                    | lastCall | Condition           | Result
----------|---------------------------|----------|---------------------|--------
0ms       | throttledLog("A")         | 0        | 0 - 0 >= 1000?      |
          |                           |          | = 0 >= 1000? No     |
          | But lastCall starts at 0, |          | First call special: |
          | so 0 - 0 = 0 >= 1000?     |          | Actually, yes!*     | Execute!
          | lastCall = 0              | 0        |                     | log("A")
          |                           |          |                     |
100ms     | throttledLog("B")         | 0        | 100 - 0 >= 1000?    |
          |                           |          | = 100 >= 1000? No   | Ignored
          |                           |          |                     |
200ms     | throttledLog("C")         | 0        | 200 - 0 >= 1000?    |
          |                           |          | = 200 >= 1000? No   | Ignored
          |                           |          |                     |
1000ms    | throttledLog("D")         | 0        | 1000 - 0 >= 1000?   |
          |                           |          | = 1000 >= 1000? Yes | Execute!
          | lastCall = 1000           | 1000     |                     | log("D")
          |                           |          |                     |
1100ms    | throttledLog("E")         | 1000     | 1100 - 1000 >= 1000?|
          |                           |          | = 100 >= 1000? No   | Ignored

* Note: First call passes because lastCall=0 and Date.now() returns
  a timestamp like 1702345678000, so the difference is huge.

Output: "A" at ~0ms, "D" at ~1000ms
```

---

## 4️⃣ Understanding Throttle Variants

### Leading Edge (Default Above)

Executes **immediately** on first call, then waits:

```
Events:    --●--●--●--●--●--●----------●--●--●--
           0                500ms            1000ms

Execution: --●--------------●----------●--------
           0                500ms      1000ms
           (immediate)      (after 500ms delay)
```

### Trailing Edge

Executes **at the end** of the wait period:

```javascript
function throttleTrailing(fn, delay) {
  let lastCall = 0;
  let timerId = null;

  return function(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      clearTimeout(timerId);
      lastCall = now;
      fn.apply(this, args);
    } else if (!timerId) {
      timerId = setTimeout(() => {
        lastCall = Date.now();
        timerId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

### Both Leading and Trailing

```javascript
function throttle(fn, delay, options = { leading: true, trailing: true }) {
  let lastCall = 0;
  let timerId = null;
  let lastArgs = null;

  const invoke = (time) => {
    lastCall = time;
    fn.apply(null, lastArgs);
    lastArgs = null;
  };

  return function(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);
    lastArgs = args;

    if (remaining <= 0) {
      // Time for a new call
      clearTimeout(timerId);
      timerId = null;

      if (options.leading) {
        invoke(now);
      }
    } else if (!timerId && options.trailing) {
      // Schedule trailing call
      timerId = setTimeout(() => {
        invoke(options.leading ? Date.now() : 0);
        timerId = null;
      }, remaining);
    }
  };
}
```

---

## 5️⃣ Complete Production Implementation

```javascript
function throttle(fn, delay, options = {}) {
  const { leading = true, trailing = true } = options;

  let lastCall = 0;
  let timerId = null;
  let lastArgs = null;
  let lastThis = null;

  function invokeFunction(time) {
    lastCall = time;
    fn.apply(lastThis, lastArgs);
    lastArgs = null;
    lastThis = null;
  }

  function throttled(...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    lastArgs = args;
    lastThis = this;

    // First call or enough time has passed
    if (remaining <= 0 || remaining > delay) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      if (leading) {
        invokeFunction(now);
      }
    } else if (!timerId && trailing) {
      // Schedule trailing edge call
      timerId = setTimeout(() => {
        invokeFunction(leading ? Date.now() : 0);
        timerId = null;
      }, remaining);
    }
  }

  // Cancel any pending execution
  throttled.cancel = function() {
    clearTimeout(timerId);
    timerId = null;
    lastArgs = null;
    lastThis = null;
    lastCall = 0;
  };

  return throttled;
}
```

### Usage Examples

```javascript
// Default: leading + trailing
const throttled1 = throttle(handleScroll, 100);

// Leading only: execute immediately, ignore trailing
const throttled2 = throttle(handleScroll, 100, { trailing: false });

// Trailing only: wait until end of period
const throttled3 = throttle(handleScroll, 100, { leading: false });
```

---

## 6️⃣ React Implementations

### useThrottle Hook

```javascript
import { useRef, useCallback, useEffect } from 'react';

function useThrottle(callback, delay) {
  const lastCallRef = useRef(0);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args) => {
    const now = Date.now();

    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callbackRef.current(...args);
    }
  }, [delay]);
}

// Usage:
function ScrollTracker() {
  const throttledScroll = useThrottle((e) => {
    console.log('Scroll position:', window.scrollY);
  }, 100);

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return <div style={{ height: '200vh' }}>Scroll me</div>;
}
```

### useThrottledValue Hook

```javascript
import { useState, useEffect, useRef } from 'react';

function useThrottledValue(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= delay) {
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(value);
      }, delay - timeSinceLastUpdate);

      return () => clearTimeout(timerId);
    }
  }, [value, delay]);

  return throttledValue;
}

// Usage:
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const throttledPosition = useThrottledValue(position, 100);

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <div>Position: {throttledPosition.x}, {throttledPosition.y}</div>;
}
```

---

## 7️⃣ Throttle vs Debounce

| Aspect | Throttle | Debounce |
|--------|----------|----------|
| **When it fires** | At regular intervals | After a pause in calls |
| **Guarantees** | Max N calls per second | Only after silence |
| **Use case** | Scroll, resize, rate limiting | Search input, auto-save |
| **Behavior** | Limits frequency | Waits for inactivity |

### Visual Comparison

```
Events:     --●--●●●●●------●●●------●----------●--------
            0  50        500       700        900ms

Throttle (200ms):
            --●----●----●----●----●----●----●----●------
            0   200  400  500  700  800  900 1000ms
            (fires at regular 200ms intervals during activity)

Debounce (200ms):
            -----------------●-------------●------------●
                            700ms        1100ms      (after)
            (fires 200ms after each pause)
```

### When to Use Which?

| Scenario | Use | Why |
|----------|-----|-----|
| **Search input** | Debounce | Wait for user to stop typing |
| **Scroll position** | Throttle | Need regular updates |
| **Window resize** | Throttle | Calculate layout periodically |
| **Auto-save** | Debounce | Save after user pauses |
| **Button spam** | Throttle | Allow first click, limit rate |
| **Form validation** | Debounce | Validate after input stops |
| **Infinite scroll** | Throttle | Check position regularly |
| **API rate limit** | Throttle | Max N requests per second |

---

## 8️⃣ Common Interview Questions

### Q1: Implement a throttle function

**Answer:** See Section 3 for basic, Section 5 for production.

### Q2: What's the difference between throttle and debounce?

**Answer:**
- **Throttle**: Ensures function runs at most once per interval (rate limiting)
- **Debounce**: Ensures function runs only after a pause (grouping)

```javascript
// Continuous scrolling for 1 second:
// Throttle (100ms): ~10 calls (every 100ms)
// Debounce (100ms): 1 call (100ms after scrolling stops)
```

### Q3: When would you use leading vs trailing edge?

**Answer:**
- **Leading**: When you want immediate response (button clicks, first scroll)
- **Trailing**: When you want the final state (form validation, final scroll position)
- **Both**: When you want immediate + final (tracking with guaranteed last value)

### Q4: How would you implement throttle with requestAnimationFrame?

**Answer:**

```javascript
function throttleRAF(fn) {
  let scheduled = false;

  return function(...args) {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        scheduled = false;
      });
    }
  };
}

// Throttles to ~60fps (16.67ms between calls)
// Best for visual updates (animations, scroll effects)
```

### Q5: How do you test a throttled function?

**Answer:**

```javascript
jest.useFakeTimers();

test('throttle limits call frequency', () => {
  const fn = jest.fn();
  const throttled = throttle(fn, 100);

  // Rapid calls
  throttled('a');  // Should execute (first call)
  throttled('b');  // Should be throttled
  throttled('c');  // Should be throttled

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith('a');

  // Advance time
  jest.advanceTimersByTime(100);

  throttled('d');  // Should execute (100ms passed)
  expect(fn).toHaveBeenCalledTimes(2);
  expect(fn).toHaveBeenLastCalledWith('d');
});
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Creating New Throttled Function Each Render

```javascript
// ❌ BAD: New throttled function each render
function ScrollHandler() {
  const handleScroll = throttle(() => {
    console.log('scroll');
  }, 100);  // Created fresh each render!

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);  // Changes every render!
}

// ✅ GOOD: Stable reference with useMemo
function ScrollHandler() {
  const handleScroll = useMemo(
    () => throttle(() => console.log('scroll'), 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel?.();
    };
  }, [handleScroll]);
}
```

### Pitfall 2: Losing `this` Context

```javascript
// ❌ BAD: Arrow function in throttle loses this
const throttled = throttle(() => {
  console.log(this.value);  // this is wrong!
}, 100);

// ✅ GOOD: Use regular function
const throttled = throttle(function() {
  console.log(this.value);  // this is correct
}, 100);

// ✅ ALSO GOOD: Bind explicitly
const throttled = throttle(this.handler.bind(this), 100);
```

### Pitfall 3: Not Cleaning Up Trailing Timer

```javascript
// ❌ BAD: Timer might fire after component unmounts
useEffect(() => {
  const throttled = throttle(updateState, 100);
  window.addEventListener('scroll', throttled);
  return () => window.removeEventListener('scroll', throttled);
  // Trailing timer might still fire!
}, []);

// ✅ GOOD: Cancel on cleanup
useEffect(() => {
  const throttled = throttle(updateState, 100);
  window.addEventListener('scroll', throttled);
  return () => {
    window.removeEventListener('scroll', throttled);
    throttled.cancel();  // Cancel pending trailing call
  };
}, []);
```

### Pitfall 4: Using Wrong Delay

```javascript
// ❌ BAD: Too short delay defeats purpose
const throttled = throttle(expensiveOperation, 10);  // Only saves 10ms

// ❌ BAD: Too long delay causes poor UX
const throttled = throttle(updatePosition, 500);  // Feels laggy

// ✅ GOOD: Balance performance and UX
const throttled = throttle(updatePosition, 16);   // ~60fps
const throttled = throttle(apiCall, 100);         // Reasonable rate limit
```

---

## 🔟 Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Throttled call** | O(1) | Just checks time and maybe calls fn |
| **Space** | O(1) | Stores lastCall, timerId, lastArgs |
| **setTimeout** | O(1) | Browser handles scheduling |

---

## Summary

| Concept | Description |
|---------|-------------|
| **Throttle** | Limits execution to once per time period |
| **Leading edge** | Execute immediately on first call |
| **Trailing edge** | Execute at end of period |
| **Use cases** | Scroll, resize, rate limiting |
| **Key difference from debounce** | Regular intervals vs waiting for silence |

### Key Takeaways

1. **Throttle limits frequency** — ideal for continuous events
2. **Know leading vs trailing** — understand when each fires
3. **Clean up timers** — cancel on unmount
4. **Use requestAnimationFrame** — for visual updates (~60fps)
5. **Choose the right tool** — throttle for limiting, debounce for grouping

---

## 📚 Further Reading

- [Lodash throttle documentation](https://lodash.com/docs/4.17.15#throttle)
- [CSS-Tricks: Debouncing and Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
