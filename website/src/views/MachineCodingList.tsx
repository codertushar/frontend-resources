import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Code2, Terminal, ChevronRight, Search, Filter, X } from 'lucide-react';
import { getQuestions, getCategories, getQuestionCountByCategory, getQuestionCountByDifficulty } from '../data/practice-questions/index.js';

// Type definitions
type Difficulty = 'easy' | 'medium' | 'hard';
type QuestionType = 'output' | 'preview';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  type: QuestionType;
  category: string;
  tags?: string[];
  order: number;
}

interface Filters {
  category: string;
  difficulty: string;
  search: string;
}

interface CategoryStats {
  [key: string]: number;
}

interface DifficultyStats {
  easy?: number;
  medium?: number;
  hard?: number;
}

const MachineCodingList: React.FC = () => {
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    category: '',
    difficulty: '',
    search: ''
  });

  // Mobile detection for auto card view
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get filtered questions
  const filteredQuestions: Question[] = getQuestions(filters);
  const categories: string[] = getCategories();
  const categoryStats: CategoryStats = getQuestionCountByCategory();
  const difficultyStats: DifficultyStats = getQuestionCountByDifficulty();

  const handleQuestionClick = (questionId: string): void => {
    navigate(`/practice/${questionId}`);
  };

  const getDifficultyClass = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'easy': return 'difficulty-badge difficulty-easy';
      case 'medium': return 'difficulty-badge difficulty-medium';
      case 'hard': return 'difficulty-badge difficulty-hard';
      default: return 'difficulty-badge';
    }
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'easy': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'hard': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="practice-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="practice-header"
        >
          <h1 className="practice-title">
            Machine Coding Practice
          </h1>
          <p className="practice-subtitle">
            Choose a challenge to practice and improve your coding skills
          </p>
        </motion.div>

        {/* Compact Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '2rem' }}
        >
          <div className="glass-panel animated-card" style={{ padding: '1.25rem' }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, search: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--surface-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* Filter Buttons Row */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* Category Buttons */}
              <div style={{ flex: '1 1 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Code2 size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Category
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setFilters({ ...filters, category: '' })}
                    className={filters.category === '' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}
                  >
                    All <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({filteredQuestions.length})</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, category: cat })}
                      className={filters.category === cat ? 'btn-primary' : 'btn-secondary'}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem'
                      }}
                    >
                      {cat === 'JavaScript' && '📜'}
                      {cat === 'React' && '⚛️'}
                      {cat === 'Algorithms' && '🧮'}
                      {cat} <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({categoryStats[cat] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Buttons */}
              <div style={{ flex: '0 1 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Terminal size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Difficulty
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setFilters({ ...filters, difficulty: '' })}
                    className={filters.difficulty === '' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, difficulty: 'easy' })}
                    className={filters.difficulty === 'easy' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      ...(filters.difficulty === 'easy' ? {} : { color: 'var(--success)' })
                    }}
                  >
                    🟢 Easy <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({difficultyStats.easy || 0})</span>
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, difficulty: 'medium' })}
                    className={filters.difficulty === 'medium' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      ...(filters.difficulty === 'medium' ? {} : { color: 'var(--warning)' })
                    }}
                  >
                    🟡 Medium <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({difficultyStats.medium || 0})</span>
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, difficulty: 'hard' })}
                    className={filters.difficulty === 'hard' ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      ...(filters.difficulty === 'hard' ? {} : { color: 'var(--error)' })
                    }}
                  >
                    🔴 Hard <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({difficultyStats.hard || 0})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters / Clear All */}
            {(filters.search || filters.category || filters.difficulty) && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
                  {filters.category && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      {filters.category}
                      <X
                        size={14}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilters({ ...filters, category: '' })}
                      />
                    </span>
                  )}
                  {filters.difficulty && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      {filters.difficulty}
                      <X
                        size={14}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilters({ ...filters, difficulty: '' })}
                      />
                    </span>
                  )}
                  {filters.search && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      "{filters.search}"
                      <X
                        size={14}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilters({ ...filters, search: '' })}
                      />
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFilters({ category: '', difficulty: '', search: '' })}
                  className="btn-secondary"
                  style={{
                    padding: '0.375rem 0.875rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                >
                  <X size={14} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Compact Question Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {filteredQuestions.length} Challenge{filteredQuestions.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                No challenges found matching your filters.
              </p>
            </div>
          ) : isMobile ? (
            /* Mobile Card View */
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleQuestionClick(question.id)}
                  className="glass-panel"
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Header: Title + Difficulty */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <h3 style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem', margin: 0, flex: 1 }}>
                      {question.title}
                    </h3>
                    <span className={getDifficultyClass(question.difficulty)} style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', flexShrink: 0 }}>
                      {question.difficulty === 'easy' && '🟢'}
                      {question.difficulty === 'medium' && '🟡'}
                      {question.difficulty === 'hard' && '🔴'}
                      {' '}{question.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 0.75rem 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {question.description}
                  </p>

                  {/* Meta: Category + Type */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      {question.category === 'JavaScript' && '📜'}
                      {question.category === 'React' && '⚛️'}
                      {question.category === 'Algorithms' && '🧮'}
                      <span>{question.category}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {question.type === 'output' ? <Terminal size={14} /> : <Code2 size={14} />}
                      <span>{question.type === 'output' ? 'Output' : 'Preview'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {question.tags && question.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {question.tags.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            color: 'var(--primary)',
                            fontWeight: 500
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {question.tags.length > 4 && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0.25rem 0' }}>
                          +{question.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--surface-hover)' }}>
                      <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Question
                      </th>
                      <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '120px' }}>
                        Difficulty
                      </th>
                      <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '120px' }}>
                        Category
                      </th>
                      <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '100px' }}>
                        Type
                      </th>
                      <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((question, index) => (
                      <motion.tr
                        key={question.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleQuestionClick(question.id)}
                        style={{
                          borderBottom: index < filteredQuestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e: MouseEvent<HTMLTableRowElement>) => {
                          e.currentTarget.style.background = 'var(--surface-hover)';
                        }}
                        onMouseLeave={(e: MouseEvent<HTMLTableRowElement>) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* Question Title & Description */}
                        <td style={{ padding: '1rem', maxWidth: '400px' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {question.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {question.description}
                            </div>
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td style={{ padding: '1rem' }}>
                          <span className={getDifficultyClass(question.difficulty)} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
                            {question.difficulty === 'easy' && '🟢'}
                            {question.difficulty === 'medium' && '🟡'}
                            {question.difficulty === 'hard' && '🔴'}
                            {' '}{question.difficulty}
                          </span>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                            {question.category === 'JavaScript' && '📜'}
                            {question.category === 'React' && '⚛️'}
                            {question.category === 'Algorithms' && '🧮'}
                            <span>{question.category}</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {question.type === 'output' ? <Terminal size={14} /> : <Code2 size={14} />}
                            <span>{question.type === 'output' ? 'Output' : 'Preview'}</span>
                          </div>
                        </td>

                        {/* Tags */}
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                            {question.tags && question.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(139, 92, 246, 0.1)',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  color: 'var(--primary)',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {question.tags && question.tags.length > 3 && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                +{question.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MachineCodingList;
