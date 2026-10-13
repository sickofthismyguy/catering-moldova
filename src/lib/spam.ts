import { createHash } from 'node:crypto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function hashIp(ip: string): string {
  return createHash('sha256').update(`cm|${ip}`).digest('hex').slice(0, 32);
}

export function clientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0]!.trim().slice(0, 45);
  return (req.headers.get('x-real-ip') || '0.0.0.0').slice(0, 45);
}

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value) && value.length <= 160;
}

/** Rejects bots: honeypot filled, or the form was submitted faster than a human could type. */
export function spamCheck(payload: { company?: string; ts?: number }, minFillMs: number): string | null {
  if (typeof payload.company === 'string' && payload.company.trim() !== '') return 'spam';
  const ts = Number(payload.ts);
  if (!Number.isFinite(ts) || ts <= 0) return 'spam';
  const age = Date.now() - ts;
  if (age < minFillMs) return 'fast';
  if (age > 1000 * 60 * 60 * 24) return 'stale';
  return null;
}

export function cleanText(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/\r/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim();
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
