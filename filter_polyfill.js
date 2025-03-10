Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
    }

    let result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (this.hasOwnProperty(i)) { // Ensures only actual elements are processed
            if (callback.call(thisArg, this[i], i, this)) {
                result.push(this[i]);
            }
        }
    }

    return result;
};

// Example Usage:
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.myFilter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]

----------------
Key Features of This Polyfill

1. Prototype Extension: Adds myFilter to Array.prototype, making it available for all arrays.


2. Callback Execution: Calls the provided function with (element, index, array).


3. Handles thisArg: Allows binding a custom this context.


4. Uses hasOwnProperty(i): Ensures only actual array elements are processed, ignoring prototype properties or sparse array holes.


5. Type Checking: Throws a TypeError if the callback is not a function.
