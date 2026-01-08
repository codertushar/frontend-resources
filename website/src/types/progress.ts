// Progress tracking types

export interface ProgressStats {
  total: number;
  read: number;
  percentage: number;
}

export interface ProgressContextValue {
  markedArticles: Set<string>;
  isRead: (articleId: string) => boolean;
  toggleRead: (articleId: string) => void;
  markAsRead: (articleId: string) => void;
  markAsUnread: (articleId: string) => void;
  getStats: () => ProgressStats;
  isInitialized: boolean;
}

export interface CategoryProgress {
  category: string;
  total: number;
  read: number;
  percentage: number;
}
