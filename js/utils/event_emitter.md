---
date: 2025-03-20T09:40:40+05:30
description: Pub-sub pattern implementation using Map and Set for efficient event handling. Foundation for reactive programming and event-driven architecture.
premium: true
---
# 📢 Custom EventEmitter Implementation

> **Interview Importance:** 🔴 Critical — EventEmitter is a classic interview question that tests understanding of the Observer pattern, closures, memory management, and JavaScript fundamentals.

---

## 1️⃣ What is an EventEmitter?

An **EventEmitter** (or Event Bus) is a pattern that allows objects to subscribe to and publish events. It's the foundation of event-driven programming in JavaScript.

```
Publisher (Emitter)          Subscribers (Listeners)
       |                            |
       | ------ event -------------►| Listener 1
       |                            |
       | ------ event -------------►| Listener 2
       |                            |
       | ------ event -------------►| Listener 3
```

### Real-World Examples

| Library/Platform | Event System |
|------------------|--------------|
| **Node.js** | `EventEmitter` class |
| **DOM** | `addEventListener` / `dispatchEvent` |
| **React** | Custom hooks, Context |
| **Vue** | `$emit` / `$on` |
| **RxJS** | Subjects and Observables |

---

## 2️⃣ Why Implement EventEmitter?

1. **Decouples components** — Publishers don't know about subscribers
2. **Flexible communication** — Many-to-many relationships
3. **Interview staple** — Tests multiple JS concepts
4. **Real-world usage** — Foundation of reactive programming

### What This Tests

- **Closures & Scoping** — Managing listener references
- **Memory Management** — Proper cleanup to prevent leaks
- **Data Structures** — Efficient storage with `Map` and `Set`
- **Design Patterns** — Observer/Pub-Sub pattern

---

## 3️⃣ Implementation

### Basic Implementation

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  // Subscribe to an event
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
    return this;  // Enable chaining
  }

  // Unsubscribe from an event
  off(event, listener) {
    if (this.events.has(event)) {
      this.events.get(event).delete(listener);
      // Clean up empty event sets
      if (this.events.get(event).size === 0) {
        this.events.delete(event);
      }
    }
    return this;
  }

  // Emit an event to all listeners
  emit(event, ...args) {
    if (this.events.has(event)) {
      for (const listener of this.events.get(event)) {
        listener(...args);
      }
    }
    return this;
  }

  // Subscribe for a single event only
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);  // Remove before calling
      listener(...args);
    };
    this.on(event, onceWrapper);
    return this;
  }

  // Get all listeners for an event
  listeners(event) {
    return this.events.has(event) ? [...this.events.get(event)] : [];
  }
}
```

### 🔍 Dry Run: Basic Usage

```javascript
const emitter = new EventEmitter();

// Define listeners
const greet = (name) => console.log(`Hello, ${name}!`);
const farewell = (name) => console.log(`Goodbye, ${name}!`);

// Subscribe
emitter.on('greet', greet);
emitter.on('greet', farewell);

// Emit
emitter.emit('greet', 'Alice');
```

```
Step 1: emitter.on('greet', greet)
---------------------------------------------------------
  events.has('greet')? -> false
  Create: events.set('greet', new Set())
  Add: events.get('greet').add(greet)

  events = Map { 'greet' => Set { greet } }

Step 2: emitter.on('greet', farewell)
---------------------------------------------------------
  events.has('greet')? -> true
  Add: events.get('greet').add(farewell)

  events = Map { 'greet' => Set { greet, farewell } }

Step 3: emitter.emit('greet', 'Alice')
---------------------------------------------------------
  events.has('greet')? -> true

  Iterate over Set { greet, farewell }:
    -> greet('Alice')     Output: "Hello, Alice!"
    -> farewell('Alice')  Output: "Goodbye, Alice!"

Output:
  Hello, Alice!
  Goodbye, Alice!
```

### 🔍 Dry Run: once() Method

```javascript
const emitter = new EventEmitter();

const runOnce = () => console.log('This runs once');
emitter.once('event', runOnce);

