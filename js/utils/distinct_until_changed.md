---
date: 2025-05-06T06:50:41+05:30
description: Filters consecutive duplicate values from arrays. Similar to RxJS operator, preserving non-consecutive duplicates while removing sequential repeats.
premium: false
---
# 🔄 distinctUntilChanged() Polyfill

The `distinctUntilChanged()` method filters out consecutive duplicate values from an array, similar to the RxJS operator. It only removes duplicates that appear next to each other, preserving non-consecutive duplicates.

---

## ✅ Implementation

```javascript
if (!Array.prototype.distinctUntilChanged) {
  Array.prototype.distinctUntilChanged = function () {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (i === 0 || this[i] !== this[i - 1]) {
        result.push(this[i]);
      }
    }
    return result;
  };
}
```

### Usage:

```javascript
const arr = [1, 1, 2, 2, 2, 3, 1, 1];
const filtered = arr.distinctUntilChanged();
console.log(filtered); // [1, 2, 3, 1]
```

---

<!-- quiz-start -->
### Q1: What does `distinctUntilChanged` do with the array `[1, 2, 2, 1, 1, 2]`?
- [ ] Returns `[1, 2]`
- [x] Returns `[1, 2, 1, 2]`
- [ ] Returns `[1, 2, 2, 1, 1, 2]`
- [ ] Returns `[1, 1, 2, 2]`

### Q2: How does `distinctUntilChanged` differ from removing all duplicates?
- [ ] It's faster than removing all duplicates
- [ ] It only works with numbers
- [x] It only removes consecutive duplicates, preserving non-consecutive ones
- [ ] It modifies the original array

### Q3: What is the result of `[1, 1, 1, 1].distinctUntilChanged()`?
- [x] `[1]`
- [ ] `[]`
- [ ] `[1, 1, 1, 1]`
- [ ] `undefined`
<!-- quiz-end -->
