---
date: 2025-03-15T16:01:07+05:30
description: The every() method tests if all array elements pass a test function. Returns true only if every element satisfies the condition.
premium: false
---
# ✅ Array.prototype.every() Polyfill

The `every()` method tests whether all elements in the array pass the test implemented by the provided function.

---

## ✅ Implementation

```javascript
Array.prototype.customEvery = function (callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    for (let i = 0; i < this.length; i++) {
        if (!callback.call(thisArg, this[i], i, this)) {
            return false; // Return false immediately if one element fails
        }
    }

    return true; // Return true if all elements pass the test
};

// Example usage:
const input = [2, 4, 6, 8];
const isEven = (element) => element % 2 === 0;

console.log(input.customEvery(isEven)); // Output: true
console.log([2, 4, 5, 8].customEvery(isEven)); // Output: false
console.log([].customEvery(isEven)); // Output: true (empty array always returns true)
```

---

### **How It Works**

1. **Checks if `callback` is a function**
   * If not, throws a `TypeError` (same behavior as `Array.prototype.every`).
2. **Iterates through the array**
   * Calls `callback` for each element with `(element, index, array)`.
   * Uses `.call(thisArg, ...)` to bind `thisArg` if provided.
3. **Returns early if any test fails**
   * If `callback` returns `false` for **any** element, `customEvery` immediately returns `false` (optimized).
4. **Returns `true` if all tests pass**
   * If all elements satisfy the condition, it returns `true`.

---

### **Edge Cases Handled**

✔ **Empty array always returns `true`**

✔ **Stops checking as soon as one element fails** (Optimized)

✔ **Works with `thisArg` binding**

✔ **Throws an error if `callback` is not a function**

This implementation is efficient, clean, and mirrors `Array.prototype.every` exactly.

---

<!-- quiz-start -->
### Q1: What does `[].customEvery(x => x > 0)` return?
- [x] true
- [ ] false
- [ ] undefined
- [ ] An error is thrown

### Q2: When does `every()` return `false`?
- [ ] When all elements pass the test
- [x] When any single element fails the test
- [ ] Only when all elements fail the test
- [ ] When the array is empty

### Q3: What happens if the callback is not a function?
- [ ] Returns false
- [ ] Returns undefined
- [x] Throws a TypeError
- [ ] Silently fails and returns true
<!-- quiz-end -->
