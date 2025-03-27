Here’s a correct and efficient implementation of `customShift` that mimics `Array.prototype.shift`:

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

🚀 **This implementation is simple, efficient, and follows `Array.prototype.shift` exactly!** Let me know if you need any refinements.
