# 🛑 Cancelable Promise Implementation

Here's a clean implementation of a **cancelable promise** in JavaScript.

---

## ✅ Implementation

```js
function makeCancelable(promise) {
  let hasCanceled = false;

  const wrapped = new Promise((resolve, reject) => {
    promise
      .then((val) => (hasCanceled ? reject({ canceled: true }) : resolve(val)))
      .catch((err) => (hasCanceled ? reject({ canceled: true }) : reject(err)));
  });

  return {
    promise: wrapped,
    cancel() {
      hasCanceled = true;
    }
  };
}
```

---

### 🧪 Example:

```js
const task = new Promise((res) => setTimeout(() => res("Done"), 1000));
const cancelable = makeCancelable(task);

cancelable.promise
  .then(console.log)
  .catch((err) => {
    if (err.canceled) console.log("Canceled");
    else console.error(err);
 });

setTimeout(() => cancelable.cancel(), 500); // cancel before it resolves
```

---

### ✅ Behavior:

* If `.cancel()` is called before resolution, the promise rejects with `{ canceled: true }`.
* If not canceled, resolves normally.
* Doesn’t abort the underlying task — only prevents `.then()`/`.catch()` from running.

---

### 🧠 Notes:

* This doesn't stop network/fetch/etc. — only  **suppresses result handlers** .
* Use `AbortController` for cancelable fetch requests or actual task termination.
