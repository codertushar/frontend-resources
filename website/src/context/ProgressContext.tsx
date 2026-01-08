import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import type { ProgressStats, ProgressContextValue } from '../types/progress';

// Re-export for backward compatibility
export type { ProgressStats, ProgressContextValue } from '../types/progress';

// Props for the provider component
interface ProgressProviderProps {
  children: React.ReactNode;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }: ProgressProviderProps): JSX.Element => {
  const { user, isSignedIn, isLoaded, supabase, session } = useAuth() as UseAuthReturn;
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load progress from Supabase (only when signed in AND session is ready)
  useEffect(() => {
    if (!isLoaded) return;

    const loadProgress = async (): Promise<void> => {
      if (isSignedIn && user && supabase && session) {
        try {
          const { data: progressData, error } = await supabase
            .from('user_progress')
            .select('article_id')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error loading progress:', error);
          }

          const supabaseProgress: string[] = progressData?.map((p: { article_id: string }) => p.article_id) || [];
          setReadArticles(new Set(supabaseProgress));
        } catch (error) {
          console.error('Error loading progress:', error);
          setReadArticles(new Set());
        }
      } else {
        // Not signed in - no progress tracking
        setReadArticles(new Set());
      }
      setIsInitialized(true);
    };

    loadProgress();
  }, [isLoaded, isSignedIn, user, supabase, session]);

  const markAsRead = useCallback(async (articleId: string): Promise<void> => {
    if (!isSignedIn || !supabase || !user) {
      return;
    }

    // Optimistic update
    setReadArticles(prev => {
      const updated = new Set(prev);
      updated.add(articleId);
      return updated;
    });

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({ user_id: user.id, article_id: articleId }, { onConflict: 'user_id,article_id' });

      if (error) {
        console.error('Error saving progress to database:', error);
        // Revert on error
        setReadArticles(prev => {
          const reverted = new Set(prev);
          reverted.delete(articleId);
          return reverted;
        });
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      // Revert on error
      setReadArticles(prev => {
        const reverted = new Set(prev);
        reverted.delete(articleId);
        return reverted;
      });
    }
  }, [isSignedIn, supabase, user]);

  const markAsUnread = useCallback(async (articleId: string): Promise<void> => {
    if (!isSignedIn || !supabase || !user) {
      return;
    }

    // Optimistic update
    setReadArticles(prev => {
      const updated = new Set(prev);
      updated.delete(articleId);
      return updated;
    });

    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);

      if (error) {
        console.error('Error removing progress from database:', error);
        // Revert on error
        setReadArticles(prev => {
          const reverted = new Set(prev);
          reverted.add(articleId);
          return reverted;
        });
      }
    } catch (err) {
      console.error('Error removing progress:', err);
      // Revert on error
      setReadArticles(prev => {
        const reverted = new Set(prev);
        reverted.add(articleId);
        return reverted;
      });
    }
  }, [isSignedIn, supabase, user]);

  const toggleRead = useCallback(async (articleId: string): Promise<void> => {
    const isCurrentlyRead = readArticles.has(articleId);
    if (isCurrentlyRead) {
      await markAsUnread(articleId);
    } else {
      await markAsRead(articleId);
    }
  }, [readArticles, markAsRead, markAsUnread]);

  const isRead = useCallback((articleId: string): boolean => {
    return readArticles.has(articleId);
  }, [readArticles]);

  const getStats = useCallback((totalArticles: number = 0): ProgressStats => {
    const readCount = readArticles.size;
    const percentage = totalArticles > 0 ? Math.round((readCount / totalArticles) * 100) : 0;

    return {
      readCount,
      totalArticles,
      percentage,
      unreadCount: totalArticles - readCount,
    };
  }, [readArticles]);

  const clearProgress = useCallback(async (): Promise<void> => {
    if (!isSignedIn || !supabase || !user) {
      return;
    }

    setReadArticles(new Set());

    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id);
  }, [isSignedIn, supabase, user]);

  const value: ProgressContextValue = {
    readArticles: Array.from(readArticles),
    markAsRead,
    markAsUnread,
    toggleRead,
    isRead,
    getStats,
    clearProgress,
    isInitialized,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
