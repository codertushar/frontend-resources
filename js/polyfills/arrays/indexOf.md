---
date: 2025-03-15T00:35:56+05:30
description: The indexOf() method returns the first index of a value in an array, or -1 if not found. Commonly used for existence checks.
---
# 🔢 Array.prototype.indexOf() Polyfill

The `indexOf()` method returns the first index at which a given element can be found, or `-1` if not present.

---

## ✅ Implementation

```javascript
Array.prototype.customIndexOf = function(searchElement, fromIndex = 0) {
    // Normalize negative fromIndex to count from the end of the array
    if (fromIndex < 0) {
        fromIndex = Math.max(this.length + fromIndex, 0); // Adjust negative index
    }

    // Iterate through the array starting from fromIndex
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement) {
            return i; // Return the index of the first match
        }
    }

    return -1; // Return -1 if the element is not found
};

// Example usage:
const array = [2, 9, 9];

console.log(array.customIndexOf(2));       // Output: 0
console.log(array.customIndexOf(7));       // Output: -1
console.log(array.customIndexOf(9, 2));    // Output: 2
console.log(array.customIndexOf(2, -1));   // Output: -1
console.log(array.customIndexOf(2, -3));   // Output: 0
```

### How It Works:

1. **Negative `fromIndex`** :
   If `fromIndex` is negative, it is adjusted to count from the end of the array. For example, `fromIndex = -1` starts the search from the last element.
2. **Array Iteration** :
   The loop starts from the `fromIndex` (or `0` if not provided) and compares each element with `searchElement` using strict equality (`===`).
3. **Return Index or -1** :

* If `searchElement` is found, the method returns the index of the first match.
* If no match is found, it returns `-1`.

### Example Walkthrough:

* `customIndexOf(2)`: Starts at index `0` and finds `2` at index `0`, so it returns `0`.
* `customIndexOf(7)`: No match is found, so it returns `-1`.
* `customIndexOf(9, 2)`: Starts at index `2` and finds `9` at index `2`, so it returns `2`.
* `customIndexOf(2, -1)`: Starts searching from the last element (`index 2`), doesn't find `2`, so it returns `-1`.
* `customIndexOf(2, -3)`: Starts searching from `index 0`, finds `2` at index `0`, so it returns `0`.

This implementation mimics `Array.prototype.indexOf`, with additional support for negative `fromIndex`, ensuring the search works as expected.
