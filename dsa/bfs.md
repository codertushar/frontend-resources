---
date: 2025-12-29T18:06:42+00:00
description: Master Breadth-First Search (BFS) for efficient graph and tree traversal - a critical pattern for frontend interview coding challenges involving level-order processing and shortest paths.
premium: false
---

# 🎯 Breadth-First Search (BFS): Level-Order Traversal Pattern for Frontend Interviews

> **Interview Importance:** 🔴 Critical — This technique appears in 40% of frontend coding interviews for tree/graph traversal, component hierarchy navigation, and shortest path problems. Essential for DOM manipulation and state management questions.

---

## 1️⃣ What is Breadth-First Search (BFS)?

**Breadth-First Search (BFS)** is a graph/tree traversal algorithm that explores nodes level by level, visiting all neighbors at the current depth before moving to nodes at the next depth level. It uses a **queue** data structure to maintain the order of exploration.

**Visual Representation:**

```
         1
       /   \
      2     3
     / \   / \
    4   5 6   7

BFS Traversal Order: 1 → 2 → 3 → 4 → 5 → 6 → 7

Level 0:  [1]
Level 1:  [2, 3]
Level 2:  [4, 5, 6, 7]

Queue Evolution:
Start:     [1]
Process 1: [2, 3]         (dequeue 1, enqueue children 2,3)
Process 2: [3, 4, 5]      (dequeue 2, enqueue children 4,5)
Process 3: [4, 5, 6, 7]   (dequeue 3, enqueue children 6,7)
Process 4: [5, 6, 7]      (dequeue 4)
Process 5: [6, 7]         (dequeue 5)
Process 6: [7]            (dequeue 6)
Process 7: []             (dequeue 7, done!)
```

**Real-World Analogy:**

Think of BFS like ripples in water when you drop a stone. The ripples expand outward in concentric circles - first the innermost circle, then the next circle, and so on. Similarly, BFS explores all nodes at distance 1 from the start, then all nodes at distance 2, and so forth. This is exactly how Facebook's "People You May Know" suggestion works - it shows friends of friends (2 hops away) before showing friends of friends of friends (3 hops away).

---

## 2️⃣ Why Use BFS? / Why Does This Matter?

| **Problem Type** | **Without BFS** | **With BFS** | **Benefit** |
|------------------|----------------|--------------|-------------|
| Find shortest path in unweighted graph | DFS might find longer path | BFS guarantees shortest | Optimal solution |
| Level-order traversal | Complex recursion with levels | Natural queue-based iteration | Simpler implementation |
| Find nearest node | Check all nodes randomly | Explore by distance | First found = nearest |
| DOM tree traversal | Recursive depth-first | Iterative breadth-first | Better for large DOMs |
| Component dependency resolution | May process out of order | Processes dependencies first | Correct execution order |

**Performance Benefits:**
- Guarantees **shortest path** in unweighted graphs/trees
- **O(V + E)** time complexity where V = vertices, E = edges
- Perfect for **level-by-level** processing needs
- Powers features like: friend suggestions, auto-complete, site crawlers, dependency resolution

---

## 3️⃣ How It Works — Basic Implementation

### BFS on a Binary Tree (Level-Order)

```javascript
/**
 * Binary tree node structure
 */
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * BFS traversal of binary tree (level-order)
 * @param {TreeNode} root - Root of the tree
 * @returns {number[]} - Array of values in BFS order
 */
const bfsTraversal = (root) => {
  if (!root) return [];  // Edge case: empty tree
  
  const result = [];
  const queue = [root];  // Initialize queue with root
  
  while (queue.length > 0) {
    const node = queue.shift();  // Dequeue front element
    result.push(node.val);       // Process current node
    
    // Enqueue children (left to right)
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
};
```

### 🔍 Dry Run: BFS Tree Traversal

**Input Tree:**
```
      1
     / \
    2   3
   / \
  4   5
```

