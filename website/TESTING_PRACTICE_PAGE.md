# Testing the Machine Coding Practice Page

This document provides automated and manual testing procedures for the Machine Coding Practice page at `/practice`.

## 🚀 Quick Start - Run Tests Automatically

### Option 1: E2E Tests with Playwright (Recommended)

**Setup:**
```bash
cd website
npm install -D @playwright/test
npx playwright install
```

**Run Tests:**
```bash
# Run all E2E tests
npx playwright test e2e/practice.spec.js

# Run with UI
npx playwright test e2e/practice.spec.js --ui

# Run specific test
npx playwright test e2e/practice.spec.js -g "should load the practice page"

# Debug mode
npx playwright test e2e/practice.spec.js --debug

# Generate HTML report
npx playwright test e2e/practice.spec.js --reporter=html
```

**Before running tests, make sure:**
1. The dev server is running: `npm run dev`
2. The server is accessible at `http://localhost:5173`

---

### Option 2: Unit Tests with Vitest

**Setup:**
```bash
cd website
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Add to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

**Run Tests:**
```bash
npm test                    # Run all tests in watch mode
npm test -- --run          # Run once
npm test:ui                # Run with UI
npm test:coverage          # Run with coverage report
```

---

## 📋 Manual Testing Checklist

Use this checklist to manually verify all features work correctly at `http://localhost:5173/practice`:

### ✅ Page Load & Structure
- [ ] Page loads successfully without errors
- [ ] Title "🏋️ Machine Coding Practice" is visible
- [ ] Subtitle "Practice real-world coding challenges..." is visible
- [ ] Question selector dropdown is visible
- [ ] Instructions panel (📝) is visible
- [ ] Tips panel (💡) is visible
- [ ] No console errors in browser DevTools

### ✅ Question Selection
- [ ] Dropdown shows 3 questions: Chained Calculator, Breadcrumb Navigator, Debounce
- [ ] Default question is "Chained Calculator" (medium difficulty)
- [ ] Clicking dropdown shows all options
- [ ] Selecting "Debounce" loads that question (easy difficulty)
- [ ] Selecting "Breadcrumb Navigator" loads that question (medium difficulty)
- [ ] Question title, description, and difficulty badge update correctly

### ✅ Language Toggle (JavaScript ↔ React)
- [ ] Two buttons visible: "JavaScript" and "React"
- [ ] "JavaScript" button is highlighted (btn-primary) by default
- [ ] Clicking "React" button:
  - [ ] React button becomes highlighted
  - [ ] JavaScript button becomes unhighlighted
  - [ ] Editor reloads with React code
  - [ ] Preview panel shows React app
- [ ] Clicking "JavaScript" button switches back

### ✅ Sandpack Code Editor
- [ ] Code editor is visible and renders properly
- [ ] Preview panel is visible on the right
- [ ] Starter code loads correctly (no empty editor)
- [ ] **Can type in the editor** (click and type some code)
- [ ] Line numbers are visible
- [ ] Syntax highlighting works (keywords in purple, strings in green, etc.)
- [ ] Code matches the theme (dark background)
- [ ] Scrollbar appears for long code

### ✅ Code Changes Persistence
- [ ] Type some code in the editor
- [ ] Click "Run Tests"
- [ ] **Your code changes are NOT reverted** ✅
- [ ] Code remains in the editor after running tests
- [ ] Switch to React and back - code updates correctly

### ✅ Run Tests Button
- [ ] "Run Tests" button is visible with play icon
- [ ] Button has primary styling (gradient, purple)
- [ ] Clicking button:
  - [ ] Test Results panel appears
  - [ ] Shows "Test Results" header with collapse icon
  - [ ] Shows test case names (e.g., "Basic chain operations")
  - [ ] Shows pass/fail icons (checkmark or X)
  - [ ] Shows pass/fail messages
  - [ ] Test result cards have correct colors (green=pass, red=fail)

### ✅ Test Results Panel
- [ ] Panel appears after running tests
- [ ] Shows 4 test cases for Chained Calculator
- [ ] Can click header to collapse/expand results
- [ ] Chevron icon rotates when collapsing
- [ ] Each test card shows:
  - [ ] Test name
  - [ ] Pass/fail icon
  - [ ] Pass/fail message
- [ ] Smooth animations when expanding/collapsing

