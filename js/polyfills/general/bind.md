---
date: 2025-03-15T00:35:56+05:30
description: The bind() method creates a new function with a bound this context and optional preset arguments. Critical for event handlers and callbacks.
---

# 🔗 Function.prototype.bind() Polyfill

> **Interview Importance:** 🔴 Critical — One of the holy trinity of `call`, `apply`, `bind` questions. Understanding `bind` demonstrates deep knowledge of JavaScript's `this` binding and closures.

---

## 1️⃣ What is bind()?

`Function.prototype.bind()` creates a **new function** that, when called, has its `this` keyword set to a specified value, with a given sequence of arguments preceding any provided when the new function is called.

```javascript
const person = {
  name: 'Alice',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

const greet = person.greet;
greet();  // "Hello, undefined" - lost context!

const boundGreet = person.greet.bind(person);
boundGreet();  // "Hello, Alice" - context preserved!
```

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Returns** | New function with bound `this` |
| **Modifies original?** | No (returns new function) |
| **Partial application?** | Yes (can preset arguments) |
| **Works as constructor?** | Yes (bound function can use `new`) |

---

## 2️⃣ Why Use bind()?

### Common Use Cases

| Use Case | Problem | Solution with bind |
|----------|---------|-------------------|
| **Event handlers** | `this` refers to DOM element | Bind to component |
| **Callbacks** | `this` lost in callback | Preserve context |
| **setTimeout** | `this` becomes `window` | Bind to object |
| **Partial application** | Need preset arguments | Bind arguments |
| **Method extraction** | Lose context when extracting | Bind before extracting |

### Real-World Example

```javascript
class Button {
  constructor(label) {
    this.label = label;
  }

  click() {
    console.log(`Button ${this.label} clicked`);
  }
}

const btn = new Button('Submit');

// ❌ Without bind - loses context
document.addEventListener('click', btn.click);
// Clicking logs: "Button undefined clicked"

// ✅ With bind - preserves context
document.addEventListener('click', btn.click.bind(btn));
// Clicking logs: "Button Submit clicked"
```

---

## 3️⃣ Native API Signature

```javascript
function.bind(thisArg, arg1, arg2, ...)
```

| Parameter | Description |
|-----------|-------------|
| `thisArg` | Value to use as `this` inside bound function |
| `arg1, arg2, ...` | Arguments to prepend to bound function calls (partial application) |

---

## 4️⃣ Implementation

### Basic Implementation

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  // Validate: bind can only be called on functions
  if (typeof this !== 'function') {
    throw new TypeError('myBind must be called on a function');
  }

  // Store reference to original function
  const originalFunction = this;

  // Return new function
  return function(...args) {
    // Combine bound args with new args, call with context
    return originalFunction.apply(context, [...boundArgs, ...args]);
  };
};
```

### 🔍 Dry Run: Basic Usage

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };
const boundGreet = greet.myBind(person, 'Hello');
boundGreet('!');  // ?
```

```
Step 1: greet.myBind(person, 'Hello') is called
─────────────────────────────────────────────────────────
  this = greet (the function)
  context = { name: 'Alice' }
  boundArgs = ['Hello']
  originalFunction = greet

  Returns: new function(...args) { ... }

Step 2: boundGreet('!') is called
─────────────────────────────────────────────────────────
  args = ['!']
  Combined args: [...boundArgs, ...args] = ['Hello', '!']

  Calls: originalFunction.apply(context, ['Hello', '!'])
       = greet.apply({ name: 'Alice' }, ['Hello', '!'])

  Inside greet:
    this = { name: 'Alice' }
    greeting = 'Hello'
    punctuation = '!'
    Returns: 'Hello, Alice!'

Output: 'Hello, Alice!'
```

---

## 5️⃣ Understanding Key Concepts

### What are `boundArgs` and `args`?

```javascript
function add(a, b, c) {
  return a + b + c;
}

// Step 1: Bind with preset argument
const addTwo = add.myBind(null, 2);
// boundArgs = [2]

// Step 2: Call with remaining arguments
addTwo(3, 4);
// args = [3, 4]

// Step 3: Combine
// [...boundArgs, ...args] = [2, 3, 4]
// add(2, 3, 4) = 9
```

### Visual: Argument Flow

