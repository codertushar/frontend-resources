---
date: 2025-03-27T08:09:10+05:30
description: Promise.race settles as soon as the first promise settles, whether it resolves or rejects. Used for timeouts and fastest response patterns.
premium: false
---
# 🏁 Promise.race() Implementation

`Promise.race()` returns a promise that settles as soon as any of the input promises settles—whether it resolves or rejects. The first promise to complete "wins the race" and determines the outcome.

---

## 🧠 Understanding Promise.race

---

### **Atom 1: Purpose**

`Promise.race` returns a promise that settles **as soon as any input promise settles** — resolved or rejected.

> First one wins — race ends immediately.

---

### **Atom 2: Inputs**

* Takes an iterable (usually an array) of **promises or values**
* Wrap each with `Promise.resolve()` to normalize non-promises

---

### **Atom 3: Core Logic**

* Attach `.then(resolve)` and `.catch(reject)` to **each input**
* As soon as  **any one settles** , resolve/reject outer promise
* Ignore later results

---

### **Atom 4: Edge Case**

* If input is  **empty** , the returned promise **never settles**

---

## ✅ Implementation: `promiseRace`

```js
function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const item of iterable) {
      Promise.resolve(item)
        .then(resolve)
        .catch(reject);
    }
  });
}
```

---

### 🧪 Example:

```js
const p1 = new Promise((res) => setTimeout(() => res("one"), 500));
const p2 = new Promise((res) => setTimeout(() => res("two"), 100));

promiseRace([p1, p2]).then(console.log); // → "two"
```

---

### ⚠️ Example with Rejection:

```js
const p1 = new Promise((_, rej) => setTimeout(() => rej("fail"), 50));
const p2 = new Promise((res) => setTimeout(() => res("win"), 100));

promiseRace([p1, p2])
  .then(console.log)
  .catch(console.error); // → "fail"
```

