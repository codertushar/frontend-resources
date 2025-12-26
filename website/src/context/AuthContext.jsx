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

// Ensure user profile exists in profiles table (called outside of onAuthStateChange)
const ensureProfile = async (user) => {
  if (!supabase) return;

  try {
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
  } catch (error) {
    console.error('Error ensuring profile:', error);
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

    // 1. Get initial session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Clean URL after OAuth callback
      if (window.location.hash?.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    // 2. Listen for auth state changes (cross-tab sync, sign in, sign out, token refresh)
    // IMPORTANT: Don't use async callback - defer Supabase calls with setTimeout
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Defer profile creation to avoid deadlock (don't call Supabase inside callback)
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => ensureProfile(session.user), 0);
        }
      }
    );

    return () => subscription.unsubscribe();
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
