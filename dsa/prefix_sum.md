---
date: 2025-12-29T18:06:42+00:00
description: Master the prefix sum technique for efficient range query operations - a critical pattern for frontend interview coding challenges involving arrays and subarrays.
premium: false
---

# 🎯 Prefix Sum Technique: Efficient Range Query Pattern for Frontend Interviews

> **Interview Importance:** 🔴 Critical — This technique appears in 30% of frontend coding interviews for array manipulation and range query problems. Essential for optimizing O(n) repeated queries to O(1) constant time lookups.

---

## 1️⃣ What is the Prefix Sum Technique?

The **Prefix Sum Technique** (also called cumulative sum) is an algorithmic pattern that preprocesses an array to answer range sum queries in constant time. Instead of repeatedly summing elements in a range, we build a prefix sum array once and use simple arithmetic to get any range sum instantly.

**Visual Representation:**

```
Original Array:  [3, 1, 4, 2, 5, 1]
                  
Prefix Sum:      [0, 3, 4, 8, 10, 15, 16]
Index:            0  1  2  3   4   5   6

prefix[i] = sum of all elements from arr[0] to arr[i-1]

Range Sum [1, 4] = prefix[5] - prefix[1] = 15 - 3 = 12
                   (sum of elements at indices 1,2,3,4)
```

**Real-World Analogy:**

Think of it like a running total on your bank statement. Instead of adding up all transactions every time you want to know your balance between two dates, you just subtract the balance at the start date from the balance at the end date. The bank keeps cumulative totals, not individual transactions, for quick lookups.

---

## 2️⃣ Why Use Prefix Sum? / Why Does This Matter?

| **Problem Type** | **Without Prefix Sum** | **With Prefix Sum** | **Benefit** |
|------------------|----------------------|---------------------|-------------|
| Sum of range [L, R] | O(n) - iterate and sum | O(1) - single subtraction | 1000x faster for repeated queries |
| Multiple range queries | O(n*q) - q queries, each O(n) | O(n + q) - O(n) build + O(1) per query | Scales to millions of queries |
| Subarray sum equals K | O(n²) - check all subarrays | O(n) - hash map with prefix sums | Linear time solution |
| Find equilibrium index | O(n²) - check each index | O(n) - single pass | Optimal solution |
| Range update queries | O(n*q) - update each element | O(n) - difference array | Batch updates efficiently |

**Performance Benefits:**
- Converts repeated O(n) range sum queries to O(1) lookups
- Preprocessing cost: O(n) once, then O(1) per query
- Perfect for frontend: analytics dashboards, data visualization, reporting
- Powers features like: chart range selection, filtering, aggregation

---

## 3️⃣ How It Works — Basic Implementation

### Building the Prefix Sum Array

```javascript
/**
 * Build prefix sum array from input array
 * @param {number[]} arr - Input array
 * @returns {number[]} Prefix sum array
 */
const buildPrefixSum = (arr) => {
  if (!arr || arr.length === 0) return [0];  // Edge case: empty array
  
  const prefix = new Array(arr.length + 1);  // Extra space for index 0
  prefix[0] = 0;  // Base case: sum of zero elements is 0
  
  // Build prefix sum: prefix[i] = sum of arr[0...i-1]
  for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
  }
  
  return prefix;
};

/**
 * Get sum of elements in range [left, right] (inclusive)
 * @param {number[]} prefix - Prefix sum array
 * @param {number} left - Start index (inclusive)
 * @param {number} right - End index (inclusive)
 * @returns {number} Sum of range
 */
const getRangeSum = (prefix, left, right) => {
  // Range sum [left, right] = prefix[right+1] - prefix[left]
  return prefix[right + 1] - prefix[left];
};
```

### 🔍 Dry Run: Building Prefix Sum and Range Query

**Input:** `arr = [3, 1, 4, 2, 5]`

