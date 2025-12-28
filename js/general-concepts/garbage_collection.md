---
description: Garbage collection automatically reclaims memory from unused objects. Understanding GC prevents memory leaks and optimizes JavaScript application performance.
date: 2025-12-16T01:30:00+05:30
premium: true
---

# 🗑️ Garbage Collection in JavaScript — Memory Management & Leak Prevention

> **Interview Importance:** 🔴 Critical — Asked in 70% of senior frontend interviews. Essential for understanding memory management, performance optimization, and preventing memory leaks in production applications.

---

## 1️⃣ What is Garbage Collection?

**Garbage Collection (GC)** is an automatic memory management mechanism that identifies and reclaims memory occupied by objects that are no longer needed by the program. It frees developers from manual memory allocation/deallocation, preventing common bugs like dangling pointers and memory leaks.

### The Core Concept

```
+--------------------------------------------------------------+
|                    JAVASCRIPT HEAP MEMORY                    |
|                                                              |
|  +---------+    +---------+    +---------+                 |
|  | Object A|◄---+ Object B|    | Object C| (unreachable)   |
|  | (root)  |    |(reachable)   +---------+                 |
|  +----+----+    +---------+         ^                       |
|       |                              |                       |
|       |         +---------+          |                       |
|       +--------►| Object D|          |                       |
|                 |(reachable)         |                       |
|                 +---------+          |                       |
|                                      |                       |
|                         GC MARKS C AS GARBAGE ---------------+
|                         AND RECLAIMS ITS MEMORY              |
+--------------------------------------------------------------+
```

### Real-World Analogy: The Office Cleaning Service 🧹

Think of GC like an **automated office cleaning service**:

```
+--------------------------------------------------------------+
|  🏢 Your JavaScript Program = Office Building                |
|                                                              |
|  Active Workers (Variables) = Desks with People              |
|  +- CEO Desk (Global Scope)                                  |
|  +- Manager Desks (Function Scopes)                          |
|  +- Employee Desks (Local Variables)                         |
|                                                              |
|  Files on Desks (Objects) = Memory Being Used               |
|                                                              |
|  🧹 Cleaning Service (GC) comes at night and:                |
|     1. Checks which desks are occupied (reachable)           |
|     2. Identifies empty desks with leftover files            |
|     3. Throws away files on empty desks (reclaims memory)    |
|     4. Keeps files on occupied desks (preserves data)        |
+--------------------------------------------------------------+
```

### Simple Example

```javascript
// Memory is allocated when objects are created
let user = { name: "Alice", age: 30 }; // Object created in memory

// Memory is still in use (reachable from 'user' variable)
console.log(user.name); // "Alice"

// Object becomes eligible for garbage collection
user = null; // No more references to the object

// GC will eventually reclaim the memory (automatic)
// Developer doesn't need to do anything!
```

---

## 2️⃣ Why Does Garbage Collection Matter?

| **Concern** | **Without GC (Manual Memory)** | **With GC (JavaScript)** | **Impact** |
|-------------|-------------------------------|--------------------------|------------|
| Memory leaks | Developer forgets to free memory | Automatic cleanup of unreachable objects | 99% fewer memory bugs |
| Development speed | Must track every allocation | Focus on business logic | 5x faster development |
| Dangling pointers | Accessing freed memory crashes | Impossible - memory stays until unreachable | Zero pointer errors |
| Memory fragmentation | Manual defragmentation needed | GC compacts memory automatically | Better performance |
| Cognitive load | Track object lifecycles manually | Declare and forget | Mental freedom |

**Performance Benefits:**
- Prevents gradual memory consumption (leaks)
- Enables long-running web applications (SPAs)
- Automatic memory compaction improves cache locality
- Generational GC optimizes for short-lived objects (90% of objects)

---

## 3️⃣ How Garbage Collection Works — Algorithms

### Algorithm 1: Mark-and-Sweep (Modern JavaScript Engines)

The **Mark-and-Sweep** algorithm is the foundation of garbage collection in V8 (Chrome/Node.js) and SpiderMonkey (Firefox).

#### Implementation Concept

