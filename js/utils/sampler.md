# Sampling Function in JavaScript: Execute Once Every N Calls

In modern JavaScript development, controlling when and how often a function executes is critical for performance optimization and behavior control. Among techniques like throttling and debouncing, **sampling** offers a unique mechanism: **execute a function once for every *N* calls**.

## What Is a Sampling Function?

A **sampling function** ensures that a given function runs only **once after every fixed number of calls**, say every 4th call. This is particularly useful in scenarios like:

* Rate-limiting logs in noisy systems.
* Sampling user interactions for telemetry.
* Reducing computational overhead in frequently triggered UI events.

Unlike **throttling** (which limits function execution by time) or **debouncing** (which delays execution until quiet time), **sampling is count-based**.

## Code Example

Here's a JavaScript implementation of a `sampler` function:

```javascript
function sampler(fn, count) {
  let callCount = 0;

  return function(...args) {
    callCount++;
    if (callCount % count === 0) {
      fn.apply(this, args);
    }
  };
}
```

### Usage:

```javascript
function message() {
  console.log("hello");
}

const sample = sampler(message, 4);

sample(); // no output
sample(); // no output
sample(); // no output
sample(); // logs "hello"
sample(); // no output
sample(); // no output
sample(); // no output
sample(); // logs "hello"
```

## How It Works

Internally, `sampler`:

* Tracks how many times the returned function has been called (`callCount`).
* Executes the original function only when `callCount` is divisible evenly by the given count (`callCount % count === 0`).

It uses closures to maintain internal state across invocations — an elegant and idiomatic pattern in JavaScript.

## Use Cases

* **Sampling analytics events** in high-frequency environments.
* **Noise reduction** in event-driven systems (e.g., mouse movement, scroll).
* **Debug logging** only every *N* times to avoid console spam.

## Throttling vs Sampling

| Feature          | Throttling           | Sampling                        |
| ---------------- | -------------------- | ------------------------------- |
| Basis            | Time-based           | Call-count-based                |
| When used        | Limit execution rate | Trigger function every Nth time |
| Example use case | Scroll throttling    | Log sampling                    |

## Edge Considerations

* Sampling is deterministic — e.g., 4th, 8th, 12th call — unlike time-based throttles which may vary depending on delays.
* It does not delay execution; it **suppresses** it until the condition is met.
* State is local to the returned function. Multiple samplers with the same source function have independent counters.

## Final Thoughts

Sampling is a subtle but powerful tool when you need deterministic execution control based on **call frequency**. It’s particularly valuable in analytics-heavy or high-frequency event environments, where precision and control outweigh sheer throughput.
