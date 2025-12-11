# 🔗 Prototype and Prototype Inheritance in JavaScript

JavaScript uses **prototype-based inheritance**, meaning objects inherit properties and methods from other objects via the `prototype` chain.

---

## **1️⃣ Basic Prototype Usage**

Every JavaScript function has a `prototype` property that allows you to add properties and methods.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding a method to the prototype
Person.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
};

// Creating instances
const person1 = new Person("Alice", 25);
const person2 = new Person("Bob", 30);

person1.greet(); // Output: Hello, my name is Alice and I'm 25 years old.
person2.greet(); // Output: Hello, my name is Bob and I'm 30 years old.
```

👉 The method **`greet`** is shared across all instances, reducing memory usage.

---

## **2️⃣ Prototype Inheritance (Extending a Prototype)**

To inherit from another prototype, we use `Object.create()`.

```javascript
function Employee(name, age, job) {
  Person.call(this, name, age); // Call the parent constructor
  this.job = job;
}

// Inherit from Person's prototype
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

// Add a new method to Employee prototype
Employee.prototype.work = function () {
  console.log(`${this.name} is working as a ${this.job}.`);
};

// Creating instances
const emp1 = new Employee("Charlie", 28, "Engineer");
emp1.greet(); // Inherited from Person
emp1.work();  // Specific to Employee
```

### **How Inheritance Works Here**

1. **`Employee` calls `Person`'s constructor** (`Person.call(this, name, age)`) to inherit properties.
2. **Prototype Chain:** `Employee.prototype → Person.prototype → Object.prototype`
3. **Avoid overwriting `Person.prototype`** by using `Object.create(Person.prototype)`.
4. **Restores `constructor` reference** to `Employee` after setting the prototype.

---

## **3️⃣ Checking Prototype Chain**

You can inspect the inheritance chain using:

```javascript
console.log(emp1 instanceof Employee); // true
console.log(emp1 instanceof Person);   // true
console.log(emp1 instanceof Object);   // true

console.log(Object.getPrototypeOf(emp1) === Employee.prototype); // true
console.log(Object.getPrototypeOf(Employee.prototype) === Person.prototype); // true
```

---

## **4️⃣ Overriding Inherited Methods**

If you redefine an inherited method in the child class, it **overrides** the parent's version.

```javascript
Employee.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}, a ${this.job} at work.`);
};

emp1.greet(); // Output: Hello, I'm Charlie, a Engineer at work.
```

---

## **5️⃣ ES6 Class-Based Prototype Inheritance (Modern Syntax)**

Modern JavaScript provides `class` syntax that simplifies prototype-based inheritance.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
  }
}

class Employee extends Person {
  constructor(name, age, job) {
    super(name, age); // Call the parent constructor
    this.job = job;
  }

  work() {
    console.log(`${this.name} is working as a ${this.job}.`);
  }
}

const emp2 = new Employee("Daisy", 35, "Designer");
emp2.greet(); // Inherited from Person
emp2.work();  // Specific to Employee
```

### **Why Use `class`?**

✅ **More readable & intuitive**

✅ **Same prototype-based behavior under the hood**

✅ **Encapsulation & better structure**

---

## **Conclusion**

* `prototype` allows sharing methods among instances.
* `Object.create()` enables prototype inheritance.
* `class` simplifies inheritance while using the same prototype chain mechanism.

Want a more complex example, like mixins or multiple inheritance patterns? 🚀
