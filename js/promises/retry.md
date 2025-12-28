---
date: 2025-03-27T08:09:10+05:30
description: Automatically retries a failed async operation a specified number of times with optional delays. Essential for handling transient failures.
premium: true
---
# 🔄 Promise Retry Implementation

Promise retry is a resilience pattern that automatically retries a failed async operation a specified number of times before giving up. This is essential for handling transient network failures, rate limits, or intermittent service unavailability.

---

## ✅ Implementation

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

<!-- quiz-start -->
### Q1: In the retry implementation, what happens when a retry succeeds?
- [ ] It continues retrying until all attempts are exhausted
- [x] It immediately resolves and stops further retry attempts
- [ ] It collects the result and waits for other retries
- [ ] It logs the success and retries once more to confirm

### Q2: Why must the first argument to retry() be a function that returns a promise, rather than a promise itself?
- [ ] Functions are faster than promises
- [ ] It's required for TypeScript compatibility
- [x] A promise starts executing immediately when created, so we need a function to create fresh promises for each retry
- [ ] Functions provide better error messages

### Q3: What is a common real-world use case for promise retry?
- [ ] Caching API responses
- [ ] Running promises in parallel
- [x] Handling transient network failures or rate limits
- [ ] Converting callbacks to promises
<!-- quiz-end -->
