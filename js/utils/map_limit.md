# 🔄 mapLimit: Controlled Concurrency in JavaScript

When processing large datasets in JavaScript, we often need to perform asynchronous operations on multiple items. However, launching all operations simultaneously can overwhelm system resources or hit API rate limits. This is where the `mapLimit` function becomes invaluable.

## What is mapLimit?

`mapLimit` is a concurrency control pattern that applies an asynchronous function to an array of items while limiting how many operations run in parallel. It maintains the order of results to match the input array, regardless of when each operation completes.

## Key Concepts

### 1. Concurrency Control

Concurrency refers to multiple operations running simultaneously. With `mapLimit`, we specify exactly how many operations can run at once - not too many (overwhelming resources) and not too few (inefficient processing).

### 2. Promise Management

JavaScript promises are the foundation of this pattern. We track:

* Active operations count
* Pending operations queue
* Results array (preserving original order)

### 3. Queue Processing

As operations complete, new ones begin until all items are processed. This creates a continuous flow without exceeding the concurrency limit.

## Implementation Breakdown

```javascript
async function mapLimit(items, limit, fn) {
  const promises = [];        // Track all generated promises
  const results = Array(items.length); // Pre-allocate results array
  let activeCount = 0;        // Track active operations
  let index = 0;              // Next item to process

  const processNext = async () => {
    const currentIndex = index++;
  
    if (currentIndex >= items.length) {
      return; // No more items to process
    }

    activeCount++;
  
    try {
      // Process item and store result at original position
      results[currentIndex] = await fn(items[currentIndex], currentIndex, items);
    } catch (error) {
      // Preserve errors in results array
      results[currentIndex] = Promise.reject(error);
    } finally {
      activeCount--;
      promises.push(processNext()); // Process next item when this one finishes
    }
  };

  // Initialize with batch of promises up to the limit
  while (activeCount < limit && index < items.length) {
    promises.push(processNext());
  }

  // Wait for all processing to complete
  await Promise.all(promises);
  
  return results;
}
```

## Mental Model: Restaurant Tables

Imagine a restaurant with a limited number of tables:

1. **Tables = Concurrency Limit** : You have a fixed number of tables (limit parameter)
2. **Customers = Array Items** : Customers are waiting to be served (items array)
3. **Dining = Processing Function** : Each customer sits, orders, eats, and leaves (async function)
4. **Host = processNext()** : The host seats new customers as tables become available
5. **Receipt Order = Results Array** : Final receipts are organized by arrival order, not departure time

## Common Use Cases

* API requests with rate limits
* Database operations with connection pools
* File system operations with I/O constraints
* CPU-intensive calculations on large datasets

## Implementation Tips to Remember

1. **Pre-allocate the results array** to maintain original order
2. **Track active count** to know when to start new operations
3. **Use a recursive function** (`processNext`) to handle the queue
4. **Handle errors** within the processing loop
5. **Use Promise.all** to wait for all operations to complete

## Example Usage

```javascript
// Fetch data for multiple users with controlled concurrency
async function fetchUserData(userIds) {
  return mapLimit(userIds, 5, async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
}

// Process large file uploads with limited concurrency
async function uploadFiles(files) {
  return mapLimit(files, 3, async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    return response.json();
  });
}
```

## Advantages Over Other Approaches

* **More efficient than sequential processing** (Promise.all would wait for all promises to start)
* **More controlled than Promise.all** (which launches all promises immediately)
* **Simpler than manual promise chaining**
* **Preserves order** unlike race conditions in uncontrolled parallel execution

By mastering `mapLimit`, you gain a powerful tool for handling asynchronous operations efficiently while respecting system constraints.
