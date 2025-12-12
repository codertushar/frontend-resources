---
description: Closures allow functions to retain access to outer scope variables. Essential for data privacy, callbacks, and functional programming patterns.
date: 2025-12-11T10:15:15+05:30
---

# 🔒 Closures in JavaScript — The Complete Guide

> **Interview Importance:** 🔴 Critical — Closures are asked in 90% of JavaScript interviews and form the foundation for understanding scope, data privacy, and functional patterns

---

## 1️⃣ What is a Closure?

A **closure** is a function that **remembers** and **has access to** variables from its outer (enclosing) scope, even after the outer function has finished executing.

### The Core Concept

```
┌─────────────────────────────────────────────────────────────┐
│                    OUTER FUNCTION                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Variables: count, name, config                     │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           INNER FUNCTION                    │   │   │
│  │  │                                             │   │   │
│  │  │  Can ACCESS all variables from outer scope  │   │   │
│  │  │  Even AFTER outer function returns! ←───────┼───┼───┤
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Real-World Analogy: The Backpack 🎒

Think of a closure like a **backpack** that a function carries with it:

```
┌──────────────────────────────────────────────────────────────┐
│  👤 Inner Function walks out of Outer Function's house       │
│                                                              │
│  But carries a BACKPACK containing:                          │
│  🎒 ┌─────────────────────────────┐                          │
│     │ • Reference to 'count'       │                         │
│     │ • Reference to 'multiplier'  │                         │
│     │ • Reference to 'secretKey'   │                         │
│     └─────────────────────────────┘                          │
│                                                              │
│  The function can open this backpack ANYTIME                 │
│  and use these variables, even though it left home!          │
└──────────────────────────────────────────────────────────────┘
```

### Simple Example

```javascript
function createGreeter(name) {
  // 'name' is in the outer scope

  return function() {
    // This inner function "closes over" the 'name' variable
    console.log(`Hello, ${name}!`);
  };
}

const greetJohn = createGreeter('John');
const greetJane = createGreeter('Jane');

greetJohn(); // "Hello, John!"
greetJane(); // "Hello, Jane!"

// Even though createGreeter() has finished executing,
// the inner functions still remember their respective 'name' values!
```

---

## 2️⃣ Why Do Closures Matter?

### Use Cases Table

| Problem | Solution with Closures | Example |
|---------|----------------------|---------|
| Need private variables | Encapsulate state that can't be accessed directly | Counter with private count |
| Need to remember state | Function remembers values between calls | Memoization, caching |
| Need factory functions | Create specialized functions from templates | Event handler factories |
| Need partial application | Pre-fill some arguments | Currying utilities |
| Need module pattern | Expose public API, hide internals | Library design |
| Need callback context | Maintain state in async operations | Event listeners |

### Benefits

```
┌─────────────────────────────────────────────────────────────┐
│                   CLOSURE BENEFITS                          │
├─────────────────────────────────────────────────────────────┤
│  ✅ Data Privacy      → Variables can't be accessed from    │
│                         outside                             │
│  ✅ State Persistence → Data survives function execution    │
│  ✅ Function Factories → Create specialized functions       │
│  ✅ Encapsulation     → Hide implementation details         │
│  ✅ Memory Efficient  → Share methods, keep separate state  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ How Closures Work — Implementation

### Basic Implementation: Counter

```javascript
function createCounter() {
  // Private variable - only accessible via the returned functions
  let count = 0;

  // Return an object with methods that "close over" count
  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

// count is NOT accessible directly!
console.log(counter.count); // undefined
```

### 🔍 Dry Run — Step-by-Step Execution