```
Initial State:
─────────────────────────────────────────────────────────
  root = TreeNode(1)
  result = []
  queue = [Node(1)]

Iteration 1: Process Node(1)
─────────────────────────────────────────────────────────
  Dequeue: node = Node(1)
  Process: result = [1]
  Enqueue left child: queue = [Node(2)]
  Enqueue right child: queue = [Node(2), Node(3)]
  State: result=[1], queue=[Node(2), Node(3)]

Iteration 2: Process Node(2)
─────────────────────────────────────────────────────────
  Dequeue: node = Node(2)
  Process: result = [1, 2]
  Enqueue left child: queue = [Node(3), Node(4)]
  Enqueue right child: queue = [Node(3), Node(4), Node(5)]
  State: result=[1,2], queue=[Node(3), Node(4), Node(5)]

Iteration 3: Process Node(3)
─────────────────────────────────────────────────────────
  Dequeue: node = Node(3)
  Process: result = [1, 2, 3]
  No children to enqueue
  State: result=[1,2,3], queue=[Node(4), Node(5)]

Iteration 4: Process Node(4)
─────────────────────────────────────────────────────────
  Dequeue: node = Node(4)
  Process: result = [1, 2, 3, 4]
  No children to enqueue
  State: result=[1,2,3,4], queue=[Node(5)]

Iteration 5: Process Node(5)
─────────────────────────────────────────────────────────
  Dequeue: node = Node(5)
  Process: result = [1, 2, 3, 4, 5]
  No children to enqueue
  State: result=[1,2,3,4,5], queue=[]

Queue empty, exit loop
Result: [1, 2, 3, 4, 5] (level-order: 1 → 2,3 → 4,5)
```

**Time Complexity:** O(n) - visit each node once  
**Space Complexity:** O(w) - where w is maximum width of tree (queue size)

---

## 4️⃣ Understanding Key Concepts

### Why Use a Queue Instead of a Stack?

```javascript
// ❌ Using Stack (gives DFS, not BFS):
const stack = [root];
while (stack.length > 0) {
  const node = stack.pop();  // LIFO: Last In, First Out
  // Processes: 1 → 3 → 7 → 6 → 2 → 5 → 4 (depth-first)
}

// ✅ Using Queue (gives BFS):
const queue = [root];
while (queue.length > 0) {
  const node = queue.shift();  // FIFO: First In, First Out
  // Processes: 1 → 2 → 3 → 4 → 5 → 6 → 7 (breadth-first)
}
```

**Key insight:** Queue ensures we process nodes in the order they were discovered, which naturally gives us level-by-level traversal.

### What Breaks Without Proper Null Checks?

```javascript
// ❌ BAD: No null check
const bfs = (root) => {
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    queue.push(node.left);   // ❌ Crashes if node.left is null!
    queue.push(node.right);
  }
};

// ✅ GOOD: Proper null checks
const bfs = (root) => {
  if (!root) return [];  // Handle empty tree
  
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.left) queue.push(node.left);    // ✅ Check before adding
    if (node.right) queue.push(node.right);
  }
};
```

### Why BFS Finds Shortest Path

```javascript
// In unweighted graph, first time we reach a node = shortest path
// Because BFS explores by distance:
// - Distance 0: Start node
// - Distance 1: All neighbors of start
// - Distance 2: All neighbors of distance-1 nodes
// - ...

// First time we reach target = minimum distance traveled
```

---

## 5️⃣ Production/Advanced Implementation

### Complete BFS with Level Tracking

```javascript
/**
 * BFS with level information
 * Returns array of levels, each level is an array of values
 */
const levelOrderTraversal = (root) => {
  if (!root) return [];
  
  const levels = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;  // Nodes at current level
    const currentLevel = [];
    
    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      // Add children for next level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    levels.push(currentLevel);
  }
  
  return levels;
};
```

### BFS for Graphs with Visited Tracking