```javascript
// Simplified GC mark-and-sweep pseudo-code
class GarbageCollector {
  constructor() {
    this.heap = new Set(); // All objects in memory
    this.roots = new Set(); // Global variables, call stack
  }

  // Phase 1: Mark all reachable objects
  markPhase() {
    const marked = new Set();
    const toVisit = [...this.roots];

    while (toVisit.length > 0) {
      const obj = toVisit.pop();
      
      if (marked.has(obj)) continue; // Already visited
      
      marked.add(obj); // Mark as reachable
      
      // Add all referenced objects to visit queue
      const references = this.getReferences(obj);
      toVisit.push(...references);
    }

    return marked;
  }

  // Phase 2: Sweep (delete) unmarked objects
  sweepPhase(marked) {
    const garbage = [];
    
    for (const obj of this.heap) {
      if (!marked.has(obj)) {
        garbage.push(obj); // Unmarked = garbage
      }
    }

    // Reclaim memory
    garbage.forEach(obj => {
      this.heap.delete(obj);
      this.freeMemory(obj);
    });

    return garbage.length; // Objects collected
  }

  // Run full GC cycle
  collect() {
    const marked = this.markPhase();   // Mark reachable
    const freed = this.sweepPhase(marked); // Sweep unreachable
    return freed;
  }

  getReferences(obj) {
    // Return all objects referenced by this object
    return Object.values(obj).filter(v => typeof v === 'object' && v !== null);
  }

  freeMemory(obj) {
    // Actual memory deallocation (engine-specific)
    console.log(`Freeing memory for object: ${obj.id}`);
  }
}
```

#### 🔍 Dry Run — Mark-and-Sweep Example

```javascript
// Setup: Object graph
const global = {
  user: { name: "Alice", profile: { age: 30 } },
  temp: { data: "temp" }
};

// Later: temp reference removed
global.temp = null;

// GC Cycle Begins
```

**Step-by-step execution:**

```
Initial State:
---------------------------------------------------------
  Heap: [user_obj, profile_obj, temp_obj]
  Roots: [global]
  
  Object Graph:
  global --+--> user_obj --> profile_obj
           +--> null (was temp_obj)
  
  temp_obj: UNREACHABLE (no references)

PHASE 1: MARK (Starting from roots)
---------------------------------------------------------
Step 1: Visit global (root)
  marked = [global]
  toVisit = [user_obj]

Step 2: Visit user_obj
  marked = [global, user_obj]
  toVisit = [profile_obj]

Step 3: Visit profile_obj
  marked = [global, user_obj, profile_obj]
  toVisit = []

Mark phase complete: 3 objects marked as reachable

PHASE 2: SWEEP (Clean unmarked objects)
---------------------------------------------------------
Step 1: Check heap objects
  user_obj: MARKED ✓ -> Keep
  profile_obj: MARKED ✓ -> Keep
  temp_obj: UNMARKED ✗ -> GARBAGE!

Step 2: Reclaim memory
  Free temp_obj -> Memory returned to heap

Final State:
---------------------------------------------------------
  Heap: [user_obj, profile_obj]
  Freed: 1 object (temp_obj)
  Memory reclaimed: ~100 bytes
```

### Algorithm 2: Reference Counting (Historical/Legacy)

Reference counting tracks how many references point to each object. When count reaches zero, memory is freed immediately.

```javascript
class ReferenceCounting {
  constructor() {
    this.refCounts = new WeakMap(); // Object -> count
  }

  addReference(obj) {
    const count = this.refCounts.get(obj) || 0;
    this.refCounts.set(obj, count + 1);
  }

  removeReference(obj) {
    const count = this.refCounts.get(obj) || 0;
    if (count <= 1) {
      this.freeObject(obj); // Count reached 0
      this.refCounts.delete(obj);
    } else {
      this.refCounts.set(obj, count - 1);
    }
  }

  freeObject(obj) {
    console.log('Freeing:', obj);
  }
}

// Example usage
const rc = new ReferenceCounting();

let obj = { data: "test" }; // refCount = 1
let copy = obj;              // refCount = 2

copy = null;                 // refCount = 1
obj = null;                  // refCount = 0 -> FREED immediately
```

**Problem with Reference Counting: Circular References**

