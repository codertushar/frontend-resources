---
date: 2025-12-16T01:29:00+00:00
description: Master JavaScript's Event Loop - the heart of asynchronous execution. Understand how the call stack, task queue, and microtask queue work together to handle async operations.
---

# ⚡ JavaScript Event Loop: Complete Guide to Asynchronous Execution

> **Interview Importance:** 🔴 Critical — The Event Loop is asked in 85% of JavaScript interviews. Understanding it is essential for explaining how async code works, debugging timing issues, and architecting performant applications.

---

## 1️⃣ What is the Event Loop?

The **Event Loop** is JavaScript's mechanism for handling asynchronous operations in a single-threaded environment. It continuously monitors the call stack and task queues, executing code in a specific order to create the illusion of concurrent execution.

**Visual Representation:**

```
+---------------------------------------------------------------+
|                    JAVASCRIPT RUNTIME                         |
|                                                               |
|  +---------------------+    +---------------------------+   |
|  |    Call Stack       |    |   Web APIs / Node APIs     |   |
|  |                     |    |                            |   |
|  |  main()             |    |  • setTimeout()            |   |
|  |  v foo()            |    |  • fetch()                 |   |
|  |  v bar()            |    |  • DOM events              |   |
|  |                     |    |  • Promises                |   |
|  +---------------------+    +---------------------------+   |
|            ^                            v                     |
|            |                            |                     |
|            |                   Callbacks Ready                |
|            |                            v                     |
|  +---------+----------------------------+--------------+    |
|  |              EVENT LOOP (Coordinator)                |    |
|  |                                                      |    |
|  |  Checks: Is call stack empty?                       |    |
|  |  Yes? -> Move task from queue to call stack          |    |
|  +------------------------------------------------------+    |
|            ^                                                  |
|  +---------+-------------+    +--------------------------+  |
|  |  Microtask Queue      |    |   Macrotask Queue        |  |
|  |  (Higher Priority)    |    |   (Lower Priority)       |  |
|  |                       |    |                          |  |
|  |  • Promise callbacks  |    |  • setTimeout callbacks  |  |
|  |  • queueMicrotask()   |    |  • setInterval callbacks |  |
|  |  • MutationObserver   |    |  • I/O operations        |  |
|  |  • process.nextTick() |    |  • UI rendering          |  |
|  +-----------------------+    +--------------------------+  |
+---------------------------------------------------------------+
```

### Real-World Analogy: Restaurant Kitchen 🍳

Imagine a restaurant kitchen with one chef (single-threaded JavaScript):

```
+--------------------------------------------------------------+
|  🧑‍🍳 CHEF (Call Stack)                                         |
|  Currently cooking dishes one at a time                      |
|                                                              |
|  📋 ORDER SLIPS (Task Queues)                                |
|  +--------------------+    +----------------------------+   |
|  |  VIP Orders        |    |  Regular Orders            |   |
|  |  (Microtasks)      |    |  (Macrotasks)              |   |
|  |  • Appetizers      |    |  • Main courses            |   |
|  |  • Quick fixes     |    |  • Desserts                |   |
|  +--------------------+    +----------------------------+   |
|                                                              |
|  🔄 MANAGER (Event Loop)                                     |
|  Watches chef and decides what to cook next:                 |
|  1. Let chef finish current dish                            |
|  2. Check VIP orders first (microtasks)                     |
|  3. Then regular orders (macrotasks)                        |
|  4. Repeat                                                  |
+--------------------------------------------------------------+
```

The chef can't cook multiple dishes simultaneously, but the manager ensures orders are handled efficiently by prioritizing and coordinating work.

---

## 2️⃣ Why Does This Matter?

### Common Use Cases

| **Problem** | **Why Event Loop Matters** | **Real Example** |
|------------|---------------------------|------------------|
| API calls blocking UI | Event loop delegates I/O to browser APIs, keeping UI responsive | `fetch()` doesn't freeze the page |
| Animation frame timing | Event loop schedules rendering between tasks | `requestAnimationFrame()` |
| User input responsiveness | Events queue up without blocking execution | Click handlers work during loading |
| Promise resolution order | Microtask queue ensures promises resolve before next task | `.then()` runs before `setTimeout()` |
| Debouncing/throttling | Understanding timing helps optimize performance | Search autocomplete |
| Race conditions | Knowing execution order prevents bugs | Multiple async state updates |