```
Step 1: Initialize prefix sum array
─────────────────────────────────────────────────────────
  arr = [3, 1, 4, 2, 5]
  prefix = [0, _, _, _, _, _]  (length = arr.length + 1 = 6)
  prefix[0] = 0  (sum of 0 elements)

Step 2: Build prefix sums iteratively
─────────────────────────────────────────────────────────
  i=0: prefix[1] = prefix[0] + arr[0] = 0 + 3 = 3
       prefix = [0, 3, _, _, _, _]
       
  i=1: prefix[2] = prefix[1] + arr[1] = 3 + 1 = 4
       prefix = [0, 3, 4, _, _, _]
       
  i=2: prefix[3] = prefix[2] + arr[2] = 4 + 4 = 8
       prefix = [0, 3, 4, 8, _, _]
       
  i=3: prefix[4] = prefix[3] + arr[3] = 8 + 2 = 10
       prefix = [0, 3, 4, 8, 10, _]
       
  i=4: prefix[5] = prefix[4] + arr[4] = 10 + 5 = 15
       prefix = [0, 3, 4, 8, 10, 15]

Step 3: Query range sum [1, 3] (elements at indices 1,2,3)
─────────────────────────────────────────────────────────
  left = 1, right = 3
  Range sum = prefix[right+1] - prefix[left]
            = prefix[4] - prefix[1]
            = 10 - 3
            = 7
  
  Verification: arr[1] + arr[2] + arr[3] = 1 + 4 + 2 = 7 ✓

Result: prefix = [0, 3, 4, 8, 10, 15], rangeSum(1,3) = 7
```

**Time Complexity:** O(n) for building, O(1) for each query  
**Space Complexity:** O(n) for prefix array

---

## 4️⃣ Understanding Key Concepts

### Why Start with prefix[0] = 0?

```javascript
// Without prefix[0] = 0:
const prefix = [3, 4, 8, 10, 15];  // No base case
const rangeSum = (left, right) => prefix[right] - prefix[left - 1];
// Problem: prefix[-1] is undefined when left = 0!

// ✅ With prefix[0] = 0:
const prefix = [0, 3, 4, 8, 10, 15];  // Base case included
const rangeSum = (left, right) => prefix[right + 1] - prefix[left];
// Works perfectly: rangeSum(0, 2) = prefix[3] - prefix[0] = 8 - 0 = 8
```

**What breaks if you skip it?** You'd need special handling for queries starting at index 0, making code complex and error-prone.

### Why use prefix[i+1] instead of prefix[i]?

```javascript
// This alignment makes math cleaner:
// prefix[i] = sum of first i elements (0-indexed)
// Range [L, R] = prefix[R+1] - prefix[L]
// No off-by-one errors!

// Alternative (error-prone):
// prefix[i] = sum of first i+1 elements
// Range [L, R] = prefix[R] - (L > 0 ? prefix[L-1] : 0)
// Requires special case for L=0
```

### Edge Cases Handled

```javascript
const buildPrefixSum = (arr) => {
  if (!arr || arr.length === 0) return [0];  // Empty array
  
  // Handles:
  // 1. Negative numbers: prefix sums work normally
  // 2. Zero elements: included in sum
  // 3. Single element: prefix = [0, arr[0]]
  // 4. All same numbers: prefix increases uniformly
};
```

---

## 5️⃣ Production/Advanced Implementation

### Complete Prefix Sum Class with Validation

