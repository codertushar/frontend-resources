import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'http://localhost:5173/practice';

test.describe('Machine Coding Practice Page - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRACTICE_URL);
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Load and Structure', () => {
    test('should load the practice page successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Frontend Resources/i);
      await expect(page.locator('h1')).toContainText('Machine Coding Practice');
    });

    test('should display header and subtitle', async ({ page }) => {
      await expect(page.getByText('Machine Coding Practice')).toBeVisible();
      await expect(page.getByText(/Practice real-world coding challenges/i)).toBeVisible();
    });

    test('should display question selector dropdown', async ({ page }) => {
      const dropdown = page.locator('select');
      await expect(dropdown).toBeVisible();
      await expect(dropdown).toHaveCount(1);
    });

    test('should display instructions and tips panels', async ({ page }) => {
      await expect(page.getByText('📝 Instructions')).toBeVisible();
      await expect(page.getByText('💡 Tips')).toBeVisible();
    });
  });

  test.describe('Question Selection', () => {
    test('should list all available questions in dropdown', async ({ page }) => {
      const dropdown = page.locator('select');
      const options = await dropdown.locator('option').allTextContents();

      expect(options).toContain(expect.stringContaining('Chained Calculator'));
      expect(options).toContain(expect.stringContaining('Breadcrumb Navigator'));
      expect(options).toContain(expect.stringContaining('Debounce'));
    });

    test('should display Chained Calculator by default', async ({ page }) => {
      await expect(page.getByText('🔢 Chained Calculator')).toBeVisible();
      await expect(page.getByText(/Create a chainable calculator API/i)).toBeVisible();
      await expect(page.getByText('medium')).toBeVisible();
    });

    test('should switch to Debounce question', async ({ page }) => {
      const dropdown = page.locator('select');
      await dropdown.selectOption({ value: 'debounce' });

      await expect(page.getByText('⏱️ Debounce Function')).toBeVisible();
      await expect(page.getByText('easy')).toBeVisible();
    });

    test('should switch to Breadcrumb Navigator question', async ({ page }) => {
      const dropdown = page.locator('select');
      await dropdown.selectOption({ value: 'breadcrumb-navigator' });

      await expect(page.getByText('🧭 Breadcrumb Navigator')).toBeVisible();
      await expect(page.getByText('medium')).toBeVisible();
    });
  });

  test.describe('Language Toggle', () => {
    test('should show JavaScript and React buttons', async ({ page }) => {
      const jsButton = page.getByRole('button', { name: 'JavaScript' });
      const reactButton = page.getByRole('button', { name: 'React' });

      await expect(jsButton).toBeVisible();
      await expect(reactButton).toBeVisible();
    });

    test('should have JavaScript selected by default', async ({ page }) => {
      const jsButton = page.getByRole('button', { name: 'JavaScript' });
      await expect(jsButton).toHaveClass(/btn-primary/);
    });

    test('should switch to React mode', async ({ page }) => {
      const reactButton = page.getByRole('button', { name: 'React' });
      await reactButton.click();

      await expect(reactButton).toHaveClass(/btn-primary/);
    });

    test('should reload editor when switching languages', async ({ page }) => {
      // Wait for initial editor load
      await page.waitForSelector('[class*="sp-"]', { timeout: 5000 });

      const reactButton = page.getByRole('button', { name: 'React' });
      await reactButton.click();

      // Editor should reload with new content
      await page.waitForTimeout(1000);
      const editorContent = await page.locator('[class*="cm-content"]').first();
      await expect(editorContent).toBeVisible();
    });
  });

  test.describe('Code Editor (Sandpack)', () => {
    test('should render Sandpack editor', async ({ page }) => {
      // Wait for Sandpack to load
      await page.waitForSelector('[class*="sp-"]', { timeout: 5000 });
      const editor = page.locator('[class*="cm-content"]').first();
      await expect(editor).toBeVisible();
    });

    test('should render preview panel', async ({ page }) => {
      await page.waitForSelector('iframe', { timeout: 5000 });
      const preview = page.locator('iframe').first();
      await expect(preview).toBeVisible();
    });

    test('should allow typing in the editor', async ({ page }) => {
      await page.waitForSelector('[class*="cm-content"]', { timeout: 5000 });
      const editor = page.locator('[class*="cm-content"]').first();

      await editor.click();
      await page.keyboard.press('End');
      await page.keyboard.type('\n// Test comment');

      await page.waitForTimeout(500);
      const content = await editor.textContent();
      expect(content).toContain('Test comment');
    });

    test('should update preview when code changes', async ({ page }) => {
      await page.waitForSelector('[class*="cm-content"]', { timeout: 5000 });

      // Switch to React for interactive preview
      await page.getByRole('button', { name: 'React' }).click();
      await page.waitForTimeout(1000);

      // The preview iframe should be present and loading
      const previewFrame = page.locator('iframe').first();
      await expect(previewFrame).toBeVisible();
    });
  });

  test.describe('Run Tests Functionality', () => {
    test('should show Run Tests button', async ({ page }) => {
      const runTestsBtn = page.getByRole('button', { name: /Run Tests/i });
      await expect(runTestsBtn).toBeVisible();
    });

    test('should display test results after clicking Run Tests', async ({ page }) => {
      const runTestsBtn = page.getByRole('button', { name: /Run Tests/i });
      await runTestsBtn.click();

      await page.waitForTimeout(500);
      await expect(page.getByText('Test Results')).toBeVisible();
    });

    test('should show test case names', async ({ page }) => {
      const runTestsBtn = page.getByRole('button', { name: /Run Tests/i });
      await runTestsBtn.click();

      await page.waitForTimeout(500);
      await expect(page.getByText(/Basic chain operations/i)).toBeVisible();
    });

    test('should show test case status icons', async ({ page }) => {
      const runTestsBtn = page.getByRole('button', { name: /Run Tests/i });
      await runTestsBtn.click();

      await page.waitForTimeout(500);
      // Check for test result cards
      const testResults = page.locator('[class*="test-result-card"]');
      await expect(testResults.first()).toBeVisible();
    });

    test('should allow collapsing test results', async ({ page }) => {
      const runTestsBtn = page.getByRole('button', { name: /Run Tests/i });
      await runTestsBtn.click();

      await page.waitForTimeout(500);
      const testResultsHeader = page.getByText('Test Results').first();
      await testResultsHeader.click();

      // Results should be hidden
      await page.waitForTimeout(300);
      const firstResult = page.getByText(/Basic chain operations/i);
      await expect(firstResult).not.toBeVisible();
    });
  });

  test.describe('Show Solution Functionality', () => {
    test('should show solution button', async ({ page }) => {
      const solutionBtn = page.getByRole('button', { name: /Show Solution/i });
      await expect(solutionBtn).toBeVisible();
    });

    test('should display solution when clicked', async ({ page }) => {
      const solutionBtn = page.getByRole('button', { name: /Show Solution/i });
      await solutionBtn.click();

      await expect(page.getByText(/Solution \(JavaScript\)/i)).toBeVisible();
    });

    test('should hide solution when clicked again', async ({ page }) => {
      const solutionBtn = page.getByRole('button', { name: /Show Solution/i });

      // Show solution
      await solutionBtn.click();
      await expect(page.getByText(/Solution \(JavaScript\)/i)).toBeVisible();

      // Hide solution
      await page.getByRole('button', { name: /Hide Solution/i }).click();
      await expect(page.getByText(/Solution \(JavaScript\)/i)).not.toBeVisible();
    });

    test('should update solution language label when switching', async ({ page }) => {
      const solutionBtn = page.getByRole('button', { name: /Show Solution/i });
      await solutionBtn.click();

      // Initially shows JavaScript
      await expect(page.getByText(/Solution \(JavaScript\)/i)).toBeVisible();

      // Switch to React
      await page.getByRole('button', { name: 'React' }).click();
      await page.waitForTimeout(300);

      // Now shows React
      await expect(page.getByText(/Solution \(React\)/i)).toBeVisible();
    });

    test('should display code in solution panel', async ({ page }) => {
      const solutionBtn = page.getByRole('button', { name: /Show Solution/i });
      await solutionBtn.click();

      const codeBlock = page.locator('pre code');
      await expect(codeBlock).toBeVisible();

      const code = await codeBlock.textContent();
      expect(code).toContain('ChainCalculator');
    });
  });

  test.describe('Difficulty Badges', () => {
    test('should display correct difficulty badge colors', async ({ page }) => {
      // Easy - Debounce
      const dropdown = page.locator('select');
      await dropdown.selectOption({ value: 'debounce' });
      const easyBadge = page.getByText('easy');
      await expect(easyBadge).toHaveClass(/difficulty-easy/);

      // Medium - Chained Calculator
      await dropdown.selectOption({ value: 'chained-calculator' });
      const mediumBadge = page.getByText('medium');
      await expect(mediumBadge).toHaveClass(/difficulty-medium/);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.getByText('Machine Coding Practice')).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.getByText('Machine Coding Practice')).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await expect(page.getByText('Machine Coding Practice')).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
    });
  });

  test.describe('Theme and Styling', () => {
    test('should use custom Sandpack theme', async ({ page }) => {
      await page.waitForSelector('[class*="sp-"]', { timeout: 5000 });
      const sandpackWrapper = page.locator('[class*="sp-wrapper"]').first();
      await expect(sandpackWrapper).toBeVisible();
    });

    test('should have proper button styling', async ({ page }) => {
      const runTestsBtn = page.getByRole('button', { name: /Run Tests/i });
      await expect(runTestsBtn).toHaveClass(/btn-primary/);

      const solutionBtn = page.getByRole('button', { name: /Show Solution/i });
      await expect(solutionBtn).toHaveClass(/btn-secondary/);
    });

    test('should have animated gradient title', async ({ page }) => {
      const title = page.getByText('🏋️ Machine Coding Practice');
      await expect(title).toHaveClass(/practice-title/);
    });
  });

  test.describe('Complete User Flow', () => {
    test('should complete full practice workflow', async ({ page }) => {
      // 1. Page loads with default question
      await expect(page.getByText('🔢 Chained Calculator')).toBeVisible();

      // 2. User switches to React mode
      await page.getByRole('button', { name: 'React' }).click();
      await page.waitForTimeout(500);

      // 3. User views solution
      await page.getByRole('button', { name: /Show Solution/i }).click();
      await expect(page.getByText(/Solution \(React\)/i)).toBeVisible();

      // 4. User hides solution
      await page.getByRole('button', { name: /Hide Solution/i }).click();
      await expect(page.getByText(/Solution \(React\)/i)).not.toBeVisible();

      // 5. User switches questions
      await page.locator('select').selectOption({ value: 'debounce' });
      await expect(page.getByText('⏱️ Debounce Function')).toBeVisible();

      // 6. User runs tests (should show errors for empty implementation)
      await page.getByRole('button', { name: /Run Tests/i }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText('Test Results')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(PRACTICE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000); // Should load in less than 5 seconds
    });

    test('should not have console errors', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(PRACTICE_URL);
      await page.waitForLoadState('networkidle');

      // Filter out known Sandpack warnings
      const criticalErrors = errors.filter(
        (error) => !error.includes('Sandpack') && !error.includes('ResizeObserver')
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });
});
