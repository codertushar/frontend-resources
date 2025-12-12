---
date: 2025-03-21T07:33:05+05:30
description: The flat() method creates a new array with all sub-array elements concatenated recursively up to the specified depth. Includes simple recursive and spec-compliant implementations.
---
# 📋 Array.prototype.flat() Polyfill

The `flat()` method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth. This polyfill provides both a simple recursive solution and a spec-compliant depth-aware implementation.

---

## ✅ Simple Recursive Implementation

```js
function flattenRecursive(arr) {
  let result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result = result.concat(flattenRecursive(item)); // recurse
    } else {
      result.push(item); // base case
    }
  }

  return result;
}
```

---

## 📌 Example

```js
flattenRecursive([1, [2, [3, 4], 5], 6]);
// → [1, 2, 3, 4, 5, 6]
```

---

## 🧠 Atom-of-Thoughts Breakdown

1. **Base Case:**

   If the item is  **not an array** , push it to the result.
2. **Recursive Case:**

   If the item  **is an array** , call `flattenRecursive()` on it, and concatenate its result.
3. **Accumulator:**

   Uses a local `result` array to collect all flattened items.

---

## 🧪 Handles:

* Arbitrary nesting: ✅
* Mixed types: ✅
* Empty arrays: ✅

---


Here’s a  **spec-compliant polyfill for `Array.prototype.flat`** , matching ECMAScript behavior:

---

## ✅ **Flat Polyfill (Depth-Aware)**

```js
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth = 1) {
    const result = [];

    (function flatten(arr, d) {
      for (const item of arr) {
        if (Array.isArray(item) && d > 0) {
          flatten(item, d - 1);
        } else {
          result.push(item);
        }
      }
    })(this, depth);

    return result;
  };
}
```

---

## 📌 Usage

```js
[1, [2, [3, [4]]]].flat(2);
// → [1, 2, 3, [4]]
```

---

## 🧠 Atom-of-Thoughts Breakdown

1. **Default `depth = 1`** for single-level flattening.
2. **Recursive helper `flatten(arr, d)`** :

* If item is array and `depth > 0` → recurse with `depth - 1`.
* Else → push item to result.

1. **Uses closure `result[]`** to accumulate flattened values.

---

## 🧪 Edge Case Behavior

| Input                             | Output            |
| --------------------------------- | ----------------- |
| `[1, 2, [3]]`                   | `[1, 2, 3]`     |
| `[1, [2, [3]]]`with `depth=1` | `[1, 2, [3]]`   |
| `[1, [2, [3]]]`with `depth=2` | `[1, 2, 3]`     |
| `[1, [2, [3]]]`with `depth=0` | `[1, [2, [3]]]` |

