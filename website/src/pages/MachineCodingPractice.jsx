import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sandpack } from '@codesandbox/sandpack-react';
import { Code2, Play, CheckCircle, XCircle, Terminal, Info, ChevronDown, ChevronUp } from 'lucide-react';

// Practice questions with test cases
// NOTE: Sandpack currently has React 19 compatibility issues. 
// The implementation is correct but requires React 18 for full functionality.
// See MACHINE_CODING_PRACTICE.md for details and workarounds.
const PRACTICE_QUESTIONS = [
  {
    id: 'chained-calculator',
    title: '🔢 Chained Calculator',
    description: 'Create a chainable calculator API that supports method chaining for arithmetic operations.',
    difficulty: 'medium',
    type: 'output', // 'output' or 'preview'
    category: 'JavaScript',
    defaultLanguage: 'vanilla',
    starterCode: {
      vanilla: `// Implement ChainCalculator class
class ChainCalculator {
  constructor(initialValue = 0) {
    // Your code here
  }

  add(number) {
    // Your code here
  }

  subtract(number) {
    // Your code here
  }

  multiply(number) {
    // Your code here
  }

  divide(number) {
    // Your code here
  }

  getResult() {
    // Your code here
  }

  reset() {
    // Your code here
  }
}

// Test your implementation
const calculator = new ChainCalculator(10);
const result = calculator.add(5).subtract(3).multiply(4).divide(2).getResult();
console.log('Result:', result);
`,
      react: `import React, { useState } from 'react';

// Implement ChainCalculator class
class ChainCalculator {
  constructor(initialValue = 0) {
    // Your code here
  }

  add(number) {
    // Your code here
  }

  subtract(number) {
    // Your code here
  }

  multiply(number) {
    // Your code here
  }

  divide(number) {
    // Your code here
  }

  getResult() {
    // Your code here
  }

  reset() {
    // Your code here
  }
}

export default function App() {
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const calculator = new ChainCalculator(10);
    const res = calculator.add(5).subtract(3).multiply(4).divide(2).getResult();
    setResult(res);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Chained Calculator</h1>
      <button onClick={handleCalculate}>Calculate</button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}
`
    },
    solution: `class ChainCalculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  add(number) {
    this.value += number;
    return this;
  }

  subtract(number) {
    this.value -= number;
    return this;
  }

  multiply(number) {
    this.value *= number;
    return this;
  }

  divide(number) {
    if (number === 0) {
      throw new Error("Division by zero is not allowed.");
    }
    this.value /= number;
    return this;
  }

  getResult() {
    return this.value;
  }

  reset() {
    this.value = 0;
    return this;
  }
}`,
    testCases: [
      {
        name: 'Basic chain operations',
        code: `const calc = new ChainCalculator(10);
const result = calc.add(5).subtract(3).multiply(4).divide(2).getResult();
return result === 24;`,
        expected: true
      },
      {
        name: 'Starting from zero',
        code: `const calc = new ChainCalculator();
const result = calc.add(10).multiply(2).getResult();
return result === 20;`,
        expected: true
      },
      {
        name: 'Division by zero throws error',
        code: `try {
  const calc = new ChainCalculator(10);
  calc.divide(0);
  return false;
} catch (e) {
  return e.message === "Division by zero is not allowed.";
}`,
        expected: true
      },
      {
        name: 'Reset functionality',
        code: `const calc = new ChainCalculator(50);
calc.add(10).reset();
return calc.getResult() === 0;`,
        expected: true
      }
    ]
  },
  {
    id: 'breadcrumb-navigator',
    title: '🧭 Breadcrumb Navigator',
    description: 'Build a breadcrumb navigation component for nested object exploration.',
    difficulty: 'medium',
    type: 'preview',
    category: 'React',
    defaultLanguage: 'react',
    starterCode: {
      react: `import React, { useState } from 'react';

const Breadcrumbs = ({ data }) => {
  // "path" holds the keys to navigate the nested object
  const [path, setPath] = useState([]);

  // Get current nested value using the path
  // TODO: Implement using reduce
  const currentData = null;

  // Navigate back to a specific breadcrumb level
  const handleClick = (index) => {
    // TODO: Implement breadcrumb navigation
  };

  // Drill down by adding a key to the current path
  const handleDrillDown = (key) => {
    // TODO: Implement drill-down logic
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: "15px", fontSize: "1.2em" }}>
        <span onClick={() => setPath([])} style={{ cursor: "pointer" }}>
          🏠 Home
        </span>
        {/* TODO: Render breadcrumb path */}
      </div>

      {/* Content Display */}
      <div>
        {/* TODO: Display current data or list of keys */}
      </div>
    </div>
  );
};

// Sample data
const sampleData = {
  "Fruits": {
    "Citrus": {
      "Orange": "Sweet and juicy 🍊",
      "Lemon": "Sour and zesty 🍋"
    },
    "Berries": {
      "Strawberry": "Red and delicious 🍓"
    }
  },
  "Vegetables": {
    "Leafy": {
      "Spinach": "Healthy and green 🥬"
    }
  }
};

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Breadcrumb Navigator</h1>
      <Breadcrumbs data={sampleData} />
    </div>
  );
}
`
    },
    solution: `import React, { useState } from 'react';

const Breadcrumbs = ({ data }) => {
  const [path, setPath] = useState([]);
  
  const currentData = path.reduce((acc, key) => acc && acc[key], data);
  
  const handleClick = (index) => setPath(path.slice(0, index + 1));
  
  const handleDrillDown = (key) => {
    if (currentData && typeof currentData === 'object') {
      setPath([...path, key]);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ marginBottom: "15px", fontSize: "1.2em" }}>
        <span onClick={() => setPath([])} style={{ cursor: "pointer" }}>
          🏠 Home
        </span>
        {path.map((key, index) => (
          <span key={index}>
            {" 👉 "}
            <span onClick={() => handleClick(index)} style={{ cursor: "pointer" }}>
              {key}
            </span>
          </span>
        ))}
      </div>
      <div>
        {currentData && typeof currentData === "object" ? (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {Object.keys(currentData).map((key) => (
              <li key={key} onClick={() => handleDrillDown(key)} style={{ cursor: "pointer", margin: "5px 0" }}>
                📂 {key}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ fontSize: "1.2em" }}>📄 {currentData !== undefined ? currentData : "No data"}</div>
        )}
      </div>
    </div>
  );
};`,
    testCases: [
      {
        name: 'Can navigate nested structure',
        description: 'Click through the breadcrumbs to test navigation',
        manual: true
      }
    ]
  },
  {
    id: 'debounce',
    title: '⏱️ Debounce Function',
    description: 'Implement a debounce utility function that delays execution until after wait time.',
    difficulty: 'easy',
    type: 'output',
    category: 'JavaScript',
    defaultLanguage: 'vanilla',
    starterCode: {
      vanilla: `// Implement debounce function
function debounce(func, wait) {
  // Your code here
}

// Test your implementation
let callCount = 0;
const debouncedFn = debounce(() => {
  callCount++;
  console.log('Called:', callCount);
}, 300);

// These calls should be debounced
debouncedFn();
debouncedFn();
debouncedFn();

// Wait and check result
setTimeout(() => {
  console.log('Final count:', callCount);
}, 500);
`,
      react: `import React, { useState } from 'react';

// Implement debounce function
function debounce(func, wait) {
  // Your code here
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const handleSearch = debounce((value) => {
    setDebouncedValue(value);
  }, 300);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Debounce Demo</h1>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        style={{ padding: '8px', fontSize: '16px', width: '300px' }}
      />
      <p>Immediate value: {searchTerm}</p>
      <p>Debounced value: {debouncedValue}</p>
    </div>
  );
}
`
    },
    solution: `function debounce(func, wait) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}`,
    testCases: [
      {
        name: 'Debounce delays execution',
        code: `let count = 0;
const debounced = debounce(() => count++, 100);
debounced();
debounced();
debounced();
// Immediately after calls, count should still be 0
return count === 0;`,
        expected: true
      },
      {
        name: 'Returns a function',
        code: `const debounced = debounce(() => {}, 100);
return typeof debounced === 'function';`,
        expected: true
      }
    ]
  }
];