```javascript
/**
 * Prefix Sum data structure for efficient range queries
 * Supports building from array and handling multiple queries
 */
class PrefixSum {
  constructor(arr) {
    // Input validation
    if (!Array.isArray(arr)) {
      throw new TypeError('Input must be an array');
    }
    
    if (!arr.every(x => typeof x === 'number' && isFinite(x))) {
      throw new TypeError('All elements must be finite numbers');
    }
    
    this.original = [...arr];  // Preserve original array
    this.prefix = this._buildPrefix(arr);
  }
  
  _buildPrefix(arr) {
    const prefix = new Array(arr.length + 1);
    prefix[0] = 0;
    
    for (let i = 0; i < arr.length; i++) {
      prefix[i + 1] = prefix[i] + arr[i];
    }
    
    return prefix;
  }
  
  /**
   * Get sum of elements in range [left, right] (inclusive, 0-indexed)
   */
  rangeSum(left, right) {
    // Validation
    if (left < 0 || right >= this.original.length || left > right) {
      throw new RangeError(`Invalid range: [${left}, ${right}]`);
    }
    
    return this.prefix[right + 1] - this.prefix[left];
  }
  
  /**
   * Get total sum of all elements
   */
  totalSum() {
    return this.prefix[this.prefix.length - 1];
  }
  
  /**
   * Find if there exists a subarray with sum equal to target
   */
  hasSubarraySum(target) {
    const seen = new Set([0]);  // Include 0 for subarrays starting at index 0
    
    for (let i = 1; i < this.prefix.length; i++) {
      const currentSum = this.prefix[i];
      
      // If (currentSum - target) exists, we found subarray
      if (seen.has(currentSum - target)) {
        return true;
      }
      
      seen.add(currentSum);
    }
    
    return false;
  }
  
  /**
   * Count subarrays with sum equal to target
   */
  countSubarraysWithSum(target) {
    const prefixCount = new Map([[0, 1]]);  // Empty subarray has sum 0
    let count = 0;
    
    for (let i = 1; i < this.prefix.length; i++) {
      const currentSum = this.prefix[i];
      const complement = currentSum - target;
      
      // Add count of all prefix sums that equal complement
      if (prefixCount.has(complement)) {
        count += prefixCount.get(complement);
      }
      
      // Update frequency map
      prefixCount.set(currentSum, (prefixCount.get(currentSum) || 0) + 1);
    }
    
    return count;
  }
  
  /**
   * Update value at index (rebuilds prefix sum)
   * For frequent updates, consider segment tree instead
   */
  update(index, value) {
    if (index < 0 || index >= this.original.length) {
      throw new RangeError(`Index ${index} out of bounds`);
    }
    
    if (typeof value !== 'number' || !isFinite(value)) {
      throw new TypeError('Value must be a finite number');
    }
    
    this.original[index] = value;
    this.prefix = this._buildPrefix(this.original);
  }
}
```

### 🔍 Dry Run: Count Subarrays with Target Sum

**Input:** `arr = [1, 2, 3], target = 3`

```
Step 1: Build prefix sum
─────────────────────────────────────────────────────────
  arr = [1, 2, 3]
  prefix = [0, 1, 3, 6]
  prefixCount = {0: 1}  (base case)
  count = 0

Step 2: Process prefix[1] = 1
─────────────────────────────────────────────────────────
  currentSum = 1
  complement = currentSum - target = 1 - 3 = -2
  prefixCount.has(-2) → false
  count = 0
  prefixCount = {0: 1, 1: 1}

Step 3: Process prefix[2] = 3
─────────────────────────────────────────────────────────
  currentSum = 3
  complement = currentSum - target = 3 - 3 = 0
  prefixCount.has(0) → true!
  count += prefixCount.get(0) = 0 + 1 = 1
  (Found: subarray [1,2] from index 0 to 1)
  prefixCount = {0: 1, 1: 1, 3: 1}

Step 4: Process prefix[3] = 6
─────────────────────────────────────────────────────────
  currentSum = 6
  complement = currentSum - target = 6 - 3 = 3
  prefixCount.has(3) → true!
  count += prefixCount.get(3) = 1 + 1 = 2
  (Found: subarray [3] from index 2 to 2)
  prefixCount = {0: 1, 1: 1, 3: 1, 6: 1}

Result: count = 2 (subarrays: [1,2] and [3])
```

---

## 6️⃣ Real-World Frontend Examples

### Example 1: Analytics Dashboard with Range Filters

