
Here’s a simple polyfill for `distinctUntilChanged()` (similar to RxJS) as an array method:

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
