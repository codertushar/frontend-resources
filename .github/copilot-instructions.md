# GitHub Copilot Instructions for frontend-resources

## 🎯 Repository Purpose

This is an educational knowledge base for frontend developers covering:
- JavaScript concepts (ES6+, promises, proxies, etc.)
- Data structures and algorithms (DSA)
- Design patterns (factory, singleton, observer, etc.)
- Utility functions and polyfills (array methods, promise utilities, etc.)
- Machine-coding examples (real-world implementation patterns)
- General frontend knowledge (browser rendering, performance, etc.)

**Mission**: Create high-quality, educational resources with practical examples that help developers learn frontend concepts.

---

## 📋 Core Guidelines

### 1. Content Structure

Every educational resource MUST follow this 7-step structure:

1. **Title with Emoji** - Use appropriate emoji prefix and clear description
2. **Introduction** - Explain what it is, why it matters (2-3 sentences)
3. **Core Concepts** - Technical details and fundamental principles
4. **Code Examples** - At least 2-3 practical use cases with modern ES6+ syntax
5. **Limitations & Considerations** - Edge cases, performance implications
6. **Summary** - Bullet-point key takeaways
7. **Related Resources (Optional)** - Cross-references to related topics

### 2. Code Style Conventions

**ALWAYS use modern ES6+ JavaScript:**

```javascript
// ✅ DO: Use const/let and arrow functions
const processData = (items) => {
  return items.filter(item => item.active)
    .map(item => ({ ...item, processed: true }));
};

// ❌ DON'T: Avoid var and function declarations
var processData = function(items) { ... };

// ✅ DO: Include error handling
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// ✅ DO: Add meaningful comments explaining "why"
const cache = new Map(); // Prevent redundant calculations
```

### 3. File Naming

- Use `snake_case` for ALL filenames (e.g., `deep_clone.md`, not `deepClone.md`)
- Use descriptive names (e.g., `deep_clone.md`, not `util1.md`)
- Group related files in appropriate folders

### 4. Markdown Formatting

- Use emoji prefixes in headings for visual navigation
- Maintain consistent heading hierarchy (don't skip levels)
- Use code blocks with proper language specification (\`\`\`javascript)
- Use tables for comparisons

**Common emoji prefixes:**
- 🎯 Main topic/feature title
- 💡 General concepts
- 🧠 Detailed explanations
- ✅ Correct/recommended approach
- ❌ Incorrect/anti-pattern
- 🧪 Examples/testing
- 📊 Arrays/data structures
- 🔗 Functions/method binding
- ⏳ Promises/async patterns
- ⏱️ Timing-related (debounce, throttle)
- 🧰 Utilities
- 🧬 Deep operations (clone, copy)

---

## 📁 Repository Organization

```
/frontend-resources
├── /ai                    # AI/LLM integration resources
├── /dsa                   # Data structures & algorithms
├── /general               # Frontend concepts
│   └── /design-patterns   # Design patterns
├── /js                    # JavaScript topics
│   ├── /general-concepts  # Core JS concepts
│   ├── /polyfills         # Implementations of standard methods
│   │   ├── /arrays        # Array method polyfills
│   │   └── /general       # Function polyfills (call, bind, apply)
│   ├── /promises          # Promise patterns & utilities
│   └── /utils             # Utility functions
├── /machine-coding        # Practical real-world implementations
└── /system-design         # System design resources
```

**When adding new content:**
1. Determine the appropriate folder based on content type
2. Check for duplicates to avoid redundancy
3. Follow naming conventions (snake_case)
4. Apply the 7-step structure
5. Include 2-3 practical examples minimum
6. Verify code examples are syntactically correct

---

## 🔍 Content Quality Checklist

Before completing any task, verify:

- [ ] Title has clear emoji prefix and descriptive name
- [ ] Introduction explains concept and relevance
- [ ] Core concepts with technical details included
- [ ] At least 2-3 practical code examples
- [ ] Modern ES6+ syntax used throughout
- [ ] Error handling included where needed
- [ ] Comments explain "why", not "what"
- [ ] Limitations and edge cases mentioned
- [ ] Summary with key takeaways provided
- [ ] Markdown syntax is correct
- [ ] Code blocks have language specified
- [ ] Emoji prefixes are consistent
- [ ] Heading hierarchy is maintained
- [ ] Cross-references to related resources where applicable
- [ ] No significant overlap with existing files

---

## 🛠️ Build & Test

This repository is primarily educational content (markdown files) with no complex build process.

**Available commands:**
- `node update-readme.js` - Regenerates README.md with file structure (run after adding new content)

**No formal testing required** - Code examples should be verified manually for correctness.

---

## 📝 Common Tasks

### Adding a New Resource

1. Identify the correct category folder
2. Create a new file with `snake_case` naming
3. Follow the 7-step content structure
4. Include 2-3 practical examples
5. Use modern ES6+ syntax
6. Add error handling
7. Cross-reference related topics
8. Run `node update-readme.js` to update the main README

### Creating Polyfills

- Implement standard JavaScript methods
- Include edge case handling
- Show both basic and advanced usage
- Compare with native implementation
- Document limitations and performance considerations

### Creating Utility Functions

- Implement helper functions for common tasks
- Provide variations with different approaches
- Include performance considerations
- Show real-world use cases
- Document edge cases

### Creating Promise Utilities

- Implement promise utilities or patterns
- Explain async flow control
- Include error handling patterns
- Show practical use cases (API calls, network requests)

---

## 🚫 What NOT to Do

- ❌ DON'T use outdated syntax (var, function declarations)
- ❌ DON'T create files without the 7-step structure
- ❌ DON'T skip error handling in examples
- ❌ DON'T use camelCase or PascalCase for filenames
- ❌ DON'T duplicate existing resources
- ❌ DON'T omit the summary/key takeaways section
- ❌ DON'T leave code examples untested
- ❌ DON'T break existing cross-references

---

## 📚 Additional Resources

For comprehensive AI agent guidelines and detailed patterns, see **[AGENTS.md](../AGENTS.md)** which contains:
- Detailed content structure requirements
- Code style conventions with examples
- Repository organization patterns
- Agent interaction patterns
- Cross-reference best practices
- Complete template for new resources
- Validation examples
- Emoji guidelines

---

## 💡 Best Practices Summary

1. **Always use modern ES6+ JavaScript syntax** (const/let, arrow functions)
2. **Follow the 7-step content structure** for all educational resources
3. **Use snake_case for filenames** consistently
4. **Include practical examples** (minimum 2-3 per resource)
5. **Add error handling** in all code examples
6. **Use emoji prefixes** in markdown headings
7. **Cross-reference related topics** to build connections
8. **Run `node update-readme.js`** after adding new content
9. **Verify code examples** are syntactically correct
10. **Check AGENTS.md** for comprehensive guidelines

---

**Note**: This repository prioritizes educational value and code quality. Every contribution should help developers learn and understand frontend concepts more effectively.
