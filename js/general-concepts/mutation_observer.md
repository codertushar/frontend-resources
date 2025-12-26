---
description: MutationObserver watches for DOM changes like added, removed, or modified elements. Essential for reactive UIs, debugging, and monitoring dynamic content.
date: 2025-10-28T10:00:40+05:30
premium: false
---

# 👁️ MutationObserver: Watching DOM Changes in JavaScript

`MutationObserver` is a powerful Web API that lets you **watch for changes in the DOM** — whenever elements are added, removed, modified, or their attributes change. It's like having a security camera for your DOM tree.

---

## 💡 What Is MutationObserver?

`MutationObserver` is a built-in browser API that allows you to detect and react to **mutations** (changes) in the DOM without constantly polling or checking the DOM manually.

**Why do you need it?**
* Detect when external code modifies the DOM
* Auto-update UI based on structural changes
* Debug unexpected DOM mutations
* Build reactive components
* Monitor third-party scripts or dynamic content

---

## 🧠 Core Concepts

### 1. **MutationObserver Constructor**

```js
const observer = new MutationObserver((mutations) => {
  // mutations is an array of MutationRecord objects
  console.log("DOM changed!", mutations);
});
```

### 2. **Starting Observation with `.observe()`**

```js
observer.observe(targetElement, {
  // Configuration options
  childList: true,        // Watch for added/removed child nodes
  subtree: true,          // Watch all descendants
  attributes: true,       // Watch attribute changes
  attributeFilter: ['id', 'class'], // Only watch specific attributes
  characterData: true,    // Watch text content changes
  attributeOldValue: true, // Record old attribute values
  characterDataOldValue: true, // Record old text values
  attributeFilter: ['data-*'] // Watch specific attributes
});
```

### 3. **Stopping Observation with `.disconnect()`**

```js
observer.disconnect(); // Stop listening to all mutations
```

### 4. **Getting Pending Mutations**

```js
const mutations = observer.takeRecords(); // Get mutations without triggering callback
observer.disconnect();
```

---

## 🧪 Basic Example: Watch for Child Changes

```js
const container = document.getElementById('container');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('Children changed!');
      console.log('Added nodes:', mutation.addedNodes);
      console.log('Removed nodes:', mutation.removedNodes);
    }
  });
});

observer.observe(container, { childList: true });

// Trigger mutation
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello!';
container.appendChild(newDiv);
// Logs: Children changed! ...
```

---

## 🧪 Use Case 1: Monitor Text Content Changes

```js
const textElement = document.getElementById('status');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'characterData') {
      console.log('Text changed from:', mutation.oldValue);
      console.log('Text changed to:', mutation.target.textContent);
    }
  });
});

observer.observe(textElement, {
  characterData: true,
  characterDataOldValue: true
});

// Change text
textElement.textContent = 'Updated!';
// Logs: Text changed from: Old Text ... Changed to: Updated!
```

---

## 🧪 Use Case 2: Detect Attribute Modifications

```js
const button = document.querySelector('button');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes') {
      const attrName = mutation.attributeName;
      const oldValue = mutation.oldValue;
      const newValue = button.getAttribute(attrName);

      console.log(`Attribute "${attrName}" changed:`);
      console.log(`  From: ${oldValue}`);
      console.log(`  To: ${newValue}`);
    }
  });
});

observer.observe(button, {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ['disabled', 'data-status']
});

// Trigger attribute change
button.setAttribute('disabled', 'true');
// Logs: Attribute "disabled" changed: From: null To: true

button.setAttribute('data-status', 'active');
// Logs: Attribute "data-status" changed: From: null To: active
```

---

## 🧪 Use Case 3: Detect Deep Subtree Changes

Watch an entire element tree for any changes:

```js
const rootElement = document.getElementById('app');

const observer = new MutationObserver((mutations) => {
  console.log(`Detected ${mutations.length} mutation(s)`);

  mutations.forEach((mutation) => {
    switch (mutation.type) {
      case 'childList':
        console.log('- Child elements added/removed');
        break;
      case 'attributes':
        console.log(`- Attribute changed: ${mutation.attributeName}`);
        break;
      case 'characterData':
        console.log('- Text content changed');
        break;
    }
  });
});

observer.observe(rootElement, {
  childList: true,
  subtree: true,        // ✅ Watch all descendants
  attributes: true,
  characterData: true
});

// Any mutation anywhere in the tree will be detected
document.querySelector('#app div p').textContent = 'Changed!';
// Will detect this change even though it's deeply nested
```

---

## 🧪 Use Case 4: Auto-Highlight New Elements

```js
const container = document.getElementById('list');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Get newly added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Highlight new elements
          node.style.backgroundColor = 'yellow';

          // Fade out highlight after 2 seconds
          setTimeout(() => {
            node.style.transition = 'background-color 0.5s';
            node.style.backgroundColor = 'transparent';
          }, 2000);
        }
      });
    }
  });
});

observer.observe(container, { childList: true });

// Test: add elements dynamically
const newItem = document.createElement('li');
newItem.textContent = 'New item';
container.appendChild(newItem);
// The new item will be highlighted in yellow, then fade
```

