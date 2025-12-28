---
date: 2025-03-21T07:33:05+05:30
description: The flat() method creates a new array with all sub-array elements concatenated recursively up to the specified depth. Includes simple recursive and spec-compliant implementations.
premium: true
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

---

<!-- quiz-start -->
### Q1: What is the default depth value for `flat()`?
- [ ] 0
- [x] 1
- [ ] Infinity
- [ ] undefined

### Q2: What does `[1, [2, [3, [4]]]].flat(2)` return?
- [ ] [1, 2, 3, 4]
- [x] [1, 2, 3, [4]]
- [ ] [1, [2, [3, [4]]]]
- [ ] [1, 2, [3, [4]]]

### Q3: How does the recursive `flat()` polyfill determine when to stop flattening?
- [ ] When the array is empty
- [x] When depth reaches 0 or the item is not an array
- [ ] When all elements are numbers
- [ ] When a null value is encountered
<!-- quiz-end -->