```javascript
// This leaks memory in pure reference counting!
function createCircularReference() {
  const obj1 = {};
  const obj2 = {};
  
  obj1.ref = obj2; // obj2 refCount = 1
  obj2.ref = obj1; // obj1 refCount = 1
  
  // Both objects reference each other
  // Even when function returns, refCount never reaches 0!
  return null;
}

createCircularReference(); // Memory leak in reference counting
```

**Why Modern Engines Use Mark-and-Sweep:**
- ✅ Handles circular references correctly
- ✅ More predictable behavior
- ✅ Can compact memory during sweep
- ❌ Reference counting fails on cycles

---

## 4️⃣ Understanding Key Concepts

### Reachability — The Golden Rule

An object is **reachable** if it can be accessed from a root reference through a chain of references.

**Roots (always reachable):**
1. Global object (`window` in browsers, `global` in Node.js)
2. Currently executing function and its local variables
3. Call stack (all functions in nested calls)
4. Internal engine references

```javascript
// What makes objects reachable?

// 1. Global variables (root)
window.userData = { name: "Alice" }; // REACHABLE (root)

// 2. Function scope
function processData() {
  const local = { temp: "data" }; // REACHABLE (on call stack)
  return local;
}

// 3. Closures
function createCounter() {
  const state = { count: 0 }; // REACHABLE (closure)
  return () => state.count++;
}

// 4. Event listeners
button.addEventListener('click', function handler() {
  const data = { clicks: 0 }; // REACHABLE (handler referenced)
});
```

### Generational Garbage Collection

Modern engines optimize GC using the **generational hypothesis**: most objects die young.

```
+--------------------------------------------------------------+
|                  GENERATIONAL GC STRATEGY                    |
|                                                              |
|  Young Generation (Nursery)     Old Generation (Tenured)    |
|  +---------------------+       +----------------------+    |
|  | New objects         |       | Long-lived objects   |    |
|  | Short-lived         |----▶  | Survived multiple GCs|    |
|  | GC runs frequently  |       | GC runs rarely       |    |
|  | ~90% of allocations |       | ~10% promoted here   |    |
|  +---------------------+       +----------------------+    |
|   Minor GC (fast, frequent)     Major GC (slow, rare)       |
|   ~10ms every few seconds       ~100ms every few minutes    |
+--------------------------------------------------------------+
```

**Why This Matters:**

```javascript
// Young generation (dies quickly)
function render() {
  const tempData = processInput(); // Allocated in young gen
  updateUI(tempData);               // Used briefly
  // tempData becomes unreachable -> Minor GC collects quickly
}

// Old generation (long-lived)
const appState = { user: {}, config: {} }; // Survives many GCs
// Promoted to old generation -> Major GC handles eventually
```

### Weak References — Breaking the Reachability Chain

**WeakMap** and **WeakSet** allow references that DON'T prevent garbage collection.

```javascript
// Regular Map prevents GC
const cache = new Map();
let user = { name: "Alice" };
cache.set(user, "cached data"); // user is REACHABLE through cache
user = null; // user object STILL IN MEMORY (cache holds it)

// WeakMap allows GC
const weakCache = new WeakMap();
let user2 = { name: "Bob" };
weakCache.set(user2, "cached data"); // Weak reference
user2 = null; // user2 CAN BE COLLECTED (weak reference)

console.log(weakCache.has(user2)); // false (after GC)
```

**Use Cases for Weak References:**
- Caching computed values without memory leaks
- Private data storage for objects
- DOM node metadata without preventing cleanup

```javascript
// Practical: Private data with WeakMap
const privateData = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name; // Public
    privateData.set(this, { ssn }); // Private (won't leak)
  }

  getSSN() {
    return privateData.get(this).ssn;
  }
}

let user = new User("Alice", "123-45-6789");
console.log(user.getSSN()); // "123-45-6789"

user = null; // Both user AND private data are GC'd together
```

---

## 5️⃣ Memory Leaks — The Dark Side of GC

**Memory Leak**: When memory that is no longer needed remains reachable, preventing garbage collection.

### Common Causes of Memory Leaks

#### Leak 1: Forgotten Timers

