---
date: 2025-06-16T09:14:37+05:30
description: Removes circular references from object graphs using WeakSet tracking. Prevents JSON.stringify errors and infinite recursion.
premium: true
---
# 🔄 Removing Circular References from Objects

Circular references can create serious problems in JavaScript — from infinite recursions to `JSON.stringify` errors. Here’s how to remove cycles **both structurally** and **during serialization** using idiomatic, memory-safe JavaScript.

---

## 🔁 1. Structural Removal with `WeakSet`

### Purpose:

Remove circular references **in-place** from object graphs (e.g., linked lists, trees, graphs).

### How It Works:

A **recursive traversal** tracks visited objects using a `WeakSet`. If a reference is encountered again, it is removed.

### Code:

```javascript
const removeCycle = (obj) => {
  const set = new WeakSet([obj]);

  (function iterate(current) {
    for (let key in current) {
      if (!current.hasOwnProperty(key)) continue;

      const val = current[key];

      if (typeof val === 'object' && val !== null) {
        if (set.has(val)) {
          delete current[key]; // Cycle detected, remove
        } else {
          set.add(val);
          iterate(val); // Recurse deeper
        }
      }
    }
  })(obj);
};
```

### Test Case:

```javascript
function List(val) {
  this.val = val;
  this.next = null;
}

const item1 = new List(10);
const item2 = new List(20);
const item3 = new List(30);

item1.next = item2;
item2.next = item3;
item3.next = item1; // Circular reference

removeCycle(item1);

console.log(item1);
// { val: 10, next: { val: 20, next: { val: 30 } } }
```

---

## 🧵 2. Serialization-Safe: `JSON.stringify()` with Replacer

### Purpose:

Remove cycles **on-the-fly** during serialization to JSON. Useful when you don't want to mutate the original object.

### How It Works:

`JSON.stringify` accepts a *replacer* function. You can use a `WeakSet` inside this replacer to track seen objects and return `undefined` for repeats (i.e., remove cycles).

### Code:

```javascript
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return; // Omit cyclic reference
      seen.add(value);
    }
    return value;
  };
};
```

### Usage:

```javascript
console.log(JSON.stringify(item1, getCircularReplacer(), 2));
```

### Output:

```json
{
  "val": 10,
  "next": {
    "val": 20,
    "next": {
      "val": 30
    }
  }
}
```

---

## 🔍 When to Use Which?

| Use Case                            | Use `removeCycle()` | Use `getCircularReplacer()`      |
| ----------------------------------- | ------------------- | -------------------------------- |
| Mutate structure and clean cycles   | ✅ Yes               | ❌ No (non-destructive)           |
| Safe JSON serialization             | ❌ No                | ✅ Yes                            |
| Need to traverse or clone afterward | ✅ Yes               | ❌ No (only during serialization) |
| Want GC-safe memory tracking        | ✅ Uses WeakSet      | ✅ Uses WeakSet                   |

---

## 🧠 Key Insight

> `WeakSet` is perfect for **tracking object identity** in cyclic graphs, without interfering with garbage collection.

---

## ✅ Final Take

* Use **structural traversal + `WeakSet`** to clean up in-memory object graphs.
* Use **`JSON.stringify` with a custom replacer** to safely serialize cyclic structures on-demand.

These patterns are standard in tools like `fast-safe-stringify`, `circular-json`, or serializers for distributed systems and state management frameworks.