emitter.emit('event');  // Output: "This runs once"
emitter.emit('event');  // No output (listener removed)
```

```
Step 1: emitter.once('event', runOnce)
---------------------------------------------------------
  Creates onceWrapper function:
    function onceWrapper(...args) {
      this.off('event', onceWrapper);  // Remove itself
      runOnce(...args);                 // Call original
    }

  Calls: this.on('event', onceWrapper)

  events = Map { 'event' => Set { onceWrapper } }

Step 2: First emitter.emit('event')
---------------------------------------------------------
  events.has('event')? -> true

  For listener onceWrapper:
    -> this.off('event', onceWrapper)  // Remove from set
    -> runOnce()                       // Execute original

  Output: "This runs once"
  events = Map { } (empty after cleanup)

Step 3: Second emitter.emit('event')
---------------------------------------------------------
  events.has('event')? -> false

  No listeners to call
  Output: (nothing)
```

---

## 4️⃣ Why Map and Set?

### Why `Map` for Events?

```javascript
// Using Map vs Object
// Map advantages:
// 1. Keys can be any type (not just strings)
// 2. Better performance for frequent additions/deletions
// 3. Built-in .has(), .get(), .set(), .delete()
// 4. Maintains insertion order
// 5. .size property for counting

// With Map:
this.events = new Map();
this.events.set('click', listeners);
this.events.has('click');  // true
this.events.delete('click');

// With Object (less ideal):
this.events = {};
this.events['click'] = listeners;
'click' in this.events;  // true
delete this.events['click'];
```

### Why `Set` for Listeners?

```javascript
// Using Set vs Array
// Set advantages:
// 1. No duplicates (same listener can't subscribe twice)
// 2. O(1) lookup/delete vs O(n) for Array
// 3. Built-in .add(), .delete(), .has()

// With Set:
listeners.add(fn);     // O(1)
listeners.delete(fn);  // O(1)
listeners.has(fn);     // O(1)

// With Array (less ideal):
listeners.push(fn);                          // O(1)
listeners.splice(listeners.indexOf(fn), 1);  // O(n)
listeners.includes(fn);                      // O(n)
```

---

## 5️⃣ Production Implementation

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;  // Warning threshold
  }

  // Set max listeners (like Node.js)
  setMaxListeners(n) {
    this.maxListeners = n;
    return this;
  }

  // Get max listeners
  getMaxListeners() {
    return this.maxListeners;
  }

  // Subscribe to event
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const listeners = this.events.get(event);

    // Warn if exceeding max listeners (potential memory leak)
    if (listeners.size >= this.maxListeners) {
      console.warn(
        `Warning: Event '${event}' has ${listeners.size} listeners. ` +
        `Possible memory leak detected.`
      );
    }

    listeners.add(listener);
    return this;
  }

  // Alias for on()
  addListener(event, listener) {
    return this.on(event, listener);
  }

  // Subscribe once
  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }

    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };

    // Store reference to original for removal
    onceWrapper.listener = listener;

    return this.on(event, onceWrapper);
  }

  // Unsubscribe from event
  off(event, listener) {
    if (!this.events.has(event)) return this;

    const listeners = this.events.get(event);

    // Handle once() wrapped listeners
    for (const fn of listeners) {
      if (fn === listener || fn.listener === listener) {
        listeners.delete(fn);
        break;
      }
    }

    // Clean up empty sets
    if (listeners.size === 0) {
      this.events.delete(event);
    }

    return this;
  }

  // Alias for off()
  removeListener(event, listener) {
    return this.off(event, listener);
  }

  // Remove all listeners for an event (or all events)
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }

  // Emit event
  emit(event, ...args) {
    if (!this.events.has(event)) return false;

    const listeners = this.events.get(event);

    // Copy set to avoid issues if listener removes itself
    for (const listener of [...listeners]) {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`Error in listener for '${event}':`, error);
      }
    }

    return true;
  }

  // Get listener count
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).size : 0;
  }

  // Get all listeners for event
  listeners(event) {
    if (!this.events.has(event)) return [];

    return [...this.events.get(event)].map(fn => fn.listener || fn);
  }

  // Get all event names
  eventNames() {
    return [...this.events.keys()];
  }

  // Prepend listener (runs first)
  prependListener(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const listeners = this.events.get(event);
    const arr = [...listeners];
    arr.unshift(listener);
    this.events.set(event, new Set(arr));

    return this;
  }
}
```

