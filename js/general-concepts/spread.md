---
description: The spread operator expands arrays and objects into individual elements. Essential for copying, merging, and passing array elements as function arguments.
date: 2025-03-20T09:40:40+05:30
premium: false
---

# 📤 JavaScript Spread Operator (...) Explained

The **spread operator (`...`)** in JavaScript is used to **expand** elements of an iterable (like an array or object) into individual elements.

---

## **📌 1. Expanding Arrays**

### **Example: Expanding an Array into Function Arguments**

```javascript
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers)); // ✅ Equivalent to sum(1, 2, 3) → Output: 6
```

✅ The spread operator **unpacks the array elements** into separate arguments.

---

### **Example: Combining Arrays**

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const combined = [...arr1, ...arr2];

console.log(combined); // ✅ [1, 2, 3, 4, 5, 6]
```

✅  **Alternative to `concat()`** , creating a new merged array.

---

### **Example: Copying Arrays (Shallow Copy)**

```javascript
const original = [1, 2, 3];
const copy = [...original];

console.log(copy); // ✅ [1, 2, 3]
console.log(copy === original); // ❌ false (new array, not the same reference)
```

✅ **Prevents accidental mutation** by creating a new array instead of referencing the original.

---

## **📌 2. Using Spread with Objects**

### **Example: Merging Objects**

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

const merged = { ...obj1, ...obj2 };

console.log(merged); // ✅ { a: 1, b: 2, c: 3, d: 4 }
```

✅  **Alternative to `Object.assign()`** , creating a new object.

---

### **Example: Overwriting Object Properties**

```javascript
const objA = { a: 1, b: 2 };
const objB = { b: 99, c: 3 };

const newObj = { ...objA, ...objB };

console.log(newObj); // ✅ { a: 1, b: 99, c: 3 }
```

✅ The `b` property in `objA` is **overwritten** by `b` in `objB`.

---

## **📌 3. Spread vs Rest (`...`) Operator**

| Feature          | Spread (`...`)                    | Rest (`...`)               |
| ---------------- | ----------------------------------- | ---------------------------- |
| Purpose          | Expands elements                    | Collects elements            |
| Where it’s used | Function calls, arrays, objects     | Function parameters          |
| Example          | `sum(...[1,2,3])`→`sum(1,2,3)` | `function sum(...args) {}` |

### **Example: Spread vs Rest in Functions**

```javascript
// Spread: Expands
const numbers = [1, 2, 3];
console.log(Math.max(...numbers)); // ✅ Expands array to arguments

// Rest: Collects
function sum(...args) {
  return args.reduce((acc, val) => acc + val, 0);
}

console.log(sum(1, 2, 3)); // ✅ Gathers all arguments into an array
```

✅ **Spread "spreads out", Rest "gathers in".**

---

## **📌 4. Practical Use Cases**

### **1️⃣ Clone and Modify Objects**

```javascript
const user = { name: "Alice", age: 25 };
const updatedUser = { ...user, age: 26 };

console.log(updatedUser); // ✅ { name: "Alice", age: 26 }
```

✅ **Useful for immutable state updates (React, Redux, etc.).**

---

### **2️⃣ Remove an Object Property**

```javascript
const person = { name: "Bob", age: 30, city: "NYC" };

const { city, ...rest } = person;

console.log(rest); // ✅ { name: "Bob", age: 30 }
```

✅ **Removes `city` from `person` without modifying the original object.**

---

### **3️⃣ Convert a String into an Array**

```javascript
const word = "Hello";
const letters = [...word];

console.log(letters); // ✅ ["H", "e", "l", "l", "o"]
```

✅ **Useful for string manipulation.**

---

## **🚀 Summary**

| Feature             | Example                  | Use Case                            |
| ------------------- | ------------------------ | ----------------------------------- |
| Function arguments  | `sum(...[1,2,3])`      | Passing array elements as arguments |
| Array merging       | `[...arr1, ...arr2]`   | Combining arrays                    |
| Array copying       | `[...original]`        | Creating a shallow copy             |
| Object merging      | `{ ...obj1, ...obj2 }` | Merging objects                     |
| Object modification | `{ ...user, age: 30 }` | Updating properties immutably       |
| String to array     | `[..."Hello"]`         | Splitting a string into characters  |

---

💡 **Final Thought:**

The **spread operator (`...`) is one of JavaScript's most powerful tools** for working with arrays, objects, and function arguments in a clean, concise way.

---

<!-- quiz-start -->
### Q1: What does the spread operator do when used with an array?
- [ ] Combines arrays by reference
- [x] Expands array elements into individual elements
- [ ] Creates a deep copy of nested objects
- [ ] Removes duplicate elements

### Q2: What is the result of `{ ...{ a: 1, b: 2 }, ...{ b: 3, c: 4 } }`?
- [ ] `{ a: 1, b: 2, c: 4 }`
- [x] `{ a: 1, b: 3, c: 4 }`
- [ ] `{ a: 1, b: [2, 3], c: 4 }`
- [ ] Error: duplicate property

### Q3: What is the key difference between the spread operator and the rest parameter?
- [ ] They are the same thing
- [ ] Spread can only be used with objects
- [x] Spread expands elements, while rest collects elements into an array
- [ ] Rest can only be used in function returns
<!-- quiz-end -->
