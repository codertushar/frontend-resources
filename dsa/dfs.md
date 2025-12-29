---
date: 2025-12-29T18:14:26+00:00
description: Master Depth-First Search (DFS) for tree and graph traversal - essential for form validation, dependency resolution, backtracking, and navigating nested structures in frontend.
premium: false
---

# 🎯 Depth-First Search (DFS): Essential Pattern for Deep Exploration

> **Interview Importance:** 🔴 Critical — DFS appears in 50% of frontend coding interviews for tree/graph problems. It's fundamental for nested validation, dependency resolution, pathfinding, cycle detection, and exploring all possible solutions.

---

## 1️⃣ What is Depth-First Search (DFS)?

**Depth-First Search (DFS)** is a graph/tree traversal algorithm that explores as far as possible along each branch before backtracking. It dives deep into one path before exploring alternative paths. DFS can be implemented recursively (using the call stack) or iteratively (using an explicit stack).

**Visual Representation:**

```
Tree Structure:
         1
       /   \
      2     3
     / \   / \
    4   5 6   7

DFS Traversal Order (Pre-order): 1 → 2 → 4 → 5 → 3 → 6 → 7

Depth-First Exploration:
Start at 1
  Go to 2
    Go to 4 (leaf)
    Backtrack to 2
    Go to 5 (leaf)
    Backtrack to 2
  Backtrack to 1
  Go to 3
    Go to 6 (leaf)
    Backtrack to 3
    Go to 7 (leaf)
    Backtrack to 3
  Backtrack to 1
Done

Stack Evolution (Iterative):
[1]
[1, 2]
[1, 2, 4]
[1, 2, 5]
[1, 3]
[1, 3, 6]
[1, 3, 7]
```

**Real-World Analogy:**

Think of DFS like exploring a cave system. You follow one tunnel all the way to the end before coming back and trying another tunnel. This is exactly how form validation works in nested objects - you validate all fields in one section before moving to the next section!

---

## 2️⃣ Why Use DFS?

| **Problem Type** | **Why DFS is Ideal** | **Alternative Approach** | **DFS Advantage** |
|------------------|---------------------|-------------------------|-------------------|
| **Path Finding** | Explores all paths efficiently | BFS may use more memory | Memory efficient for deep trees |
| **Cycle Detection** | Natural backtracking detection | BFS requires complex tracking | Simple visited set check |
| **Topological Sort** | Post-order naturally gives reverse topo | BFS requires in-degree tracking | Cleaner implementation |
| **Nested Validation** | Matches structure of nested data | Iterative level-by-level | Mirrors JSON structure |
| **Dependency Resolution** | Detects circular dependencies | Manual tracking complex | Built-in cycle detection |
| **All Paths** | Backtracking explores all routes | BFS exponential space | Space efficient |

**Performance Benefits:**
- **O(V + E)** time for graphs (V = vertices, E = edges)
- **O(n)** time for trees (n = nodes)
- **O(h)** space for trees (h = height) vs O(w) for BFS (w = width)
- Perfect for frontend: form validation, file trees, dependency graphs

---

## 3️⃣ How It Works — Basic Implementation

### Pattern 1: DFS Recursive (Pre-order)

```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// DFS Recursive Pre-order: Root → Left → Right
const dfsPreorder = (root, result = []) => {
  if (!root) return result;  // Base case: null node
  
  result.push(root.val);        // Process current node (Pre)
  dfsPreorder(root.left, result);   // Recurse left
  dfsPreorder(root.right, result);  // Recurse right
  
  return result;
};
```

### 🔍 Dry Run: DFS Recursive Pre-order

**Input Tree:**
```
      1
     / \
    2   3
   / \
  4   5
```

