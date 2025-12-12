---
date: 2025-06-19T09:47:50+05:30
description: Decision guide for choosing the right design pattern based on your problem. Maps real-world scenarios to specific patterns with examples.
---

# 🧠 When to Use Which Design Pattern in JavaScript

Choosing the right **design pattern** depends on the **problem you're solving**, not on the pattern itself. Patterns are just **tools** — and like all tools, their value lies in **applying them at the right time**.

---

## 🧭 Step-by-Step Guide: How to Choose the Right Design Pattern

---

### 1. ✅ **Understand the Problem Domain First**

Ask yourself:

* Are you managing object creation?
* Are you restructuring or connecting objects?
* Are you responding to runtime behavior changes?
* Do you need encapsulation or reusability?

These lead you to the right **pattern category**:

| Problem Type                               | Design Pattern Category                        |
| ------------------------------------------ | ---------------------------------------------- |
| Creating objects                           | Creational (Factory, Singleton, Builder)       |
| Organizing and composing objects           | Structural (Module, Adapter, Decorator, etc.)  |
| Managing runtime behavior or communication | Behavioral (Observer, Strategy, Command, etc.) |

---

### 2. 🔍 **Map Real-World Scenarios to Common Patterns**

| If you need to...                                     | Use this pattern        |
| ----------------------------------------------------- | ----------------------- |
| Create many similar objects                           | Factory                 |
| Create one and only one instance                      | Singleton               |
| Add parts step-by-step                                | Builder                 |
| Group related methods and encapsulate data            | Module                  |
| Notify others when something changes                  | Observer / Pub-Sub      |
| Swap logic/algorithm dynamically                      | Strategy                |
| Encapsulate behavior (e.g., undo, retry)              | Command                 |
| Avoid duplicating methods                             | Constructor + Prototype |
| Adapt old or incompatible interface                   | Adapter                 |
| Add extra features without modifying base code        | Decorator               |
| Access a simplified interface to a complex system     | Facade                  |
| Control access / add caching or delay logic           | Proxy                   |
| Handle requests via chain of handlers                 | Chain of Responsibility |
| Store and restore object state                        | Memento                 |
| Coordinate complex interactions between objects       | Mediator                |
| Change behavior based on internal state               | State                   |
| Apply operation across object structure (e.g., trees) | Visitor                 |
| Treat a group of objects like a single object         | Composite               |
| Share memory-efficient objects (e.g., rendering)      | Flyweight               |

---

### 3. 🧪 **Evaluate Trade-offs and Codebase Needs**

Ask:

* 🔄 **Reusability**: Do I want to share this logic?
* 🧪 **Testability**: Can I mock or isolate this easily?
* ⚙️ **Complexity**: Is this overengineering or adding clarity?
* 🚀 **Performance**: Do I need to optimize memory or execution?

---

You're absolutely right — the article structure is solid, but the **"Quick Examples by Use Case"** section only includes a subset of the full list of patterns mentioned. Let's **extend that section** to include **examples for all 18 patterns** covered in the summary table.

---

## 🧩 Quick Examples by Use Case

---

### 🔹 Use the **Factory Pattern** when:

```js
function createUser(name, role) {
  return { name, role };
}
```

---

### 🔹 Use the **Builder Pattern** when:

```js
function CarBuilder() {
  const car = {};
  return {
    setModel: m => (car.model = m, this),
    setColor: c => (car.color = c, this),
    build: () => car
  };
}

const myCar = CarBuilder().setModel('Tesla').setColor('Red').build();
```

---

### 🔹 Use the **Singleton Pattern** when:

```js
const Settings = (() => {
  let instance;
  return {
    getInstance: () => instance || (instance = { theme: 'dark' })
  };
})();
```

---

### 🔹 Use the **Module Pattern** when:

```js
const Counter = (() => {
  let count = 0;
  return {
    increment: () => ++count,
    value: () => count
  };
})();
```

---

### 🔹 Use the **Observer Pattern** when:

```js
const createPubSub = () => {
  const subs = [];
  return {
    subscribe(fn) { subs.push(fn); },
    notify(data) { subs.forEach(fn => fn(data)); }
  };
};
```

---

### 🔹 Use the **Strategy Pattern** when:

```js
const filters = {
  byAge: a => a.age > 18,
  byName: a => a.name.startsWith('A')
};

function filterUsers(users, strategy) {
  return users.filter(filters[strategy]);
}
```

