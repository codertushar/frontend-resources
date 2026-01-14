---
date: 2026-01-14T05:10:29+05:30
description: Complete 8-week DSA roadmap for working professionals targeting FAANG-level interviews - 45-60 minutes daily with high pattern repetition and spaced learning.
premium: false
---

# 🎯 2-Month DSA Plan for Working Professionals: FAANG Interview Preparation

> **Interview Importance:** 🔴 Critical — A structured 8-week plan designed for full-time professionals to achieve FAANG-level Medium problem confidence with just 45-60 minutes daily commitment.

This comprehensive guide is specifically designed for working professionals who:
- Work **full-time** and can dedicate **45-60 minutes on weekdays** and **2-3 hours on weekends**
- Want to target **FAANG or top-tier company** interviews
- Need a **structured, proven roadmap** with high pattern repetition
- Aim to solve **~90 curated problems** in 8 weeks with spaced repetition

---

## 📋 Table of Contents

1. [Plan Overview](#1️⃣-plan-overview)
2. [Core Principles & Rules](#2️⃣-core-principles--rules-non-negotiable)
3. [Week-by-Week Breakdown](#3️⃣-week-by-week-breakdown)
4. [Daily Structure](#4️⃣-daily-structure-45-60-min)
5. [Progress Checkpoints](#5️⃣-progress-checkpoints)
6. [Pattern Recognition Framework](#6️⃣-pattern-recognition-framework)
7. [Common Interview Questions](#7️⃣-common-interview-questions)
8. [Common Pitfalls](#8️⃣-common-pitfalls-to-avoid)
9. [Time & Space Complexity Guide](#9️⃣-time--space-complexity-guide)
10. [Summary](#-summary)

---

## 1️⃣ Plan Overview

### Target Goal

```
Timeline:  8 weeks (2 months)
Target:    FAANG-level Medium confidence
Volume:    ~90 problems (curated, not random)
Time:      45-60 mins/day (Mon-Fri) + 2-3 hrs (Sat/Sun)
Focus:     High pattern repetition + spaced learning
Success:   Solve 2 mediums in 75 minutes reliably
```

### Why This Plan Works

| **Aspect** | **Traditional Approach** | **This Plan** |
|-----------|-------------------------|---------------|
| **Problem Selection** | Random 500+ problems | 90 curated with pattern focus |
| **Time Investment** | 3-4 hours daily | 45-60 mins weekdays, realistic for working professionals |
| **Learning Method** | One-time solve | Spaced repetition (2 days + 7 days) |
| **Pattern Coverage** | Scattered | 8 core patterns mastered deeply |
| **Progress Tracking** | None | Weekly checkpoints with clear metrics |

**Real-World Analogy:**

Think of this like learning a musical instrument. You don't become a pianist by playing 500 different songs once. You master 20-30 pieces through deliberate practice, repetition, and pattern recognition. Similarly, these 90 problems teach you the 8 patterns that cover 80% of interview questions.

---

## 2️⃣ Core Principles & Rules (Non-Negotiable)

### Rule 1: No Problem Hopping

```
Time Investment Per Problem:
┌─────────────────────────────────────────────┐
│ 25-35 min: Genuine attempt (even if stuck) │
│ 10-15 min: Study solution + understand     │
│ 20-30 min: Re-solve without help          │
└─────────────────────────────────────────────┘
Total: ~60 minutes per problem
```

**Why this matters:** 
- Struggling builds problem-solving muscles
- Quick solution reading creates false confidence
- Re-solving cements the pattern

### Rule 2: Document Everything (2 Things Per Problem)

For every problem solved, write:

**1. Pattern + Invariant (2 lines max)**
```javascript
// Example: Two Sum
Pattern: HashMap for O(1) lookup
Invariant: complement = target - current always exists in map when solution exists
```

**2. Time + Space Complexity**
```javascript
// Time: O(n) - single pass through array
// Space: O(n) - hashmap stores up to n elements
```

### Rule 3: Spaced Repetition

```
Day 1:  Solve problem for first time
Day 3:  Re-solve (2-day gap) ← Critical!
Day 8:  Re-solve (7-day gap) ← Mastery!
```

**Why this matters:**
- Forgetting and re-learning strengthens neural pathways
- Prevents "I've seen this before but can't solve it" syndrome
- Builds true pattern recognition

---

## 3️⃣ Week-by-Week Breakdown

### Week 1: Arrays + Two Pointers (Foundation)

**🎯 Goal:** Stop feeling "blank" when seeing array problems

**📊 Problem Distribution:** 12 problems (8 Easy, 4 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| 1 | Move Zeroes | Easy | Two Pointers | In-place swap |
| 2 | Remove Element | Easy | Two Pointers | Array modification |
| 3 | Squares of a Sorted Array | Easy | Two Pointers | Merge from ends |
| 4 | Two Sum | Easy | HashMap | O(1) lookup |
| 5 | Best Time to Buy and Sell Stock | Easy | Single Pass | Track minimum |
| 6 | Valid Palindrome | Easy | Two Pointers | Convergence |
| 7 | Reverse String | Easy | Two Pointers | In-place |
| 8 | Merge Sorted Array | Easy | Two Pointers | Backwards merge |
| 9 | Remove Duplicates from Sorted Array | Easy | Two Pointers | Slow-fast |
| 10 | Container With Most Water | Medium | Two Pointers | Greedy choice |
| 11 | Trapping Rain Water | Medium | Two Pointers | Left-right max |
| 12 | 3Sum | Medium | Two Pointers | Sorted + dedup |

**Weekend Tasks:**
```
✓ Re-solve: Move Zeroes, Remove Element, Container With Most Water
✓ Create your "Two Pointers Template"
✓ Write down: "When do I use two pointers?"
```

**Two Pointers Template:**
```javascript
// Pattern 1: Opposite Direction (Converging)
const twoPointerConverge = (arr) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    // Process arr[left] and arr[right]
    // Move pointers based on condition
    if (condition) left++;
    else right--;
  }
};

// Pattern 2: Same Direction (Fast-Slow)
const twoPointerSameDir = (arr) => {
  let slow = 0;
  
  for (let fast = 0; fast < arr.length; fast++) {
    if (shouldKeep(arr[fast])) {
      arr[slow] = arr[fast];
      slow++;
    }
  }
  
  return slow; // New length
};
```

---

### Week 2: Sliding Window + Hashing

**🎯 Goal:** Build "window thinking" automatically

**📊 Problem Distribution:** 12 problems (4 Easy, 8 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| 1 | Longest Substring Without Repeating Characters | Medium | Sliding Window | Expanding + shrinking |
| 2 | Minimum Size Subarray Sum | Medium | Sliding Window | Variable size |
| 3 | Max Consecutive Ones III | Medium | Sliding Window | At most K |
| 4 | Permutation in String | Medium | Sliding Window | Fixed size + freq |
| 5 | Find All Anagrams in a String | Medium | Sliding Window | Fixed window |
| 6 | Fruits Into Baskets | Medium | Sliding Window | At most 2 types |
| 7 | Subarray Sum Equals K | Medium | Prefix Sum + HashMap | Sum - target |
| 8 | Contains Duplicate | Easy | HashMap | Single pass |
| 9 | Group Anagrams | Medium | HashMap | Sorted key |
| 10 | Top K Frequent Elements | Medium | HashMap + Bucket | Frequency count |
| 11 | Valid Anagram | Easy | HashMap | Character count |
| 12 | Product of Array Except Self | Medium | Prefix/Suffix | O(1) space trick |

**Weekend Tasks:**
```
✓ Re-solve: Longest Substring (#1), Permutation in String (#4), Subarray Sum (#7)
✓ Create "Sliding Window Checklist"
✓ Write down: "Fixed vs Variable window - when to use?"
```

**Sliding Window Checklist:**
```javascript
// Variable-size window template
const slidingWindowVariable = (arr, target) => {
  let left = 0;
  let windowSum = 0;
  let result = 0;
  
  for (let right = 0; right < arr.length; right++) {
    // 1. Expand window (add arr[right])
    windowSum += arr[right];
    
    // 2. Shrink window while condition invalid
    while (windowSum > target) {
      windowSum -= arr[left];
      left++;
    }
    
    // 3. Update result
    result = Math.max(result, right - left + 1);
  }
  
  return result;
};

// Fixed-size window template
const slidingWindowFixed = (arr, k) => {
  let windowSum = 0;
  
  // Initialize first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  
  let maxSum = windowSum;
  
  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Add new, remove old
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
};
```

---

### Week 3: Stack + Monotonic Stack

**🎯 Goal:** Handle "next greater/smaller" questions instinctively

**📊 Problem Distribution:** 10 problems (3 Easy, 7 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| 1 | Valid Parentheses | Easy | Stack | Matching pairs |
| 2 | Min Stack | Easy | Stack | O(1) min tracking |
| 3 | Daily Temperatures | Medium | Monotonic Stack | Next greater |
| 4 | Next Greater Element I | Easy | Monotonic Stack | Decreasing stack |
| 5 | Next Greater Element II | Medium | Monotonic Stack | Circular array |
| 6 | Evaluate Reverse Polish Notation | Medium | Stack | Operator eval |
| 7 | Largest Rectangle in Histogram | Hard | Monotonic Stack | Area calculation |
| 8 | Trapping Rain Water (Stack) | Medium | Monotonic Stack | Alternative approach |
| 9 | Simplify Path | Medium | Stack | Path parsing |
| 10 | Remove All Adjacent Duplicates II | Medium | Stack | K duplicates |

**Weekend Tasks:**
```
✓ Re-solve: Daily Temperatures, Largest Rectangle (understand, don't memorize)
✓ Write: "When to use stack? When to use monotonic stack?"
```

**Monotonic Stack Pattern:**
```javascript
// Next Greater Element (Decreasing Stack)
const nextGreaterElement = (arr) => {
  const result = new Array(arr.length).fill(-1);
  const stack = []; // Store indices
  
  for (let i = 0; i < arr.length; i++) {
    // While current is greater than stack top
    while (stack.length > 0 && arr[i] > arr[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = arr[i]; // Found next greater for idx
    }
    stack.push(i);
  }
  
  return result;
};

// Pattern Recognition:
// "next greater" → decreasing stack
// "next smaller" → increasing stack
```

---

### Week 4: Binary Search (Template Mastery)

**🎯 Goal:** Binary search should feel like a tool, not fear

**📊 Problem Distribution:** 11 problems (5 Easy, 6 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| 1 | Binary Search | Easy | Binary Search | Basic template |
| 2 | Search Insert Position | Easy | Binary Search | Find insertion |
| 3 | Find First and Last Position | Medium | Binary Search | Lower/upper bound |
| 4 | Search in Rotated Sorted Array | Medium | Binary Search | Pivot detection |
| 5 | Find Minimum in Rotated Array | Medium | Binary Search | Modified condition |
| 6 | Peak Index in a Mountain Array | Easy | Binary Search | Peak finding |
| 7 | Koko Eating Bananas | Medium | Answer Binary Search | Min feasible |
| 8 | Capacity To Ship Packages | Medium | Answer Binary Search | Min capacity |
| 9 | Median of Two Sorted Arrays | Hard | Binary Search | Partition (optional) |
| 10 | Square Root (Integer) | Easy | Binary Search | Answer search |
| 11 | Search a 2D Matrix | Medium | Binary Search | Treat as 1D |

**Weekend Tasks:**
```
✓ Create 2 templates:
  1. "Find exact element" template
  2. "Min feasible / Max feasible" (answer binary search) template
✓ Re-solve: Koko Eating Bananas, Capacity To Ship Packages
```

**Binary Search Templates:**
```javascript
// Template 1: Find Exact Element
const binarySearchExact = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1; // Not found
};

// Template 2: Answer Binary Search (Min Feasible)
const answerBinarySearch = (arr, condition) => {
  let left = minPossible;
  let right = maxPossible;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (isFeasible(mid)) {
      result = mid; // Record feasible answer
      right = mid - 1; // Try to find smaller
    } else {
      left = mid + 1; // Need larger value
    }
  }
  
  return result;
};

// Pattern: "minimum days/speed/capacity" → Answer Binary Search
```

---

### Week 5: Linked List + Fast/Slow Pointers

**🎯 Goal:** Stop making pointer mistakes

**📊 Problem Distribution:** 10 problems (6 Easy, 4 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| 1 | Reverse Linked List | Easy | Pointer Manipulation | 3-pointer reversal |
| 2 | Merge Two Sorted Lists | Easy | Two Pointers | Dummy node |
| 3 | Linked List Cycle | Easy | Fast/Slow Pointer | Floyd's cycle |
| 4 | Middle of the Linked List | Easy | Fast/Slow Pointer | Speed difference |
| 5 | Remove Nth Node From End | Medium | Two Pointers | N-step gap |
| 6 | Reorder List | Medium | Multiple Patterns | Find mid + reverse + merge |
| 7 | Intersection of Two Lists | Easy | Two Pointers | Length difference |
| 8 | Add Two Numbers | Medium | Linked List | Carry handling |
| 9 | Palindrome Linked List | Easy | Fast/Slow + Reverse | O(1) space |
| 10 | Copy List with Random Pointer | Medium | HashMap | Deep copy (optional) |

**Weekend Tasks:**
```
✓ Re-solve: Reverse LL, Remove Nth Node, Reorder List
✓ Master: "Why dummy node?" and "When fast/slow?"
```

**Linked List Patterns:**
```javascript
// Pattern 1: Reverse Linked List
const reverseList = (head) => {
  let prev = null;
  let curr = head;
  
  while (curr) {
    const next = curr.next; // Save next
    curr.next = prev;       // Reverse pointer
    prev = curr;            // Move prev
    curr = next;            // Move curr
  }
  
  return prev; // New head
};

// Pattern 2: Fast/Slow Pointer (Find Middle)
const findMiddle = (head) => {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;       // Move 1 step
    fast = fast.next.next;  // Move 2 steps
  }
  
  return slow; // Middle node
};

// Pattern 3: Dummy Node (Avoid Edge Cases)
const mergeLists = (l1, l2) => {
  const dummy = new ListNode(0);
  let curr = dummy;
  
  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  
  curr.next = l1 || l2;
  return dummy.next; // Skip dummy
};
```

---

### Week 6: Trees (DFS/BFS Basics)

**🎯 Goal:** Recursion clarity + traversal comfort

**📊 Problem Distribution:** 12 problems (7 Easy, 5 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| 1 | Maximum Depth of Binary Tree | Easy | DFS | Base case + recursion |
| 2 | Invert Binary Tree | Easy | DFS | Swap children |
| 3 | Diameter of Binary Tree | Easy | DFS | Height calculation |
| 4 | Balanced Binary Tree | Easy | DFS | Height difference |
| 5 | Same Tree | Easy | DFS | Simultaneous traversal |
| 6 | Subtree of Another Tree | Easy | DFS | Tree matching |
| 7 | Binary Tree Level Order | Medium | BFS | Queue traversal |
| 8 | Validate Binary Search Tree | Medium | DFS | Range checking |
| 9 | Lowest Common Ancestor BST | Easy | BST Property | Value comparison |
| 10 | Path Sum | Easy | DFS | Backtracking |
| 11 | Kth Smallest Element BST | Medium | In-order DFS | BST property |
| 12 | Construct Tree from Pre+In | Medium | Recursion | Index manipulation (stretch) |

**Weekend Tasks:**
```
✓ Re-solve: Level Order, Validate BST, Diameter
✓ Master: DFS vs BFS decision making
```

**Tree Traversal Patterns:**
```javascript
// Pattern 1: DFS Recursion (Most Common)
const maxDepth = (root) => {
  if (!root) return 0; // Base case
  
  const left = maxDepth(root.left);
  const right = maxDepth(root.right);
  
  return Math.max(left, right) + 1;
};

// Pattern 2: BFS (Level Order)
const levelOrder = (root) => {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
};

// Pattern 3: BST Validation (Range Check)
const isValidBST = (root, min = -Infinity, max = Infinity) => {
  if (!root) return true;
  
  if (root.val <= min || root.val >= max) return false;
  
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
};

// Decision: DFS when you need depth/paths, BFS when you need levels
```

---

### Week 7: Heaps + Greedy + Intervals

**🎯 Goal:** Cover high-frequency interview patterns

**📊 Problem Distribution:** 11 problems (2 Easy, 9 Medium)

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| **Heaps** | | | | |
| 1 | Kth Largest Element in Array | Medium | Heap/QuickSelect | Min heap of size K |
| 2 | Top K Frequent Elements | Medium | Heap + HashMap | Frequency heap |
| 3 | Find Median from Data Stream | Hard | Two Heaps | Max heap + min heap |
| **Intervals** | | | | |
| 4 | Merge Intervals | Medium | Sorting + Merge | Overlapping check |
| 5 | Insert Interval | Medium | Linear Scan | Three phases |
| 6 | Non-overlapping Intervals | Medium | Greedy | Earliest end time |
| 7 | Meeting Rooms II | Medium | Heap | Min rooms needed |
| **Greedy** | | | | |
| 8 | Jump Game | Medium | Greedy | Farthest reachable |
| 9 | Gas Station | Medium | Greedy | Total/current surplus |
| 10 | Partition Labels | Medium | Greedy | Last occurrence |
| 11 | Min Add Parentheses Valid | Medium | Greedy | Open/close count |

**Weekend Tasks:**
```
✓ Re-solve: Merge Intervals, Meeting Rooms, Kth Largest
✓ Master: "When is greedy optimal?"
```

**Key Patterns:**
```javascript
// Pattern 1: Merge Intervals
const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    
    if (intervals[i][0] <= last[1]) {
      // Overlapping: merge
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      // Non-overlapping: add new
      result.push(intervals[i]);
    }
  }
  
  return result;
};

// Pattern 2: Min Heap (Using array for simplicity)
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  push(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  
  pop() {
    if (this.heap.length === 0) return null;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown();
    }
    
    return min;
  }
  
  peek() {
    return this.heap[0];
  }
  
  size() {
    return this.heap.length;
  }
  
  bubbleUp() {
    let idx = this.heap.length - 1;
    
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      
      if (this.heap[idx] >= this.heap[parentIdx]) break;
      
      [this.heap[idx], this.heap[parentIdx]] = 
        [this.heap[parentIdx], this.heap[idx]];
      idx = parentIdx;
    }
  }
  
  bubbleDown() {
    let idx = 0;
    
    while (true) {
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      let smallest = idx;
      
      if (leftIdx < this.heap.length && 
          this.heap[leftIdx] < this.heap[smallest]) {
        smallest = leftIdx;
      }
      
      if (rightIdx < this.heap.length && 
          this.heap[rightIdx] < this.heap[smallest]) {
        smallest = rightIdx;
      }
      
      if (smallest === idx) break;
      
      [this.heap[idx], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}

// Greedy Pattern: "Can we make local optimal choice?"
// If yes → Greedy works
// If no → Need DP
```

---

### Week 8: Graphs + DP Intro + Mock Interviews

**🎯 Goal:** Convert knowledge into interview performance

**📊 Problem Distribution:** 12 problems + 2 mock interviews

| # | Problem | Difficulty | Pattern | Key Concept |
|---|---------|-----------|---------|-------------|
| **Graphs** | | | | |
| 1 | Number of Islands | Medium | DFS/BFS | Grid traversal |
| 2 | Flood Fill | Easy | DFS/BFS | Connected components |
| 3 | Clone Graph | Medium | DFS + HashMap | Deep copy |
| 4 | Course Schedule | Medium | Topological Sort | Cycle detection |
| 5 | Pacific Atlantic Water Flow | Medium | DFS | Multi-source |
| 6 | Rotting Oranges | Medium | BFS | Multi-source BFS |
| **DP Intro** | | | | |
| 7 | Climbing Stairs | Easy | DP | Fibonacci pattern |
| 8 | House Robber | Medium | DP | Decision DP |
| 9 | House Robber II | Medium | DP | Circular constraint |
| 10 | Coin Change | Medium | DP | Unbounded knapsack |
| 11 | Longest Increasing Subseq | Medium | DP | O(n log n) optimal |
| 12 | Longest Common Subseq | Medium | DP | 2D DP (stretch) |

**Mock Interviews (Critical!):**
```
Mock 1: 1 Easy + 1 Medium (60 minutes)
  - Simulate real interview: talk out loud
  - Use timer: 25 min Easy, 35 min Medium
  - Practice: "Let me think through this..."

Mock 2: 1 Medium Deep-Dive (60 minutes)
  - 45 min: Solve medium problem
  - 15 min: Explain solution + optimizations
  - Practice: Complexity analysis explanation
```

**Graph Patterns:**
```javascript
// Pattern 1: DFS on Grid
const numIslands = (grid) => {
  if (!grid.length) return 0;
  
  let count = 0;
  
  const dfs = (i, j) => {
    if (i < 0 || i >= grid.length || 
        j < 0 || j >= grid[0].length || 
        grid[i][j] === '0') {
      return;
    }
    
    grid[i][j] = '0'; // Mark visited
    
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  
  return count;
};

// Pattern 2: Simple DP (Climbing Stairs)
const climbStairs = (n) => {
  if (n <= 2) return n;
  
  let prev2 = 1; // dp[i-2]
  let prev1 = 2; // dp[i-1]
  
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  
  return prev1;
};

// DP Pattern Recognition:
// "count ways" → DP
// "minimum/maximum" + "all possibilities" → DP
// Can we break into subproblems? → DP
```

---

## 4️⃣ Daily Structure (45-60 Min)

### Monday - Friday Routine

```
┌─────────────────────────────────────────────────────┐
│ 5 min:  Recall Yesterday's Pattern                 │
│         - What was the pattern?                     │
│         - What was the key insight?                 │
│         - Write 1-line summary                      │
├─────────────────────────────────────────────────────┤
│ 25-35 min: Solve Today's Problem                   │
│         - Read problem carefully                    │
│         - Identify pattern                          │
│         - Attempt solution (25-35 min max)          │
│         - If stuck at 25 min → Look at solution    │
├─────────────────────────────────────────────────────┤
│ 10-15 min: Write Clean Solution + Document         │
│         - Write clean code                          │
│         - Dry run with example                      │
│         - Document: Pattern + Invariant             │
│         - Document: Time + Space complexity         │
└─────────────────────────────────────────────────────┘
```

**Example Daily Log:**
```javascript
// Day 12: Longest Substring Without Repeating Characters
// Pattern: Sliding Window (variable size)
// Invariant: window contains no duplicates (hashset tracks)
// Time: O(n) - each char visited at most twice
// Space: O(min(n, m)) - m = charset size

// Key Insight: Expand right, shrink left when duplicate found
// Mistake I made: Forgot to remove left char from set when shrinking
```

### Saturday/Sunday Routine (2-3 hours)

```
┌─────────────────────────────────────────────────────┐
│ 60-90 min: Re-solve 3 Problems (No Help!)         │
│         - Pick from 2 days ago and 7 days ago      │
│         - Set timer: 25 min each                   │
│         - NO peeking at solutions                  │
│         - If stuck: try 5 more min, then peek      │
├─────────────────────────────────────────────────────┤
│ 45-60 min: 1 Timed Session                        │
│         - Fresh medium problem                      │
│         - 35 min timer                             │
│         - Talk out loud (practice interviewing)    │
│         - Record: what slowed you down?            │
├─────────────────────────────────────────────────────┤
│ 30-45 min: Pattern Notes Review                   │
│         - Review week's patterns                   │
│         - Identify weak spots                      │
│         - Write: "When to use X vs Y?"            │
└─────────────────────────────────────────────────────┘
```

---

## 5️⃣ Progress Checkpoints

### 🎯 End of Week 2 Checkpoint

**You should be able to:**
- Solve most Easy array problems in 15-20 minutes
- Identify "two pointers" vs "sliding window" pattern immediately
- Explain why O(n) is better than O(n²) with real examples

**Self-Test:**
```
Problem: "Find longest subarray with sum ≤ K"
Can you:
✓ Identify it's sliding window in 30 seconds?
✓ Write the template from memory?
✓ Solve in 20-25 minutes?
```

**If No:** Review Week 1-2 problems again

---

### 🎯 End of Week 4 Checkpoint

**You should be able to:**
- Solve binary search problems with confidence
- Distinguish "exact search" vs "answer search" instantly
- Explain answer binary search to a friend

**Self-Test:**
```
Problem: "Minimum speed to finish tasks in D days"
Can you:
✓ Recognize it's answer binary search immediately?
✓ Define the search space (min, max)?
✓ Write isFeasible() function?
✓ Solve in 25 minutes?
```

**If No:** Redo Week 4 problems, focus on "why binary search works here"

---

### 🎯 End of Week 6 Checkpoint

**You should be able to:**
- Trees no longer feel scary
- Write DFS recursion without second-guessing
- Explain DFS vs BFS trade-offs clearly

**Self-Test:**
```
Problem: "Find all paths that sum to target"
Can you:
✓ Choose DFS over BFS immediately?
✓ Write base case correctly?
✓ Handle backtracking if needed?
✓ Solve in 30 minutes?
```

**If No:** Redo tree problems, draw out recursion tree

---

### 🎯 End of Week 8 Checkpoint (Final Goal)

**You should be able to:**
- **Solve 2 mediums in 75 minutes reliably**
- Identify pattern within 2-3 minutes of reading problem
- Explain your solution clearly during mock interview
- Handle follow-up optimization questions

**Final Self-Test:**
```
Pick 2 random medium problems you haven't solved:
✓ Solve both in 75 minutes (no help)
✓ Write clean, bug-free code
✓ Explain time/space complexity
✓ Discuss alternative approaches

Success Rate Target: 80%+ (8 out of 10 attempts)
```

---

## 6️⃣ Pattern Recognition Framework

### The 3-Line Output (Your Secret Weapon)

For **every problem**, force yourself to write this:

```javascript
// 1. Pattern: [name of pattern]
// 2. Invariant: [what remains true throughout]
// 3. Why O(n): [why this complexity]
```

**Example 1: Two Sum**
```javascript
// 1. Pattern: HashMap for O(1) lookup
// 2. Invariant: complement = target - current exists in map when solution found
// 3. Why O(n): Single pass, each lookup/insert is O(1)
```

**Example 2: Longest Substring Without Repeating**
```javascript
// 1. Pattern: Sliding window (variable size) + HashSet
// 2. Invariant: window [left, right] contains no duplicates
// 3. Why O(n): Each character added once (right++) and removed once (left++)
```

**Example 3: Valid Parentheses**
```javascript
// 1. Pattern: Stack for matching pairs
// 2. Invariant: Stack always contains unmatched opening brackets
// 3. Why O(n): Single pass, each push/pop is O(1)
```

### Pattern Decision Tree

```
Problem Given
     │
     ▼
┌─────────────────────────────────────────┐
│ Is it about array/string traversal?    │
├─────────────────────────────────────────┤
│ → Finding pair/triplet?                │
│   → Two Pointers (opposite direction)  │
│                                         │
│ → Contiguous subarray with condition?  │
│   → Sliding Window                     │
│                                         │
│ → Need to track something for O(1)?   │
│   → HashMap/HashSet                    │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Is it about finding next greater/      │
│ smaller or matching pairs?              │
├─────────────────────────────────────────┤
│ → Next greater/smaller element?        │
│   → Monotonic Stack                    │
│                                         │
│ → Matching/nesting structure?          │
│   → Stack                              │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Is data sorted or can be sorted?       │
├─────────────────────────────────────────┤
│ → Search in sorted array?              │
│   → Binary Search                      │
│                                         │
│ → "Minimum X to achieve Y"?            │
│   → Answer Binary Search               │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Is it about linked list?               │
├─────────────────────────────────────────┤
│ → Find middle/cycle?                   │
│   → Fast/Slow Pointer                  │
│                                         │
│ → Reverse/merge?                       │
│   → Pointer Manipulation               │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Is it about tree/graph?                │
├─────────────────────────────────────────┤
│ → Need depth/paths?                    │
│   → DFS (Recursion)                    │
│                                         │
│ → Need level-by-level?                │
│   → BFS (Queue)                        │
│                                         │
│ → Dependencies/cycles?                 │
│   → Topological Sort                   │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Is it optimization problem?            │
├─────────────────────────────────────────┤
│ → Can make local optimal choice?      │
│   → Greedy                             │
│                                         │
│ → Need to consider all possibilities?  │
│   → Dynamic Programming                │
│                                         │
│ → Need top K elements?                 │
│   → Heap                               │
└─────────────────────────────────────────┘
```

---

## 7️⃣ Common Interview Questions

### Q1: How do you approach a problem you've never seen before?

**Model Answer:**
```
1. Clarify the problem:
   - "Can I assume the array is sorted?"
   - "What should I return if input is empty?"
   - "Are there any constraints on input size?"

2. Start with brute force:
   - "The naive approach would be O(n²) nested loops"
   - "But we can optimize using..."

3. Identify pattern:
   - "This looks like a two-pointer problem because..."
   - "I notice we need to track a window, so sliding window"

4. Explain as you code:
   - "I'm using a HashMap here because..."
   - "This edge case handles when..."

5. Test with examples:
   - Walk through with given example
   - Test edge case: empty, single element, duplicates
```

### Q2: What's the difference between two pointers and sliding window?

**Model Answer:**
```
Two Pointers:
- Used when we need to compare/process two elements
- Pointers can move in opposite directions (converging)
- Or same direction with different speeds (fast/slow)
- Example: Palindrome check, remove duplicates

Sliding Window:
- Used for contiguous subarrays/substrings
- Window expands (right++) and shrinks (left++)
- Maintains some property within window
- Example: Longest substring, max sum subarray

Key Difference:
- Two pointers: Usually about element relationship
- Sliding window: Always about subarray/substring property
```

### Q3: When should I use DFS vs BFS for trees?

**Model Answer:**
```
Use DFS when:
✓ You need to explore depth (all paths, max depth)
✓ You need to process nodes top-to-bottom
✓ Problem involves recursion naturally
✓ Space constraint (DFS uses O(h), BFS uses O(w))
Examples: Validate BST, Path Sum, Diameter

Use BFS when:
✓ You need level-by-level processing
✓ You need to find shortest path
✓ You need nodes at same level together
Examples: Level Order, Min Depth, Right Side View

Trade-off:
- DFS: O(h) space, harder to reason about levels
- BFS: O(w) space, easier for level-based problems
```

### Q4: How do you know when to use a HashMap?

**Model Answer:**
```
Use HashMap when you need:
1. O(1) lookup/insertion
   - "Have I seen this element before?"
   - Two Sum: "Does complement exist?"

2. Frequency counting
   - Group Anagrams, Top K Frequent
   - Character count for anagram checking

3. Index tracking
   - "Where did I last see this character?"
   - Longest Substring Without Repeating

4. Mapping relationships
   - Clone Graph: original → clone mapping
   - Isomorphic Strings: char → char mapping

Pattern:
If you're writing nested loop to search → Use HashMap
```

### Q5: How do you handle time/space complexity questions?

**Model Answer:**
```
Time Complexity:
"Let me walk through what happens:
- We iterate through n elements once → O(n)
- For each element, we do constant work → O(1)
- Total: O(n) × O(1) = O(n)"

Space Complexity:
"For space, we're using:
- HashMap that stores at most n elements → O(n)
- A few variables (left, right) → O(1)
- Total: O(n) for the HashMap"

Pro Tip:
Always mention:
1. What 'n' represents
2. Why each operation is O(?)
3. Whether you can optimize further
```

### Q6: What do you do when you're stuck in an interview?

**Model Answer:**
```
1. Think out loud:
   "I'm thinking about using a HashMap here, but..."
   "Let me consider the edge cases first..."

2. Start with brute force:
   "I can solve this in O(n²) by..."
   "But I think we can optimize to O(n) by..."

3. Ask for hints:
   "I'm stuck on handling duplicates. Can you give me a hint?"
   "Should I be thinking about sorting first?"

4. Work through an example:
   "Let me trace through with [1, 2, 3]..."
   "Oh, I see the pattern now!"

5. Discuss trade-offs:
   "I could use more space to optimize time..."
   "Which would you prefer in production?"

Remember: Interviewers care more about your thought process
than getting the perfect answer immediately.
```

---

## 8️⃣ Common Pitfalls to Avoid

### Pitfall 1: Not Understanding the Problem

**❌ BAD Approach:**
```javascript
// Jumped straight into coding without clarification
const solve = (arr) => {
  // Wait, is arr sorted? Can it be empty?
  // What if there are duplicates?
  for (let i = 0; i < arr.length; i++) {
    // I'm not even sure what I'm trying to find...
  }
};
```

**✅ GOOD Approach:**
```javascript
/**
 * Before coding, I clarified:
 * 1. Input: sorted array, can have duplicates
 * 2. Output: index of first occurrence
 * 3. Edge: return -1 if not found
 * 4. Constraints: O(log n) expected → binary search
 */
const searchFirst = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) {
      result = mid;      // Found, but keep searching left
      right = mid - 1;   // for first occurrence
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
};
```

**What goes wrong:** Solving the wrong problem, missing edge cases, inefficient approach.

---

### Pitfall 2: Ignoring Edge Cases

**❌ BAD Approach:**
```javascript
// Remove duplicates from sorted array
const removeDuplicates = (nums) => {
  let j = 0;
  
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[j]) {
      j++;
      nums[j] = nums[i];
    }
  }
  
  return j + 1;
  // BUG: What if nums is empty? nums.length = 0
  // j + 1 = 1, but should return 0!
};
```

**✅ GOOD Approach:**
```javascript
const removeDuplicates = (nums) => {
  // Handle edge case: empty array
  if (nums.length === 0) return 0;
  
  let j = 0;
  
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[j]) {
      j++;
      nums[j] = nums[i];
    }
  }
  
  return j + 1;
};

// Always test with:
// 1. Empty: []
// 2. Single element: [1]
// 3. All duplicates: [1, 1, 1]
// 4. No duplicates: [1, 2, 3]
```

**What goes wrong:** Runtime errors, wrong answers for edge cases, failed test cases.

---

### Pitfall 3: Incorrect Loop Bounds

**❌ BAD Approach:**
```javascript
// Find pairs with sum = target (two pointers)
const twoSum = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  
  // BUG: Should be left < right, not left <= right
  while (left <= right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return null;
};

// When left === right, we're using same element twice!
// Example: arr = [2, 3], target = 4
// When left = 0, right = 0 → arr[0] + arr[0] = 4 ✗ Wrong!
```

**✅ GOOD Approach:**
```javascript
const twoSum = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) { // ✓ Correct: ensures different elements
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return null;
};
```

**What goes wrong:** Infinite loops, using same element twice, missing valid pairs.

---

### Pitfall 4: Not Considering Integer Overflow

**❌ BAD Approach:**
```javascript
// Binary search with overflow risk
const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // BUG: left + right can overflow for large values
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
};
```

**✅ GOOD Approach:**
```javascript
const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // ✓ Safe from overflow
    const mid = Math.floor(left + (right - left) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
};

// Why: (left + right) can overflow if left and right are large
// But: left + (right - left) / 2 won't overflow
```

**What goes wrong:** In languages like Java/C++, overflow causes bugs. Good practice in JavaScript too.

---

## 9️⃣ Time & Space Complexity Guide

### Quick Reference Table

| Operation/Pattern | Time Complexity | Space Complexity | Example |
|------------------|----------------|------------------|---------|
| **Array traversal** | O(n) | O(1) | Single loop |
| **Nested loop** | O(n²) | O(1) | Find all pairs |
| **Binary search** | O(log n) | O(1) | Search sorted array |
| **HashMap operations** | O(1) avg | O(n) | Two Sum |
| **Sorting** | O(n log n) | O(1) or O(n) | Merge intervals |
| **Two pointers** | O(n) | O(1) | Palindrome check |
| **Sliding window** | O(n) | O(k) | Longest substring |
| **Stack operations** | O(n) | O(n) | Valid parentheses |
| **DFS/BFS tree** | O(n) | O(h) or O(w) | Tree traversal |
| **DFS/BFS graph** | O(V + E) | O(V) | Number of islands |
| **Heap operations** | O(log n) | O(n) | Top K elements |
| **Dynamic programming** | O(n) to O(n²) | O(n) to O(n²) | Coin change |

### Complexity Analysis Examples

**Example 1: Two Sum (HashMap)**
```javascript
const twoSum = (nums, target) => {
  const map = new Map(); // Space: O(n)
  
  for (let i = 0; i < nums.length; i++) { // Time: O(n)
    const complement = target - nums[i];
    
    if (map.has(complement)) { // O(1)
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i); // O(1)
  }
  
  return null;
};

// Time: O(n) - single loop, O(1) operations inside
// Space: O(n) - hashmap stores at most n elements
```

**Example 2: Sliding Window**
```javascript
const longestSubstring = (s) => {
  const seen = new Set(); // Space: O(min(n, m)) where m = charset size
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) { // O(n)
    while (seen.has(s[right])) { // Inner loop: total O(n)
      seen.delete(s[left]);
      left++;
    }
    
    seen.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
};

// Time: O(n) - each char visited at most twice (right++, left++)
// Space: O(min(n, m)) - set stores unique chars
```

**Example 3: DFS Tree**
```javascript
const maxDepth = (root) => {
  if (!root) return 0; // Base case
  
  const left = maxDepth(root.left);   // Recursive
  const right = maxDepth(root.right); // Recursive
  
  return Math.max(left, right) + 1;
};

// Time: O(n) - visit each node once
// Space: O(h) - recursion stack, h = height
//        O(log n) for balanced tree
//        O(n) for skewed tree
```

---

## 🔟 Summary

### Quick Reference: 8-Week Plan at a Glance

| Week | Focus | Problems | Key Patterns | Weekend Goal |
|------|-------|----------|-------------|--------------|
| **1** | Arrays + Two Pointers | 12 | Converging, Fast-slow | Create template |
| **2** | Sliding Window + Hashing | 12 | Fixed/variable window | Master window logic |
| **3** | Stack + Monotonic Stack | 10 | Next greater/smaller | Understand monotonic |
| **4** | Binary Search | 11 | Exact + answer search | 2 templates ready |
| **5** | Linked List | 10 | Fast/slow, reversal | No pointer mistakes |
| **6** | Trees DFS/BFS | 12 | Recursion, level order | DFS vs BFS clarity |
| **7** | Heaps + Greedy + Intervals | 11 | Top K, merge intervals | Greedy intuition |
| **8** | Graphs + DP + Mocks | 12 + mocks | DFS/BFS grid, basic DP | 2 mediums in 75 min |

### 5 Key Takeaways

1. **Pattern Over Problems:** Master 8 patterns, not 500 problems
   - Each pattern covers 10-15 variations
   - Spaced repetition makes patterns instinctive

2. **Document Everything:** Write pattern + invariant + complexity
   - Forces you to understand "why"
   - Builds pattern recognition muscle
   - Makes review effortless

3. **Spaced Repetition Works:** Re-solve after 2 days and 7 days
   - Forgetting → Re-learning = Long-term memory
   - Prevents "I've seen this but can't solve it" syndrome

4. **Time Management:** 45-60 mins daily is enough
   - Consistency > Marathon sessions
   - Weekends for review + mocks
   - Working professionals can compete!

5. **Interview Skills ≠ Problem Solving:** Practice explaining
   - Think out loud during mocks
   - Explain complexity clearly
   - Discuss trade-offs confidently

### Your Success Mantra

```
Progress Formula:
─────────────────────────────────────────────
  90 problems × Spaced repetition
  ÷ 8 weeks
  = FAANG interview confidence
─────────────────────────────────────────────

Remember:
✓ You don't need to be perfect
✓ You don't need 500 problems
✓ You need patterns + practice + persistence
```

---

## 📚 Further Reading & Resources

### Official Documentation
- [LeetCode Patterns](https://leetcode.com/explore/)
- [JavaScript Array Methods - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [Big O Notation Guide](https://www.bigocheatsheet.com/)

### Related Articles
- [30-Day DSA Guide for Senior Frontend Engineers](./30_day_dsa_guide_senior_frontend.md)
- [Two Pointer Technique](./two_pointer_technique.md)
- [Sliding Window Pattern](./sliding_window.md)
- [DFS Deep Dive](./dfs.md)
- [BFS Complete Guide](./bfs.md)

### Practice Platforms
- LeetCode: curated problem lists
- NeetCode: pattern-based roadmap
- AlgoExpert: video explanations

---

<!-- quiz-start -->
### Q1: What is the primary advantage of the spaced repetition approach (re-solving after 2 days and 7 days)?

- [ ] It helps you solve more problems in less time
- [x] It builds long-term memory by leveraging the forgetting curve and strengthens pattern recognition
- [ ] It allows you to skip difficult problems
- [ ] It reduces the total number of problems you need to solve

### Q2: For the problem "Find the minimum speed to finish all tasks within D days", which pattern should you use?

- [ ] Two Pointers
- [ ] Sliding Window
- [x] Answer Binary Search (find minimum feasible value)
- [ ] Dynamic Programming

### Q3: When should you use a HashMap in problem-solving?

- [ ] Only when the problem explicitly asks for frequency counting
- [ ] When you need to sort the data first
- [x] When you need O(1) lookup/insertion or need to track seen elements or frequencies
- [ ] Only for string problems

### Q4: What's the key difference between two pointers and sliding window patterns?

- [ ] Two pointers is always faster than sliding window
- [x] Two pointers is about element relationships, sliding window is about contiguous subarray/substring properties
- [ ] Sliding window only works on sorted arrays
- [ ] They are the same pattern with different names

### Q5: By the end of Week 8, what should you reliably be able to do?

- [ ] Solve 10 hard problems in one sitting
- [ ] Memorize solutions to all 90 problems
- [x] Solve 2 medium problems in 75 minutes with clear explanations
- [ ] Complete 500 LeetCode problems

### Q6: What is the recommended time to attempt a problem before looking at the solution during weekdays?

- [ ] 10-15 minutes
- [x] 25-35 minutes
- [ ] 45-60 minutes
- [ ] Until you solve it, no matter how long

### Q7: For tree problems, when should you use BFS instead of DFS?

- [ ] Always use BFS because it's more efficient
- [ ] Never use BFS, DFS is sufficient for all tree problems
- [x] Use BFS when you need level-by-level processing or shortest path
- [ ] Use BFS only for binary search trees

### Q8: What does the "3-line output" framework require you to write for every problem?

- [ ] Problem statement, solution code, and test cases
- [ ] Three different solutions to compare
- [x] Pattern name, invariant (what remains true), and complexity explanation
- [ ] Three edge cases you need to handle
<!-- quiz-end -->
