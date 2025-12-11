# 📋 Sequential Promise Execution

To **execute promises in sequence**, chain them using `reduce` or an async loop.

---

## ✅ Using Array.prototype.reduce

```js
function runSequential(promises) {
  return promises.reduce(
    (chain, current) => chain.then(() => current()),
    Promise.resolve()
  );
}
```

> Each `current` must be a function returning a promise.

---

### 🧪 Example:

```js
const tasks = [
  () => Promise.resolve(console.log("1")),
  () => new Promise(res => setTimeout(() => { console.log("2"); res(); }, 1000)),
  () => Promise.resolve(console.log("3"))
];

runSequential(tasks);
```

**Output:**

```
1
(wait 1s)
2
3
```

---

### ✅ 2. **Using async/await loop (more readable)**

```js
async function runSequential(tasks) {
  for (const task of tasks) {
    await task();
  }
}
```

Same usage as above.

---

### Notes:

* Promises  **start only after the previous one completes** .
* Use when order matters (e.g. file writes, dependent API calls).


If each promise  **depends on the result of the previous** , you need to  **pass the previous result forward** . Use an `async/await` loop and chain results explicitly.

---

### ✅ **Pattern: Sequential dependent promises**

```js
async function runSequential(tasks, initialValue) {
  let result = initialValue;
  for (const task of tasks) {
    result = await task(result);
  }
  return result;
}
```

Each `task` is a function that accepts the previous result and returns a promise.

---

### 🧪 Example:

```js
const tasks = [
  (x) => Promise.resolve(x + 1),            // 1 → 2
  (x) => Promise.resolve(x * 3),            // 2 → 6
  (x) => new Promise(res => setTimeout(() => res(x - 4), 500)) // 6 → 2
];

runSequential(tasks, 1).then(console.log);  // → 2
```

---

### ✅ Behavior:

* Passes value from one promise to the next.
* Works with both sync and async returns.
* Use case: chained API calls, data transformation pipelines.