### ✅ Show Solution Button
- [ ] "Show Solution" button is visible
- [ ] Button has secondary styling (glass effect)
- [ ] Clicking button:
  - [ ] Solution panel appears with animation
  - [ ] Shows "Solution (JavaScript)" or "Solution (React)"
  - [ ] Shows code in a `<pre><code>` block
  - [ ] Code is properly formatted
  - [ ] Button text changes to "Hide Solution"
- [ ] Clicking "Hide Solution" hides the panel
- [ ] **Solution updates when switching languages:**
  - [ ] In JavaScript mode: shows vanilla solution
  - [ ] In React mode: shows React solution with JSX

### ✅ Difficulty Badges
- [ ] Easy questions show green "easy" badge
- [ ] Medium questions show orange/yellow "medium" badge
- [ ] Hard questions show red "hard" badge (if any)
- [ ] Badges have proper styling (rounded, colored background)

### ✅ Category & Type Badges
- [ ] "JavaScript" category badge visible
- [ ] "Output-based" or "Interactive Preview" type badge visible
- [ ] Icons render correctly (Code2, Terminal icons)

### ✅ Theme Integration
- [ ] Page uses site theme colors (purple/pink gradients)
- [ ] Title has animated gradient effect
- [ ] Buttons use `.btn-primary` and `.btn-secondary` classes
- [ ] Cards have glass morphism effect
- [ ] Question cards have hover effects
- [ ] Test result cards have colored backgrounds
- [ ] Dark mode colors work correctly
- [ ] Light mode colors work correctly (if implemented)

### ✅ Responsive Design
- [ ] **Desktop (1920x1080):**
  - [ ] 2-column layout (editor | results)
  - [ ] All elements visible
  - [ ] Proper spacing
- [ ] **Tablet (768x1024):**
  - [ ] Layout adjusts properly
  - [ ] Text readable
  - [ ] Buttons accessible
- [ ] **Mobile (375x667):**
  - [ ] Single column layout
  - [ ] Editor still functional
  - [ ] All content accessible
  - [ ] Buttons stack vertically

### ✅ Each Question Test
Run through this for ALL 3 questions:

**1. Chained Calculator (Medium)**
- [ ] Loads correctly in JavaScript mode
- [ ] Loads correctly in React mode
- [ ] Starter code has TODO comments
- [ ] Run Tests shows 4 test cases
- [ ] Solution available in both languages
- [ ] Tests fail for empty implementation

**2. Breadcrumb Navigator (Medium)**
- [ ] Loads correctly
- [ ] Shows React-only (no vanilla option?)
- [ ] Starter code has TODO comments
- [ ] Manual testing instructions visible
- [ ] Solution available

**3. Debounce Function (Easy)**
- [ ] Loads correctly in JavaScript mode
- [ ] Loads correctly in React mode
- [ ] Starter code has TODO comments
- [ ] Run Tests shows test cases
- [ ] Solution available in both languages

### ✅ Performance
- [ ] Page loads in < 5 seconds
- [ ] Editor renders in < 2 seconds
- [ ] No lag when typing in editor
- [ ] Language switching is smooth
- [ ] Question switching is smooth
- [ ] No memory leaks (check DevTools Memory tab)

### ✅ Error Handling
- [ ] If editor fails to load, shows error message (test by blocking Sandpack CDN)
- [ ] If tests fail, shows error message clearly
- [ ] If solution fails to load, shows error message
- [ ] No uncaught errors in console

---

## 🧪 Test Scenarios

### Scenario 1: Complete User Workflow
1. Visit `/practice`
2. Read the Chained Calculator description
3. Switch to React mode
4. Type some code in the editor
5. Click "Run Tests" → See failures
6. Click "Show Solution"
7. Compare your code with solution
8. Hide solution
9. Fix your code
10. Run tests again
11. Switch to Debounce question
12. Repeat workflow

**Expected:** Smooth experience, code persists, tests work correctly

### Scenario 2: Language Switching
1. Load Chained Calculator
2. Type code in JavaScript mode
3. Switch to React → Editor reloads with React template
4. Type code in React mode
5. Switch back to JavaScript
6. Click "Show Solution" in JavaScript
7. Switch to React
8. Solution updates to React version

**Expected:** Solution always matches selected language

### Scenario 3: Multiple Questions
1. Solve Chained Calculator
2. Switch to Debounce
3. Solve Debounce
4. Switch back to Chained Calculator

