import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Ensure user profile exists in profiles table
const ensureProfile = async (user) => {
  if (!supabase) return;

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!existingProfile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      subscription_status: 'free',
      subscription_plan: 'free',
    });
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  // If Supabase isn't configured, don't show loading state
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    let isMounted = true;

    // Listen for auth changes - this handles INITIAL_SESSION, SIGNED_IN, SIGNED_OUT
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Create profile on first sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureProfile(session.user);
        }

        // Clean URL after OAuth callback
        if (window.location.hash?.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    );

    // Failsafe: ensure loading state is cleared even if Supabase hangs
    const timeout = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error('Supabase not configured');
      return { error: new Error('Supabase not configured') };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href,
      },
    });

    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) return;

    try {
      // Let Supabase handle signOut - it will clear tokens and broadcast to other tabs
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: manually clear state if signOut fails
      setUser(null);
      setSession(null);
    }
  };

  const getAccessToken = async () => {
    if (!session) return null;
    return session.access_token;
  };

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
