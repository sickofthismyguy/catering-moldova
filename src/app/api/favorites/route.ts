import { NextRequest } from 'next/server';
import { db } from '@/lib/supabase';
import { DEMO_MODE } from '@/lib/config';
import { demoFirms } from '@/lib/demo';
import { json } from '@/lib/spam';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/favorites?slugs=a,b,c — resolves saved favourites (no login needed). */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('slugs') || '';
  const slugs = raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 60);
  if (!slugs.length) return json({ items: [] });

  if (DEMO_MODE) {
    return json({ items: demoFirms.filter((f) => slugs.includes(f.slug)).map((f) => ({ id: f.id, slug: f.slug, name: f.name, city: f.city })) });
  }
  const client = db();
  if (!client) return json({ items: [] });
  const { data } = await client
    .from('firms')
    .select('id,slug,name,city,price_from,currency')
    .in('slug', slugs)
    .eq('status', 'approved')
    .eq('published', true);
  return json({ items: data ?? [] });
}
