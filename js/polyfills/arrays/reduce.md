---
date: 2025-03-21T07:33:05+05:30
description: The reduce() method executes a reducer function on array elements to produce a single value. Powerful for aggregations and transformations.
premium: true
---
# 🔄 Array.prototype.reduce() Polyfill

The `reduce()` method executes a reducer function on each element of the array, resulting in a single output value. This polyfill is spec-compliant, handling edge cases like sparse arrays, missing initial values, and proper validation.

---

## ✅ Spec-Compliant Implementation

```js
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, initialValue) {
    console.log('🔧 AOT 1: Validate `this`');
    if (this == null) throw new TypeError('Called on null or undefined');

    console.log('🔧 AOT 2: Validate callback');
    if (typeof callback !== 'function') throw new TypeError('Callback is not a function');

    console.log('🔧 AOT 3: Normalize input');
    const array = Object(this);
    const length = array.length >>> 0;
    console.log('Array:', array);
    console.log('Length:', length);

    let index = 0;
    let accumulator;

    if (arguments.length >= 2) {
      console.log('🔧 AOT 4: Using provided initialValue:', initialValue);
      accumulator = initialValue;
    } else {
      console.log('🔧 AOT 5: No initialValue, searching for first defined element...');
      while (index < length && !(index in array)) {
        console.log(` - Skipping hole at index ${index}`);
        index++;
      }
      if (index >= length) {
        console.log('❌ AOT ERROR: No elements to use as initial accumulator');
        throw new TypeError('Reduce of empty array with no initial value');
      }
      accumulator = array[index];
      console.log(`✅ Found initial value at index ${index}:`, accumulator);
      index++;
    }

    console.log('🔧 AOT 6: Begin reduction loop');
    for (; index < length; index++) {
      if (index in array) {
        console.log(`↪️  Applying callback at index ${index}:`, {
          accumulator,
          currentValue: array[index],
        });
        accumulator = callback(accumulator, array[index], index, array);
        console.log('    -> New accumulator:', accumulator);
      } else {
        console.log(` - Skipping hole at index ${index}`);
      }
    }

    console.log('✅ AOT 7: Returning final result:', accumulator);
    return accumulator;
  };
}
```

---

## ✅ How to Use

```js
[1, 2, 3, 4].reduce((a, b) => a + b);         // Normal reduce
[1, 2, 3, 4].reduce((a, b) => a + b, 10);     // With initial value
[,,3].reduce((a, b) => a + b, 1);             // Sparse array with initial
[].reduce((a, b) => a + b);                   // ❌ Error
```

---

## 🎯 Output Example

Calling:

```js
[1, 2, 3].reduce((a, b) => a + b);
```

Logs:

```
🔧 AOT 1: Validate `this`
🔧 AOT 2: Validate callback
🔧 AOT 3: Normalize input
Array: [1, 2, 3]
Length: 3
🔧 AOT 5: No initialValue, searching for first defined element...
✅ Found initial value at index 0: 1
🔧 AOT 6: Begin reduction loop
↪️  Applying callback at index 1: { accumulator: 1, currentValue: 2 }
    -> New accumulator: 3
↪️  Applying callback at index 2: { accumulator: 3, currentValue: 3 }
    -> New accumulator: 6
✅ AOT 7: Returning final result: 6
```

---

<!-- quiz-start -->
### Q1: What happens when calling `[].reduce((a, b) => a + b)` without an initial value?
- [ ] Returns undefined
- [ ] Returns 0
- [x] Throws a TypeError
- [ ] Returns an empty array

### Q2: When no initial value is provided, what does `reduce()` use as the initial accumulator?
- [ ] undefined
- [ ] 0
- [ ] The last element of the array
- [x] The first defined element of the array

### Q3: How does `reduce()` handle sparse arrays (arrays with holes)?
- [ ] Treats holes as undefined
- [x] Skips holes and only processes existing elements
- [ ] Throws an error when encountering holes
- [ ] Fills holes with null before processing
<!-- quiz-end -->