```
myBind(context, boundArg1, boundArg2)
                    ↓          ↓
              [boundArg1, boundArg2]
                        ↓
boundFunction(callArg1, callArg2)
                  ↓         ↓
                [callArg1, callArg2]
                        ↓
              [...boundArgs, ...args]
                        ↓
        [boundArg1, boundArg2, callArg1, callArg2]
                        ↓
       originalFunction.apply(context, combinedArgs)
```

### Why `apply` Instead of `call`?

```javascript
// apply takes array of arguments
func.apply(context, [arg1, arg2, arg3]);

// call takes arguments separately
func.call(context, arg1, arg2, arg3);

// We have an array [...boundArgs, ...args]
// So apply is more convenient
```

---

## 6️⃣ Production Implementation (with `new` Support)

When a bound function is called with `new`, the bound `this` is ignored:

```javascript
function Person(name) {
  this.name = name;
}

const BoundPerson = Person.bind({ ignored: true });
const p = new BoundPerson('Alice');
console.log(p.name);      // 'Alice'
console.log(p.ignored);   // undefined - bound context ignored!
```

### Complete Implementation

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('Bind must be called on a function');
  }

  const originalFunction = this;

  // Named function for constructor support
  function boundFunction(...args) {
    // Check if called with 'new'
    const isNewCall = this instanceof boundFunction;

    return originalFunction.apply(
      // If 'new', use newly created object; otherwise use bound context
      isNewCall ? this : context,
      [...boundArgs, ...args]
    );
  }

  // Preserve prototype chain for 'new' calls
  if (originalFunction.prototype) {
    boundFunction.prototype = Object.create(originalFunction.prototype);
  }

  return boundFunction;
};
```

### 🔍 Dry Run: Using with `new`

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const BoundPerson = Person.myBind({ ignored: true }, 'Alice');
const p = new BoundPerson(25);
```

```
Step 1: Person.myBind({ ignored: true }, 'Alice')
─────────────────────────────────────────────────────────
  originalFunction = Person
  context = { ignored: true }
  boundArgs = ['Alice']

  Creates boundFunction with:
    boundFunction.prototype = Object.create(Person.prototype)

  Returns: boundFunction

Step 2: new BoundPerson(25)
─────────────────────────────────────────────────────────
  JavaScript creates new object: newObj = {}
  Sets: newObj.__proto__ = boundFunction.prototype

  Calls boundFunction with this = newObj:
    isNewCall = newObj instanceof boundFunction → true
    args = [25]
    combinedArgs = ['Alice', 25]

    Calls: Person.apply(newObj, ['Alice', 25])

    Inside Person:
      this = newObj
      this.name = 'Alice'
      this.age = 25

    newObj is now { name: 'Alice', age: 25 }

Step 3: Result
─────────────────────────────────────────────────────────
  p = { name: 'Alice', age: 25 }
  p instanceof Person → true (prototype chain preserved)
  p instanceof BoundPerson → true
```

---

## 7️⃣ call vs apply vs bind

| Method | Invokes immediately? | Arguments format | Returns |
|--------|---------------------|------------------|---------|
| `call` | Yes | Comma separated | Function result |
| `apply` | Yes | Array | Function result |
| `bind` | No | Comma separated | New function |

```javascript
const obj = { x: 10 };

function add(a, b) {
  return this.x + a + b;
}

// call - immediate, separate args
add.call(obj, 1, 2);     // 13

// apply - immediate, array args
add.apply(obj, [1, 2]);  // 13

// bind - returns new function
const bound = add.bind(obj, 1);
bound(2);                // 13
```

### Memory Aid

```
call   → Comma separated, Calls immediately
apply  → Array of arguments, Applies immediately
bind   → Binds context, returns Bound function
```

---

## 8️⃣ Common Interview Questions

### Q1: Implement bind from scratch

**Answer:** See Section 4 for basic, Section 6 for production.

### Q2: What's the difference between call, apply, and bind?

**Answer:**
- `call`: Immediately invokes with comma-separated args
- `apply`: Immediately invokes with array of args
- `bind`: Returns new function, doesn't invoke

### Q3: Can you bind an already-bound function?

**Answer:** Yes, but only the first bound context applies:

```javascript
function log() {
  console.log(this.x);
}

const bound1 = log.bind({ x: 1 });
const bound2 = bound1.bind({ x: 2 });

bound2();  // 1 (first bind wins!)
```

