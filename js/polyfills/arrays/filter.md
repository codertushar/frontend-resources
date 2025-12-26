---
date: 2025-03-15T00:35:56+05:30
description: The filter() method creates a new array with elements passing a test function. Critical for data filtering and commonly used in interviews.
premium: false
---
# 🔍 Array.prototype.filter() Polyfill

The `filter()` method creates a new array with all elements that pass the test implemented by the provided callback function. This polyfill replicates the native behavior, including support for `thisArg` and proper handling of sparse arrays.

---

## ✅ Implementation

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    let result = [];

    for (let i = 0; i < this.length; i++) {
        if (this.hasOwnProperty(i)) { // Ensures only actual elements are processed
            if (callback.call(thisArg, this[i], i, this)) {
                result.push(this[i]);
            }
        }
    }

    return result;
};
```

### Example Usage:

```javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.myFilter(num => num % 2 === 0);
console.log(evenNumbers); // Output: [2, 4, 6]
```

### Key Features of This Polyfill:

1. **Prototype Extension** :

* The `myFilter` method is added to `Array.prototype`, making it available on all arrays.

1. **Callback Execution** :

* The callback function is executed on each array element, receiving `(element, index, array)` as arguments.
* This allows the callback to inspect the element, index, and the entire array.

1. **Handling `thisArg`** :

* The `thisArg` parameter is used to bind a custom `this` context when executing the callback function.

1. **Sparse Array Handling** :

* The method uses `this.hasOwnProperty(i)` to ensure that only actual elements are processed.
* This prevents issues when working with sparse arrays or arrays with holes, ensuring only the array's own properties are considered (ignoring inherited properties).

1. **Type Checking** :

* The method checks if the `callback` argument is a valid function.
* If not, it throws a `TypeError`, mimicking the behavior of the native `Array.prototype.filter` method.

This polyfill behaves similarly to the native `Array.prototype.filter`, allowing for array filtering based on a custom condition. It handles `thisArg`, ensures correct element processing in sparse arrays, and performs type checking on the callback.