```
INITIAL STATE:
═══════════════════════════════════════════════════════════════

Step 1: createCounter() is called
───────────────────────────────────────────────────────────────
  Memory allocation:
  ┌─────────────────────────────────┐
  │ createCounter Execution Context │
  │ ─────────────────────────────── │
  │ count = 0                       │
  └─────────────────────────────────┘

  Action: Initialize 'count' to 0
  Return: Object with increment, decrement, getCount methods

  Each method has a [[Scope]] property pointing to:
  ┌─────────────────────────────────┐
  │ Closure (createCounter)         │
  │ ─────────────────────────────── │
  │ count: 0                        │
  └─────────────────────────────────┘

Step 2: counter.increment() called
───────────────────────────────────────────────────────────────
  Before: count = 0
  Operation: count += 1
  After: count = 1
  Return value: 1

  Closure state:
  ┌─────────────────────────────────┐
  │ count: 0 → 1                    │
  └─────────────────────────────────┘

Step 3: counter.increment() called again
───────────────────────────────────────────────────────────────
  Before: count = 1
  Operation: count += 1
  After: count = 2
  Return value: 2

  Closure state:
  ┌─────────────────────────────────┐
  │ count: 1 → 2                    │
  └─────────────────────────────────┘

Step 4: counter.decrement() called
───────────────────────────────────────────────────────────────
  Before: count = 2
  Operation: count -= 1
  After: count = 1
  Return value: 1

  Closure state:
  ┌─────────────────────────────────┐
  │ count: 2 → 1                    │
  └─────────────────────────────────┘

Step 5: counter.getCount() called
───────────────────────────────────────────────────────────────
  Current: count = 1
  Action: Read only, no modification
  Return value: 1

FINAL STATE:
═══════════════════════════════════════════════════════════════
  counter object methods still have access to: count = 1
  Direct access to count: IMPOSSIBLE (undefined)
```

---

## 4️⃣ Understanding Key Concepts

### Lexical Scoping — The Foundation of Closures

```javascript
function outer() {
  const outerVar = 'I am outer';

  function middle() {
    const middleVar = 'I am middle';

    function inner() {
      const innerVar = 'I am inner';

      // inner can access ALL variables in the chain
      console.log(innerVar);  // ✅ Own scope
      console.log(middleVar); // ✅ Parent scope
      console.log(outerVar);  // ✅ Grandparent scope
    }

    inner();
  }

  middle();
}
```

### Scope Chain Visualization

```
┌──────────────────────────────────────────────────────────────┐
│ GLOBAL SCOPE                                                 │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ outer() SCOPE                                            │ │
│ │ Variables: outerVar                                      │ │
│ │ ┌──────────────────────────────────────────────────────┐ │ │
│ │ │ middle() SCOPE                                       │ │ │
│ │ │ Variables: middleVar                                 │ │ │
│ │ │ ┌──────────────────────────────────────────────────┐ │ │ │
│ │ │ │ inner() SCOPE                                    │ │ │ │
│ │ │ │ Variables: innerVar                              │ │ │ │
│ │ │ │                                                  │ │ │ │
│ │ │ │ Can access: innerVar ✅                          │ │ │ │
│ │ │ │             middleVar ✅ (via closure)           │ │ │ │
│ │ │ │             outerVar ✅ (via closure)            │ │ │ │
│ │ │ └──────────────────────────────────────────────────┘ │ │ │
│ │ └──────────────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

      Variable Lookup Direction: INSIDE → OUTSIDE (never reverse!)
                                    ↑
                                    │
                                    │
                              Inner looks UP
                              the scope chain
```

### What Makes a Closure?

Three conditions must be met:

```javascript
// Condition 1: A function inside another function
function outer() {
  // Condition 2: Inner function references variables from outer scope
  const message = 'Hello';

  function inner() {
    console.log(message); // References 'message' from outer scope
  }

  // Condition 3: Inner function is accessible outside outer function
  return inner;
}

const closureFunction = outer();
closureFunction(); // "Hello" - Closure in action!
```

### What Breaks Without Closures?

```javascript
// WITHOUT CLOSURE CONCEPT - This wouldn't work
function createCounter() {
  let count = 0;
  return {
    increment() { return ++count; }
  };
}

const counter = createCounter();
// If closures didn't exist:
// counter.increment() → ERROR! 'count' would be garbage collected
// after createCounter() finished executing
```

---

## 5️⃣ Advanced Implementations

### Production-Ready Private State Module

