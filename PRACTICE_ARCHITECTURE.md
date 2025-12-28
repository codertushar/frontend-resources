# Machine Coding Practice - Feature Architecture

## Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                              │
│  Routes:                                                     │
│    • /practice → MachineCodingPractice                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Layout.jsx (Navigation)                     │
│  Nav Links:                                                  │
│    • Home  • Library  • Path  • Practice ← NEW              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           MachineCodingPractice.jsx                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Question Selector Dropdown                        │    │
│  │  [🔢 Chained Calculator (JavaScript) ▼]           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Question Info Card                                │    │
│  │  Title: 🔢 Chained Calculator         [medium]    │    │
│  │  Description: Create a chainable calculator...     │    │
│  │  Category: JavaScript | Type: Output-based         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────┬──────────────────────────────┐   │
│  │                      │                               │   │
│  │  Code Editor Panel   │   Test Results Panel         │   │
│  │                      │                               │   │
│  │ ┌─────────────────┐  │  ┌────────────────────────┐ │   │
│  │ │ [JavaScript][React] │  │ Test Results (toggle) │ │   │
│  │ └─────────────────┘  │  └────────────────────────┘ │   │
│  │                      │                               │   │
│  │ ┌─────────────────┐  │  ┌────────────────────────┐ │   │
│  │ │                 │  │  │ ✅ Basic operations    │ │   │
│  │ │  Sandpack       │  │  │    Passed              │ │   │
│  │ │  Code Editor    │  │  │                        │ │   │
│  │ │                 │  │  │ ✅ Starting from zero  │ │   │
│  │ │  (500px high)   │  │  │    Passed              │ │   │
│  │ │                 │  │  │                        │ │   │
│  │ │  - Line numbers │  │  │ ✅ Division by zero    │ │   │
│  │ │  - Syntax HL    │  │  │    Passed              │ │   │
│  │ │  - Auto-complete│  │  │                        │ │   │
│  │ │                 │  │  │ ❌ Reset functionality │ │   │
│  │ └─────────────────┘  │  │    Failed: Expected... │ │   │
│  │                      │  └────────────────────────┘ │   │
│  │ ┌─────────────────┐  │                               │   │
│  │ │[Run Tests]      │  │  ┌────────────────────────┐ │   │
│  │ │[Show Solution]  │  │  │ 📝 Instructions        │ │   │
│  │ └─────────────────┘  │  │  1. Read problem       │ │   │
│  │                      │  │  2. Choose language    │ │   │
│  │ ┌─────────────────┐  │  │  3. Implement solution │ │   │
│  │ │ Solution Code   │  │  │  4. Run tests          │ │   │
│  │ │ (toggle show)   │  │  │  5. View solution      │ │   │
│  │ └─────────────────┘  │  └────────────────────────┘ │   │
│  │                      │                               │   │
│  │                      │  ┌────────────────────────┐ │   │
│  │                      │  │ 💡 Tips                │ │   │
│  │                      │  │  • Take your time      │ │   │
│  │                      │  │  • Test edge cases     │ │   │
│  │                      │  │  • Use console.log     │ │   │
│  └──────────────────────┴──└────────────────────────┘ │   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
PRACTICE_QUESTIONS (constant array)
    │
    ├─> Question 1: Chained Calculator
    │   ├─ id, title, description
    │   ├─ difficulty, type, category
    │   ├─ starterCode { vanilla, react }
    │   ├─ solution
    │   └─ testCases []
    │
    ├─> Question 2: Breadcrumb Navigator
    │   └─ [same structure]
    │
    └─> Question 3: Debounce Function
        └─ [same structure]

User Interaction Flow:
1. Select Question → updateSelectedQuestion()
2. Choose Language → updateCurrentLanguage()
3. Edit Code → Sandpack handles
4. Run Tests → runTests() → evaluate code → show results
5. View Solution → toggleShowSolution()
```

## Test Execution Flow

```
┌──────────────────────────┐
│  User clicks "Run Tests" │
└────────────┬─────────────┘
             ▼
┌──────────────────────────────────────┐
│  runTests() function                 │
│  • Check if output or preview type   │
│  • Get testCases from question       │
└────────────┬─────────────────────────┘
             ▼
┌──────────────────────────────────────┐
│  For each test case:                 │
│  1. Extract user's code              │
│  2. new Function(userCode)           │
│  3. Extract class/function           │
│  4. Inject into test code            │
│  5. Execute test                     │
│  6. Compare result vs expected       │
└────────────┬─────────────────────────┘
             ▼
