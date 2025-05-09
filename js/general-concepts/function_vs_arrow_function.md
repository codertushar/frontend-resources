# 🧭 Arrow Functions vs Function Declarations in JavaScript

> **Why `this.fire = function(...)` and not an arrow function? Here's the full breakdown.**

---

## 1️⃣ Introduction

JavaScript offers multiple ways to define functions:

* Function Declarations: `function greet() {}`
* Function Expressions: `const greet = function() {}`
* Arrow Functions: `const greet = () => {}`

While arrow functions offer brevity and clarity, they  **do not have their own `this`** , which is why choosing between the two depends entirely on your use case.

---

## 2️⃣ The Key Difference: `this` Binding

### Function Expressions

Function expressions define their own `this` context depending on **how** they're called:

```js
const obj = {
  count: 0,
  increment: function () {
    console.log(this); // refers to `obj`
  },
};
```

### Arrow Functions

Arrow functions  **lexically bind `this`** , meaning they inherit `this` from the surrounding context:

```js
const obj = {
  count: 0,
  increment: () => {
    console.log(this); // refers to global object (or undefined in strict mode)
  },
};
```

### 📌 Why Not Use Arrow in `this.fire = function (...)`?

Because `this` refers to the object instance (`Move` in this case), and the fire method needs to explicitly bind `thisObj` or use the current instance as context.

If you used an arrow function, it would ignore `thisObj` and `this` would not refer to the `Move` instance or a provided scope — breaking functionality like `.call()`:

```js
this.fire = (o, thisObj) => {
  const scope = thisObj || window;
  // `this` here is lexically bound and can't be overridden with `.call()`
  this.handlers.forEach((item) => item.call(scope, o)); // ❌ unpredictable
};
```

---

## 3️⃣ When to Use Which

| Use Case                         | Prefer Function | Prefer Arrow Function             |
| -------------------------------- | --------------- | --------------------------------- |
| Needs dynamic `this`binding    | ✅ Yes          | ❌ No                             |
| Callback inside method           | ✅ Yes          | ✅ Yes (if no `this`dependency) |
| Inside classes or object methods | ✅ Yes          | ❌ No (unless explicitly static)  |
| Event handlers                   | ✅ Usually      | ❌ Only if you bind explicitly    |
| Simple one-liners / pure funcs   | ❌ Overhead     | ✅ Perfect match                  |

---

## 4️⃣ Real Examples

### ✅ Good Use of Arrow:

```js
const numbers = [1, 2, 3];
const squares = numbers.map(n => n * n);
```

### ✅ Good Use of Function Declaration:

```js
class Timer {
  constructor() {
    this.seconds = 0;
    setInterval(function () {
      this.seconds++; // `this` needs to refer to Timer — so we bind
    }.bind(this), 1000);
  }
}
```

### ⚠️ Misuse of Arrow in Object Method:

```js
const counter = {
  value: 0,
  increment: () => {
    this.value++; // ❌ `this` is not `counter`
  },
};
```

---

## 5️⃣ Interview Q&A

### Q1: Why don’t arrow functions have their own `this`?

**A:** Because arrow functions are designed for lexical scoping. They inherit `this` from the context in which they are defined, rather than from how they are called.

### Q2: When would using an arrow function inside a class break things?

**A:** When the method depends on `this` referring to the class instance. Arrow functions don’t have their own `this`, so they won’t work properly in instance methods.

### Q3: Can you replace all function expressions with arrow functions?

**A:** No. If the function needs a dynamic or context-based `this`, you must use a traditional function.

### Q4: How does `.call()` or `.apply()` behave with arrow functions?

**A:** It has no effect. You cannot change the `this` value of an arrow function with `.call()` or `.apply()`.

---

## 🔚 Conclusion

Use **function declarations or expressions** when you rely on dynamic `this`, such as in methods or callbacks that depend on object context. Use **arrow functions** for everything else — especially in callbacks, map/reduce logic, and stateless utilities.