```javascript
/**
 * Creates a secure state container with validation and events
 * @param {*} initialValue - Initial state value
 * @param {Object} options - Configuration options
 */
function createStateContainer(initialValue, options = {}) {
  // === PRIVATE STATE ===
  let state = initialValue;
  let history = [initialValue];
  const listeners = new Set();
  const maxHistoryLength = options.maxHistory || 10;

  // === PRIVATE METHODS ===
  function notifyListeners(newState, oldState) {
    listeners.forEach(listener => {
      try {
        listener(newState, oldState);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  function addToHistory(value) {
    history.push(value);
    if (history.length > maxHistoryLength) {
      history.shift();
    }
  }

  function validateState(value) {
    if (options.validator && !options.validator(value)) {
      throw new Error(`Invalid state value: ${value}`);
    }
    return true;
  }

  // === PUBLIC API ===
  return {
    /**
     * Get current state
     */
    getState() {
      // Return a copy if it's an object to prevent mutation
      return typeof state === 'object' && state !== null
        ? JSON.parse(JSON.stringify(state))
        : state;
    },

    /**
     * Update state with new value
     * @param {*} newValue - New state value or updater function
     */
    setState(newValue) {
      const oldState = state;

      // Support updater function pattern
      const nextValue = typeof newValue === 'function'
        ? newValue(state)
        : newValue;

      // Validate before setting
      validateState(nextValue);

      state = nextValue;
      addToHistory(nextValue);
      notifyListeners(state, oldState);

      return state;
    },

    /**
     * Subscribe to state changes
     * @param {Function} listener - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('Listener must be a function');
      }

      listeners.add(listener);

      // Return unsubscribe function (also a closure!)
      return () => {
        listeners.delete(listener);
      };
    },

    /**
     * Get state history
     */
    getHistory() {
      return [...history];
    },

    /**
     * Reset to initial value
     */
    reset() {
      const oldState = state;
      state = initialValue;
      history = [initialValue];
      notifyListeners(state, oldState);
    }
  };
}

// Usage
const userState = createStateContainer(
  { name: '', loggedIn: false },
  {
    maxHistory: 5,
    validator: (state) => typeof state === 'object'
  }
);

const unsubscribe = userState.subscribe((newState, oldState) => {
  console.log('State changed:', oldState, '→', newState);
});

userState.setState({ name: 'John', loggedIn: true });
console.log(userState.getHistory());
unsubscribe(); // Clean up listener
```

### Function Factory with Closures

```javascript
/**
 * Creates a memoized function with configurable cache
 */
function createMemoizedFunction(fn, options = {}) {
  const cache = new Map();
  const maxSize = options.maxSize || 100;
  let hits = 0;
  let misses = 0;

  function generateKey(args) {
    return options.keyGenerator
      ? options.keyGenerator(args)
      : JSON.stringify(args);
  }

  function memoized(...args) {
    const key = generateKey(args);

    if (cache.has(key)) {
      hits++;
      return cache.get(key);
    }

    misses++;
    const result = fn.apply(this, args);

    // Implement LRU-like behavior
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }

  // Attach utility methods
  memoized.getStats = () => ({ hits, misses, size: cache.size });
  memoized.clear = () => { cache.clear(); hits = 0; misses = 0; };
  memoized.has = (...args) => cache.has(generateKey(args));

  return memoized;
}

// Usage
const expensiveCalculation = createMemoizedFunction((n) => {
  console.log(`Computing fibonacci(${n})...`);
  if (n <= 1) return n;
  return expensiveCalculation(n - 1) + expensiveCalculation(n - 2);
}, { maxSize: 50 });

console.log(expensiveCalculation(10)); // Computes
console.log(expensiveCalculation(10)); // Returns cached
console.log(expensiveCalculation.getStats()); // { hits: 1, misses: X, size: X }
```

---

## 6️⃣ Real-World Examples

### React Hooks Using Closures

```javascript
// useState is implemented using closures!
function useState(initialValue) {
  let state = initialValue;

  function getState() {
    return state;
  }

  function setState(newValue) {
    state = typeof newValue === 'function'
      ? newValue(state)
      : newValue;
    // In real React, this would trigger a re-render
    render();
  }

  return [getState, setState];
}

// Custom hook using closures
function useDebounce(callback, delay) {
  let timeoutId = null;

  return function debouncedFunction(...args) {
    // 'timeoutId' is accessed via closure
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

// Usage in component
function SearchComponent() {
  const [query, setQuery] = useState('');

  // The debounced function closes over 'query'
  const debouncedSearch = useDebounce((searchTerm) => {
    console.log('Searching for:', searchTerm);
    // API call here
  }, 300);

  function handleChange(event) {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  }

  return (
    <input
      type="text"
      value={query()}
      onChange={handleChange}
    />
  );
}
```

