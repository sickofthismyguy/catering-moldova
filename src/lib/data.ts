import { cache } from 'react';
import { db } from './supabase';
import { DEMO_MODE } from './config';
import { PAGE_SIZE, pick, pickText } from './format';
import type { Category, City, Firm, Inquiry, Review, SearchParams, Service, SiteSettings, Taxonomy } from './types';
import {
  demoCategories, demoCities, demoCuisines, demoDietary, demoFirms, demoReviews, demoServices, demoSettings,
} from './demo';

/* ============================================================================
 * DATA ACCESS LAYER
 * Every function has two implementations:
 *   - Supabase (real mode)
 *   - built-in demo dataset (used until Supabase is connected)
 * Public pages can therefore be deployed and browsed on day one.
 * ========================================================================== */

const PUBLIC_FIRM_COLUMNS =
  'id,name,slug,tagline_ro,tagline_ru,description_ro,description_ru,city,region,address,phone,whatsapp,email,website,logo_url,gallery,price_from,currency,min_guests,max_guests,cuisines,event_types,dietary,map_lat,map_lng,rating_avg,rating_count,verified,published,status,views,created_at,updated_at';

/* ------------------------------------------------------------------ settings */
export const getSettings = cache(async function getSettings(): Promise<SiteSettings> {
  if (DEMO_MODE) return demoSettings;
  const client = db();
  if (!client) return demoSettings;
  const { data } = await client.from('settings').select('key,value').in('key', [
    'seo_title_template', 'seo_description_ro', 'seo_description_ru', 'seo_description_en',
    'hero_title_ro', 'hero_title_ru', 'hero_subtitle_ro', 'hero_subtitle_ru',
    'reviews_enabled', 'inquiries_enabled', 'contact_email', 'contact_phone',
    'footer_note_ro', 'footer_note_ru', 'featured_firm_ids',
  ]);
  const out = { ...demoSettings } as Record<string, unknown>;
  for (const row of data ?? []) {
    if (row?.key && row.value !== null && row.value !== undefined) out[row.key] = row.value;
  }
  return out as unknown as SiteSettings;
});

/* -------------------------------------------------------------------- cities */
export const getCities = cache(async function getCities(activeOnly = true): Promise<City[]> {
  if (DEMO_MODE) return demoCities.filter((c) => (activeOnly ? c.active !== false : true));
  const client = db();
  if (!client) return demoCities;
  let q = client.from('cities').select('*');
  if (activeOnly) q = q.eq('active', true);
  const { data, error } = await q.order('priority', { ascending: false }).order('name_ro');
  if (error || !data) return [];
  return data as City[];
});

export const getCityMap = cache(async function getCityMap(): Promise<Record<string, City>> {
  const cities = await getCities(false);
  const map: Record<string, City> = {};
  for (const c of cities) map[c.slug] = c;
  return map;
});

export async function getCity(slug: string): Promise<City | null> {
  const cities = await getCities(false);
  return cities.find((c) => c.slug === slug) ?? null;
}

/* ---------------------------------------------------------------- categories */
export const getCategories = cache(async function getCategories(kind?: 'event' | 'service'): Promise<Category[]> {
  if (DEMO_MODE) return demoCategories.filter((c) => (kind ? c.kind === kind : true));
  const client = db();
  if (!client) return demoCategories;
  let q = client.from('categories').select('*').eq('active', true);
  if (kind) q = q.eq('kind', kind);
  const { data, error } = await q.order('priority', { ascending: false }).order('name_ro');
  if (error || !data) return [];
  return data as Category[];
});

