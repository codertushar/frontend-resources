
Here’s a more readable version of the text:

```javascript
Array.prototype.customFilter = function(callbackFn, thisArg) {
    // Ensure callbackFn is a function
    if (typeof callbackFn !== "function") {
        throw new TypeError(`${callbackFn} is not a function`);
    }

    const result = [];
    for (let i = 0; i < this.length; i++) {
        if (i in this) { // Handle sparse arrays by ensuring the index exists
            // If the callback returns true, push the element to the result array
            if (callbackFn.call(thisArg, this[i], i, this)) {
                result.push(this[i]);
            }
        }
    }
    return result; // Return the filtered array
};

// Example usage:
const numbers = [12, 5, 8, 130, 44];

function isGreaterThanTen(value) {
    return value > 10;
}

const filteredNumbers = numbers.customFilter(isGreaterThanTen);
console.log(filteredNumbers); // Output: [12, 130, 44]
```

### Key Features:

* **Type Checking** : Verifies that `callbackFn` is a function, throwing a `TypeError` if it's not.
* **Callback Binding** : Uses `call(thisArg, this[i], i, this)` to bind `thisArg` when executing the callback.
* **Sparse Array Handling** : Uses `i in this` to avoid processing deleted or uninitialized indices in sparse arrays.
* **New Array Creation** : Builds and returns a new array containing only elements that pass the condition in `callbackFn`.

This implementation behaves similarly to `Array.prototype.filter`, correctly handling edge cases like sparse arrays and optional `thisArg`.
