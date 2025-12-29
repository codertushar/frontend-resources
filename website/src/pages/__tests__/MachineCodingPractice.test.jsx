import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MachineCodingPractice from '../MachineCodingPractice';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock Sandpack components
vi.mock('@codesandbox/sandpack-react', () => ({
  SandpackProvider: ({ children }) => <div data-testid="sandpack-provider">{children}</div>,
  SandpackLayout: ({ children }) => <div data-testid="sandpack-layout">{children}</div>,
  SandpackCodeEditor: () => <div data-testid="sandpack-editor">Code Editor</div>,
  SandpackPreview: () => <div data-testid="sandpack-preview">Preview</div>,
  useSandpack: () => ({
    sandpack: {
      files: {
        '/index.js': { code: 'test code' },
        '/App.js': { code: 'test react code' },
      },
      activeFile: '/index.js',
    },
  }),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MachineCodingPractice Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('should render the main page with title and subtitle', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText(/Machine Coding Practice/i)).toBeInTheDocument();
      expect(screen.getByText(/Practice real-world coding challenges/i)).toBeInTheDocument();
    });

    it('should render question selector dropdown', () => {
      renderWithRouter(<MachineCodingPractice />);

      const dropdown = screen.getByRole('combobox');
      expect(dropdown).toBeInTheDocument();
    });

    it('should render all three questions in dropdown', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText(/Chained Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Breadcrumb Navigator/i)).toBeInTheDocument();
      expect(screen.getByText(/Debounce Function/i)).toBeInTheDocument();
    });

    it('should render instructions panel', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('📝 Instructions')).toBeInTheDocument();
      expect(screen.getByText(/Read the problem description carefully/i)).toBeInTheDocument();
    });

    it('should render tips panel', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('💡 Tips')).toBeInTheDocument();
      expect(screen.getByText(/Take your time to understand/i)).toBeInTheDocument();
    });
  });

  describe('Question Selection', () => {
    it('should display Chained Calculator as default question', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('🔢 Chained Calculator')).toBeInTheDocument();
      expect(screen.getByText(/Create a chainable calculator API/i)).toBeInTheDocument();
    });

    it('should display difficulty badge for current question', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('medium')).toBeInTheDocument();
    });

    it('should show category and type badges', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Output-based')).toBeInTheDocument();
    });

    it('should switch questions when dropdown selection changes', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'debounce' } });

      await waitFor(() => {
        expect(screen.getByText('⏱️ Debounce Function')).toBeInTheDocument();
      });
    });
  });

  describe('Language Toggle', () => {
    it('should show language toggle buttons for questions with React support', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should highlight JavaScript button by default', () => {
      renderWithRouter(<MachineCodingPractice />);

      const jsButton = screen.getAllByText('JavaScript').find(el => el.tagName === 'BUTTON');
      expect(jsButton).toHaveClass('btn-primary');
    });

    it('should switch to React when React button is clicked', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const reactButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
      fireEvent.click(reactButton);

      await waitFor(() => {
        expect(reactButton).toHaveClass('btn-primary');
      });
    });
  });

  describe('Sandpack Editor', () => {
    it('should render Sandpack provider', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByTestId('sandpack-provider')).toBeInTheDocument();
    });

    it('should render code editor', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByTestId('sandpack-editor')).toBeInTheDocument();
    });

    it('should render preview panel', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByTestId('sandpack-preview')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render Run Tests button', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('Run Tests')).toBeInTheDocument();
    });

    it('should render Show Solution button', () => {
      renderWithRouter(<MachineCodingPractice />);

      expect(screen.getByText('Show Solution')).toBeInTheDocument();
    });

    it('should toggle solution visibility when Show Solution is clicked', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const solutionButton = screen.getByText('Show Solution');
      fireEvent.click(solutionButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution \(JavaScript\)/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Hide Solution'));

      await waitFor(() => {
        expect(screen.queryByText(/Solution \(JavaScript\)/i)).not.toBeInTheDocument();
      });
    });

    it('should display correct solution based on selected language', async () => {
      renderWithRouter(<MachineCodingPractice />);

      // Show solution in JavaScript mode
      const solutionButton = screen.getByText('Show Solution');
      fireEvent.click(solutionButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution \(JavaScript\)/i)).toBeInTheDocument();
      });

      // Switch to React
      const reactButton = screen.getAllByText('React').find(el => el.tagName === 'BUTTON');
      fireEvent.click(reactButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution \(React\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Test Results', () => {
    it('should run tests when Run Tests button is clicked', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const runTestsButton = screen.getByText('Run Tests');
      fireEvent.click(runTestsButton);

      await waitFor(() => {
        expect(screen.getByText('Test Results')).toBeInTheDocument();
      });
    });

    it('should display test result cards after running tests', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const runTestsButton = screen.getByText('Run Tests');
      fireEvent.click(runTestsButton);

      await waitFor(() => {
        expect(screen.getByText(/Basic chain operations/i)).toBeInTheDocument();
      });
    });

    it('should allow collapsing test results', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const runTestsButton = screen.getByText('Run Tests');
      fireEvent.click(runTestsButton);

      await waitFor(() => {
        expect(screen.getByText('Test Results')).toBeInTheDocument();
      });

      const collapseButton = screen.getByText('Test Results');
      fireEvent.click(collapseButton);

      await waitFor(() => {
        expect(screen.queryByText(/Basic chain operations/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Difficulty Badges', () => {
    it('should display easy difficulty with correct styling', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'debounce' } });

      await waitFor(() => {
        const easyBadge = screen.getByText('easy');
        expect(easyBadge).toHaveClass('difficulty-easy');
      });
    });

    it('should display medium difficulty with correct styling', () => {
      renderWithRouter(<MachineCodingPractice />);

      const mediumBadge = screen.getByText('medium');
      expect(mediumBadge).toHaveClass('difficulty-medium');
    });
  });

  describe('Question Data Integrity', () => {
    it('should have starter code for all questions', async () => {
      renderWithRouter(<MachineCodingPractice />);

      // Chained Calculator
      expect(screen.getByTestId('sandpack-editor')).toBeInTheDocument();

      // Breadcrumb Navigator
      const dropdown = screen.getByRole('combobox');
      fireEvent.change(dropdown, { target: { value: 'breadcrumb-navigator' } });
      await waitFor(() => {
        expect(screen.getByTestId('sandpack-editor')).toBeInTheDocument();
      });

      // Debounce
      fireEvent.change(dropdown, { target: { value: 'debounce' } });
      await waitFor(() => {
        expect(screen.getByTestId('sandpack-editor')).toBeInTheDocument();
      });
    });

    it('should have test cases for output-based questions', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const runTestsButton = screen.getByText('Run Tests');
      fireEvent.click(runTestsButton);

      await waitFor(() => {
        expect(screen.getByText(/Basic chain operations/i)).toBeInTheDocument();
      });
    });

    it('should have solutions for all questions', async () => {
      renderWithRouter(<MachineCodingPractice />);

      const solutionButton = screen.getByText('Show Solution');

      // Test each question has a solution
      const questions = ['chained-calculator', 'debounce'];
      const dropdown = screen.getByRole('combobox');

      for (const questionId of questions) {
        fireEvent.change(dropdown, { target: { value: questionId } });
        fireEvent.click(solutionButton);

        await waitFor(() => {
          expect(screen.getByText(/Solution/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Hide Solution'));
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should render grid layout for editor and results', () => {
      renderWithRouter(<MachineCodingPractice />);

      const gridContainer = screen.getByText(/Machine Coding Practice/i)
        .closest('div')
        .querySelector('.grid');

      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('should use theme CSS variables for colors', () => {
      renderWithRouter(<MachineCodingPractice />);

      const title = screen.getByText(/Machine Coding Practice/i);
      expect(title).toHaveClass('practice-title');
    });

    it('should use btn-primary class for primary buttons', () => {
      renderWithRouter(<MachineCodingPractice />);

      const runTestsButton = screen.getByText('Run Tests');
      expect(runTestsButton).toHaveClass('btn-primary');
    });

    it('should use btn-secondary class for secondary buttons', () => {
      renderWithRouter(<MachineCodingPractice />);

      const solutionButton = screen.getByText('Show Solution');
      expect(solutionButton).toHaveClass('btn-secondary');
    });
  });
});
