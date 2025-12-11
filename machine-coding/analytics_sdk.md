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
