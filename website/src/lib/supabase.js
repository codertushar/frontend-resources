import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Auth features will be disabled.');
}

// ALWAYS clear old tokens before creating client
// This ensures a fresh state on every page load
console.log('[Supabase] Clearing any stale auth storage...');
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('sb-')) {
    console.log('[Supabase] Removing:', key);
    localStorage.removeItem(key);
  }
});
Object.keys(sessionStorage).forEach(key => {
  if (key.startsWith('sb-')) {
    sessionStorage.removeItem(key);
  }
});

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'implicit',  // Use implicit flow - tokens come in URL hash
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const isSupabaseConfigured = () => Boolean(supabase);
