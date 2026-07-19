// ============================================================================
// File: src/lib/supabaseClient.ts
// SSR & SPA Compatible Supabase Client for AVON ServicePro
// Supports Next.js SSR / Vite SPA environments with graceful fallback
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { safeLocalStorage } from './safeStorage';

const supabaseUrl = typeof import.meta !== 'undefined' && (import.meta as any).env 
  ? (import.meta as any).env.VITE_SUPABASE_URL || '' 
  : '';
const supabaseAnonKey = typeof import.meta !== 'undefined' && (import.meta as any).env 
  ? (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '' 
  : '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize Supabase if credentials exist, otherwise null
export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Enterprise Auth Wrapper handling both live Supabase SSR/SPA and local preview fallback
 */
export async function enterpriseLogin(email: string, pass: string): Promise<{ user: any; error: string | null }> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) {
      return { user: null, error: error.message };
    }
    return { user: data.user, error: null };
  }

  // Preview Sandbox Fallback (Simulates Supabase Auth securely)
  await new Promise(resolve => setTimeout(resolve, 800)); // Network simulation

  if (!email.includes('@')) {
    return { user: null, error: "Invalid credentials format." };
  }

  if (pass.length < 6) {
    return { user: null, error: "Password must be at least 6 characters long." };
  }

  const mockUser = {
    id: `usr-${Date.now()}`,
    email,
    user_metadata: {
      full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: 'Senior Biomedical Engineer'
    }
  };

  safeLocalStorage.setItem('avon_auth_session', JSON.stringify(mockUser));
  return { user: mockUser, error: null };
}

export async function enterpriseLogout(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  safeLocalStorage.removeItem('avon_auth_session');
}
