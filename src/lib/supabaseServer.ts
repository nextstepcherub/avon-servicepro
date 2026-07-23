// ============================================================================
// File: src/lib/supabaseServer.ts
// Supabase SSR Integration for Next.js 16 App Router Server Components
// Sprint 1.2 Authentication & RBAC Engine
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { DBAuthUser } from '../types/authSchema';

// Get environment variables safely across SSR and Client build environments
const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key] as string;
  }
  return '';
};

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || 'placeholder_anon_key';

/**
 * Creates a Supabase client configured for Next.js 16 Server Components (SSR).
 * In a real Next.js 16 App Router environment, this accepts cookies() from 'next/headers'.
 */
export async function createServerSupabaseClient(cookieStore?: any) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('placeholder')) {
    return null;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}

/**
 * Server Component Helper to fetch the authenticated user session directly on the server.
 */
export async function getSSRAuthUser(cookieStore?: any): Promise<{ user: DBAuthUser | null; error: string | null }> {
  try {
    const supabase = await createServerSupabaseClient(cookieStore);
    if (!supabase) {
      return { user: null, error: 'Supabase client not configured' };
    }
    const { data: { session }, error } = await supabase.auth.getSession();

    
    if (error || !session?.user) {
      return { user: null, error: error?.message || 'No active SSR session' };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email || '',
        created_at: session.user.created_at || new Date().toISOString()
      },
      error: null
    };
  } catch (err: any) {
    return { user: null, error: err.message || 'Server Auth Exception' };
  }
}