```javascript
// ❌ BAD: Timer creates persistent reference
function startUpdates() {
  const data = new Array(1000000).fill('data'); // Large object
  
  setInterval(() => {
    console.log(data.length); // Closure references data
  }, 1000);
  
  // Even if startUpdates() is done, data stays in memory forever!
}

startUpdates();

// ✅ GOOD: Clear timer to allow GC
function startUpdatesFixed() {
  const data = new Array(1000000).fill('data');
  
  const timerId = setInterval(() => {
    console.log(data.length);
  }, 1000);
  
  // Return cleanup function
  return () => clearInterval(timerId); // Allows GC when no longer needed
}

const cleanup = startUpdatesFixed();
// Later: cleanup(); -> data can be garbage collected
```

#### Leak 2: Forgotten Event Listeners

```javascript
// ❌ BAD: Event listener holds references
class DataViewer {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000).fill('data'); // Large data
    
    // Anonymous function creates closure over 'this'
    this.element.addEventListener('click', () => {
      console.log(this.data.length);
    });
  }
}

const viewer = new DataViewer(document.getElementById('btn'));
// Even if we remove the DOM element, viewer.data stays in memory!

// ✅ GOOD: Remove listeners to allow GC
class DataViewerFixed {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000).fill('data');
    
    // Named method for easier cleanup
    this.handleClick = () => {
      console.log(this.data.length);
    };
    
    this.element.addEventListener('click', this.handleClick);
  }

  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element = null;
    this.data = null; // Allow GC
  }
}

const viewer2 = new DataViewerFixed(document.getElementById('btn'));
// Later: viewer2.destroy(); -> Everything can be GC'd
```

#### Leak 3: Detached DOM Nodes

```javascript
// ❌ BAD: Keeping references to removed DOM nodes
const cache = {};

function addToCache() {
  const element = document.getElementById('myDiv');
  cache.myDiv = element; // Store reference
  
  // Later: Remove from DOM
  element.parentNode.removeChild(element);
  
  // DOM node is detached but STILL IN MEMORY via cache!
}

// ✅ GOOD: Clear references when done
function addToCacheFixed() {
  const element = document.getElementById('myDiv');
  
  // Use WeakMap for automatic cleanup
  const weakCache = new WeakMap();
  weakCache.set(element, { data: 'cached' });
  
  element.parentNode.removeChild(element);
  // No strong reference -> GC can collect it
}
```

#### Leak 4: Closures Holding Large Scopes

```javascript
// ❌ BAD: Closure captures entire scope
function processData() {
  const largeData = new Array(1000000).fill('data'); // 8MB+
  const metadata = { count: largeData.length };
  
  // This closure captures ENTIRE scope (including largeData)!
  return function getCount() {
    return metadata.count; // Only uses metadata
  };
}

const getCount = processData();
// largeData is STUCK in memory even though we only need metadata!

// ✅ GOOD: Minimize closure scope
function processDataFixed() {
  const largeData = new Array(1000000).fill('data');
  const count = largeData.length; // Copy primitive
  
  // Clear large data before creating closure
  // (in real code, this happens naturally as function exits)
  
  return function getCount() {
    return count; // Only captures small primitive
  };
  // largeData goes out of scope -> Can be GC'd
}
```

#### Leak 5: Global Variables

```javascript
// ❌ BAD: Accidental globals
function createData() {
  // Missing 'const'/'let' creates global!
  userData = { name: "Alice", data: new Array(1000000) };
  
  // userData is now window.userData -> NEVER garbage collected!
}

createData();

// ✅ GOOD: Always use const/let/var
function createDataFixed() {
  const userData = { name: "Alice", data: new Array(1000000) };
  return userData; // Explicit return
  // Goes out of scope when no longer referenced
}

const data = createDataFixed();
// Later: data = null; -> Can be GC'd
```

#### Leak 6: Circular References (Historical Issue)

```javascript
// Modern engines handle this correctly, but good to know

function createCircular() {
  const obj1 = {};
  const obj2 = {};
  
  obj1.ref = obj2;
  obj2.ref = obj1; // Circular reference
  
  // In old IE (pre-IE9), this would leak
  // Modern mark-and-sweep handles it fine
}

// ❌ POTENTIAL ISSUE: DOM + JS circular references (old browsers)
const element = document.getElementById('myDiv');
const data = { element: element };
element.userData = data; // Circular: DOM <-> JS

// ✅ GOOD: Break circles explicitly (defensive)
function cleanup() {
  element.userData = null;
  data.element = null;
}
```