```javascript
/**
 * BFS on graph (adjacency list representation)
 * Handles cycles with visited set
 */
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  addEdge(v1, v2) {
    this.adjacencyList.get(v1).push(v2);
    this.adjacencyList.get(v2).push(v1);  // Undirected graph
  }
  
  bfs(start) {
    if (!this.adjacencyList.has(start)) {
      throw new Error(`Vertex ${start} not found`);
    }
    
    const result = [];
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);
      
      // Visit all neighbors
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);  // Mark as visited
          queue.push(neighbor);   // Add to queue
        }
      }
    }
    
    return result;
  }
  
  /**
   * Find shortest path between two vertices
   */
  shortestPath(start, end) {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return null;
    }
    
    const visited = new Set([start]);
    const queue = [[start, [start]]];  // [vertex, path]
    
    while (queue.length > 0) {
      const [vertex, path] = queue.shift();
      
      // Found the target
      if (vertex === end) {
        return path;
      }
      
      // Explore neighbors
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
    
    return null;  // No path found
  }
  
  /**
   * Find distance from start to all reachable vertices
   */
  distances(start) {
    if (!this.adjacencyList.has(start)) return null;
    
    const distances = new Map([[start, 0]]);
    const queue = [[start, 0]];  // [vertex, distance]
    
    while (queue.length > 0) {
      const [vertex, dist] = queue.shift();
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, dist + 1);
          queue.push([neighbor, dist + 1]);
        }
      }
    }
    
    return distances;
  }
}
```

### 🔍 Dry Run: Shortest Path in Graph

**Graph:**
```
  A --- B
  |     |
  C --- D --- E

Adjacency List:
A: [B, C]
B: [A, D]
C: [A, D]
D: [B, C, E]
E: [D]
```

**Find shortest path from A to E:**

```
Initial State:
─────────────────────────────────────────────────────────
  start = 'A', end = 'E'
  visited = {'A'}
  queue = [['A', ['A']]]

Iteration 1: Process vertex 'A'
─────────────────────────────────────────────────────────
  Dequeue: ['A', ['A']]
  vertex = 'A', path = ['A']
  vertex !== 'E', continue exploring
  
  Neighbors of A: ['B', 'C']
  - B not visited: add to queue
    visited = {'A', 'B'}
    queue = [['B', ['A', 'B']]]
  - C not visited: add to queue
    visited = {'A', 'B', 'C'}
    queue = [['B', ['A', 'B']], ['C', ['A', 'C']]]

Iteration 2: Process vertex 'B'
─────────────────────────────────────────────────────────
  Dequeue: ['B', ['A', 'B']]
  vertex = 'B', path = ['A', 'B']
  vertex !== 'E', continue exploring
  
  Neighbors of B: ['A', 'D']
  - A already visited: skip
  - D not visited: add to queue
    visited = {'A', 'B', 'C', 'D'}
    queue = [['C', ['A', 'C']], ['D', ['A', 'B', 'D']]]

Iteration 3: Process vertex 'C'
─────────────────────────────────────────────────────────
  Dequeue: ['C', ['A', 'C']]
  vertex = 'C', path = ['A', 'C']
  vertex !== 'E', continue exploring
  
  Neighbors of C: ['A', 'D']
  - A already visited: skip
  - D already visited: skip
  queue = [['D', ['A', 'B', 'D']]]

Iteration 4: Process vertex 'D'
─────────────────────────────────────────────────────────
  Dequeue: ['D', ['A', 'B', 'D']]
  vertex = 'D', path = ['A', 'B', 'D']
  vertex !== 'E', continue exploring
  
  Neighbors of D: ['B', 'C', 'E']
  - B already visited: skip
  - C already visited: skip
  - E not visited: add to queue
    visited = {'A', 'B', 'C', 'D', 'E'}
    queue = [['E', ['A', 'B', 'D', 'E']]]

Iteration 5: Process vertex 'E'
─────────────────────────────────────────────────────────
  Dequeue: ['E', ['A', 'B', 'D', 'E']]
  vertex = 'E', path = ['A', 'B', 'D', 'E']
  vertex === 'E' ✓ Found target!
  
  Return: ['A', 'B', 'D', 'E']

Result: Shortest path from A to E is ['A', 'B', 'D', 'E'] (length: 3 edges)
```

---

## 6️⃣ Real-World Frontend Examples

### Example 1: DOM Tree Traversal

