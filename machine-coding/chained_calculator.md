---
date: 2025-03-20T09:40:40+05:30
description: Create a chainable calculator API that supports method chaining for arithmetic operations with a fluent interface pattern.
premium: true
---

# 🔢 Chained Calculator Implementation

Here's an implementation of a **Chain Calculator** in JavaScript. This calculator allows chaining operations like addition, subtraction, multiplication, and division in a fluent and readable way.

---

## ✅ Implementation

```javascript
class ChainCalculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  add(number) {
    this.value += number;
    return this; // Return `this` to enable chaining
  }

  subtract(number) {
    this.value -= number;
    return this;
  }

  multiply(number) {
    this.value *= number;
    return this;
  }

  divide(number) {
    if (number === 0) {
      throw new Error("Division by zero is not allowed.");
    }
    this.value /= number;
    return this;
  }

  getResult() {
    return this.value;
  }

  reset() {
    this.value = 0;
    return this;
  }
}

// Example usage:
const calculator = new ChainCalculator(10);

const result = calculator
  .add(5)     // 10 + 5 = 15
  .subtract(3) // 15 - 3 = 12
  .multiply(4) // 12 * 4 = 48
  .divide(2)   // 48 / 2 = 24
  .getResult();

console.log(result); // Output: 24
```

### Explanation

1. **Constructor** :

* Takes an initial value (default is `0`).

1. **Methods** :

* `add(number)`: Adds the given number to the current value.
* `subtract(number)`: Subtracts the given number from the current value.
* `multiply(number)`: Multiplies the current value by the given number.
* `divide(number)`: Divides the current value by the given number, with a check to prevent division by zero.
* `getResult()`: Returns the current value.
* `reset()`: Resets the value to `0` (or any initial value).

1. **Chaining** :

* Each method returns the instance (`this`), enabling method chaining.

### Try It

You can use this pattern to build more complex calculators by adding operations or features like exponentiation, modulus, or even memory storage.

[Runkit link](https://runkit.com/codertushar/chain-calculator)

---

<!-- quiz-start -->
### Q1: What enables method chaining in the ChainCalculator class?
- [ ] Using arrow functions for all methods
- [ ] Storing values in an array
- [x] Returning `this` from each operation method
- [ ] Using the constructor to initialize methods

### Q2: What is the output of: `new ChainCalculator(10).add(5).multiply(2).getResult()`?
- [ ] 25
- [x] 30
- [ ] 20
- [ ] 35

### Q3: What happens when you call `divide(0)` on the ChainCalculator?
- [ ] Returns Infinity
- [ ] Returns 0
- [ ] Returns NaN
- [x] Throws an Error with message "Division by zero is not allowed."
<!-- quiz-end -->
