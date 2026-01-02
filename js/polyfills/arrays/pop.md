---
date: 2025-03-15T16:01:07+05:30
description: The pop() method removes and returns the last array element. Modifies the original array in place, reducing its length by one.
premium: false
---
# ➖ Array.prototype.pop() Polyfill

The `pop()` method removes the last element from an array and returns that element.

---

## ✅ Implementation

```javascript
Array.prototype.customPop = function () {
    if (this.length === 0) return undefined; // Return undefined if the array is empty

    const lastElement = this[this.length - 1]; // Store the last element
    this.length = this.length - 1; // Decrease the length of the array

    return lastElement; // Return the removed element
};

// Example usage:
const array = [1, 2, 3];
const popped = array.customPop();

console.log(popped); // Output: 3
console.log(array);  // Output: [1, 2]
console.log([].customPop()); // Output: undefined (empty array case)
```

---

### **How It Works**

1. **Handles an empty array**
   * If `this.length === 0`, it returns `undefined`, just like `pop()`.
2. **Stores the last element**
   * Saves `this[this.length - 1]` before modifying the array.
3. **Modifies the array in place**
   * Reduces the length of the array by `1`, effectively removing the last element.
4. **Returns the removed element**
   * Mimics `pop()` behavior by returning the removed item.

---

### **Edge Cases Handled**

✔ Works on normal arrays

✔ Works on empty arrays (`[].customPop() → undefined`)

✔ Modifies the original array in place

✔ Returns the last element as expected

This implementation is clean, efficient, and follows `Array.prototype.pop` exactly.

---

<!-- quiz-start -->
### Q1: What does `[].customPop()` return?
- [ ] null
- [ ] An empty array
- [x] undefined
- [ ] Throws an error

### Q2: Does `pop()` modify the original array?
- [x] Yes, it modifies the array in place
- [ ] No, it returns a new array
- [ ] Only if the array has more than one element
- [ ] It depends on the element type

### Q3: How does the pop polyfill remove the last element?
- [ ] Uses splice() internally
- [ ] Calls delete on the last element
- [x] Decreases the array's length property by 1
- [ ] Creates a new array without the last element
<!-- quiz-end -->
