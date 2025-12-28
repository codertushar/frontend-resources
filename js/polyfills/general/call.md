---
date: 2025-03-20T09:40:40+05:30
description: The call() method invokes a function with a specified this context and arguments. Essential for borrowing methods and controlling execution context.
premium: false
---
# 📞 Function.prototype.call() Polyfill

The `call` method in JavaScript allows us to **invoke a function with a specified `this` context and arguments**. Let's implement a **polyfill** for it.

---

### **1️⃣ Understanding `Function.prototype.call`**

Native behavior:

```javascript
function greet() {
  console.log(`Hello, my name is ${this.name}`);
}

const person = { name: "Alice" };
greet.call(person); // Output: Hello, my name is Alice
```

Here, `call(person)` makes `this` inside `greet` refer to `person`.

---

### **2️⃣ Polyfill for `call`**

We need to:

* Attach the function to the `thisArg` (context).
* Invoke the function with arguments.
* Remove the temporary function reference.

```javascript
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myCall can only be used on functions");
  }

  context = context || globalThis; // Default to global object (window in browsers, global in Node)
  
  const fnKey = Symbol(); // Unique key to avoid property collisions
  context[fnKey] = this; // Assign function to context
  
  const result = context[fnKey](...args); // Invoke function
  
  delete context[fnKey]; // Cleanup temporary function
  
  return result;
};
```

---

### **3️⃣ Testing the Polyfill**

```javascript
function greet(age) {
  console.log(`Hello, my name is ${this.name} and I am ${age} years old.`);
}

const person = { name: "Bob" };

greet.myCall(person, 30);
// Output: Hello, my name is Bob and I am 30 years old.
```

---

### **4️⃣ Key Features of Our Polyfill**

✅ **Handles any function**

✅ **Supports multiple arguments**

✅ **Avoids polluting original object using `Symbol`**

✅ **Works in any execution environment (`globalThis`)**



### **Dry Run of `myCall` Polyfill**

Let’s take an example and go step by step to understand how our polyfill works.

---

### **📌 Example**

```javascript
function greet(age) {
  console.log(`Hello, my name is ${this.name} and I am ${age} years old.`);
}

const person = { name: "Bob" };

greet.myCall(person, 30);
```

---

### **📌 Step-by-Step Execution**

#### **Step 1: Call `myCall`**

```javascript
greet.myCall(person, 30);
```

* `this` inside `myCall` refers to `greet` (the function being invoked).
* `context` is `person` (`{ name: "Bob" }`).
* `args = [30]`.

---

#### **Step 2: Function Definition Breakdown**

Inside `myCall`:

```javascript
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== "function") {
    throw new TypeError("myCall can only be used on functions");
  }

  context = context || globalThis; // Default to global object (window in browsers, global in Node)
  
  const fnKey = Symbol(); // Unique key to avoid property collisions
  context[fnKey] = this; // Assign function to context
  
  const result = context[fnKey](...args); // Invoke function
  
  delete context[fnKey]; // Cleanup temporary function
  
  return result;
};
```

---

### **📌 Step 3: Execution Flow**

#### **1️⃣ Validate `this`**

```javascript
if (typeof this !== "function") {
  throw new TypeError("myCall can only be used on functions");
}
```

* `this` is `greet`, which is a function ✅.
* No error is thrown.

---

#### **2️⃣ Set `context`**

```javascript
context = context || globalThis;
```

* `context = person`, since it was provided (`{ name: "Bob" }`).

---

#### **3️⃣ Attach Function Temporarily**

```javascript
const fnKey = Symbol();
context[fnKey] = this;
```

* `Symbol()` creates a unique property key (e.g., `Symbol(fnKey)`) to  **avoid overwriting existing properties** .
* `person` now has a new temporary property:

  ```javascript
  person[Symbol(fnKey)] = greet;
  ```

  So `person` looks like this:

  ```javascript
  {
    name: "Bob",
    [Symbol(fnKey)]: function greet(age) { ... }
  }
  ```

---

#### **4️⃣ Invoke Function**

```javascript
const result = context[fnKey](...args);
```

* Equivalent to:
  ```javascript
  person ;
  ```
* Since `this` inside `greet` is now `person`, it prints:
  ```
  Hello, my name is Bob and I am 30 years old.
  ```

---

#### **5️⃣ Cleanup**

```javascript
delete context[fnKey];
```

* Removes the temporary function from `person` to keep the object clean.
* `person` is now back to:
  ```javascript
  { name: "Bob" }
  ```

---

### **📌 Final Execution Summary**

| Step  | Action                                                                             |
| ----- | ---------------------------------------------------------------------------------- |
| 1️⃣ | `greet.myCall(person, 30)`is called                                              |
| 2️⃣ | `context = person`                                                               |
| 3️⃣ | `Symbol(fnKey)`is created and assigned to `person[Symbol(fnKey)] = greet`      |
| 4️⃣ | `person `is invoked, printing `"Hello, my name is Bob and I am 30 years old."` |
| 5️⃣ | Temporary function property is deleted                                             |

✅ **Works just like the native `call` method!**

---

<!-- quiz-start -->
### Q1: What does `call()` do?
- [ ] Creates a new function with bound context
- [x] Immediately invokes a function with specified `this` and arguments
- [ ] Returns the arguments as an array
- [ ] Delays function execution

### Q2: Why is `delete context[fnKey]` necessary in the polyfill?
- [ ] To improve performance
- [ ] To prevent memory leaks
- [x] To clean up the temporary function property from the context object
- [ ] It's not necessary, just a convention

### Q3: What happens if `context` is `null` or `undefined` in `call()`?
- [ ] An error is thrown
- [ ] The function doesn't execute
- [x] `this` defaults to the global object (globalThis)
- [ ] `this` becomes null inside the function
<!-- quiz-end -->
