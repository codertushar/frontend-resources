---
date: 2025-03-15T00:35:56+05:30
description: The map() method creates a new array with results from calling a function on every element. Essential for transforming data without mutation.
---
# 🗺️ Array.prototype.map() Polyfill

> **Interview Importance:** 🔴 Critical — One of the most frequently asked polyfill questions. Tests understanding of array methods, `this` binding, callbacks, and prototype extension.

---

## 1️⃣ What is Array.map()?

`Array.prototype.map()` creates a **new array** populated with the results of calling a provided function on every element in the calling array.

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6]
console.log(numbers);  // [1, 2, 3] - original unchanged
```

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Returns** | New array of same length |
| **Mutates original?** | No (pure function) |
| **Handles sparse arrays?** | Yes (skips holes) |
| **Accepts thisArg?** | Yes (optional second parameter) |

---

## 2️⃣ Why Know the Polyfill?

1. **Interview staple** — Asked frequently to test JavaScript fundamentals
2. **Understand internals** — Know how native methods work under the hood
3. **Edge cases** — Learn about sparse arrays, `this` binding, callback signature
4. **Build confidence** — If you can implement `map`, you can implement any array method

---

## 3️⃣ Native API Signature

```javascript
array.map(callback(currentValue, index, array), thisArg)
```

| Parameter | Description |
|-----------|-------------|
| `callback` | Function called for each element |
| `currentValue` | Current element being processed |
| `index` | Index of current element |
| `array` | The array `map` was called on |
| `thisArg` | Value to use as `this` inside callback (optional) |

---

## 4️⃣ Implementation

### Basic Implementation

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  // Validation: callback must be a function
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const result = [];

  for (let i = 0; i < this.length; i++) {
    // Skip holes in sparse arrays (critical!)
    if (this.hasOwnProperty(i)) {
      // Call callback with: thisArg, currentValue, index, array
      result.push(callback.call(thisArg, this[i], i, this));
    }
  }

  return result;
};
```

### 🔍 Dry Run: Basic Usage

```javascript
[1, 2, 3].myMap(x => x * 2)
```

```
Initial State:
---------------------------------------------------------
this = [1, 2, 3]
callback = x => x * 2
thisArg = undefined
result = []

Iteration 1 (i = 0):
---------------------------------------------------------
hasOwnProperty(0)? -> true
callback.call(undefined, 1, 0, [1,2,3])
  -> callback(1) returns 1 * 2 = 2
result.push(2) -> result = [2]

Iteration 2 (i = 1):
---------------------------------------------------------
hasOwnProperty(1)? -> true
callback.call(undefined, 2, 1, [1,2,3])
  -> callback(2) returns 2 * 2 = 4
result.push(4) -> result = [2, 4]

Iteration 3 (i = 2):
---------------------------------------------------------
hasOwnProperty(2)? -> true
callback.call(undefined, 3, 2, [1,2,3])
  -> callback(3) returns 3 * 2 = 6
result.push(6) -> result = [2, 4, 6]

Loop ends (i = 3 >= length 3)
Return: [2, 4, 6]
```

---

## 5️⃣ Key Implementation Details

### Why `hasOwnProperty(i)`?

Handles **sparse arrays** — arrays with "holes" (missing indices):

```javascript
const sparse = [1, , 3];  // Index 1 is a "hole"
console.log(sparse.length);  // 3
console.log(0 in sparse);    // true
console.log(1 in sparse);    // false (hole!)
console.log(2 in sparse);    // true

// Native map skips holes
sparse.map(x => x * 2);  // [2, empty, 6]

// Without hasOwnProperty check:
// Would process undefined at index 1 -> [2, NaN, 6] (wrong!)
```

### 🔍 Dry Run: Sparse Array

```javascript
[1, , 3].myMap(x => x * 2)
```

```
this = [1, empty, 3]  (length = 3)
result = []

i = 0: hasOwnProperty(0)? -> true
       result.push(1 * 2) -> result = [2]

i = 1: hasOwnProperty(1)? -> false (HOLE!)
       SKIP this iteration
       result stays [2]

i = 2: hasOwnProperty(2)? -> true
       result.push(3 * 2) -> result = [2, 6]

Return: [2, 6]  // Wait, but native returns [2, empty, 6]!
```

