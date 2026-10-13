import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, CATEGORY_ICON } from '@/components/Icons';
import { SearchBar } from '@/components/SearchBar';
import { FirmCard } from '@/components/FirmCard';
import { buildMetadata } from '@/lib/seo';
import { getCategories, getCities, getFeaturedFirms, getFirmCountsByCity, getPublicStats, getSettings } from '@/lib/data';
import { pick } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const titles: Record<Lang, string> = {
    ro: 'Catering Moldova — firme, meniuri și prețuri pentru evenimentul tău',
    ru: 'Кейтеринг в Молдове — компании, меню и цены для вашего события',
    en: 'Catering Moldova — companies, menus and prices for your event',
  };
  const settings = await getSettings();
  const description =
    l === 'ru' ? settings.seo_description_ru : l === 'en' ? settings.seo_description_en : settings.seo_description_ro;
  return buildMetadata({ lang: l, title: titles[l], description, path: '/' });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const L = (p: string) => `/${l}${p}`;

  const [settings, cities, events, featured, stats, counts] = await Promise.all([
    getSettings(),
    getCities(),
    getCategories('event'),
    getFeaturedFirms(6),
    getPublicStats(),
    getFirmCountsByCity(),
  ]);
  const cityMap = Object.fromEntries(cities.map((c) => [c.slug, c]));

  const heroTitle =
    (l === 'ru' ? settings.hero_title_ru : l === 'ro' ? settings.hero_title_ro : '') || t(l, 'hero_h1');
  const heroSub =
    (l === 'ru' ? settings.hero_subtitle_ru : l === 'ro' ? settings.hero_subtitle_ro : '') || t(l, 'hero_p');

  const quickEvents = events.slice(0, 6);
  const popularCities = cities.slice(0, 8);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero">
        <div className="container">
          <h1>{heroTitle}</h1>
          <p className="mt-3">{heroSub}</p>

          <div className="mt-5">
            <SearchBar lang={l} cities={cities} events={events} action={L('/cauta')} />
          </div>

          <div className="chips mt-4" aria-label={t(l, 'events_title')}>
            {quickEvents.map((e) => (
              <Link key={e.slug} className="chip" href={L(`/catering-${e.slug}`)}>
                <Icon name={CATEGORY_ICON[e.slug] || 'sparkle'} size={14} /> {pick(e, l)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- stats */}
      <section className="section-tight" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="stats-strip">
            <div className="stat"><b>{stats.firms}</b><span>{t(l, 'stat_firms')}</span></div>
            <div className="stat"><b>{stats.cities}</b><span>{t(l, 'stat_cities')}</span></div>
            <div className="stat"><b>{stats.services}</b><span>{t(l, 'stat_services')}</span></div>
            <div className="stat"><b>0 MDL</b><span>{t(l, 'stat_free')}</span></div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- featured firms */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t(l, 'featured_title')}</h2>
              <p>{t(l, 'featured_subtitle')}</p>
            </div>
            <Link className="more" href={L('/cauta')}>{t(l, 'view_all_firms')} →</Link>
          </div>

          {featured.length ? (
            <div className="grid grid-3">
              {featured.map((f) => (
                <FirmCard key={f.id} firm={f} lang={l} cityName={f.city ? pick(cityMap[f.city], l) : undefined} />
              ))}
            </div>
          ) : (
            <div className="empty card">
              <h3>{t(l, 'no_results')}</h3>
              <p>{t(l, 'firms_cta_p')}</p>
              <Link className="btn btn-primary mt-4" href={L('/adauga-firma')}>{t(l, 'firms_cta_btn')}</Link>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- how it works */}
      <section className="section" style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-head"><h2>{t(l, 'how_title')}</h2></div>
          <div className="steps">
            {[
              { t: t(l, 'how_1_t'), p: t(l, 'how_1_p'), i: 'search' },
              { t: t(l, 'how_2_t'), p: t(l, 'how_2_p'), i: 'list' },
              { t: t(l, 'how_3_t'), p: t(l, 'how_3_p'), i: 'mail' },
            ].map((s) => (
              <div className="step" key={s.t}>
                <span className="ico" style={{ color: 'var(--accent-strong)', marginBottom: 10, display: 'block' }}>
                  <Icon name={s.i} size={22} />
                </span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- event types */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t(l, 'events_title')}</h2>
              <p>{t(l, 'events_subtitle')}</p>
            </div>
          </div>
          <div className="grid grid-3">
            {events.slice(0, 9).map((e) => (
              <Link className="event-tile" key={e.slug} href={L(`/catering-${e.slug}`)}>
                <span className="ico" aria-hidden="true"><Icon name={CATEGORY_ICON[e.slug] || 'sparkle'} size={20} /></span>
                <span>
                  <b>{pick(e, l)}</b>
                  <span className="tiny muted">{(l === 'ru' ? e.description_ru : e.description_ro) || ''}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- popular cities */}
      <section className="section-tight">
        <div className="container">
          <div className="section-head">
            <h2>{t(l, 'popular_cities')}</h2>
            <Link className="more" href={L('/cauta')}>{t(l, 'c_see_all')} →</Link>
          </div>
          <div className="grid grid-4">
            {popularCities.map((c) => (
              <Link className="city-tile" key={c.slug} href={L(`/catering-${c.slug}`)}>
                <b>{pick(c, l)}</b>
                <span>
                  {counts[c.slug] ? `${counts[c.slug]} ${t(l, 'stat_firms')}` : (l === 'ru' ? c.region_ru : c.region_ro) || ''}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA band */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="row-between">
              <div>
                <h2>{t(l, 'firms_cta_title')}</h2>
                <p className="mt-2">{t(l, 'firms_cta_p')}</p>
              </div>
              <div className="btn-row">
                <Link className="btn btn-primary btn-lg" href={L('/cont/inregistrare')}>{t(l, 'firms_cta_btn')}</Link>
                <Link className="btn btn-outline btn-lg" href={L('/adauga-firma')}>{t(l, 'c_read_more')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
