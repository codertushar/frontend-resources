# 🤖 AGENTS.md: AI Agent Guidelines

This document provides comprehensive guidance for AI agents, LLMs, and coding assistants working with the **frontend-resources** repository. It complements the repository instructions and ensures consistent, high-quality contributions.

---

## 📖 Overview

The **frontend-resources** repository is an educational knowledge base containing practical examples, implementations, and explanations of:

- **JavaScript concepts** (ES6+, promises, proxies, etc.)
- **Data structures and algorithms** (DSA)
- **Design patterns** (factory, singleton, observer, etc.)
- **Utility functions and polyfills** (array methods, promise utilities, etc.)
- **Machine-coding examples** (real-world implementation patterns)
- **General frontend knowledge** (browser rendering, performance, etc.)

AI agents should help maintain, enhance, and extend this repository while adhering to established conventions and quality standards.

---

## 🎯 Core Agent Responsibilities

### 1. **Content Creation & Enhancement**
- Generate new educational resources following the established structure
- Create practical, well-commented code examples with modern ES6+ syntax
- Provide clear explanations complemented by use cases and edge cases

### 2. **Quality Assurance**
- Ensure all code examples follow project conventions (snake_case filenames, emoji headings, etc.)
- Validate TypeScript types where applicable
- Check for completeness: introductions, core concepts, use cases, limitations, summaries

### 3. **Consistency Maintenance**
- Follow the established content structure across all markdown files
- Maintain code style consistency (arrow functions, `const`-first approach, error handling)
- Use emoji prefixes in markdown headings for visual navigation

### 4. **Repository Navigation**
- Direct users to existing resources when relevant
- Suggest cross-references between related topics
- Identify gaps in coverage for future content

---

## 📋 Content Structure Requirements

Every educational resource in this repository should follow this structure:

### 1. **Title with Emoji**
```markdown
# 🎯 Feature Name: Clear Description

Brief one-liner explaining what this is.
```

### 2. **Introduction**
- What is this concept?
- Why should developers care?
- Quick relevance statement

### 3. **Core Concepts & Technical Details**
- Fundamental principles
- How it works internally
- Key characteristics or behavior

### 4. **Code Examples**
- Basic implementation
- Practical, real-world use cases
- Edge cases and error handling
- Variations and alternatives

### 5. **Limitations & Considerations**
- When NOT to use this
- Performance implications
- Browser/environment compatibility

### 6. **Summary & Key Takeaways**
- Bullet-point recap of main ideas
- Best practices

### 7. **Final Thoughts (Optional)**
- Broader implications
- Related concepts worth exploring
- Links to other resources

---

## 💻 Code Style & Conventions

### JavaScript Standards
```javascript
// ✅ DO: Use modern ES6+ syntax
const processData = (items) => {
  return items.filter(item => item.active)
    .map(item => ({ ...item, processed: true }));
};

// ❌ DON'T: Avoid var and function declarations
var processData = function(items) {
  return items.filter(function(item) { return item.active; });
};

// ✅ DO: Include error handling
function divide(a, b) {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
}

// ✅ DO: Use const by default, let when needed
const maxRetries = 3; // Never changes
let currentRetry = 0; // Changes in loop

// ✅ DO: Include TypeScript types where applicable
/**
 * @param {number[]} arr - Input array
 * @returns {number} Sum of array elements
 */
const sum = (arr) => arr.reduce((acc, num) => acc + num, 0);
```

### Comments
```javascript
// ✅ DO: Explain "why", not "what"
const cache = new Map(); // Prevent redundant calculations

// ❌ DON'T: State the obvious
const cache = new Map(); // Create a new Map
```

### File Naming
- Use `snake_case` for all filenames
- Use descriptive names: `deep_clone.md`, not `util1.md`
- Group related files in folders: `/polyfills/arrays/`, `/promises/`, `/general-concepts/`

