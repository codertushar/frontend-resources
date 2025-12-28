---
date: 2025-03-15T00:35:56+05:30
description: Curried sum function enabling chained calls like sum(1)(2)(3). Demonstrates closures, internal state, and valueOf/toString methods.
premium: false
---

# ➕ Chained Sum (Curried Function)

Here are two different implementations of a **curried sum** function, one using **state within the function** and the other using **recursion**.

---

## ✅ Currying with Internal State

```javascript
function sum(a) {
  // Create a new function that maintains its own state
  function innerSum(b) {
    // Track the running total as a property of the function itself
    if (b === undefined) {
      return innerSum.total;
    }

    // Add the new value to our running total
    innerSum.total += b;

    // Return this function again to allow for chaining
    return innerSum;
  }

  // Initialize the total
  innerSum.total = a;

  // Add a valueOf method to make the function evaluate to the total when used in comparisons
  innerSum.valueOf = function() {
    return innerSum.total;
  };

  // Add a toString method to make the function convert to the total when used as a string
  innerSum.toString = function() {
    return innerSum.total.toString();
  };

  return innerSum;
}

// Test cases
const sum1 = sum(1);
console.log(sum1(2) == 3);  // true
console.log(sum1(3) == 6);  // true
console.log(sum(1)(2)(3) == 6);  // true
console.log(sum(5)(-1)(2) == 6);  // true
```

### Explanation:

* **Internal state tracking** : The `innerSum.total` property is used to store the running total.
* **Chaining** : The function returns itself (`innerSum`) to allow for chaining additional calls.
* **`valueOf` and `toString`** : These methods are added to ensure that the function behaves like a number in comparisons and string conversions.

### 2.  **Currying with Recursion** :

```javascript
function sum(a) {
  // Base case value
  const currentSum = a;

  // Return a new function that will handle the next value
  function nextSum(b) {
    // When called with a new value, create a new sum starting
    // with the current accumulated value plus the new value
    return sum(currentSum + b);
  }

  // Add valueOf to allow for comparison with primitives
  nextSum.valueOf = function() {
    return currentSum;
  };

  // Add toString for string conversions
  nextSum.toString = function() {
    return currentSum.toString();
  };

  return nextSum;
}

// Test cases
const sum1 = sum(1);
console.log(sum1(2) == 3);  // true
console.log(sum1(3) == 4);  // true
console.log(sum(1)(2)(3) == 6);  // true
console.log(sum(5)(-1)(2) == 6);  // true
```

### Explanation:

* **Recursion** : The function calls itself (`sum(currentSum + b)`) to accumulate the sum as more values are provided.
* **Base case** : The base case for the sum is the initial value passed to the function.
* **`valueOf` and `toString`** : These methods are used to convert the recursive function to a primitive value for comparisons and string conversions.

### Key Differences:

1. **State Management** :

* The first implementation uses **internal state** (`innerSum.total`) to track the running total.
* The second implementation uses **recursion** to accumulate the sum by calling `sum(currentSum + b)`.

1. **Performance** :

* The first implementation is more straightforward and has a stateful function that can be chained directly.
* The second implementation, using recursion, creates new function instances on each call, which might have slight overhead in deep recursion cases.

Both implementations allow you to chain function calls to accumulate the sum, with the key distinction being whether you manage state via a variable (`total`) or via recursive function calls.

---

<!-- quiz-start -->
### Q1: Why is the `valueOf` method added to the inner function in a chained sum implementation?
- [ ] To allow the function to be called with multiple arguments
- [x] To make the function evaluate to a number when used in comparisons
- [ ] To prevent memory leaks in the closure
- [ ] To enable recursion in the function

### Q2: What is the key difference between the state-based and recursive implementations of chained sum?
- [ ] Only the recursive version supports chaining
- [ ] The state-based version is always faster
- [x] State-based uses a property to track total, recursive creates new function instances
- [ ] Only the state-based version can handle negative numbers

### Q3: What would `sum(1)(2)(3) == 6` return if `valueOf` was not implemented?
- [ ] true
- [x] false
- [ ] It would throw an error
- [ ] undefined
<!-- quiz-end -->
