---
date: 2025-03-27T07:19:24+05:30
description: Efficiently merge two sorted arrays into one sorted array using a two-pointer approach with O(n+m) time complexity.
premium: true
---

# 🔀 Merge Two Sorted Arrays

Merging two sorted arrays is a fundamental algorithm used as a building block in merge sort and many other applications. This O(n + m) solution uses the two-pointer technique to efficiently combine arrays while maintaining sorted order.

---

## ✅ Implementation

```js
function mergeSortedArrays(arr1, arr2) {
  const merged = [];
  let i = 0, j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      merged.push(arr1[i++]);
    } else {
      merged.push(arr2[j++]);
    }
  }

  // Append remaining elements
  while (i < arr1.length) merged.push(arr1[i++]);
  while (j < arr2.length) merged.push(arr2[j++]);

  return merged;
}
```

---

### 🧪 Example

```js
mergeSortedArrays([1, 3, 5], [2, 4, 6]); 
// → [1, 2, 3, 4, 5, 6]
```

---

### ⏱️ Time Complexity

* `O(n + m)` — linear in total elements
* No sorting or mutation

---

## Merging K Sorted Arrays

For merging more than two arrays, we can use a min-heap approach for optimal performance.

---

## ✅ Problem

Given an array of sorted arrays, merge them into one fully sorted array efficiently.

---

## 🧠 Atom-of-Thoughts Approach

---

### **Atom 1: Use a Min-Heap to track the smallest current element from each array**

We need to efficiently get the smallest item across all arrays — a **min-heap** (priority queue) is perfect for this.

---

### **Atom 2: Initialize the heap with the first element of each array**

Each heap entry will track:

* `val`: the number
* `arrIdx`: which array it came from
* `elemIdx`: its position in that array

---

### **Atom 3: Repeatedly extract the smallest item, and push its next element into the heap**

This guarantees sorted order. Do this until the heap is empty.

---

### **Atom 4: Output the final merged array**

---

## ✅ Code (Readable)

```js
function mergeKSortedArrays(arrays) {
  const result = [];
  const minHeap = [];

  // Atom 2: Seed the heap with the first element of each array
  for (let arrIdx = 0; arrIdx < arrays.length; arrIdx++) {
    if (arrays[arrIdx].length > 0) {
      minHeap.push({
        val: arrays[arrIdx][0],
        arrIdx,
        elemIdx: 0
      });
    }
  }

  // Atom 1: Heapify by sorting (for simplicity, not efficient)
  minHeap.sort((a, b) => a.val - b.val);

  // Atom 3: Main loop
  while (minHeap.length > 0) {
    // Remove the smallest element
    const { val, arrIdx, elemIdx } = minHeap.shift();
    result.push(val);

    // Push the next element from the same array, if any
    const nextIdx = elemIdx + 1;
    if (nextIdx < arrays[arrIdx].length) {
      minHeap.push({
        val: arrays[arrIdx][nextIdx],
        arrIdx,
        elemIdx: nextIdx
      });
      // Maintain heap property
      minHeap.sort((a, b) => a.val - b.val);
    }
  }

  return result;
}
```

---

## 🧪 Example

```js
mergeKSortedArrays([
  [1, 4, 9],
  [2, 5, 8],
  [0, 6, 7]
]);

// → [0, 1, 2, 4, 5, 6, 7, 8, 9]
```

---

## 📈 Time Complexity

* Heap operations: `O(log k)`
* Total elements: `n`
* Overall: `O(n log k)`

> Can be optimized with a real heap (`MinPriorityQueue` or custom binary heap) instead of `.sort()`.

---


Let's do a **step-by-step dry run** of `mergeKSortedArrays` using this example:

---

### 📥 Input:

```js
const arrays = [
  [1, 4, 9],
  [2, 5, 8],
  [0, 6, 7]
];
```

Goal: Merge into one sorted array.

---

## 🧠 Atom-of-Thought Dry Run

---

### 🔹 **Step 1: Initialize Heap with First Elements**

We push the first element of each array into the heap:

