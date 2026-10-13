import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL, DB_READY } from './config';

/**
 * Server-side client (public, read-only through RLS).
 * Returns null when Supabase is not configured => demo mode.
 */
let publicClient: SupabaseClient | null = null;
export function db(): SupabaseClient | null {
  if (!DB_READY) return null;
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { 'x-application-name': 'catering-moldova' } },
    });
  }
  return publicClient;
}

/** Server-side privileged client used ONLY by API routes (never shipped to the browser). */
let adminClient: SupabaseClient | null = null;
export function dbAdmin(): SupabaseClient | null {
  if (!DB_READY || !SUPABASE_SERVICE_KEY) return null;
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
