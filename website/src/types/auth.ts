// Authentication types

export interface User {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
}

export interface Session {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  user?: User;
}

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  signInWithGoogle: () => Promise<{ data?: unknown; error?: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ data?: unknown; error?: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ data?: unknown; error?: Error | null }>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  supabase: unknown;
}

// Auth modal types
export type AuthMode = 'signin' | 'signup';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword?: string;
}
