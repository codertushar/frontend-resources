import type { PracticeQuestion } from '../types';

const debounce: PracticeQuestion = {
  id: 'debounce',
  title: '⏱️ Debounce Function',
  description: 'Implement a debounce utility function that delays execution until after wait time.',
  difficulty: 'easy',
  type: 'output',
  category: 'JavaScript',
  tags: ['utilities', 'closures', 'timing'],
  defaultLanguage: 'vanilla',
  starterCode: {
    // JavaScript only - pure utility function
    vanilla: `// Implement debounce function
function debounce(func, wait) {
  // TODO: Your implementation here
  // For now, return the function directly (not debounced)
  return func;
}

// Test your implementation
let callCount = 0;
const debouncedFn = debounce(() => {
  callCount++;
  console.log(\`Called: \${callCount}\`);
}, 300);

// These calls should be debounced
debouncedFn();
debouncedFn();
debouncedFn();

// Wait and check result
setTimeout(() => {
  console.log(\`Final count: \${callCount}\`);
}, 500);
`
  },
  solution: {
    // JavaScript only solution
    vanilla: `function debounce(func, wait) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}`
  },
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
};

export default debounce;