```javascript
/**
 * BFS traversal of DOM elements
 * Use case: Find all elements at a certain depth, collect all text nodes
 */
class DOMTraverser {
  /**
   * Get all elements at a specific level
   */
  static getElementsByLevel(root, targetLevel) {
    if (!root) return [];
    
    const result = [];
    const queue = [[root, 0]];  // [element, level]
    
    while (queue.length > 0) {
      const [element, level] = queue.shift();
      
      if (level === targetLevel) {
        result.push(element);
        continue;  // Don't go deeper once we reach target level
      }
      
      if (level < targetLevel) {
        // Add children for next level
        for (const child of element.children) {
          queue.push([child, level + 1]);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Find nearest element matching selector
   */
  static findNearestElement(root, selector) {
    if (!root) return null;
    
    const queue = [root];
    
    while (queue.length > 0) {
      const element = queue.shift();
      
      // Check if current element matches
      if (element.matches && element.matches(selector)) {
        return element;  // First match = nearest
      }
      
      // Add children to queue
      for (const child of element.children) {
        queue.push(child);
      }
    }
    
    return null;  // Not found
  }
  
  /**
   * Get all text content level by level
   */
  static getTextByLevel(root) {
    if (!root) return [];
    
    const levels = [];
    const queue = [root];
    
    while (queue.length > 0) {
      const levelSize = queue.length;
      const levelText = [];
      
      for (let i = 0; i < levelSize; i++) {
        const element = queue.shift();
        
        // Collect direct text (not from children)
        const text = Array.from(element.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent.trim())
          .filter(text => text.length > 0)
          .join(' ');
        
        if (text) levelText.push(text);
        
        // Add child elements to queue
        for (const child of element.children) {
          queue.push(child);
        }
      }
      
      if (levelText.length > 0) {
        levels.push(levelText);
      }
    }
    
    return levels;
  }
}

// Usage
const root = document.querySelector('#app');
const level2Elements = DOMTraverser.getElementsByLevel(root, 2);
const nearestButton = DOMTraverser.findNearestElement(root, 'button.primary');
const textLevels = DOMTraverser.getTextByLevel(root);
```

### Example 2: React Component Tree Navigation

```javascript
import { Children } from 'react';

/**
 * BFS utilities for React component trees
 * Use case: Find components, analyze hierarchy, debugging
 */
class ReactTreeUtils {
  /**
   * Find all components of a specific type
   */
  static findComponentsByType(element, ComponentType) {
    if (!element) return [];
    
    const result = [];
    const queue = [element];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      // Check if current element is the target type
      if (current.type === ComponentType) {
        result.push(current);
      }
      
      // Add children to queue
      if (current.props && current.props.children) {
        Children.forEach(current.props.children, child => {
          if (child && typeof child === 'object') {
            queue.push(child);
          }
        });
      }
    }
    
    return result;
  }
  
  /**
   * Get component tree depth
   */
  static getTreeDepth(element) {
    if (!element) return 0;
    
    let maxDepth = 0;
    const queue = [[element, 1]];  // [element, depth]
    
    while (queue.length > 0) {
      const [current, depth] = queue.shift();
      maxDepth = Math.max(maxDepth, depth);
      
      if (current.props && current.props.children) {
        Children.forEach(current.props.children, child => {
          if (child && typeof child === 'object') {
            queue.push([child, depth + 1]);
          }
        });
      }
    }
    
    return maxDepth;
  }
  
  /**
   * Find shortest path to component with specific prop
   */
  static findPathToProp(element, propName, propValue) {
    if (!element) return null;
    
    const queue = [[element, [element]]];  // [element, path]
    
    while (queue.length > 0) {
      const [current, path] = queue.shift();
      
      // Check if current has the target prop
      if (current.props && current.props[propName] === propValue) {
        return path;
      }
      
      // Add children with updated path
      if (current.props && current.props.children) {
        Children.forEach(current.props.children, child => {
          if (child && typeof child === 'object') {
            queue.push([child, [...path, child]]);
          }
        });
      }
    }
    
    return null;
  }
}
```

### Example 3: Friend Suggestions (Social Network)

