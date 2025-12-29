---
date: 2025-12-29T18:06:42+00:00
description: Master Depth-First Search (DFS) for efficient graph and tree traversal - a critical pattern for frontend interview coding challenges involving backtracking, cycle detection, and component tree navigation.
premium: false
---

# 🎯 Depth-First Search (DFS): Deep Traversal Pattern for Frontend Interviews

> **Interview Importance:** 🔴 Critical — This technique appears in 45% of frontend coding interviews for tree/graph traversal, backtracking problems, and component hierarchy analysis. Essential for React component trees, dependency resolution, and path finding.

---

## 1️⃣ What is Depth-First Search (DFS)?

**Depth-First Search (DFS)** is a graph/tree traversal algorithm that explores as far as possible along each branch before backtracking. It uses a **stack** (either explicitly or via recursion call stack) to track the path, going deep into the structure before exploring siblings.

**Visual Representation:**

```
         1
       /   \
      2     3
     / \   / \
    4   5 6   7

DFS Traversal Orders:

Pre-order (Root → Left → Right):   1 → 2 → 4 → 5 → 3 → 6 → 7
In-order (Left → Root → Right):    4 → 2 → 5 → 1 → 6 → 3 → 7
Post-order (Left → Right → Root):  4 → 5 → 2 → 6 → 7 → 3 → 1

Stack Evolution (Pre-order):
Start:     [1]
Process 1: [3, 2]         (pop 1, push right 3, push left 2)
Process 2: [3, 5, 4]      (pop 2, push right 5, push left 4)
Process 4: [3, 5]         (pop 4, no children)
Process 5: [3]            (pop 5, no children)
Process 3: [7, 6]         (pop 3, push right 7, push left 6)
Process 6: [7]            (pop 6, no children)
Process 7: []             (pop 7, done!)
```

**Real-World Analogy:**

Think of DFS like exploring a maze. You go down one path as far as you can, and only when you hit a dead end do you backtrack to try a different route. This is like how file explorers work - you open a folder, go into its first subfolder, then into that subfolder's first subfolder, and so on, until you reach the deepest level before coming back up.

---

## 2️⃣ Why Use DFS? / Why Does This Matter?

| **Problem Type** | **Without DFS** | **With DFS** | **Benefit** |
|------------------|----------------|--------------|-------------|
| Find all paths | Iterate all possibilities | Backtracking with DFS | Natural recursion |
| Detect cycles in graph | Complex state tracking | DFS with visited set | Simple detection |
| Topological sort | Manual dependency ordering | DFS with finish times | Optimal ordering |
| Component tree traversal | Manual stack management | Recursive DFS | Clean code |
| Solve maze/puzzle | Random exploration | DFS backtracking | Systematic search |

**Performance Benefits:**
- **O(V + E)** time complexity for graphs (same as BFS)
- **O(h)** space for trees (height), better than BFS's O(w) when tree is tall and narrow
- Perfect for **backtracking** problems
- Powers features like: file tree navigation, React component inspection, dependency resolution, path finding

---

## 3️⃣ How It Works — Basic Implementation

### Recursive DFS (Most Common)

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
 * DFS traversal - Pre-order (Root → Left → Right)
 * @param {TreeNode} root - Root of the tree
 * @returns {number[]} - Array of values in DFS order
 */
const dfsPreorder = (root) => {
  if (!root) return [];  // Base case: null node
  
  const result = [];
  
  result.push(root.val);                    // Process root
  result.push(...dfsPreorder(root.left));   // Recurse left
  result.push(...dfsPreorder(root.right));  // Recurse right
  
  return result;
};

/**
 * DFS traversal - In-order (Left → Root → Right)
 */
const dfsInorder = (root) => {
  if (!root) return [];
  
  const result = [];
  
  result.push(...dfsInorder(root.left));    // Recurse left
  result.push(root.val);                    // Process root
  result.push(...dfsInorder(root.right));   // Recurse right
  
  return result;
};

/**
 * DFS traversal - Post-order (Left → Right → Root)
 */
const dfsPostorder = (root) => {
  if (!root) return [];
  
  const result = [];
  
  result.push(...dfsPostorder(root.left));   // Recurse left
  result.push(...dfsPostorder(root.right));  // Recurse right
  result.push(root.val);                     // Process root
  
  return result;
};
```

### 🔍 Dry Run: DFS Pre-order Traversal

**Input Tree:**
```
      1
     / \
    2   3
   / \
  4   5
```

```
Call Stack Trace:

Call 1: dfsPreorder(Node(1))
─────────────────────────────────────────────────────────
  root = Node(1)
  result = []
  
  Step 1: Process root
    result = [1]
  
  Step 2: Recurse left (Node(2))
    → Call dfsPreorder(Node(2))
  
Call 2: dfsPreorder(Node(2))
─────────────────────────────────────────────────────────
  root = Node(2)
  result = []
  
  Step 1: Process root
    result = [2]
  
  Step 2: Recurse left (Node(4))
    → Call dfsPreorder(Node(4))
  
Call 3: dfsPreorder(Node(4))
─────────────────────────────────────────────────────────
  root = Node(4)
  result = []
  
  Step 1: Process root
    result = [4]
  
  Step 2: Recurse left (null)
    → Returns []
  
  Step 3: Recurse right (null)
    → Returns []
  
  Return: [4]

Back to Call 2: dfsPreorder(Node(2))
─────────────────────────────────────────────────────────
  result = [2, 4]  (after left recursion)
  
  Step 3: Recurse right (Node(5))
    → Call dfsPreorder(Node(5))

Call 4: dfsPreorder(Node(5))
─────────────────────────────────────────────────────────
  root = Node(5)
  result = [5]  (no children)
  Return: [5]

Back to Call 2: dfsPreorder(Node(2))
─────────────────────────────────────────────────────────
  result = [2, 4, 5]
  Return: [2, 4, 5]

Back to Call 1: dfsPreorder(Node(1))
─────────────────────────────────────────────────────────
  result = [1, 2, 4, 5]  (after left recursion)
  
  Step 3: Recurse right (Node(3))
    → Call dfsPreorder(Node(3))

Call 5: dfsPreorder(Node(3))
─────────────────────────────────────────────────────────
  root = Node(3)
  result = [3]  (no children)
  Return: [3]

Back to Call 1: dfsPreorder(Node(1))
─────────────────────────────────────────────────────────
  result = [1, 2, 4, 5, 3]
  Return: [1, 2, 4, 5, 3]

Final Result: [1, 2, 4, 5, 3]
```

**Time Complexity:** O(n) - visit each node once  
**Space Complexity:** O(h) - recursion call stack depth (height of tree)

---

## 4️⃣ Understanding Key Concepts

### Why Use Recursion vs Iteration?

```javascript
// ✅ Recursive DFS (Clean and intuitive)
const dfsRecursive = (root) => {
  if (!root) return [];
  
  return [
    root.val,
    ...dfsRecursive(root.left),
    ...dfsRecursive(root.right)
  ];
};

// ✅ Iterative DFS (More control, no stack overflow)
const dfsIterative = (root) => {
  if (!root) return [];
  
  const result = [];
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();  // LIFO: Last In, First Out
    result.push(node.val);
    
    // Push right first (so left is processed first)
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
};
```

**When to use which:**
- **Recursive**: Cleaner code, natural for trees, but limited by call stack depth (~10k-15k calls)
- **Iterative**: More verbose, but handles very deep structures without stack overflow

### Why Push Right Before Left?

```javascript
// Stack is LIFO (Last In, First Out)
// Want to process left before right
// So push right first (comes out last)

stack.push(node.right);  // Pushed first, comes out second
stack.push(node.left);   // Pushed second, comes out first

// Next iteration:
const node = stack.pop();  // Gets left child first ✓
```

### Pre-order vs In-order vs Post-order

```javascript
// Pre-order: Process root BEFORE children
// Use case: Copy tree, prefix expression evaluation
const preorder = (root) => {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
};

// In-order: Process root BETWEEN children
// Use case: BST → sorted array, infix expression
const inorder = (root) => {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
};

// Post-order: Process root AFTER children
// Use case: Delete tree, postfix expression, dependency resolution
const postorder = (root) => {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), root.val];
};
```

---

## 5️⃣ Production/Advanced Implementation

### Complete DFS Class with Multiple Traversals

```javascript
/**
 * DFS utility class for tree traversals
 */
