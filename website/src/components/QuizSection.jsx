import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, HelpCircle } from 'lucide-react';

/**
 * Parses quiz content from markdown format
 * Expected format:
 * <!-- quiz-start -->
 * ### Q1: Question text here?
 * - [ ] Wrong answer
 * - [x] Correct answer
 * - [ ] Another wrong answer
 * <!-- quiz-end -->
 */
export function parseQuizFromMarkdown(content) {
  const quizMatch = content.match(/<!--\s*quiz-start\s*-->([\s\S]*?)<!--\s*quiz-end\s*-->/i);
  if (!quizMatch) return null;

  const quizContent = quizMatch[1];
  const questions = [];

  // Split by question headers (### Q1:, ### Q2:, etc.)
  const questionBlocks = quizContent.split(/###\s*Q\d+:/i).filter(block => block.trim());

  for (const block of questionBlocks) {
    const lines = block.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) continue;

    // First line is the question
    const questionText = lines[0].trim();
    const options = [];
    let correctIndex = -1;

    // Parse options
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      // Match checkbox format: - [ ] or - [x]
      const optionMatch = line.match(/^-\s*\[([ xX])\]\s*(.+)$/);
      if (optionMatch) {
        const isCorrect = optionMatch[1].toLowerCase() === 'x';
        const optionText = optionMatch[2].trim();
        if (isCorrect) {
          correctIndex = options.length;
        }
        options.push(optionText);
      }
    }

    if (questionText && options.length >= 2 && correctIndex !== -1) {
      questions.push({
        question: questionText,
        options,
        correctIndex
      });
    }
  }

  return questions.length > 0 ? questions : null;
}

/**
 * Removes quiz block from markdown content for rendering
 */
export function removeQuizFromContent(content) {
  return content.replace(/<!--\s*quiz-start\s*-->[\s\S]*?<!--\s*quiz-end\s*-->/gi, '').trim();
}

const QuizSection = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce((count, q, idx) => {
    return count + (answers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  const allAnswered = answeredCount === questions.length;
  const score = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="quiz-section">
      <div className="quiz-header">
        <div className="quiz-title">
          <HelpCircle size={22} />
          <span>Quick Quiz</span>
        </div>
        <p className="quiz-subtitle">Test your understanding with {questions.length} quick question{questions.length > 1 ? 's' : ''}</p>
      </div>

      <div className="quiz-questions">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className={`quiz-question ${submitted ? (answers[qIdx] === q.correctIndex ? 'correct' : 'incorrect') : ''}`}>
            <div className="question-header">
              <span className="question-number">Q{qIdx + 1}</span>
              <span className="question-text">{q.question}</span>
            </div>
            <div className="question-options">
              {q.options.map((option, oIdx) => {
                const isSelected = answers[qIdx] === oIdx;
                const isCorrect = q.correctIndex === oIdx;
                const showCorrect = submitted && isCorrect;
                const showWrong = submitted && isSelected && !isCorrect;

                return (
                  <button
                    key={oIdx}
                    className={`quiz-option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={submitted}
                  >
                    <span className="option-indicator">
                      {showCorrect && <CheckCircle2 size={18} />}
                      {showWrong && <XCircle size={18} />}
                      {!submitted && <span className="option-letter">{String.fromCharCode(65 + oIdx)}</span>}
                      {submitted && !showCorrect && !showWrong && <span className="option-letter">{String.fromCharCode(65 + oIdx)}</span>}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-footer">
        {!submitted ? (
          <button
            className="quiz-submit"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'Check Answers' : `Answer all questions (${answeredCount}/${questions.length})`}
          </button>
        ) : (
          <div className="quiz-results">
            <div className={`score-badge ${score === 100 ? 'perfect' : score >= 50 ? 'good' : 'needs-work'}`}>
              <Trophy size={20} />
              <span>{correctCount}/{questions.length} correct ({score}%)</span>
            </div>
            <button className="quiz-reset" onClick={handleReset}>
              <RotateCcw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .quiz-section {
          margin-top: 3rem;
          padding: 2rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.1);
        }

        .quiz-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .quiz-title {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .quiz-title svg {
          color: var(--primary);
        }

        .quiz-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin: 0;
        }

        .quiz-questions {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .quiz-question {
          padding: 1.5rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .quiz-question.correct {
          border-color: rgba(34, 197, 94, 0.4);
          background: rgba(34, 197, 94, 0.05);
        }

        .quiz-question.incorrect {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.05);
        }

        .question-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .question-number {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          background: rgba(139, 92, 246, 0.15);
          color: var(--primary);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .question-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.5;
          padding-top: 0.15rem;
        }

        .question-options {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          margin-left: 2.5rem;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .quiz-option:hover:not(:disabled) {
          border-color: var(--primary);
          background: rgba(139, 92, 246, 0.05);
        }

        .quiz-option.selected {
          border-color: var(--primary);
          background: rgba(139, 92, 246, 0.1);
        }

        .quiz-option.correct {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.15);
        }

        .quiz-option.correct .option-indicator {
          color: #22c55e;
        }

        .quiz-option.wrong {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .quiz-option.wrong .option-indicator {
          color: #ef4444;
        }

        .quiz-option:disabled {
          cursor: default;
        }

        .option-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--surface-hover);
          flex-shrink: 0;
        }

        .quiz-option.selected .option-indicator {
          background: rgba(139, 92, 246, 0.2);
          color: var(--primary);
        }

        .option-letter {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .quiz-option.selected .option-letter {
          color: var(--primary);
        }

        .option-text {
          font-size: 0.95rem;
          color: var(--text-main);
          line-height: 1.4;
        }

        .quiz-footer {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
        }

        .quiz-submit {
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4, #ec4899, #8b5cf6);
          background-size: 300% 300%;
          animation: btn-gradient-shift 4s ease infinite;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px -2px rgba(139, 92, 246, 0.4);
        }
        
        :root.light .quiz-submit {
          background: linear-gradient(135deg, #7c3aed, #db2777, #0891b2, #db2777, #7c3aed);
          background-size: 300% 300%;
          box-shadow: 0 4px 14px -2px rgba(124, 58, 237, 0.3);
        }

        .quiz-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(139, 92, 246, 0.5);
        }
        
        :root.light .quiz-submit:hover:not(:disabled) {
          box-shadow: 0 8px 20px -4px rgba(124, 58, 237, 0.4);
        }

        .quiz-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .quiz-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .score-badge.perfect {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .score-badge.good {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .score-badge.needs-work {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .quiz-reset {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quiz-reset:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        @media (max-width: 640px) {
          .quiz-section {
            padding: 1.25rem;
            margin-top: 2rem;
          }

          .quiz-question {
            padding: 1rem;
          }

          .question-options {
            margin-left: 0;
          }

          .question-text {
            font-size: 1rem;
          }

          .quiz-option {
            padding: 0.75rem;
          }

          .option-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizSection;