```javascript
/**
 * Analytics dashboard showing revenue in selected date ranges
 * Use case: Business intelligence, reporting dashboards
 */
class RevenueAnalytics {
  constructor(dailyRevenue) {
    this.revenue = dailyRevenue;  // Array of daily revenue values
    this.prefixSum = new PrefixSum(dailyRevenue);
  }
  
  /**
   * Get total revenue between two dates
   * @param {number} startDay - Start day (0-indexed)
   * @param {number} endDay - End day (0-indexed, inclusive)
   */
  getRevenueInRange(startDay, endDay) {
    try {
      return this.prefixSum.rangeSum(startDay, endDay);
    } catch (error) {
      console.error('Invalid date range:', error.message);
      return 0;
    }
  }
  
  /**
   * Get average revenue for a period
   */
  getAverageRevenue(startDay, endDay) {
    const total = this.getRevenueInRange(startDay, endDay);
    const days = endDay - startDay + 1;
    return total / days;
  }
  
  /**
   * Find best consecutive N-day period
   */
  findBestPeriod(days) {
    if (days > this.revenue.length) return null;
    
    let maxRevenue = -Infinity;
    let bestStart = 0;
    
    for (let i = 0; i <= this.revenue.length - days; i++) {
      const revenue = this.prefixSum.rangeSum(i, i + days - 1);
      
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        bestStart = i;
      }
    }
    
    return {
      startDay: bestStart,
      endDay: bestStart + days - 1,
      revenue: maxRevenue
    };
  }
}

// Usage
const dailyRevenue = [1200, 1500, 1800, 2000, 1600, 1900, 2200];
const analytics = new RevenueAnalytics(dailyRevenue);

console.log(analytics.getRevenueInRange(0, 2));  // $4,500 (first 3 days)
console.log(analytics.getAverageRevenue(0, 6));   // ~$1,743/day
console.log(analytics.findBestPeriod(3));         // Best 3-day period
// -> { startDay: 4, endDay: 6, revenue: 5700 }
```

### Example 2: React Hook for Chart Range Selection

```javascript
import { useState, useMemo } from 'react';

/**
 * Custom hook for handling chart data with range selection
 * Use case: Interactive data visualization, chart libraries
 */
const useChartRangeData = (data) => {
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(data.length - 1);
  
  const prefixSum = useMemo(() => new PrefixSum(data), [data]);
  
  const selectedData = useMemo(() => {
    const sum = prefixSum.rangeSum(rangeStart, rangeEnd);
    const count = rangeEnd - rangeStart + 1;
    const average = sum / count;
    
    return {
      sum,
      average,
      count,
      min: Math.min(...data.slice(rangeStart, rangeEnd + 1)),
      max: Math.max(...data.slice(rangeStart, rangeEnd + 1))
    };
  }, [data, rangeStart, rangeEnd, prefixSum]);
  
  const setRange = (start, end) => {
    if (start >= 0 && end < data.length && start <= end) {
      setRangeStart(start);
      setRangeEnd(end);
    }
  };
  
  return {
    selectedData,
    rangeStart,
    rangeEnd,
    setRange
  };
};

// Usage in component
const ChartComponent = ({ salesData }) => {
  const { selectedData, rangeStart, rangeEnd, setRange } = useChartRangeData(salesData);
  
  return (
    <div>
      <h3>Sales Analysis</h3>
      <div>
        <label>
          Start: 
          <input 
            type="range" 
            min={0} 
            max={salesData.length - 1}
            value={rangeStart}
            onChange={(e) => setRange(Number(e.target.value), rangeEnd)}
          />
        </label>
        <label>
          End: 
          <input 
            type="range" 
            min={0} 
            max={salesData.length - 1}
            value={rangeEnd}
            onChange={(e) => setRange(rangeStart, Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <p>Total Sales: ${selectedData.sum}</p>
        <p>Average: ${selectedData.average.toFixed(2)}</p>
        <p>Range: ${selectedData.min} - ${selectedData.max}</p>
      </div>
    </div>
  );
};
```

### Example 3: Page View Analytics with Rolling Windows