class DFSTraverser {
  /**
   * Pre-order traversal (iterative)
   * Use case: Clone tree, serialize tree
   */
  static preorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
      const node = stack.pop();
      result.push(node.val);
      
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }
    
    return result;
  }
  
  /**
   * In-order traversal (iterative)
   * Use case: Get sorted values from BST
   */
  static inorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
      // Go to leftmost node
      while (current) {
        stack.push(current);
        current = current.left;
      }
      
      // Process node
      current = stack.pop();
      result.push(current.val);
      
      // Visit right subtree
      current = current.right;
    }
    
    return result;
  }
  
  /**
   * Post-order traversal (iterative)
   * Use case: Delete tree, calculate directory sizes
   */
  static postorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    const visited = new Set();
    
    while (stack.length > 0) {
      const node = stack[stack.length - 1];  // Peek
      
      // If leaf or children already processed
      if (!node.left && !node.right || visited.has(node)) {
        result.push(node.val);
        stack.pop();
        continue;
      }
      
      // Push children (right first, then left)
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
      
      visited.add(node);
    }
    
    return result;
  }
}
```

### DFS for Graphs with Cycle Detection

```javascript
/**
 * Graph DFS with cycle detection
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
  
  addEdge(v1, v2, directed = false) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjacencyList.get(v1).push(v2);
    if (!directed) {
      this.adjacencyList.get(v2).push(v1);
    }
  }
  
  /**
   * DFS traversal
   */
  dfs(start) {
    if (!this.adjacencyList.has(start)) return [];
    
    const result = [];
    const visited = new Set();
    
    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };
    
    dfsHelper(start);
    return result;
  }
  
  /**
   * Detect cycle in directed graph
   */
  hasCycle() {
    const visited = new Set();
    const recursionStack = new Set();
    
    const hasCycleHelper = (vertex) => {
      visited.add(vertex);
      recursionStack.add(vertex);
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        // If neighbor in recursion stack → cycle!
        if (recursionStack.has(neighbor)) {
          return true;
        }
        
        // If not visited, recurse
        if (!visited.has(neighbor)) {
          if (hasCycleHelper(neighbor)) {
            return true;
          }
        }
      }
      
      recursionStack.delete(vertex);  // Backtrack
      return false;
    };
    
    // Check all vertices (for disconnected components)
    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        if (hasCycleHelper(vertex)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Topological sort (only for DAG - Directed Acyclic Graph)
   */
  topologicalSort() {
    if (this.hasCycle()) {
      throw new Error('Graph has cycle, topological sort not possible');
    }
    
    const visited = new Set();
    const stack = [];
    
    const dfsHelper = (vertex) => {
      visited.add(vertex);
      
      const neighbors = this.adjacencyList.get(vertex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
      
      stack.push(vertex);  // Add after visiting all descendants
    };
    
    // Visit all vertices
    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        dfsHelper(vertex);
      }
    }
    
    return stack.reverse();  // Reverse for correct order
  }
  
  /**
   * Find all paths from start to end
   */
  findAllPaths(start, end) {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(end)) {
      return [];
    }
    
    const allPaths = [];
    const currentPath = [];
    const visited = new Set();
    
    const dfsHelper = (vertex) => {
      visited.add(vertex);
      currentPath.push(vertex);
      
      // Found a path to end
      if (vertex === end) {
        allPaths.push([...currentPath]);
      } else {
        // Continue exploring
        const neighbors = this.adjacencyList.get(vertex);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            dfsHelper(neighbor);
          }
        }
      }
      
      // Backtrack
      currentPath.pop();
      visited.delete(vertex);
    };
    
    dfsHelper(start);
    return allPaths;
  }
}
```

### 🔍 Dry Run: Cycle Detection

**Directed Graph:**
```
  A → B → C
  ↑       ↓
  └───────┘  (cycle: A → B → C → A)
```

```
Initial State:
─────────────────────────────────────────────────────────
  visited = {}
  recursionStack = {}

Check vertex A:
─────────────────────────────────────────────────────────
  Call hasCycleHelper('A')
  visited = {'A'}
  recursionStack = {'A'}
  
  Neighbors of A: ['B']
  - B not in recursionStack, not visited
  - Recurse into B

Check vertex B:
─────────────────────────────────────────────────────────
  Call hasCycleHelper('B')
  visited = {'A', 'B'}
  recursionStack = {'A', 'B'}
  
  Neighbors of B: ['C']
  - C not in recursionStack, not visited
  - Recurse into C

Check vertex C:
─────────────────────────────────────────────────────────
  Call hasCycleHelper('C')
  visited = {'A', 'B', 'C'}
  recursionStack = {'A', 'B', 'C'}
  
  Neighbors of C: ['A']
  - A is in recursionStack! ✓ CYCLE DETECTED
  - Return true

Backtrack to B:
─────────────────────────────────────────────────────────
  hasCycleHelper('B') returns true
  
Backtrack to A:
─────────────────────────────────────────────────────────
  hasCycleHelper('A') returns true

