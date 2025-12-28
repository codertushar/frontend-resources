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
8. **Quick Quiz (Required)** - 2-3 multiple choice questions to test understanding

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
- Use code blocks with proper language specification (```javascript)
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

## 💎 Premium Content Strategy

The website uses a freemium model with **~50% free, ~50% premium** content. Premium status is automatically determined by `website/scripts/generate-content.js`:

### Balanced Premium Strategy

**Core Principle**: Each category/condition has at least 1 free article for discoverability and SEO.

| Category | Rule | Distribution |
|----------|------|--------------|
| **Easy difficulty** | Always FREE | 100% free |
| **Medium difficulty** | 50% free, 50% premium | Alternating (SEO + popular utilities) |
| **Hard difficulty** | First 1-2 articles FREE, rest premium | ~20% free, ~80% premium |
| **System Design** | First 1-2 articles FREE, rest premium | ~20% free, ~80% premium |
| **Machine Coding** | First 1-2 articles FREE, rest premium | ~20% free, ~80% premium |
| **AI** | First 1-2 articles FREE, rest premium | ~20% free, ~80% premium |
| **Browser/Rendering** | Premium (advanced topics) | ~90% premium |

### What's Premium (Paywalled)

- Advanced utilities: `debounce`, `throttle`, `deep_clone`, `map_limit`, `sequential`
- Hard difficulty articles (except first 2 per category)
- System Design (except intro articles)
- Machine Coding (except intro articles)
- AI (except intro articles)
- Advanced browser/rendering topics

### What's Always Free

- Easy difficulty articles (100% free)
- Intro/guide articles (`30-day`, `guide`, `introduction`, `getting-started`)
- Popular design patterns: `factory`, `singleton`, `observer`, `module`
- Fundamental concepts: `prototype`, `event_emitter`
- Observable array pattern (popular utility)
- Browser/rendering basics (non-advanced)

### Medium Difficulty Articles (50/50 Split)

For better SEO and user acquisition, 50% of medium difficulty articles are kept free. This is achieved by:
- First article in each category/medium: FREE
- Second article in each category/medium: PREMIUM
- Third article in each category/medium: FREE
- And so on (alternating pattern)

### Override with Frontmatter

Add `premium: true` or `premium: false` in markdown frontmatter to override:

```yaml
---
date: 2025-03-27
premium: true  # Force premium
---
```

### After Adding Content

Run content generation to update JSON files:

```bash
cd website && node scripts/generate-content.js
```

This will automatically recalculate the premium distribution based on the new rules.

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
- [ ] Quick quiz with 2-3 questions at the end

---

## 🎯 Quick Quiz Format (Required)

Every article MUST end with a quick quiz. Use this exact format:

```markdown
<!-- quiz-start -->
### Q1: Your question here?
- [ ] Wrong answer
- [x] Correct answer (mark with x)
- [ ] Another wrong option

### Q2: Second question?
- [ ] Option A
- [x] Option B (correct)
- [ ] Option C

### Q3: Third question?
- [x] Correct answer
- [ ] Wrong answer
- [ ] Another wrong answer
<!-- quiz-end -->
```

**Guidelines:**
- 2-3 questions per article
- 3-4 options per question
- Exactly ONE correct answer marked with `[x]`
- Test key concepts, not trivial details
- Place at the very end of the article

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

## 📝 Interview-Focused Article Generation Prompt

When generating educational articles for interview preparation, use the following comprehensive structure and guidelines:

### Article Structure (14 Sections)

1. **Title with Emoji** - Descriptive title
2. **Interview Importance Badge** - Add after title:
   > **Interview Importance:** 🔴 Critical / 🟡 Important / 🟢 Good-to-know — [One line explaining why this matters in interviews]

3. **Section 1️⃣ What is X?**
   - Clear conceptual explanation
   - ASCII diagram or visual representation
   - Real-world analogy that makes the concept click

4. **Section 2️⃣ Why Use X? / Why Does This Matter?**
   - Table of common use cases with Problem → Solution format
   - Performance benefits with concrete numbers if applicable

5. **Section 3️⃣ How It Works — Implementation**
   - Basic implementation with detailed comments
   - **🔍 Dry Run** - Step-by-step execution trace showing:
     - Initial state
     - Each step with variable values
     - Final output
   - Use ASCII tables or diagrams for the dry run

6. **Section 4️⃣ Understanding Key Concepts**
   - Explain WHY each important line of code exists
   - What breaks if you remove it?
   - Edge cases it handles

7. **Section 5️⃣ Production/Advanced Implementation**
   - Complete implementation with:
     - Input validation
     - Error handling
     - Edge cases covered
     - Additional features (cancel, flush, options, etc.)

8. **Section 6️⃣ Real-World Examples**
   - React hooks implementation (if applicable)
   - Practical usage patterns
   - Integration examples

9. **Section 7️⃣ Comparisons** (if applicable)
   - vs similar concepts (table format)
   - When to use which
   - Visual comparison diagram

10. **Section 8️⃣ Common Interview Questions**
    - 5-6 Q&A pairs
    - Include tricky questions interviewers ask
    - Code snippets for answers where needed

11. **Section 9️⃣ Common Pitfalls**
    - 3-4 pitfalls with:
      - ❌ BAD code example
      - ✅ GOOD code example
      - Explanation of what goes wrong

12. **Section 🔟 Time & Space Complexity**
    - Table format with Operation | Complexity | Explanation

13. **Summary**
    - Quick reference table
    - 5 key takeaways as bullet points

14. **📚 Further Reading**
    - 2-3 authoritative links (MDN, official docs)

### Style Guidelines

- Use GitHub-flavored markdown
- Use emoji headers (1️⃣, 2️⃣, etc.) for main sections
- Use tables for comparisons and structured data
- Use code blocks with `javascript` syntax highlighting
- Use ASCII diagrams for visual concepts:
```
┌─────────────┐
│    Box      │
└──────┬──────┘
       │
       ▼
```
- Include both ❌ BAD and ✅ GOOD examples
- Every implementation MUST have a dry run
- Dry runs should show variable state at each step
- Use horizontal rules (---) to separate major sections
- Keep explanations concise but thorough
- Focus on the "WHAT, WHY, HOW" framework

### Dry Run Format Example
```
Step 1: functionCall(args)
─────────────────────────────────────────────────────────
  variable1 = value
  variable2 = value
  Condition check: expression → result
  Action taken: description
  State after step: variable1 = newValue

Step 2: Next operation
─────────────────────────────────────────────────────────
  ...
```

### Content Quality Requirements

1. **Depth over breadth** - Explain concepts thoroughly
2. **Interview-focused** - Include what interviewers actually ask
3. **Practical** - Real code that works, not theoretical
4. **Edge cases** - Cover what most tutorials skip
5. **Memory aids** - Include mnemonics or memorable analogies
6. **No fluff** - Every line should add value

---

**Note**: This repository prioritizes educational value and code quality. Every contribution should help developers learn and understand frontend concepts more effectively.