```
Step 1: dfsPreorder(1)
─────────────────────────────────────────────────────────
  Process: result = [1]
  Recurse left: call dfsPreorder(2)
  
Step 2: dfsPreorder(2)
─────────────────────────────────────────────────────────
  Process: result = [1, 2]
  Recurse left: call dfsPreorder(4)
  
Step 3: dfsPreorder(4)
─────────────────────────────────────────────────────────
  Process: result = [1, 2, 4]
  Recurse left: dfsPreorder(null) -> returns
  Recurse right: dfsPreorder(null) -> returns
  Return to Step 2
  
Step 4: Back in dfsPreorder(2)
─────────────────────────────────────────────────────────
  Recurse right: call dfsPreorder(5)
  
Step 5: dfsPreorder(5)
─────────────────────────────────────────────────────────
  Process: result = [1, 2, 4, 5]
  Recurse left: dfsPreorder(null) -> returns
  Recurse right: dfsPreorder(null) -> returns
  Return to Step 4, then to Step 1
  
Step 6: Back in dfsPreorder(1)
─────────────────────────────────────────────────────────
  Recurse right: call dfsPreorder(3)
  
Step 7: dfsPreorder(3)
─────────────────────────────────────────────────────────
  Process: result = [1, 2, 4, 5, 3]
  Recurse left: dfsPreorder(null) -> returns
  Recurse right: dfsPreorder(null) -> returns
  Return to Step 6
  
Final Result: [1, 2, 4, 5, 3]
```

---

## 4️⃣ Understanding Key Concepts

### Three Types of DFS Traversal (Binary Trees)

```javascript
// Pre-order: Root → Left → Right
// Used for: copying trees, prefix expression evaluation
const preorder = (root, result = []) => {
  if (!root) return result;
  result.push(root.val);        // 1. Process root first
  preorder(root.left, result);   // 2. Then left
  preorder(root.right, result);  // 3. Then right
  return result;
};

// In-order: Left → Root → Right
// Used for: BST sorted output, expression tree evaluation
const inorder = (root, result = []) => {
  if (!root) return result;
  inorder(root.left, result);    // 1. Process left first
  result.push(root.val);         // 2. Then root
  inorder(root.right, result);   // 3. Then right
  return result;
};

// Post-order: Left → Right → Root
// Used for: deleting trees, post-fix evaluation, dependency resolution
const postorder = (root, result = []) => {
  if (!root) return result;
  postorder(root.left, result);   // 1. Process left first
  postorder(root.right, result);  // 2. Then right
  result.push(root.val);          // 3. Then root last
  return result;
};

// Example tree:     2
//                  / \
//                 1   3

// Pre-order:  [2, 1, 3]  (root first)
// In-order:   [1, 2, 3]  (sorted for BST!)
// Post-order: [1, 3, 2]  (root last)
```

**Why choose different orders?**

- **Pre-order**: When you need to process parent before children (copying trees, serialization)
- **In-order**: For BSTs to get sorted order, or when left children matter before parent
- **Post-order**: When children must be processed before parent (deletion, dependency resolution)

**Edge cases DFS handles:**
- **Empty tree**: Returns empty result
- **Single node**: Returns single element
- **Skewed tree**: O(n) space with recursion stack
- **Cycles in graphs**: Requires visited set

---

## 5️⃣ Production/Advanced Implementation

