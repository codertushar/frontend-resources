Here's a correct and **easy-to-read** implementation of `customSome`:

```javascript
Array.prototype.customSome = function (callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    for (let i = 0; i < this.length; i++) {
        if (callback.call(thisArg, this[i], i, this)) {
            return true; // Return true immediately if a match is found
        }
    }

    return false; // Return false if no element satisfies the condition
};

// Example usage:
const array = [1, 2, 3, 4, 5];

const even = (element) => element % 2 === 0;

console.log(array.customSome(even)); // Output: true
console.log(array.customSome((num) => num > 10)); // Output: false
```

---

### **How This Works**

1. **Checks if `callback` is a function**
   * If not, it throws a `TypeError` (same behavior as `Array.prototype.some`).
2. **Iterates through the array**
   * Calls `callback` for each element with `(element, index, array)`.
   * Uses `.call(thisArg, ...)` to bind the optional `thisArg`.
3. **Returns early if a match is found**
   * If `callback` returns `true`, `customSome` immediately returns `true`.
4. **Returns `false` if no match is found**
   * If no element passes the test, `customSome` returns `false` after the loop.

---

### **Edge Cases Handled**

✔ **Empty array always returns `false`**

✔ **Works with `thisArg` binding**

✔ **Stops checking as soon as one match is found** (Optimized)

✔ **Throws an error if `callback` is not a function**

This version is  **simple, efficient, and follows the behavior of `Array.prototype.some` exactly** . 🚀 Let me know if you need improvements!
