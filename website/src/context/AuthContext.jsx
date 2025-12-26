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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Create profile on first sign in
        if (event === 'SIGNED_IN' && session?.user) {
          await ensureProfile(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
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
        redirectTo: window.location.origin,
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

      // Then sign out from Supabase
      await supabase.auth.signOut({ scope: 'local' });

      // Force reload to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      // Still reload even if there's an error
      window.location.reload();
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
