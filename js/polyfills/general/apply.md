---
date: 2025-03-20T09:40:40+05:30
description: The apply() method invokes a function with a specified this context and arguments as an array. Similar to call but with array arguments.
premium: false
---
# 📞 Function.prototype.apply() Polyfill

The `apply` method in JavaScript is similar to `call`, except that it **takes arguments as an array**.

---

## **1️⃣ Understanding `Function.prototype.apply`**

Native behavior:

```javascript
function greet(age, city) {
  console.log(`Hello, my name is ${this.name}, I am ${age} years old, and I live in ${city}.`);
}

const person = { name: "Alice" };
greet.apply(person, [25, "New York"]);
```

📌  **Difference from `call`** :

* `call(context, arg1, arg2, arg3, ...)` → Arguments are passed individually.
* `apply(context, [arg1, arg2, arg3, ...])` → Arguments are passed as an array.

---

## **2️⃣ Polyfill for `apply`**

We need to:

* Attach the function to the `thisArg` (context).
* Pass the arguments as an array.
* Remove the temporary function reference.

```javascript
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("myApply can only be used on functions");
  }

  context = context || globalThis; // Default to global (window in browser, global in Node.js)

  const fnKey = Symbol(); // Unique key to avoid property collisions
  context[fnKey] = this; // Assign function to context
  
  const result = context[fnKey](...(args || [])); // Invoke function with spread operator
  
  delete context[fnKey]; // Cleanup

  return result;
};
```

---

## **3️⃣ Testing the Polyfill**

```javascript
function greet(age, city) {
  console.log(`Hello, my name is ${this.name}, I am ${age} years old, and I live in ${city}.`);
}

const person = { name: "Bob" };

greet.myApply(person, [30, "Los Angeles"]);
// Output: Hello, my name is Bob, I am 30 years old, and I live in Los Angeles.
```

---

## **4️⃣ Dry Run Step-by-Step**

Let's break it down for:

```javascript
greet.myApply(person, [30, "Los Angeles"]);
```

---

### **📌 Step 1: Call `myApply`**

```javascript
greet.myApply(person, [30, "Los Angeles"]);
```

* `this` inside `myApply` refers to `greet`.
* `context = person` (`{ name: "Bob" }`).
* `args = [30, "Los Angeles"]`.

---

### **📌 Step 2: Function Definition Breakdown**

Inside `myApply`:

```javascript
Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new TypeError("myApply can only be used on functions");
  }
```

✅ `this` is `greet` (a function), so no error.

---

### **📌 Step 3: Set `context`**

```javascript
context = context || globalThis;
```

* `context = person`.

---

### **📌 Step 4: Attach Function Temporarily**

```javascript
const fnKey = Symbol();
context[fnKey] = this;
```

* A unique property is added to `person`:
  ```javascript
  {
    name: "Bob",
    [Symbol(fnKey)]: function greet(age, city) { ... }
  }
  ```

---

### **📌 Step 5: Invoke Function**

```javascript
const result = context[fnKey](...(args || []));
```

* Equivalent to:
  ```javascript
  person ;
  ```
* Since `this` is now `person`, it prints:
  ```
  Hello, my name is Bob, I am 30 years old, and I live in Los Angeles.
  ```

---

### **📌 Step 6: Cleanup**

```javascript
delete context[fnKey];
```

* Removes the temporary function from `person`, restoring it to:
  ```javascript
  { name: "Bob" }
  ```

---

### **📌 Final Execution Summary**

| Step  | Action                                                                                                     |
| ----- | ---------------------------------------------------------------------------------------------------------- |
| 1️⃣ | `greet.myApply(person, [30, "Los Angeles"])`is called                                                    |
| 2️⃣ | `context = person`                                                                                       |
| 3️⃣ | `Symbol(fnKey)`is created and assigned to `person[Symbol(fnKey)] = greet`                              |
| 4️⃣ | `person `is invoked, printing `"Hello, my name is Bob, I am 30 years old, and I live in Los Angeles."` |
| 5️⃣ | Temporary function property is deleted                                                                     |

✅ **Works just like the native `apply` method!**

---

<!-- quiz-start -->
### Q1: What is the main difference between `call()` and `apply()`?
- [ ] call() is faster
- [ ] apply() can change `this`, call() cannot
- [x] call() takes arguments individually, apply() takes them as an array
- [ ] apply() returns a new function, call() invokes immediately

### Q2: Why is a `Symbol` used as the function key in the polyfill?
- [ ] For better performance
- [x] To avoid property name collisions on the context object
- [ ] To make the function enumerable
- [ ] It's required by the JavaScript spec

### Q3: What does `apply()` return?
- [ ] The context object
- [ ] A new function
- [x] The return value of the invoked function
- [ ] undefined always
<!-- quiz-end -->
