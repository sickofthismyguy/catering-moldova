import { NextRequest } from 'next/server';
import { dbAdmin } from '@/lib/supabase';
import { DB_READY } from '@/lib/config';
import { cleanText, json } from '@/lib/spam';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/view — increments a firm's public view counter (once per session, client-side). */
export async function POST(req: NextRequest) {
  if (!DB_READY) return json({ ok: true, skipped: true });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false }, 400);
  }
  const slug = cleanText(body?.slug, 80);
  if (!slug || !/^[a-z0-9-]{3,80}$/.test(slug)) return json({ ok: false }, 400);

  const client = dbAdmin();
  if (!client) return json({ ok: true, skipped: true });

  const { data, error } = await client.rpc('increment_firm_views', { firm_slug: slug });
  if (error) {
    // Fallback if the helper function was not created
    const { data: row } = await client.from('firms').select('id,views').eq('slug', slug).maybeSingle();
    if (row) await client.from('firms').update({ views: (row.views ?? 0) + 1 }).eq('id', row.id);
  }
  return json({ ok: true, views: data ?? null });
}
