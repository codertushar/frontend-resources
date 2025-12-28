---
date: 2025-03-27T08:09:10+05:30
description: Promise.all waits for all promises to resolve and returns their results as an array. Rejects immediately if any promise fails.
premium: true
---
# 🎯 Promise.all() Implementation

> **Interview Importance:** 🔴 Critical — Implementing `Promise.all` is one of the most common JavaScript interview questions. Tests understanding of promises, async handling, and edge cases.

---

## 1️⃣ What is Promise.all?

`Promise.all` takes an **iterable** (usually an array) of promises and returns a single promise that:

- **Resolves** when **ALL** input promises resolve -> returns array of results in order
- **Rejects** immediately when **ANY** promise rejects -> returns the first rejection reason

```
Input:  [Promise1, Promise2, Promise3]
                v
           Promise.all()
                v
Output: Promise<[result1, result2, result3]>
```

### Visual Behavior

```
Scenario 1: All Resolve
---------------------------------------------------------
Promise 1: --------●------------------------------------> resolves "A" at 100ms
Promise 2: ------------------●--------------------------> resolves "B" at 200ms
Promise 3: ----------------------------●----------------> resolves "C" at 300ms
                                       v
Promise.all: --------------------------●----------------> resolves ["A", "B", "C"]
                                    (at 300ms - waits for slowest)

Scenario 2: One Rejects
---------------------------------------------------------
Promise 1: --------●------------------------------------> resolves "A" at 100ms
Promise 2: --------------✗------------------------------> REJECTS "error" at 150ms
Promise 3: ----------------------------●----------------> (ignored - would resolve at 300ms)
                         v
Promise.all: ------------✗------------------------------> REJECTS "error"
                      (at 150ms - fails fast)
```

---

## 2️⃣ Why Use Promise.all?

### Use Cases

| Scenario | Without Promise.all | With Promise.all |
|----------|---------------------|------------------|
| **Fetch multiple APIs** | Sequential: slow | Parallel: fast |
| **Load multiple resources** | One-by-one | All at once |
| **Validate multiple conditions** | Complex chaining | Clean and readable |
| **Batch operations** | Manual tracking | Automatic handling |

### Performance Benefit

```javascript
// ❌ Sequential - takes ~600ms (100 + 200 + 300)
const a = await fetchA();  // 100ms
const b = await fetchB();  // 200ms
const c = await fetchC();  // 300ms

// ✅ Parallel - takes ~300ms (max of all)
const [a, b, c] = await Promise.all([
  fetchA(),  // 100ms -+
  fetchB(),  // 200ms -+--> All run in parallel
  fetchC()   // 300ms -+
]);
```

---

## 3️⃣ How Promise.all Works — Implementation

### Basic Implementation

```javascript
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    // Convert iterable to array (handles Sets, generators, etc.)
    const promises = Array.from(iterable);
    const results = [];
    let resolvedCount = 0;

    // Edge case: empty array resolves immediately
    if (promises.length === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values
      Promise.resolve(promise)
        .then((value) => {
          // Store result at correct index (preserves order)
          results[index] = value;
          resolvedCount++;

          // All resolved? Return results
          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          // First rejection fails the entire Promise.all
          reject(error);
        });
    });
  });
}
```

### 🔍 Dry Run: All Promises Resolve

```javascript
promiseAll([
  Promise.resolve(1),           // Resolves immediately
  new Promise(r => setTimeout(() => r(2), 100)),  // Resolves at 100ms
  Promise.resolve(3)            // Resolves immediately
]).then(console.log);
```

```
Initial State:
---------------------------------------------------------
promises = [Promise(1), Promise(2), Promise(3)]
results = []
resolvedCount = 0

Step 1: Process index 0 - Promise.resolve(1)
---------------------------------------------------------
Promise resolves immediately with value: 1
results[0] = 1    ->  results = [1, empty, empty]
resolvedCount = 1
Check: 1 === 3?   ->  No, continue waiting

Step 2: Process index 2 - Promise.resolve(3)
---------------------------------------------------------
Promise resolves immediately with value: 3
results[2] = 3    ->  results = [1, empty, 3]
resolvedCount = 2
Check: 2 === 3?   ->  No, continue waiting

Step 3: Process index 1 - setTimeout Promise (at t=100ms)
---------------------------------------------------------
Promise resolves with value: 2
results[1] = 2    ->  results = [1, 2, 3]
resolvedCount = 3
Check: 3 === 3?   ->  Yes! resolve(results)

Output: [1, 2, 3]

Key Insight: Results are in ORDER [1, 2, 3] even though
             Promise at index 1 resolved LAST!
```

### 🔍 Dry Run: One Promise Rejects

```javascript
promiseAll([
  Promise.resolve(1),
  Promise.reject('Error!'),
  new Promise(r => setTimeout(() => r(3), 100))
]).catch(console.log);
```