┌──────────────────────────────────────┐
│  Display Results                     │
│  • ✅ Green = Passed                 │
│  • ❌ Red = Failed                   │
│  • ℹ️ Gray = Manual/Info             │
└──────────────────────────────────────┘
```

## Sandpack Integration

```
getSandpackFiles()
    │
    ├─ Vanilla JS:
    │  └─ { '/index.js': userCode }
    │
    └─ React:
       ├─ { '/App.js': userCode }
       ├─ { '/index.js': ReactDOM setup }
       └─ { '/styles.css': basic styles }

Sandpack Component Props:
• template: 'vanilla' | 'react'
• files: { path: code }
• theme: 'auto' (follows system)
• options:
  - showNavigator: false
  - showTabs: true (React only)
  - showLineNumbers: true
  - editorHeight: 500
```

## State Management

```javascript
Component State:
├─ selectedQuestion (object)
├─ currentLanguage ('vanilla' | 'react')
├─ userCode (string)
├─ testResults (array)
├─ showSolution (boolean)
└─ showTests (boolean)

Effects:
├─ useEffect(() => {}, [selectedQuestion])
│  → Reset language, code, results when question changes
│
└─ useEffect(() => {}, [currentLanguage])
   → Update code when language switches
```

## Styling Architecture

```
Tailwind Classes:
├─ Layout: max-w-7xl, px-4, py-8
├─ Grid: grid-cols-1 lg:grid-cols-2 gap-6
├─ Cards: bg-white dark:bg-gray-800 rounded-xl shadow-lg
├─ Buttons: px-6 py-3 rounded-lg font-semibold
└─ Animations: motion.div with framer-motion

Color System:
├─ Primary: purple-600 → blue-600 (gradient)
├─ Success: green-600, green-50 bg
├─ Error: red-600, red-50 bg
├─ Difficulty:
│  ├─ Easy: green-600
│  ├─ Medium: yellow-600
│  └─ Hard: red-600
```

## File Organization

```
/website/
  ├─ src/
  │   ├─ pages/
  │   │   └─ MachineCodingPractice.jsx ← Main component
  │   ├─ App.jsx ← Route definition
  │   └─ components/
  │       └─ Layout.jsx ← Nav link
  ├─ package.json ← Dependencies
  └─ [build files]

/project-root/
  ├─ MACHINE_CODING_PRACTICE.md ← Documentation
  ├─ PRACTICE_IMPLEMENTATION_SUMMARY.md ← Summary
  └─ PRACTICE_ARCHITECTURE.md ← This file
```

## Dependencies Tree

```
MachineCodingPractice.jsx
  ├─ react (useState, useEffect)
  ├─ framer-motion (motion, AnimatePresence)
  ├─ @codesandbox/sandpack-react (Sandpack)
  └─ lucide-react (icons)
       ├─ Code2
       ├─ Play
       ├─ CheckCircle
       ├─ XCircle
       ├─ Terminal
       ├─ Info
       ├─ ChevronDown
       └─ ChevronUp
```

## API Surface

```javascript
// No external API calls
// All data is local constants

// Public Interface:
Component: MachineCodingPractice
Props: None (standalone page)
Exports: default MachineCodingPractice

// Internal Functions:
- runTests()
- getSandpackFiles()
- getDifficultyColor()

// Internal State:
- selectedQuestion
- currentLanguage
- userCode
- testResults
- showSolution
- showTests
```

## Performance Considerations

```
Bundle Size:
├─ Sandpack: ~2.5MB (includes CodeMirror, React, etc.)
├─ Page Component: ~25KB
└─ Total Impact: ~2.5MB additional

Optimizations Possible:
├─ Lazy load Sandpack when route accessed
├─ Code split by question
├─ Cache Sandpack bundle
└─ Use dynamic import for heavy components
```

## Security Model

```
Code Execution:
├─ User Code: Runs in Sandpack iframe (sandboxed)
├─ Test Cases: Runs in Function context (isolated)
├─ No server execution
├─ No eval() usage (uses new Function())
└─ No persistent storage of user code

Sandpack Security:
├─ Runs in sandboxed iframe
├─ No access to parent window
├─ No network requests from user code
└─ No localStorage access from iframe
```

---

## Extension Points

To extend this feature:

1. **Add Questions:** Append to `PRACTICE_QUESTIONS` array
2. **New Languages:** Add to language selector and starterCode
3. **Custom Templates:** Extend Sandpack template options
4. **Storage:** Add localStorage/API integration
5. **Analytics:** Track completion, time, attempts
6. **Social:** Share solutions, leaderboards
7. **AI Help:** Integrate hints/explanations
8. **Video:** Embed solution walkthroughs
