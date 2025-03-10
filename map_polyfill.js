Array.prototype.myMap = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }

    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (this.hasOwnProperty(i)) {  // Ensures it doesn't iterate over inherited properties
            result.push(callback.call(thisArg, this[i], i, this));
        }
    }
    return result;
};

// Example Usage:
const numbers = [1, 2, 3, 4];
const squared = numbers.myMap(num => num * num);
console.log(squared); // [1, 4, 9, 16]

----------------------------------------
3. Handles thisArg (Binding this Context)

The map function in JavaScript allows passing an optional thisArg parameter. This determines the value of this inside the callback function. If provided, the callback function is executed with thisArg as its context.

How thisArg Works in Array.prototype.map()

If thisArg is provided, callback is executed with thisArg as its this value.

If thisArg is not provided, this inside callback behaves normally (i.e., depends on how the function is called).


Implementation in the Polyfill

callback.call(thisArg, this[i], i, this);

call() explicitly sets the this value when invoking callback.

If thisArg is undefined, call() executes the function normally.


Example: Using thisArg

const obj = {
    multiplier: 10
};

const numbers = [1, 2, 3];

const result = numbers.myMap(function(num) {
    return num * this.multiplier;
}, obj);

console.log(result); // [10, 20, 30]

Here, this inside the callback refers to obj, so num * this.multiplier works as expected.



---

4. Checks hasOwnProperty() to Avoid Inherited Properties

JavaScript arrays can have custom properties added manually, and for...in loops (or direct iteration over Array.prototype) might include these inherited properties.

Why hasOwnProperty() Matters

Without hasOwnProperty(), the loop could accidentally process properties that were added to the array prototype or an array instance.

Example: Issue Without hasOwnProperty()

Array.prototype.extra = "I'm inherited";

const arr = [1, 2, 3];

const result = arr.myMap(num => num * 2);
console.log(result); // Without `hasOwnProperty()`, it would process "extra" too

If we don't check hasOwnProperty(i), "extra" could be passed to the callback, causing unexpected behavior.

Implementation in the Polyfill

if (this.hasOwnProperty(i)) {  
    result.push(callback.call(thisArg, this[i], i, this));
}

This ensures only the array's own properties (numeric indices) are processed.

It prevents inherited properties from affecting the result.



---

Summary

thisArg Handling: Ensures the callback can use a custom this context.

hasOwnProperty() Check: Prevents iterating over prototype-inherited properties, ensuring only actual array elements are processed.


Both of these details help the polyfill behave exactly like the native Array.prototype.map() function.

