import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirmCard } from '@/components/FirmCard';
import { Filters } from '@/components/Filters';
import { Pager } from '@/components/Pager';
import { Icon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { getFilterData, searchFirms } from '@/lib/data';
import { PAGE_SIZE, clampInt, pick } from '@/lib/format';
import { buildMetadata, itemListJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/config';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 300;

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}
function all(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return (Array.isArray(v) ? v : [v]).map((s) => s.trim()).filter(Boolean);
}

function parse(sp: SP) {
  const dietary = all(sp.dietary).slice(0, 6);
  return {
    q: (first(sp.q) || '').slice(0, 80).trim(),
    city: (first(sp.city) || '').slice(0, 40).trim(),
    event: (first(sp.event) || '').slice(0, 40).trim(),
    cuisine: (first(sp.cuisine) || '').slice(0, 40).trim(),
    dietary,
    priceMin: clampInt(first(sp.pmin), 0, 1000000),
    priceMax: clampInt(first(sp.pmax), 0, 1000000),
    guests: clampInt(first(sp.guests), 1, 20000),
    sort: (['relevance', 'price_asc', 'price_desc', 'rating', 'new'].includes(first(sp.sort) || '') ? first(sp.sort) : 'relevance') as
      | 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'new',
    page: clampInt(first(sp.page), 1, 500, 1) ?? 1,
  };
}

function canonicalQuery(p: ReturnType<typeof parse>): string {
  const params = new URLSearchParams();
  if (p.q) params.set('q', p.q);
  if (p.city) params.set('city', p.city);
  if (p.event) params.set('event', p.event);
  if (p.cuisine) params.set('cuisine', p.cuisine);
  for (const d of p.dietary) params.append('dietary', d);
  if (p.priceMin !== undefined) params.set('pmin', String(p.priceMin));
  if (p.priceMax !== undefined) params.set('pmax', String(p.priceMax));
  if (p.guests !== undefined) params.set('guests', String(p.guests));
  if (p.sort !== 'relevance') params.set('sort', p.sort);
  if (p.page > 1) params.set('page', String(p.page));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;
  const l = lang as Lang;
  const p = parse(sp);
  const filters = await getFilterData();
  const cityName = p.city ? pick(filters.cities.find((c) => c.slug === p.city) as never, l) : '';
  const eventName = p.event ? pick(filters.events.find((c) => c.slug === p.event) as never, l) : '';
  const parts = [cityName, eventName].filter(Boolean).join(' · ');
  const base = p.q
    ? `${t(l, 'search_title')}: ${p.q}`
    : parts
      ? `${t(l, 'search_title')} — ${parts}`
      : t(l, 'search_title');
  return {
    ...buildMetadata({
      lang: l,
      title: `${base} | Catering Moldova`,
      description: t(l, 'hero_p'),
      path: `/cauta${canonicalQuery(p)}`,
      noindex: Boolean(p.q) || p.page > 1,
    }),
    alternates: {
      canonical: `${siteUrl()}/${l}/cauta${canonicalQuery(p)}`,
    },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SP>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const l = lang as Lang;
  const L = (p: string) => `/${l}${p}`;
  const p = parse(sp);

  const [filters, result] = await Promise.all([
    getFilterData(),
    searchFirms({ lang: l, ...p, perPage: PAGE_SIZE }),
  ]);

  const cityMap = Object.fromEntries(filters.cities.map((c) => [c.slug, c]));
  const basePath = L('/cauta');
  const total = result.total;

  // Active filter chips (removable)
  const activeChips: { label: string; href: string }[] = [];
  const without = (key: string) => {
    const next = new URLSearchParams(canonicalQuery(p).replace('?', ''));
    next.delete(key);
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  if (p.city && cityMap[p.city]) activeChips.push({ label: pick(cityMap[p.city], l), href: without('city') });
  const ev = filters.events.find((e) => e.slug === p.event);
  if (ev) activeChips.push({ label: pick(ev, l), href: without('event') });
  const cu = filters.cuisines.find((c) => c.slug === p.cuisine);
  if (cu) activeChips.push({ label: pick(cu, l), href: without('cuisine') });
  for (const d of p.dietary) {
    const row = filters.dietary.find((x) => x.slug === d);
    if (!row) continue;
    const next = new URLSearchParams(canonicalQuery(p).replace('?', ''));
    next.delete('dietary');
    for (const x of p.dietary) if (x !== d) next.append('dietary', x);
    const qs = next.toString();
    activeChips.push({ label: pick(row, l), href: qs ? `${basePath}?${qs}` : basePath });
  }
  if (p.guests) activeChips.push({ label: `${p.guests} ${t(l, 'c_guests')}`, href: without('guests') });
  if (p.priceMin !== undefined || p.priceMax !== undefined) {
    const next = new URLSearchParams(canonicalQuery(p).replace('?', ''));
    next.delete('pmin');
    next.delete('pmax');
    const qs = next.toString();
    activeChips.push({
      label: `${p.priceMin ?? 0}–${p.priceMax ?? '∞'} MDL`,
      href: qs ? `${basePath}?${qs}` : basePath,
    });
  }

  const sortOptions: { value: string; label: string }[] = [
    { value: 'relevance', label: t(l, 'sort_relevance') },
    { value: 'price_asc', label: t(l, 'sort_price_asc') },
    { value: 'price_desc', label: t(l, 'sort_price_desc') },
    { value: 'rating', label: t(l, 'sort_rating') },
    { value: 'new', label: t(l, 'sort_new') },
  ];

  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: t(l, 'c_home'), href: L('/') }, { name: t(l, 'search_title') }]} />

      <h1>{p.q ? `${t(l, 'results_for')} „${p.q}”` : t(l, 'search_title')}</h1>
      <p className="muted mt-2" aria-live="polite">{t(l, 'results_count', { count: total })}</p>

      <div className="search-layout mt-5">
        <div>
          <Filters
            lang={l}
            cities={filters.cities}
            events={filters.events}
            cuisines={filters.cuisines}
            dietary={filters.dietary}
            value={p}
            basePath={basePath}
            resultCount={total}
          />
        </div>

        <div>
          <div className="results-head">
            <div className="chips">
              {activeChips.map((c) => (
                <Link key={c.label + c.href} className="chip" href={c.href} aria-label={`${t(l, 'reset_filters')}: ${c.label}`}>
                  {c.label} <Icon name="x" size={13} />
                </Link>
              ))}
            </div>

            <form className="sort-wrap" action={basePath} method="get">
              <label className="tiny muted nowrap" htmlFor="sort">{t(l, 'sort_label')}</label>
              <select className="select" id="sort" name="sort" defaultValue={p.sort}>
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {p.q ? <input type="hidden" name="q" value={p.q} /> : null}
              {p.city ? <input type="hidden" name="city" value={p.city} /> : null}
              {p.event ? <input type="hidden" name="event" value={p.event} /> : null}
              {p.cuisine ? <input type="hidden" name="cuisine" value={p.cuisine} /> : null}
              {p.dietary.map((d) => <input key={d} type="hidden" name="dietary" value={d} />)}
              {p.priceMin !== undefined ? <input type="hidden" name="pmin" value={p.priceMin} /> : null}
              {p.priceMax !== undefined ? <input type="hidden" name="pmax" value={p.priceMax} /> : null}
              {p.guests !== undefined ? <input type="hidden" name="guests" value={p.guests} /> : null}
              <button className="btn btn-outline btn-sm" type="submit">{t(l, 'c_apply')}</button>
            </form>
          </div>

          {result.items.length ? (
            <>
              <div className="grid grid-3">
                {result.items.map((f) => (
                  <FirmCard key={f.id} firm={f} lang={l} cityName={f.city ? pick(cityMap[f.city], l) : undefined} />
                ))}
              </div>
              <Pager page={p.page} total={total} basePath={basePath} query={sp} lang={l} />
            </>
          ) : (
            <div className="empty card">
              <h3>{t(l, 'no_results')}</h3>
              <p>{t(l, 'no_results_p')}</p>
              <Link className="btn btn-primary mt-4" href={basePath}>{t(l, 'reset_filters')}</Link>
            </div>
          )}
        </div>
      </div>

      <JsonLd
        data={itemListJsonLd(
          result.items.map((f) => ({ name: f.name, url: `${siteUrl()}/${l}/firma/${f.slug}` })),
          l,
          `${siteUrl()}/${l}/cauta${canonicalQuery(p)}`,
        )}
      />
    </div>
  );
}