### Production Implementation (Preserves Holes)

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // Create result array with same length (preserves holes)
  const result = new Array(this.length);

  for (let i = 0; i < this.length; i++) {
    if (this.hasOwnProperty(i)) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
    // If hole, result[i] remains empty (hole preserved)
  }

  return result;
};

// Now:
[1, , 3].myMap(x => x * 2)  // [2, empty, 6] ✓
```

### Why `callback.call(thisArg, ...)`?

The `thisArg` parameter lets you set the `this` context inside the callback:

```javascript
const multiplier = {
  factor: 10,
  multiply(x) {
    return x * this.factor;
  }
};

const numbers = [1, 2, 3];

// Without thisArg - this.factor is undefined
// numbers.map(multiplier.multiply)  // [NaN, NaN, NaN]

// With thisArg - this refers to multiplier object
numbers.myMap(function(x) {
  return x * this.factor;
}, multiplier);  // [10, 20, 30]
```

### 🔍 Dry Run: Using thisArg

```javascript
const obj = { multiplier: 10 };
[1, 2].myMap(function(x) { return x * this.multiplier; }, obj)
```

```
this (array) = [1, 2]
callback = function(x) { return x * this.multiplier; }
thisArg = { multiplier: 10 }
result = new Array(2) -> [empty, empty]

i = 0: hasOwnProperty(0)? -> true
       callback.call(obj, 1, 0, [1,2])
         Inside callback: this = obj, x = 1
         Returns: 1 * obj.multiplier = 1 * 10 = 10
       result[0] = 10 -> result = [10, empty]

i = 1: hasOwnProperty(1)? -> true
       callback.call(obj, 2, 1, [1,2])
         Inside callback: this = obj, x = 2
         Returns: 2 * obj.multiplier = 2 * 10 = 20
       result[1] = 20 -> result = [10, 20]

Return: [10, 20]
```

---

## 6️⃣ Complete Spec-Compliant Implementation

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  // Step 1: Validate this is not null/undefined
  if (this == null) {
    throw new TypeError('Array.prototype.myMap called on null or undefined');
  }

  // Step 2: Validate callback is a function
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // Step 3: Convert this to object (handles primitives)
  const O = Object(this);

  // Step 4: Get length as 32-bit unsigned integer
  const len = O.length >>> 0;

  // Step 5: Create result array with same length
  const result = new Array(len);

  // Step 6: Iterate and apply callback
  for (let i = 0; i < len; i++) {
    if (i in O) {  // More spec-compliant than hasOwnProperty
      result[i] = callback.call(thisArg, O[i], i, O);
    }
  }

  return result;
};
```

### Why `Object(this)`?

Handles edge cases where `map` is called on primitives:

```javascript
// This is valid (though weird)
Array.prototype.myMap.call('abc', x => x.toUpperCase());
// Without Object(this): might fail
// With Object(this): works -> ['A', 'B', 'C']
```

### Why `length >>> 0`?

Converts length to a 32-bit unsigned integer (spec requirement):

```javascript
// Handles weird length values
const obj = { 0: 'a', 1: 'b', length: -1 };
// length >>> 0 converts -1 to 4294967295
// But practically, ensures length is a valid non-negative integer
```

### Why `i in O` instead of `hasOwnProperty`?

Checks both own and inherited numeric properties (spec-compliant):

```javascript
const obj = Object.create({ 0: 'inherited' });
obj.length = 1;

// hasOwnProperty(0) -> false
// 0 in obj -> true

// Spec says to include inherited numeric properties
Array.prototype.myMap.call(obj, x => x);  // ['inherited']
```

---

## 7️⃣ Common Interview Variations

### Variation 1: Implement without using `.call()`

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const result = new Array(this.length);

  // Bind callback to thisArg if provided
  const boundCallback = thisArg !== undefined
    ? callback.bind(thisArg)
    : callback;

  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = boundCallback(this[i], i, this);
    }
  }

  return result;
};
```

### Variation 2: Implement using reduce

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  return this.reduce((acc, curr, idx, arr) => {
    if (idx in arr) {
      acc[idx] = callback.call(thisArg, curr, idx, arr);
    }
    return acc;
  }, new Array(this.length));
};
```