---

### 🔹 Use the **Command Pattern** when:

```js
function Command(action, data) {
  return () => action(data);
}

const log = Command(console.log, 'Run');
log();
```

---

### 🔹 Use the **Adapter Pattern** when:

```js
function OldAPI() {
  this.get = () => 'old format';
}

function Adapter(oldApi) {
  return {
    fetch: () => oldApi.get()
  };
}

const adapted = Adapter(new OldAPI());
```

---

### 🔹 Use the **Decorator Pattern** when:

```js
function addLogging(obj) {
  return {
    ...obj,
    log: () => console.log('Logging...')
  };
}
```

---

### 🔹 Use the **Facade Pattern** when:

```js
function fetchData() {
  return fetch('/api').then(res => res.json());
}

const ApiFacade = { getData: fetchData };
```

---

### 🔹 Use the **Proxy Pattern** when:

```js
const user = { name: 'Tushar' };
const proxy = new Proxy(user, {
  get: (target, prop) => prop in target ? target[prop] : 'Not found'
});
```

---

### 🔹 Use the **Chain of Responsibility Pattern** when:

```js
function handler1(req, next) {
  if (req === 'pass') next(req);
}

function handler2(req) {
  console.log('Handled:', req);
}

handler1('pass', handler2);
```

---

### 🔹 Use the **Memento Pattern** when:

```js
function createEditor() {
  let content = '';
  const history = [];
  return {
    type: txt => content += txt,
    save: () => history.push(content),
    undo: () => content = history.pop() || '',
    getContent: () => content
  };
}
```

---

### 🔹 Use the **Mediator Pattern** when:

```js
function Mediator() {
  const channels = {};
  return {
    subscribe: (event, fn) => {
      (channels[event] = channels[event] || []).push(fn);
    },
    publish: (event, data) => {
      (channels[event] || []).forEach(fn => fn(data));
    }
  };
}
```

---

### 🔹 Use the **State Pattern** when:

```js
function Light() {
  let state = 'off';
  return {
    toggle: () => state = (state === 'off' ? 'on' : 'off'),
    status: () => state
  };
}
```

---

### 🔹 Use the **Visitor Pattern** when:

```js
function accept(visitor, node) {
  if (node.type === 'Text') visitor.visitText(node);
  if (node.type === 'Element') visitor.visitElement(node);
}
```

---

### 🔹 Use the **Composite Pattern** when:

```js
function Node(name) {
  return {
    name,
    children: [],
    add(child) { this.children.push(child); },
    print(indent = '') {
      console.log(indent + this.name);
      this.children.forEach(c => c.print(indent + '  '));
    }
  };
}
```

---

### 🔹 Use the **Flyweight Pattern** when:

```js
const CircleFactory = (() => {
  const cache = {};
  return {
    getCircle: color => cache[color] || (cache[color] = { color })
  };
})();
```

---

## 📌 Summary Cheat Sheet

| Problem / Question                                | Recommended Pattern     |
| ------------------------------------------------- | ----------------------- |
| I need one shared instance                        | Singleton               |
| I want to create multiple similar objects         | Factory                 |
| I want to step-by-step configure an object        | Builder                 |
| I want to group logic with private variables      | Module                  |
| I want to notify many on a single change          | Observer                |
| I want to switch logic at runtime                 | Strategy                |
| I want to encapsulate user actions                | Command                 |
| I want to connect incompatible APIs               | Adapter                 |
| I want to add features without altering code      | Decorator               |
| I want to simplify access to complex systems      | Facade                  |
| I want to delay or cache object access            | Proxy                   |
| I want multiple handlers for the same request     | Chain of Responsibility |
| I want to save/restore an object’s state          | Memento                 |
| I want a centralized message mediator             | Mediator                |
| I want to change behavior based on internal state | State                   |
| I want to perform operations on data structures   | Visitor                 |
| I want to treat tree structures as single objects | Composite               |
| I want to save memory by sharing objects          | Flyweight               |

---

## 🧠 General Advice

1. **Let the problem drive the pattern** — don’t force it.
2. **Refactor into patterns** — write code naturally, optimize later.
3. **Use patterns to reduce complexity**, not increase it.

---

## 📚 Final Tip

Design patterns are best learned through **real coding experience**. Keep solving problems, and you’ll begin to recognize patterns as **intuitive solutions**, not abstract theory.