```javascript
/**
 * Track page views with efficient rolling window queries
 * Use case: Real-time analytics, monitoring dashboards
 */
class PageViewTracker {
  constructor() {
    this.hourlyViews = new Array(24).fill(0);  // 24 hours
    this.prefixSum = null;
    this._rebuild();
  }
  
  _rebuild() {
    this.prefixSum = new PrefixSum(this.hourlyViews);
  }
  
  /**
   * Record page view at specific hour
   */
  recordView(hour) {
    if (hour < 0 || hour >= 24) {
      throw new RangeError('Hour must be between 0 and 23');
    }
    
    this.hourlyViews[hour]++;
    this._rebuild();
  }
  
  /**
   * Get views in time range
   */
  getViewsInRange(startHour, endHour) {
    return this.prefixSum.rangeSum(startHour, endHour);
  }
  
  /**
   * Get peak traffic hour (highest views)
   */
  getPeakHour() {
    let maxViews = -1;
    let peakHour = 0;
    
    for (let i = 0; i < this.hourlyViews.length; i++) {
      if (this.hourlyViews[i] > maxViews) {
        maxViews = this.hourlyViews[i];
        peakHour = i;
      }
    }
    
    return { hour: peakHour, views: maxViews };
  }
  
  /**
   * Get total daily views
   */
  getTotalViews() {
    return this.prefixSum.totalSum();
  }
  
  /**
   * Find quietest N-hour window
   */
  getQuietestWindow(hours) {
    if (hours > 24) return null;
    
    let minViews = Infinity;
    let quietStart = 0;
    
    for (let i = 0; i <= 24 - hours; i++) {
      const views = this.prefixSum.rangeSum(i, i + hours - 1);
      
      if (views < minViews) {
        minViews = views;
        quietStart = i;
      }
    }
    
    return {
      startHour: quietStart,
      endHour: quietStart + hours - 1,
      views: minViews
    };
  }
}

// Usage
const tracker = new PageViewTracker();

// Simulate page views
for (let i = 0; i < 100; i++) {
  const randomHour = Math.floor(Math.random() * 24);
  tracker.recordView(randomHour);
}

console.log('Business hours (9-17):', tracker.getViewsInRange(9, 17));
console.log('Peak hour:', tracker.getPeakHour());
console.log('Quietest 3-hour window:', tracker.getQuietestWindow(3));
```

---

## 7️⃣ Comparisons

### Prefix Sum vs Other Techniques

| **Aspect** | **Prefix Sum** | **Sliding Window** | **Nested Loops** | **Segment Tree** |
|------------|---------------|-------------------|-----------------|------------------|
| **Build Time** | O(n) | N/A | N/A | O(n) |
| **Query Time** | O(1) | O(1) | O(n) | O(log n) |
| **Update Time** | O(n) rebuild | O(1) | O(1) | O(log n) |
| **Space** | O(n) | O(1) | O(1) | O(n) |
| **Best For** | Many queries, few updates | Contiguous windows | Few queries | Many queries + updates |
| **Frontend Use** | Analytics, reporting | Real-time streams | Validation | Live data feeds |

### When to Use Each?

```javascript
// ✅ Use Prefix Sum when:
// - Multiple range sum queries needed
// - Data rarely changes (build once, query many)
// - Need O(1) query time
"How much revenue between day 10 and day 20?"
"Sum of elements in range [L, R]?"
"Count subarrays with sum K"

// ✅ Use Sliding Window when:
// - Single pass with moving window
// - Window size is fixed or variable
// - Finding optimal subarray
"Maximum sum subarray of size K"
"Longest substring without repeating characters"

// ✅ Use Segment Tree when:
// - Need both range queries AND updates
// - Can't rebuild prefix sum for each update
// - Slightly slower queries acceptable
"Update array element frequently + range queries"
"Range minimum/maximum queries with updates"

// ❌ Avoid Prefix Sum when:
// - Frequent updates (rebuild cost = O(n))
// - Only single query needed (overhead not worth it)
// - Need range min/max (prefix sum only works for sums)
```

---

## 8️⃣ Common Interview Questions

### Q1: How do you use prefix sum to find a subarray with sum equal to K?

**Answer:** Use a hash map to store prefix sums and check if `currentSum - K` exists.

```javascript
const subarraySum = (nums, k) => {
  const prefixCount = new Map([[0, 1]]);  // Base case: empty subarray
  let count = 0;
  let currentSum = 0;
  
  for (const num of nums) {
    currentSum += num;
    
    // If (currentSum - k) exists, found subarray
    if (prefixCount.has(currentSum - k)) {
      count += prefixCount.get(currentSum - k);
    }
    
    prefixCount.set(currentSum, (prefixCount.get(currentSum) || 0) + 1);
  }
  
  return count;
};

// Example: [1, 2, 3, 4], k=6
// Prefix: [0, 1, 3, 6, 10]
// When currentSum=6, check if (6-6=0) exists → Yes! Found [1,2,3]
// When currentSum=10, check if (10-6=4) exists → No
```

