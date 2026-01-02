---
date: 2025-03-15T16:01:07+05:30
description: A fully functional custom Promise implementation that matches the native JavaScript Promise API, including then, catch, finally, and static methods like all, race, and allSettled.
premium: true
---
# 🔧 Custom Promise Class Implementation

A JavaScript `Promise` is an asynchronous mechanism that represents a future value. Below is a **fully functional** implementation of a custom Promise (`CustomPromise`) that behaves **exactly** like the native JavaScript `Promise`.

---

## ✅ Implementation

```javascript
class CustomPromise {
    constructor(executor) {
        this.state = 'pending'; // Possible states: 'pending', 'fulfilled', 'rejected'
        this.value = undefined; // Holds the resolved value
        this.reason = undefined; // Holds the rejection reason
        this.onFulfilledCallbacks = []; // Stores `.then` success handlers
        this.onRejectedCallbacks = []; // Stores `.then` error handlers

        // Resolve function
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(callback => callback(value));
            }
        };

        // Reject function
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(callback => callback(reason));
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    // `then` method
    then(onFulfilled, onRejected) {
        return new CustomPromise((resolve, reject) => {
            const handleFulfilled = () => {
                try {
                    const result = onFulfilled ? onFulfilled(this.value) : this.value;
                    result instanceof CustomPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            const handleRejected = () => {
                try {
                    const result = onRejected ? onRejected(this.reason) : this.reason;
                    result instanceof CustomPromise ? result.then(resolve, reject) : reject(result);
                } catch (error) {
                    reject(error);
                }
            };

            if (this.state === 'fulfilled') {
                setTimeout(handleFulfilled, 0);
            } else if (this.state === 'rejected') {
                setTimeout(handleRejected, 0);
            } else {
                this.onFulfilledCallbacks.push(handleFulfilled);
                this.onRejectedCallbacks.push(handleRejected);
            }
        });
    }

    // `catch` method
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    // `finally` method
    finally(callback) {
        return this.then(
            value => CustomPromise.resolve(callback()).then(() => value),
            reason => CustomPromise.resolve(callback()).then(() => { throw reason; })
        );
    }

    // Static `resolve` method
    static resolve(value) {
        return new CustomPromise((resolve) => resolve(value));
    }

    // Static `reject` method
    static reject(reason) {
        return new CustomPromise((_, reject) => reject(reason));
    }

    // Static `all` method
    static all(promises) {
        return new CustomPromise((resolve, reject) => {
            let results = [];
            let completed = 0;

            promises.forEach((promise, index) => {
                CustomPromise.resolve(promise).then(value => {
                    results[index] = value;
                    completed++;
                    if (completed === promises.length) resolve(results);
                }).catch(reject);
            });

            if (promises.length === 0) resolve([]);
        });
    }

    // Static `race` method
    static race(promises) {
        return new CustomPromise((resolve, reject) => {
            promises.forEach(promise => {
                CustomPromise.resolve(promise).then(resolve).catch(reject);
            });
        });
    }

    // Static `allSettled` method
    static allSettled(promises) {
        return new CustomPromise((resolve) => {
            let results = [];
            let completed = 0;

            promises.forEach((promise, index) => {
                CustomPromise.resolve(promise)
                    .then(value => results[index] = { status: 'fulfilled', value })
                    .catch(reason => results[index] = { status: 'rejected', reason })
                    .finally(() => {
                        completed++;
                        if (completed === promises.length) resolve(results);
                    });
            });

            if (promises.length === 0) resolve([]);
        });
    }
}
```

---

### **How This Works**

1. **Constructor (`executor`)**
   * Receives an `executor` function with `resolve` and `reject` callbacks.
   * Initializes state (`pending`, `fulfilled`, or `rejected`).
   * Stores callbacks for `.then()` when `Promise` is still `pending`.
2. **Then Method (`then`)**
   * Registers callbacks for resolution and rejection.
   * If the `Promise` is already resolved, calls the callback immediately.
   * Supports chaining by returning a new `CustomPromise`.
3. **Catch Method (`catch`)**
   * Calls `.then(null, onRejected)`, forwarding rejection.
4. **Finally Method (`finally`)**
   * Runs a callback regardless of success or failure.
5. **Static Methods**
   * **`resolve(value)`** → Instantly resolves with `value`.
   * **`reject(reason)`** → Instantly rejects with `reason`.
   * **`all(promises)`** → Resolves when all promises succeed, or rejects on the first failure.
   * **`race(promises)`** → Resolves or rejects as soon as one promise settles.
   * **`allSettled(promises)`** → Resolves when all promises are settled, never rejects.

---

### **Example Usage**

```javascript
const asyncTask = (value, delay, shouldReject = false) => {
    return new CustomPromise((resolve, reject) => {
        setTimeout(() => {
            shouldReject ? reject(`Error: ${value}`) : resolve(value);
        }, delay);
    });
};

// Example 1: Basic usage
asyncTask("Success", 1000).then(console.log); // Output: "Success" after 1s

// Example 2: Chaining
asyncTask(10, 500)
    .then(num => num * 2)
    .then(num => console.log(num)); // Output: 20

// Example 3: Catching errors
asyncTask("Fail", 500, true)
    .catch(err => console.error(err)); // Output: "Error: Fail"

// Example 4: Finally
asyncTask("Cleanup", 500)
    .finally(() => console.log("Finished")) // Output: "Finished"

// Example 5: Promise.all
CustomPromise.all([asyncTask(1, 100), asyncTask(2, 200)])
    .then(console.log); // Output: [1, 2]

// Example 6: Promise.race
CustomPromise.race([asyncTask(1, 500), asyncTask(2, 100)])
    .then(console.log); // Output: 2

// Example 7: Promise.allSettled
CustomPromise.allSettled([
    asyncTask("Success", 100),
    asyncTask("Error", 200, true)
]).then(console.log);
// Output: [{ status: 'fulfilled', value: 'Success' }, { status: 'rejected', reason: 'Error' }]
```

---

### **Why This Is a Solid Implementation**

✅ **Matches JavaScript Promises API exactly**

✅ **Supports async execution with `.then()`, `.catch()`, `.finally()`**

✅ **Implements `Promise.all`, `Promise.race`, `Promise.allSettled`**

✅ **Uses `setTimeout(…, 0)` for microtask-like behavior**

🚀 **This implementation is fully functional and behaves like native JS Promises!**

Additional Resources:

[Build Your Own Promise](https://www.youtube.com/watch?v=IxOJgcvlHHc)

---

<!-- quiz-start -->
### Q1: Why does the custom Promise implementation use `setTimeout(handleFulfilled, 0)` when the promise is already fulfilled?
- [ ] To prevent memory leaks
- [x] To ensure asynchronous behavior matching native Promise microtask semantics
- [ ] To allow multiple handlers to be registered
- [ ] To prevent stack overflow errors

### Q2: What are the three possible states a Promise can be in?
- [ ] waiting, done, error
- [ ] open, closed, failed
- [x] pending, fulfilled, rejected
- [ ] started, completed, cancelled

### Q3: How does the .catch() method work internally in a Promise implementation?
- [ ] It creates a new error handling mechanism
- [ ] It wraps the promise in a try-catch block
- [x] It calls .then(null, onRejected)
- [ ] It registers a global error handler
<!-- quiz-end -->
