import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Helper to extract user from JWT (more reliable than user object)
    const getUserFromJwt = (accessToken) => {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
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
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.access_token) {
        // Trust JWT over user object (Supabase bug workaround)
        const jwtUser = getUserFromJwt(currentSession.access_token);
        setUser(jwtUser || currentSession.user);
      } else {
        setUser(null);
      }
      setSession(currentSession);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (currentSession?.access_token) {
          // Trust JWT over user object (Supabase bug workaround)
          const jwtUser = getUserFromJwt(currentSession.access_token);
          setUser(jwtUser || currentSession.user);
        } else {
          setUser(null);
        }
        setSession(currentSession);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
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

  const signInWithEmail = useCallback(async (email, password) => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
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

  const signOut = useCallback(async () => {
    if (!supabase) return;

    // Sign out and reload page to get clean state
    await supabase.auth.signOut();
    window.location.reload();
  }, []);

  const getAccessToken = useCallback(async () => {
    if (!session) return null;
    return session.access_token;
  }, [session]);

  const value = useMemo(() => ({
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
