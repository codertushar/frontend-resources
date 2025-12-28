---
date: 2025-03-15T00:35:56+05:30
description: The sort() method sorts array elements in place and returns the sorted array. Accepts custom comparator for flexible sorting logic.
premium: true
---
# 🔀 Array.prototype.sort() Polyfill

The `sort()` method sorts the elements of an array in place and returns the sorted array.

Here are two implementations: **Bubble Sort** and **QuickSort**.

---

## ✅ Bubble Sort Implementation

```javascript
Array.prototype.customSort = function(compareFn) {
    if (typeof compareFn !== "function") {
        // Default sorting: Convert elements to strings and sort lexicographically
        compareFn = (a, b) => String(a) > String(b) ? 1 : (String(a) < String(b) ? -1 : 0);
    }

    // Bubble Sort Implementation
    for (let i = 0; i < this.length - 1; i++) {
        for (let j = 0; j < this.length - 1 - i; j++) {
            // Compare elements using the provided compare function
            if (compareFn(this[j], this[j + 1]) > 0) {
                // Swap elements if they are in the wrong order
                [this[j], this[j + 1]] = [this[j + 1], this[j]];
            }
        }
    }

    return this; // Sorting is in-place, return reference to the array
};

// Example usage:
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.customSort();
console.log(months); // Output: ["Dec", "Feb", "Jan", "March"]

const numbers = [1, 30, 4, 21, 100000];
numbers.customSort();
console.log(numbers); // Output: [1, 100000, 21, 30, 4] (lexicographic sorting)

numbers.customSort((a, b) => a - b); // Numeric sorting
console.log(numbers); // Output: [1, 4, 21, 30, 100000]
```

### Key Points about  **Bubble Sort** :

* **Time Complexity** : `O(n^2)` (because of the nested loops).
* **Space Complexity** : `O(1)` (no extra space needed).
* Bubble Sort is a simple but inefficient sorting algorithm that repeatedly swaps adjacent elements if they are in the wrong order.

---

### 2.  **QuickSort Implementation** :

```javascript
Array.prototype.customSort = function(compareFn) {
    if (typeof compareFn !== "function") {
        // Default sorting: Convert elements to strings and sort lexicographically
        compareFn = (a, b) => String(a) > String(b) ? 1 : (String(a) < String(b) ? -1 : 0);
    }

    // QuickSort Implementation
    const quickSort = (arr, left, right) => {
        if (left >= right) return; // Base case: stop when partition size is 1 or 0

        let pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);  // Sort left half
        quickSort(arr, pivotIndex + 1, right); // Sort right half
    };

    const partition = (arr, left, right) => {
        let pivot = arr[right]; // Choose the rightmost element as pivot
        let i = left - 1; // Pointer for smaller elements

        for (let j = left; j < right; j++) {
            if (compareFn(arr[j], pivot) < 0) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
            }
        }

        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]; // Move pivot to correct position
        return i + 1; // Return pivot index
    };

    // Call QuickSort on the entire array
    quickSort(this, 0, this.length - 1);

    return this; // Sorting is in-place, return reference to the array
};

// Example usage:
const months = ['March', 'Jan', 'Feb', 'Dec'];
months.customSort();
console.log(months); // Output: ["Dec", "Feb", "Jan", "March"]

const numbers = [1, 30, 4, 21, 100000];
numbers.customSort();
console.log(numbers); // Output: [1, 100000, 21, 30, 4] (lexicographic sorting)

numbers.customSort((a, b) => a - b); // Numeric sorting
console.log(numbers); // Output: [1, 4, 21, 30, 100000]
```

### Key Points about  **QuickSort** :

* **Time Complexity** : `O(n log n)` on average, `O(n^2)` in the worst case.
* **Space Complexity** : `O(log n)` for the recursive stack space.
* QuickSort is a more efficient algorithm compared to Bubble Sort. It works by selecting a pivot and partitioning the array into two sub-arrays, recursively sorting them.

---

### Summary:

* **Bubble Sort** : Simple, but inefficient. Its performance deteriorates with large datasets due to its `O(n^2)` time complexity.
* **QuickSort** : More efficient, with average time complexity of `O(n log n)`. It uses a divide-and-conquer approach to partition the array into smaller sub-arrays and sorts them recursively.

Both implementations allow you to pass a custom `compareFn` function for sorting, but if none is provided, they default to lexicographic sorting.

---

<!-- quiz-start -->
### Q1: What is the default sorting behavior when no compare function is provided?
- [ ] Numeric ascending order
- [x] Lexicographic (string) comparison
- [ ] Numeric descending order
- [ ] No sorting occurs

### Q2: Why does `[1, 30, 4, 21, 100000].sort()` produce `[1, 100000, 21, 30, 4]`?
- [ ] The sort is broken
- [ ] Numbers are sorted by their first digit
- [x] Elements are converted to strings and sorted lexicographically
- [ ] It's random behavior

### Q3: What is the average time complexity of QuickSort?
- [ ] O(n)
- [ ] O(n^2)
- [x] O(n log n)
- [ ] O(log n)
<!-- quiz-end -->
