# 🎯 Promise.all() Implementation

Let's break down **`Promise.all`** using **Atom-of-Thoughts**, followed by a clean implementation.

---

## 🧠 Understanding Promise.all

---

### **Atom 1: Purpose**

`Promise.all` takes an iterable of promises and returns a single promise that:

* ✅ Resolves when **all input promises resolve**
* ❌ Rejects immediately if **any one promise rejects**

---

### **Atom 2: Normalization**

* Any non-promise value is wrapped with `Promise.resolve(value)` to make it thenable.

---

### **Atom 3: Tracking Resolution**

* Maintain a `results` array, same length as input
* Track how many have resolved
* Preserve order: store each result by **index**

---

### **Atom 4: Early Exit on Rejection**

* If any promise rejects, the entire function **rejects immediately**
* Further results are ignored

---

### **Atom 5: Edge Case**

* Empty array → resolves immediately with `[]`

---

## ✅ Implementation: `promiseAll`

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const promises = Array.from(iterable);
    const results = [];
    let resolvedCount = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(value => {
          results[i] = value;
          resolvedCount++;
          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject); // reject fast on first error
    });
  });
}
```

---

### 🧪 Example 1: All Resolve

```js
promiseAll([
  Promise.resolve(1),
  2,
  new Promise(res => setTimeout(() => res(3), 100))
]).then(console.log); // → [1, 2, 3]
```

---

### 🧪 Example 2: One Fails

```js
promiseAll([
  Promise.resolve(1),
  Promise.reject("fail"),
  Promise.resolve(3)
]).catch(console.error); // → "fail"
```