---

## 6️⃣ Usage Examples

### Basic Pub/Sub

```javascript
const emitter = new EventEmitter();

// Subscribe to events
emitter.on('user:login', (user) => {
  console.log(`${user.name} logged in`);
});

emitter.on('user:login', (user) => {
  // Log to analytics
  analytics.track('login', { userId: user.id });
});

// Emit event
emitter.emit('user:login', { id: 1, name: 'Alice' });
// Output: "Alice logged in"
// (analytics also tracks)
```

### Event Bus for React

```javascript
// eventBus.js
export const eventBus = new EventEmitter();

// ComponentA.jsx
useEffect(() => {
  const handler = (data) => setMessage(data);
  eventBus.on('notification', handler);

  return () => eventBus.off('notification', handler);
}, []);

// ComponentB.jsx
const sendNotification = () => {
  eventBus.emit('notification', 'Hello from B!');
};
```

### Async Event Handling

```javascript
class AsyncEventEmitter extends EventEmitter {
  async emitAsync(event, ...args) {
    if (!this.events.has(event)) return;

    const listeners = [...this.events.get(event)];

    for (const listener of listeners) {
      await listener(...args);
    }
  }

  emitParallel(event, ...args) {
    if (!this.events.has(event)) return Promise.resolve();

    const listeners = [...this.events.get(event)];

    return Promise.all(
      listeners.map(listener => listener(...args))
    );
  }
}

// Usage
const emitter = new AsyncEventEmitter();

emitter.on('process', async (data) => {
  await processData(data);
});

await emitter.emitAsync('process', { id: 1 });
```

---

## 7️⃣ Common Interview Questions

### Q1: Implement a basic EventEmitter

**Answer:** See Section 3.

### Q2: How do you prevent memory leaks in EventEmitter?

**Answer:**
1. **Always unsubscribe** — Call `off()` when component unmounts
2. **Use `once()`** — For one-time events
3. **Set max listeners** — Warn when too many subscribers
4. **Clear on destroy** — Call `removeAllListeners()`

```javascript
// React example - cleanup on unmount
useEffect(() => {
  const handler = () => { /* ... */ };
  emitter.on('event', handler);

  return () => emitter.off('event', handler);  // Cleanup!
}, []);
```

### Q3: What's the difference between `on` and `once`?

**Answer:**
- `on`: Listener stays subscribed, called every time event fires
- `once`: Listener auto-removes after first call

```javascript
emitter.on('click', handler);   // Called every click
emitter.once('load', handler);  // Called only on first load
```

### Q4: How would you implement wildcard event names?

**Answer:**

```javascript
emit(event, ...args) {
  // Exact match
  if (this.events.has(event)) {
    for (const listener of this.events.get(event)) {
      listener(...args);
    }
  }

  // Wildcard match (e.g., 'user.*' matches 'user.login')
  for (const [pattern, listeners] of this.events) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (event.startsWith(prefix)) {
        for (const listener of listeners) {
          listener(...args);
        }
      }
    }
  }
}

// Usage
emitter.on('user.*', (data) => console.log('User event:', data));
emitter.emit('user.login', { name: 'Alice' });  // Triggers handler
emitter.emit('user.logout', { name: 'Alice' }); // Triggers handler
```

### Q5: How does Node.js EventEmitter differ from this implementation?

**Answer:**
| Feature | Node.js | Our Implementation |
|---------|---------|-------------------|
| Error handling | `'error'` event throws if no listeners | No special handling |
| Prepend listeners | `prependListener()` | Can add |
| Max listeners | Default 10, warns | Can add |
| `newListener` event | Emitted when listener added | Not included |
| Async emit | `EventEmitter.once()` returns Promise | Can extend |

---

## 8️⃣ Common Pitfalls

### Pitfall 1: Forgetting to Unsubscribe

