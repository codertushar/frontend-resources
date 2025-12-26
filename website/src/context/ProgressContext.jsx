import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

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

  // Load progress from Supabase (only when signed in)
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
  }, [isLoaded, isSignedIn, user, supabase]);

  const markAsRead = useCallback(async (articleId) => {
    // Only allow marking as read if user is signed in
    if (!isSignedIn || !supabase || !user) {
      return;
    }

    const updatedArticles = new Set(readArticles);
    updatedArticles.add(articleId);
    setReadArticles(updatedArticles);

    await supabase
      .from('user_progress')
      .upsert({ user_id: user.id, article_id: articleId }, { onConflict: 'user_id,article_id' });
  }, [readArticles, isSignedIn, supabase, user]);

  const markAsUnread = useCallback(async (articleId) => {
    // Only allow marking as unread if user is signed in
    if (!isSignedIn || !supabase || !user) {
      return;
    }

    const updatedArticles = new Set(readArticles);
    updatedArticles.delete(articleId);
    setReadArticles(updatedArticles);

    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('article_id', articleId);
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
    // Only allow clearing progress if user is signed in
    if (!isSignedIn || !supabase || !user) {
      return;
    }

    setReadArticles(new Set());

    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id);
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