```javascript
class DFS {
  // Iterative DFS with Stack (Pre-order)
  static iterativePreorder(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
      const node = stack.pop();
      result.push(node.val);
      
      // Push right first so left is processed first (LIFO)
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
    }
    
    return result;
  }
  
  // Iterative In-order (requires state tracking)
  static iterativeInorder(root) {
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
      
      // Move to right subtree
      current = current.right;
    }
    
    return result;
  }
  
  // DFS on Graph with Cycle Detection
  static dfsGraph(graph, start, visited = new Set()) {
    const result = [];
    
    const dfs = (node) => {
      if (visited.has(node)) return;  // Already visited
      
      visited.add(node);
      result.push(node);
      
      for (const neighbor of (graph[node] || [])) {
        dfs(neighbor);
      }
    };
    
    dfs(start);
    return result;
  }
  
  // Find All Paths from Source to Target
  static allPaths(graph, start, end) {
    const paths = [];
    
    const dfs = (node, path) => {
      // Found target
      if (node === end) {
        paths.push([...path, node]);
        return;
      }
      
      // Explore neighbors
      for (const neighbor of (graph[node] || [])) {
        if (!path.includes(neighbor)) {  // Avoid cycles in path
          dfs(neighbor, [...path, node]);
        }
      }
    };
    
    dfs(start, []);
    return paths;
  }
  
  // Detect Cycle in Directed Graph
  static hasCycle(graph) {
    const visited = new Set();
    const recStack = new Set();  // Nodes in current recursion path
    
    const dfs = (node) => {
      visited.add(node);
      recStack.add(node);
      
      for (const neighbor of (graph[node] || [])) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recStack.has(neighbor)) {
          return true;  // Back edge = cycle!
        }
      }
      
      recStack.delete(node);  // Remove from recursion stack
      return false;
    };
    
    // Check all components
    for (const node in graph) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }
    
    return false;
  }
  
  // Topological Sort (DFS Post-order)
  static topologicalSort(graph) {
    const visited = new Set();
    const result = [];
    
    const dfs = (node) => {
      if (visited.has(node)) return;
      
      visited.add(node);
      
      for (const neighbor of (graph[node] || [])) {
        dfs(neighbor);
      }
      
      result.push(node);  // Add after exploring children (post-order)
    };
    
    for (const node in graph) {
      dfs(node);
    }
    
    return result.reverse();  // Reverse for correct order
  }
}
```

---

## 6️⃣ Real-World Frontend Examples

### Example 1: Nested Form Validation (JSON Object)

```javascript
// Validate deeply nested form with DFS
const validateFormDFS = (formData, rules) => {
  const errors = {};
  
  const dfs = (obj, path = '', ruleSet = rules) => {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      const value = obj[key];
      const rule = ruleSet[key];
      
      // If value is nested object, recurse
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        dfs(value, currentPath, rule || {});
      } else {
        // Validate leaf value
        if (rule && rule.required && !value) {
          errors[currentPath] = `${currentPath} is required`;
        }
        if (rule && rule.minLength && value.length < rule.minLength) {
          errors[currentPath] = `${currentPath} must be at least ${rule.minLength} characters`;
        }
      }
    }
  };
  
  dfs(formData);
  return errors;
};

// Usage
const formData = {
  user: {
    name: 'John',
    contact: {
      email: '',  // Error: required
      phone: '123'  // Error: too short
    }
  }
};

const rules = {
  user: {
    name: { required: true },
    contact: {
      email: { required: true },
      phone: { required: true, minLength: 10 }
    }
  }
};

const errors = validateFormDFS(formData, rules);
// errors = {
//   'user.contact.email': 'user.contact.email is required',
//   'user.contact.phone': 'user.contact.phone must be at least 10 characters'
// }
```

### Example 2: File System Tree Rendering

```javascript
// Render file tree with DFS (like VS Code explorer)
const renderFileTree = (node, depth = 0) => {
  const indent = '  '.repeat(depth);
  let html = '';
  
  if (node.type === 'file') {
    html = `${indent}<div class="file">📄 ${node.name}</div>\n`;
  } else {
    // Folder: process recursively
    html = `${indent}<div class="folder">📁 ${node.name}\n`;
    
    if (node.children) {
      for (const child of node.children) {
        html += renderFileTree(child, depth + 1);
      }
    }
    
    html += `${indent}</div>\n`;
  }
  
  return html;
};

// Usage
const fileSystem = {
  name: 'src',
  type: 'folder',
  children: [
    { name: 'App.js', type: 'file' },
    {
      name: 'components',
      type: 'folder',
      children: [
        { name: 'Header.js', type: 'file' },
        { name: 'Footer.js', type: 'file' }
      ]
    },
    { name: 'index.js', type: 'file' }
  ]
};

const treeHTML = renderFileTree(fileSystem);
// Output:
// 📁 src
//   📄 App.js
//   📁 components
//     📄 Header.js
//     📄 Footer.js
//   📄 index.js
```

### Example 3: Dependency Resolution (Package Manager)