Result: true (cycle exists: A → B → C → A)
```

**Key insight:** `recursionStack` tracks the current DFS path. If we encounter a vertex already in the recursion stack, we've found a back edge (cycle).

---

## 6️⃣ Real-World Frontend Examples

### Example 1: React Component Tree Traversal

```javascript
/**
 * DFS utilities for React component trees
 * Use case: Component debugging, prop drilling analysis, performance profiling
 */
class ReactTreeDFS {
  /**
   * Find all components of a specific type (deep search)
   */
  static findAllComponents(element, ComponentType) {
    if (!element) return [];
    
    const results = [];
    
    const dfs = (node) => {
      if (!node) return;
      
      // Check current node
      if (node.type === ComponentType) {
        results.push(node);
      }
      
      // Recurse through children
      if (node.props && node.props.children) {
        React.Children.forEach(node.props.children, child => {
          if (child && typeof child === 'object') {
            dfs(child);
          }
        });
      }
    };
    
    dfs(element);
    return results;
  }
  
  /**
   * Find path to first component with specific prop
   */
  static findPathToProp(element, propName, propValue) {
    if (!element) return null;
    
    const path = [];
    
    const dfs = (node) => {
      if (!node) return false;
      
      path.push(node);
      
      // Found target
      if (node.props && node.props[propName] === propValue) {
        return true;
      }
      
      // Search children
      if (node.props && node.props.children) {
        const children = React.Children.toArray(node.props.children);
        for (const child of children) {
          if (child && typeof child === 'object') {
            if (dfs(child)) {
              return true;  // Found in descendant
            }
          }
        }
      }
      
      // Backtrack
      path.pop();
      return false;
    };
    
    return dfs(element) ? path : null;
  }
  
  /**
   * Calculate maximum nesting depth
   */
  static getMaxDepth(element) {
    if (!element) return 0;
    
    const dfs = (node) => {
      if (!node || typeof node !== 'object') return 0;
      
      if (!node.props || !node.props.children) {
        return 1;
      }
      
      let maxChildDepth = 0;
      React.Children.forEach(node.props.children, child => {
        if (child && typeof child === 'object') {
          maxChildDepth = Math.max(maxChildDepth, dfs(child));
        }
      });
      
      return 1 + maxChildDepth;
    };
    
    return dfs(element);
  }
  
  /**
   * Collect all props at each level (pre-order)
   */
  static collectPropsByLevel(element) {
    const levels = [];
    
    const dfs = (node, depth = 0) => {
      if (!node || typeof node !== 'object') return;
      
      if (!levels[depth]) {
        levels[depth] = [];
      }
      
      levels[depth].push({ ...node.props });
      
      if (node.props && node.props.children) {
        React.Children.forEach(node.props.children, child => {
          if (child && typeof child === 'object') {
            dfs(child, depth + 1);
          }
        });
      }
    };
    
    dfs(element);
    return levels;
  }
}
```

### Example 2: File System Tree Navigation

```javascript
/**
 * File system navigator using DFS
 * Use case: Build tools, file explorers, dependency resolvers
 */
class FileSystemNode {
  constructor(name, isDirectory = false) {
    this.name = name;
    this.isDirectory = isDirectory;
    this.children = [];
    this.size = 0;
  }
  
  addChild(child) {
    this.children.push(child);
  }
}

class FileSystemDFS {
  /**
   * Calculate total size of directory (post-order)
   */
  static calculateSize(node) {
    if (!node.isDirectory) {
      return node.size;  // File size
    }
    
    // Directory: sum of all children
    let totalSize = 0;
    for (const child of node.children) {
      totalSize += this.calculateSize(child);
    }
    
    node.size = totalSize;
    return totalSize;
  }
  
  /**
   * Find all files matching pattern
   */
  static findFiles(root, pattern) {
    const results = [];
    
    const dfs = (node, path = '') => {
      const currentPath = path + '/' + node.name;
      
      if (!node.isDirectory) {
        // Check if file matches pattern
        if (node.name.match(pattern)) {
          results.push(currentPath);
        }
        return;
      }
      
      // Recurse into directory
      for (const child of node.children) {
        dfs(child, currentPath);
      }
    };
    
    dfs(root);
    return results;
  }
  
