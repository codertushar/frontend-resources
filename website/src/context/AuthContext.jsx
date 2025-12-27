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

// Helper to clear all Supabase storage
const clearSupabaseStorage = () => {
  // Clear localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Clear sessionStorage
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());

  // Storage cleanup delay to ensure all storage operations complete
  const STORAGE_CLEANUP_DELAY_MS = 100;

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

    let isInitialized = false;

    // Safety timeout: ensure loading state resolves within 10 seconds
    const loadingTimeout = setTimeout(() => {
      if (!isInitialized) {
        console.warn('[Auth] Loading timeout - forcing isLoading to false');
        setIsLoading(false);
        isInitialized = true; // Prevent duplicate state updates
      }
    }, 10000);

    // Set up auth state listener - handles OAuth redirects and auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[Auth] onAuthStateChange:', { event, email: currentSession?.user?.email });

        // IGNORE INITIAL_SESSION - it comes from stale localStorage
        // We use getUser() below for accurate initial state
        if (event === 'INITIAL_SESSION') {
          console.log('[Auth] Ignoring INITIAL_SESSION (may be stale)');
          return;
        }

        // For all other events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
        // trust the event data
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        isInitialized = true;

        // Create profile on sign in (deferred to avoid Supabase deadlock)
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setTimeout(() => createProfileIfNeeded(currentSession.user), 0);
        }
      }
    );

    // IMPORTANT: Use getUser() to verify session server-side
    // This is the source of truth, not localStorage
    console.log('[Auth] Verifying session with server...');
    supabase.auth.getUser()
      .then(({ data: { user: verifiedUser }, error }) => {
        console.log('[Auth] getUser result:', {
          hasUser: !!verifiedUser,
          userId: verifiedUser?.id,
          email: verifiedUser?.email,
          identities: verifiedUser?.identities?.map(i => ({ provider: i.provider, email: i.identity_data?.email })),
          error: error?.message
        });

        // Only set state if onAuthStateChange hasn't already handled it
        // (e.g., from a SIGNED_IN event during OAuth callback)
        if (!isInitialized) {
          if (error || !verifiedUser) {
            // No valid session - clear everything
            clearSupabaseStorage();
            setSession(null);
            setUser(null);
          } else {
            // Valid user from server - get the session
            supabase.auth.getSession().then(({ data: { session: validSession } }) => {
              setSession(validSession);
              setUser(verifiedUser);
            });
          }
          setIsLoading(false);
          isInitialized = true;
        }
      })
      .catch((err) => {
        // Ensure loading state resolves even on unexpected errors
        console.error('[Auth] Unexpected error during getUser:', err);
        if (!isInitialized) {
          clearSupabaseStorage();
          setSession(null);
          setUser(null);
          setIsLoading(false);
          isInitialized = true;
        }
      });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [createProfileIfNeeded]);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }

    console.log('[Auth] signInWithGoogle called');

    // Step 1: Clear any existing local session to prevent stale data
    await supabase.auth.signOut({ scope: 'local' });
    clearSupabaseStorage();

    // Step 2: Start OAuth flow with forced account selection
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
        queryParams: {
          prompt: 'select_account',  // Force account picker - allows selecting different account
          access_type: 'offline',
        },
      },
    });

    console.log('[Auth] signInWithOAuth result:', { data, error });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;

    console.log('[Auth] signOut called');

    // Step 1: Clear React state immediately for responsive UI
    setUser(null);
    setSession(null);

    try {
      // Step 2: Sign out from Supabase (global scope terminates all sessions)
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('[Auth] signOut error:', error);
      }
    } catch (err) {
      console.error('[Auth] signOut exception:', err);
    }

    // Step 3: Clear all Supabase storage to ensure clean slate
    clearSupabaseStorage();

    // Step 4: Small delay to ensure storage is fully cleared before next sign-in
    await new Promise(resolve => setTimeout(resolve, STORAGE_CLEANUP_DELAY_MS));

    console.log('[Auth] Complete sign out finished');
  }, []);

  const getAccessToken = useCallback(async () => {
    if (!session) return null;
    return session.access_token;
  }, [session]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    isLoading,
    isSignedIn: !!user,
    isLoaded: !isLoading,
    signInWithGoogle,
    signOut,
    getAccessToken,
    supabase,
  }), [user, session, isLoading, signInWithGoogle, signOut, getAccessToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
