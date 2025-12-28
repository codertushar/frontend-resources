---
description: The for...of loop iterates over values in iterable objects like arrays and strings. Modern alternative to traditional for loops with cleaner syntax.
date: 2025-03-21T07:33:05+05:30
premium: false
---


# 🔍 Understanding `of` in JavaScript – `for...of` Loop Deep Dive

In JavaScript, the keyword `of` is used in the `for...of` loop— **not an operator** , but a **language construct** that allows iteration over iterable objects.

---

## 📌 Syntax

```js
for (const element of iterable) {
  // code block
}
```

* `element`: variable that holds the current value
* `iterable`: object with an internal iterator (e.g. `Array`, `String`, `Map`, etc.)

---

## ✅ Supported Iterables

| Type            | Works with `for...of` |
| --------------- | ----------------------- |
| `Array`       | ✅                      |
| `String`      | ✅                      |
| `Map`,`Set` | ✅                      |
| `arguments`   | ✅ (in ES6+)            |
| `NodeList`    | ✅ (browser)            |
| `Object`      | ❌ (not iterable)       |

---

## 🔁 Example: Array

```js
const numbers = [10, 20, 30];

for (const num of numbers) {
  console.log(num); // 10, then 20, then 30
}
```

---

## 🔁 Example: String

```js
for (const char of 'Hi') {
  console.log(char); // 'H', 'i'
}
```

---

## 🔁 Example: Map

```js
const map = new Map([['a', 1], ['b', 2]]);

for (const [key, value] of map) {
  console.log(key, value); // 'a' 1, then 'b' 2
}
```

---

## 🚫 `for...of` vs `for...in`

| Feature          | `for...of`          | `for...in`                        |
| ---------------- | --------------------- | ----------------------------------- |
| Iterates over    | **Values**      | **Keys (property names)**     |
| Works on objects | ❌ (unless iterable)  | ✅                                  |
| Use for arrays   | ✅ Recommended        | ❌ Avoid — includes inherited keys |
| Order            | Preserved (iterators) | Not guaranteed                      |

---

### 🧪 Example Difference:

```js
const arr = ['a', 'b'];

for (const i in arr) {
  console.log(i); // 0, 1 (indexes as strings)
}

for (const val of arr) {
  console.log(val); // 'a', 'b' (actual values)
}
```

---

## 🔍 Under the Hood

`for...of` uses the iterable protocol. When you do:

```js
for (const x of iterable) {}
```

JS internally does:

```js
const iterator = iterable[Symbol.iterator]();
let result;
while (!(result = iterator.next()).done) {
  const x = result.value;
  // loop body
}
```

---

## 🛠 When to Use `for...of`

* You want values, not keys.
* You’re dealing with iterable data (arrays, strings, sets, maps).
* You want cleaner syntax than `.forEach()` or manual `for` loops.
* You need `break`, `continue`, or `return`—which `forEach` doesn't support.

---

## ⚠️ Caveats

* Doesn't work on plain objects unless you make them iterable.
* Can’t use async `await` inside—use `for await...of` for that.

---

## ✅ Conclusion

The `for...of` construct is the **canonical way to iterate over iterable values** in modern JavaScript. It's readable, concise, and robust— **avoid `for...in` for arrays or iterable data structures** .

---

<!-- quiz-start -->
### Q1: What does `for...of` iterate over?
- [ ] Object keys
- [ ] Array indexes
- [x] Iterable values
- [ ] Object properties including inherited ones

### Q2: Which of the following can you iterate with `for...of`?
- [ ] Plain objects `{}`
- [x] Arrays, Strings, Maps, and Sets
- [ ] Only arrays
- [ ] Only strings

### Q3: What is the key difference between `for...of` and `for...in`?
- [ ] `for...of` is faster than `for...in`
- [ ] `for...in` only works on arrays
- [x] `for...of` iterates over values, while `for...in` iterates over keys/property names
- [ ] There is no difference, they are interchangeable
<!-- quiz-end -->