```javascript
// Resolve package dependencies with DFS (detect circular dependencies)
class DependencyResolver {
  constructor(packages) {
    this.packages = packages;  // { packageName: [dependencies] }
  }
  
  // Get install order (topological sort)
  getInstallOrder() {
    const visited = new Set();
    const result = [];
    
    const dfs = (pkg) => {
      if (visited.has(pkg)) return;
      visited.add(pkg);
      
      // Install dependencies first
      for (const dep of (this.packages[pkg] || [])) {
        dfs(dep);
      }
      
      result.push(pkg);  // Post-order: install after dependencies
    };
    
    for (const pkg in this.packages) {
      dfs(pkg);
    }
    
    return result;
  }
  
  // Detect circular dependencies
  hasCircularDependency() {
    const visited = new Set();
    const recStack = new Set();
    
    const dfs = (pkg) => {
      visited.add(pkg);
      recStack.add(pkg);
      
      for (const dep of (this.packages[pkg] || [])) {
        if (!visited.has(dep)) {
          if (dfs(dep)) return true;
        } else if (recStack.has(dep)) {
          console.log(`Circular dependency: ${pkg} → ${dep}`);
          return true;
        }
      }
      
      recStack.delete(pkg);
      return false;
    };
    
    for (const pkg in this.packages) {
      if (!visited.has(pkg)) {
        if (dfs(pkg)) return true;
      }
    }
    
    return false;
  }
}

// Usage
const packages = {
  'app': ['react', 'redux'],
  'react': ['react-dom'],
  'redux': ['react'],  // OK
  'react-dom': []
};

const resolver = new DependencyResolver(packages);
console.log(resolver.getInstallOrder());
// Output: ['react-dom', 'react', 'redux', 'app']

console.log(resolver.hasCircularDependency());
// Output: false
```

### Example 4: React Component Tree Deep Clone

```javascript
// Deep clone React element tree with DFS
const deepCloneElement = (element) => {
  if (!element || typeof element !== 'object') {
    return element;  // Primitive value
  }
  
  if (Array.isArray(element)) {
    return element.map(deepCloneElement);  // Clone array
  }
  
  // Clone React element
  if (element.type) {
    const clonedProps = { ...element.props };
    
    // Recursively clone children
    if (clonedProps.children) {
      clonedProps.children = Array.isArray(clonedProps.children)
        ? clonedProps.children.map(deepCloneElement)
        : deepCloneElement(clonedProps.children);
    }
    
    return {
      ...element,
      props: clonedProps
    };
  }
  
  // Clone plain object
  const cloned = {};
  for (const key in element) {
    cloned[key] = deepCloneElement(element[key]);
  }
  return cloned;
};
```

### Example 5: Menu Navigation Structure (All Paths)

```javascript
// Find all navigation paths in nested menu
const findAllMenuPaths = (menu, targetId) => {
  const paths = [];
  
  const dfs = (item, path = []) => {
    const currentPath = [...path, item.label];
    
    if (item.id === targetId) {
      paths.push(currentPath);
      return;
    }
    
    if (item.children) {
      for (const child of item.children) {
        dfs(child, currentPath);
      }
    }
  };
  
  dfs(menu);
  return paths;
};

// Usage
const menu = {
  label: 'Home',
  id: 'home',
  children: [
    {
      label: 'Products',
      id: 'products',
      children: [
        { label: 'Electronics', id: 'electronics' },
        { label: 'Books', id: 'books' }
      ]
    },
    { label: 'About', id: 'about' }
  ]
};

const paths = findAllMenuPaths(menu, 'electronics');
// Result: [['Home', 'Products', 'Electronics']]
```

### Example 6: DOM Element Find with DFS

```javascript
// Find all elements matching condition using DFS
const findElementsDFS = (root, predicate) => {
  const matches = [];
  
  const dfs = (element) => {
    if (!element) return;
    
    if (predicate(element)) {
      matches.push(element);
    }
    
    // Recurse through children
    for (const child of element.children) {
      dfs(child);
    }
  };
  
  dfs(root);
  return matches;
};

// Usage: Find all disabled buttons
const disabledButtons = findElementsDFS(
  document.body,
  (el) => el.tagName === 'BUTTON' && el.disabled
);
```

---

