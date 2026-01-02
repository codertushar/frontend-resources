---
date: 2025-03-15T00:35:56+05:30
description: The at() method returns the item at a given index, supporting negative integers to count from the end. Simplifies array access patterns.
premium: false
---
# 🎯 Array.prototype.at() Polyfill

The `at()` method takes an integer and returns the item at that index, allowing for positive and negative integers.

---

## ✅ Implementation

```javascript
Array.prototype.customAt = function(index) {
    // Adjust negative index to count from the end of the array
    if (index < 0) {
        index += this.length; // Convert negative index to a positive one
    }

    // Return the element at the adjusted index, or undefined if out of bounds
    return index >= 0 && index < this.length ? this[index] : undefined;
};

// Example usage:
const array = [5, 12, 8, 130, 44];

console.log(array.customAt(2));   // Output: 8
console.log(array.customAt(-1));  // Output: 44
console.log(array.customAt(100)); // Output: undefined
```

### Explanation:

* **Negative index handling** :

  If the index is negative, it’s adjusted by adding the array’s length. This makes `-1` refer to the last element, `-2` to the second-to-last, and so on.

* **Bounds check** :

  After adjusting the index, the function checks if it’s within the valid range (i.e., `0 <= index < this.length`). If it’s valid, the element at that index is returned; otherwise, `undefined` is returned.

* **Edge case** :

  If the index is out of bounds (e.g., `100` for an array of length 5), it returns `undefined`.

### Examples:

* `customAt(2)` returns the element at index 2 (which is 8).
* `customAt(-1)` returns the last element (44).
* `customAt(100)` returns `undefined` since the index is out of bounds.

This mimics `Array.prototype.at` while supporting both positive and negative indices.

---

<!-- quiz-start -->
### Q1: What does `[5, 12, 8].customAt(-1)` return?
- [ ] 5
- [ ] undefined
- [x] 8
- [ ] -1

### Q2: How does the `at()` polyfill handle negative indices?
- [ ] It throws an error for negative indices
- [ ] It returns undefined for any negative index
- [x] It adds the array length to convert negative index to positive
- [ ] It takes the absolute value of the index

### Q3: What does `[1, 2, 3].customAt(10)` return?
- [ ] 3
- [ ] null
- [ ] An error is thrown
- [x] undefined
<!-- quiz-end -->
