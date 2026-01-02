---
date: 2025-05-06T07:45:22+05:30
description: Intercepts array mutations to dispatch custom events when push is called. Enables reactive arrays without frameworks or proxies.
premium: true
---
# ⚡️ Fire on Push: Dispatching Custom Events When an Array Changes in JavaScript

JavaScript arrays are powerful—but  **they don’t emit events** . Want to react when someone `.push()`es a new item? You’re out of luck... unless you take control.

This post shows you how to **intercept array mutations** and **dispatch custom events** when `push()` is called — all in vanilla JavaScript, no frameworks, no proxies.

---

## 🧪 The Goal

We want to monitor this:

```js
myArray.push("newItem");
```

And react like this:

```js
document.addEventListener("arrayPush", e => {
  console.log("Pushed:", e.detail);
});
```

---

## 🛠 Step 1: Custom Array Wrapper

```js
function createObservableArray(initial = []) {
  const arr = [...initial];

  arr.push = function (...items) {
    const result = Array.prototype.push.apply(this, items);

    const event = new CustomEvent("arrayPush", {
      detail: {
        added: items,
        newLength: this.length
      }
    });

    document.dispatchEvent(event);
    return result;
  };

  return arr;
}
```

---

## 🚀 Usage

```js
const myArray = createObservableArray();

document.addEventListener("arrayPush", (e) => {
  console.log("Array was pushed:", e.detail);
});

myArray.push("alpha");
// logs: { added: ["alpha"], newLength: 1 }

myArray.push("beta", "gamma");
// logs: { added: ["beta", "gamma"], newLength: 3 }
```

---

## 🎯 Why This Works

* We're overriding `push()` on a **per-array basis**
* We preserve original functionality via `Array.prototype.push.apply(...)`
* We dispatch a `CustomEvent` with rich detail

---

## 🧠 Bonus: Generalizing for Other Methods

Want to observe `pop`, `shift`, or even `splice`? Here’s a sketch:

```js
function makeObservable(arr, methods = ["push"]) {
  for (const method of methods) {
    const original = arr[method];
    arr[method] = function (...args) {
      const result = original.apply(this, args);
      document.dispatchEvent(new CustomEvent(`array:${method}`, {
        detail: { args, result, current: [...this] }
      }));
      return result;
    };
  }
  return arr;
}
```

```js
const list = makeObservable([]);
document.addEventListener("array:push", e => console.log("Pushed", e.detail));
document.addEventListener("array:pop", e => console.log("Popped", e.detail));

list.push("x");
list.pop();
```

---

## 🧬 Alternative: Using Proxies (Advanced)

Want a more general-purpose reactive array? Use a `Proxy`. It’s more powerful but less performant:

```js
function reactiveArray(arr = []) {
  return new Proxy(arr, {
    get(target, prop) {
      if (prop === "push") {
        return (...items) => {
          const result = Array.prototype.push.apply(target, items);
          document.dispatchEvent(new CustomEvent("arrayPush", {
            detail: { added: items }
          }));
          return result;
        };
      }
      return Reflect.get(target, prop);
    }
  });
}
```

---

## 🔚 Conclusion

You don’t need Vue or MobX to detect array changes. With just a few lines of JavaScript, you can:

* Intercept native behavior
* Dispatch clean, custom events
* Build observability into data structures

This pattern is a foundation for reactive state systems, event-driven logic, or any scenario where **"changes should trigger actions."**

---

Want a React-compatible or Svelte-integrated version? Ask and I'll tailor one.

---

<!-- quiz-start -->
### Q1: How does the observable array intercept the `push` method?
- [ ] By using Object.defineProperty
- [x] By overriding the push method on the specific array instance
- [ ] By modifying Array.prototype directly
- [ ] By using a Proxy on all arrays

### Q2: Why is `Array.prototype.push.apply(this, items)` used in the custom push method?
- [ ] To make the code shorter
- [ ] To avoid using the spread operator
- [x] To call the original push functionality while preserving context
- [ ] To improve performance

### Q3: What does the `CustomEvent` dispatch include in its detail?
- [ ] Only the array length
- [ ] The entire array
- [x] The added items and the new array length
- [ ] The timestamp of the push
<!-- quiz-end -->
