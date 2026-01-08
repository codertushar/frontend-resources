import type { PracticeQuestion } from '../types';

const chainedCalculator: PracticeQuestion = {
  id: 'chained-calculator',
  title: '🔢 Chained Calculator',
  description: 'Create a chainable calculator API that supports method chaining for arithmetic operations.',
  difficulty: 'medium',
  type: 'output',
  category: 'JavaScript',
  tags: ['method-chaining', 'classes', 'oop'],
  defaultLanguage: 'vanilla',
  starterCode: {
    // JavaScript only - pure class implementation
    vanilla: `// Implement ChainCalculator class
class ChainCalculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  add(number) {
    // TODO: Add number to this.value
    // TODO: Return this for chaining
  }

  subtract(number) {
    // TODO: Subtract number from this.value
    // TODO: Return this for chaining
  }

  multiply(number) {
    // TODO: Multiply this.value by number
    // TODO: Return this for chaining
  }

  divide(number) {
    // TODO: Divide this.value by number
    // TODO: Throw error if number is 0
    // TODO: Return this for chaining
  }

  getResult() {
    return this.value;
  }

  reset() {
    this.value = 0;
    return this;
  }
}

// Test your implementation
const calculator = new ChainCalculator(10);
const result = calculator.add(5).subtract(3).multiply(4).divide(2).getResult();
console.log(\`Result: \${result}\`); // Should log: Result: 24
`
  },
  solution: {
    // JavaScript only solution
    vanilla: `class ChainCalculator {
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
}`
  },
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
};

export default chainedCalculator;
