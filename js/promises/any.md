---
date: 2025-03-27T08:09:10+05:30
description: Promise.any resolves as soon as any promise succeeds. Rejects only if all promises fail, returning an AggregateError.
---
# 🎯 Promise.any() Implementation

`Promise.any()` takes an iterable of promises and returns a single promise that resolves as soon as any of the input promises fulfills. If all promises reject, it rejects with an `AggregateError` containing all rejection reasons.

---

## 🧠 Understanding Promise.any

---

### **Atom 1: Purpose**

`Promise.any` returns a promise that:

* ✅ Resolves as soon as **any input promise resolves**
* ❌ Rejects **only if all input promises reject**

---

### **Atom 2: Normalization**

* Convert all inputs to promises with `Promise.resolve(...)`

---

### **Atom 3: Resolve on First Fulfilled**

* On first `.then`, resolve the outer promise.

---

### **Atom 4: Track Rejections**

* Maintain count of rejections.
* If all promises reject, reject with  **`AggregateError`** , which contains all rejection reasons.

---

### **Atom 5: Edge Case**

* If input is empty → reject immediately with `AggregateError`

---

## ✅ Implementation: `promiseAny`

```js
function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const errors = [];
    let rejectedCount = 0;

    if (promises.length === 0) {
      return reject(new AggregateError([], "All promises were rejected"));
    }

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(resolve)
        .catch((err) => {
          errors[i] = err;
          rejectedCount++;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
}
```

---

### 🧪 Example:

```js
promiseAny([
  Promise.reject("fail1"),
  new Promise(res => setTimeout(() => res("success"), 100)),
  Promise.reject("fail2")
]).then(console.log)
  .catch(console.error); // → "success"
```

### ❌ If all reject:

```js
promiseAny([
  Promise.reject("fail1"),
  Promise.reject("fail2")
]).then(console.log)
  .catch(err => {
    console.error(err instanceof AggregateError); // true
    console.error(err.errors);                   // ["fail1", "fail2"]
  });
```