### Event Handler Factory

```javascript
// Create specialized event handlers using closures
function createEventHandlerFactory(options = {}) {
  const { preventDefault = true, stopPropagation = false, log = false } = options;

  return function createHandler(actionFn) {
    // Returns a function that closes over actionFn AND options
    return function eventHandler(event) {
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      if (log) console.log('Event triggered:', event.type);

      return actionFn(event);
    };
  };
}

// Usage
const createFormHandler = createEventHandlerFactory({
  preventDefault: true,
  log: true
});

const handleSubmit = createFormHandler((event) => {
  const formData = new FormData(event.target);
  console.log('Form submitted with:', Object.fromEntries(formData));
});

document.querySelector('form').addEventListener('submit', handleSubmit);
```

### Module Pattern

```javascript
// Classic revealing module pattern using closures
const UserModule = (function() {
  // Private variables
  let users = [];
  let idCounter = 0;

  // Private functions
  function generateId() {
    return ++idCounter;
  }

  function findUserIndex(id) {
    return users.findIndex(user => user.id === id);
  }

  // Public API (reveals only what's needed)
  return {
    addUser(name, email) {
      const user = {
        id: generateId(),
        name,
        email,
        createdAt: new Date()
      };
      users.push(user);
      return user;
    },

    getUser(id) {
      const user = users.find(user => user.id === id);
      return user ? { ...user } : null; // Return copy
    },

    removeUser(id) {
      const index = findUserIndex(id);
      if (index !== -1) {
        return users.splice(index, 1)[0];
      }
      return null;
    },

    getAllUsers() {
      return users.map(user => ({ ...user })); // Return copies
    },

    get count() {
      return users.length;
    }
  };
})();

// Usage
UserModule.addUser('John', 'john@example.com');
UserModule.addUser('Jane', 'jane@example.com');
console.log(UserModule.count); // 2
console.log(UserModule.users); // undefined - private!
```

---

## 7️⃣ Closures vs Other Patterns

### Comparison Table

| Feature | Closure | Class | Plain Object |
|---------|---------|-------|--------------|
| Private variables | ✅ True privacy | ⚠️ Convention only (`_var`) | ❌ No |
| Memory per instance | Lower (shared methods) | Higher | Lowest |
| `this` binding issues | ✅ None | ⚠️ Can be tricky | ✅ None |
| Inheritance | ❌ Manual | ✅ Built-in | ❌ No |
| Serializable | ❌ No (functions) | ❌ No | ✅ Yes |
| TypeScript support | ✅ Good | ✅ Excellent | ✅ Good |

### Visual Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOSURE-BASED                                │
├─────────────────────────────────────────────────────────────────┤
│  function createThing() {                                       │
│    let privateData = 'secret';     ← TRUE private              │
│    return {                                                     │
│      getPrivate() { return privateData; }                       │
│    };                                                           │
│  }                                                              │
│                                                                 │
│  const thing = createThing();                                   │
│  thing.privateData   → undefined  ✅ Cannot access             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CLASS-BASED                                  │
├─────────────────────────────────────────────────────────────────┤
│  class Thing {                                                  │
│    #privateData = 'secret';        ← Private field (ES2022)    │
│    _conventionPrivate = 'not really private';                   │
│                                                                 │
│    getPrivate() { return this.#privateData; }                   │
│  }                                                              │
│                                                                 │
│  const thing = new Thing();                                     │
│  thing.#privateData     → SyntaxError  ✅                       │
│  thing._conventionPrivate → 'not really private'  ⚠️           │
└─────────────────────────────────────────────────────────────────┘
```

### When to Use Which

```
Use CLOSURES when:
├── You need true private state
├── You want to avoid 'this' binding issues
├── Creating factory functions
├── Building functional programming patterns
└── Need simple, one-off encapsulation

Use CLASSES when:
├── You need inheritance
├── Working with frameworks expecting classes (React class components)
├── Building complex hierarchies
├── TypeScript static typing is important
└── You need instanceof checks
```

---

## 8️⃣ Common Interview Questions

### Q1: What is a closure? Explain with an example.

**Answer:**
```javascript
// A closure is a function that retains access to its lexical scope
// even when executed outside that scope.

function outer() {
  const secret = 'I am enclosed';

  return function inner() {
    return secret; // Accesses 'secret' via closure
  };
}

const getSecret = outer();
console.log(getSecret()); // 'I am enclosed'
// 'secret' is not accessible directly, but inner() remembers it
```

---

### Q2: What will this code output and why?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

**Answer:**
```
Output: 3, 3, 3

Why? 'var' is function-scoped, not block-scoped.
By the time setTimeout callbacks execute, the loop has finished
and 'i' is 3. All callbacks share the same 'i' reference.

┌────────────────────────────────────────────────────────────┐
│  Loop executes:  i = 0 → 1 → 2 → 3 (exits)                │
│  100ms later:    All callbacks run, all see i = 3         │
└────────────────────────────────────────────────────────────┘

Fix 1: Use 'let' (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

Fix 2: Use closure (IIFE)
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Output: 0, 1, 2
```

---

### Q3: Create a function that can only be called once

**Answer:**
```javascript
function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('Initializing...');
  return 'Initialized!';
});