---

## 🧪 Use Case 5: Track Form Input Changes

Detect when form fields are dynamically modified:

```js
const form = document.getElementById('myForm');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      // Check for newly added form fields
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
          console.log('New form field detected:', node.name || node.id);

          // Auto-attach event listeners
          node.addEventListener('change', () => {
            console.log('Form field changed:', node.value);
          });
        }
      });
    }
  });
});

observer.observe(form, {
  childList: true,
  subtree: true
});

// When new form fields are added to the form, they're automatically tracked
```

---

## 🧪 Use Case 6: Detect Image Load Completion

```js
const imageContainer = document.getElementById('images');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'IMG') {
          console.log('Image added:', node.src);

          // Wait for image to load
          node.addEventListener('load', () => {
            console.log('Image loaded:', node.src);
            node.style.border = '2px solid green';
          });

          node.addEventListener('error', () => {
            console.log('Image failed to load:', node.src);
            node.style.border = '2px solid red';
          });
        }
      });
    }
  });
});

observer.observe(imageContainer, { childList: true });
```

---

## 🧪 Use Case 7: Implement Auto-Save on DOM Changes

```js
const editor = document.getElementById('editor');
let autoSaveTimer;

const observer = new MutationObserver((mutations) => {
  // Clear previous timer
  clearTimeout(autoSaveTimer);

  // Start new timer (debounce)
  autoSaveTimer = setTimeout(() => {
    const content = editor.innerHTML;
    console.log('Auto-saving:', content);
    // Send to server
    fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }, 1000); // Save 1 second after last change
});

observer.observe(editor, {
  childList: true,
  subtree: true,
  characterData: true,
  attributes: true
});

// Every change triggers auto-save with debouncing
```

---

## 🧪 Use Case 8: Detect Third-Party Script Injections

Monitor for unauthorized DOM modifications:

```js
const body = document.body;
const trackedElements = new Set();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Flag unexpected elements
          if (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') {
            console.warn('⚠️ Suspicious element detected:', node.tagName);
            console.warn('Source:', node.src || node.textContent.slice(0, 50));
          }

          trackedElements.add(node);
        }
      });
    }
  });
});

observer.observe(body, { childList: true, subtree: true });
```

---

## 🧪 Use Case 9: MutationRecord Structure

Understanding what information is available in each mutation:

```js
const observer = new MutationObserver((mutations) => {
  mutations.forEach((record) => {
    console.log({
      type: record.type,                    // 'childList', 'attributes', 'characterData'
      target: record.target,                // The element that was mutated
      addedNodes: record.addedNodes,        // Nodes that were added
      removedNodes: record.removedNodes,    // Nodes that were removed
      previousSibling: record.previousSibling, // Previous sibling node
      nextSibling: record.nextSibling,      // Next sibling node
      attributeName: record.attributeName,  // Name of changed attribute
      attributeNamespace: record.attributeNamespace, // Namespace of attribute
      oldValue: record.oldValue,            // Old value (if recorded)
      addedNodes: record.addedNodes.length  // Count of added nodes
    });
  });
});

observer.observe(document.body, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});
```

---

## 🧪 Use Case 10: Performance Monitoring with MutationObserver

Track DOM manipulation performance:

```js
let mutationCount = 0;
let mutationStartTime = Date.now();

const observer = new MutationObserver((mutations) => {
  mutationCount += mutations.length;

  const elapsed = Date.now() - mutationStartTime;

  if (elapsed >= 5000) { // Log every 5 seconds
    const rate = (mutationCount / elapsed * 1000).toFixed(2);
    console.log(`Mutation rate: ${rate} mutations/sec`);
    console.log(`Total mutations: ${mutationCount}`);

    // Reset counters
    mutationCount = 0;
    mutationStartTime = Date.now();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});
```

---

## 🧪 Real-World Example: Dynamic List Manager

A complete, practical example:

```js
class DynamicListManager {
  constructor(listSelector) {
    this.listElement = document.querySelector(listSelector);
    this.observer = new MutationObserver(this.onMutation.bind(this));
    this.itemCount = 0;
  }

  start() {
    this.observer.observe(this.listElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-priority']
    });
    console.log('List manager started');
  }

  onMutation(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI') {
            this.itemCount++;
            console.log(`✅ Item added (Total: ${this.itemCount})`);

            // Style by priority
            const priority = node.dataset.priority || 'normal';
            this.applyPriorityStyle(node, priority);
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'LI') {
            this.itemCount--;
            console.log(`❌ Item removed (Total: ${this.itemCount})`);
          }
        });
      }

      if (mutation.type === 'attributes' && mutation.attributeName === 'data-priority') {
        const priority = mutation.target.dataset.priority;
        this.applyPriorityStyle(mutation.target, priority);
      }
    });

    this.updateListStats();
  }

  applyPriorityStyle(element, priority) {
    const styles = {
      high: { backgroundColor: '#ffcccc', borderLeft: '4px solid red' },
      normal: { backgroundColor: '#f0f0f0', borderLeft: '4px solid gray' },
      low: { backgroundColor: '#ccffcc', borderLeft: '4px solid green' }
    };

    Object.assign(element.style, styles[priority] || styles.normal);
  }

  updateListStats() {
    console.log(`📊 List Stats: ${this.itemCount} items`);
  }

  stop() {
    this.observer.disconnect();
    console.log('List manager stopped');
  }
}

// Usage
const manager = new DynamicListManager('#todoList');
manager.start();

// Add items
const list = document.getElementById('todoList');
const item1 = document.createElement('li');
item1.textContent = 'Buy groceries';
item1.dataset.priority = 'high';
list.appendChild(item1);
// Logs: ✅ Item added (Total: 1), 📊 List Stats: 1 items

const item2 = document.createElement('li');
item2.textContent = 'Read book';
item2.dataset.priority = 'low';
list.appendChild(item2);
// Logs: ✅ Item added (Total: 2), 📊 List Stats: 2 items
```