### Q4: What happens when you use bind with arrow functions?

**Answer:** Arrow functions ignore `bind` because they don't have their own `this`:

```javascript
const arrow = () => console.log(this.x);
const bound = arrow.bind({ x: 10 });

bound();  // undefined (or window.x) - bind has no effect!
```

### Q5: How would you polyfill bind without using apply or call?

**Answer:**

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  const fn = this;

  return function(...args) {
    // Temporarily add function to context
    const key = Symbol('fn');
    context[key] = fn;

    // Call as method
    const result = context[key](...boundArgs, ...args);

    // Cleanup
    delete context[key];

    return result;
  };
};
```

### Q6: Why do we need to preserve the prototype?

**Answer:** For `instanceof` checks and prototype chain inheritance:

```javascript
function Foo() {}
const BoundFoo = Foo.myBind(null);

const instance = new BoundFoo();

// Without prototype preservation:
instance instanceof Foo;  // false (wrong!)

// With prototype preservation:
instance instanceof Foo;  // true (correct!)
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Forgetting `this` Check

```javascript
// ❌ BAD: Doesn't validate this is a function
Function.prototype.badBind = function(context) {
  const fn = this;  // Could be anything!
  return function() {
    return fn.apply(context);
  };
};

// Calling on non-function crashes later
const obj = {};
// obj.badBind({});  // Would fail when returned function is called

// ✅ GOOD: Validate this
Function.prototype.goodBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Must be called on a function');
  }
  // ...
};
```

### Pitfall 2: Not Handling `new` Calls

```javascript
// ❌ BAD: Ignores new calls
Function.prototype.badBind = function(context) {
  const fn = this;
  return function(...args) {
    return fn.apply(context, args);  // Always uses context
  };
};

function Person(name) { this.name = name; }
const BoundPerson = Person.badBind({ x: 1 });
const p = new BoundPerson('Alice');
console.log(p.name);  // undefined! (context was { x: 1 })

// ✅ GOOD: Check for new call
Function.prototype.goodBind = function(context) {
  const fn = this;
  function bound(...args) {
    return fn.apply(
      this instanceof bound ? this : context,
      args
    );
  }
  bound.prototype = Object.create(fn.prototype);
  return bound;
};
```

### Pitfall 3: Using Arrow Function for Return

```javascript
// ❌ BAD: Arrow function - can't use 'new', no 'this' binding check
Function.prototype.badBind = function(context) {
  const fn = this;
  return (...args) => fn.apply(context, args);
};

// Can't use with new:
const Bound = function Foo(){}.badBind(null);
// new Bound();  // TypeError: Bound is not a constructor

// ✅ GOOD: Use regular function
Function.prototype.goodBind = function(context) {
  const fn = this;
  return function(...args) {  // Regular function
    return fn.apply(context, args);
  };
};
```

### Pitfall 4: Not Preserving Prototype

```javascript
// ❌ BAD: Loses prototype chain
Function.prototype.badBind = function(context) {
  const fn = this;
  return function bound(...args) {
    return fn.apply(this instanceof bound ? this : context, args);
  };
  // Missing: bound.prototype = ...
};

// ✅ GOOD: Preserve prototype
Function.prototype.goodBind = function(context) {
  const fn = this;
  function bound(...args) {
    return fn.apply(this instanceof bound ? this : context, args);
  }
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
  }
  return bound;
};
```

---

## 🔟 Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **bind() call** | O(1) | Just creates a closure |
| **Space** | O(n) | Stores n bound arguments |
| **Bound function call** | O(1) | Same as original function call |

---

## Summary

| Concept | Description |
|---------|-------------|
| **bind()** | Creates new function with bound `this` |
| **Partial application** | Can preset arguments |
| **Returns** | New function (doesn't invoke) |
| **`new` behavior** | Bound `this` is ignored |
| **Key method** | `apply()` or `call()` internally |

### Key Takeaways

1. **Returns new function** — doesn't invoke immediately
2. **Handle `new` calls** — check `this instanceof boundFunction`
3. **Preserve prototype** — for proper `instanceof` behavior
4. **Combine arguments** — boundArgs come first
5. **Arrow functions ignore bind** — they have no `this`

---

## 📚 Further Reading

- [MDN: Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [JavaScript.info: Function binding](https://javascript.info/bind)
