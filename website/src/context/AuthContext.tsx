import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session, AuthContextValue } from '../types';

interface JwtPayload {
  sub: string;
  email: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Helper to extract user from JWT (more reliable than user object)
    const getUserFromJwt = (accessToken: string): User | null => {
      try {
        const payload: JwtPayload = JSON.parse(atob(accessToken.split('.')[1]));
        return {
          id: payload.sub,
          email: payload.email,
          user_metadata: payload.user_metadata || {},
          app_metadata: payload.app_metadata || {},
        };
      } catch {
        return null;
      }
    };

    // Get initial session
    supabase!.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.access_token) {
        // Trust JWT over user object (Supabase bug workaround)
        const jwtUser = getUserFromJwt(currentSession.access_token);
        const supabaseUser = currentSession.user;
        setUser(jwtUser || (supabaseUser ? {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          user_metadata: supabaseUser.user_metadata || {},
          app_metadata: supabaseUser.app_metadata || {},
        } : null));
      } else {
        setUser(null);
      }
      setSession(currentSession as Session | null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (currentSession?.access_token) {
          // Trust JWT over user object (Supabase bug workaround)
          const jwtUser = getUserFromJwt(currentSession.access_token);
          const supabaseUser = currentSession.user;
          setUser(jwtUser || (supabaseUser ? {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            user_metadata: supabaseUser.user_metadata || {},
            app_metadata: supabaseUser.app_metadata || {},
          } : null));
        } else {
          setUser(null);
        }
        setSession(currentSession as Session | null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<{ data?: unknown; error?: Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });

    return { data, error };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ data?: unknown; error?: Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string): Promise<{ data?: unknown; error?: Error | null }> => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    return { data, error };
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    if (!supabase) return;

    // Sign out and navigate to homepage
    await supabase.auth.signOut();
    window.location.href = '/';
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!session) return null;
    return session.access_token;
  }, [session]);

  const value: AuthContextValue = useMemo(() => ({
    user,
    session,
    isLoading,
    isSignedIn: !!user,
    isLoaded: !isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getAccessToken,
    supabase,
  }), [user, session, isLoading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, getAccessToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