```javascript
/**
 * Friend recommendation system using BFS
 * Use case: Social networks, "People You May Know"
 */
class SocialNetwork {
  constructor() {
    this.connections = new Map();  // adjacency list
  }
  
  addUser(userId) {
    if (!this.connections.has(userId)) {
      this.connections.set(userId, new Set());
    }
  }
  
  addConnection(userId1, userId2) {
    this.addUser(userId1);
    this.addUser(userId2);
    this.connections.get(userId1).add(userId2);
    this.connections.get(userId2).add(userId1);
  }
  
  /**
   * Get friends at specific degree of separation
   * degree=1: direct friends
   * degree=2: friends of friends
   * degree=3: friends of friends of friends
   */
  getFriendsAtDegree(userId, degree) {
    if (!this.connections.has(userId)) return [];
    if (degree === 0) return [userId];
    
    const visited = new Set([userId]);
    const queue = [[userId, 0]];  // [user, currentDegree]
    const result = new Set();
    
    while (queue.length > 0) {
      const [currentUser, currentDegree] = queue.shift();
      
      if (currentDegree === degree) {
        result.add(currentUser);
        continue;  // Don't explore further from target degree
      }
      
      // Explore friends
      const friends = this.connections.get(currentUser);
      for (const friend of friends) {
        if (!visited.has(friend)) {
          visited.add(friend);
          queue.push([friend, currentDegree + 1]);
        }
      }
    }
    
    return Array.from(result);
  }
  
  /**
   * Suggest friends (friends of friends, excluding existing friends)
   */
  suggestFriends(userId, limit = 5) {
    if (!this.connections.has(userId)) return [];
    
    const directFriends = this.connections.get(userId);
    const suggestions = new Map();  // friend -> number of mutual friends
    
    // For each direct friend
    for (const friend of directFriends) {
      // Get friends of friend
      const friendsOfFriend = this.connections.get(friend);
      
      for (const suggestion of friendsOfFriend) {
        // Skip if it's the user themselves or already a friend
        if (suggestion === userId || directFriends.has(suggestion)) {
          continue;
        }
        
        // Count mutual friends
        suggestions.set(
          suggestion,
          (suggestions.get(suggestion) || 0) + 1
        );
      }
    }
    
    // Sort by number of mutual friends and return top N
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])  // Sort by count descending
      .slice(0, limit)
      .map(([userId, mutualCount]) => ({ userId, mutualCount }));
  }
  
  /**
   * Find shortest connection path between two users
   */
  findConnectionPath(userId1, userId2) {
    if (!this.connections.has(userId1) || !this.connections.has(userId2)) {
      return null;
    }
    
    if (userId1 === userId2) return [userId1];
    
    const visited = new Set([userId1]);
    const queue = [[userId1, [userId1]]];  // [user, path]
    
    while (queue.length > 0) {
      const [currentUser, path] = queue.shift();
      
      // Check each friend
      const friends = this.connections.get(currentUser);
      for (const friend of friends) {
        // Found the target
        if (friend === userId2) {
          return [...path, friend];
        }
        
        // Continue BFS
        if (!visited.has(friend)) {
          visited.add(friend);
          queue.push([friend, [...path, friend]]);
        }
      }
    }
    
    return null;  // No connection found
  }
}

// Usage
const network = new SocialNetwork();
['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'].forEach(u => network.addUser(u));

network.addConnection('Alice', 'Bob');
network.addConnection('Alice', 'Charlie');
network.addConnection('Bob', 'David');
network.addConnection('Charlie', 'Eve');
network.addConnection('David', 'Frank');

console.log(network.getFriendsAtDegree('Alice', 2));  // Friends of friends
console.log(network.suggestFriends('Alice', 3));      // Top 3 suggestions
console.log(network.findConnectionPath('Alice', 'Frank'));  // Shortest path
```

---

## 7️⃣ Comparisons

### BFS vs DFS vs Dijkstra