**Key insight:** If `prefix[j] - prefix[i] = K`, then subarray from `i` to `j-1` has sum K.

---

### Q2: What's the difference between prefix sum and difference array?

**Answer:** 
- **Prefix sum**: Cumulative sums for range queries (query O(1), update O(n))
- **Difference array**: For range updates efficiently (update O(1), query O(n))

```javascript
// Prefix Sum: Build once, query many times
const prefix = buildPrefixSum([1, 2, 3, 4]);
const sum = rangeSum(prefix, 1, 3);  // O(1)

// Difference Array: Update ranges efficiently
const diff = [1, 1, 1, 1, -3];  // Represents [1, 2, 3, 4, 1]
// Add 5 to range [1, 3]: diff[1] += 5, diff[4] -= 5
// Reconstruct with prefix sum
```

---

### Q3: How would you handle 2D prefix sum for matrix range queries?

**Answer:** Build 2D prefix sum where `prefix[i][j]` = sum of rectangle from (0,0) to (i,j).

```javascript
const build2DPrefix = (matrix) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const prefix = Array(rows + 1).fill(0).map(() => Array(cols + 1).fill(0));
  
  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      prefix[i][j] = matrix[i-1][j-1] 
                   + prefix[i-1][j] 
                   + prefix[i][j-1] 
                   - prefix[i-1][j-1];  // Subtract overlap
    }
  }
  
  return prefix;
};

const rangeSum2D = (prefix, r1, c1, r2, c2) => {
  // Sum of rectangle from (r1,c1) to (r2,c2)
  return prefix[r2+1][c2+1] 
       - prefix[r1][c2+1] 
       - prefix[r2+1][c1] 
       + prefix[r1][c1];  // Add back overlap
};
```

---

### Q4: Find the equilibrium index where left sum equals right sum.

**Answer:** An equilibrium index is where sum of elements before it equals sum after it.

```javascript
const findEquilibriumIndex = (arr) => {
  const prefix = buildPrefixSum(arr);
  const total = prefix[prefix.length - 1];
  
  for (let i = 0; i < arr.length; i++) {
    const leftSum = prefix[i];  // Sum before index i
    const rightSum = total - prefix[i + 1];  // Sum after index i
    
    if (leftSum === rightSum) {
      return i;
    }
  }
  
  return -1;  // No equilibrium found
};

// Example: [1, 3, 5, 2, 2]
// Index 2 (value=5): left=[1,3]=4, right=[2,2]=4 → Equilibrium!
```

---

### Q5: How do you optimize space if you only need range sums, not individual prefix values?

**Answer:** You can't reduce space below O(n) if you need O(1) queries. But you can optimize by:

```javascript
// If you only need total sum: O(1) space
const totalSum = arr.reduce((sum, num) => sum + num, 0);

// If queries are sequential (e.g., always extending range):
let runningSum = 0;
for (let i = start; i <= end; i++) {
  runningSum += arr[i];  // O(k) where k = range size
}

// For many random queries: Must use full prefix array O(n)
```

---

### Q6: Can prefix sum work with negative numbers? What about overflow?

**Answer:** Yes, prefix sum works with negative numbers. For overflow:

```javascript
// Negative numbers work fine
const arr = [5, -3, 2, -1, 4];
const prefix = buildPrefixSum(arr);  // [0, 5, 2, 4, 3, 7]
const sum = rangeSum(prefix, 1, 3);  // -3 + 2 + (-1) = -2

// For very large numbers (overflow protection):
const buildSafePrefix = (arr) => {
  const prefix = [0];
  
  for (const num of arr) {
    const next = prefix[prefix.length - 1] + num;
    
    // Check overflow
    if (!Number.isSafeInteger(next)) {
      throw new RangeError('Integer overflow detected');
    }
    
    prefix.push(next);
  }
  
  return prefix;
};
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Off-By-One Errors in Range Queries

❌ **BAD:**
```javascript
// Wrong indexing
const rangeSum = (prefix, left, right) => {
  return prefix[right] - prefix[left];  // ❌ Misses one element!
};