## 7️⃣ Comparisons

### DFS vs BFS

| **Aspect** | **DFS** | **BFS** |
|------------|---------|---------|
| **Data Structure** | Stack (LIFO) or Recursion | Queue (FIFO) |
| **Memory Usage** | O(h) - height of tree | O(w) - width of tree |
| **Path Type** | Any path (not necessarily shortest) | Shortest path guaranteed |
| **Implementation** | Simple recursive or iterative | Iterative with queue |
| **Best For** | Cycle detection, topological sort, backtracking | Shortest path, level order |
| **Stack Overflow Risk** | Yes (deep recursion) | No (iterative) |
| **Frontend Use Cases** | Form validation, file trees, dependencies | DOM traversal, sitemap |

### Recursive vs Iterative DFS

| **Aspect** | **Recursive DFS** | **Iterative DFS** |
|------------|-------------------|-------------------|
| **Code Simplicity** | Very clean and readable | More verbose |
| **Stack Overflow** | Risk with deep trees (>10k nodes) | No risk |
| **Space Complexity** | O(h) implicit call stack | O(h) explicit stack |
| **Debugging** | Harder to debug | Easier to debug |
| **Control Flow** | Natural backtracking | Manual stack management |

**When to use recursive:**
- Trees with reasonable depth (<1000 nodes)
- Code readability is priority
- Interview setting (cleaner code)

**When to use iterative:**
- Very deep trees (risk of stack overflow)
- Production code with unknown depth
- Need fine-grained control over traversal

---

## 8️⃣ Common Interview Questions

**Q1: Find all paths from root to leaves in a binary tree**

```javascript
const rootToLeafPaths = (root) => {
  const paths = [];
  
  const dfs = (node, path) => {
    if (!node) return;
    
    path.push(node.val);
    
    // Leaf node: save path
    if (!node.left && !node.right) {
      paths.push([...path]);
    } else {
      dfs(node.left, path);
      dfs(node.right, path);
    }
    
    path.pop();  // Backtrack
  };
  
  dfs(root, []);
  return paths;
};

// Example: Tree [1,2,3,null,5]
// Result: [[1,2,5], [1,3]]
```

**Q2: Validate if a binary tree is a valid Binary Search Tree**

```javascript
const isValidBST = (root) => {
  const dfs = (node, min = -Infinity, max = Infinity) => {
    if (!node) return true;
    
    // Check BST property
    if (node.val <= min || node.val >= max) {
      return false;
    }
    
    // Recurse: left must be < node.val, right must be > node.val
    return dfs(node.left, min, node.val) && 
           dfs(node.right, node.val, max);
  };
  
  return dfs(root);
};
```

**Q3: Find the lowest common ancestor (LCA) of two nodes**

```javascript
const lowestCommonAncestor = (root, p, q) => {
  // Base case
  if (!root || root === p || root === q) {
    return root;
  }
  
  // Search in left and right subtrees
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  // If both found, current node is LCA
  if (left && right) return root;
  
  // Return whichever is not null
  return left || right;
};
```

**Q4: Detect cycle in a directed graph**

```javascript
const hasCycle = (graph) => {
  const visited = new Set();
  const recStack = new Set();
  
  const dfs = (node) => {
    visited.add(node);
    recStack.add(node);
    
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;  // Back edge = cycle
      }
    }
    
    recStack.delete(node);
    return false;
  };
  
  for (const node in graph) {
    if (!visited.has(node) && dfs(node)) {
      return true;
    }
  }
  
  return false;
};
```

**Q5: Count number of islands in a 2D grid**

```javascript
const numIslands = (grid) => {
  if (!grid || grid.length === 0) return 0;
  
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  
  const dfs = (r, c) => {
    // Out of bounds or water
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
      return;
    }
    
    grid[r][c] = '0';  // Mark as visited
    
    // Explore 4 directions
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);  // Sink the island
      }
    }
  }
  
  return count;
};
```

**Q6: Serialize and deserialize a binary tree**

