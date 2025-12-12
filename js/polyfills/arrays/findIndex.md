---
date: 2025-03-15T00:35:56+05:30
description: The findIndex() method returns the index of the first element satisfying a test function, or -1 if none found. Essential for locating items.
---
# 🔢 Array.prototype.findIndex() Polyfill

The `findIndex()` method returns the index of the first element that satisfies the provided testing function, or `-1` if none is found.

---

## 💡 How It Works

1. **Iterate through the array**: Loop over each element in the array.
2. **Apply the callback function**: For each element, invoke the provided callback function.
3. **Return the index**: If the callback returns a truthy value for the current element, return its index.
4. **Return `-1`**: If no element matches the condition, return `-1`.

### **Implementation**:

```javascript
Array.prototype.customFindIndex = function(callbackFn, thisArg) {
    // Iterate over the array using a for loop
    for (let i = 0; i < this.length; i++) {
        // Call the callback function with the current element, index, and array
        // .call() is used to bind the this value inside the callback function
        if (callbackFn.call(thisArg, this[i], i, this)) {
            return i; // Return the index of the first matching element
        }
    }

    return -1; // Return -1 if no element matches the condition
};

// Example usage:
const array = [5, 12, 8, 130, 44];

// Find the index of the first element greater than 10
const foundIndex = array.customFindIndex(element => element > 10);

console.log(foundIndex); // Output: 1 (because 12 is the first element greater than 10)
```

### **Explanation of How It Works**:

1. **Iteration over the array**:

   - The method iterates through each element of the array using a `for` loop. The loop will go from index `0` to `this.length - 1`.
2. **Executing the callback function**:

   - For each element, the provided `callbackFn` is executed with three arguments: `this[i]` (the current element), `i` (the index of the element), and `this` (the array itself).
   - The callback function should return a truthy value for the matching element. If it does, the method immediately returns the index `i`.
3. **Return `-1` if no match is found**:

   - If the loop completes without finding a match, the method returns `-1`.

### **Example Walkthrough**:

- **`element => element > 10`**: The callback function checks if an element is greater than `10`.
- For the array `[5, 12, 8, 130, 44]`, it will return the **index `1`**, because `12` is the first element greater than `10`.

### **Edge Case**:

- If no element satisfies the condition (e.g., if you search for elements greater than `200` in the same array), the method will return `-1`.

```javascript
console.log(array.customFindIndex(element => element > 200)); // Output: -1
```

### **Summary**:

- This custom implementation mimics the behavior of the native `findIndex` method.
- It uses a `for` loop to iterate over the array and `callbackFn.call()` to ensure the correct context for the `this` inside the callback function.
- The method returns the **index of the first matching element** or `-1` if no element satisfies the condition.

Let me know if you'd like any modifications or further explanations! 😊