### Performance Benefits

```
Without Event Loop (Blocking):
User clicks button -> Wait 5s for API -> UI frozen -> User frustrated

With Event Loop (Non-blocking):
User clicks button -> API request sent to Web API -> UI stays responsive
-> User can scroll, type -> API response ready -> Callback executes
-> UI updates -> Happy user!
```

---

## 3️⃣ How It Works — Execution Order

### Basic Implementation Visualization

```javascript
// Example demonstrating execution order
console.log('1: Synchronous start');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('4: Synchronous end');

// OUTPUT:
// 1: Synchronous start
// 4: Synchronous end
// 3: Microtask (Promise)
// 2: Macrotask (setTimeout)
```

### 🔍 Dry Run: Event Loop Execution

**Code:**
```javascript
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

setTimeout(() => console.log('Timeout 2'), 0);

console.log('End');
```

**Step-by-Step Execution:**

```
INITIAL STATE:
---------------------------------------------------------
Call Stack:        [global execution context]
Microtask Queue:   []
Macrotask Queue:   []
Output:            []


STEP 1: console.log('Start')
---------------------------------------------------------
Call Stack:        [global, console.log]
Action:            Execute synchronous code
Output:            ['Start']


STEP 2: setTimeout(..., 0)
---------------------------------------------------------
Call Stack:        [global, setTimeout]
Action:            Register callback with Web API, returns immediately
Macrotask Queue:   [() => console.log('Timeout 1')]
Call Stack:        [global]  <-- setTimeout popped off


STEP 3: Promise.resolve().then(...)
---------------------------------------------------------
Call Stack:        [global, Promise.resolve().then]
Action:            Promise already resolved, queue microtask
Microtask Queue:   [() => console.log('Promise 1')]
Call Stack:        [global]  <-- Promise.then popped off


STEP 4: Second setTimeout
---------------------------------------------------------
Call Stack:        [global, setTimeout]
Action:            Register second callback
Macrotask Queue:   [
                     () => console.log('Timeout 1'),
                     () => console.log('Timeout 2')
                   ]
Call Stack:        [global]


STEP 5: console.log('End')
---------------------------------------------------------
Call Stack:        [global, console.log]
Action:            Execute synchronous code
Output:            ['Start', 'End']
Call Stack:        [global]


STEP 6: Global execution context completes
---------------------------------------------------------
Call Stack:        []  <-- NOW EMPTY!
Event Loop:        Checks call stack, finds it empty
                   Checks Microtask Queue FIRST


STEP 7: Execute all microtasks
---------------------------------------------------------
Microtask Queue:   [() => console.log('Promise 1')]
Call Stack:        [() => console.log('Promise 1')]
Action:            Execute microtask
Output:            ['Start', 'End', 'Promise 1']
Call Stack:        []

Action:            First .then() creates second .then()
Microtask Queue:   [() => console.log('Promise 2')]
Call Stack:        [() => console.log('Promise 2')]
Output:            ['Start', 'End', 'Promise 1', 'Promise 2']
Call Stack:        []


STEP 8: Microtask queue empty, check Macrotask queue
---------------------------------------------------------
Macrotask Queue:   [
                     () => console.log('Timeout 1'),
                     () => console.log('Timeout 2')
                   ]
Call Stack:        [() => console.log('Timeout 1')]
Action:            Execute first macrotask
Output:            ['Start', 'End', 'Promise 1', 'Promise 2', 'Timeout 1']
Call Stack:        []


STEP 9: Check microtasks again (none), execute next macrotask
---------------------------------------------------------
Call Stack:        [() => console.log('Timeout 2')]
Output:            ['Start', 'End', 'Promise 1', 'Promise 2', 
                    'Timeout 1', 'Timeout 2']
Call Stack:        []


FINAL STATE:
---------------------------------------------------------
All queues empty, event loop continues monitoring...
```

**Key Insight:** Microtasks ALWAYS execute before the next macrotask, even if the macrotask was queued first!

---

## 4️⃣ Understanding Key Concepts

### The Call Stack

The **call stack** is where JavaScript tracks function execution. It follows LIFO (Last In, First Out).

