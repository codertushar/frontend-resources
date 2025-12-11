# 🔗 Prototype and Prototype Inheritance in JavaScript

> **Interview Importance:** 🔴 Critical — Asked in 90% of JavaScript interviews. Understanding prototypes is fundamental to understanding how JavaScript works under the hood.

---

## 1️⃣ What is a Prototype?

JavaScript uses **prototype-based inheritance**, meaning objects inherit properties and methods from other objects via the `prototype` chain — not through classical class-based inheritance like Java or C++.

### Core Concept

Every JavaScript object has an internal link to another object called its **prototype**. When you access a property on an object, JavaScript first looks at the object itself. If not found, it looks up the prototype chain until it finds the property or reaches `null`.

```
┌─────────────────┐
│   Your Object   │
│  { name: "X" }  │
└────────┬────────┘
         │ [[Prototype]]
         ▼
┌─────────────────┐
│ Parent Prototype│
│  { greet() }    │
└────────┬────────┘
         │ [[Prototype]]
         ▼
┌─────────────────┐
│ Object.prototype│
│ { toString() }  │
└────────┬────────┘
         │ [[Prototype]]
         ▼
        null
```

---

## 2️⃣ Why Do Prototypes Matter?

### Memory Efficiency
Without prototypes, each object instance would have its own copy of every method:

```javascript
// ❌ Without prototypes - each instance has its own copy
function PersonBad(name) {
  this.name = name;
  this.greet = function() {  // New function created for EACH instance
    console.log(`Hello, ${this.name}`);
  };
}

const p1 = new PersonBad("Alice");
const p2 = new PersonBad("Bob");
console.log(p1.greet === p2.greet); // false - Different function objects!

// ✅ With prototypes - all instances share the same method
function PersonGood(name) {
  this.name = name;
}
PersonGood.prototype.greet = function() {
  console.log(`Hello, ${this.name}`);
};

const p3 = new PersonGood("Alice");
const p4 = new PersonGood("Bob");
console.log(p3.greet === p4.greet); // true - Same function object!
```

### Real-World Impact
- **1000 instances without prototype:** 1000 function objects in memory
- **1000 instances with prototype:** 1 shared function object

---

## 3️⃣ How Prototypes Work — Step by Step

### 3.1 The `prototype` Property (Functions)

Every JavaScript **function** has a `prototype` property (an object) that becomes the prototype of instances created with `new`.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding method to the prototype
Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old.`);
};

// Creating instances
const person1 = new Person("Alice", 25);
const person2 = new Person("Bob", 30);

person1.greet(); // Hello, I'm Alice and I'm 25 years old.
person2.greet(); // Hello, I'm Bob and I'm 30 years old.
```

### 🔍 Dry Run: What happens when `person1.greet()` is called?

```
Step 1: JavaScript looks for `greet` on person1 object
        → person1 = { name: "Alice", age: 25 }
        → `greet` NOT found on person1

Step 2: JavaScript looks up the prototype chain
        → person1.__proto__ === Person.prototype
        → Person.prototype = { greet: function() {...} }
        → `greet` FOUND!

Step 3: Execute greet() with `this` = person1
        → Output: "Hello, I'm Alice and I'm 25 years old."
```

### 3.2 The `__proto__` Property (Objects)

Every **object** has a `__proto__` property pointing to its prototype. This is how the chain is traversed.

```javascript
console.log(person1.__proto__ === Person.prototype);  // true
console.log(Person.prototype.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);  // null (end of chain)
```

### 3.3 Visualizing the Chain

```javascript
const person1 = new Person("Alice", 25);

// The prototype chain:
person1
  └── __proto__ → Person.prototype
                    └── __proto__ → Object.prototype
                                      └── __proto__ → null
```

---

## 4️⃣ Prototype Inheritance (Extending)

### Using Object.create()

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

function Employee(name, age, job) {
  Person.call(this, name, age);  // Step 1: Call parent constructor
  this.job = job;
}

// Step 2: Set up prototype chain
Employee.prototype = Object.create(Person.prototype);

// Step 3: Fix the constructor reference
Employee.prototype.constructor = Employee;

// Step 4: Add Employee-specific methods
Employee.prototype.work = function() {
  console.log(`${this.name} is working as a ${this.job}`);
};

