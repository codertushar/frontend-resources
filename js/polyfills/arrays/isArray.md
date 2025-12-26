---
date: 2025-03-15T00:35:56+05:30
description: The isArray() method reliably determines if a value is an array. More accurate than typeof for cross-frame array detection.
premium: false
---
# ✅ Array.isArray() Polyfill

The `Array.isArray()` method determines whether the passed value is an Array.

---

## ✅ Implementation

```javascript
function customIsArray(value) {
    // Return false if the value is null or undefined
    if (value === null || value === undefined) {
        return false;
    }

    // Use Object.prototype.toString to reliably check the type of value
    // This method returns '[object Array]' for arrays
    return Object.prototype.toString.call(value) === '[object Array]';
}
```

### Explanation:

1. **Null and Undefined Check** :
   The function first checks if `value` is `null` or `undefined`. If it is, it immediately returns `false`.
2. **Reliable Type Checking** :
   For all other values, the function uses `Object.prototype.toString.call(value)`. This method returns a string in the format `"[object Type]"`, where `Type` is the internal class of the object. For arrays, it returns `"[object Array]"`.
3. **Why This Works** :
   `Object.prototype.toString` is a reliable way to determine the internal class of an object, which helps accurately identify arrays. This is a cross-environment solution that works similarly to `Array.isArray()`.

### Behavior:

* **Returns `true` for arrays** : Works for empty arrays, populated arrays, arrays created with the `Array` constructor, and even `Array.prototype`.
* **Returns `false` for non-arrays** : Includes `undefined`, `null`, objects, numbers, strings, booleans, and array-like objects such as `TypedArrays`.