// Input: arr = [1, 2, 3], prefix = [0, 1, 3, 6]
// rangeSum(0, 2) = prefix[2] - prefix[0] = 3 - 0 = 3
// Expected: 1 + 2 + 3 = 6, Got: 3 (WRONG!)
```

✅ **GOOD:**
```javascript
// Correct indexing
const rangeSum = (prefix, left, right) => {
  return prefix[right + 1] - prefix[left];  // ✅ Includes both ends
};

// rangeSum(0, 2) = prefix[3] - prefix[0] = 6 - 0 = 6 ✓
```

**Why it breaks:** The prefix array is 1-indexed (prefix[i] = sum of first i elements). To get sum from index L to R (inclusive), use `prefix[R+1] - prefix[L]`.

---

### Pitfall 2: Forgetting to Handle Empty Input

❌ **BAD:**
```javascript
const buildPrefixSum = (arr) => {
  const prefix = [0];
  for (let i = 0; i < arr.length; i++) {  // ❌ Crashes if arr is null
    prefix.push(prefix[i] + arr[i]);
  }
  return prefix;
};

// buildPrefixSum(null) → Error: Cannot read property 'length' of null
```

✅ **GOOD:**
```javascript
const buildPrefixSum = (arr) => {
  if (!arr || arr.length === 0) return [0];  // ✅ Handle edge cases
  
  const prefix = [0];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
  }
  return prefix;
};

// buildPrefixSum(null) → [0]
// buildPrefixSum([]) → [0]
```

**Why it matters:** Production code must handle invalid inputs gracefully. Always validate before processing.

---

### Pitfall 3: Rebuilding Prefix Sum for Every Update

❌ **BAD:**
```javascript
class DataManager {
  constructor(arr) {
    this.data = arr;
  }
  
  update(index, value) {
    this.data[index] = value;
    this.prefix = buildPrefixSum(this.data);  // ❌ O(n) rebuild every time!
  }
  
  query(left, right) {
    return rangeSum(this.prefix, left, right);
  }
}

// 1000 updates = O(1000 * n) = very slow!
```

✅ **GOOD:**
```javascript
// Option 1: If updates are rare, rebuild is fine
// Option 2: If updates are frequent, use Segment Tree

// Option 3: For sparse updates, update incrementally
class DataManager {
  constructor(arr) {
    this.data = arr;
    this.prefix = buildPrefixSum(arr);
  }
  
  update(index, value) {
    const delta = value - this.data[index];
    this.data[index] = value;
    
    // Update all affected prefix sums (still O(n) but faster in practice)
    for (let i = index + 1; i < this.prefix.length; i++) {
      this.prefix[i] += delta;
    }
  }
}
```

**Why it matters:** Rebuilding O(n) for every update defeats the purpose. Consider data access patterns before choosing data structure.

---

### Pitfall 4: Using Prefix Sum for Non-Additive Operations

❌ **BAD:**
```javascript
// Trying to use prefix sum for range minimum
const buildMinPrefix = (arr) => {
  const prefix = [Infinity];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(Math.min(prefix[i], arr[i]));  // ❌ Won't work for ranges!
  }
  return prefix;
};

// This gives minimum from START to index, not arbitrary ranges
```

✅ **GOOD:**
```javascript
// For range min/max, use Sparse Table or Segment Tree
class RangeMinQuery {
  constructor(arr) {
    this.arr = arr;
    this.table = this._buildSparseTable(arr);
  }
  
  _buildSparseTable(arr) {
    // Sparse table for RMQ: O(n log n) build, O(1) query
    // ... implementation ...
  }
  
  rangeMin(left, right) {
    // O(1) query using sparse table
    // ... implementation ...
  }
}

