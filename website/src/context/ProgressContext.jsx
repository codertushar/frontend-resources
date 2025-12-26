import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

const STORAGE_KEY = 'frontend-resources-progress';

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { user, isSignedIn, isLoaded, supabase } = useAuth();
  const [readArticles, setReadArticles] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress from localStorage or Supabase
  useEffect(() => {
    if (!isLoaded) return;

    const loadProgress = async () => {
      if (isSignedIn && user && supabase) {
        try {
          // Load from Supabase user_progress table
          const { data: progressData, error } = await supabase
            .from('user_progress')
            .select('article_id')
            .eq('user_id', user.id);

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading progress:', error);
          }

          const supabaseProgress = progressData?.map(p => p.article_id) || [];
          const localProgress = getLocalProgress();

          // Merge local and Supabase progress
          const mergedProgress = new Set([...supabaseProgress, ...localProgress]);
          setReadArticles(mergedProgress);

          // Sync local progress to Supabase if there were local articles
          if (localProgress.length > 0) {
            const newArticles = localProgress.filter(id => !supabaseProgress.includes(id));
            if (newArticles.length > 0) {
              await syncToSupabase(newArticles);
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error('Error loading progress:', error);
          setReadArticles(new Set(getLocalProgress()));
        }
      } else {
        setReadArticles(new Set(getLocalProgress()));
      }
      setIsInitialized(true);
    };

    loadProgress();
  }, [isLoaded, isSignedIn, user, supabase]);

  const getLocalProgress = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
      return [];
    }
  };

  const saveToLocalStorage = (articles) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  };

  const syncToSupabase = async (articleIds) => {
    if (!isSignedIn || !user || !supabase) return;

    try {
      const records = articleIds.map(articleId => ({
        user_id: user.id,
        article_id: articleId,
      }));

      await supabase
        .from('user_progress')
        .upsert(records, { onConflict: 'user_id,article_id' });
    } catch (error) {
      console.error('Error syncing progress to Supabase:', error);
    }
  };

  const markAsRead = useCallback(async (articleId) => {
    const updatedArticles = new Set(readArticles);
    updatedArticles.add(articleId);
    setReadArticles(updatedArticles);

    if (isSignedIn && supabase && user) {
      await supabase
        .from('user_progress')
        .upsert({ user_id: user.id, article_id: articleId }, { onConflict: 'user_id,article_id' });
    } else {
      saveToLocalStorage(Array.from(updatedArticles));
    }
  }, [readArticles, isSignedIn, supabase, user]);

  const markAsUnread = useCallback(async (articleId) => {
    const updatedArticles = new Set(readArticles);
    updatedArticles.delete(articleId);
    setReadArticles(updatedArticles);

    if (isSignedIn && supabase && user) {
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId);
    } else {
      saveToLocalStorage(Array.from(updatedArticles));
    }
  }, [readArticles, isSignedIn, supabase, user]);

  const toggleRead = useCallback((articleId) => {
    if (readArticles.has(articleId)) {
      return markAsUnread(articleId);
    } else {
      return markAsRead(articleId);
    }
  }, [readArticles, markAsRead, markAsUnread]);

  const isRead = useCallback((articleId) => {
    return readArticles.has(articleId);
  }, [readArticles]);

  const getStats = useCallback((totalArticles = 0) => {
    const readCount = readArticles.size;
    const percentage = totalArticles > 0 ? Math.round((readCount / totalArticles) * 100) : 0;

    return {
      readCount,
      totalArticles,
      percentage,
      unreadCount: totalArticles - readCount,
    };
  }, [readArticles]);

  const clearProgress = useCallback(async () => {
    setReadArticles(new Set());

    if (isSignedIn && supabase && user) {
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isSignedIn, supabase, user]);

  const value = {
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
