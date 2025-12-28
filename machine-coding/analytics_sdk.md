---
date: 2025-05-06T06:50:41+05:30
description: Design and implement a lightweight analytics SDK with event tracking, batching, retry logic, and offline support for web applications.
premium: true
---

# 📊 Analytics SDK with Retry Logic

When building modern web apps, logging user behavior or system events reliably is essential. However, network conditions are unpredictable—so sending analytics events must be **delayed, serialized, and resilient to transient failures**.

Let's build an SDK that:

1. Queues events via `logEvent()`
2. Sends events  **one at a time** , every 1 second
3. Simulates failure every 5th event
4. Retries once on failure

---

### ✅ Desired Output:

```
Analytics sent event 1
Analytics sent event 2
...
-----------------------
Failed to send event 5
Retrying sending event 5
-----------------------
Analytics sent event 5
...
```

---

## ✅ Final Code

```javascript
class SDK {
  constructor() {
    this.queue = [];
    this.isSending = false;
    this.sendCount = 0;
  }

  // Enqueue an event for later processing
  logEvent(event) {
    this.queue.push(event);
    console.log(`Logged event: ${event}`);
    return this;
  }

  // Sleep utility for delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Attempt to send a single event, with retry on failure
  async sendEventWithRetry(event) {
    await this.sleep(1000); // Initial send delay
    if (this.sendCount % 5 === 0) {
      // Simulated failure
      console.log('-----------------------');
      console.log(`Failed to send ${event}`);
      console.log(`Retrying sending ${event}`);
      console.log('-----------------------');
      await this.sleep(1000); // Retry delay
    }
    console.log(`Analytics sent ${event}`);
  }

  // Process the queue serially
  async send() {
    if (this.isSending || this.queue.length === 0) return;
    this.isSending = true;

    while (this.queue.length > 0) {
      const event = this.queue.shift();
      this.sendCount++;
      await this.sendEventWithRetry(event);
    }

    this.isSending = false;
  }
}

// -------------------------
// 🧪 Usage Example
// -------------------------
const runExample = async () => {
  const sdk = new SDK();

  // Log 10 events
  for (let i = 1; i <= 10; i++) {
    sdk.logEvent(`event ${i}`);
  }

  // Start sending
  await sdk.send();
};

runExample();
```

---

## 🔍 How It Works

### 1. **Queueing**

Every call to `logEvent()` pushes the event into an internal array.

### 2. **Controlled Sending**

The `send()` method ensures:

* Only one sending loop runs at a time (`this.isSending`)
* Events are dequeued one-by-one (`this.queue.shift()`)
* Each event waits 1 second before sending

### 3. **Simulated Failures**

Every 5th event (`sendCount % 5 === 0`) fails, logs a failure, waits another second, and retries sending.

### 4. **Retry Guarantee**

The logic does not proceed to the next event until the current one (including its retry) completes.

---

## 🔧 Why This is Good Engineering

* **Reliable delivery** : Events are serialized and retried.
* **Robust simulation** : Failures are explicit and testable.
* **Reusable utilities** : `sleep()` is abstracted for clarity.
* **Separation of concerns** : Queue management, retry logic, and delay handling are well-isolated.

---

<!-- quiz-start -->
### Q1: Why is `this.isSending` used in the Analytics SDK?
- [ ] To track how many events have been sent
- [x] To prevent multiple sending loops from running concurrently
- [ ] To count the number of retries
- [ ] To store the current event being processed

### Q2: What happens when the 5th event fails to send in this SDK implementation?
- [ ] The event is discarded and the next event is processed
- [ ] The SDK stops processing all remaining events
- [x] The event is retried after a 1-second delay
- [ ] The event is moved to the end of the queue

### Q3: What does `this.queue.shift()` do in the send() method?
- [ ] Adds a new event to the beginning of the queue
- [ ] Returns the last event without removing it
- [x] Removes and returns the first event from the queue
- [ ] Clears the entire queue
<!-- quiz-end -->
