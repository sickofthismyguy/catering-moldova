/** Central configuration. Everything is driven by environment variables so the
 *  owner never has to edit code. Missing Supabase keys => DEMO mode (the site
 *  still works, using built-in example data). */

export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
export const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
export const SUPABASE_SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

/** True once Supabase credentials exist -> real database mode. */
export const DB_READY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
/** True when the site runs on example data (no Supabase connected yet). */
export const DEMO_MODE = !DB_READY;

export const SITE_NAME = (process.env.NEXT_PUBLIC_SITE_NAME || 'Catering Moldova').trim();

/** Absolute origin used for canonical URLs, sitemap, hreflang, Open Graph. */
export function siteUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  return process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000';
}

/** Bucket used for logos / photos uploaded by firms. */
export const MEDIA_BUCKET = 'media';

/** Storage public base URL (only valid in DB mode). */
export function storageBase(): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}`;
}

/** Spam protection tuning */
export const SPAM = {
  /** A human cannot fill a real form faster than this (milliseconds). */
  minFillMs: 2500,
  /** Max inquiries per IP hash per hour. */
  maxPerHour: 5,
  maxMessageLength: 2000,
  maxNameLength: 120,
};
