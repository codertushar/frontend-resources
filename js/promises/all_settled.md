---
date: 2025-03-27T08:09:10+05:30
description: Promise.allSettled waits for all promises to settle and returns their outcomes. Never rejects, always returns success and error results.
premium: true
---
# ✅ Promise.allSettled() Implementation

`Promise.allSettled()` returns a promise that resolves after all input promises have settled (either fulfilled or rejected). Unlike `Promise.all()`, it never rejects—it always returns an array of result objects describing each promise's outcome.

---

## 🧠 Understanding Promise.allSettled

---

### **Atom 1: Purpose**

`Promise.allSettled` returns a promise that:

* ✅ Resolves **when all input promises settle** (either resolve or reject)
* ❌ **Never rejects** — result always contains an array of outcomes

---

### **Atom 2: Result Format**

Each result is an object with shape:

* If resolved: `{ status: "fulfilled", value: result }`
* If rejected: `{ status: "rejected", reason: error }`

---

### **Atom 3: Normalize Inputs**

Use `Promise.resolve(...)` to handle non-promise inputs.

---

### **Atom 4: Track Completion**

* Maintain `results[]`
* Track how many have settled
* Resolve once **all have settled**

---

### **Atom 5: Edge Case**

* Empty input → resolve to `[]` immediately

---

## ✅ Implementation: `promiseAllSettled`

```js
function promiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const promises = Array.from(iterable);
    const results = [];
    let settledCount = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = { status: "fulfilled", value };
        })
        .catch(reason => {
          results[i] = { status: "rejected", reason };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) {
            resolve(results);
          }
        });
    });
  });
}
```

---

### 🧪 Example:

```js
promiseAllSettled([
  Promise.resolve(1),
  Promise.reject("fail"),
  3
]).then(console.log);

/*
[
  { status: "fulfilled", value: 1 },
  { status: "rejected", reason: "fail" },
  { status: "fulfilled", value: 3 }
]
*/
```

---

<!-- quiz-start -->
### Q1: What is the key difference between Promise.all and Promise.allSettled?
- [ ] Promise.allSettled runs promises sequentially
- [ ] Promise.allSettled is faster than Promise.all
- [x] Promise.allSettled never rejects and returns all outcomes regardless of failures
- [ ] Promise.allSettled only works with async/await syntax

### Q2: What is the result format for a rejected promise in Promise.allSettled?
- [ ] `{ success: false, error: reason }`
- [ ] `{ fulfilled: false, value: reason }`
- [x] `{ status: "rejected", reason: error }`
- [ ] `{ state: "error", message: reason }`

### Q3: What does Promise.allSettled return when passed an empty array?
- [ ] It throws an error
- [ ] It returns a promise that never settles
- [x] It resolves immediately with an empty array []
- [ ] It rejects with an AggregateError
<!-- quiz-end -->
