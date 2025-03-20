Here’s a **custom EventEmitter implementation** in JavaScript that covers the essential functionalities: 

- `on(event, listener)`: Registers an event listener.
- `off(event, listener)`: Removes a specific listener.
- `emit(event, ...args)`: Calls all listeners for an event.
- `once(event, listener)`: Registers a one-time event listener.
- `listeners(event)`: Returns an array of listeners for a given event.

This implementation is **simple yet complete**, making it a good interview task that tests a candidate's understanding of JavaScript event handling, closures, and memory management.

---

### **Custom EventEmitter Implementation**
```javascript
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
  }

  off(event, listener) {
    if (this.events.has(event)) {
      this.events.get(event).delete(listener);
      if (this.events.get(event).size === 0) {
        this.events.delete(event);
      }
    }
  }

  emit(event, ...args) {
    if (this.events.has(event)) {
      for (const listener of this.events.get(event)) {
        listener(...args);
      }
    }
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener(...args);
    };
    this.on(event, onceWrapper);
  }

  listeners(event) {
    return this.events.has(event) ? [...this.events.get(event)] : [];
  }
}
```

---

### **Example Usage**
```javascript
const emitter = new EventEmitter();

const greet = (name) => console.log(`Hello, ${name}!`);
emitter.on("greet", greet);
emitter.emit("greet", "Alice");  // Output: Hello, Alice!

emitter.off("greet", greet);
emitter.emit("greet", "Bob");   // No output (listener removed)

const onceListener = () => console.log("This runs once");
emitter.once("runOnce", onceListener);
emitter.emit("runOnce"); // Output: This runs once
emitter.emit("runOnce"); // No output (listener removed)

console.log(emitter.listeners("greet")); // []
```

---

### **Interview Expectations**
#### **What This Tests**
- **Closures & Scoping**: Handling event listeners.
- **Memory Management**: Removing listeners when necessary.
- **Data Structures**: Understanding of `Map` and `Set` for efficient storage.
- **Edge Cases Handling**: 
  - Emitting an event with no listeners.
  - Removing a non-existent listener.
  - Ensuring `once` works correctly.

#### **Possible Follow-up Questions**
1. How would you modify this to allow **wildcard event names** (e.g., `"user.*"`)?
2. How can you optimize it for **high-frequency events** (e.g., `scroll` or `mousemove`)?
3. How would you implement **priority-based** event listeners?
4. How does this compare to `Node.js` built-in `EventEmitter`?

This is a **practical yet challenging** problem, making it ideal for a mid-senior JavaScript/React developer interview. 🚀