### Markdown Formatting
- Use emoji prefixes in headings for visual scanning
- Maintain consistent heading hierarchy (don't skip levels)
- Use code blocks with proper language specification
- Use tables for comparisons

---

## 📁 Repository Organization

```
/frontend-resources
├── /ai                    # AI/LLM integration resources
├── /dsa                   # Data structures & algorithms
├── /general               # Frontend concepts
│   └── /design-patterns   # Design patterns (factory, singleton, etc.)
├── /js                    # JavaScript topics
│   ├── /general-concepts  # Core JS concepts (prototype, spread, etc.)
│   ├── /polyfills         # Implementations of standard methods
│   │   ├── /arrays        # Array method polyfills
│   │   └── /general       # Function polyfills (call, bind, apply)
│   ├── /promises          # Promise patterns & utilities
│   └── /utils             # Utility functions (debounce, deep_clone, etc.)
├── /machine-coding        # Practical real-world implementations
└── /system-design         # System design resources
```

---

## 💎 Premium Content Strategy

The website uses a freemium model with ~40-50% premium content. The premium status is automatically determined by `generate-content.js` based on these rules:

### Premium Content Rules

| Rule | Description | Premium? |
|------|-------------|----------|
| **Hard difficulty** | All articles with `difficulty: hard` | ✅ Yes |
| **System Design** | All system-design category content | ✅ Yes (100%) |
| **Machine Coding** | All machine-coding category content | ✅ Yes (100%) |
| **AI** | All AI category content | ✅ Yes (100%) |
| **DSA** | Medium and hard difficulty | ✅ Yes (except easy) |
| **Advanced utilities** | debounce, throttle, deep_clone, map_limit, sequential promises, prototype | ✅ Yes |
| **Browser/rendering** | Articles about browser internals, rendering | ✅ Yes |
| **Easy difficulty** | All easy articles | ❌ No (always free) |
| **Basic polyfills** | Simple array methods, basic concepts | ❌ No |
| **Design patterns** | General design patterns | ❌ No |
| **Intro guides** | Articles with "guide", "30-day", "introduction" in name | ❌ No |

### Overriding Premium Status

You can override the automatic premium detection by adding `premium: true` or `premium: false` in the markdown frontmatter:

```yaml
---
date: 2025-03-27T07:19:24+05:30
description: Article description here
premium: true  # Force this article to be premium
---
```

### Current Distribution Target

- **Free**: ~50-60% (for SEO, user acquisition, demonstrating value)
- **Premium**: ~40-50% (monetization, high-value interview prep content)

### Running Content Generation

After adding or modifying content, run:

```bash
cd website && node scripts/generate-content.js
```

This regenerates:
- `website/src/data/content.json` - Main content data
- `website/public/content.json` - For service worker/PWA
- `website/src/data/premium-content.json` - Full premium content (server-side only)

### Adding New Content
1. **Determine Category**: Select the appropriate folder based on content type
2. **Check for Duplicates**: Search existing files to avoid redundancy
3. **Follow Naming**: Use `snake_case` with descriptive names
4. **Apply Structure**: Follow the 7-step structure outlined above
5. **Add Examples**: Include 2-3 practical use cases minimum
6. **Test Code**: Verify all code examples are syntactically correct

---

## 🔍 Content Review Checklist

Before considering a resource complete, verify:

- [ ] **Title**: Clear emoji prefix and descriptive name
- [ ] **Introduction**: Explains concept and relevance (2-3 sentences)
- [ ] **Core Concepts**: Technical details explained clearly
- [ ] **Code Examples**:
  - [ ] At least 2-3 practical use cases
  - [ ] Modern ES6+ syntax used
  - [ ] Error handling included where needed
  - [ ] Comments explain "why", not "what"
- [ ] **Limitations**: Edge cases or gotchas mentioned
- [ ] **Summary**: Key takeaways provided
- [ ] **Formatting**:
  - [ ] Markdown syntax correct
  - [ ] Code blocks have language specified
  - [ ] Emoji prefixes consistent
  - [ ] Heading hierarchy maintained
- [ ] **Cross-References**: Links to related resources where applicable
- [ ] **No Duplicates**: Content doesn't overlap significantly with existing files

---

## 🧬 Common Patterns & Examples

### When to Create Array Polyfill Files
- Implement standard JavaScript Array methods
- Include edge case handling
- Show both basic and advanced usage

**Example**: `js/polyfills/arrays/map.md`
- Simple map implementation
- Comparing with native performance
- Use cases and limitations
- Handling `this` context

### When to Create Utility Files
- Implement helper functions for common tasks
- Provide variations with different approaches
- Include performance considerations

**Example**: `js/utils/deep_clone.md`
- Recursive deep cloning
- Handling circular references
- Comparing with structuredClone API
- Performance implications

### When to Create Promise Files
- Implement promise utilities or patterns
- Explain async flow control
- Include error handling patterns

**Example**: `js/promises/retry.md`
- Retry logic implementation
- Exponential backoff pattern
- Handling timeout edge cases
- Real-world use cases (API calls, network requests)

### When to Create Machine-Coding Files
- Real-world implementation challenges
- Complete working examples with commentary
- Include trade-offs and considerations

**Example**: `machine-coding/analytics_sdk.md`
- Practical implementation patterns
- Event tracking and batching
- Network considerations
- Error recovery

---

## 🎨 Emoji Guidelines for Headings

Use these emoji prefixes consistently throughout markdown files:

| Emoji | Use Case |
|-------|----------|
| 🎯 | Main topic/feature title |
| 💡 | General concepts |
| 🔄 | Prototype/inheritance patterns |
| 📄 | Basic explanations |
| 🧠 | Detailed explanations/how-it-works |
| ✅ | Correct/recommended approach |
| ❌ | Incorrect/anti-pattern |
| 🧪 | Examples/testing/demonstration |
| 📊 | Arrays/data structures |
| 🔗 | Functions/method binding |
| ⏳ | Promises/async patterns |
| ⏱️ | Timing-related (debounce, throttle) |
| 🧰 | Utilities |
| 🧬 | Deep operations (clone, copy) |
| 🔔 | Event-related |
| 🔍 | Analysis/inspection |
| 📈 | Progress/incremental |
| 🛠️ | Machine-coding |

---

## �🚀 Agent Interaction Patterns

### Pattern 1: Content Creation
**User Request**: "Add a resource about XYZ"

**Agent Steps**:
1. Check if resource exists
2. Identify category and placement
3. Review similar existing resources for style
4. Generate content following the 7-step structure
5. Include 2-3 practical examples
6. Provide summary

### Pattern 2: Code Review
**User Request**: "Review this code example"

**Agent Steps**:
1. Check against code style conventions
2. Verify error handling
3. Suggest ES6+ improvements if applicable
4. Ensure comments explain "why"
5. Validate TypeScript types

### Pattern 3: Gap Analysis
**User Request**: "What topics are missing?"

**Agent Steps**:
1. Scan existing content structure
2. Identify common frontend topics not covered
3. Suggest priority additions
4. Provide outline for new resources

### Pattern 4: Consistency Fixes
**User Request**: "Ensure all files follow conventions"

**Agent Steps**:
1. Audit file naming (snake_case)
2. Check markdown structure compliance
3. Verify code style consistency
4. Update emoji prefixes
5. Fix heading hierarchy

---

## 🔗 Cross-Reference Best Practices

When creating new content, link to related resources:

```markdown
### 📚 Related Resources
- See [deep_clone.md](../utils/deep_clone.md) for object cloning
- Learn about [promise utilities](../promises/) for async patterns
- Review [design patterns](../../general/design-patterns/) for architectural approaches
```

---

## ⚠️ Agent Constraints & Limitations

### DO:
- ✅ Follow established code and markdown conventions
- ✅ Provide practical, tested examples
- ✅ Include error handling in examples
- ✅ Link to related existing resources
- ✅ Explain trade-offs and limitations
- ✅ Use modern ES6+ JavaScript
- ✅ Include edge case discussions

### DON'T:
- ❌ Create code that contradicts established style
- ❌ Duplicate existing resources
- ❌ Use outdated syntax or patterns (var, function declarations)
- ❌ Omit error handling in practical examples
- ❌ Skip the summary/key takeaways section
- ❌ Leave code examples untested or syntactically incorrect
- ❌ Break existing cross-references when reorganizing

---

## 📝 Template for New Resources

Use this template as a starting point for new educational resources:

```markdown
# 🎯 Feature Name: One-liner Description

Relevant introductory sentence.

---

## 💡 What is X?

Brief explanation of the concept and why it matters.

---

## 🧠 Core Concepts

### Key Point 1
Explanation.

### Key Point 2
Explanation.

---

## ✅ Implementation

### Basic Example
\`\`\`javascript
// Code here
\`\`\`

### Use Case 1
\`\`\`javascript
// Code here
\`\`\`

### Use Case 2
\`\`\`javascript
// Code here
\`\`\`

---

## ⚠️ Limitations & Considerations

- Point 1
- Point 2
- Point 3

---

## 🔍 Summary

- Key takeaway 1
- Key takeaway 2
- Key takeaway 3

---

## 🌐 Related Resources

- [Related Topic](./path/to/file.md)
- [Another Topic](./path/to/file.md)
```

---

## 🧪 Validation Examples

### Example 1: Good Resource Structure ✅
- Clear emoji in title
- 2-3 paragraph introduction
- Code with modern syntax
- 3+ practical examples
- Edge cases covered
- Limitations section
- Summary with key takeaways
- Cross-references provided

### Example 2: Needs Improvement ⚠️
- Vague title without emoji
- Single code example
- Missing error handling
- No limitations discussed
- Incomplete summary

---

## 🔄 Continuous Improvement

### Regular Tasks for Agents:
1. **Audit existing content** for style consistency
2. **Identify gaps** in coverage
3. **Suggest improvements** to aging resources
4. **Update examples** to modern syntax/practices
5. **Improve cross-references** between topics
6. **Enhance README** with new additions

---

## 📞 Communication Guidelines

### When Responding to Users:
- **Be concise**: Point to specific existing resources
- **Be specific**: Reference file names and sections
- **Be helpful**: Suggest next steps or related topics
- **Be accurate**: Verify content exists before referencing
- **Be respectful**: Acknowledge project conventions in responses

---

## 🎓 Summary

AI agents working with **frontend-resources** should:

1. **Understand the purpose**: Educational resource for JavaScript, DSA, and frontend development
2. **Follow the structure**: Consistent markdown format with 7-step content outline
3. **Maintain code quality**: Modern ES6+, error handling, clear comments
4. **Respect conventions**: snake_case naming, emoji prefixes, proper organization
5. **Ensure completeness**: Every resource should be production-ready with examples, limitations, and summaries
6. **Build connections**: Cross-reference related topics
7. **Stay consistent**: Match the style and depth of existing resources

By adhering to these guidelines, AI agents can effectively contribute to building a high-quality, maintainable knowledge base that benefits all developers learning frontend concepts.

---

## 🚀 Next Steps for Agents

When starting work on this repository:

1. Read the main [README.md](./README.md) for project overview
2. Review this `AGENTS.md` document for comprehensive guidelines and LLM integration patterns
3. Examine 2-3 existing resources in the target category to understand style and depth
4. Follow the structure and style of existing resources
5. Use the content review checklist before considering work complete
6. Reference the emoji guidelines and code style conventions throughout your contributions

---

## 📝 Interview-Focused Article Generation Prompt

When generating educational articles for interview preparation, use the following comprehensive prompt to ensure high-quality, interview-worthy content:

---

### System Prompt for Article Generation

You are an expert technical writer creating interview preparation content for frontend developers. Enhance the following article to make it worthy of praise for people preparing for interviews and learning concepts in depth.

#### Requirements

##### Structure
Transform the article to follow this exact structure:

1. **Title with Emoji** - Descriptive title
2. **Interview Importance Badge** - Add this line after title:
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

##### Style Guidelines

- Use GitHub-flavored markdown
- Use emoji headers (1️⃣, 2️⃣, etc.) for main sections
- Use tables for comparisons and structured data
- Use code blocks with `javascript` syntax highlighting
- Use ASCII diagrams for visual concepts like:
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

##### Dry Run Format Example
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

##### Content Quality Requirements

1. **Depth over breadth** - Explain concepts thoroughly
2. **Interview-focused** - Include what interviewers actually ask
3. **Practical** - Real code that works, not theoretical
4. **Edge cases** - Cover what most tutorials skip
5. **Memory aids** - Include mnemonics or memorable analogies
6. **No fluff** - Every line should add value

---

#### Usage

When asked to generate or enhance an article, apply all the guidelines above. The goal is to create comprehensive content that someone reading it would feel confident explaining and implementing the concept in an interview.

---

**Last Updated**: December 11, 2025
**Version**: 1.1
**Maintained by**: frontend-resources repository
```
