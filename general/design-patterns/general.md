# 📘 Most Important Design Patterns in JavaScript

JavaScript, being a flexible, multi-paradigm language, empowers developers with the ability to write both object-oriented and functional code. As applications grow in complexity, **design patterns** become essential tools for creating **reusable, maintainable, and scalable** code.

This article walks through the **most important design patterns** every JavaScript developer should know, with clear explanations and examples.

---

## 1. 🧩 **Module Pattern**

### 🔍 What It Is:

Encapsulates private variables and functions, exposing only what's necessary.

### 💡 Use Case:

Used to avoid polluting the global namespace and organize code logically.

### ✅ Example:

```js
const CounterModule = (function () {
  let count = 0;

  return {
    increment() {
      return ++count;
    },
    reset() {
      count = 0;
    }
  };
})();

console.log(CounterModule.increment()); // 1
CounterModule.reset();
```

---

## 2. 📬 **Observer Pattern (Pub/Sub)**

### 🔍 What It Is:

Allows objects (subscribers) to get notified when another object (publisher) changes.

### 💡 Use Case:

Event handling, messaging systems, UI state changes.

### ✅ Example:

```js
function createPublisher() {
  const subscribers = [];

  return {
    subscribe(callback) {
      subscribers.push(callback);
    },
    notify(data) {
      subscribers.forEach(cb => cb(data));
    }
  };
}

const pub = createPublisher();
pub.subscribe(data => console.log("Received:", data));
pub.notify("Hello Observers");
```

---

## 3. 🏭 **Factory Pattern**

### 🔍 What It Is:

Creates objects without exposing the instantiation logic to the caller.

### 💡 Use Case:

Useful when creating multiple similar objects.

### ✅ Example:

```js
function CarFactory(type) {
  const car = {};

  car.type = type;
  car.drive = function () {
    console.log(`${type} is driving`);
  };

  return car;
}

const suv = CarFactory('SUV');
suv.drive(); // SUV is driving
```

---

## 4. 🏗️ **Builder Pattern**

### 🔍 What It Is:

Separates the construction of a complex object from its representation.

### 💡 Use Case:

Helpful when an object needs to be created step by step.

### ✅ Example:

```js
function PizzaBuilder() {
  const pizza = {};

  return {
    addCheese() {
      pizza.cheese = true;
      return this;
    },
    addPepperoni() {
      pizza.pepperoni = true;
      return this;
    },
    build() {
      return pizza;
    }
  };
}

const pizza = PizzaBuilder().addCheese().addPepperoni().build();
```

---

## 5. 🔁 **Singleton Pattern**

### 🔍 What It Is:

Ensures only one instance of a particular object is created.

### 💡 Use Case:

Managing global state, caching, logging, etc.

### ✅ Example:

```js
const Singleton = (function () {
  let instance;

  function createInstance() {
    return { name: "I am the only instance" };
  }

  return {
    getInstance() {
      if (!instance) instance = createInstance();
      return instance;
    }
  };
})();

const obj1 = Singleton.getInstance();
const obj2 = Singleton.getInstance();
console.log(obj1 === obj2); // true
```

---

## 6. 🧙‍♂️ **Prototype Pattern**

### 🔍 What It Is:

Uses existing objects as prototypes to create new ones.

### 💡 Use Case:

Memory-efficient object creation when you want to share behavior.

### ✅ Example:

```js
const animal = {
  speak() {
    console.log("I make a sound");
  }
};

const dog = Object.create(animal);
dog.speak(); // I make a sound
```

---

## 7. 🧰 **Strategy Pattern**

### 🔍 What It Is:

Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

### 💡 Use Case:

Changing behavior at runtime (e.g., different sorting or payment strategies).

### ✅ Example:

```js
const strategies = {
  quick: (a, b) => a - b,
  reverse: (a, b) => b - a
};

function sortArray(arr, strategy) {
  return arr.sort(strategies[strategy]);
}

console.log(sortArray([5, 3, 8], "quick"));   // [3, 5, 8]
console.log(sortArray([5, 3, 8], "reverse")); // [8, 5, 3]
```

---

## 8. 🔀 **Command Pattern**

### 🔍 What It Is:

Encapsulates a request as an object, allowing you to parametrize actions.

### 💡 Use Case:

Undo/redo actions, task queues, macro recording.

### ✅ Example:

```js
function createCommand(action, value) {
  return () => action(value);
}

function logAction(msg) {
  console.log("Action:", msg);
}

const command = createCommand(logAction, "Jump");
command(); // Action: Jump
```

---

## 🧠 Conclusion

Design patterns aren't strict rules—they're proven solutions to recurring problems. Understanding when and how to use them will elevate your JavaScript code from just "working" to being **robust, scalable, and clean**.

---

## 🧾 Summary Table

| Pattern   | Purpose                                |
| --------- | -------------------------------------- |
| Module    | Encapsulate and organize code          |
| Observer  | Notify subscribers of changes          |
| Factory   | Create objects flexibly                |
| Builder   | Construct complex objects step-by-step |
| Singleton | Ensure single shared instance          |
| Prototype | Share behavior through inheritance     |
| Strategy  | Choose behavior at runtime             |
| Command   | Wrap requests as executable objects    |