---

## 📋 Configuration Options Reference

| Option | Type | Purpose |
|--------|------|---------|
| `childList` | boolean | Watch for added/removed child nodes |
| `subtree` | boolean | Watch all descendants (not just direct children) |
| `attributes` | boolean | Watch attribute changes |
| `attributeFilter` | string[] | Only watch specific attributes (requires `attributes: true`) |
| `attributeOldValue` | boolean | Record old attribute values (requires `attributes: true`) |
| `characterData` | boolean | Watch text content changes |
| `characterDataOldValue` | boolean | Record old text values (requires `characterData: true`) |

---

## ⚠️ Performance Considerations

### 1. **Don't Watch Everything**
```js
// ❌ BAD: Too broad
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

// ✅ GOOD: Specific and targeted
observer.observe(editorElement, {
  childList: true,
  characterData: true,
  subtree: false
});
```

### 2. **Use `attributeFilter` to Narrow Down**
```js
// ❌ BAD: Watches all attributes
observer.observe(element, {
  attributes: true
});

// ✅ GOOD: Only watch relevant attributes
observer.observe(element, {
  attributes: true,
  attributeFilter: ['class', 'data-id', 'disabled']
});
```

### 3. **Debounce High-Frequency Changes**
```js
let debounceTimer;

const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // Handle mutations here
  }, 300);
});
```

### 4. **Stop When Done**
```js
observer.disconnect(); // Don't leave observers running unnecessarily
```

---

## ⚠️ Common Pitfalls & Limitations

### 1. **Observer Callback Can Cause Infinite Loops**
```js
// ❌ DANGEROUS: Modifying DOM inside observer creates feedback loop
const observer = new MutationObserver((mutations) => {
  element.appendChild(document.createElement('div')); // This triggers observer again!
});

observer.observe(element, { childList: true });

// ✅ SAFE: Use a flag to prevent recursion
let isUpdating = false;

const observer = new MutationObserver((mutations) => {
  if (isUpdating) return;
  isUpdating = true;

  element.appendChild(document.createElement('div'));

  isUpdating = false;
});
```

### 2. **Mutations Delivered in Batches**
```js
// All mutations since last callback are delivered as an array
// If DOM changes very rapidly, they're batched together
const observer = new MutationObserver((mutations) => {
  console.log(`Received ${mutations.length} mutations`);
  // This might be > 1 even if you changed one thing
});
```

### 3. **MutationObserver Doesn't Watch Style Changes**
```js
// ❌ Won't detect style changes
element.style.color = 'red'; // MutationObserver won't detect this

// ✅ But it WILL detect attribute changes
element.setAttribute('style', 'color: red'); // MutationObserver will detect this
```

### 4. **Browser Compatibility**
`MutationObserver` is widely supported in modern browsers:
* Chrome 26+
* Firefox 14+
* Safari 6.1+
* IE 11+ (not IE10 or below)
* Edge (all versions)

---

## 🔗 MutationObserver vs. Alternatives

| Use Case | Tool | Pros | Cons |
|----------|------|------|------|
| Watch DOM changes | `MutationObserver` | Native, efficient, detailed | Can be expensive with broad scope |
| Watch element visibility | `IntersectionObserver` | Better for scroll-based | Different purpose |
| Watch element resize | `ResizeObserver` | Lightweight for sizing | Different purpose |
| Manual polling | `setInterval` + inspection | Simple | Very inefficient |

---

## 🧬 Summary

* **MutationObserver** watches DOM changes without continuous polling
* **Configuration** lets you specify exactly what mutations to detect
* **Real-world uses** include auto-save, dynamic UI updates, performance monitoring, and security detection
* **Performance matters** — only watch what you need and stop observers when done
* **Feedback loops** are possible — guard against recursive mutations
* **Modern browsers** all support it (IE11+)

---

## 🌐 Related Resources

* [Proxy](./proxy.md) — For intercepting object operations
* [AbortController](./abort_controller.md) — For canceling operations
* [Event Listeners](./general.md) — Traditional way to listen for events
* [Web API MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

---

**Happy DOM watching! 👀**