```js
minHeap = [
  { val: 1, arrIdx: 0, elemIdx: 0 },
  { val: 2, arrIdx: 1, elemIdx: 0 },
  { val: 0, arrIdx: 2, elemIdx: 0 }
]
```

Then we sort it:

```js
minHeap = [
  { val: 0, arrIdx: 2, elemIdx: 0 },
  { val: 1, arrIdx: 0, elemIdx: 0 },
  { val: 2, arrIdx: 1, elemIdx: 0 }
]
```

---

### 🔁 **Loop Begins**

#### 🌀 Iteration 1:

* Pop `0` → `result = [0]`
* Next from array 2 is `6`
* Push `{ val: 6, arrIdx: 2, elemIdx: 1 }`
* Heap: `[1, 2, 6]` → after sort:

```js
minHeap = [
  { val: 1, arrIdx: 0, elemIdx: 0 },
  { val: 2, arrIdx: 1, elemIdx: 0 },
  { val: 6, arrIdx: 2, elemIdx: 1 }
]
```

#### 🌀 Iteration 2:

* Pop `1` → `result = [0, 1]`
* Next from array 0 is `4`
* Push `{ val: 4, arrIdx: 0, elemIdx: 1 }`
* Heap: `[2, 6, 4]` → sort:

```js
minHeap = [
  { val: 2, arrIdx: 1, elemIdx: 0 },
  { val: 4, arrIdx: 0, elemIdx: 1 },
  { val: 6, arrIdx: 2, elemIdx: 1 }
]
```

#### 🌀 Iteration 3:

* Pop `2` → `result = [0, 1, 2]`
* Next from array 1 is `5`
* Push `{ val: 5, arrIdx: 1, elemIdx: 1 }`
* Heap: `[4, 6, 5]` → sort:

```js
minHeap = [
  { val: 4, arrIdx: 0, elemIdx: 1 },
  { val: 5, arrIdx: 1, elemIdx: 1 },
  { val: 6, arrIdx: 2, elemIdx: 1 }
]
```

#### 🌀 Iteration 4:

* Pop `4` → `result = [0, 1, 2, 4]`
* Next from array 0 is `9`
* Push `{ val: 9, arrIdx: 0, elemIdx: 2 }`
* Heap: `[5, 6, 9]` → sort:

```js
minHeap = [
  { val: 5, arrIdx: 1, elemIdx: 1 },
  { val: 6, arrIdx: 2, elemIdx: 1 },
  { val: 9, arrIdx: 0, elemIdx: 2 }
]
```

#### 🌀 Iteration 5:

* Pop `5` → `result = [0, 1, 2, 4, 5]`
* Next from array 1 is `8`
* Push `{ val: 8, arrIdx: 1, elemIdx: 2 }`
* Heap: `[6, 9, 8]` → sort:

```js
minHeap = [
  { val: 6, arrIdx: 2, elemIdx: 1 },
  { val: 8, arrIdx: 1, elemIdx: 2 },
  { val: 9, arrIdx: 0, elemIdx: 2 }
]
```

#### 🌀 Iteration 6:

* Pop `6` → `result = [0, 1, 2, 4, 5, 6]`
* Next from array 2 is `7`
* Push `{ val: 7, arrIdx: 2, elemIdx: 2 }`
* Heap: `[8, 9, 7]` → sort:

```js
minHeap = [
  { val: 7, arrIdx: 2, elemIdx: 2 },
  { val: 8, arrIdx: 1, elemIdx: 2 },
  { val: 9, arrIdx: 0, elemIdx: 2 }
]
```

#### 🌀 Iteration 7:

* Pop `7` → `result = [0, 1, 2, 4, 5, 6, 7]`
* No next in array 2

#### 🌀 Iteration 8:

* Pop `8` → `result = [0, 1, 2, 4, 5, 6, 7, 8]`
* No next in array 1

#### 🌀 Iteration 9:

* Pop `9` → `result = [0, 1, 2, 4, 5, 6, 7, 8, 9]`
* No next in array 0

---

### ✅ Final Output:

```js
[0, 1, 2, 4, 5, 6, 7, 8, 9]
```

---
