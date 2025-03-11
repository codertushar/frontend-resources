Function.prototype.myBind = function(context, ...boundArgs) {
    if (typeof this !== "function") {
        throw new TypeError("myBind must be called on a function");
    }

    const originalFunction = this;

    return function(...args) {
        return originalFunction.apply(context, [...boundArgs, ...args]);
    };
};

// Example Usage:
const person = {
    name: "Alice",
    greet: function(greeting, punctuation) {
        return `${greeting}, ${this.name}${punctuation}`;
    }
};

// Directly calling the bound function:
console.log(person.greet.myBind(person, "Hello")("!")); // Output: "Hello, Alice!"

_________________________
Why Are boundArgs and args Different in bind()?

In our myBind function:

Function.prototype.myBind = function(context, ...boundArgs) {
    if (typeof this !== "function") {
        throw new TypeError("myBind must be called on a function");
    }

    const originalFunction = this;

    return function(...args) {
        return originalFunction.apply(context, [...boundArgs, ...args]);
    };
};

boundArgs: These are the arguments provided at the time of binding.

args: These are the arguments provided when the bound function is later called.


How They Work Together

boundArgs are preset when calling myBind().

args are provided dynamically when the bound function is invoked.

We merge them ([...boundArgs, ...args]) to pass both sets of arguments to the original function.



---

Example to Differentiate boundArgs and args

function add(a, b, c) {
    return a + b + c;
}

// Partially applying `2` as `boundArgs`
const addTwo = add.myBind(null, 2);

// Now calling with the remaining arguments (`args`)
console.log(addTwo(3, 4)); // 2 + 3 + 4 = 9

Here’s what happens:

1. myBind(null, 2) sets boundArgs = [2].


2. Later, when calling addTwo(3, 4), args = [3, 4].


3. The final call becomes add(2, 3, 4), which correctly returns 9.




---

Why Not Just Use One?

If we used only boundArgs, the function wouldn’t accept extra arguments when invoked later. If we used only args, we wouldn’t be able to preset arguments at binding.

Thus, boundArgs and args serve different purposes, but they work together to mimic the native bind() behavior.

