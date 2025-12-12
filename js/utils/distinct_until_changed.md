---
date: 2025-05-06T06:50:41+05:30
description: Filters consecutive duplicate values from arrays. Similar to RxJS operator, preserving non-consecutive duplicates while removing sequential repeats.
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
