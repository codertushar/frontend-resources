---
date: 2025-06-16T09:14:37+05:30
description: Creates objects using functions without new keyword. Use to generate multiple similar objects with private data and flexible object composition.
premium: false
---

# 🏭 The Factory Pattern in JavaScript – A Practical Guide

As JavaScript applications scale, developers often need to create **multiple instances of similar objects** without repeating code or tightly coupling construction logic. This is where the **Factory Pattern** shines.

It offers a clean and flexible way to generate objects — think of it as a **factory machine** that churns out customized products (objects), each tailored to specific needs.

---

## 🔍 What Is the Factory Pattern?

The **Factory Pattern** is a **creational design pattern** that uses a **function (the factory)** to create and return new object instances, often with shared structure but different data.

Unlike constructor functions or ES6 classes, **factory functions do not use `new`** and don’t rely on `this`. They return plain objects with all the necessary properties and methods.

---

## 🧱 Syntax & Structure

```js
function createUser(name, role) {
  return {
    name,
    role,
    greet() {
      console.log(`Hi, I'm ${name} and I work as a ${role}.`);
    }
  };
}
```

### ✅ Usage:

```js
const user1 = createUser('Alice', 'Designer');
const user2 = createUser('Bob', 'Developer');

user1.greet(); // Hi, I'm Alice and I work as a Designer.
user2.greet(); // Hi, I'm Bob and I work as a Developer.
```

---

## 🎯 Benefits of Factory Pattern

| Feature            | Benefit                                    |
| ------------------ | ------------------------------------------ |
| ✅ No `new` keyword | Simpler, less error-prone                  |
| ✅ No `this`        | No confusion about context                 |
| ✅ Flexible         | Can return any shape of object             |
| ✅ Composable       | Can combine factory-generated objects      |
| ✅ Encapsulation    | Easily include private data using closures |

---

## 🔐 Adding Private Data via Closures

```js
function createBankAccount(owner) {
  let balance = 0;

  return {
    getOwner() {
      return owner;
    },
    deposit(amount) {
      balance += amount;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount('Tushar');
account.deposit(500);
console.log(account.getBalance()); // 500
```

Here, `balance` is **truly private** — you can’t access it directly from the outside.

---

## 🧬 Factory vs Constructor vs Class

| Feature              | Factory Pattern    | Constructor Function  | ES6 Class                  |
| -------------------- | ------------------ | --------------------- | -------------------------- |
| Uses `new`           | ❌ No               | ✅ Yes                 | ✅ Yes                      |
| Uses `this`          | ❌ No               | ✅ Yes                 | ✅ Yes                      |
| Returns              | Custom object      | `this` (new instance) | `this`                     |
| Supports Inheritance | Manual composition | Prototype-based       | Built-in `extends`         |
| Easy private data    | ✅ Yes (closures)   | ❌ Not directly        | ✅ (with `#private` fields) |

---

## 📦 Real-World Example: Shape Factory

```js
function createShape(type, size) {
  if (type === 'circle') {
    return {
      type,
      radius: size,
      area() {
        return Math.PI * this.radius ** 2;
      }
    };
  } else if (type === 'square') {
    return {
      type,
      side: size,
      area() {
        return this.side ** 2;
      }
    };
  }
}

const circle = createShape('circle', 5);
const square = createShape('square', 4);

console.log(circle.area()); // 78.54
console.log(square.area()); // 16
```

---

## 🧠 When to Use the Factory Pattern

Use it when:

* You need to **create many similar objects** with shared behavior.
* You want **private data** via closures.
* You don’t want to deal with `this` or `new`.
* You’re **not using class-based OOP**, or want a more functional approach.
* You need **object composition** rather than inheritance.

---

## ❗ Pitfalls to Watch Out For

* **Memory usage**: If you define methods **inside** the factory, each object gets its own copy (unlike `prototype` methods). You can mitigate this by:

  * Moving shared methods outside:

    ```js
    const drive = function() {
      console.log(`${this.model} is driving`);
    };

    function createCar(model) {
      return { model, drive };
    }
    ```

* **No inheritance out of the box**: While this encourages composition, it may be limiting if your design heavily relies on inheritance hierarchies.

---

## 🧾 Summary

| Concept        | Explanation                                                 |
| -------------- | ----------------------------------------------------------- |
| Pattern Type   | Creational                                                  |
| Style          | Functional                                                  |
| Core Mechanism | Functions that return objects                               |
| Key Advantages | Simplicity, flexibility, closures for privacy               |
| Use Instead of | `new` constructor functions or `class` when OOP is overkill |

---

## 🔚 Conclusion

The **Factory Pattern** in JavaScript is a **clean, flexible, and powerful way** to create objects. It emphasizes **composition over inheritance**, embraces **functional programming principles**, and works especially well when combined with **closures** to achieve true encapsulation.

Whether you're building utility modules, UI components, or domain models, the Factory Pattern is a great choice for **modular, testable, and maintainable code**.
