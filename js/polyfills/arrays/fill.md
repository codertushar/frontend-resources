---
date: 2025-03-15T00:35:56+05:30
description: The fill() method changes array elements to a static value within a range. Useful for initializing arrays with default values.
premium: false
---
# 🔲 Array.prototype.fill() Polyfill

The `fill()` method changes all elements in an array to a static value, from a start index to an end index.

---

## ✅ Implementation

```javascript
Array.prototype.customFill = function(value, start = 0, end = this.length) {
    // Adjust negative indices for start and end
    start = start < 0 ? Math.max(this.length + start, 0) : start;
    end = end < 0 ? Math.max(this.length + end, 0) : end;

    // Fill the array with the given value from start to end (end is exclusive)
    for (let i = start; i < end; i++) {
        this[i] = value;
    }

    return this; // Return the modified array since fill modifies it in place
};

// Example usage:
const array1 = [1, 2, 3, 4];

console.log(array1.customFill(0, 2, 4)); // Output: [1, 2, 0, 0]
console.log(array1.customFill(5, 1));    // Output: [1, 5, 5, 5]
console.log(array1.customFill(6));       // Output: [6, 6, 6, 6]
```

### How It Works:

* **Parameters** :
* `value`: The value to fill the array with.
* `start`: The index to begin filling from (defaults to 0).
* `end`: The index to stop filling at (non-inclusive, defaults to the array’s length).
* **Negative Indices** :
  If `start` or `end` are negative, they are adjusted to count from the end of the array.
* **Filling the Array** :
  A `for` loop iterates from `start` to `end` (not including `end`) and fills the array with `value`.
* **In-Place Modification** :
  Since `.fill()` modifies the array directly, `customFill` returns the modified array.

### Key Features:

* Supports negative indices by adjusting them to count from the end of the array.
* Modifies the array in place and returns the updated array reference (like `.fill()`).
* Defaults to `start = 0` and `end = array.length` if not provided.

---

<!-- quiz-start -->
### Q1: What does `[1, 2, 3, 4].customFill(0, 1, 3)` return?
- [ ] [0, 0, 0, 0]
- [ ] [1, 0, 0, 0]
- [x] [1, 0, 0, 4]
- [ ] [0, 1, 2, 3]

### Q2: Does `fill()` modify the original array or create a new one?
- [x] Modifies the original array in place
- [ ] Creates and returns a new array
- [ ] Creates a shallow copy first, then modifies it
- [ ] Depends on the parameters passed

### Q3: What does `[1, 2, 3].customFill(5, -2)` do?
- [ ] Throws an error because of negative index
- [ ] Fills nothing and returns [1, 2, 3]
- [x] Fills from index 1 to end, returning [1, 5, 5]
- [ ] Fills the entire array with 5
<!-- quiz-end -->