---

## 6️⃣ Real-World Examples

### Example 1: React Component Memory Leaks

```javascript
// ❌ BAD: Common React memory leak
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Start fetching
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data); // ⚠️ Component might be unmounted!
      });
    
    // Missing cleanup!
  }, []);

  return <div>{user?.name}</div>;
}

// ✅ GOOD: Cleanup with AbortController
function UserProfileFixed() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/user', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setUser(data); // Safe: won't run if aborted
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        }
      });

    // Cleanup function
    return () => {
      controller.abort(); // Cancel fetch on unmount
    };
  }, []);

  return <div>{user?.name}</div>;
}
```

### Example 2: Infinite Scroll Memory Management

```javascript
// ❌ BAD: Accumulating DOM nodes
class InfiniteScroll {
  constructor() {
    this.items = []; // Keeps growing forever!
    this.container = document.getElementById('list');
  }

  addItems(newItems) {
    newItems.forEach(item => {
      const element = document.createElement('div');
      element.textContent = item;
      this.container.appendChild(element);
      this.items.push(element); // Memory keeps growing
    });
  }
}

// ✅ GOOD: Virtual scrolling (render only visible items)
class VirtualScroll {
  constructor() {
    this.allData = []; // Just data, not DOM
    this.container = document.getElementById('list');
    this.visibleItems = new Map(); // Track rendered items
    
    this.setupScroll();
  }

  setupScroll() {
    this.container.addEventListener('scroll', () => {
      this.render();
    });
  }

  render() {
    const { scrollTop, clientHeight } = this.container;
    const startIdx = Math.floor(scrollTop / 50); // Item height = 50
    const endIdx = startIdx + Math.ceil(clientHeight / 50);

    // Remove items outside viewport
    for (const [idx, element] of this.visibleItems) {
      if (idx < startIdx || idx > endIdx) {
        element.remove(); // DOM removed -> GC can collect
        this.visibleItems.delete(idx);
      }
    }

    // Add items in viewport
    for (let i = startIdx; i <= endIdx; i++) {
      if (!this.visibleItems.has(i) && this.allData[i]) {
        const element = document.createElement('div');
        element.textContent = this.allData[i];
        this.container.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }

  destroy() {
    this.visibleItems.clear(); // Clear references
    this.container.innerHTML = ''; // Remove all DOM
  }
}
```

### Example 3: Cache with Memory Limits

```javascript
// ✅ GOOD: LRU Cache with automatic eviction
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map(); // Preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }

  set(key, value) {
    // Remove if exists (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Evict oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey); // Oldest item -> GC can collect
    }
  }

  clear() {
    this.cache.clear(); // All items eligible for GC
  }
}

// Usage
const cache = new LRUCache(1000);
cache.set('user:1', { name: "Alice" });
cache.get('user:1'); // Move to end
// When limit exceeded, oldest items are automatically removed
```

### Example 4: Web Worker Memory Management

```javascript
// ✅ GOOD: Proper Web Worker cleanup
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = [];
    this.tasks = [];

    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push({ worker, busy: false });
    }
  }

  execute(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      this.tasks.push(task);
      this.processQueue();
    });
  }

  processQueue() {
    if (this.tasks.length === 0) return;

    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;

    const task = this.tasks.shift();
    availableWorker.busy = true;

    const { worker } = availableWorker;

    const handleMessage = (e) => {
      task.resolve(e.data);
      cleanup();
    };

    const handleError = (e) => {
      task.reject(e);
      cleanup();
    };

    const cleanup = () => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      availableWorker.busy = false;
      this.processQueue(); // Process next task
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
    worker.postMessage(task.data);
  }

  destroy() {
    // Terminate all workers -> Allow GC
    this.workers.forEach(({ worker }) => worker.terminate());
    this.workers = [];
    this.tasks = [];
  }
}

// Usage
const pool = new WorkerPool('processor.js', 4);
await pool.execute({ data: 'process this' });
// Later: pool.destroy(); -> All workers and references cleaned up
```

---