```javascript
function third() {
  console.log('Third function');
}

function second() {
  third();
  console.log('Second function');
}

function first() {
  second();
  console.log('First function');
}

first();

// Call Stack Visualization:
// Step 1: [first]
// Step 2: [first, second]
// Step 3: [first, second, third]
// Step 4: [first, second]         <-- third completes
// Step 5: [first]                 <-- second completes
// Step 6: []                      <-- first completes
```

**What happens if the call stack is never empty?**
-> Infinite loop! The event loop can't process queued tasks.

```javascript
// ❌ BAD: Blocks event loop
while (true) {
  // Call stack never empties
}
// Any setTimeout or Promise callbacks will NEVER execute!
```

### Microtask Queue (Job Queue)

**Microtasks** have the highest priority and execute immediately after the current script finishes, before any macrotasks.

**Sources of Microtasks:**
- `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `queueMicrotask()`
- `MutationObserver` callbacks
- `process.nextTick()` (Node.js - even higher priority than Promises!)

```javascript
// Microtasks execute between synchronous code and macrotasks
console.log('Sync 1');

queueMicrotask(() => console.log('Microtask'));

Promise.resolve().then(() => console.log('Promise'));

setTimeout(() => console.log('Timeout'), 0);

console.log('Sync 2');

// Output:
// Sync 1
// Sync 2
// Microtask     <-- Both microtasks run together
// Promise       <-- Before any macrotask
// Timeout       <-- Macrotask runs last
```

### Macrotask Queue (Task Queue)

**Macrotasks** represent larger units of work. Only ONE macrotask executes per event loop iteration.

**Sources of Macrotasks:**
- `setTimeout()`, `setInterval()`
- `setImmediate()` (Node.js)
- I/O operations
- UI rendering
- User interaction events (click, scroll, etc.)

```javascript
// Each setTimeout creates a separate macrotask
setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);
setTimeout(() => console.log('Timeout 3'), 0);

// Event loop will execute them one per iteration:
// Iteration 1: Timeout 1
// Iteration 2: Timeout 2
// Iteration 3: Timeout 3
```

### Why This Line of Code is Critical

```javascript
// This line is what makes JavaScript non-blocking:
setTimeout(() => {
  // This callback is NOT executed immediately
  // It's scheduled as a macrotask for later
}, 0);

// JavaScript IMMEDIATELY continues here
console.log('This runs first!');
```

**What breaks if you remove the event loop?**
-> JavaScript becomes synchronous! Every async operation would block execution until complete. Your web page would freeze during API calls, file reads, or any I/O.

---

## 5️⃣ Advanced Concepts — Event Loop Phases

### Complete Event Loop Cycle

```
+---------------------------------------------------------+
|                   EVENT LOOP CYCLE                      |
+---------------------------------------------------------+
         |
         ▼
    +---------+
    | Start   |
    +----+----+
         |
         ▼
    +------------------------+
    | 1. Execute Script      |
    |    (Synchronous Code)  |
    +--------+---------------+
         |
         ▼
    +------------------------+
    | 2. Process All         |
    |    Microtasks          |---+ Keep processing until
    +--------+---------------+   | microtask queue is empty
         |   ▲                   |
         |   +-------------------+
         ▼
    +------------------------+
    | 3. Render UI           |
    |    (if needed)         |
    +--------+---------------+
         |
         ▼
    +------------------------+
    | 4. Execute ONE         |
    |    Macrotask           |
    +--------+---------------+
         |
         ▼
    +------------------------+
    | 5. Process All         |---+ After each macrotask,
    |    Microtasks Again    |   | process all microtasks
    +--------+---------------+   |
         |   ▲                   |
         |   +-------------------+
         |
         +----------+
                    |
                    ▼
              +----------+
              | Repeat   |
              +----------+
```

### Production-Ready Example: Task Scheduler

```javascript
/**
 * Task Scheduler demonstrating event loop behavior
 * Shows microtask vs macrotask execution order
 */
class TaskScheduler {
  constructor() {
    this.executionLog = [];
  }

  // Schedule a microtask (high priority)
  scheduleMicrotask(name, task) {
    this.executionLog.push(`Scheduled microtask: ${name}`);
    queueMicrotask(() => {
      this.executionLog.push(`Executing microtask: ${name}`);
      task();
    });
  }

