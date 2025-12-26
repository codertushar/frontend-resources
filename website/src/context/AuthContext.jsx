import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());

  const createProfileIfNeeded = useCallback(async (authUser) => {
    if (!supabase) return;

    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authUser.id)
        .single();

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || '',
          subscription_status: 'free',
          subscription_plan: 'free',
        });
      }
    } catch {
      // Profile might already exist, ignore error
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    // Set up auth state listener (this handles OAuth redirects automatically)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[Auth] onAuthStateChange:', {
          event,
          email: currentSession?.user?.email,
        });
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        // Create profile on first sign in (deferred to avoid deadlock)
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => createProfileIfNeeded(currentSession.user), 0);
        }
      }
    );

    // Get initial session
    console.log('[Auth] Getting initial session...');
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('[Auth] getSession result:', {
        hasSession: !!initialSession,
        email: initialSession?.user?.email,
      });
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [createProfileIfNeeded]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    console.log('[Auth] signInWithGoogle called');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    console.log('[Auth] signInWithOAuth result:', { data, error });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;

    console.log('[Auth] signOut called');

    // Clear React state first
    setUser(null);
    setSession(null);

    // Sign out from Supabase (local scope to avoid server issues)
    const { error } = await supabase.auth.signOut();
    console.log('[Auth] signOut result:', { error });

    console.log('[Auth] State cleared');
  }, []);

  const getAccessToken = useCallback(async () => {
    if (!session) return null;
    return session.access_token;
  }, [session]);

  const value = {
    user,
    session,
    isLoading,
    isSignedIn: !!user,
    isLoaded: !isLoading,
    signInWithGoogle,
    signOut,
    getAccessToken,
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