| **Aspect** | **BFS** | **DFS** | **Dijkstra** |
|------------|---------|---------|--------------|
| **Data Structure** | Queue (FIFO) | Stack/Recursion (LIFO) | Priority Queue (Min-Heap) |
| **Traversal Order** | Level by level | Depth first | By edge weight |
| **Shortest Path** | ✅ Yes (unweighted) | ❌ No | ✅ Yes (weighted) |
| **Time Complexity** | O(V + E) | O(V + E) | O((V + E) log V) |
| **Space Complexity** | O(w) width | O(h) height | O(V) |
| **Best For** | Shortest path, level-order | Topological sort, cycle detection | Weighted shortest path |
| **Frontend Use** | DOM traversal, friends at distance | Component tree, dependency resolution | Route planning, network optimization |

### When to Use Which?

```javascript
// ✅ Use BFS when:
// - Need shortest path in unweighted graph
// - Process nodes level by level
// - Find nearest/closest node
"Find shortest path between two users"
"Get all DOM elements at level 3"
"Find closest matching element"

// ✅ Use DFS when:
// - Need to explore all paths
// - Topological sorting
// - Detect cycles
// - Less memory (height < width)
"Find all paths from A to B"
"Detect circular dependencies"
"Component tree depth-first traversal"

// ✅ Use Dijkstra when:
// - Graph has weighted edges
// - Need shortest weighted path
"Find fastest route (time-weighted)"
"Minimum cost path"
"Network packet routing"

// ❌ Don't use BFS when:
// - Graph has weighted edges (use Dijkstra)
// - Only need to check reachability (DFS is simpler)
// - Tree is very wide (BFS queue gets huge)
```

---

## 8️⃣ Common Interview Questions

### Q1: How do you implement BFS without recursion?

**Answer:** BFS is naturally iterative using a queue. Recursion is more suited for DFS.

```javascript
// BFS: Always iterative with queue
const bfs = (root) => {
  const queue = [root];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
};

// Note: You CAN do BFS recursively, but it's awkward and inefficient
const bfsRecursive = (queue, result = []) => {
  if (queue.length === 0) return result;
  
  const node = queue.shift();
  result.push(node.val);
  
  if (node.left) queue.push(node.left);
  if (node.right) queue.push(node.right);
  
  return bfsRecursive(queue, result);
};
```

---

### Q2: How do you handle a disconnected graph with BFS?

**Answer:** Run BFS from each unvisited vertex to cover all components.

```javascript
const bfsAllComponents = (graph) => {
  const visited = new Set();
  const allComponents = [];
  
  for (const vertex of graph.keys()) {
    if (!visited.has(vertex)) {
      const component = [];
      const queue = [vertex];
      visited.add(vertex);
      
      while (queue.length > 0) {
        const current = queue.shift();
        component.push(current);
        
        for (const neighbor of graph.get(current)) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      
      allComponents.push(component);
    }
  }
  
  return allComponents;
};
```

---

### Q3: Find the right side view of a binary tree.

**Answer:** Use BFS with level tracking, take the last node at each level.

```javascript
const rightSideView = (root) => {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      // Last node at this level
      if (i === levelSize - 1) {
        result.push(node.val);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return result;
};

// Example:
//       1
//      / \
//     2   3
//      \
//       5
// Right view: [1, 3, 5]
```

---

### Q4: How do you implement a zigzag level order traversal?

**Answer:** Use BFS with a flag to alternate direction at each level.

```javascript
const zigzagLevelOrder = (root) => {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  let leftToRight = true;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      // Add to level based on direction
      if (leftToRight) {
        currentLevel.push(node.val);
      } else {
        currentLevel.unshift(node.val);  // Add to front
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
    leftToRight = !leftToRight;  // Flip direction
  }
  
  return result;
};

// Example:
//       1
//      / \
//     2   3
//    / \   \
//   4   5   6
// Zigzag: [[1], [3,2], [4,5,6]]
```

---

### Q5: Find if there's a path between two nodes in a graph.

**Answer:** Use BFS from start node, return true if we reach end node.

```javascript
const hasPath = (graph, start, end) => {
  if (start === end) return true;
  if (!graph.has(start) || !graph.has(end)) return false;
  
  const visited = new Set([start]);
  const queue = [start];
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current === end) return true;
    
    for (const neighbor of graph.get(current)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return false;
};
```

---

