---
date: 2025-03-15T00:35:56+05:30
description: The find() method returns the first element satisfying a test function, or undefined if none found. Simpler than filter for single matches.
premium: false
---
# 🔎 Array.prototype.find() Polyfill

The `find()` method returns the first element in an array that satisfies a provided testing function. If no element matches, it returns `undefined`. This polyfill supports the optional `thisArg` parameter for binding context.

---

## ✅ Implementation

```javascript
Array.prototype.customFind = function(callbackFn, thisArg) {
    // Iterate through the array and execute the callback function
    for (let i = 0; i < this.length; i++) {
        // Call the callback function with the current element, index, and array
        // .call() is used to explicitly set 'this' inside the callback
        if (callbackFn.call(thisArg, this[i], i, this)) {
            return this[i]; // Return the first matching element
        }
    }

    return undefined; // Return undefined if no element matches
};

// Example usage:
const array = [5, 12, 8, 130, 44];

// Using customFind to find the first element greater than 10
const found = array.customFind(element => element > 10);

console.log(found); // Output: 12
```

### How It Works:

1. **Iteration** : The `customFind` method iterates through the array using a `for` loop.
2. **Callback Execution** : For each element, it calls the provided `callbackFn` with the current element, its index, and the array.

* If the callback returns a truthy value, the method immediately returns that element.

1. **Optional `thisArg`** : If provided, `thisArg` is used to bind `this` inside the callback function using `.call(thisArg, this[i], i, this)`.
2. **No Match** : If no element satisfies the condition in `callbackFn`, it returns `undefined`.

### Example:

* `customFind(element => element > 10)` returns the first element greater than 10, which is `12`.
* If no element matches, such as `customFind(element => element > 200)`, it returns `undefined`.

### Why Use `.call(thisArg, ...)`?

* **Explicit `this` Binding** : The `.call(thisArg, ...)` ensures that the `this` value inside the callback is explicitly set to `thisArg`. This is crucial when `thisArg` is provided and the callback relies on it.
  Without `.call()`, the `this` value could be undefined (in strict mode) or the global object (non-strict mode), leading to unexpected results. By using `.call(thisArg, ...)`, we guarantee that `thisArg` is used as the context inside the callback.

### Example of `.call()` in Action:

```javascript
function printThis() {
    console.log(this); // Logs the value of `this`
}

const obj = { name: 'Alice' };

// Using `.call()` to set `this` to `obj`
printThis.call(obj); // Logs: { name: 'Alice' }
```

### Summary:

* **`.call(thisArg, ...)`** allows explicit control over the `this` context inside the callback.
* Without `.call()`, the `this` context inside the callback may not behave as expected, especially when `thisArg` is provided.

---

<!-- quiz-start -->
### Q1: What does `[5, 12, 8, 130].customFind(x => x > 10)` return?
- [ ] 130
- [x] 12
- [ ] [12, 130]
- [ ] 1

### Q2: What does `find()` return when no element matches?
- [ ] null
- [ ] -1
- [ ] false
- [x] undefined

### Q3: Why is `.call(thisArg, ...)` used in the find polyfill?
- [ ] To improve performance
- [ ] To handle async callbacks
- [x] To explicitly set the `this` context inside the callback
- [ ] To convert the callback to an arrow function
<!-- quiz-end -->