**Expected:** Each question maintains its own state

### Scenario 4: Test Result Validation
1. Load Chained Calculator
2. Don't write any code (empty methods)
3. Run Tests
4. All tests should fail with "Code Error: ..." messages

**Expected:** Tests execute and show failures

---

## 🐛 Known Issues to Check For

### Issue 1: Code Reverts on Run Tests
**Symptom:** User types code, clicks "Run Tests", code disappears
**Check:** Type in editor, run tests, verify code remains
**Status:** ✅ FIXED (CustomSandpackEditor syncs code)

### Issue 2: Wrong Solution Language
**Symptom:** Showing JavaScript solution when React is selected
**Check:** Switch to React, show solution, verify says "(React)"
**Status:** ✅ FIXED (Dynamic solution selection)

### Issue 3: Tests Look for Wrong Function
**Symptom:** "debounce is not defined" error for Calculator
**Check:** Run tests for Calculator, should look for ChainCalculator
**Status:** ✅ FIXED (Extraction map updated)

### Issue 4: Auto-Execution on Load
**Symptom:** Code runs immediately, shows errors before user writes anything
**Check:** Load question, should not show errors until "Run Tests" clicked
**Status:** ✅ FIXED (Commented out auto-execute code)

### Issue 5: Invalid Element Type in React
**Symptom:** "Element type is invalid..." error in React mode
**Check:** Switch to React mode, check preview panel for errors
**Status:** ✅ FIXED (File paths with leading slashes, proper { code } format)

---

## 📊 Test Coverage Report

Run this command to see which parts of the code are tested:

```bash
npm test -- --coverage
```

**Expected Coverage:**
- Statements: > 80%
- Branches: > 70%
- Functions: > 80%
- Lines: > 80%

---

## 🔍 Debugging Tips

### Editor Not Loading
```bash
# Check Sandpack is installed
npm list @codesandbox/sandpack-react

# Should show: @codesandbox/sandpack-react@2.20.0
```

### Tests Not Working
```bash
# Check console for errors
# Open DevTools → Console
# Look for "Code Error:" messages
```

### Preview Not Showing
```bash
# Check for iframe
# Open DevTools → Elements
# Search for <iframe>
# Should find Sandpack preview iframe
```

### Code Not Syncing
```bash
# Check CustomSandpackEditor is being used
# Open React DevTools → Components
# Find <CustomSandpackEditor>
# Should call onCodeChange when typing
```

---

## ✅ Automated Test Summary

Run all tests and verify:

```bash
# 1. Run Playwright E2E tests
npx playwright test e2e/practice.spec.js

# Expected: ✅ All tests pass (60+ tests)
```

**Test Categories:**
- Page Load: 4 tests
- Question Selection: 4 tests
- Language Toggle: 4 tests
- Code Editor: 4 tests
- Run Tests: 6 tests
- Show Solution: 6 tests
- Difficulty Badges: 1 test
- Responsive Design: 3 tests
- Theme: 3 tests
- Complete Workflow: 1 test
- Performance: 2 tests

**Total: 42 automated tests**

---

## 📈 Success Criteria

The practice page is considered **fully functional** when:

✅ All 42 automated E2E tests pass
✅ All manual checklist items are verified
✅ No console errors on page load
✅ Code changes persist when running tests
✅ Solutions switch correctly based on language
✅ All 3 questions load and function correctly
✅ Responsive design works on all screen sizes
✅ Page loads in < 5 seconds
✅ Tests execute correctly for all questions
✅ Theme integration matches the rest of the site

---

## 🎯 Quick Smoke Test (2 minutes)

If you only have 2 minutes, run this minimal test:

1. ✅ Visit http://localhost:5173/practice
2. ✅ Type something in the editor
3. ✅ Click "Run Tests" → Code should remain
4. ✅ Click "Show Solution" → Solution appears
5. ✅ Switch to React → Editor updates
6. ✅ Show solution → Says "(React)"
7. ✅ Switch question → New question loads
8. ✅ No console errors

If all 8 checks pass, the page is likely working correctly!

---

## 📞 Reporting Issues

If you find any issues:

1. Note which test failed (automated or manual)
2. Take a screenshot if visual issue
3. Copy any console errors
4. Note your environment (browser, OS, screen size)
5. Create GitHub issue with details

---

**Last Updated:** 2025-12-29
**Version:** 1.0
**Status:** Production Ready ✅
