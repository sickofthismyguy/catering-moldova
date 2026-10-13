import { NextRequest } from 'next/server';
import { dbAdmin } from '@/lib/supabase';
import { DB_READY, SPAM } from '@/lib/config';
import { cleanText, clientIp, hashIp, json, spamCheck } from '@/lib/spam';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/review — public review form. Reviews are always created as "pending". */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Cerere invalidă.' }, 400);
  }

  if (!DB_READY) return json({ error: 'Recenziile nu sunt active în modul demonstrație.' }, 503);

  const spam = spamCheck(body, SPAM.minFillMs);
  if (spam) return json({ error: 'Verificare anti-spam eșuată.' }, 400);

  const author = cleanText(body.author_name, 80);
  const title = cleanText(body.title, 120);
  const text = cleanText(body.body, 1500);
  const firmId = cleanText(body.firm_id, 64);
  const rating = Math.round(Number(body.rating));

  if (author.length < 2) return json({ error: 'Completează numele.' }, 400);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return json({ error: 'Alege o notă de la 1 la 5.' }, 400);
  if (text.length < 15) return json({ error: 'Recenzia este prea scurtă (minimum 15 caractere).' }, 400);
  if (!firmId) return json({ error: 'Lipsește firma.' }, 400);

  const client = dbAdmin();
  if (!client) return json({ error: 'Serverul nu este configurat complet.' }, 503);

  const ipHash = hashIp(clientIp(req));
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await client.from('reviews').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since);
  if ((count ?? 0) >= 3) return json({ error: 'Ai trimis prea multe recenzii. Încearcă mai târziu.' }, 429);

  const { error } = await client.from('reviews').insert({
    firm_id: firmId, author_name: author, rating, title: title || null, body: text, status: 'pending', ip_hash: ipHash,
  });

  if (error) {
    console.error('[review]', error.message);
    return json({ error: 'Nu am putut salva recenzia.' }, 500);
  }
  return json({ ok: true, message: 'Mulțumim! Recenzia va apărea după verificare.' });
}
