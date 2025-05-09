# 👀 Observer Pattern — React to Change Automatically

> **Use this guide as a quick-reference for interviews or design discussions.**

---

## 1️⃣ Core Idea

The **Observer Pattern** (also known as the  **Pub/Sub Pattern** ) is a behavioral design pattern in which a **subject (publisher)** maintains a list of **observers (subscribers)** and **notifies them automatically** whenever a state change or event occurs.

```
┌──────────────┐       update()       ┌──────────────┐
│  Subject 🔔  │ ───────────────────▶ │ Observer 👁  │
│ (Notifier)  │ ◀─────────────────── │ (Listener)   │
└──────────────┘       subscribe()    └──────────────┘
```

This pattern promotes **loose coupling** between the subject and the observers, facilitating clean, modular design — a fundamental principle of event-driven programming.

---

## 2️⃣ JavaScript & Event-Driven Programming

JavaScript is one of the most event-driven programming languages. We frequently use the Observer Pattern via  **event listeners** :

```js
const button = document.querySelector("#myBtn");
const handleClick = (e) => console.log(e.clientX, e.clientY);

button.addEventListener("click", handleClick);
// Later:
button.removeEventListener("click", handleClick);
```

> ✅ The browser’s event system is a natural example of the observer pattern in action.

---

## 3️⃣ Basic Implementation

### 3.1 Simple Observer System

```js
const Move = function(){
  this.handlers = [];

  this.subscribe = function (fn) {
    this.handlers.push(fn);
  };

  this.unsubscribe = function (fn) {
    this.handlers = this.handlers.filter((item) => item !== fn);
  };

  this.fire = function (o, thisObj) {
    const scope = thisObj || window;
    this.handlers.forEach((item) => {
      item.call(scope, o);
    });
  }
}

const moveHandler = (item) => console.log("fired: " + item);
const moveHandler2 = (item) => console.log("Moved: " + item);

const move = new Move();

move.subscribe(moveHandler);
move.fire('event #1');
move.unsubscribe(moveHandler);
move.fire('event #2');
move.subscribe(moveHandler);
move.subscribe(moveHandler2);
move.fire('event #3');
```

### Output:

```
fired: event #1
fired: event #3
Moved: event #3
```

---

## 4️⃣ Advanced Version: Multi-Mode Event Hub

Inspired by a Coursera interview, here's an advanced Observer implementation supporting:

* `subscribe()`
* `subscribeOnce()`
* `subscribeOnceAsync()`
* `publish()`
* `publishAll()`

```js
function Events() {
  this.subscriptionList = new Map();
  this.subscribeOnceList = new Map();
  this.subscribeOnceAsyncList = new Map();

  this.subscribe = function (name, callback) {
    if (!this.subscriptionList.has(name)) {
      this.subscriptionList.set(name, [callback]);
    } else {
      const existing = this.subscriptionList.get(name);
      this.subscriptionList.set(name, [...existing, callback]);
    }
    return {
      remove: () => {
        const existing = this.subscriptionList.get(name);
        const filtered = existing.filter(e => e !== callback);
        this.subscriptionList.set(name, filtered);
      }
    };
  };

  this.subscribeOnce = function (name, callback) {
    if (!this.subscribeOnceList.has(name)) {
      this.subscribeOnceList.set(name, [callback]);
    } else {
      const existing = this.subscribeOnceList.get(name);
      this.subscribeOnceList.set(name, [...existing, callback]);
    }
  };

  this.subscribeOnceAsync = async function (name) {
    return new Promise((resolve) => {
      if (!this.subscribeOnceAsyncList.has(name)) {
        this.subscribeOnceAsyncList.set(name, [resolve]);
      } else {
        const existing = this.subscribeOnceAsyncList.get(name);
        this.subscribeOnceAsyncList.set(name, [...existing, resolve]);
      }
    });
  };

  this.publish = function (name, data) {
    const callbacks = this.subscriptionList.get(name) || [];
    callbacks.forEach((e) => e(data));

    const onceCallbacks = this.subscribeOnceList.get(name) || [];
    onceCallbacks.forEach((e) => e(data));
    this.subscribeOnceList.set(name, []);

    const asyncOnceCallbacks = this.subscribeOnceAsyncList.get(name) || [];
    asyncOnceCallbacks.forEach((e) => e(data));
    this.subscribeOnceAsyncList.set(name, []);
  };

  this.publishAll = function (data) {
    for (let [_, callbacks] of this.subscriptionList.entries()) {
      callbacks.forEach(e => e(data));
    }
  };
}
```

### Sample Test

```js
const events = new Events();

const sub1 = events.subscribe("new-user", (payload) => console.log(`Q1 News: ${payload}`));
events.publish("new-user", "Jhon");

const sub2 = events.subscribe("new-user", (payload) => console.log(`Q2 News: ${payload}`));
events.publish("new-user", "Doe");

sub1.remove();
events.publish("new-user", "Foo");

events.publishAll("FooBar");

events.subscribeOnce("new-user", (payload) => console.log(`Once: ${payload}`));
events.publish("new-user", "Foo Once");
events.publish("new-user", "Foo Twice");

events.subscribeOnceAsync("new-user").then(payload => console.log(`Once Async: ${payload}`));
events.publish("new-user", "Foo Once Async");
```

---

## 5️⃣ Observer vs Pub-Sub

| Feature              | Observer                          | Pub-Sub                                |
| -------------------- | --------------------------------- | -------------------------------------- |
| Direct link          | Subject holds observer references | Decoupled via channels/topics          |
| Notification trigger | Direct method call                | Broadcast via event bus or channel     |
| Common in            | MVC apps, local state updates     | Microservices, cross-app communication |

---

## 6️⃣ Pros & Cons

| ✅ Advantages                     | ⚠️ Drawbacks                               |
| --------------------------------- | -------------------------------------------- |
| Loose coupling, modularity        | May cause memory leaks (unremoved observers) |
| Supports dynamic notification     | Can cause performance issues with many subs  |
| Easy integration in event systems | Complex state sync in larger apps            |

---

## 7️⃣ Interview Q&A

### Q1: What is the Observer Pattern?

**A:** It’s a behavioral pattern where an object (subject) notifies a list of observers when a change in state occurs.

### Q2: Difference between Observer and Pub/Sub?

**A:** In Observer, the subject knows the observers directly. In Pub/Sub, they are decoupled via a message broker or event bus.

### Q3: How does JavaScript use the Observer Pattern?

**A:** Through event listeners (`addEventListener`, `onClick`), state libraries like Redux, and libraries like RxJS.

### Q4: When is Observer not a good fit?

**A:** In highly decoupled systems where components should not know about each other; use Pub/Sub instead.

### Q5: How do you prevent memory leaks with observers?

**A:** Always `unsubscribe()` observers when they’re no longer needed, especially in component unmounts.

### Q6: Can we use Observer Pattern with Promises?

**A:** Yes, using `subscribeOnceAsync()` to resolve a Promise when an event is published, allowing one-time async handling.

### Q7: What's the real-world analogy for Observer Pattern?

**A:** A YouTube channel (subject) where subscribers (observers) get notified when a new video is published.

---

## 🔚 Key Takeaways

* Observer Pattern enables **reactive communication** between objects.
* Ideal when **one-to-many updates** are required, like  **UI refreshes, live feeds** , or  **modular plugins** .
* JavaScript embraces this pattern heavily through  **DOM events** ,  **custom listeners** , and  **async flows** .

Master this pattern to design  **flexible** ,  **scalable** , and **responsive** systems. 🧠🔄
