---
date: 2025-03-15T01:28:24+05:30
description: The findLast() method returns the last element satisfying a test function, iterating from end to start. Reverses find() behavior.
premium: false
---
# 🔙 Array.prototype.findLast() Polyfill

The `findLast()` method returns the last element in an array that satisfies a given predicate function. It iterates from the end of the array.

---

## ✅ Implementation

```javascript
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function(callback, thisArg) {
    // Ensure that 'callback' is a function
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    
    // Iterate over the array starting from the last element
    for (let i = this.length - 1; i >= 0; i--) {
      // If the element satisfies the condition, return it
      if (callback.call(thisArg, this[i], i, this)) {
        return this[i];
      }
    }
    
    // If no element satisfies the condition, return undefined
    return undefined;
  };
}
```

### Explanation:
1. **Check if `findLast` is defined**: The `if (!Array.prototype.findLast)` condition ensures that the polyfill only runs if `findLast` is not already available.
   
2. **Callback validation**: It checks whether the `callback` provided is a valid function using `typeof callback !== 'function'`.

3. **Iterate backward**: The loop starts from the last element of the array (`i = this.length - 1`) and moves towards the first element (`i--`).

4. **Calling the callback**: `callback.call(thisArg, this[i], i, this)` is used to invoke the `callback` function. This gives you the correct value for `this` within the callback function, the current element (`this[i]`), its index (`i`), and the array itself (`this`).

5. **Return the matching element**: If the callback returns a truthy value, that element is returned as the result of `findLast`.

6. **Return `undefined` if no match is found**: If the loop completes without finding a match, `undefined` is returned.

### Example Usage:

```javascript
const arr = [1, 2, 3, 4, 5];

const result = arr.findLast(num => num % 2 === 0);
console.log(result); // Output: 4
```

In this example, `findLast` finds the last even number (4) in the array.

### Edge Cases:
- If no element matches the condition, it returns `undefined`.
- If the array is empty, it returns `undefined`.
  
This implementation closely mimics the behavior of the modern `findLast` method that was introduced in newer versions of JavaScript.
