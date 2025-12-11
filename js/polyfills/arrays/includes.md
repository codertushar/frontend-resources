# 🔍 Array.prototype.includes() Polyfill

The `includes()` method determines whether an array includes a certain value, returning `true` or `false`.

---

## ✅ Implementation

```javascript
Array.prototype.customIncludes = function (searchElement, fromIndex = 0) {
    if (fromIndex < 0) {
        fromIndex = Math.max(this.length + fromIndex, 0);
    }

    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement || (Number.isNaN(this[i]) && Number.isNaN(searchElement))) {
            return true;
        }
    }

    return false;
};

// Example usage:
const array = [1, 2, 3];

console.log(array.customIncludes(2)); // Output: true
console.log(array.customIncludes(4)); // Output: false
console.log(array.customIncludes(3, -1)); // Output: true
console.log(array.customIncludes(1, -3)); // Output: true
console.log([NaN].customIncludes(NaN)); // Output: true
```

### How It Works:

1. **Parameters** :
   * `searchElement`: The element to search for in the array.
   * `fromIndex`: The index to start the search from (defaults to 0). Negative values are adjusted to count from the end of the array.
2. **Iteration** : The `customIncludes` method iterates through the array starting from `fromIndex`.
3. **Comparison** : For each element, it checks if the element is strictly equal (`===`) to `searchElement` or if both are `NaN`.
4. **Return Value** :
   * Returns `true` if `searchElement` is found.
   * Returns `false` if `searchElement` is not found.

### Example:

* `customIncludes(2)` returns `true` because `2` is in the array.
* `customIncludes(4)` returns `false` because `4` is not in the array.
* `customIncludes(3, -1)` returns `true` because `3` is found when counting from the end.
* `customIncludes(1, -3)` returns `true` because `1` is found when counting from the end.
* `[NaN].customIncludes(NaN)` returns `true` because `NaN` is found in the array.

### Key Features:

* Supports negative `fromIndex` by adjusting it to count from the end of the array.
* Iterates through the array and checks for strict equality (`===`) with `searchElement` or if both are `NaN`.
* Returns a boolean indicating whether `searchElement` is found in the array.