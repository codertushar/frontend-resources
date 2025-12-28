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
  const { user, isSignedIn, isLoaded, supabase, session } = useAuth();
  const [readArticles, setReadArticles] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress from Supabase (only when signed in AND session is ready)
  useEffect(() => {
    if (!isLoaded) return;

    const loadProgress = async () => {
      console.log('[ProgressContext] loadProgress called', { isSignedIn, userId: user?.id, hasSupabase: !!supabase, hasSession: !!session });
      if (isSignedIn && user && supabase && session) {
        try {
          // Verify session is valid before fetching
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          console.log('[ProgressContext] Current session check:', { hasSession: !!currentSession, userId: currentSession?.user?.id });

          if (!currentSession) {
            console.warn('[ProgressContext] No valid session, skipping load');
            setReadArticles(new Set());
            setIsInitialized(true);
            return;
          }

          // Load from Supabase user_progress table
          console.log('[ProgressContext] Fetching progress for user:', user.id);
          const { data: progressData, error } = await supabase
            .from('user_progress')
            .select('article_id')
            .eq('user_id', user.id);

          console.log('[ProgressContext] Supabase response:', { progressData, error });

          if (error) {
            console.error('Error loading progress:', error);
            // Check if it's a table not found error
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
              console.error('user_progress table does not exist. Please create it in Supabase.');
            }
          }

          const supabaseProgress = progressData?.map(p => p.article_id) || [];
          console.log('[ProgressContext] Setting readArticles:', supabaseProgress);
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

  const markAsRead = useCallback(async (articleId) => {
    console.log('[ProgressContext] markAsRead called:', articleId);
    // Only allow marking as read if user is signed in
    if (!isSignedIn || !supabase || !user) {
      console.warn('Cannot mark as read: user not signed in or supabase not available');
      return;
    }

    // Optimistic update using functional state update to avoid stale closure
    setReadArticles(prev => {
      const updated = new Set(prev);
      updated.add(articleId);
      return updated;
    });

    try {
      // Get the actual session user ID to compare
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const sessionUserId = currentSession?.user?.id;
      console.log('[ProgressContext] User ID comparison:', {
        fromContext: user.id,
        fromSession: sessionUserId,
        match: user.id === sessionUserId
      });

      // Use session user ID to ensure it matches auth.uid()
      const userIdToUse = sessionUserId || user.id;
      console.log('[ProgressContext] Inserting to DB:', { user_id: userIdToUse, article_id: articleId });

      const { data, error } = await supabase
        .from('user_progress')
        .insert({ user_id: userIdToUse, article_id: articleId })
        .select();

      console.log('[ProgressContext] Insert result:', { data, error });

      if (error) {
        console.error('Error saving progress to database:', error);
        // Revert on error using functional update
        setReadArticles(prev => {
          const reverted = new Set(prev);
          reverted.delete(articleId);
          return reverted;
        });
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      // Revert on error using functional update
      setReadArticles(prev => {
        const reverted = new Set(prev);
        reverted.delete(articleId);
        return reverted;
      });
    }
  }, [isSignedIn, supabase, user]);

  const markAsUnread = useCallback(async (articleId) => {
    console.log('[ProgressContext] markAsUnread called:', articleId);
    // Only allow marking as unread if user is signed in
    if (!isSignedIn || !supabase || !user) {
      console.warn('Cannot mark as unread: user not signed in or supabase not available');
      return;
    }

    // Optimistic update using functional state update
    setReadArticles(prev => {
      const updated = new Set(prev);
      updated.delete(articleId);
      return updated;
    });

    try {
      console.log('[ProgressContext] Deleting from DB:', { user_id: user.id, article_id: articleId });
      const { data, error, count } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId)
        .select();

      console.log('[ProgressContext] Delete result:', { data, error, count });

      if (error) {
        console.error('Error removing progress from database:', error);
        // Revert on error using functional update
        setReadArticles(prev => {
          const reverted = new Set(prev);
          reverted.add(articleId);
          return reverted;
        });
      }
    } catch (err) {
      console.error('Error removing progress:', err);
      // Revert on error using functional update
      setReadArticles(prev => {
        const reverted = new Set(prev);
        reverted.add(articleId);
        return reverted;
      });
    }
  }, [isSignedIn, supabase, user]);

  const toggleRead = useCallback(async (articleId) => {
    // Check current state synchronously from the Set
    const isCurrentlyRead = readArticles.has(articleId);
    if (isCurrentlyRead) {
      await markAsUnread(articleId);
    } else {
      await markAsRead(articleId);
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
