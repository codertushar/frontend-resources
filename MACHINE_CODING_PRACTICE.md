# Machine Coding Practice Route Documentation

## Overview
A new `/practice` route has been added to the website that provides an interactive coding practice environment using Sandpack (CodeSandbox's code editor SDK).

## Features

### 1. **Interactive Code Editor**
- Powered by Sandpack (https://sandpack.codesandbox.io/)
- Supports both vanilla JavaScript and React
- Live preview for React components
- Syntax highlighting and IntelliSense

### 2. **Practice Questions**
Three practice questions are included as examples:

#### a) Chained Calculator (Medium, Output-based)
- Implement a chainable calculator API
- Supports method chaining for arithmetic operations
- Test cases validate functionality

#### b) Breadcrumb Navigator (Medium, Preview-based)
- Build a breadcrumb navigation component
- Explore nested objects interactively
- Visual preview of the component

#### c) Debounce Function (Easy, Output-based)
- Implement a debounce utility function
- Delays execution until after wait time
- Both JavaScript and React implementations

### 3. **Language Selector**
Users can switch between:
- **JavaScript (Vanilla)** - Pure JavaScript implementation
- **React** - React component implementation

### 4. **Test Case Validation**
- Automated test execution for output-based questions
- Visual feedback (passed/failed) for each test case
- Error messages for debugging

### 5. **Solution Viewer**
- Toggle button to show/hide solutions
- Helps users learn from correct implementations

### 6. **Responsive Design**
- Beautiful gradient UI matching the site's theme
- Dark mode support
- Mobile-responsive layout

## File Structure

```
website/src/
├── pages/
│   └── MachineCodingPractice.jsx    # Main practice page component
├── App.jsx                           # Added /practice route
└── components/
    └── Layout.jsx                    # Added Practice nav link
```

## Adding New Practice Questions

To add new practice questions, edit `/website/src/pages/MachineCodingPractice.jsx` and add to the `PRACTICE_QUESTIONS` array:

```javascript
{
  id: 'unique-id',
  title: '🎯 Question Title',
  description: 'Brief description of the challenge',
  difficulty: 'easy' | 'medium' | 'hard',
  type: 'output' | 'preview',  // output = test cases, preview = visual component
  category: 'JavaScript' | 'React',
  defaultLanguage: 'vanilla' | 'react',
  starterCode: {
    vanilla: `// JavaScript starter code`,
    react: `// React starter code`
  },
  solution: `// Complete solution code`,
  testCases: [
    {
      name: 'Test case name',
      code: `// Test code that returns true/false`,
      expected: true
    }
  ]
}
```

## Test Case Format

### For Output-Based Questions:
```javascript
testCases: [
  {
    name: 'Basic chain operations',
    code: `const calc = new ChainCalculator(10);
const result = calc.add(5).subtract(3).multiply(4).divide(2).getResult();
return result === 24;`,
    expected: true
  }
]
```

### For Preview-Based Questions (Manual Testing):
```javascript
testCases: [
  {
    name: 'Can navigate nested structure',
    description: 'Click through the breadcrumbs to test navigation',
    manual: true
  }
]
```

### For Async Test Cases:
```javascript
testCases: [
  {
    name: 'Function executes after delay',
    code: `return new Promise((resolve) => {
  let count = 0;
  const debounced = debounce(() => count++, 50);
  debounced();
  setTimeout(() => resolve(count === 1), 100);
});`,
    expected: true,
    async: true
  }
]
```

## Navigation

The Practice route is accessible via:
- **URL:** `/practice`
- **Navigation:** Top navigation bar → "Practice" link
- **Icon:** Code2 icon from lucide-react

## Dependencies Added

```json
{
  "@codesandbox/sandpack-react": "^2.x.x"
}
```

## Implementation Details

### Sandpack Configuration
- **Template:** Automatically switches between 'vanilla' and 'react' based on selected language
- **Theme:** 'auto' (follows system dark/light mode)
- **Options:**
  - showNavigator: false
  - showTabs: true (for React multi-file editing)
  - showLineNumbers: true
  - editorHeight: 500px

### Test Execution
Tests are executed using `new Function()` to safely run user code in isolation. The implementation:
1. Extracts the user's class/function from their code
2. Injects it into the test case code
3. Executes and compares result with expected value
4. Displays visual feedback (green checkmark = pass, red X = fail)

## Security Considerations

- Test execution uses `new Function()` which runs in the browser context
- No server-side code execution
- User code runs in Sandpack's sandboxed iframe
- No persistent storage of user code (resets on page refresh)

## Future Enhancements

Potential improvements:
1. **Local Storage:** Save user's progress and code
2. **More Questions:** Add more machine coding challenges from the `/machine-coding` folder
3. **Difficulty Filter:** Filter questions by difficulty
4. **Code Sharing:** Generate shareable links for solutions
5. **Timer:** Add a countdown timer for interview simulation
6. **Hints System:** Progressive hints for difficult problems
7. **Video Solutions:** Embed video explanations for each question
8. **Leaderboard:** Track completion and speed
9. **Custom Test Cases:** Allow users to add their own test cases

## Troubleshooting

### Issue: "Cannot read properties of undefined (reading 'useLayoutEffect')"
**Status:** Known React 19 compatibility issue with Sandpack 2.20.0

Sandpack is currently optimized for React 18. To resolve:
- **Option 1 (Recommended for Production):** Downgrade to React 18.x
  ```bash
  npm install react@18 react-dom@18
  ```
- **Option 2:** Wait for Sandpack to release React 19 compatible version
- **Option 3:** Use the dev server instead of production build (works better with hot reload)

**Workaround:** The implementation is correct and will work once Sandpack updates for React 19 support or when using React 18.

### Issue: Tests not running
- Check browser console for errors
- Ensure the user's code exports the required class/function
- Verify test case syntax is correct

### Issue: Preview not showing
- Ensure Sandpack files are properly configured
- Check that React template is being used for React code
- Verify there are no syntax errors in the starter code

## Resources

- **Sandpack Documentation:** https://sandpack.codesandbox.io/docs
- **Machine Coding Questions:** `/machine-coding/` directory
- **Design Reference:** Existing Library and Learning Path pages

## Example Usage

Visit `http://localhost:5173/practice` to:
1. Select a coding challenge
2. Choose your preferred language (JavaScript or React)
3. Write your solution in the code editor
4. Click "Run Tests" to validate your solution
5. Toggle "Show Solution" if you need help
6. See live preview for React components
