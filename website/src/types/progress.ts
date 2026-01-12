// Progress tracking types

export interface ProgressStats {
  readCount: number;
  totalArticles: number;
  percentage: number;
  unreadCount: number;
}

export interface ProgressContextValue {
  readArticles: string[];
  isRead: (articleId: string) => boolean;
  toggleRead: (articleId: string) => Promise<void>;
  markAsRead: (articleId: string) => Promise<void>;
  markAsUnread: (articleId: string) => Promise<void>;
  getStats: (totalArticles?: number) => ProgressStats;
  clearProgress: () => Promise<void>;
  isInitialized: boolean;
}

export interface CategoryProgress {
  category: string;
  total: number;
  read: number;
  percentage: number;
}