// Usage
const emp = new Employee("Charlie", 28, "Engineer");
emp.greet();  // "Hello, I'm Charlie" (inherited)
emp.work();   // "Charlie is working as a Engineer" (own method)
```

### 🔍 Dry Run: Prototype Chain After Inheritance

```
emp (instance)
│   { name: "Charlie", age: 28, job: "Engineer" }
│
└── __proto__ → Employee.prototype
                │   { constructor: Employee, work: fn }
                │
                └── __proto__ → Person.prototype
                                │   { constructor: Person, greet: fn }
                                │
                                └── __proto__ → Object.prototype
                                                │   { toString, hasOwnProperty, ... }
                                                │
                                                └── __proto__ → null
```

### Why Each Step Matters

| Step | Code | Purpose |
|------|------|---------|
| 1 | `Person.call(this, name, age)` | Initialize parent properties on `this` |
| 2 | `Employee.prototype = Object.create(Person.prototype)` | Link prototype chain WITHOUT calling `Person()` |
| 3 | `Employee.prototype.constructor = Employee` | Fix constructor reference (otherwise points to Person) |
| 4 | Add methods to `Employee.prototype` | Define child-specific behavior |

### ❌ Common Mistake: Using `new` Instead of `Object.create`

```javascript
// ❌ WRONG - Calls Person() with no arguments
Employee.prototype = new Person();

// ✅ CORRECT - Creates object with Person.prototype as prototype
Employee.prototype = Object.create(Person.prototype);
```

---

## 5️⃣ ES6 Class Syntax (Syntactic Sugar)

ES6 `class` is syntactic sugar over prototype-based inheritance:

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

class Employee extends Person {
  constructor(name, age, job) {
    super(name, age);  // Calls Person constructor
    this.job = job;
  }

  work() {
    console.log(`${this.name} is working as a ${this.job}`);
  }
}

const emp = new Employee("Daisy", 35, "Designer");
emp.greet();  // Inherited
emp.work();   // Own method
```

### Under the Hood — Same Prototype Chain!

```javascript
// ES6 classes create the SAME prototype chain
console.log(emp.__proto__ === Employee.prototype);  // true
console.log(Employee.prototype.__proto__ === Person.prototype);  // true
console.log(typeof Person);  // "function" - Classes are functions!
```

---

## 6️⃣ Key Methods for Working with Prototypes

| Method | Purpose | Example |
|--------|---------|---------|
| `Object.create(proto)` | Create object with specified prototype | `Object.create(Person.prototype)` |
| `Object.getPrototypeOf(obj)` | Get an object's prototype | `Object.getPrototypeOf(emp)` |
| `Object.setPrototypeOf(obj, proto)` | Set an object's prototype (slow!) | `Object.setPrototypeOf(obj, newProto)` |
| `obj.hasOwnProperty(prop)` | Check if property exists on object (not prototype) | `emp.hasOwnProperty('name')` |
| `prop in obj` | Check if property exists anywhere in chain | `'greet' in emp` |
| `obj instanceof Constructor` | Check if object is instance of constructor | `emp instanceof Person` |

```javascript
const emp = new Employee("Test", 25, "Dev");

// hasOwnProperty vs in
console.log(emp.hasOwnProperty('name'));   // true (own property)
console.log(emp.hasOwnProperty('greet'));  // false (inherited)
console.log('greet' in emp);               // true (found in chain)

// instanceof checks the prototype chain
console.log(emp instanceof Employee);  // true
console.log(emp instanceof Person);    // true
console.log(emp instanceof Object);    // true
console.log(emp instanceof Array);     // false
```

---

## 7️⃣ Method Overriding (Shadowing)

When you define a method on an object or its prototype that already exists higher in the chain:

```javascript
class Animal {
  speak() {
    console.log("Animal speaks");
  }
}

class Dog extends Animal {
  speak() {
    console.log("Dog barks");
  }

  speakBoth() {
    super.speak();  // Call parent's speak
    this.speak();   // Call own speak
  }
}

const dog = new Dog();
dog.speak();      // "Dog barks" (overridden)
dog.speakBoth();  // "Animal speaks" then "Dog barks"
```

### 🔍 Dry Run: Property Lookup with Shadowing

