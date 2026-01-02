---
date: 2025-03-27T08:09:10+05:30
description: A wrapper that prevents promise handlers from executing after cancellation. Useful for avoiding state updates in unmounted components.
premium: true
---
# 🛑 Cancelable Promise Implementation

A cancelable promise wrapper allows you to prevent promise handlers from executing after cancellation. This is useful for avoiding state updates in unmounted React components or canceling outdated API responses.

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

---

<!-- quiz-start -->
### Q1: What does calling cancel() on a cancelable promise actually do?
- [ ] It immediately aborts the underlying async operation
- [ ] It throws an error that stops the promise execution
- [x] It prevents the .then() and .catch() handlers from executing normally
- [ ] It removes the promise from memory

### Q2: What happens when a cancelable promise is canceled before resolution?
- [ ] The promise resolves with null
- [ ] The original promise is destroyed
- [x] The promise rejects with `{ canceled: true }`
- [ ] The promise remains pending forever

### Q3: For truly canceling a fetch request (not just ignoring results), what should you use?
- [ ] Promise.cancel()
- [ ] clearTimeout()
- [x] AbortController
- [ ] Promise.reject()
<!-- quiz-end -->