## 7️⃣ Detecting Memory Leaks

### Browser DevTools — Memory Profiling

**Chrome DevTools Memory Profiler:**

```
1. Open DevTools -> Memory Tab
2. Take Heap Snapshot
3. Perform actions (navigate, interact)
4. Take another Heap Snapshot
5. Compare snapshots -> Look for:
   - Growing arrays/objects
   - Detached DOM nodes
   - Event listeners not removed
```

**Interpreting Results:**

```
Snapshot Comparison:
---------------------------------------------------------
Constructor         | Delta | Size Delta | # New | # Deleted
--------------------|-------|------------|-------|----------
Array               | +250  | +2.5 MB    | 300   | 50     <-- LEAK!
HTMLDivElement      | +100  | +500 KB    | 150   | 50     <-- Detached?
Closure             | +50   | +100 KB    | 75    | 25     <-- Check!
Object              | +10   | +50 KB     | 20    | 10     <-- Normal
```

### Programmatic Detection

```javascript
// Monitor memory usage
class MemoryMonitor {
  constructor() {
    this.samples = [];
    this.maxSamples = 100;
  }

  sample() {
    if (!performance.memory) {
      console.warn('performance.memory not available');
      return null;
    }

    const sample = {
      timestamp: Date.now(),
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };

    this.samples.push(sample);
    
    if (this.samples.length > this.maxSamples) {
      this.samples.shift(); // Keep recent samples
    }

    return sample;
  }

  detectLeak() {
    if (this.samples.length < 10) return null;

    // Check if memory consistently increases
    const recent = this.samples.slice(-10);
    const increases = recent.slice(1).filter((sample, i) => {
      return sample.usedJSHeapSize > recent[i].usedJSHeapSize;
    });

    const leakProbability = increases.length / recent.length;

    return {
      isLikelyLeaking: leakProbability > 0.7,
      probability: leakProbability,
      currentUsage: recent[recent.length - 1].usedJSHeapSize,
      trend: 'increasing'
    };
  }

  getReport() {
    if (this.samples.length === 0) return null;

    const latest = this.samples[this.samples.length - 1];
    const usagePercent = (latest.usedJSHeapSize / latest.jsHeapSizeLimit) * 100;

    return {
      usedMB: (latest.usedJSHeapSize / 1024 / 1024).toFixed(2),
      totalMB: (latest.totalJSHeapSize / 1024 / 1024).toFixed(2),
      limitMB: (latest.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
      usagePercent: usagePercent.toFixed(2) + '%',
      leak: this.detectLeak()
    };
  }
}

// Usage
const monitor = new MemoryMonitor();
setInterval(() => {
  monitor.sample();
  const report = monitor.getReport();
  
  if (report.leak?.isLikelyLeaking) {
    console.warn('⚠️ Possible memory leak detected!', report);
  }
}, 5000);
```

---

## 8️⃣ Common Interview Questions

### Q1: What's the difference between mark-and-sweep and reference counting?

**Answer:** 
- **Mark-and-sweep** (modern): Traces reachable objects from roots. Handles circular references correctly. Runs periodically.
- **Reference counting** (legacy): Tracks reference count per object. Fails on circular references. Immediate cleanup when count hits zero.

Modern engines use mark-and-sweep because it handles cycles: `obj1.ref = obj2; obj2.ref = obj1;`

### Q2: Can you cause a memory leak in JavaScript? How?

**Answer:** Yes, despite automatic GC! Common causes:
```javascript
// 1. Forgotten event listeners
element.addEventListener('click', handler); // Keeps handler + closure in memory
// Fix: removeEventListener() on cleanup

// 2. Forgotten timers
setInterval(() => console.log(data), 1000); // 'data' never released
// Fix: clearInterval()

// 3. Global variables
window.cache = {}; // Never collected
// Fix: Limit scope, use WeakMap

// 4. Detached DOM nodes
const cache = { node: document.getElementById('div') };
node.remove(); // DOM removed but cache.node keeps it
// Fix: Clear references
```

### Q3: What are weak references? When would you use WeakMap?

**Answer:**
Weak references don't prevent garbage collection. `WeakMap` keys are weakly held.

