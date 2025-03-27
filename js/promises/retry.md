Here's a precise utility to  **retry a promise-returning function up to N times on failure** :

---

### ✅ **Retry Promise N Times**

```js
function retry(fn, retries = 3, delay = 0) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (n === 0) return reject(err);
          setTimeout(() => attempt(n - 1), delay);
        });
    };
    attempt(retries);
  });
}
```

---

### 🧪 Example:

```js
let counter = 0;
const unstableTask = () => {
  return new Promise((res, rej) => {
    counter++;
    if (counter < 3) rej("fail " + counter);
    else res("success on attempt " + counter);
  });
};

retry(unstableTask, 5, 500)
  .then(console.log)
  .catch(console.error);
```

---

### ✅ Features:

* `fn` is retried up to `retries` times.
* Optional `delay` (ms) between retries.
* Stops on first success.
* Rejects with final error if all fail.

---

Want exponential backoff or max timeout behavior?