console.log(initialize()); // "Initializing..." then "Initialized!"
console.log(initialize()); // Just "Initialized!" (no log)
console.log(initialize()); // Just "Initialized!" (no log)
```

---

### Q4: Implement a private counter without using class private fields

**Answer:**
```javascript
function createCounter(initialValue = 0) {
  let count = initialValue; // Private via closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    get: () => count,
    reset: () => { count = initialValue; return count; }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.get());       // 11
console.log(counter.count);       // undefined - truly private!
```

---

### Q5: What's the difference between these two?

```javascript
// Version A
const funcsA = [];
for (var i = 0; i < 3; i++) {
  funcsA.push(function() { return i; });
}

// Version B
const funcsB = [];
for (var i = 0; i < 3; i++) {
  funcsB.push((function(j) {
    return function() { return j; };
  })(i));
}
```

**Answer:**
```
Version A: funcsA[0](), funcsA[1](), funcsA[2]() all return 3
  - All functions share the same 'i' variable reference
  - When called, 'i' has already become 3

Version B: funcsB[0]() = 0, funcsB[1]() = 1, funcsB[2]() = 2
  - IIFE creates a new scope for each iteration
  - Each function closes over its own 'j' value
  - 'j' captures the value of 'i' at that moment

┌─────────────────────────────────────────────────────────────┐
│ Version A (shared reference):                               │
│                                                             │
│   All functions ─────→ [i = 3]                              │
│                                                             │
│ Version B (captured values):                                │
│                                                             │
│   funcsB[0] ─→ [j = 0]                                     │
│   funcsB[1] ─→ [j = 1]                                     │
│   funcsB[2] ─→ [j = 2]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Q6: Implement currying using closures

**Answer:**
```javascript
function curry(fn) {
  return function curried(...args) {
    // If we have enough arguments, call the original function
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    // Otherwise, return a function that collects more arguments
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// Usage
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));     // 6
console.log(curriedAdd(1, 2)(3));     // 6
console.log(curriedAdd(1)(2, 3));     // 6
console.log(curriedAdd(1, 2, 3));     // 6
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Loop Variable Capture

```javascript
// ❌ BAD - All buttons alert "Button 5"
for (var i = 0; i < 5; i++) {
  document.getElementById(`btn-${i}`).onclick = function() {
    alert(`Button ${i}`);
  };
}

// ✅ GOOD - Use let for block scoping
for (let i = 0; i < 5; i++) {
  document.getElementById(`btn-${i}`).onclick = function() {
    alert(`Button ${i}`);
  };
}

// ✅ GOOD - Use closure to capture value
for (var i = 0; i < 5; i++) {
  (function(index) {
    document.getElementById(`btn-${index}`).onclick = function() {
      alert(`Button ${index}`);
    };
  })(i);
}
```

**What Goes Wrong:** With `var`, all click handlers share the same `i` reference. By the time any button is clicked, the loop has finished and `i` equals 5.

---

### Pitfall 2: Memory Leaks with Closures

```javascript
// ❌ BAD - Closure holds reference to large data
function createHandler() {
  const hugeData = new Array(1000000).fill('x'); // 1 million items

  return function handler() {
    // Even if we don't use hugeData, it's still retained!
    console.log('Handler called');
  };
}