export async function getCategory(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

/* ----------------------------------------------------------------- taxonomy */
export const getTaxonomies = cache(async function getTaxonomies(kind: 'cuisine' | 'dietary'): Promise<Taxonomy[]> {
  if (DEMO_MODE) return kind === 'cuisine' ? demoCuisines : demoDietary;
  const client = db();
  if (!client) return kind === 'cuisine' ? demoCuisines : demoDietary;
  const { data, error } = await client.from('taxonomies').select('*').eq('kind', kind).eq('active', true).order('name_ro');
  if (error || !data) return [];
  return data as Taxonomy[];
});

export const getTaxonomyMap = cache(async function getTaxonomyMap(): Promise<Record<string, Taxonomy>> {
  const [cuisines, dietary] = await Promise.all([getTaxonomies('cuisine'), getTaxonomies('dietary')]);
  const map: Record<string, Taxonomy> = {};
  for (const row of [...cuisines, ...dietary]) map[row.slug] = row;
  return map;
});

/* -------------------------------------------------------------------- firms */
/** Public firm by slug (approved + published only). */
export async function getFirmBySlug(slug: string): Promise<Firm | null> {
  if (DEMO_MODE) return demoFirms.find((f) => f.slug === slug && f.status === 'approved' && f.published) ?? null;
  const client = db();
  if (!client) return null;
  const { data, error } = await client
    .from('firms')
    .select(PUBLIC_FIRM_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'approved')
    .eq('published', true)
    .maybeSingle();
  if (error || !data) return null;
  return data as Firm;
}

export async function getFirmServices(firmId: string, activeOnly = true): Promise<Service[]> {
  if (DEMO_MODE) return demoServices.filter((s) => s.firm_id === firmId && (activeOnly ? s.active !== false : true));
  const client = db();
  if (!client) return [];
  let q = client.from('services').select('*').eq('firm_id', firmId);
  if (activeOnly) q = q.eq('active', true);
  const { data, error } = await q.order('sort', { ascending: true }).order('created_at', { ascending: true });
  if (error || !data) return [];
  return data as Service[];
}

export async function getFirmReviews(firmId: string): Promise<Review[]> {
  if (DEMO_MODE) return demoReviews.filter((r) => r.firm_id === firmId && r.status === 'approved');
  const client = db();
  if (!client) return [];
  const { data, error } = await client
    .from('reviews')
    .select('id,firm_id,author_name,rating,title,body,status,created_at')
    .eq('firm_id', firmId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error || !data) return [];
  return data as Review[];
}

export async function getFeaturedFirms(limit = 6): Promise<Firm[]> {
  const settings = await getSettings();
  const client = db();
  if (!DEMO_MODE && client) {
    if (settings.featured_firm_ids?.length) {
      const { data } = await client
        .from('firms')
        .select(PUBLIC_FIRM_COLUMNS)
        .in('id', settings.featured_firm_ids)
        .eq('status', 'approved')
        .eq('published', true);
      if (data?.length) {
        const byId = new Map((data as Firm[]).map((f) => [f.id, f]));
        const ordered = settings.featured_firm_ids.map((id) => byId.get(id)).filter(Boolean) as Firm[];
        if (ordered.length) return ordered.slice(0, limit);
      }
    }
    const { data } = await client
      .from('firms')
      .select(PUBLIC_FIRM_COLUMNS)
      .eq('status', 'approved')
      .eq('published', true)
      .order('verified', { ascending: false })
      .order('rating_avg', { ascending: false })
      .limit(limit);
    return (data as Firm[]) ?? [];
  }
  return demoFirms.filter((f) => settings.featured_firm_ids.includes(f.id)).slice(0, limit);
}

export async function getSimilarFirms(city: string | null | undefined, excludeId: string, limit = 4): Promise<Firm[]> {
  const client = db();
  if (!DEMO_MODE && client && city) {
    const { data } = await client
      .from('firms')
      .select(PUBLIC_FIRM_COLUMNS)
      .eq('city', city)
      .eq('status', 'approved')
      .eq('published', true)
      .neq('id', excludeId)
      .limit(limit);
    if (data?.length) return data as Firm[];
  }
  if (DEMO_MODE) return demoFirms.filter((f) => f.city === city && f.id !== excludeId).slice(0, limit);
  return [];
}

/** All public firm slugs (for sitemap.xml). */
export async function getPublicFirmSlugs(): Promise<string[]> {
  if (DEMO_MODE) return demoFirms.map((f) => f.slug);
  const client = db();
  if (!client) return [];
  const { data, error } = await client.from('firms').select('slug').eq('status', 'approved').eq('published', true);
  if (error || !data) return [];
  return (data as { slug: string }[]).map((r) => r.slug);
}

/** Approved+published firm count grouped by city slug (used on the homepage / city tiles). */
export const getFirmCountsByCity = cache(async function getFirmCountsByCity(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  if (DEMO_MODE) {
    for (const f of demoFirms) {
      if (f.status === 'approved' && f.published && f.city) out[f.city] = (out[f.city] ?? 0) + 1;
    }
    return out;
  }
  const client = db();
  if (!client) return out;
  const { data, error } = await client
    .from('firms')
    .select('city')
    .eq('status', 'approved')
    .eq('published', true)
    .not('city', 'is', null)
    .limit(1000);
  if (error || !data) return out;
  for (const row of data as { city: string | null }[]) {
    if (row.city) out[row.city] = (out[row.city] ?? 0) + 1;
  }
  return out;
});

export async function getPublicStats(): Promise<{ firms: number; cities: number; services: number }> {
  const cities = await getCities();
  if (DEMO_MODE) return { firms: demoFirms.length, cities: cities.length, services: demoServices.length };
  const client = db();
  if (!client) return { firms: 0, cities: cities.length, services: 0 };
  const [f, s] = await Promise.all([
    client.from('firms').select('id', { count: 'exact', head: true }).eq('status', 'approved').eq('published', true),
    client.from('services').select('id', { count: 'exact', head: true }).eq('active', true),
  ]);
  return { firms: f.count ?? 0, cities: cities.length, services: s.count ?? 0 };
}

/* ------------------------------------------------------------------- search */
export async function searchFirms(params: SearchParams): Promise<{ items: Firm[]; total: number }> {
  const perPage = params.perPage ?? PAGE_SIZE;
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * perPage;

  if (DEMO_MODE) {
    let items = demoFirms.filter((f) => f.status === 'approved' && f.published);
    const q = (params.q ?? '').trim().toLowerCase();
    if (q) {
      items = items.filter((f) => {
        const hay = [f.name, f.tagline_ro, f.tagline_ru, f.description_ro, f.description_ru, f.city, f.region]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    if (params.city) items = items.filter((f) => f.city === params.city);
    if (params.event) items = items.filter((f) => (f.event_types ?? []).includes(params.event!));
    if (params.cuisine) items = items.filter((f) => (f.cuisines ?? []).includes(params.cuisine!));
    if (params.dietary?.length) {
      items = items.filter((f) => params.dietary!.every((d) => (f.dietary ?? []).includes(d)));
    }
    if (params.priceMin !== undefined) items = items.filter((f) => (f.price_from ?? 0) >= params.priceMin!);
    if (params.priceMax !== undefined) items = items.filter((f) => (f.price_from ?? 0) <= params.priceMax!);
    if (params.guests !== undefined) {
      items = items.filter((f) => (f.min_guests ?? 0) <= params.guests! && (f.max_guests ?? 9999) >= params.guests!);
    }
    const sorted = [...items];
    switch (params.sort) {
      case 'price_asc': sorted.sort((a, b) => (a.price_from ?? 1e9) - (b.price_from ?? 1e9)); break;
      case 'price_desc': sorted.sort((a, b) => (b.price_from ?? 0) - (a.price_from ?? 0)); break;
      case 'rating': sorted.sort((a, b) => (b.rating_avg ?? 0) - (a.rating_avg ?? 0)); break;
      case 'new': sorted.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))); break;
      default:
        sorted.sort((a, b) => Number(b.verified ?? false) - Number(a.verified ?? false) || (b.rating_avg ?? 0) - (a.rating_avg ?? 0));
    }
    return { items: sorted.slice(from, from + perPage), total: sorted.length };
  }

  const client = db();
  if (!client) return { items: [], total: 0 };

  let query = client.from('firms').select(PUBLIC_FIRM_COLUMNS, { count: 'exact' }).eq('status', 'approved').eq('published', true);

  const q = (params.q ?? '').trim();
  if (q) {
    const safe = q.replace(/[%_,()]/g, ' ').slice(0, 60);
    const cols = params.lang === 'ru' ? 'name,tagline_ru,description_ru,city,region' : 'name,tagline_ro,description_ro,city,region';
    const or = cols.split(',').map((c) => `${c}.ilike.%${safe}%`).join(',');
    query = query.or(or);
  }
  if (params.city) query = query.eq('city', params.city);
  if (params.event) query = query.contains('event_types', [params.event]);
  if (params.cuisine) query = query.contains('cuisines', [params.cuisine]);
  if (params.dietary?.length) query = query.contains('dietary', params.dietary);
  if (params.priceMin !== undefined) query = query.gte('price_from', params.priceMin);
  if (params.priceMax !== undefined) query = query.lte('price_from', params.priceMax);
  if (params.guests !== undefined) query = query.lte('min_guests', params.guests).gte('max_guests', params.guests);

  switch (params.sort) {
    case 'price_asc': query = query.order('price_from', { ascending: true, nullsFirst: false }); break;
    case 'price_desc': query = query.order('price_from', { ascending: false, nullsFirst: false }); break;
    case 'rating': query = query.order('rating_avg', { ascending: false }); break;
    case 'new': query = query.order('created_at', { ascending: false }); break;
    default: query = query.order('verified', { ascending: false }).order('rating_avg', { ascending: false }).order('views', { ascending: false });
  }

  const { data, count, error } = await query.range(from, from + perPage - 1);
  if (error) return { items: [], total: 0 };
  return { items: (data as Firm[]) ?? [], total: count ?? 0 };
}

export async function getFilterData() {
  const [cities, events, cuisines, dietary] = await Promise.all([
    getCities(),
    getCategories('event'),
    getTaxonomies('cuisine'),
    getTaxonomies('dietary'),
  ]);
  return { cities, events, cuisines, dietary };
}

/* ------------------------------------------------------------- admin / misc */
export async function getPublicInquiriesForFirm(firmId: string): Promise<Inquiry[]> {
  const client = db();
  if (!client) return [];
  const { data } = await client.from('inquiries').select('*').eq('firm_id', firmId).order('created_at', { ascending: false }).limit(200);
  return (data as Inquiry[]) ?? [];
}

/* ------------------------------------------------------ localized label util */
export function labelFor(rows: { slug: string }[] | null, slug: string | undefined, lang: SearchParams['lang'], fallback = ''): string {
  if (!slug) return fallback;
  const row = (rows ?? []).find((r) => r.slug === slug) as Record<string, unknown> | undefined;
  if (!row) return fallback || slug;
  return pick(row as never, lang) || fallback || slug;
}

export function pickLocalized<T extends Record<string, unknown>>(row: T, lang: SearchParams['lang'], base: string): string {
  return pickText(row, lang, base);
}
