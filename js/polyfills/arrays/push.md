---
date: 2025-03-15T16:01:07+05:30
description: The push() method adds elements to the end of an array and returns the new length. Modifies the array in place for efficient appending.
premium: false
---
# ➕ Array.prototype.push() Polyfill

The `push()` method adds one or more elements to the end of an array and returns the new length.

---

## ✅ Implementation

```javascript
Array.prototype.customPush = function (...elements) {
    for (let i = 0; i < elements.length; i++) {
        this[this.length] = elements[i]; // Add elements at the end of the array
    }
    return this.length; // Return the new length of the array
};

// Example usage:
const array = [1, 2, 3];
array.customPush(4, 5);

console.log(array); // Output: [1, 2, 3, 4, 5]
console.log(array.customPush(6, 7)); // Output: 7 (new length of array)
console.log(array); // Output: [1, 2, 3, 4, 5, 6, 7]
```

---

### **How It Works**

1. **Uses the rest parameter (`...elements`)**
   * Allows multiple arguments to be passed and handled dynamically.
2. **Iterates over new elements**
   * Adds each `element` at `this.length`, ensuring insertion at the end.
3. **Returns the new length**
   * Mimics `push()` behavior by returning the updated length.

---

### **Edge Cases Handled**

✔ Works with multiple elements: `customPush(4, 5, 6)`

✔ Works with an empty array: `[].customPush(1, 2, 3)`

✔ Works with no arguments: `array.customPush()` (returns unchanged length)

✔ Appends elements in order

This implementation is simple, efficient, and follows the behavior of `Array.prototype.push` exactly.

---

<!-- quiz-start -->
### Q1: What does `push()` return?
- [ ] The pushed element(s)
- [ ] The original array
- [x] The new length of the array
- [ ] undefined

### Q2: How does the push polyfill add elements to the array?
- [ ] Using concat()
- [x] Assigning elements at `this.length` index
- [ ] Using unshift() internally
- [ ] Creating a new array with spread operator

### Q3: What does `[1, 2].customPush(3, 4, 5)` return?
- [ ] [1, 2, 3, 4, 5]
- [ ] 3
- [x] 5
- [ ] [3, 4, 5]
<!-- quiz-end -->
