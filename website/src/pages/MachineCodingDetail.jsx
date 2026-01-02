import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack
} from '@codesandbox/sandpack-react';
import { Code2, Play, CheckCircle, XCircle, Terminal, Info, ChevronDown, ChevronUp, ArrowLeft, Lightbulb, Send, RotateCw } from 'lucide-react';
import { getQuestionById } from '../data/practice-questions/index.js';

// Custom editor that syncs code changes
const CustomSandpackEditor = ({ onCodeChange, isReact, questionType, runTrigger }) => {
  const { sandpack } = useSandpack();
  const { files } = sandpack;
  const lastCodeRef = useRef('');
  const prevRunTriggerRef = useRef(runTrigger);

  useEffect(() => {
    const mainFile = isReact ? '/App.js' : '/index.js';
    const currentCode = files[mainFile]?.code || '';

    if (currentCode && currentCode !== lastCodeRef.current) {
      lastCodeRef.current = currentCode;
      onCodeChange(currentCode);
    }
  }, [files, isReact, onCodeChange]);

  // Run code when runTrigger changes
  useEffect(() => {
    if (runTrigger !== prevRunTriggerRef.current) {
      prevRunTriggerRef.current = runTrigger;
      // Run the sandpack bundler
      sandpack.runSandpack();
    }
  }, [runTrigger, sandpack]);

  // For output-based questions, show console instead of preview
  const showConsole = questionType === 'output';

  return (
    <SandpackLayout>
      <SandpackCodeEditor
        showLineNumbers
        showInlineErrors
        wrapContent
        style={{ height: '500px' }}
      />
      {showConsole ? (
        <>
          {/* Hidden preview to execute code - console needs an active client */}
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
            style={{ display: 'none' }}
          />
          <SandpackConsole
            style={{ height: '500px' }}
            showHeader
            resetOnPreviewRestart
          />
        </>
      ) : (
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showRefreshButton
          style={{ height: '500px' }}
        />
      )}
    </SandpackLayout>
  );
};

// Custom Sandpack themes
const customDarkTheme = {
  colors: {
    surface1: '#111827',
    surface2: '#1f2937',
    surface3: '#0f172a',
    clickable: '#9ca3af',
    base: '#f9fafb',
    disabled: '#4b5563',
    hover: '#8b5cf6',
    accent: '#8b5cf6',
    error: '#ef4444',
    errorSurface: '#7f1d1d',
  },
  syntax: {
    plain: '#f9fafb',
    comment: { color: '#6b7280', fontStyle: 'italic' },
    keyword: '#a78bfa',
    tag: '#ec4899',
    punctuation: '#9ca3af',
    definition: '#06b6d4',
    property: '#f59e0b',
    static: '#10b981',
    string: '#34d399',
  },
  font: {
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    size: '14px',
    lineHeight: '1.6',
  },
};

const customLightTheme = {
  colors: {
    surface1: '#ffffff',
    surface2: '#f8fafc',
    surface3: '#f1f5f9',
    clickable: '#64748b',
    base: '#0f172a',
    disabled: '#cbd5e1',
    hover: '#7c3aed',
    accent: '#7c3aed',
    error: '#dc2626',
    errorSurface: '#fef2f2',
  },
  syntax: {
    plain: '#0f172a',
    comment: { color: '#64748b', fontStyle: 'italic' },
    keyword: '#7c3aed',
    tag: '#db2777',
    punctuation: '#475569',
    definition: '#0891b2',
    property: '#d97706',
    static: '#059669',
    string: '#047857',
  },
  font: {
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    size: '14px',
    lineHeight: '1.6',
  },
};

const MachineCodingDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const question = getQuestionById(questionId);

  const [currentLanguage, setCurrentLanguage] = useState(question?.defaultLanguage || 'vanilla');
  const [userCode, setUserCode] = useState(question?.starterCode[currentLanguage] || '');
  const [testResults, setTestResults] = useState([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showTests, setShowTests] = useState(false);
  const [showProblem, setShowProblem] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(document.documentElement.classList.contains('light'));
  const [sandpackKey, setSandpackKey] = useState(0);
  const [runTrigger, setRunTrigger] = useState(0);

  // Handle Run button click - re-executes the code
  const handleRun = () => {
    setRunTrigger(prev => prev + 1);
  };

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLightTheme(document.documentElement.classList.contains('light'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // If question not found, redirect back
  if (!question) {
    navigate('/practice');
    return null;
  }

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setUserCode(question.starterCode[lang]);
    setSandpackKey(prev => prev + 1);
  };

  const runTests = () => {
    if (question.type === 'preview') {
      setTestResults([{ name: 'Manual Testing', passed: null, message: 'Test the component in the preview panel' }]);
      return;
    }

    const results = question.testCases.map(testCase => {
      try {
        const extractionMap = {
          'chained-calculator': ['ChainCalculator'],
          'debounce': ['debounce'],
          'breadcrumb-navigator': [],
        };

        const requiredExports = extractionMap[question.id] || ['ChainCalculator'];
        let userImpl = {};

        try {
          const exportList = requiredExports.join(', ');
          const userFunction = new Function(userCode + `\nreturn { ${exportList} };`);
          userImpl = userFunction();
        } catch (e) {
          return {
            name: testCase.name,
            passed: false,
            message: `Code Error: ${e.message}`
          };
        }

        const testFunction = new Function(...requiredExports, testCase.code);
        const result = testFunction(...requiredExports.map(name => userImpl[name]));

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
        '/App.js': {
          code: userCode,
          active: true
        },
        '/index.js': {
          code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
          hidden: true,
          readOnly: true
        },
        '/styles.css': {
          code: `body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

#root {
  padding: 20px;
}`,
          hidden: true
        }
      };
    } else {
      return {
        '/index.js': {
          code: userCode
        }
      };
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'difficulty-badge difficulty-easy';
      case 'medium': return 'difficulty-badge difficulty-medium';
      case 'hard': return 'difficulty-badge difficulty-hard';
      default: return 'difficulty-badge';
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="practice-container">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/practice')}
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Challenges</span>
        </motion.button>

        {/* Problem Statement Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="question-card"
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {question.title}
                </h1>
                <span className={getDifficultyClass(question.difficulty)}>
                  {question.difficulty}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Code2 size={16} />
                  <span>{question.category}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  {question.type === 'output' ? <Terminal size={16} /> : <Code2 size={16} />}
                  <span>{question.type === 'output' ? 'Output-based' : 'Interactive'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowProblem(!showProblem)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: showProblem ? '1rem' : 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <span>📋 Problem Statement</span>
            {showProblem ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showProblem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: 1.6 }}>
                {question.description}
              </p>

              {question.tags && question.tags.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Topics:
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {question.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: 'rgba(139, 92, 246, 0.1)',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          color: 'var(--primary)',
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="tips-panel"
          style={{ marginBottom: '2rem' }}
        >
          <button
            onClick={() => setShowTips(!showTips)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: showTips ? '1rem' : 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={20} style={{ color: 'var(--warning)' }} />
              💡 Tips & Hints
            </span>
            {showTips ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showTips && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.6 }}
            >
              <li>Read the problem carefully and understand what needs to be implemented</li>
              <li>Look at the TODO comments in the starter code for guidance</li>
              <li>Think about edge cases and error handling</li>
              <li>Test your solution with different inputs</li>
              <li>Use console.log() for debugging if needed</li>
              {question.difficulty === 'hard' && <li>Break down the problem into smaller, manageable steps</li>}
            </motion.ul>
          )}
        </motion.div>

        {/* Code Editor Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '2rem' }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            💻 Code Editor
          </h2>

          {/* Language Selector - only show if both variants exist */}
          {question.starterCode.vanilla && question.starterCode.react && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => handleLanguageChange('vanilla')}
                className={currentLanguage === 'vanilla' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500 }}
              >
                JavaScript
              </button>
              <button
                onClick={() => handleLanguageChange('react')}
                className={currentLanguage === 'react' ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500 }}
              >
                React
              </button>
            </div>
          )}

          {/* Single language indicator - show if only one variant exists */}
          {!(question.starterCode.vanilla && question.starterCode.react) && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
                {question.starterCode.react ? '⚛️ React Only' : '📜 JavaScript Only'}
              </span>
            </div>
          )}

          {/* Sandpack Editor */}
          <div className="editor-container">
            <SandpackProvider
              key={`sandpack-${sandpackKey}`}
              template={currentLanguage === 'react' ? 'react' : 'vanilla'}
              files={getSandpackFiles()}
              theme={isLightTheme ? customLightTheme : customDarkTheme}
              options={{
                showNavigator: false,
                showTabs: false,
                showLineNumbers: true,
                editorHeight: 500,
                editorWidthPercentage: 60,
                activeFile: currentLanguage === 'react' ? '/App.js' : '/index.js',
                visibleFiles: currentLanguage === 'react' ? ['/App.js'] : ['/index.js'],
                autorun: question.type !== 'output', // Don't auto-run for output-based questions
              }}
            >
              <CustomSandpackEditor
                onCodeChange={setUserCode}
                isReact={currentLanguage === 'react'}
                questionType={question.type}
                runTrigger={runTrigger}
              />
            </SandpackProvider>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              onClick={handleRun}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                fontSize: '0.95rem'
              }}
            >
              <Play size={18} />
              <span>Run</span>
            </button>
            <button
              onClick={runTests}
              className="btn-primary"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.5rem',
                fontSize: '0.95rem'
              }}
            >
              <Send size={18} />
              <span>Submit</span>
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="btn-secondary"
              style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}
            >
              {showSolution ? 'Hide' : 'Show'} Solution
            </button>
          </div>

          {/* Solution */}
          {showSolution && question.solution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="glass-panel"
              style={{ padding: '1.25rem', background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)', marginTop: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Info size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  Solution {currentLanguage === 'react' ? '(React)' : '(JavaScript)'}
                </h3>
              </div>
              <pre style={{ fontSize: '0.875rem', background: 'var(--surface-hover)', padding: '1rem', borderRadius: '8px', overflow: 'auto', lineHeight: 1.6 }}>
                <code style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {typeof question.solution === 'string'
                    ? question.solution
                    : question.solution[currentLanguage] || question.solution.vanilla}
                </code>
              </pre>
            </motion.div>
          )}
        </motion.div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="question-card"
          >
            <button
              onClick={() => setShowTests(!showTests)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span>📊 Test Results</span>
              {showTests ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showTests && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={
                      result.passed === null
                        ? 'test-result-card test-result-manual'
                        : result.passed
                        ? 'test-result-card test-result-pass'
                        : 'test-result-card test-result-fail'
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      {result.passed === null ? (
                        <Info size={20} style={{ color: 'var(--text-muted)', marginTop: '0.125rem' }} />
                      ) : result.passed ? (
                        <CheckCircle size={20} style={{ color: 'var(--success)', marginTop: '0.125rem' }} />
                      ) : (
                        <XCircle size={20} style={{ color: 'var(--error)', marginTop: '0.125rem' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                          {result.name}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MachineCodingDetail;