```
Step 1: Process index 0 - Promise.resolve(1)
---------------------------------------------------------
resolves with 1
results = [1, empty, empty]
resolvedCount = 1

Step 2: Process index 1 - Promise.reject('Error!')
---------------------------------------------------------
REJECTS with 'Error!'
-> reject('Error!') is called
-> Promise.all IMMEDIATELY rejects

Step 3: Index 2's setTimeout would resolve at t=100ms
---------------------------------------------------------
But Promise.all already rejected!
(Promise still runs to completion, but result is ignored)

Output: 'Error!'
```

---

## 4️⃣ Key Implementation Details

### Why `Array.from(iterable)`?

`Promise.all` accepts any iterable, not just arrays:

```javascript
// Works with Set
Promise.all(new Set([Promise.resolve(1), Promise.resolve(2)]));

// Works with generators
function* gen() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
}
Promise.all(gen());

// Works with strings (each char becomes a resolved promise)
Promise.all('abc');  // Resolves to ['a', 'b', 'c']
```

### Why `Promise.resolve(promise)`?

Handles non-promise values (normalizes input):

```javascript
Promise.all([1, 2, Promise.resolve(3)]);
// Without Promise.resolve wrapper: 1 and 2 would fail
// With wrapper: Resolves to [1, 2, 3]
```

### Why Store by Index (`results[index] = value`)?

Preserves order regardless of resolution order:

```javascript
Promise.all([
  new Promise(r => setTimeout(() => r('slow'), 200)),  // index 0
  new Promise(r => setTimeout(() => r('fast'), 50))    // index 1
]);

// 'fast' resolves first, but results[1] = 'fast'
// 'slow' resolves second, results[0] = 'slow'
// Final result: ['slow', 'fast'] - ORDER PRESERVED!
```

### Why Counter Instead of `results.length`?

Sparse arrays can have length without actual values:

```javascript
const arr = [];
arr[5] = 'value';
console.log(arr.length);  // 6, but only 1 actual value!

// Our approach:
// results = [empty, empty, 3] has length 3
// But resolvedCount = 1 (accurate!)
```

---

## 5️⃣ Edge Cases

| Edge Case | Behavior | Example |
|-----------|----------|---------|
| **Empty array** | Resolves immediately with `[]` | `Promise.all([])` -> `[]` |
| **Non-promise values** | Wrapped in `Promise.resolve()` | `Promise.all([1, 2])` -> `[1, 2]` |
| **Mixed values** | All work together | `Promise.all([1, Promise.resolve(2)])` -> `[1, 2]` |
| **Already rejected** | Rejects immediately | `Promise.all([Promise.reject('x')])` -> rejects |
| **Multiple rejections** | First rejection wins | Only first error returned |

### Edge Case Implementation Test

```javascript
// Test 1: Empty array
promiseAll([]).then(r => console.log(r));  // []

// Test 2: Non-promises
promiseAll([1, 'two', { three: 3 }])
  .then(r => console.log(r));  // [1, 'two', { three: 3 }]

// Test 3: Null/undefined values
promiseAll([null, undefined, Promise.resolve(3)])
  .then(r => console.log(r));  // [null, undefined, 3]

// Test 4: All reject
promiseAll([
  Promise.reject('first'),
  Promise.reject('second')
]).catch(e => console.log(e));  // 'first' (first rejection wins)
```

---

## 6️⃣ Complete Production Implementation

```javascript
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    // Handle null/undefined
    if (iterable == null) {
      throw new TypeError('Argument is not iterable');
    }

    // Convert to array
    const promises = Array.from(iterable);
    const results = new Array(promises.length);
    let resolvedCount = 0;
    let rejected = false;

    // Empty iterable - resolve immediately
    if (promises.length === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          // Ignore if already rejected
          if (rejected) return;

          results[index] = value;
          resolvedCount++;

          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          // Only reject once
          if (rejected) return;
          rejected = true;
          reject(error);
        });
    });
  });
}
```

---

## 7️⃣ Related Promise Methods Comparison

| Method | Resolves When | Rejects When | Use Case |
|--------|---------------|--------------|----------|
| `Promise.all` | ALL resolve | ANY rejects | Need all results |
| `Promise.allSettled` | ALL settle | Never | Need all outcomes |
| `Promise.race` | FIRST settles | FIRST rejects | Timeout/fastest |
| `Promise.any` | ANY resolves | ALL reject | First success |

### Comparison Example

```javascript
const promises = [
  Promise.reject('error'),
  new Promise(r => setTimeout(() => r('slow'), 100)),
  Promise.resolve('fast')
];

Promise.all(promises)        // ❌ Rejects: 'error'
Promise.allSettled(promises) // ✅ [{status:'rejected'}, {status:'fulfilled',...}, ...]
Promise.race(promises)       // ❌ Rejects: 'error' (first to settle)
Promise.any(promises)        // ✅ Resolves: 'fast' (first to succeed)
```

---

## 8️⃣ Common Interview Questions

### Q1: Implement Promise.all from scratch

**Answer:** See Section 3 or Section 6.

### Q2: What's the difference between Promise.all and Promise.allSettled?

**Answer:**
- `Promise.all`: Fails fast on first rejection
- `Promise.allSettled`: Waits for all promises, never rejects, returns status for each

