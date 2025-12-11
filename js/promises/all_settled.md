# ✅ Promise.allSettled() Implementation

Let's break down **`Promise.allSettled`** using **Atom-of-Thoughts**, then implement it.

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

Let me know if you want:

* A version that supports cancellation
* `Promise.any` (resolves on first success, rejects if all fail)