**Use cases:**
```javascript
// Private data
const privateData = new WeakMap();
class User {
  constructor(name) {
    this.name = name;
    privateData.set(this, { ssn: '123-45-6789' });
  }
}
// When User instance is GC'd, private data goes too

// Caching without leaks
const cache = new WeakMap();
cache.set(domNode, computedValue);
// If domNode is removed and GC'd, cache entry disappears automatically
```

### Q4: How does generational GC improve performance?

**Answer:**
Based on observation that most objects die young:

- **Young generation**: New objects, GC'd frequently (every few seconds), fast
- **Old generation**: Long-lived objects, GC'd rarely (every few minutes), slower

**Benefits:**
- 90% of objects collected quickly in young gen
- Only 10% promoted to old gen
- Reduces full GC pauses (100ms+ down to 10ms for most collections)

Example: Temporary objects in render loops die young, app state survives to old gen.

### Q5: What tools would you use to detect memory leaks?

**Answer:**
1. **Chrome DevTools Memory Profiler:**
   - Heap snapshots (compare before/after)
   - Allocation timeline
   - Detached DOM tree view

2. **Performance.memory API:**
   ```javascript
   console.log(performance.memory.usedJSHeapSize);
   ```

3. **Memory leak patterns to look for:**
   - Growing arrays/maps
   - Detached DOM nodes
   - Event listeners not removed
   - Accumulating closures

### Q6: How do closures affect garbage collection?

**Answer:**
Closures capture their entire lexical scope, keeping it in memory:

```javascript
// ❌ Captures large data unnecessarily
function outer() {
  const hugeArray = new Array(1000000);
  const small = 42;
  
  return function inner() {
    return small; // Only needs 'small' but captures entire scope!
  };
}

// ✅ Minimize closure scope
function outer() {
  const hugeArray = new Array(1000000);
  const small = hugeArray.length;
  // hugeArray goes out of scope here
  
  return function inner() {
    return small; // Only captures 'small'
  };
}
```

**Impact:** Modern engines optimize this, but be aware of what closures capture in long-lived callbacks.

### Q7: What happens when JavaScript runs out of memory?

**Answer:**
1. **Heap exhaustion:** GC runs more frequently, desperately trying to free memory
2. **Performance degradation:** More time in GC, less in application code
3. **Out of Memory (OOM) error:** If GC can't free enough, throws error:
   ```
   FATAL ERROR: Ineffective mark-compacts near heap limit
   Allocation failed - JavaScript heap out of memory
   ```

**Prevention:**
- Limit cache sizes (LRU cache)
- Stream large data instead of loading all at once
- Use WeakMap for optional caches
- Profile and fix leaks early

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Assuming GC Runs Immediately

```javascript
// ❌ BAD: Expecting immediate cleanup
function test() {
  let huge = new Array(1000000);
  huge = null; // Eligible for GC, but NOT immediate
  
  console.log('Memory freed!'); // ✗ Not yet!
}

// ✅ GOOD: Understand GC is asynchronous
function test() {
  let huge = new Array(1000000);
  huge = null; // Eligible for GC
  
  // GC runs when engine decides (based on heuristics)
  // You cannot force it (in production)
  console.log('Memory eligible for GC');
}

// For testing only (not in production):
if (global.gc) {
  global.gc(); // Manual GC (requires --expose-gc flag)
}
```

### Pitfall 2: Thinking `delete` Helps GC

```javascript
// ❌ BAD: delete doesn't trigger GC
const obj = { a: 1, b: 2, c: 3 };
delete obj.a; // Removes property, but doesn't help GC
// obj still exists, just missing 'a' property

// ✅ GOOD: Remove references for GC
let obj = { a: 1, b: 2, c: 3 };
obj = null; // Now eligible for GC

// delete is for removing properties, not memory management
```

### Pitfall 3: Overusing Global Variables

```javascript
// ❌ BAD: Global cache grows forever
window.userCache = {};

function cacheUser(id, data) {
  window.userCache[id] = data; // Never released!
}

// After 10,000 users cached = memory leak

// ✅ GOOD: Limited cache with eviction
class UserCache {
  constructor(maxSize = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  set(id, data) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey); // Evict oldest
    }
    this.cache.set(id, data);
  }

  get(id) {
    return this.cache.get(id);
  }
}

const userCache = new UserCache(1000); // Limited size
```