### Variation 3: Async map

```javascript
Array.prototype.asyncMap = async function(callback, thisArg) {
  const results = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      results[i] = await callback.call(thisArg, this[i], i, this);
    }
  }
  return results;
};

// Usage:
await [1, 2, 3].asyncMap(async x => {
  await delay(100);
  return x * 2;
});  // [2, 4, 6] after ~300ms (sequential)
```

---

## 8️⃣ Common Interview Questions

### Q1: Implement Array.prototype.map

**Answer:** See Section 4 or Section 6.

### Q2: What's the difference between map and forEach?

**Answer:**

| Feature | `map` | `forEach` |
|---------|-------|-----------|
| Returns | New array | `undefined` |
| Chainable | Yes | No |
| Purpose | Transform data | Side effects |

```javascript
// map - returns new array
const doubled = [1, 2, 3].map(x => x * 2);  // [2, 4, 6]

// forEach - returns undefined
const result = [1, 2, 3].forEach(x => console.log(x));  // undefined
```

### Q3: Why does map skip holes but include undefined?

**Answer:**
- **Holes** = indices that don't exist (`[1, , 3]`)
- **Undefined** = indices that exist with value `undefined` (`[1, undefined, 3]`)

```javascript
const withHole = [1, , 3];
const withUndefined = [1, undefined, 3];

withHole.map(x => x);       // [1, empty, 3] - hole preserved
withUndefined.map(x => x);  // [1, undefined, 3] - undefined included
```

### Q4: Can you use map on objects?

**Answer:** Yes, using `.call()`:

```javascript
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const result = Array.prototype.map.call(arrayLike, x => x.toUpperCase());
// ['A', 'B', 'C']
```

### Q5: What happens if callback modifies the array?

**Answer:** Changes affect later iterations but length is fixed at start:

```javascript
const arr = [1, 2, 3];
arr.map((x, i, array) => {
  if (i === 0) array.push(4);  // Adds to array
  return x * 2;
});
// [2, 4, 6] - only original 3 elements processed
// arr is now [1, 2, 3, 4]
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Forgetting hasOwnProperty for Sparse Arrays

```javascript
// ❌ BAD: Processes holes as undefined
Array.prototype.badMap = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(cb(this[i], i, this));  // this[i] is undefined for holes
  }
  return result;
};

[1, , 3].badMap(x => x * 2);  // [2, NaN, 6] - wrong!

// ✅ GOOD: Skip holes
Array.prototype.goodMap = function(cb) {
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = cb(this[i], i, this);
    }
  }
  return result;
};

[1, , 3].goodMap(x => x * 2);  // [2, empty, 6] - correct!
```

### Pitfall 2: Not Handling thisArg

```javascript
// ❌ BAD: Ignores thisArg
Array.prototype.badMap = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result.push(cb(this[i], i, this));  // No thisArg handling
    }
  }
  return result;
};

// ✅ GOOD: Use callback.call(thisArg, ...)
```

### Pitfall 3: Returning Wrong Length for Sparse Arrays

```javascript
// ❌ BAD: Uses push, loses holes
const result = [];
result.push(value);  // result.length grows by 1

// ✅ GOOD: Pre-allocate and assign by index
const result = new Array(this.length);
result[i] = value;  // Preserves holes
```

---

## 🔟 Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Iterates through each element once |
| **Space** | O(n) | Creates new array of same size |

Where `n` = length of the input array.

---

## Summary

| Concept | Implementation Detail |
|---------|----------------------|
| **Return value** | New array with transformed elements |
| **Callback signature** | `callback(currentValue, index, array)` |
| **thisArg** | Optional `this` context for callback |
| **Sparse arrays** | Skip holes, preserve in result |
| **Key method** | `callback.call(thisArg, ...)` |

### Key Takeaways

1. **Always check for holes** — use `i in this` or `hasOwnProperty(i)`
2. **Preserve array length** — use `new Array(length)` not `[]`
3. **Handle thisArg** — use `.call()` or `.bind()`
4. **Return new array** — never mutate original
5. **Validate callback** — must be a function

---

## 📚 Further Reading

- [MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [ECMAScript Specification: Array.prototype.map](https://tc39.es/ecma262/#sec-array.prototype.map)