// Or for simplicity (if few queries): Just iterate
const rangeMin = (arr, left, right) => {
  let min = arr[left];
  for (let i = left + 1; i <= right; i++) {
    min = Math.min(min, arr[i]);
  }
  return min;  // O(n) but correct
};
```

**Why it matters:** Prefix sum only works for operations that are **invertible** (addition/subtraction). Min/Max are not invertible, so you can't subtract to get range values.

---

## 🔟 Time & Space Complexity

| **Operation** | **Time Complexity** | **Space Complexity** | **Explanation** |
|---------------|---------------------|----------------------|-----------------|
| **Build prefix sum** | O(n) | O(n) | Single pass through array; store n+1 values |
| **Range sum query** | O(1) | O(1) | Subtraction of two values |
| **Update single element** | O(n) | O(1) | Must rebuild entire prefix array |
| **Count subarrays with sum K** | O(n) | O(n) | Single pass with hash map |
| **Find equilibrium index** | O(n) | O(n) | Single pass after building prefix |
| **2D prefix sum build** | O(n*m) | O(n*m) | Iterate all cells in matrix |
| **2D range sum query** | O(1) | O(1) | Four array accesses |
| **Multiple queries (q queries)** | O(n + q) | O(n) | O(n) build + O(1) per query |

### Why Prefix Sum is O(n) build, O(1) query:

```javascript
// Build: O(n)
for (let i = 0; i < n; i++) {           // n iterations
  prefix[i + 1] = prefix[i] + arr[i];   // O(1) operation
}
// Total: n * O(1) = O(n)

// Query: O(1)
return prefix[right + 1] - prefix[left];  // Two array accesses: O(1)

// Multiple queries:
// Build once: O(n)
// Query q times: q * O(1) = O(q)
// Total: O(n + q)
// Compare to brute force: O(n * q) for summing each range
```

**Key Insight:** The preprocessing investment of O(n) pays off when you have many queries. With q queries:
- **Prefix sum:** O(n + q)
- **Brute force:** O(n × q)
- **Speedup:** ~1000x when q=1000

---

## Summary

### 📊 Quick Reference

| **Category** | **Key Takeaway** |
|--------------|------------------|
| **Definition** | Precomputed cumulative sums for O(1) range queries |
| **Build Time** | O(n) - single pass to create prefix array |
| **Query Time** | O(1) - simple subtraction of two values |
| **Update Time** | O(n) - requires rebuild (use segment tree if frequent) |
| **Space** | O(n) - store n+1 prefix sums |
| **Best For** | Many queries, few updates; range sum problems |
| **Formula** | `rangeSum(L, R) = prefix[R+1] - prefix[L]` |

### 🎯 5 Key Takeaways

1. **Prefix sum trades space for time** by preprocessing O(n) to answer range queries in O(1) instead of O(n)
2. **Use prefix[0] = 0 as base case** to avoid special handling for queries starting at index 0
3. **Perfect for read-heavy workloads** like analytics dashboards and reporting where data is queried frequently but updated rarely
4. **Enables O(n) solutions** to problems that seem O(n²), like counting subarrays with target sum using hash map of prefix sums
5. **Not suitable for range min/max** or frequent updates; prefix sum only works for invertible operations (addition) and static/rarely-updated data

---

## 📚 Further Reading

- [LeetCode Prefix Sum Pattern](https://leetcode.com/tag/prefix-sum/) - Practice problems with varying difficulty
- [MDN Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) - Understanding cumulative operations
- [GeeksforGeeks Prefix Sum](https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/) - Additional examples and applications

---

### 🔗 Related Resources in This Repo

- [Sliding Window Technique](sliding_window.md) - Complementary pattern for contiguous subarray problems
- [Two-Pointer Technique](two_pointer_technique.md) - Another efficient array traversal pattern

---

<!-- quiz-start -->
### Q1: What is the time complexity of answering q range sum queries using prefix sum vs brute force?
- [ ] Both are O(n*q)
- [x] Prefix sum is O(n+q), brute force is O(n*q)
- [ ] Prefix sum is O(q), brute force is O(n)
- [ ] They have the same complexity

### Q2: Why do we use prefix[0] = 0 as the base case?
- [ ] To save memory by starting from 0
- [ ] Because arrays are 0-indexed in JavaScript
- [x] To avoid special cases when the query range starts at index 0
- [ ] It's just a convention with no technical reason

### Q3: How would you find a subarray with sum equal to K using prefix sum?
- [ ] Build prefix sum and check all pairs of indices
- [ ] Sort the prefix sum array and use binary search
- [x] Use a hash map to store prefix sums and check if (currentSum - K) exists
- [ ] Prefix sum cannot solve this problem
<!-- quiz-end -->
