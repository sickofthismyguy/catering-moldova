import type { Lang, Localized } from './types';

export const PAGE_SIZE = 12;

/* ------------------------------------------------------------------ money */
export function money(value?: number | string | null, currency = 'MDL'): string {
  if (value === null || value === undefined || value === '') return '';
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '';
  const formatted = new Intl.NumberFormat('ro-MD', { maximumFractionDigits: 0 }).format(n);
  return `${formatted} ${currency}`;
}

/* ------------------------------------------------------------------ dates */
export function formatDate(value?: string | null, lang: Lang = 'ro'): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'ro-MD';
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
}

export function formatDateTime(value?: string | null, lang: Lang = 'ro'): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'ro-MD';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/* ------------------------------------------------------------ localization */
export function pick<T extends Localized>(row: T | null | undefined, lang: Lang, fallbackKey?: keyof T): string {
  if (!row) return '';
  const keys: (keyof T)[] =
    lang === 'ru'
      ? ['name_ru', 'name_ro', 'name_en']
      : lang === 'en'
        ? ['name_en', 'name_ro', 'name_ru']
        : ['name_ro', 'name_ru', 'name_en'];
  for (const k of keys) {
    const v = row[k];
    if (typeof v === 'string' && v.trim()) return v;
  }
  if (fallbackKey) {
    const v = row[fallbackKey];
    if (typeof v === 'string') return v;
  }
  return '';
}

export function pickText(row: Record<string, any> | null | undefined, lang: Lang, base: string): string {
  if (!row) return '';
  const order =
    lang === 'ru' ? [`${base}_ru`, `${base}_ro`, `${base}_en`] : lang === 'en' ? [`${base}_en`, `${base}_ro`, `${base}_ru`] : [`${base}_ro`, `${base}_ru`, `${base}_en`];
  for (const k of order) {
    const v = row[k];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
}

/* ------------------------------------------------------------------ links */
export function telHref(phone?: string | null): string {
  return `tel:${(phone || '').replace(/[^\d+]/g, '')}`;
}

export function waHref(raw?: string | null, message?: string): string {
  const digits = (raw || '').replace(/[^\d]/g, '');
  const phone = digits.startsWith('0') ? `373${digits.slice(1)}` : digits;
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${text}`;
}

export function mailHref(email?: string | null, subject?: string): string {
  return `mailto:${email || ''}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}

/* ------------------------------------------------------------------ misc */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function truncate(text: string, max = 160): string {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/[,.;:\s]\S*$/, '')}…`;
}

export function guestRange(min?: number | null, max?: number | null, lang: Lang = 'ro'): string {
  const g = lang === 'ru' ? 'гостей' : lang === 'en' ? 'guests' : 'invitați';
  if (min && max) return `${min}–${max} ${g}`;
  if (min) return `${lang === 'ro' ? 'de la' : lang === 'ru' ? 'от' : 'from'} ${min} ${g}`;
  if (max) return `${lang === 'ro' ? 'până la' : lang === 'ru' ? 'до' : 'up to'} ${max} ${g}`;
  return '';
}

export function clampInt(value: unknown, min: number, max: number, fallback?: number): number | undefined {
  const n = typeof value === 'string' ? parseInt(value, 10) : (value as number);
  if (!Number.isFinite(n as number)) return fallback;
  return Math.min(max, Math.max(min, n as number));
}