```javascript
const serialize = (root) => {
  const result = [];
  
  const dfs = (node) => {
    if (!node) {
      result.push('null');
      return;
    }
    
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  };
  
  dfs(root);
  return result.join(',');
};

const deserialize = (data) => {
  const values = data.split(',');
  let index = 0;
  
  const dfs = () => {
    if (values[index] === 'null') {
      index++;
      return null;
    }
    
    const node = new TreeNode(parseInt(values[index++]));
    node.left = dfs();
    node.right = dfs();
    return node;
  };
  
  return dfs();
};
```

---

## 9️⃣ Common Pitfalls

### Pitfall 1: Stack Overflow with Deep Recursion

❌ **BAD:**
```javascript
const dfs = (node) => {
  if (!node) return;
  
  // Process node
  console.log(node.val);
  
  // Recursive calls without depth limit
  dfs(node.left);
  dfs(node.right);
};

// For very deep trees (>10,000 nodes), this can stack overflow!
```

✅ **GOOD:**
```javascript
// Option 1: Iterative DFS (no stack overflow risk)
const dfsIterative = (root) => {
  if (!root) return;
  
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    console.log(node.val);
    
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
};

// Option 2: Tail recursion with depth limit
const dfsSafe = (node, maxDepth = 10000, depth = 0) => {
  if (!node || depth > maxDepth) return;
  
  console.log(node.val);
  dfsSafe(node.left, maxDepth, depth + 1);
  dfsSafe(node.right, maxDepth, depth + 1);
};
```

**What goes wrong:** JavaScript has a limited call stack (~10,000 frames). Deep recursion causes "Maximum call stack size exceeded" error.

---

### Pitfall 2: Forgetting to Mark Nodes as Visited in Graphs

❌ **BAD:**
```javascript
const dfsGraph = (graph, node, result = []) => {
  result.push(node);
  
  // No visited tracking - infinite loop with cycles!
  for (const neighbor of graph[node]) {
    dfsGraph(graph, neighbor, result);
  }
  
  return result;
};

// For cyclic graphs: A → B → A, this never terminates!
```

✅ **GOOD:**
```javascript
const dfsGraph = (graph, start) => {
  const visited = new Set();
  const result = [];
  
  const dfs = (node) => {
    if (visited.has(node)) return;  // Check visited
    
    visited.add(node);
    result.push(node);
    
    for (const neighbor of (graph[node] || [])) {
      dfs(neighbor);
    }
  };
  
  dfs(start);
  return result;
};
```

**What goes wrong:** Without visited tracking, cyclic graphs cause infinite recursion and stack overflow.

---

### Pitfall 3: Not Backtracking in Path-Finding Problems

❌ **BAD:**
```javascript
const findAllPaths = (root) => {
  const paths = [];
  const path = [];
  
  const dfs = (node) => {
    if (!node) return;
    
    path.push(node.val);
    
    if (!node.left && !node.right) {
      paths.push(path);  // Wrong: shares same array reference!
    }
    
    dfs(node.left);
    dfs(node.right);
    // Forgot to backtrack: path.pop()
  };
  
  dfs(root);
  return paths;
};

// All paths reference the same array with all values!
```

✅ **GOOD:**
```javascript
const findAllPaths = (root) => {
  const paths = [];
  
  const dfs = (node, path) => {
    if (!node) return;
    
    path.push(node.val);
    
    if (!node.left && !node.right) {
      paths.push([...path]);  // Create new array copy
    }
    
    dfs(node.left, path);
    dfs(node.right, path);
    
    path.pop();  // Backtrack: remove current node
  };
  
  dfs(root, []);
  return paths;
};
```

**What goes wrong:** Without backtracking (popping after recursion), paths get contaminated with values from other branches.

---

### Pitfall 4: Confusing Pre/In/Post Order

❌ **BAD:**
```javascript
// Trying to get sorted values from BST with pre-order
const getSortedValues = (bstRoot) => {
  const result = [];
  
  const dfs = (node) => {
    if (!node) return;
    
    result.push(node.val);  // Pre-order: WRONG for sorted output!
    dfs(node.left);
    dfs(node.right);
  };
  
  dfs(bstRoot);
  return result;  // Not sorted!
};
```

