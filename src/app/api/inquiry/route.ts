import { NextRequest } from 'next/server';
import { dbAdmin } from '@/lib/supabase';
import { DB_READY, SPAM } from '@/lib/config';
import { cleanText, clientIp, hashIp, isEmail, json, spamCheck } from '@/lib/spam';
import { demoFirms } from '@/lib/demo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/inquiry — public contact form.
 * Stored with the service-role key (never exposed to the browser), after
 * honeypot + timing + length + email validation and a per-IP hourly rate limit.
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Cerere invalidă.' }, 400);
  }

  const spam = spamCheck(body, SPAM.minFillMs);
  if (spam) return json({ error: 'Verificare anti-spam eșuată. Reîncarcă pagina și încearcă din nou.' }, 400);

  const name = cleanText(body.name, SPAM.maxNameLength);
  const email = cleanText(body.email, 160);
  const phone = cleanText(body.phone, 40);
  const message = cleanText(body.message, SPAM.maxMessageLength);
  const firmId = cleanText(body.firm_id, 64);
  const eventDate = /^\d{4}-\d{2}-\d{2}$/.test(cleanText(body.event_date, 10)) ? cleanText(body.event_date, 10) : null;
  const guestsRaw = Number(body.guests);
  const guests = Number.isFinite(guestsRaw) && guestsRaw > 0 && guestsRaw < 100000 ? Math.round(guestsRaw) : null;

  if (name.length < 2) return json({ error: 'Completează numele.' }, 400);
  if (!isEmail(email)) return json({ error: 'Adresa de e-mail nu este validă.' }, 400);
  if (message.length < 10) return json({ error: 'Mesajul este prea scurt (minimum 10 caractere).' }, 400);
  if (!firmId) return json({ error: 'Lipsește firma.' }, 400);

  if (!DB_READY) {
    return json(
      { error: 'Formularul nu este activ în modul demonstrație. Contactează firma la telefon sau pe WhatsApp.' },
      503,
    );
  }

  const client = dbAdmin();
  if (!client) return json({ error: 'Serverul nu este configurat complet (cheie service_role lipsă).' }, 503);

  // firm must exist and be public
  const { data: firm } = await client.from('firms').select('id,status,published').eq('id', firmId).maybeSingle();
  if (!firm || firm.status !== 'approved' || !firm.published) {
    return json({ error: 'Firma selectată nu acceptă momentan cereri.' }, 404);
  }

  // per-IP hourly rate limit
  const ipHash = hashIp(clientIp(req));
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await client.from('inquiries').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since);
  if ((count ?? 0) >= SPAM.maxPerHour) {
    return json({ error: 'Ai trimis prea multe cereri. Încearcă peste o oră sau sună direct firma.' }, 429);
  }

  const { data, error } = await client
    .from('inquiries')
    .insert({ firm_id: firmId, name, email, phone: phone || null, event_date: eventDate, guests, message, status: 'new', ip_hash: ipHash })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[inquiry]', error?.message);
    return json({ error: 'Nu am putut salva cererea. Încearcă din nou sau sună firma.' }, 500);
  }

  return json({ ok: true, id: data.id, message: 'Mulțumim! Cererea a fost trimisă.' });
}

/** GET /api/inquiry?firm_id= — used by demo/test tooling only. */
export async function GET(req: NextRequest) {
  const firmId = req.nextUrl.searchParams.get('firm_id');
  if (!DB_READY) {
    const exists = demoFirms.some((f) => f.id === firmId);
    return json({ ok: true, demo: true, firm: exists });
  }
  const client = dbAdmin();
  if (!client || !firmId) return json({ ok: false }, 400);
  const { count } = await client.from('inquiries').select('id', { count: 'exact', head: true }).eq('firm_id', firmId);
  return json({ ok: true, count: count ?? 0 });
}
