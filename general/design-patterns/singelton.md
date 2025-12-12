---
date: 2025-05-09T13:06:09+05:30
description: Ensures only one instance of a class exists with global access. Use for config managers, logging services, caches, and shared state stores.
---

# 🔒 Singleton — One Instance to Rule Them All

The Singleton pattern ensures a class has only one instance and provides a global point of access to it. In JavaScript, it's commonly used for configuration managers, logging services, caches, and state stores.

---

## 1️⃣ Core Idea

```
┌───────────────┐
│  Application  │
├───────────────┤       getInstance()
│ Component A ──┼───────────────────┐
│ Component B ──┼───────────────────┤
│ Component C ──┼───────────────────┘
└───────────────┘
        ▲
        │ single shared object
┌───────────────────┐
│   SINGLETON 🔑    │  ← exactly one, globally accessible
└───────────────────┘
```

 *Guarantee* : only **one** object exists, and it’s easily accessible across the codebase.

---

## 2️⃣ Typical Front‑End Use‑Cases

| Use‑Case                            | Why Singleton?                                   |
| ------------------------------------ | ------------------------------------------------ |
| **Config / Feature Flags**     | Global access in any component.                  |
| **Analytics / Logging Client** | Maintain one WebSocket or batch queue.           |
| **Theme Manager**              | One source of truth for dark‑/light mode state. |
| **Event Bus**                  | Pub/Sub across micro‑frontends.                 |

---

## 3️⃣ Implementing Singleton in JavaScript

### 3.1 ES Module Pattern (Simplest)

```js
// analytics.js
class Analytics {
  log(event, data) { /* send to server */ }
}
export const analytics = new Analytics(); // already a singleton
```

> 🤔 **Why it works:** ES modules are  **singletons by spec** —imported once, cached forever.

### 3.2 Lazy Initialization Class

```js
class ThemeStore {
  static #instance;
  constructor() {
    if (ThemeStore.#instance) return ThemeStore.#instance; // enforce single
    this.mode = "light";
    ThemeStore.#instance = this;
  }
  toggle() { this.mode = this.mode === "light" ? "dark" : "light"; }
}
export default ThemeStore; // `new ThemeStore()` anywhere → same object
```

### 3.3 Factory‑Wrapped Singleton (Test‑Friendly)

```js
let _instance;
export function getLogger() {
  if (!_instance) _instance = createRealLogger();
  return _instance;
}
// In tests: override _instance = createMockLogger();
```


### 3.4 Classic Closure-Based Singleton

In a **singleton design pattern**, only one object is created for each interface (class or function), and the same object is returned every time the function or class is invoked.

This pattern is especially useful in scenarios where only one object is needed to coordinate actions across the system — such as a **notification manager**, **database connection**, or **event dispatcher**.

```javascript
const Singleton = (function () {
  let instance;

  function createInstance() {
    const object = new Object("I am the instance");
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

const object1 = Singleton.getInstance();
const object2 = Singleton.getInstance();

console.log(object1 === object2); // true
```

> ✅ This pattern uses a private variable (`<span>instance</span>`) enclosed within an IIFE (Immediately Invoked Function Expression) to ensure that the `<span>createInstance</span>` function is only called once.

---

## 4️⃣ Pros & Cons

| ✅ Advantages                    | ⚠️ Drawbacks                              |
| -------------------------------- | ------------------------------------------- |
| Easy shared state                | Hidden global → hard to trace dependencies |
| Resource efficiency (one socket) | Unit tests need mocking / reset state       |
| Simplifies configuration         | Tight coupling: swapping impl is harder     |
| Controlled access (centralised)  | Cannot subclass easily (sealed)             |

> **Rule of Thumb:** If the object holds  **stateless functions** , prefer pure modules. Use Singleton only for  **stateful shared resources** .

---

## 5️⃣ Testing Strategies

1. **Factory Wrapper:** As shown above, expose a `getInstance()` function and allow tests to inject a mock before first call.
2. **Module Mocking:** In Jest/Vitest, `jest.mock('./analytics', () => ({ analytics: mockObj }))`.
3. **Reset Hooks:** Provide `resetForTests()` exported only in non‑prod builds to clear internal state.

---

## 6️⃣ Interview‑Ready Talking Points

| Question                                           | Key Ideas                                                                     |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| *"How does ES module system enable singletons?"* | Module executed once, live bindings cached → every import gets same exports. |
| *"How would you make a singleton thread‑safe?"* | JS main thread is single; in workers use atomics / message passing.           |
| *"Why can Singleton hinder SSR?"*                | State leaks between user requests; solve via factory per request.             |
| *"Alternatives to Singleton?"*                   | Dependency Injection containers, passing props, context providers.            |

---

## 7️⃣ Anti‑Patterns & Remedies

| Anti‑Pattern                  | Symptom                                 | Fix                                                    |
| ------------------------------ | --------------------------------------- | ------------------------------------------------------ |
| **God Singleton**        | Holds too many responsibilities         | Split by bounded context                               |
| **Hidden Imports**       | File deep‑importing singleton silently | Explicit injection via props / DI                      |
| **Stateful Tests Bleed** | One test contaminates another           | Provide reset helper or fresh module registry per test |

---

## 8️⃣ Self‑Quiz (answers below)

1. Why are ES modules considered singletons?
2. What issue can arise if you store user session data in a singleton during server‑side rendering?
3. Provide two ways to replace a singleton with a mock during tests.
4. Name a scenario where Singleton is the wrong pattern.

---

## 🔚 Key Takeaways

* Singleton  **guarantees a single, globally shared instance** —powerful for logging, config, event buses.
* In modern JS, **ES modules** are the easiest Singleton mechanism.
* Beware of **global state coupling** and  **testing headaches** ; mitigate with factories and mocks.

Master these nuances and you’ll nail Singleton questions with confidence! 🚀
