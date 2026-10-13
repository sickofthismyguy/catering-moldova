import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirmCard } from '@/components/FirmCard';
import { SearchBar } from '@/components/SearchBar';
import { Icon, CATEGORY_ICON } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { getCategories, getCategory, getCities, getCity, getFilterData, searchFirms } from '@/lib/data';
import { cityCopy, categoryCopy, type SeoCopy } from '@/lib/content';
import { pick } from '@/lib/format';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/config';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 900;
/** Only "/{lang}/catering-{slug}" URLs are handled by this route; everything
 *  else falls through to the 404 page. Static pages (despre, cauta, cont...)
 *  always win over this dynamic segment. */
function catalogSlug(raw: string | undefined): string {
  if (!raw || !raw.startsWith('catering-')) return '';
  return raw.slice('catering-'.length);
}


export async function generateStaticParams() {
  const [cities, cats] = await Promise.all([getCities(false), getCategories('event')]);
  const slugs = [...cities.map((c) => c.slug), ...cats.map((c) => c.slug)];
  return (['ro', 'ru', 'en'] as Lang[]).flatMap((lang) => slugs.map((slug) => ({ lang, slug: `catering-${slug}` })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug: rawSlug } = await params;
  const slug = catalogSlug(rawSlug);
  const l = lang as Lang;

  const city = await getCity(slug);
  if (city) {
    const copy = cityCopy(
      {
        slugKey: city.slug,
        name: city.name_ro || city.slug,
        nameRu: city.name_ru || city.name_ro || city.slug,
        region: city.region_ro || '',
        regionRu: city.region_ru || city.region_ro || '',
      },
      l === 'en' ? 'ro' : l,
      l === 'ru' ? city.seo_intro_ru : city.seo_intro_ro,
    );
    return buildMetadata({ lang: l, title: copy.title, description: copy.meta, path: `/catering-${slug}` });
  }

  const category = await getCategory(slug);
  if (category && category.kind === 'event') {
    const copy = categoryCopy(
      category.name_ro || slug,
      category.name_ru || category.name_ro || slug,
      slug,
      l === 'en' ? 'ro' : l,
      l === 'ru' ? category.description_ru : category.description_ro,
    );
    return buildMetadata({ lang: l, title: copy.title, description: copy.meta, path: `/catering-${slug}` });
  }

  return buildMetadata({ lang: l, title: '404', description: '', path: `/catering-${slug}`, noindex: true });
}

export default async function CatalogPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug: rawSlug } = await params;
  const slug = catalogSlug(rawSlug);
  if (!slug) notFound();
  const l = lang as Lang;
  const L = (p: string) => `/${l}${p}`;

  const city = await getCity(slug);
  const category = city ? null : await getCategory(slug);
  if (!city && (!category || category.kind !== 'event')) notFound();

  const [filters, result] = await Promise.all([
    getFilterData(),
    searchFirms({ lang: l, city: city?.slug, event: category?.slug, perPage: 12, sort: 'relevance' }),
  ]);

  const cityName = city ? pick(city, l) : '';
  const cityNameRu = city ? city.name_ru || city.name_ro || city.slug : '';
  const catName = category ? pick(category, l) : '';
  const catNameRu = category ? category.name_ru || category.name_ro || category.slug : '';

  const copy: SeoCopy = city
    ? cityCopy(
        {
          slugKey: city.slug,
          name: city.name_ro || city.slug,
          nameRu: cityNameRu,
          region: city.region_ro || '',
          regionRu: city.region_ru || city.region_ro || '',
        },
        l === 'en' ? 'ro' : l,
        l === 'ru' ? city.seo_intro_ru : city.seo_intro_ro,
      )
    : categoryCopy(category!.name_ro || slug, catNameRu, slug, l === 'en' ? 'ro' : l, l === 'ru' ? category!.description_ru : category!.description_ro);

  const h1 = city
    ? l === 'ru'
      ? `Кейтеринг ${cityName}`
      : l === 'en'
        ? `Catering in ${cityName}`
        : `Catering ${cityName}`
    : l === 'ru'
      ? `Кейтеринг: ${catName}`
      : l === 'en'
        ? `Catering for ${catName}`
        : `Catering ${catName.toLowerCase()}`;

  const cityMap = Object.fromEntries(filters.cities.map((c) => [c.slug, c]));
  const url = `${siteUrl()}/${l}/catering-${slug}`;
  const otherCities = filters.cities.filter((c) => c.slug !== slug).slice(0, 12);

  return (
    <div className="container section">
      <Breadcrumbs
        items={[
          { name: t(l, 'c_home'), href: L('/') },
          {
            name: city ? (l === 'ru' ? 'Города' : 'Orașe') : (l === 'ru' ? 'События' : 'Evenimente'),
            href: city ? L('/cauta') : L('/cauta'),
          },
          { name: h1 },
        ]}
      />

      <header>
        <h1>{h1}</h1>
        <p className="muted mt-2" style={{ maxWidth: '70ch' }}>{copy.meta}</p>
      </header>

      <div className="mt-5">
        <SearchBar lang={l} cities={filters.cities} events={filters.events} action={L('/cauta')} defaultCity={city?.slug} defaultEvent={category?.slug} compact />
      </div>

      <div className="chips mt-4">
        {city
          ? filters.events.slice(0, 8).map((e) => (
              <Link key={e.slug} className="chip" href={`${L('/cauta')}?city=${city.slug}&event=${e.slug}`}>
                <Icon name={CATEGORY_ICON[e.slug] || 'sparkle'} size={14} /> {pick(e, l)}
              </Link>
            ))
          : filters.cities.slice(0, 10).map((c) => (
              <Link key={c.slug} className="chip" href={`${L('/cauta')}?city=${c.slug}&event=${category!.slug}`}>
                <Icon name="pin" size={14} /> {pick(c, l)}
              </Link>
            ))}
      </div>

      <section className="mt-6" aria-live="polite">
        <div className="row-between mb-4">
          <h2 style={{ fontSize: '1.2rem' }}>
            {t(l, 'results_count', { count: result.total })}
          </h2>
          {result.total > 12 ? (
            <Link className="more small strong" href={`${L('/cauta')}?${city ? `city=${city.slug}` : `event=${category!.slug}`}`}>
              {t(l, 'c_see_all')} →
            </Link>
          ) : null}
        </div>

        {result.items.length ? (
          <div className="grid-auto">
            {result.items.map((f) => (
              <FirmCard key={f.id} firm={f} lang={l} cityName={f.city ? pick(cityMap[f.city], l) : undefined} />
            ))}
          </div>
        ) : (
          <div className="empty card">
            <h3>{t(l, 'no_results')}</h3>
            <p>{t(l, 'no_results_p')}</p>
            <Link className="btn btn-primary mt-4" href={L('/cauta')}>{t(l, 'search_title')}</Link>
          </div>
        )}
      </section>

      <section className="section-tight mt-5">
        <h2 style={{ fontSize: '1.25rem' }}>{l === 'ru' ? 'О выборе кейтеринга' : l === 'en' ? 'About catering here' : 'Despre catering'}</h2>
        <div className="prose mt-3">
          {copy.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="section-tight">
        <h2 style={{ fontSize: '1.25rem' }}>FAQ</h2>
        <div className="faq mt-3">
          {copy.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {city ? (
        <section className="section-tight">
          <h2 style={{ fontSize: '1.15rem' }}>{l === 'ru' ? 'Кейтеринг в других городах' : 'Catering în alte orașe'}</h2>
          <div className="chips mt-3">
            {otherCities.map((c) => (
              <Link key={c.slug} className="chip" href={L(`/catering-${c.slug}`)}>
                {l === 'ru' ? 'Кейтеринг ' : 'Catering '}{pick(c, l)}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="section-tight">
          <h2 style={{ fontSize: '1.15rem' }}>{l === 'ru' ? 'Другие типы событий' : 'Alte tipuri de evenimente'}</h2>
          <div className="chips mt-3">
            {filters.events.filter((e) => e.slug !== slug).map((e) => (
              <Link key={e.slug} className="chip" href={L(`/catering-${e.slug}`)}>{pick(e, l)}</Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd data={breadcrumbJsonLd([
        { name: t(l, 'c_home'), url: `${siteUrl()}/${l}` },
        { name: h1, url },
      ])} />
      <JsonLd data={faqJsonLd(copy.faq, l, url)} />
      <JsonLd
        data={itemListJsonLd(
          result.items.map((f) => ({ name: f.name, url: `${siteUrl()}/${l}/firma/${f.slug}` })),
          l,
          url,
        )}
      />
    </div>
  );
}