```
dog.speak() is called

Step 1: Look for `speak` on dog instance
        → dog = {} (no own properties)
        → NOT found

Step 2: Look on Dog.prototype
        → Dog.prototype = { speak: fn, speakBoth: fn }
        → FOUND! Execute Dog.prototype.speak()
        → Output: "Dog barks"

Note: Animal.prototype.speak is never reached
      because Dog.prototype.speak shadows it
```

---

## 8️⃣ Common Interview Questions

### Q1: What is the difference between `__proto__` and `prototype`?

**Answer:**
- `prototype` is a property of **functions** — it becomes the prototype of instances created with `new`
- `__proto__` is a property of **all objects** — it points to the object's actual prototype

```javascript
function Foo() {}
const obj = new Foo();

console.log(Foo.prototype);       // { constructor: Foo }
console.log(obj.__proto__);       // { constructor: Foo }
console.log(obj.__proto__ === Foo.prototype);  // true
```

### Q2: How do you check if a property is on the object vs the prototype?

**Answer:**
```javascript
const obj = { name: "Test" };
Object.prototype.inherited = "I'm inherited";

console.log(obj.hasOwnProperty('name'));      // true
console.log(obj.hasOwnProperty('inherited')); // false
console.log('inherited' in obj);              // true
```

### Q3: What happens if you modify a built-in prototype like Array.prototype?

**Answer:**
It affects ALL arrays in your application (prototype pollution). This is generally discouraged:

```javascript
// ❌ Dangerous - affects all arrays
Array.prototype.first = function() {
  return this[0];
};

[1, 2, 3].first();  // 1 — works but risky

// ✅ Safer - create utility function
const first = (arr) => arr[0];
```

### Q4: Explain `instanceof` and how it works

**Answer:**
`instanceof` checks if an object's prototype chain contains `Constructor.prototype`:

```javascript
function Person() {}
const p = new Person();

// p instanceof Person checks:
// p.__proto__ === Person.prototype?
// If not, p.__proto__.__proto__ === Person.prototype?
// Continue until null...

console.log(p instanceof Person);  // true
console.log(p instanceof Object);  // true (Object.prototype is in chain)
```

### Q5: What is the output?

```javascript
function A() {}
function B() {}

A.prototype = B.prototype = {};

const a = new A();
console.log(a instanceof A);  // ?
console.log(a instanceof B);  // ?
```

**Answer:** Both are `true` because `a.__proto__` points to the shared `{}` object, which is both `A.prototype` and `B.prototype`.

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Forgetting to Reset Constructor

```javascript
function Parent() {}
function Child() {}

Child.prototype = Object.create(Parent.prototype);
// ❌ Child.prototype.constructor is now Parent!

console.log(new Child().constructor);  // Parent

// ✅ Fix: Reset constructor
Child.prototype.constructor = Child;
```

### Pitfall 2: Arrow Functions Don't Have `prototype`

```javascript
const Foo = () => {};
console.log(Foo.prototype);  // undefined

// ❌ Can't use as constructor
new Foo();  // TypeError: Foo is not a constructor
```

### Pitfall 3: Modifying Prototype After Creating Instances

```javascript
function Foo() {}
const obj = new Foo();

// This works - adding to existing prototype
Foo.prototype.greet = function() { console.log("Hi"); };
obj.greet();  // "Hi"

// This breaks existing instances!
Foo.prototype = { newMethod: function() {} };
obj.greet();  // Still "Hi" - obj still linked to OLD prototype
```

---

## 🔟 Summary

| Concept | Description |
|---------|-------------|
| **Prototype** | An object from which other objects inherit properties |
| **`prototype`** | Property of functions; becomes `__proto__` of instances |
| **`__proto__`** | Internal link to an object's prototype |
| **Prototype Chain** | The chain of prototypes JavaScript searches for properties |
| **`Object.create()`** | Create object with specified prototype |
| **ES6 Classes** | Syntactic sugar over prototype inheritance |

### Key Takeaways

1. **Every object has a prototype** (except `Object.prototype.__proto__` which is `null`)
2. **Methods on prototype are shared** — memory efficient
3. **Property lookup walks the chain** — own properties checked first
4. **`class` is syntactic sugar** — same prototype mechanism underneath
5. **Use `Object.create()` for inheritance** — not `new Parent()`

---

## 📚 Further Reading

- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [JavaScript.info: Prototypes](https://javascript.info/prototypes)