  // Schedule a macrotask (lower priority)
  scheduleMacrotask(name, task, delay = 0) {
    this.executionLog.push(`Scheduled macrotask: ${name}`);
    setTimeout(() => {
      this.executionLog.push(`Executing macrotask: ${name}`);
      task();
    }, delay);
  }

  // Schedule via Promise (microtask)
  schedulePromise(name, task) {
    this.executionLog.push(`Scheduled promise: ${name}`);
    Promise.resolve().then(() => {
      this.executionLog.push(`Executing promise: ${name}`);
      task();
    });
  }

  // Get execution log
  getLog() {
    return this.executionLog;
  }

  // Clear log
  clearLog() {
    this.executionLog = [];
  }
}

// Usage example
const scheduler = new TaskScheduler();

console.log('=== Scheduling Phase ===');

scheduler.scheduleMacrotask('Fetch Data', () => {
  console.log('Fetching data from API...');
});

scheduler.scheduleMicrotask('Validate Input', () => {
  console.log('Validating user input...');
});

scheduler.schedulePromise('Process Response', () => {
  console.log('Processing API response...');
});

scheduler.scheduleMacrotask('Update UI', () => {
  console.log('Updating UI...');
});

console.log('=== Execution Phase ===');

// After event loop completes, check log
setTimeout(() => {
  console.log('\n=== Execution Order ===');
  scheduler.getLog().forEach(log => console.log(log));
}, 100);
```

### Microtask Starvation

```javascript
// ⚠️ WARNING: This can starve the macrotask queue!
function recursiveMicrotask() {
  queueMicrotask(() => {
    console.log('Microtask executing');
    recursiveMicrotask(); // Creates another microtask
  });
}

setTimeout(() => {
  console.log('This macrotask may NEVER run!');
}, 0);

// Don't do this! Microtasks will run forever, blocking macrotasks
// recursiveMicrotask();
```

**Why this matters:** Infinite microtasks prevent rendering and user interaction!

---

## 6️⃣ Real-World Examples

### Example 1: setTimeout vs Promise

```javascript
// Common interview question
console.log('Script start');

setTimeout(() => {
  console.log('setTimeout 1');
  Promise.resolve().then(() => {
    console.log('Promise inside setTimeout');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => {
      console.log('setTimeout inside Promise');
    }, 0);
  })
  .then(() => {
    console.log('Promise 2');
  });

console.log('Script end');

// Output:
// Script start
// Script end
// Promise 1              <-- Microtasks run first
// Promise 2              <-- All microtasks complete
// setTimeout 1           <-- First macrotask
// Promise inside setTimeout  <-- Microtask from first macrotask
// setTimeout inside Promise  <-- Second macrotask
```

### Example 2: React useEffect Timing

```javascript
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('1: useEffect starts');
    
    // Macrotask
    setTimeout(() => {
      console.log('4: setTimeout callback');
    }, 0);

    // Microtask
    Promise.resolve().then(() => {
      console.log('3: Promise callback');
    });

    // Synchronous
    console.log('2: useEffect ends');

    // Cleanup function
    return () => {
      console.log('5: Cleanup (on unmount)');
    };
  }, []);

  return <div>Check console for event loop demo</div>;
}

// Output on mount:
// 1: useEffect starts
// 2: useEffect ends
// 3: Promise callback
// 4: setTimeout callback
//
// Output on unmount:
// 5: Cleanup (on unmount)
```

### Example 3: Async/Await with Event Loop

```javascript
async function fetchUserData(userId) {
  console.log('1: Function start');

  // await creates a microtask
  const user = await fetch(`/api/users/${userId}`);
  console.log('3: After first await');

  const posts = await fetch(`/api/users/${userId}/posts`);
  console.log('5: After second await');

  return { user, posts };
}

console.log('0: Before function call');
fetchUserData(123);
console.log('2: After function call');

// Execution order:
// 0: Before function call
// 1: Function start
// 2: After function call
// (fetch completes...)
// 3: After first await
// (second fetch completes...)
// 5: After second await
```

**Key insight:** `await` pauses function execution and queues continuation as a microtask when the Promise resolves.

### Example 4: Event Loop in Node.js

```javascript
// Node.js has additional event loop phases
const fs = require('fs');

console.log('1: Synchronous');

