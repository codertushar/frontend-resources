import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Support both Vite (import.meta.env) and Next.js (process.env) environment variables
const getEnvVar = (viteKey: string, nextKey: string): string | undefined => {
  // Check Next.js env first (works in both client and server)
  if (typeof process !== 'undefined' && process.env[nextKey]) {
    return process.env[nextKey];
  }
  // Fall back to Vite env (only works in Vite builds)
  // Use try-catch because import.meta.env may not exist in Next.js SSR
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.[viteKey]) {
      return import.meta.env[viteKey] as string;
    }
  } catch {
    // import.meta.env not available in this environment
  }
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Auth features will be disabled.');
}

export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => Boolean(supabase);
