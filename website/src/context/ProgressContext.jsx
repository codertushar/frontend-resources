import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';

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
  const { user, isLoaded, isSignedIn } = useUser();
  const [readArticles, setReadArticles] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress from localStorage or Clerk unsafeMetadata
  useEffect(() => {
    if (!isLoaded) return;

    const loadProgress = async () => {
      if (isSignedIn && user) {
        // Load from Clerk unsafeMetadata
        const clerkProgress = user.unsafeMetadata?.readArticles || [];
        const localProgress = getLocalProgress();
        
        // Merge local and Clerk progress
        const mergedProgress = new Set([...clerkProgress, ...localProgress]);
        setReadArticles(mergedProgress);

        // Sync merged progress back to Clerk if there were local articles
        if (localProgress.length > 0 && mergedProgress.size > clerkProgress.length) {
          await syncToClerk(Array.from(mergedProgress));
          // Clear local storage after successful sync
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        // Load from localStorage for unauthenticated users
        const localProgress = getLocalProgress();
        setReadArticles(new Set(localProgress));
      }
      setIsInitialized(true);
    };

    loadProgress();
  }, [isLoaded, isSignedIn, user]);

  // Helper to get progress from localStorage
  const getLocalProgress = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
      return [];
    }
  };

  // Helper to save progress to localStorage
  const saveToLocalStorage = (articles) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  };

  // Sync progress to Clerk unsafeMetadata
  const syncToClerk = async (articles) => {
    if (!isSignedIn || !user) return;

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          readArticles: articles,
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error syncing progress to Clerk:', error);
    }
  };

  // Mark an article as read
  const markAsRead = useCallback(async (articleId) => {
    const updatedArticles = new Set(readArticles);
    updatedArticles.add(articleId);
    setReadArticles(updatedArticles);

    const articlesArray = Array.from(updatedArticles);
    
    if (isSignedIn) {
      await syncToClerk(articlesArray);
    } else {
      saveToLocalStorage(articlesArray);
    }
  }, [readArticles, isSignedIn]);

  // Mark an article as unread
  const markAsUnread = useCallback(async (articleId) => {
    const updatedArticles = new Set(readArticles);
    updatedArticles.delete(articleId);
    setReadArticles(updatedArticles);

    const articlesArray = Array.from(updatedArticles);
    
    if (isSignedIn) {
      await syncToClerk(articlesArray);
    } else {
      saveToLocalStorage(articlesArray);
    }
  }, [readArticles, isSignedIn]);

  // Toggle read status
  const toggleRead = useCallback((articleId) => {
    if (readArticles.has(articleId)) {
      return markAsUnread(articleId);
    } else {
      return markAsRead(articleId);
    }
  }, [readArticles, markAsRead, markAsUnread]);

  // Check if an article is read
  const isRead = useCallback((articleId) => {
    return readArticles.has(articleId);
  }, [readArticles]);

  // Get progress statistics
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

  // Clear all progress (useful for testing or reset)
  const clearProgress = useCallback(async () => {
    setReadArticles(new Set());
    
    if (isSignedIn) {
      await syncToClerk([]);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isSignedIn]);

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
