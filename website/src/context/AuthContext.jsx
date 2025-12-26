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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Handle OAuth callback - detect hash tokens
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          // Let Supabase process the hash first
          const { data, error } = await supabase.auth.getSession();
          if (data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            // Clean URL by removing hash
            window.history.replaceState(null, '', window.location.pathname);
          }
          if (error) {
            console.error('Auth callback error:', error);
          }
          setIsLoading(false);
          return; // Exit early, session already handled
        }

        // Get initial session (no OAuth callback)
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Failsafe: ensure loading state is cleared even if Supabase hangs
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Create profile on first sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureProfile(session.user);
          // Clean URL after sign in
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

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
      // Clear local state first
      setUser(null);
      setSession(null);

      // Sign out globally so other tabs also get signed out
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error('Error signing out:', error);
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
