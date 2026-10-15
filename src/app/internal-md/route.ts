import { NextRequest } from 'next/server';
import {
  getCategories, getCity, getCategory, getFirmBySlug, getFirmServices,
  getFeaturedFirms, getSettings, getCities, searchFirms,
} from '@/lib/data';
import { staticPages } from '@/lib/content';
import { SITE_NAME, siteUrl } from '@/lib/config';
import { money, pick, guestRange } from '@/lib/format';
import type { Lang } from '@/lib/types';

export const dynamic = 'force-dynamic';

const MD_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  Vary: 'Accept',
  'Cache-Control': 'public, max-age=300',
};

function md(body: string, status = 200) {
  return new Response(body, { status, headers: MD_HEADERS });
}

/**
 * Markdown mirror of every public page, served when a client requests
 * `Accept: text/markdown` (see src/middleware.ts). Humans keep the HTML site;
 * AI agents and tools get clean, structured Markdown of the same content.
 */
export async function GET(req: NextRequest) {
  const base = siteUrl();
  const rawPath = req.headers.get('x-md-path') || req.nextUrl.searchParams.get('path') || '/ro';
  const m = /^\/(ro|ru|en)(\/.*)?$/.exec(rawPath);
  const lang = (m?.[1] ?? 'ro') as Lang;
  const rest = m?.[2] || '/';
  const L = (p: string) => `${base}/${lang}${p}`;

  const notFound = md(
    [
      `# 404 — page not found`,
      ``,
      `The path \`${rawPath}\` does not exist on ${SITE_NAME}.`,
      ``,
      `- Machine index: ${base}/llms.txt`,
      `- Sitemap: ${base}/sitemap.xml`,
      `- Human site: ${base}/${lang}`,
    ].join('\n'),
    404,
  );

  /* ------------------------------------------------------------ homepage */
  if (rest === '/') {
    const [settings, cities, events, featured] = await Promise.all([
      getSettings(), getCities(), getCategories('event'), getFeaturedFirms(10),
    ]);
    const desc =
      lang === 'ru' ? settings.seo_description_ru : lang === 'en' ? settings.seo_description_en : settings.seo_description_ro;
    const lines = [
      `# ${SITE_NAME} — catering directory for the Republic of Moldova`,
      ``,
      `> ${desc}`,
      ``,
      `## When to use this site`,
      `- Find and compare catering companies in Moldovan cities (Chișinău, Bălți, Cahul, Orhei, Ungheni, Soroca, Comrat and 26 more).`,
      `- Filter by event type (weddings, corporate, christenings, birthdays), cuisine, dietary options, budget and guest count.`,
      `- Read firm facts: price-from, guest range, services with prices, phone/WhatsApp/e-mail, verified status and approved reviews.`,
      `- Not for: online payments, table booking, or catering outside Moldova.`,
      ``,
      `## How to call it`,
      `- Any HTML page on this site has a Markdown twin: request the same URL with header \`Accept: text/markdown\`.`,
      `- Search: ${L('/cauta')}?q=keyword&city=chisinau&event=nunti&cuisine=moldoveneasca&dietary=vegetarian&pmin=200&pmax=600&guests=100&sort=price_asc`,
      `- City pages: ${L('/catering-chisinau')} · Category pages: ${L('/catering-nunti')} · Firm pages: ${L('/firma/')}{slug}`,
      `- Languages: /ro (default), /ru, /en.`,
      ``,
      `## Cities (${cities.length})`,
      ...cities.slice(0, 35).map((c) => `- [${pick(c, lang)}](${L(`/catering-${c.slug}`)})`),
      ``,
      `## Event types`,
      ...events.map((e) => `- [${pick(e, lang)}](${L(`/catering-${e.slug}`)})`),
      ``,
      `## Featured companies`,
      ...featured.map(
        (f) =>
          `- [${f.name}](${L(`/firma/${f.slug}`)}) — ${f.city || ''}${f.price_from ? `, from ${money(f.price_from, f.currency || 'MDL')}/person` : ''}${f.rating_avg ? `, rating ${f.rating_avg}` : ''}`,
      ),
      ``,
      `## Machine resources`,
      `- llms.txt: ${base}/llms.txt`,
      `- OpenAPI: ${base}/openapi.json`,
      `- Sitemap: ${base}/sitemap.xml · Robots: ${base}/robots.txt`,
    ];
    return md(lines.join('\n'));
  }

  /* -------------------------------------------------------------- search */
  if (rest === '/cauta') {
    return md([
      `# Search catering companies — ${SITE_NAME}`,
      ``,
      `Use query parameters on this URL (HTML or Markdown):`,
      ``,
      `| param | meaning | example |`,
      `|---|---|---|`,
      `| q | free-text keyword | q=candy%20bar |`,
      `| city | city slug | city=chisinau |`,
      `| event | event-type slug | event=nunti |`,
      `| cuisine | cuisine slug | cuisine=moldoveneasca |`,
      `| dietary | repeatable dietary slug | dietary=vegetarian |`,
      `| pmin / pmax | price-from bounds in MDL | pmin=200&pmax=600 |`,
      `| guests | guest count the firm must cover | guests=100 |`,
      `| sort | relevance, price_asc, price_desc, rating, new | sort=rating |`,
      ``,
      `Example: ${L('/cauta')}?city=chisinau&event=nunti&guests=150`,
      ``,
      `City and category landing pages (recommended for agents): ${L('/catering-chisinau')}, ${L('/catering-nunti')}.`,
    ].join('\n'));
  }

  /* ------------------------------------------------- city / category page */
  if (rest.startsWith('/catering-')) {
    const slug = rest.slice('/catering-'.length);
    const city = await getCity(slug);
    const category = city ? null : await getCategory(slug);
    if (!city && (!category || category.kind !== 'event')) return notFound;
    const name = city ? pick(city, lang) : pick(category!, lang);
    const { items, total } = await searchFirms({ lang, city: city?.slug, event: category?.slug, perPage: 50 });
    const lines = [
      `# Catering ${name} — ${SITE_NAME}`,
      ``,
      `${total} approved company${total === 1 ? '' : 's'} listed.`,
      ``,
    ];
    for (const f of items) {
      lines.push(`## [${f.name}](${L(`/firma/${f.slug}`)})`);
      lines.push(`- city: ${f.city || '—'} · guests: ${guestRange(f.min_guests, f.max_guests, lang) || '—'}`);
      lines.push(`- price from: ${f.price_from ? money(f.price_from, f.currency || 'MDL') + '/person' : 'on request'} · verified: ${f.verified ? 'yes' : 'no'} · rating: ${f.rating_avg || '—'} (${f.rating_count || 0} reviews)`);
      lines.push(`- phone: ${f.phone || '—'} · e-mail: ${f.email || '—'} · site: ${f.website || '—'}`);
      lines.push(``);
    }
    return md(lines.join('\n'));
  }

  /* --------------------------------------------------------- firm profile */
  if (rest.startsWith('/firma/')) {
    const slug = rest.slice('/firma/'.length);
    const firm = await getFirmBySlug(slug);
    if (!firm) return notFound;
    const services = await getFirmServices(firm.id, true);
    const city = await getCity(firm.city || '');
    const lines = [
      `# ${firm.name} — catering ${city ? pick(city, lang) : ''} | ${SITE_NAME}`,
      ``,
      firm.tagline_ro || firm.description_ro || '',
      ``,
      `- status: approved & published · verified: ${firm.verified ? 'yes' : 'no'}`,
      `- city: ${firm.city || '—'}${firm.address ? ` · address: ${firm.address}` : ''}`,
      `- phone: ${firm.phone || '—'} · WhatsApp: ${firm.whatsapp || '—'} · e-mail: ${firm.email || '—'} · website: ${firm.website || '—'}`,
      `- price from: ${firm.price_from ? money(firm.price_from, firm.currency || 'MDL') + '/person' : 'on request'} · guests: ${guestRange(firm.min_guests, firm.max_guests, lang) || '—'}`,
      `- rating: ${firm.rating_avg || '—'} from ${firm.rating_count || 0} approved reviews`,
      ``,
      `## Services (${services.length})`,
      ...services.map(
        (s) => `- ${(lang === 'ru' ? s.title_ru : s.title_ro) || s.title_ro}${s.price ? ` — ${money(s.price, firm.currency || 'MDL')} ${s.price_type === 'per_person' ? '/person' : s.price_type === 'per_event' ? '/event' : `(${s.price_type})`}` : ' — price on request'}`,
      ),
      ``,
      `Human page: ${L(`/firma/${firm.slug}`)}`,
    ];
    return md(lines.filter((l) => l !== null).join('\n'));
  }

  /* --------------------------------------------------------- static pages */
  const staticMap: Record<string, 'about' | 'privacy' | 'terms'> = {
    '/despre': 'about',
    '/confidentialitate': 'privacy',
    '/termeni': 'terms',
  };
  if (staticMap[rest]) {
    const page = staticPages[staticMap[rest]][lang] ?? staticPages[staticMap[rest]].ro;
    const lines = [`# ${page.title} — ${SITE_NAME}`, ``];
    for (const b of page.blocks) {
      if (b.h) lines.push(`## ${b.h}`, ``);
      for (const p of b.p ?? []) lines.push(p, ``);
      for (const li of b.list ?? []) lines.push(`- ${li}`);
      if (b.list?.length) lines.push(``);
    }
    return md(lines.join('\n'));
  }

  return notFound;
}