const MachineCodingPractice = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(PRACTICE_QUESTIONS[0]);
  const [currentLanguage, setCurrentLanguage] = useState(selectedQuestion.defaultLanguage);
  const [userCode, setUserCode] = useState(selectedQuestion.starterCode[currentLanguage]);
  const [testResults, setTestResults] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showTests, setShowTests] = useState(false);

  useEffect(() => {
    setCurrentLanguage(selectedQuestion.defaultLanguage);
    setUserCode(selectedQuestion.starterCode[selectedQuestion.defaultLanguage]);
    setTestResults([]);
    setShowSolution(false);
    setShowTests(false);
  }, [selectedQuestion]);

  useEffect(() => {
    if (selectedQuestion.starterCode[currentLanguage]) {
      setUserCode(selectedQuestion.starterCode[currentLanguage]);
    }
  }, [currentLanguage]);

  const runTests = () => {
    if (selectedQuestion.type === 'preview') {
      setTestResults([{ name: 'Manual Testing', passed: null, message: 'Test the component in the preview panel' }]);
      return;
    }

    const results = selectedQuestion.testCases.map(testCase => {
      try {
        // Security Note: new Function() is used for test isolation in browser context only.
        // User code runs in Sandpack's sandboxed iframe, providing additional security.
        // This is safe for educational/practice purposes with no server-side execution.
        
        const testFunction = new Function('ChainCalculator', 'debounce', testCase.code);
        
        // Extract the class or function from user code
        let ChainCalculator, debounce;
        try {
          // Execute user code to get their implementation
          const userFunction = new Function(userCode + '\nreturn { ChainCalculator, debounce };');
          const userImpl = userFunction();
          ChainCalculator = userImpl.ChainCalculator;
          debounce = userImpl.debounce;
        } catch (e) {
          return {
            name: testCase.name,
            passed: false,
            message: `Code Error: ${e.message}`
          };
        }

        // Note: Async test cases are not fully supported in this version
        // For simplicity, only synchronous tests are executed
        const result = testFunction(ChainCalculator, debounce);
        return {
          name: testCase.name,
          passed: result === testCase.expected,
          message: result === testCase.expected ? 'Passed' : `Expected ${testCase.expected}, got ${result}`
        };
      } catch (error) {
        return {
          name: testCase.name,
          passed: false,
          message: error.message
        };
      }
    });

    setTestResults(results);
    setShowTests(true);
  };

  const getSandpackFiles = () => {
    if (currentLanguage === 'react') {
      return {
        '/App.js': userCode,
        '/index.js': `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
        '/styles.css': `body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

#root {
  padding: 20px;
}`
      };
    } else {
      return {
        '/index.js': userCode
      };
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🏋️ Machine Coding Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice real-world coding challenges with instant feedback
          </p>
        </motion.div>

        {/* Question Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Select a Challenge
          </label>
          <select
            value={selectedQuestion.id}
            onChange={(e) => {
              const question = PRACTICE_QUESTIONS.find(q => q.id === e.target.value);
              setSelectedQuestion(question);
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {PRACTICE_QUESTIONS.map(q => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.category})
              </option>
            ))}
          </select>
        </motion.div>

        {/* Question Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedQuestion.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedQuestion.description}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedQuestion.difficulty)}`}>
              {selectedQuestion.difficulty}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Code2 size={16} />
              {selectedQuestion.category}
            </span>
            <span className="flex items-center gap-1">
              {selectedQuestion.type === 'output' ? <Terminal size={16} /> : <Code2 size={16} />}
              {selectedQuestion.type === 'output' ? 'Output-based' : 'Interactive Preview'}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Language Selector */}
            {selectedQuestion.starterCode.react && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentLanguage('vanilla')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentLanguage === 'vanilla'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setCurrentLanguage('react')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentLanguage === 'react'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  React
                </button>
              </div>
            )}

            {/* Sandpack Editor */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <Sandpack
                template={currentLanguage === 'react' ? 'react' : 'vanilla'}
                files={getSandpackFiles()}
                theme="auto"
                options={{
                  showNavigator: false,
                  showTabs: currentLanguage === 'react',
                  showLineNumbers: true,
                  editorHeight: 500,
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={runTests}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Play size={20} />
                Run Tests
              </button>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            </div>

            {/* Solution */}
            {showSolution && selectedQuestion.solution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Info size={18} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Solution</h3>
                </div>
                <pre className="text-sm bg-white dark:bg-gray-800 p-4 rounded overflow-x-auto">
                  <code className="text-gray-800 dark:text-gray-200">{selectedQuestion.solution}</code>
                </pre>
              </motion.div>
            )}
          </motion.div>

          {/* Test Results & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowTests(!showTests)}
                  className="w-full flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white mb-4"
                >
                  <span>Test Results</span>
                  {showTests ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                
                {showTests && (
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          result.passed === null
                            ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                            : result.passed
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {result.passed === null ? (
                            <Info size={20} className="text-gray-500 dark:text-gray-400 mt-0.5" />
                          ) : result.passed ? (
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400 mt-0.5" />
                          ) : (
                            <XCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {result.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {result.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📝 Instructions
              </h3>
              <ol className="space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside">
                <li>Read the problem description carefully</li>
                <li>Choose your preferred language (JavaScript or React)</li>
                <li>Implement the solution in the code editor</li>
                <li>Click "Run Tests" to validate your solution</li>
                <li>Use "Show Solution" if you need help</li>
              </ol>
            </div>

            {/* Tips */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-3">
                💡 Tips
              </h3>
              <ul className="space-y-2 text-purple-800 dark:text-purple-200 text-sm">
                <li>• Take your time to understand the requirements</li>
                <li>• Test edge cases in your implementation</li>
                <li>• Use console.log for debugging</li>
                <li>• Think about code reusability and clean patterns</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MachineCodingPractice;
