---
date: 2025-03-15T01:35:02+05:30
description: The findLastIndex() method returns the last matching element's index, searching from end to start. Returns -1 if no match found.
premium: false
---
# 🔙 Array.prototype.findLastIndex() Polyfill

The `findLastIndex()` method returns the index of the last element that satisfies the provided testing function, iterating from end to start. Returns `-1` if none found.

---

## ✅ Implementation

```javascript
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function(callback, thisArg) {
    // Ensure callback is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // Iterate backward through the array
    for (let i = this.length - 1; i >= 0; i--) {
      // If the element satisfies the condition, return the index
      if (callback.call(thisArg, this[i], i, this)) {
        return i;
      }
    }

    // Return -1 if no matching element is found
    return -1;
  };
}
```

### Explanation:
1. **Check if `findLastIndex` exists**: The `if (!Array.prototype.findLastIndex)` ensures that the polyfill is only applied if `findLastIndex` doesn't already exist on `Array.prototype`.

2. **Callback validation**: It checks if the `callback` is a valid function using `typeof callback !== 'function'`.

3. **Backward iteration**: We iterate from the last element (`i = this.length - 1`) to the first (`i--`).

4. **Callback invocation**: `callback.call(thisArg, this[i], i, this)` calls the provided callback for each element, passing the current element (`this[i]`), its index (`i`), and the array itself (`this`).

5. **Return index**: If the callback returns a truthy value, we return the current index (`i`).

6. **Return `-1`**: If no element matches the condition, we return `-1`, which indicates no match was found.

### Example Usage:

```javascript
const arr = [1, 2, 3, 4, 5];

const index = arr.findLastIndex(num => num % 2 === 0);
console.log(index); // Output: 3 (because the last even number is 4 at index 3)
```

### Edge Cases:
- **No elements match**: If no elements satisfy the condition, `-1` is returned.
- **Empty array**: If the array is empty, it returns `-1` right away.
- **Callback that always returns false**: If the callback always returns false, the result will be `-1`.

This polyfill ensures the behavior of `findLastIndex` is available even in environments where it's not supported natively.

---

<!-- quiz-start -->
### Q1: What does `[1, 2, 3, 4, 5].findLastIndex(num => num % 2 === 0)` return?
- [ ] 1
- [x] 3
- [ ] 4
- [ ] [1, 3]

### Q2: What is the starting point for iteration in `findLastIndex()`?
- [ ] Index 0
- [ ] The middle of the array
- [x] The last index (length - 1)
- [ ] A random index

### Q3: What does `findLastIndex()` return for an empty array?
- [x] -1
- [ ] undefined
- [ ] 0
- [ ] null
<!-- quiz-end -->
