---
date: 2025-03-15T16:01:07+05:30
description: The unshift() method adds elements to the beginning of an array and returns the new length. Modifies the array in place efficiently.
premium: false
---
# ➡️ Array.prototype.unshift() Polyfill

The `unshift()` method adds one or more elements to the beginning of an array and returns the new length.

---

## ✅ Implementation

```javascript
Array.prototype.customUnshift = function (...elements) {
    // Move existing elements to the right to make space for new elements
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + elements.length] = this[i];
    }

    // Insert new elements at the beginning
    for (let i = 0; i < elements.length; i++) {
        this[i] = elements[i];
    }

    return this.length; // Return new array length
};

// Example usage:
const array = [1, 2, 3];
array.customUnshift(4, 5);

console.log(array); // Output: [4, 5, 1, 2, 3]
console.log(array.customUnshift(0)); // Output: 6 (new length of array)
console.log(array); // Output: [0, 4, 5, 1, 2, 3]
```

---

### **How It Works**

1. **Shifts existing elements to the right**
   * Loops **backward** to prevent overwriting elements.
   * Moves each element to a new position based on the number of elements being added.
2. **Inserts new elements at the beginning**
   * Loops **forward** to place new elements in their correct positions.
3. **Returns the new array length**
   * Mimics `unshift()` behavior by returning the updated length.

---

### **Edge Cases Handled**

✔ Works with multiple elements: `customUnshift(4, 5, 6)`

✔ Works with empty arrays: `[].customUnshift(1, 2, 3)`

✔ Works with no arguments: `array.customUnshift()` (returns unchanged length)

✔ Preserves element order correctly

This implementation is efficient and follows the exact behavior of `Array.prototype.unshift`.

---

<!-- quiz-start -->
### Q1: What does `unshift()` return?
- [ ] The added elements
- [ ] The original array
- [x] The new length of the array
- [ ] undefined

### Q2: What is the time complexity of `unshift()`?
- [ ] O(1)
- [x] O(n)
- [ ] O(log n)
- [ ] O(n^2)

### Q3: Where does `unshift()` add the new elements?
- [x] At the beginning of the array
- [ ] At the end of the array
- [ ] At a random position
- [ ] Sorted into the correct position
<!-- quiz-end -->