// I/O operation (Poll phase)
fs.readFile('./file.txt', () => {
  console.log('5: File read complete');
  
  // setImmediate runs in Check phase
  setImmediate(() => console.log('6: setImmediate'));
  
  // setTimeout runs in Timer phase
  setTimeout(() => console.log('7: setTimeout'), 0);
  
  // nextTick has highest priority
  process.nextTick(() => console.log('4: nextTick inside I/O'));
});

// Microtask
Promise.resolve().then(() => console.log('3: Promise'));

// nextTick (higher priority than Promise!)
process.nextTick(() => console.log('2: nextTick'));

// Output (Node.js):
// 1: Synchronous
// 2: nextTick
// 3: Promise
// 5: File read complete
// 4: nextTick inside I/O
// 6: setImmediate
// 7: setTimeout
```

---

## 7️⃣ Comparisons

### Microtasks vs Macrotasks

| Feature | Microtasks | Macrotasks |
|---------|-----------|-----------|
| **Priority** | High - execute immediately after current script | Low - execute one per event loop cycle |
| **Execution** | ALL microtasks execute before next macrotask | ONE macrotask per cycle |
| **Sources** | Promises, queueMicrotask, MutationObserver | setTimeout, setInterval, I/O, UI events |
| **Timing** | Run after synchronous code, before rendering | Run after microtasks, may trigger rendering |
| **Use Case** | State updates, quick tasks | Deferred work, animations, user events |
| **Risk** | Can starve macrotasks if infinite | Can delay if too many queued |

### Visual Comparison

```
EXECUTION ORDER:

Synchronous Code
    v
Microtask 1
Microtask 2
Microtask 3...
(ALL microtasks)
    v
Render (if needed)
    v
Macrotask 1
    v
Microtask 4
Microtask 5...
(ALL microtasks)
    v
Render (if needed)
    v
Macrotask 2
    v
...repeat
```

### Browser vs Node.js Event Loop

| Aspect | Browser | Node.js |
|--------|---------|---------|
| **Implementation** | HTML spec | libuv library |
| **Phases** | Simpler (microtasks -> macrotask -> render) | Complex (6 phases: timers, I/O, idle, poll, check, close) |
| **nextTick** | Not available | Highest priority (even above microtasks) |
| **setImmediate** | Not available | Runs in Check phase |
| **Rendering** | Scheduled between tasks | No rendering |
| **Use Case** | Interactive UIs | Server operations, file I/O |

---

## 8️⃣ Common Interview Questions

### Q1: Why does setTimeout with 0ms delay not execute immediately?

**Answer:**
```javascript
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
console.log('End');