✅ **GOOD:**
```javascript
// In-order gives sorted values for BST
const getSortedValues = (bstRoot) => {
  const result = [];
  
  const dfs = (node) => {
    if (!node) return;
    
    dfs(node.left);          // 1. Process left
    result.push(node.val);   // 2. Process root (in-order)
    dfs(node.right);         // 3. Process right
  };
  
  dfs(bstRoot);
  return result;  // Sorted!
};
```

**What goes wrong:** Using wrong traversal order produces incorrect results. Remember: **In-order for BST = sorted output**.

---

## 🔟 Time & Space Complexity

| **Operation** | **Time Complexity** | **Space Complexity** | **Explanation** |
|---------------|---------------------|----------------------|-----------------|
| DFS on tree (recursive) | O(n) | O(h) | Visit each node once; h = height (call stack) |
| DFS on tree (iterative) | O(n) | O(h) | Visit each node once; h = height (explicit stack) |
| DFS on graph | O(V + E) | O(V) | V vertices, E edges; visited set stores V nodes |
| All root-to-leaf paths | O(n) | O(h * paths) | Each path takes O(h) space |
| Cycle detection | O(V + E) | O(V) | Need visited set + recursion stack |
| Topological sort | O(V + E) | O(V) | Visit all vertices and edges once |

**Space Complexity Details:**
- **Recursive**: O(h) where h = height (worst case O(n) for skewed tree)
- **Iterative**: O(h) explicit stack (same as recursive)
- **For graphs**: O(V) for visited set
- **Balanced tree**: O(log n) space
- **Skewed tree**: O(n) space

---

## Summary

### Quick Reference Table

| **Aspect** | **Details** |
|------------|-------------|
| **Purpose** | Deep exploration of trees/graphs, find all paths, detect cycles |
| **Data Structure** | Stack (LIFO) or Recursion |
| **Time Complexity** | O(n) for trees, O(V+E) for graphs |
| **Space Complexity** | O(h) where h is height/depth |
| **Best For** | Backtracking, cycle detection, topological sort, all paths |
| **Frontend Applications** | Form validation, file trees, dependency resolution |

### 5 Key Takeaways

1. **Three Traversal Orders Matter**: Pre-order (root first), In-order (BST sorted), Post-order (children first for deletion/dependencies).

2. **Recursion vs Iteration**: Recursive is cleaner but risks stack overflow on deep trees; iterative is safer for production with unknown depths.

3. **Always Track Visited in Graphs**: Unlike trees (acyclic), graphs need a visited set to prevent infinite loops from cycles.

4. **Backtracking is Essential**: When finding all paths, always `path.pop()` after recursive calls to remove current node from path.

5. **Memory Advantage**: DFS uses O(h) space vs BFS's O(w), making it better for wide trees where height < width (common in frontend component trees).

---

## 📚 Further Reading

- [MDN: Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion) - Understanding recursive patterns
- [React Reconciliation Algorithm](https://react.dev/learn/preserving-and-resetting-state) - Uses DFS-like traversal
- [LeetCode DFS Problems](https://leetcode.com/tag/depth-first-search/) - Practice problems

---

<!-- quiz-start -->
### Q1: What is the key difference between pre-order, in-order, and post-order DFS?
- [ ] They use different data structures
- [x] They differ in when the root node is processed relative to its children
- [ ] Pre-order is iterative, in-order and post-order are recursive
- [ ] They all produce the same result but with different performance

### Q2: Why does DFS typically use less memory than BFS for tree traversal?
- [ ] DFS doesn't need to store visited nodes
- [ ] DFS uses a smaller data structure
- [x] DFS space is O(h) based on height, while BFS is O(w) based on width, and height is often less than width
- [ ] DFS always uses constant O(1) space

### Q3: When finding all paths in a graph, why is backtracking (path.pop()) essential?
- [ ] To improve performance by reducing array size
- [ ] To prevent stack overflow errors
- [x] To remove the current node from the path so it doesn't appear in other branch paths
- [ ] It's not essential, just a coding convention
<!-- quiz-end -->