  /**
   * Print directory tree structure
   */
  static printTree(node, prefix = '', isLast = true) {
    const connector = isLast ? '└── ' : '├── ';
    const line = prefix + connector + node.name;
    console.log(line);
    
    if (node.isDirectory) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      const children = node.children;
      
      for (let i = 0; i < children.length; i++) {
        const isLastChild = i === children.length - 1;
        this.printTree(children[i], newPrefix, isLastChild);
      }
    }
  }
  
  /**
   * Find largest file
   */
  static findLargestFile(root) {
    let largest = null;
    let maxSize = 0;
    
    const dfs = (node) => {
      if (!node.isDirectory) {
        if (node.size > maxSize) {
          maxSize = node.size;
          largest = node;
        }
        return;
      }
      
      for (const child of node.children) {
        dfs(child);
      }
    };
    
    dfs(root);
    return largest;
  }
  
  /**
   * Check if path exists
   */
  static pathExists(root, targetPath) {
    const parts = targetPath.split('/').filter(p => p);
    
    const dfs = (node, index) => {
      if (index === parts.length) {
        return true;  // Found complete path
      }
      
      if (!node.isDirectory) {
        return false;  // Can't go deeper
      }
      
      // Find matching child
      for (const child of node.children) {
        if (child.name === parts[index]) {
          if (dfs(child, index + 1)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    return dfs(root, 0);
  }
}

// Usage
const root = new FileSystemNode('root', true);
const src = new FileSystemNode('src', true);
const indexJs = new FileSystemNode('index.js', false);
indexJs.size = 1500;
src.addChild(indexJs);
root.addChild(src);

console.log('Total size:', FileSystemDFS.calculateSize(root));
console.log('JS files:', FileSystemDFS.findFiles(root, /\.js$/));
FileSystemDFS.printTree(root);
```

### Example 3: Maze Solver with Backtracking

```javascript
/**
 * Maze solver using DFS with backtracking
 * Use case: Puzzle games, pathfinding in grid-based games
 */
class MazeSolver {
  constructor(maze) {
    this.maze = maze;  // 2D array: 0 = path, 1 = wall
    this.rows = maze.length;
    this.cols = maze[0].length;
  }
  
  /**
   * Find path from start to end
   * Returns path as array of [row, col] coordinates
   */
  solve(startRow, startCol, endRow, endCol) {
    const visited = new Set();
    const path = [];
    
    const dfs = (row, col) => {
      // Out of bounds
      if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
        return false;
      }
      
      // Wall or already visited
      const key = `${row},${col}`;
      if (this.maze[row][col] === 1 || visited.has(key)) {
        return false;
      }
      
      // Mark as visited and add to path
      visited.add(key);
      path.push([row, col]);
      
      // Found the end!
      if (row === endRow && col === endCol) {
        return true;
      }
      
      // Try all four directions: down, right, up, left
      const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      
      for (const [dr, dc] of directions) {
        if (dfs(row + dr, col + dc)) {
          return true;  // Found path through this direction
        }
      }
      
      // Backtrack: remove from path
      path.pop();
      return false;
    };
    
    return dfs(startRow, startCol) ? path : null;
  }
  
  /**
   * Find all possible paths (exhaustive search)
   */
  findAllPaths(startRow, startCol, endRow, endCol) {
    const visited = new Set();
    const currentPath = [];
    const allPaths = [];
    
    const dfs = (row, col) => {
      // Bounds check
      if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
        return;
      }
      
      // Wall or visited
      const key = `${row},${col}`;
      if (this.maze[row][col] === 1 || visited.has(key)) {
        return;
      }
      
      // Mark visited and add to path
      visited.add(key);
      currentPath.push([row, col]);
      
      // Reached end
      if (row === endRow && col === endCol) {
        allPaths.push([...currentPath]);  // Save copy of current path
      } else {
        // Continue exploring
        const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (const [dr, dc] of directions) {
          dfs(row + dr, col + dc);
        }
      }
      
      // Backtrack
      currentPath.pop();
      visited.delete(key);
    };
    
    dfs(startRow, startCol);
    return allPaths;
  }
  
  /**
   * Print maze with path highlighted
   */
  printSolution(path) {
    const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
    
    for (let r = 0; r < this.rows; r++) {
      let row = '';
      for (let c = 0; c < this.cols; c++) {
        const key = `${r},${c}`;
        if (pathSet.has(key)) {
          row += '● ';  // Path
        } else if (this.maze[r][c] === 1) {
          row += '█ ';  // Wall
        } else {
          row += '· ';  // Empty
        }
      }
      console.log(row);
    }
  }
}

// Usage
const maze = [
  [0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0]
];

const solver = new MazeSolver(maze);
const path = solver.solve(0, 0, 4, 4);
console.log('Path found:', path);
solver.printSolution(path);
```

---

## 7️⃣ Comparisons

### DFS vs BFS

| **Aspect** | **DFS** | **BFS** |
|------------|---------|---------|
| **Data Structure** | Stack (or recursion) | Queue |
| **Traversal Order** | Depth-first (go deep) | Breadth-first (level by level) |
| **Space Complexity** | O(h) height | O(w) width |
| **Shortest Path** | ❌ No (finds A path) | ✅ Yes (unweighted) |
| **Complete?** | ❌ No (infinite depth) | ✅ Yes (finite branching) |
| **Optimal?** | ❌ No | ✅ Yes (unweighted) |
| **Best For** | Backtracking, topological sort, cycle detection | Shortest path, level-order |
| **Frontend Use** | Component trees, file systems, dependency graphs | DOM traversal, friend suggestions |

### When to Use Which?

```javascript
// ✅ Use DFS when:
// - Need to explore all possible paths (backtracking)
// - Detecting cycles in graph
// - Topological sorting (dependency order)
// - Tree is very wide (saves space)
"Find all paths from A to B"
"Detect circular dependencies"
"Solve sudoku/maze puzzles"
"Calculate directory sizes"

// ✅ Use BFS when:
// - Need shortest path (unweighted graph)
// - Level-order traversal required
// - Find nearest/closest node
"Shortest path between two nodes"
"Friends at distance k"
"All nodes at level 3"

// Both work equally well for:
// - Check if path exists
// - Count reachable nodes
// - Simple tree traversal
```

---

## 8️⃣ Common Interview Questions

### Q1: Implement in-order traversal iteratively without recursion.

**Answer:** Use a stack to simulate the recursion call stack.

```javascript
const inorderIterative = (root) => {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length > 0) {
    // Go to leftmost node
    while (current) {
      stack.push(current);
      current = current.left;
    }
    
    // Process node
    current = stack.pop();
    result.push(current.val);
    
    // Visit right subtree
    current = current.right;
  }
  
  return result;
};
```

---

### Q2: How do you detect a cycle in a directed graph using DFS?

**Answer:** Use a recursion stack to track the current DFS path. If we visit a node already in the recursion stack, there's a cycle.

```javascript
const hasCycle = (graph) => {
  const visited = new Set();
  const recursionStack = new Set();
  
  const dfs = (node) => {
    visited.add(node);
    recursionStack.add(node);
    
    for (const neighbor of graph.get(node)) {
      if (recursionStack.has(neighbor)) {
        return true;  // Back edge found = cycle
      }
      
      if (!visited.has(neighbor) && dfs(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(node);  // Backtrack
    return false;
  };
  
  for (const node of graph.keys()) {
    if (!visited.has(node) && dfs(node)) {
      return true;
    }
  }
  
  return false;
};
```

---

### Q3: Find the lowest common ancestor (LCA) of two nodes in a binary tree.

**Answer:** Use DFS to find paths to both nodes, then find the last common node.

```javascript
const lowestCommonAncestor = (root, p, q) => {
  if (!root || root === p || root === q) {
    return root;
  }
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  // If both left and right found, current node is LCA
  if (left && right) return root;
  
  // Otherwise return whichever is not null
  return left || right;
};
```

---

### Q4: Validate if a binary tree is a valid binary search tree.

**Answer:** Use in-order DFS. For BST, in-order gives sorted values.

```javascript
const isValidBST = (root) => {
  let prev = null;
  
  const inorder = (node) => {
    if (!node) return true;
    
    // Check left subtree
    if (!inorder(node.left)) return false;
    
    // Check current node
    if (prev !== null && node.val <= prev) {
      return false;  // Not in sorted order
    }
    prev = node.val;
    
    // Check right subtree
    return inorder(node.right);
  };
  
  return inorder(root);
};
```

---

### Q5: How do you perform topological sort on a DAG (Directed Acyclic Graph)?

**Answer:** Use DFS and push nodes to stack after visiting all descendants.

```javascript
const topologicalSort = (graph) => {
  const visited = new Set();
  const stack = [];
  
  const dfs = (node) => {
    visited.add(node);
    
    for (const neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
    
    stack.push(node);  // Add after all descendants
  };
  
  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }
  
  return stack.reverse();  // Reverse for correct order
};
```

---

### Q6: Find all root-to-leaf paths in a binary tree.

**Answer:** Use DFS with backtracking to track current path.

```javascript
const allRootToLeafPaths = (root) => {
  const paths = [];
  const currentPath = [];
  
  const dfs = (node) => {
    if (!node) return;
    
    currentPath.push(node.val);
    
    // Leaf node
    if (!node.left && !node.right) {
      paths.push([...currentPath]);
    } else {
      dfs(node.left);
      dfs(node.right);
    }
    
    currentPath.pop();  // Backtrack
  };
  
  dfs(root);
  return paths;
};
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Forgetting Base Case in Recursion

❌ **BAD:**
```javascript
const dfs = (root) => {
  const result = [];
  result.push(root.val);  // ❌ Crashes if root is null!
  result.push(...dfs(root.left));
  result.push(...dfs(root.right));
  return result;
};
```

✅ **GOOD:**
```javascript
const dfs = (root) => {
  if (!root) return [];  // ✅ Base case first!
  
  const result = [];
  result.push(root.val);
  result.push(...dfs(root.left));
  result.push(...dfs(root.right));
  return result;
};
```

**Why it matters:** Without a base case, recursion never stops and causes stack overflow or null pointer errors.

---

### Pitfall 2: Not Backtracking When Finding All Paths

❌ **BAD:**
```javascript
const findAllPaths = (graph, start, end) => {
  const allPaths = [];
  const path = [];
  const visited = new Set();
  
  const dfs = (node) => {
    visited.add(node);  // ❌ Never removed!
    path.push(node);
    
    if (node === end) {
      allPaths.push([...path]);
    }
    
    for (const neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
    
    path.pop();
    // ❌ Forgot to remove from visited!
  };
  
  dfs(start);
  return allPaths;
};
// Result: Finds only one path, not all paths
```

✅ **GOOD:**
```javascript
const findAllPaths = (graph, start, end) => {
  const allPaths = [];
  const path = [];
  const visited = new Set();
  
  const dfs = (node) => {
    visited.add(node);
    path.push(node);
    
    if (node === end) {
      allPaths.push([...path]);
    }
    
    for (const neighbor of graph.get(node)) {
      if (!visited.has(neighbor)) {
        dfs(neighbor);
      }
    }
    
    path.pop();
    visited.delete(node);  // ✅ Backtrack visited too!
  };
  
  dfs(start);
  return allPaths;
};
```

**Why it matters:** When finding ALL paths, must backtrack both the path and visited set to explore alternative routes.

---

### Pitfall 3: Wrong Order When Pushing to Stack

❌ **BAD:**
```javascript
const preorderIterative = (root) => {
  const stack = [root];
  const result = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    
    // ❌ Wrong order: left pushed last, processed first
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  
  return result;
};
// Result: Processes right before left (wrong!)
```

✅ **GOOD:**
```javascript
const preorderIterative = (root) => {
  const stack = [root];
  const result = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    
    // ✅ Push right first (comes out last)
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
};
```

**Why it matters:** Stack is LIFO. To process left before right, push right first.

---

### Pitfall 4: Using Same Visited Set for Cycle Detection and Traversal

❌ **BAD:**
```javascript
const hasCycle = (graph) => {
  const visited = new Set();
  
  const dfs = (node) => {
    if (visited.has(node)) {
      return true;  // ❌ Wrong! Could be from different path
    }
    
    visited.add(node);
    
    for (const neighbor of graph.get(node)) {
      if (dfs(neighbor)) return true;
    }
    
    return false;
  };
  
  return dfs(startNode);
};
```

✅ **GOOD:**
```javascript
const hasCycle = (graph) => {
  const visited = new Set();
  const recursionStack = new Set();  // ✅ Separate stack for current path
  
  const dfs = (node) => {
    visited.add(node);
    recursionStack.add(node);
    
    for (const neighbor of graph.get(node)) {
      if (recursionStack.has(neighbor)) {
        return true;  // ✅ Back edge = cycle
      }
      
      if (!visited.has(neighbor) && dfs(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(node);  // ✅ Backtrack
    return false;
  };
  
  return dfs(startNode);
};
```

**Why it matters:** Cycle detection needs to know if a node is in the CURRENT path (recursion stack), not just if it was visited before.

---

## 🔟 Time & Space Complexity

| **Operation** | **Time Complexity** | **Space Complexity** | **Explanation** |
|---------------|---------------------|----------------------|-----------------|
| **DFS tree traversal (recursive)** | O(n) | O(h) | Visit each node once; call stack depth = height |
| **DFS tree traversal (iterative)** | O(n) | O(h) | Visit each node once; explicit stack depth = height |
| **DFS graph traversal** | O(V + E) | O(V) | Visit each vertex and edge once; visited set |
| **Find all paths** | O(V!) worst case | O(V) | Exponential paths possible; path length ≤ V |
| **Topological sort** | O(V + E) | O(V) | DFS on all vertices; stack for result |
| **Cycle detection** | O(V + E) | O(V) | DFS with recursion stack |
| **LCA (Lowest Common Ancestor)** | O(n) | O(h) | Worst case visit all nodes; recursion depth |

### Why DFS is O(V + E) for Graphs:

```javascript
// Vertices: Each vertex visited once = O(V)
const visited = new Set();
for (const vertex of graph.keys()) {  // Outer: O(V)
  if (!visited.has(vertex)) {
    dfs(vertex);
  }
}

// Edges: Each edge examined once = O(E)
const dfs = (vertex) => {
  visited.add(vertex);
  for (const neighbor of graph.get(vertex)) {  // Inner: Total O(E) across all calls
    if (!visited.has(neighbor)) {
      dfs(neighbor);
    }
  }
};

// Total: O(V + E)
```

### Space Complexity - Why O(h) for Trees?

```javascript
// Recursive DFS: Call stack depth = height of tree
const dfs = (root) => {
  if (!root) return;     // Base case
  dfs(root.left);        // Recurse left (adds to call stack)
  dfs(root.right);       // Recurse right (adds to call stack)
};

// Worst case (skewed tree):
//      1
//       \
//        2
//         \
//          3
//           \
//            4
// Height = n, call stack = O(n)

// Best case (balanced tree):
//         1
//       /   \
//      2     3
//     / \   / \
//    4   5 6   7
// Height = log n, call stack = O(log n)
```

**Key Insight:** Recursive DFS space depends on maximum recursion depth, which equals tree height. For balanced trees, this is O(log n). For skewed trees, O(n).

---

## Summary

### 📊 Quick Reference

| **Category** | **Key Takeaway** |
|--------------|------------------|
| **Definition** | Depth-first exploration using stack or recursion |
| **Data Structure** | Stack (explicit) or Call Stack (recursion) |
| **Traversal Order** | Depth-first: explore one path completely before backtracking |
| **Three Types** | Pre-order (root first), In-order (root middle), Post-order (root last) |
| **Time Complexity** | O(V + E) for graphs, O(n) for trees |
| **Space Complexity** | O(h) for trees (height), O(V) for graphs (visited set) |
| **vs BFS** | DFS: backtracking, all paths; BFS: shortest path, level-order |

### 🎯 5 Key Takeaways

1. **DFS uses recursion or explicit stack** (LIFO) to go deep before exploring siblings, making it perfect for backtracking problems
2. **Three traversal orders matter**: Pre-order (copy), In-order (sorted BST), Post-order (delete, dependency resolution)
3. **Recursion stack tracks the path** - this enables cycle detection with a recursion stack separate from the visited set
4. **Always backtrack for "all paths" problems** - remove nodes from both path and visited set when returning
5. **Better space than BFS for tall trees**: O(h) vs O(w), crucial when height << width

---

## 📚 Further Reading

- [LeetCode DFS Problems](https://leetcode.com/tag/depth-first-search/) - Practice problems with varying difficulty
- [Visualizing DFS](https://visualgo.net/en/dfsbfs) - Interactive DFS visualization
- [Graph Theory Introduction](https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/) - Understanding graph representations

---

### 🔗 Related Resources in This Repo

- [BFS (Breadth-First Search)](bfs.md) - Complementary graph traversal pattern
- [Two-Pointer Technique](two_pointer_technique.md) - Array traversal pattern
- [Sliding Window](sliding_window.md) - Contiguous subarray pattern

---

<!-- quiz-start -->
### Q1: What is the main difference between DFS and BFS in terms of data structures used?
- [ ] DFS uses arrays, BFS uses linked lists
- [x] DFS uses stack (or recursion), BFS uses queue
- [ ] DFS uses queue, BFS uses stack
- [ ] They both use the same data structure

### Q2: Which DFS traversal order processes a node after all its descendants?
- [ ] Pre-order traversal
- [ ] In-order traversal
- [x] Post-order traversal
- [ ] Level-order traversal

### Q3: How do you detect a cycle in a directed graph using DFS?
- [ ] Use a visited set only
- [x] Use both a visited set and a recursion stack; if a node is in the recursion stack, it's a cycle
- [ ] Count the number of edges
- [ ] BFS is better for cycle detection, not DFS
<!-- quiz-end -->