// Output:
// Start
// End
// Timeout <-- Delayed!
```

Because `setTimeout` schedules a **macrotask**, which only executes after:
1. All synchronous code completes
2. Call stack is empty
3. All microtasks are processed

Even with 0ms delay, it must wait for the event loop to reach the macrotask queue.

### Q2: What's the output of this code?

```javascript
Promise.resolve().then(() => console.log('A'));
queueMicrotask(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
Promise.resolve().then(() => console.log('D'));
console.log('E');
```

**Answer:**
```
E  <-- Synchronous first
A  <-- Microtasks execute in order (Promise)
B  <-- queueMicrotask
D  <-- Promise
C  <-- Macrotask last
```

### Q3: Can you explain this async/await behavior?

```javascript
async function test() {
  console.log('1');
  await Promise.resolve();
  console.log('2');
}

test();
console.log('3');

// Output: 1, 3, 2 — Why?
```

**Answer:**
- `console.log('1')` runs synchronously
- `await` pauses the function and schedules the continuation as a microtask
- Execution returns to caller
- `console.log('3')` runs synchronously
- Call stack empties, microtask runs
- `console.log('2')` executes

### Q4: What happens if a microtask creates another microtask infinitely?

**Answer:**
```javascript
function infiniteMicrotask() {
  queueMicrotask(() => {
    console.log('Microtask');
    infiniteMicrotask();
  });
}

infiniteMicrotask();

// Result: Page freezes! Microtasks never end, so:
// - Macrotasks never execute
// - Rendering never happens
// - User interactions are blocked
```

This is called **microtask starvation**. The event loop is stuck processing microtasks forever.

### Q5: How do Promises queue in the event loop?

**Answer:**
```javascript
new Promise((resolve) => {
  console.log('1: Promise executor (synchronous)');
  resolve();
}).then(() => {
  console.log('2: First .then (microtask)');
  return 'value';
}).then((val) => {
  console.log('3: Second .then (microtask)');
});

console.log('4: Synchronous code');

// Output: 1, 4, 2, 3
```

- Promise executor runs **synchronously**
- Each `.then()` queues a **microtask**
- Microtasks execute after synchronous code
- Chained `.then()` callbacks execute in order

### Q6: Explain the difference in timing between these two:

```javascript
// Version A
setTimeout(() => console.log('A'), 0);

// Version B
Promise.resolve().then(() => console.log('B'));
```

**Answer:**

**Version B executes first** because:
- `setTimeout` -> Macrotask queue
- `Promise.then` -> Microtask queue
- Event loop prioritizes microtasks over macrotasks

```
Event Loop Order:
1. Execute synchronous code
2. Process ALL microtasks -> 'B' prints
3. Process ONE macrotask -> 'A' prints
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Assuming setTimeout is Accurate

❌ **BAD:** Expecting precise timing
```javascript
const start = Date.now();

setTimeout(() => {
  const elapsed = Date.now() - start;
  console.log(`Expected 100ms, got ${elapsed}ms`);
  // Might output: "Expected 100ms, got 105ms"
}, 100);

// Heavy computation blocks the event loop
for (let i = 0; i < 1000000000; i++) {
  // Blocking work
}
```

✅ **GOOD:** Understanding setTimeout is a minimum delay
```javascript
// setTimeout(fn, delay) means:
// "Execute fn AT LEAST 'delay' ms from now"

// Better approach for precise timing:
let lastTime = performance.now();

function animate(currentTime) {
  const delta = currentTime - lastTime;
  console.log(`Actual time between frames: ${delta}ms`);
  
  lastTime = currentTime;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

**Why it fails:** setTimeout can't interrupt the call stack. If synchronous code runs long, the timeout waits.

### Pitfall 2: Creating Infinite Microtasks

❌ **BAD:** Recursive microtask without exit condition
```javascript
function processQueue() {
  queueMicrotask(() => {
    console.log('Processing...');
    processQueue(); // <-- Infinite recursion!
  });
}

processQueue();

// Result: Browser tab freezes, UI unresponsive
// Macrotasks (including rendering) never execute
```

✅ **GOOD:** Use macrotasks for recursive operations
```javascript
function processQueue(items, index = 0) {
  if (index >= items.length) return; // Exit condition
  
  setTimeout(() => {
    console.log(`Processing item ${index}`);
    processQueue(items, index + 1);
  }, 0);
  
  // Allows other macrotasks and rendering between iterations
}

processQueue([1, 2, 3, 4, 5]);
```

**Why it fails:** Microtasks must all complete before macrotasks run. Infinite microtasks = frozen UI.

### Pitfall 3: Race Conditions with Mixed Async

❌ **BAD:** Mixing setTimeout and Promises without understanding order
```javascript
let counter = 0;

setTimeout(() => {
  counter++;
  console.log(`Timeout: ${counter}`); // Prints: "Timeout: 2"
}, 0);

Promise.resolve().then(() => {
  counter++;
  console.log(`Promise: ${counter}`); // Prints: "Promise: 1"
});

// Assuming timeout runs first? Wrong!
```

✅ **GOOD:** Explicitly control execution order
```javascript
let counter = 0;

async function updateCounterSequentially() {
  // Force sequential execution
  await Promise.resolve();
  counter++;
  console.log(`First: ${counter}`);
  
  await new Promise(resolve => setTimeout(resolve, 0));
  counter++;
  console.log(`Second: ${counter}`);
}

updateCounterSequentially();
```

**Why it fails:** Promises (microtasks) execute before setTimeout (macrotasks), regardless of code order.

### Pitfall 4: Not Understanding async/await Execution

❌ **BAD:** Assuming async functions run completely asynchronously
```javascript
async function fetchData() {
  console.log('1: Inside async function');
  const data = await fetch('/api/data');
  console.log('3: After await');
  return data;
}

console.log('0: Before call');
fetchData();
console.log('2: After call');

// Expecting: 0, 2, 1, 3?
// Actually:  0, 1, 2, 3
```

✅ **GOOD:** Understanding async functions run synchronously until first await
```javascript
async function fetchData() {
  // This part runs SYNCHRONOUSLY
  console.log('1: Inside async function (sync)');
  console.log('Starting fetch...');
  
  // Here execution pauses and returns to caller
  const data = await fetch('/api/data');
  
  // This part runs as a microtask after Promise resolves
  console.log('3: After await (async)');
  return data;
}

console.log('0: Before call');
fetchData(); // Returns a Promise immediately
console.log('2: After call (continues synchronously)');
```

**Why it fails:** `async` functions run synchronously until they hit `await`. Only the code after `await` is deferred as a microtask.

---

## 🔟 Time & Space Complexity

### Event Loop Operations

| Operation | Time Complexity | Explanation |
|-----------|----------------|-------------|
| Push to microtask queue | O(1) | Constant time insertion |
| Push to macrotask queue | O(1) | Constant time insertion |
| Pop from queue | O(1) | Constant time removal |
| Check if call stack empty | O(1) | Single comparison |
| Execute one microtask | O(m) | Depends on microtask code |
| Execute all microtasks | O(m × n) | m = code complexity, n = number of microtasks |
| One event loop cycle | O(m × n + t) | n microtasks + 1 macrotask (t) |

### Space Complexity

| Structure | Space Complexity | Notes |
|-----------|-----------------|-------|
| Call stack | O(d) | d = maximum call depth |
| Microtask queue | O(m) | m = number of queued microtasks |
| Macrotask queue | O(t) | t = number of queued macrotasks |
| Overall | O(d + m + t) | Sum of all structures |

**Note:** The event loop itself is a conceptual model, not a data structure with complexity. The complexities above refer to the underlying queues and stack.

---

## 📝 Summary

### Quick Reference Table

| Concept | Key Points |
|---------|-----------|
| **Event Loop** | Coordinates execution between call stack and task queues |
| **Call Stack** | LIFO execution of functions, must empty before tasks execute |
| **Microtasks** | High priority (Promises, queueMicrotask), ALL execute before next macrotask |
| **Macrotasks** | Lower priority (setTimeout, I/O), ONE executes per event loop cycle |
| **Execution Order** | Sync code -> All microtasks -> Render -> One macrotask -> Repeat |
| **async/await** | Runs sync until await, then queues continuation as microtask |
| **Starvation** | Infinite microtasks block macrotasks and rendering |

### 5 Key Takeaways

1. **JavaScript is single-threaded** — The event loop creates the illusion of concurrency by coordinating between synchronous execution and async callbacks

2. **Microtasks have priority** — ALL microtasks execute before ANY macrotask. This is why Promises resolve before setTimeout callbacks

3. **setTimeout(fn, 0) is NOT immediate** — It schedules a macrotask that runs after synchronous code and all microtasks complete

4. **async/await uses microtasks** — Code after `await` runs as a microtask when the Promise resolves, not immediately

5. **Understanding execution order prevents bugs** — Knowing when callbacks execute helps debug timing issues, race conditions, and unexpected behavior

### Best Practices

- ✅ Use Promises/async-await for async operations (microtasks)
- ✅ Use setTimeout for deferred work (macrotasks)
- ✅ Avoid long-running synchronous code that blocks the event loop
- ✅ Break heavy computations into chunks with setTimeout or requestIdleCallback
- ✅ Remember: Microtasks -> Rendering -> Macrotask (one cycle)
- ❌ Don't create infinite microtasks (causes UI freeze)
- ❌ Don't assume setTimeout timing is precise
- ❌ Don't mix async primitives without understanding execution order

---

## 📚 Further Reading

- [MDN: Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) - Official documentation with detailed explanations
- [Jake Archibald: In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) - Excellent conference talk with visualizations
- [HTML Living Standard: Event Loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) - Official specification
- [Node.js Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/) - Node.js-specific implementation details

---

## 🔗 Related Resources

- See [closures.md](./closures.md) for understanding function scope and callbacks
- Learn about [promises](../promises/) for async patterns and microtask behavior
- Review [async/await patterns](../promises/) for modern asynchronous code
- Check [debounce.md](../utils/debounce.md) and [throttle.md](../utils/throttle.md) for practical event loop applications