// hugeData will never be garbage collected while handler exists

// ✅ GOOD - Only close over what you need
function createHandler() {
  const hugeData = new Array(1000000).fill('x');
  const neededValue = hugeData.length; // Extract only what's needed

  return function handler() {
    console.log(`Handler called, data length was: ${neededValue}`);
  };
}

// hugeData can now be garbage collected
```

**What Goes Wrong:** Closures retain references to their entire outer scope. Large objects that aren't needed should be extracted or set to null.

---

### Pitfall 3: Accidental Closures in Callbacks

```javascript
// ❌ BAD - 'this' context is lost
const obj = {
  name: 'MyObject',
  greet() {
    setTimeout(function() {
      console.log(`Hello from ${this.name}`); // 'this' is undefined/window
    }, 100);
  }
};

// ✅ GOOD - Arrow function preserves 'this'
const objFixed1 = {
  name: 'MyObject',
  greet() {
    setTimeout(() => {
      console.log(`Hello from ${this.name}`); // Works!
    }, 100);
  }
};

// ✅ GOOD - Closure captures 'this' in variable
const objFixed2 = {
  name: 'MyObject',
  greet() {
    const self = this;
    setTimeout(function() {
      console.log(`Hello from ${self.name}`); // Works!
    }, 100);
  }
};
```

**What Goes Wrong:** Regular functions have their own `this` binding. Arrow functions inherit `this` from enclosing scope.

---

### Pitfall 4: Stale Closure in React

```javascript
// ❌ BAD - Stale closure captures initial count
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(count); // Always logs initial value (0)
      setCount(count + 1); // Always sets to 1
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps means closure captures initial count

  return <div>{count}</div>;
}

// ✅ GOOD - Use functional update
function CounterFixed() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => prevCount + 1); // Uses latest value
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>{count}</div>;
}
```

**What Goes Wrong:** The closure in setInterval captures `count` at the time the effect runs. It never sees updated values.

---

## 🔟 Time & Space Complexity

| Operation | Time | Space | Explanation |
|-----------|------|-------|-------------|
| Creating a closure | O(1) | O(n) | n = variables closed over |
| Accessing closed variable | O(1) | O(1) | Direct reference lookup |
| Scope chain lookup | O(k) | O(1) | k = depth of scope chain |
| Garbage collection | O(1)* | O(1) | When all references released |

### Memory Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY LAYOUT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Each closure instance holds:                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Reference to function code (shared across instances)  │   │
│  │ • Reference to [[Scope]] environment (unique per call)  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Memory grows when:                                             │
│  • Creating many closure instances (many createCounter calls)   │
│  • Closing over large objects                                   │
│  • Never releasing references (memory leak)                     │
│                                                                 │
│  Memory is freed when:                                          │
│  • No more references to the closure exist                      │
│  • Closed-over variables become unreachable                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary

### Quick Reference

| Concept | Description |
|---------|-------------|
| **Closure** | Function + Its lexical environment |
| **Lexical Scope** | Scope determined at write-time, not run-time |
| **Scope Chain** | Nested scopes from inner to outer (to global) |
| **Private Variables** | Variables only accessible via closure methods |
| **Stale Closure** | Closure capturing outdated variable values |

### 5 Key Takeaways

1. **Closures Remember** — A closure "remembers" variables from its outer scope even after that scope has finished executing

2. **True Privacy** — Closures provide the only way to create truly private variables in JavaScript (before ES2022 private fields)

3. **Watch the Loop** — Using `var` in loops with closures is a classic bug source; use `let` or IIFE to capture values

4. **Memory Awareness** — Closures prevent garbage collection of closed-over variables; don't close over more than needed

5. **Foundation for Patterns** — Closures enable modules, factories, currying, memoization, and are how React hooks work under the hood

---

## 📚 Further Reading

- [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) — Official documentation with examples
- [JavaScript.info: Closures](https://javascript.info/closure) — In-depth tutorial with visualizations
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md) — Deep dive into JavaScript scoping