### Q6: How do you find the shortest distance from a node to all other nodes?

**Answer:** BFS from the start node, track distance to each node.

```javascript
const shortestDistances = (graph, start) => {
  const distances = new Map([[start, 0]]);
  const queue = [[start, 0]];
  
  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    
    for (const neighbor of graph.get(node)) {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, dist + 1);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  
  return distances;
};
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Using shift() on Array (Performance Issue)

❌ **BAD:**
```javascript
const bfs = (root) => {
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();  // ❌ O(n) operation!
    // Process node...
    queue.push(node.left);
    queue.push(node.right);
  }
};
// Time complexity: O(n²) due to shift()
```

✅ **GOOD:**
```javascript
// Option 1: Use index pointer (best for interviews)
const bfs = (root) => {
  const queue = [root];
  let index = 0;
  
  while (index < queue.length) {
    const node = queue[index++];  // ✅ O(1) operation
    // Process node...
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
};

// Option 2: Use a proper Queue class
class Queue {
  constructor() {
    this.items = {};
    this.front = 0;
    this.rear = 0;
  }
  
  enqueue(item) {
    this.items[this.rear] = item;
    this.rear++;
  }
  
  dequeue() {
    const item = this.items[this.front];
    delete this.items[this.front];
    this.front++;
    return item;
  }
  
  isEmpty() {
    return this.front === this.rear;
  }
}
```

**Why it matters:** `shift()` is O(n) because it re-indexes the entire array. For large trees/graphs, this kills performance.

---

### Pitfall 2: Forgetting to Mark Nodes as Visited (Infinite Loop)

❌ **BAD:**
```javascript
const bfs = (graph, start) => {
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    // ❌ No visited tracking in graph with cycles!
    for (const neighbor of graph.get(node)) {
      queue.push(neighbor);  // Adds nodes multiple times
    }
  }
  
  return result;
};
// Result: Infinite loop if graph has cycles
```

✅ **GOOD:**
```javascript
const bfs = (graph, start) => {
  const visited = new Set([start]);  // ✅ Track visited nodes
  const queue = [start];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {  // ✅ Check before adding
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
};
```

**Why it matters:** Graphs can have cycles. Without visited tracking, BFS will loop forever.

---

### Pitfall 3: Incorrect Level Tracking

❌ **BAD:**
```javascript
const levelOrder = (root) => {
  const result = [];
  const queue = [root];
  let level = 0;
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    if (!result[level]) result[level] = [];
    result[level].push(node.val);  // ❌ All nodes go to same level!
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
};
// Result: All nodes in one level array
```

✅ **GOOD:**
```javascript
const levelOrder = (root) => {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;  // ✅ Snapshot of current level size
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {  // ✅ Process exactly one level
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
};
```

**Why it matters:** Need to process all nodes at current level before moving to next. Snapshot `queue.length` before the for loop.

---

### Pitfall 4: Not Handling Null Root

❌ **BAD:**
```javascript
const bfs = (root) => {
  const queue = [root];  // ❌ If root is null, queue has [null]
  
  while (queue.length > 0) {
    const node = queue.shift();
    console.log(node.val);  // ❌ Crashes: Cannot read 'val' of null
  }
};
```

✅ **GOOD:**
```javascript
const bfs = (root) => {
  if (!root) return [];  // ✅ Handle null root upfront
  
  const queue = [root];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
};
```

**Why it matters:** Always validate input before processing. Null/undefined roots are common edge cases.

---

## 🔟 Time & Space Complexity

| **Operation** | **Time Complexity** | **Space Complexity** | **Explanation** |
|---------------|---------------------|----------------------|-----------------|
| **BFS tree traversal** | O(n) | O(w) | Visit each node once; queue holds max width |
| **BFS graph traversal** | O(V + E) | O(V) | Visit each vertex and edge once; queue + visited set |
| **Shortest path (unweighted)** | O(V + E) | O(V) | BFS guarantees shortest in unweighted graphs |
| **Level-order traversal** | O(n) | O(w) | Process each level; max width in queue |
| **Find if path exists** | O(V + E) | O(V) | Early termination when target found |
| **Count nodes at level k** | O(n) | O(w) | Stop at level k, but worst case is full tree |
| **Rightmost node per level** | O(n) | O(w) | Track last node at each level |

### Why BFS is O(V + E) for Graphs:

```javascript
// Vertices: Each vertex enqueued and dequeued once = O(V)
for (const vertex of allVertices) {  // Outer: O(V)
  visited.add(vertex);
  queue.push(vertex);
}

// Edges: Each edge examined once = O(E)
for (const neighbor of graph.get(vertex)) {  // Inner: Total O(E) across all iterations
  if (!visited.has(neighbor)) {
    queue.push(neighbor);
  }
}

// Total: O(V + E)
```

### Space Complexity - Why O(w) for Trees?

```javascript
// Worst case: Queue holds one complete level
// Perfect binary tree: width at level h = 2^h

//           1                Level 0: 1 node
//         /   \
//        2     3             Level 1: 2 nodes  
//       / \   / \
//      4  5  6  7            Level 2: 4 nodes (widest level)
//     /
//    8                       Level 3: 1 node

// At level 2, queue = [4, 5, 6, 7] → size = 4 = max width
// Space: O(w) where w = maximum width
```

**Key Insight:** BFS queue size is proportional to tree width, not height. For complete binary trees, worst case is O(n/2) = O(n) at the last level.

---

## Summary

### 📊 Quick Reference

| **Category** | **Key Takeaway** |
|--------------|------------------|
| **Definition** | Level-by-level traversal using a queue (FIFO) |
| **Data Structure** | Queue for node exploration order |
| **Traversal Order** | Breadth-first: all nodes at distance k before distance k+1 |
| **Shortest Path** | Guarantees shortest path in unweighted graphs |
| **Time Complexity** | O(V + E) for graphs, O(n) for trees |
| **Space Complexity** | O(w) for trees (width), O(V) for graphs (visited set) |
| **vs DFS** | BFS: level-order, shortest path; DFS: depth-first, backtracking |

### 🎯 5 Key Takeaways

1. **BFS uses a queue** (FIFO) to explore nodes level by level, naturally finding shortest paths in unweighted graphs
2. **Always track visited nodes** in graphs with cycles to prevent infinite loops - use a Set for O(1) lookup
3. **Queue size determines space complexity**: O(w) for trees where w is maximum width, often O(n) for last level of complete trees
4. **Level tracking requires snapshot**: capture `queue.length` before processing each level to separate levels correctly
5. **Perfect for frontend**: DOM traversal, component hierarchy navigation, friend suggestions, shortest path in unweighted networks

---

## 📚 Further Reading

- [LeetCode BFS Problems](https://leetcode.com/tag/breadth-first-search/) - Practice problems with varying difficulty
- [MDN Web APIs - TreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker) - Browser API for DOM traversal
- [Graph Theory Basics](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/) - Understanding graph representations

---

### 🔗 Related Resources in This Repo

- [DFS (Depth-First Search)](dfs.md) - Complementary graph traversal pattern
- [Two-Pointer Technique](two_pointer_technique.md) - Array traversal pattern
- [Sliding Window](sliding_window.md) - Contiguous subarray pattern

---

<!-- quiz-start -->
### Q1: What data structure does BFS use, and why?
- [ ] Stack, because it processes nodes in LIFO order
- [x] Queue, because it processes nodes in FIFO order for level-by-level traversal
- [ ] Hash map, for O(1) lookups
- [ ] Array, for random access

### Q2: Why does BFS guarantee the shortest path in unweighted graphs?
- [ ] Because it uses recursion to find optimal solutions
- [ ] Because it sorts nodes by distance first
- [x] Because it explores nodes by increasing distance from start, so the first time it reaches a node is via the shortest path
- [ ] BFS does not guarantee shortest path

### Q3: What is the space complexity of BFS for a complete binary tree with n nodes?
- [ ] O(1) constant space
- [ ] O(log n) for the height
- [x] O(n) worst case, as the queue can hold up to n/2 nodes at the last level
- [ ] O(n²) for adjacency matrix
<!-- quiz-end -->
