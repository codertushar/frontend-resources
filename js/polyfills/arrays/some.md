---
date: 2025-03-15T16:01:07+05:30
description: The some() method tests if at least one array element passes a test function. Returns true if any element satisfies the condition.
premium: true
---
# 🔘 Array.prototype.some() Polyfill

The `some()` method tests whether at least one element in the array passes the test implemented by the provided function.

---

## ✅ Implementation

```javascript
Array.prototype.customSome = function (callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    for (let i = 0; i < this.length; i++) {
        if (callback.call(thisArg, this[i], i, this)) {
            return true; // Return true immediately if a match is found
        }
    }

    return false; // Return false if no element satisfies the condition
};

// Example usage:
const array = [1, 2, 3, 4, 5];

const even = (element) => element % 2 === 0;

console.log(array.customSome(even)); // Output: true
console.log(array.customSome((num) => num > 10)); // Output: false
```

---

### **How This Works**

1. **Checks if `callback` is a function**
   * If not, it throws a `TypeError` (same behavior as `Array.prototype.some`).
2. **Iterates through the array**
   * Calls `callback` for each element with `(element, index, array)`.
   * Uses `.call(thisArg, ...)` to bind the optional `thisArg`.
3. **Returns early if a match is found**
   * If `callback` returns `true`, `customSome` immediately returns `true`.
4. **Returns `false` if no match is found**
   * If no element passes the test, `customSome` returns `false` after the loop.

---

### **Edge Cases Handled**

✔ **Empty array always returns `false`**

✔ **Works with `thisArg` binding**

✔ **Stops checking as soon as one match is found** (Optimized)

✔ **Throws an error if `callback` is not a function**

This version is simple, efficient, and follows the behavior of `Array.prototype.some` exactly.

---

<!-- quiz-start -->
### Q1: What does `[].customSome(x => x > 0)` return?
- [ ] true
- [x] false
- [ ] undefined
- [ ] Throws an error

### Q2: When does `some()` return `true`?
- [ ] When all elements pass the test
- [x] When at least one element passes the test
- [ ] When no elements pass the test
- [ ] When the array is empty

### Q3: What is the key difference between `some()` and `every()`?
- [ ] some() is faster
- [x] some() returns true if ANY element passes; every() returns true if ALL pass
- [ ] every() can handle sparse arrays, some() cannot
- [ ] some() modifies the array, every() does not
<!-- quiz-end -->
