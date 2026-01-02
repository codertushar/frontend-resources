---
date: 2025-03-15T00:35:56+05:30
description: The reverse() method reverses an array in place and returns it. Efficiently swaps elements from both ends toward the center.
premium: true
---
# 🔄 Array.prototype.reverse() Polyfill

The `reverse()` method reverses an array in place and returns the reference to the same array.

---

## ✅ Implementation

```javascript
Array.prototype.customReverse = function() {
    let left = 0;
    let right = this.length - 1;

    // Swap elements from both ends towards the center
    while (left < right) {
        [this[left], this[right]] = [this[right], this[left]]; // Swap
        left++;
        right--;
    }

    return this; // Return the modified array (reverse is in-place)
};

// Example usage:
const array = ['one', 'two', 'three'];
console.log('array:', array); // Output: ["one", "two", "three"]

const reversed = array.customReverse();
console.log('reversed:', reversed); // Output: ["three", "two", "one"]

// The original array is also reversed since the method modifies it in place
// console.log('array:', array); // Output: ["three", "two", "one"]
```

### Key Features:

* **In-place Reversal** : The array is reversed directly, modifying the original array.
* **Two-pointer Approach** : Efficient swapping using two pointers (`left` and `right`) that move towards each other.
* **Time Complexity** : `O(n)`—each element is swapped once.
* **Space Complexity** : `O(1)`—no additional memory is used, other than the variables for the pointers.

This method efficiently reverses the array while mimicking the behavior of the native `.reverse()` method in JavaScript.

---

<!-- quiz-start -->
### Q1: Does `reverse()` modify the original array or return a new one?
- [x] Modifies the original array in place
- [ ] Returns a new reversed array
- [ ] Depends on the array length
- [ ] Creates a shallow copy first

### Q2: What is the time complexity of the two-pointer reverse algorithm?
- [ ] O(n^2)
- [x] O(n)
- [ ] O(log n)
- [ ] O(1)

### Q3: What is the space complexity of the in-place reverse polyfill?
- [x] O(1)
- [ ] O(n)
- [ ] O(log n)
- [ ] O(n^2)
<!-- quiz-end -->
