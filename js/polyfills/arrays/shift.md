---
date: 2025-03-15T16:01:07+05:30
description: The shift() method removes and returns the first array element. Modifies the array in place, shifting all remaining elements down.
premium: false
---
# ⬅️ Array.prototype.shift() Polyfill

The `shift()` method removes the first element from an array and returns that element.

---

## ✅ Implementation

```javascript
Array.prototype.customShift = function () {
    if (this.length === 0) return undefined; // Return undefined if the array is empty

    const firstElement = this[0]; // Store the first element

    // Shift all elements to the left
    for (let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
    }

    this.length -= 1; // Reduce the length of the array

    return firstElement; // Return the removed element
};

// Example usage:
const array = [1, 2, 3];
const firstElement = array.customShift();

console.log(firstElement); // Output: 1
console.log(array);        // Output: [2, 3]
console.log([].customShift()); // Output: undefined (empty array case)
```

---

### **How It Works**

1. **Handles an empty array**
   * If `this.length === 0`, it returns `undefined`, just like `shift()`.
2. **Stores the first element**
   * Saves `this[0]` before modifying the array.
3. **Shifts elements to the left**
   * Iterates through the array and shifts elements to the left (`this[i - 1] = this[i]`).
4. **Reduces the array length**
   * `this.length -= 1;` effectively removes the last duplicate.
5. **Returns the removed element**
   * Mimics `shift()` behavior by returning the removed item.

---

### **Edge Cases Handled**

✔ Works on normal arrays

✔ Works on empty arrays (`[].customShift() → undefined`)

✔ Modifies the original array in place

✔ Returns the first element as expected

This implementation is simple, efficient, and follows `Array.prototype.shift` exactly.

---

<!-- quiz-start -->
### Q1: What does `[].customShift()` return?
- [ ] null
- [ ] An empty array
- [x] undefined
- [ ] 0

### Q2: What is the time complexity of the `shift()` operation?
- [ ] O(1)
- [x] O(n)
- [ ] O(log n)
- [ ] O(n^2)

### Q3: How does the shift polyfill work internally?
- [ ] Removes the first element using delete
- [x] Shifts all elements left by one position and decreases length
- [ ] Creates a new array without the first element
- [ ] Uses splice() to remove the first element
<!-- quiz-end -->
