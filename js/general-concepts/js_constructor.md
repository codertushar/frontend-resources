---
description: Constructor functions create and initialize objects with shared properties and methods. Foundation for object-oriented patterns before ES6 classes.
date: 2025-03-20T09:40:40+05:30
premium: false
---

# 🏗️ Constructor Functions in JavaScript

A **constructor** in JavaScript is a special function used to create and initialize objects. It allows you to define reusable object structures.

---

## **1️⃣ What is a Constructor?**

A  **constructor function** :

* Is a regular function but used with the `new` keyword.
* Initializes an object and assigns properties to it.
* Typically follows PascalCase naming convention (`Person`, `Car`, `Employee`).

### **Example of a Constructor Function**

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const person1 = new Person("Alice", 25);
console.log(person1); // { name: "Alice", age: 25 }
```

📌 **How it works:**

1. `new Person("Alice", 25)` creates a  **new empty object** .
2. `this` inside `Person` refers to the newly created object.
3. The function assigns properties (`name` and `age`) to `this`.
4. The new object is returned automatically.

---

## **2️⃣ Constructor Without `new` (Why `new` is Needed)**

If you forget to use `new`, `this` refers to the global object (`window` in browsers, `global` in Node.js).

```javascript
const person2 = Person("Bob", 30); // No `new` used
console.log(person2); // ❌ undefined
console.log(window.name); // ❌ "Bob" (property assigned to global scope)
```

✅ **Always use `new` when calling a constructor function.**

---

## **3️⃣ Constructor with Methods**

You can add methods inside the constructor, but it's inefficient because each instance gets a new copy of the method.

```javascript
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
  this.displayInfo = function () {
    console.log(`Car: ${this.brand} ${this.model}`);
  };
}

const car1 = new Car("Toyota", "Camry");
const car2 = new Car("Honda", "Civic");

console.log(car1.displayInfo === car2.displayInfo); // ❌ false (new function created for each instance)
```

---

## **4️⃣ Constructor + Prototype (Efficient Approach)**

Instead of defining methods inside the constructor, use **prototype** to share methods among all instances.

```javascript
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}

// Add method to prototype (shared among all instances)
Car.prototype.displayInfo = function () {
  console.log(`Car: ${this.brand} ${this.model}`);
};

const car1 = new Car("Toyota", "Camry");
const car2 = new Car("Honda", "Civic");

console.log(car1.displayInfo === car2.displayInfo); // ✅ true (shared method)
```

📌 **Why use prototype?**

* Reduces memory usage by sharing methods among instances.

---

## **5️⃣ Constructor in ES6 Classes (Modern Approach)**

ES6 introduces `class` syntax, making constructor-based object creation cleaner.

```javascript
class Animal {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  speak() {
    console.log(`${this.name} says hello!`);
  }
}

const dog = new Animal("Buddy", "Dog");
dog.speak(); // Output: Buddy says hello!
```

✅ **Same behavior as constructor functions but more readable.**

✅ **Uses prototype under the hood.**

---

## **6️⃣ Checking Constructor Reference**

Each object instance retains a reference to its constructor.

```javascript
console.log(car1.constructor === Car); // ✅ true
console.log(dog.constructor === Animal); // ✅ true
```

This is why resetting `constructor` in prototype inheritance is necessary:

```javascript
Employee.prototype.constructor = Employee;
```

---

## **7️⃣ Custom Object Creation Without `new`**

You can simulate `new` by manually creating and returning an object.

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hi, I'm ${this.name}`);
    },
  };
}

const p1 = createPerson("Alice", 25);
p1.greet();
```

📌 **Difference?**

* `new` is not required.
* Object literals are used instead of `this`.

---

### **🚀 Summary**

| Feature           | Constructor Function                      | ES6 Class                   |
| ----------------- | ----------------------------------------- | --------------------------- |
| Syntax            | Function-based                            | `class`keyword            |
| Instantiation     | `new`keyword                            | `new`keyword              |
| Method Definition | Inside function (bad) or prototype (good) | Inside class body           |
| Performance       | Prototype-based (efficient)               | Prototype-based (efficient) |

✅ **Use ES6 classes for cleaner, modern syntax.**

✅ **Use prototype for shared methods to improve performance.**

---

<!-- quiz-start -->
### Q1: What happens if you call a constructor function without the `new` keyword?
- [ ] It throws a syntax error
- [x] `this` refers to the global object (or undefined in strict mode)
- [ ] It automatically creates a new object
- [ ] The function returns null

### Q2: Why is it better to define methods on the prototype instead of inside the constructor?
- [ ] Methods on the prototype are faster to execute
- [ ] It's required by JavaScript specification
- [x] Methods on the prototype are shared among all instances, saving memory
- [ ] Methods inside the constructor don't work properly

### Q3: What does the `constructor` property of an object instance reference?
- [ ] The prototype object
- [x] The function that created the instance
- [ ] The parent class
- [ ] The global object
<!-- quiz-end -->