```javascript
// Promise.all - ONE failure = entire operation fails
Promise.all([Promise.resolve(1), Promise.reject('fail')])
  .catch(e => console.log(e));  // 'fail'

// Promise.allSettled - Get results regardless of failures
Promise.allSettled([Promise.resolve(1), Promise.reject('fail')])
  .then(results => console.log(results));
  // [{status: 'fulfilled', value: 1}, {status: 'rejected', reason: 'fail'}]
```

### Q3: Does Promise.all execute promises in parallel?

**Answer:** Yes, but with a nuance. The promises start executing when created, not when passed to `Promise.all`. `Promise.all` just waits for them all:

```javascript
// These start immediately when created:
const p1 = fetchUser();   // Starts now
const p2 = fetchPosts();  // Starts now
const p3 = fetchComments(); // Starts now

// Promise.all just waits for all to complete
const results = await Promise.all([p1, p2, p3]);
```

### Q4: What happens if you pass a non-iterable to Promise.all?

**Answer:** It throws a `TypeError`:

```javascript
Promise.all(123);  // TypeError: 123 is not iterable
Promise.all(null); // TypeError: null is not iterable
```

### Q5: How would you implement a version with a concurrency limit?

**Answer:**

```javascript
async function promiseAllWithLimit(promises, limit) {
  const results = [];
  const executing = [];

  for (const [index, promise] of promises.entries()) {
    const p = Promise.resolve(promise).then(value => {
      results[index] = value;
    });

    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
      // Remove settled promises
      executing.splice(
        executing.findIndex(e => e === p), 1
      );
    }
  }

  await Promise.all(executing);
  return results;
}
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Not Handling Rejections

```javascript
// ❌ BAD: Unhandled rejection if any promise fails
const results = await Promise.all([fetchA(), fetchB()]);

// ✅ GOOD: Always handle potential rejections
try {
  const results = await Promise.all([fetchA(), fetchB()]);
} catch (error) {
  console.error('One of the fetches failed:', error);
}

// ✅ ALTERNATIVE: Use Promise.allSettled for guaranteed results
const results = await Promise.allSettled([fetchA(), fetchB()]);
```

### Pitfall 2: Creating Promises Inside Promise.all

```javascript
// ❌ This is fine, but be aware promises start immediately
Promise.all([
  fetch('/api/1'),  // Starts immediately
  fetch('/api/2'),  // Starts immediately
]);

// ❌ BAD: Using async callbacks creates timing issues
Promise.all(
  ids.map(async id => {
    const data = await fetch(`/api/${id}`);
    return data.json();
  })
);

// ✅ GOOD: Be explicit about what you're doing
Promise.all(
  ids.map(id => fetch(`/api/${id}`).then(r => r.json()))
);
```

### Pitfall 3: Expecting Order of Execution

```javascript
// The execution order is NOT guaranteed
Promise.all([
  asyncOp1(),  // Might finish 3rd
  asyncOp2(),  // Might finish 1st
  asyncOp3()   // Might finish 2nd
]).then(([result1, result2, result3]) => {
  // But results ARE in input order!
  // result1 is from asyncOp1, regardless of when it finished
});
```

---

## 🔟 Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Iterates through n promises once |
| **Space** | O(n) | Stores n results |
| **Execution** | O(max(durations)) | Total time = slowest promise |

```javascript
// n = number of promises
// If promises take [100ms, 200ms, 50ms]:
// Total time ≈ 200ms (not 350ms - parallel!)
```

---

## Summary

| Concept | Description |
|---------|-------------|
| **Promise.all** | Wait for all promises to resolve |
| **Resolution** | Returns array of results in input order |
| **Rejection** | Fails fast on first rejection |
| **Empty array** | Resolves immediately with `[]` |
| **Non-promises** | Automatically wrapped |

### Key Takeaways

1. **Parallel execution** — all promises run concurrently
2. **Order preserved** — results match input order, not resolution order
3. **Fail fast** — one rejection fails everything
4. **Use `Promise.allSettled`** — when you need all outcomes regardless of failures
5. **Always handle rejections** — use try/catch or `.catch()`

---

## 📚 Further Reading

- [MDN: Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [JavaScript.info: Promise API](https://javascript.info/promise-api)

---

<!-- quiz-start -->
### Q1: What happens when one promise in Promise.all rejects?
- [ ] It waits for all promises to complete and returns partial results
- [x] It immediately rejects with the first rejection reason
- [ ] It filters out the rejected promise and returns remaining results
- [ ] It replaces the rejected value with undefined

### Q2: Why do we store results by index (`results[index] = value`) instead of using push?
- [ ] Push is slower than direct array assignment
- [ ] It prevents memory leaks
- [x] It preserves the order of results matching input order, regardless of resolution order
- [ ] It's required for TypeScript compatibility

### Q3: What does Promise.all return when passed an empty array?
- [ ] It throws a TypeError
- [ ] It returns a pending promise that never resolves
- [x] It resolves immediately with an empty array []
- [ ] It rejects with "No promises provided"
<!-- quiz-end -->