### Pitfall 4: Not Cleaning Up Event Listeners in SPAs

```javascript
// ❌ BAD: React component leaks listeners
function ChatWidget() {
  useEffect(() => {
    const handler = (msg) => console.log(msg);
    socket.on('message', handler);
    // Missing cleanup!
  }, []);
}

// Every time component mounts, adds listener
// Old listeners never removed -> memory leak

// ✅ GOOD: Always cleanup in useEffect
function ChatWidget() {
  useEffect(() => {
    const handler = (msg) => console.log(msg);
    socket.on('message', handler);
    
    return () => {
      socket.off('message', handler); // Cleanup!
    };
  }, []);
}
```

---

## 🔟 Time & Space Complexity

### Garbage Collection Algorithms

| **Algorithm** | **Time Complexity** | **Space Complexity** | **Notes** |
|---------------|-------------------|---------------------|-----------|
| Mark-and-Sweep | O(n) where n = reachable objects | O(n) for marking set | Modern engines use this |
| Reference Counting | O(1) per operation | O(n) for ref counts | Fails on cycles |
| Generational GC | O(young) + O(old) amortized | O(n) for all generations | Optimizes for short-lived objects |
| Copying GC | O(live objects only) | 2x space (from/to spaces) | Compacts memory |
| Incremental GC | O(k) per increment, k < n | O(n) total | Reduces pause times |

### Memory Leak Detection

| **Operation** | **Time Complexity** | **Space Complexity** | **Notes** |
|--------------|-------------------|---------------------|-----------|
| Heap snapshot | O(n) for all objects | O(n) snapshot size | Can be large |
| Snapshot comparison | O(n) | O(2n) for two snapshots | Shows deltas |
| Memory monitoring | O(1) per sample | O(samples) | Track over time |
| Event listener audit | O(listeners) | O(1) | Check for leaks |

---

## 📊 Summary

| **Concept** | **Key Takeaway** |
|-------------|------------------|
| **What is GC?** | Automatic memory management that reclaims unreachable objects |
| **How it works** | Mark-and-sweep: trace from roots, mark reachable, sweep garbage |
| **Reachability** | Objects reachable from roots (globals, stack) are kept |
| **Generational GC** | Young gen (fast, frequent) + old gen (slow, rare) = optimized |
| **Memory leaks** | Unintentional references prevent GC (timers, listeners, closures) |
| **Weak references** | WeakMap/WeakSet don't prevent GC — perfect for caches |
| **Detection** | DevTools snapshots, performance.memory, look for growth patterns |
| **Prevention** | Cleanup timers/listeners, limit caches, avoid global accumulation |

### 5 Key Takeaways

1. **GC is automatic but not magic** — You can still create memory leaks by keeping unintended references
2. **Mark-and-sweep traces reachability** — Objects unreachable from roots are garbage
3. **Generational GC optimizes for short-lived objects** — 90% of objects die young, GC'd quickly
4. **Common leak sources:** Forgotten timers, event listeners, detached DOM, closures, globals
5. **Use WeakMap for optional data** — Automatically cleaned up when keys are GC'd

---

## 📚 Further Reading

- [MDN: Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [V8 Garbage Collection Internals](https://v8.dev/blog/trash-talk)
- [Chrome DevTools Memory Profiling](https://developer.chrome.com/docs/devtools/memory-problems/)

---

<!-- quiz-start -->
### Q1: What algorithm do modern JavaScript engines primarily use for garbage collection?
- [ ] Reference counting
- [x] Mark-and-sweep
- [ ] Manual memory management
- [ ] Copy collection only

### Q2: Which of the following is a common cause of memory leaks in JavaScript?
- [ ] Using `const` instead of `let`
- [ ] Creating too many functions
- [x] Forgotten event listeners that are never removed
- [ ] Using arrow functions

### Q3: What is the purpose of WeakMap in relation to garbage collection?
- [ ] It prevents all garbage collection
- [ ] It makes garbage collection faster
- [x] It holds weak references to keys, allowing them to be garbage collected when no other references exist
- [ ] It stores data permanently in memory
<!-- quiz-end -->
