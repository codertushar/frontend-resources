---
date: 2025-03-15T00:35:56+05:30
description: Recursively converts all undefined values to null in objects and arrays. Essential for JSON serialization and data sanitization.
premium: false
---

# 🔄 undefinedToNull Utility

Here's a clearer explanation of the `undefinedToNull` function with test cases.

---

## ✅ Implementation

```javascript
function undefinedToNull(obj) {
  if (typeof obj !== 'object' || obj === null) {
    // If the input is not an object or is null, return it as is
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => undefinedToNull(item)); // Recursively call on array items
  }

  // Handle objects
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = undefinedToNull(obj[key]); // Recursively call on object properties
    }
  }

  return result;
}
```

### Explanation:

1. **Check if the input is an object** :

* If `obj` is not an object or is `null`, it returns the input unchanged.

1. **Handle Arrays** :

* If `obj` is an array (`Array.isArray(obj)`), it recursively calls `undefinedToNull` on each element of the array using `map`.

1. **Handle Objects** :

* For an object, the function creates a new object (`result`), iterates through the object properties, and recursively calls `undefinedToNull` on each property to handle potential nested structures.

1. **Recursive Call** :

* The function handles any level of nesting (arrays within objects and objects within arrays).

### Test Cases:

```javascript
// Test case 1: Simple object with undefined values
console.log(undefinedToNull({ a: undefined, b: 'BFE.dev' }));
// Expected Output: { a: null, b: 'BFE.dev' }
// Explanation: The `undefined` value is replaced with `null` in the resulting object.


// Test case 2: Object with arrays containing undefined values
console.log(undefinedToNull({ a: ['BFE.dev', undefined, 'bigfrontend.dev'] }));
// Expected Output: { a: ['BFE.dev', null, 'bigfrontend.dev'] }
// Explanation: The `undefined` in the array is replaced with `null`, while other values remain unchanged.
```

### Key Features:

* **Recursion** : Handles deeply nested arrays and objects.
* **Handles `undefined` values** : Replaces `undefined` values with `null`, while leaving other values intact.
* **Preserves object structure** : The function maintains the same structure (arrays within objects, objects within arrays).

This function is useful when you need to sanitize an object or array by replacing all `undefined` values with `null`, which can be particularly helpful for data processing or preparation.

---

<!-- quiz-start -->
### Q1: What does `undefinedToNull({ a: undefined, b: 2 })` return?
- [ ] `{ a: undefined, b: 2 }`
- [x] `{ a: null, b: 2 }`
- [ ] `{ b: 2 }`
- [ ] `{ a: 'null', b: 2 }`

### Q2: How does the function handle nested arrays containing undefined?
- [ ] It removes the undefined values
- [ ] It throws an error
- [x] It recursively replaces undefined with null in the array
- [ ] It converts the array to an object

### Q3: Why is it useful to convert undefined to null?
- [ ] null uses less memory
- [ ] undefined is deprecated in JavaScript
- [x] JSON.stringify ignores undefined but preserves null
- [ ] null is faster to compare
<!-- quiz-end -->
