'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, DB_READY, MEDIA_BUCKET } from './config';

let browserClient: SupabaseClient | null = null;

/** Browser client used by the dashboard (auth + CRUD, protected by RLS). */
export function sb(): SupabaseClient | null {
  if (!DB_READY) return null;
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return browserClient;
}

export function dbReady() {
  return DB_READY;
}

/** Upload a File into Supabase Storage and return its public URL. */
export async function uploadMedia(
  file: File,
  ownerId: string,
  kind: 'logo' | 'gallery' | 'service',
): Promise<{ url?: string; error?: string }> {
  const client = sb();
  if (!client) return { error: 'demo' };
  if (file.size > 5 * 1024 * 1024) return { error: 'size' };
  const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!ok.includes(file.type)) return { error: 'type' };
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
  const path = `firms/${ownerId}/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type,
  });
  if (error) return { error: error.message };
  const { data } = client.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