```javascript
// ❌ BAD: Memory leak - listener never removed
class Component {
  componentDidMount() {
    emitter.on('update', this.handleUpdate);
  }
  // Missing componentWillUnmount!
}

// ✅ GOOD: Proper cleanup
class Component {
  componentDidMount() {
    emitter.on('update', this.handleUpdate);
  }

  componentWillUnmount() {
    emitter.off('update', this.handleUpdate);
  }
}
```

### Pitfall 2: Anonymous Functions Can't Be Removed

```javascript
// ❌ BAD: Can't remove anonymous function
emitter.on('event', () => console.log('fired'));
emitter.off('event', () => console.log('fired'));  // Doesn't work!

// ✅ GOOD: Keep reference to remove later
const handler = () => console.log('fired');
emitter.on('event', handler);
emitter.off('event', handler);  // Works!
```

### Pitfall 3: Modifying Listeners During Emit

```javascript
// ❌ BAD: Removing during iteration can skip listeners
emitter.on('event', function handler1() {
  emitter.off('event', handler2);  // Modifies set during iteration
});
emitter.on('event', handler2);

// ✅ GOOD: Copy listeners before iterating
emit(event, ...args) {
  const listeners = [...this.events.get(event)];  // Copy!
  for (const listener of listeners) {
    listener(...args);
  }
}
```

### Pitfall 4: Not Handling Errors

```javascript
// ❌ BAD: One error breaks all listeners
emit(event, ...args) {
  for (const listener of this.events.get(event)) {
    listener(...args);  // If this throws, rest don't run
  }
}

// ✅ GOOD: Wrap in try-catch
emit(event, ...args) {
  for (const listener of this.events.get(event)) {
    try {
      listener(...args);
    } catch (error) {
      console.error('Listener error:', error);
    }
  }
}
```

---

## 9️⃣ Time & Space Complexity

| Operation | Time Complexity | Explanation |
|-----------|-----------------|-------------|
| `on()` | O(1) | Set.add is O(1) |
| `off()` | O(1) | Set.delete is O(1) |
| `emit()` | O(n) | Iterates through n listeners |
| `once()` | O(1) | Same as on() |
| `listeners()` | O(n) | Creates array copy |

| Space | Complexity | Explanation |
|-------|------------|-------------|
| Events Map | O(e) | e = number of event types |
| Listeners Set | O(l) | l = number of listeners per event |
| **Total** | O(e × l) | All events × all listeners |

---

## 🔟 Summary

| Method | Purpose |
|--------|---------|
| `on(event, fn)` | Subscribe to event |
| `off(event, fn)` | Unsubscribe from event |
| `emit(event, ...args)` | Trigger event with data |
| `once(event, fn)` | Subscribe for single trigger |
| `listeners(event)` | Get all listeners for event |
| `removeAllListeners()` | Clear all subscriptions |

### Key Takeaways

1. **Use Map + Set** — Efficient storage with O(1) operations
2. **Always cleanup** — Prevent memory leaks
3. **Handle errors** — Don't let one listener break others
4. **Copy before iterating** — Avoid issues with modification during emit
5. **Warn on excess listeners** — Catch potential memory leaks early

---

## 📚 Further Reading

- [Node.js EventEmitter](https://nodejs.org/api/events.html)
- [MDN: CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [Observer Pattern](https://refactoring.guru/design-patterns/observer)

---

<!-- quiz-start -->
### Q1: Why is `Set` preferred over `Array` for storing listeners in an EventEmitter?
- [ ] Sets are easier to iterate
- [x] Sets provide O(1) lookup and deletion, and prevent duplicate listeners
- [ ] Sets preserve insertion order better
- [ ] Arrays cannot store functions

### Q2: What is the purpose of the `once` method in an EventEmitter?
- [ ] To emit an event only once
- [ ] To check if an event exists
- [x] To subscribe a listener that automatically unsubscribes after one execution
- [ ] To delay event emission

### Q3: What is a common pitfall when using anonymous functions as event listeners?
- [ ] They run slower than named functions
- [ ] They cannot access the event data
- [x] They cannot be removed with `off()` because there's no reference to match
- [ ] They cause memory leaks automatically
<!-- quiz-end -->
