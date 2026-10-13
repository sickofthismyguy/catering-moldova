import type { Metadata } from 'next';
import { LOCALE_TAG } from './i18n';
import { siteUrl, SITE_NAME } from './config';
import type { City, Firm, Lang, Review, Service } from './types';
import { money, truncate } from './format';

/* ------------------------------------------------------------------ metadata */
interface MetaInput {
  lang: Lang;
  title: string;
  description: string;
  /** path WITHOUT the language prefix, e.g. "/firma/casa-bucatelor" */
  path: string;
  image?: string | null;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export function buildMetadata({ lang, title, description, path, image, noindex, type = 'website' }: MetaInput): Metadata {
  const base = siteUrl();
  const canonical = `${base}/${lang}${path === '/' ? '' : path}`;
  const languages: Record<string, string> = {};
  for (const l of ['ro', 'ru', 'en'] as Lang[]) {
    languages[LOCALE_TAG[l]] = `${base}/${l}${path === '/' ? '' : path}`;
  }
  languages['x-default'] = `${base}/ro${path === '/' ? '' : path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${base}${image}`) : `${base}/img/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type,
      locale: LOCALE_TAG[lang],
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

/** "Catering în {City}" — the SEO title template for city pages. */
export function cityPageTitle(cityName: string, lang: Lang, site: string = SITE_NAME): string {
  if (lang === 'ru') return `Кейтеринг ${cityName} — компании и цены | ${site}`;
  if (lang === 'en') return `Catering in ${cityName} — companies and prices | ${site}`;
  return `Catering ${cityName} — firme, meniuri și prețuri | ${site}`;
}

/** "{Firm Name} – Catering în {City} | Catering Moldova" */
export function firmSeoTitle(firm: Firm, cityName: string, template: string, site: string = SITE_NAME): string {
  const tpl = template || '{firm} – Catering în {city} | {site}';
  return tpl
    .replaceAll('{firm}', firm.seo_title?.trim() || firm.name)
    .replaceAll('{city}', cityName)
    .replaceAll('{site}', site)
    .slice(0, 70);
}

export function firmSeoDescription(firm: Firm, cityName: string, lang: Lang): string {
  const custom = lang === 'ru' ? firm.seo_description_ru : lang === 'en' ? null : firm.seo_description_ro;
  if (custom?.trim()) return truncate(custom.trim(), 160);
  const base = lang === 'ru' ? firm.description_ru : lang === 'en' ? firm.description_ro : firm.description_ro;
  const price = firm.price_from ? ` от ${money(firm.price_from, firm.currency || 'MDL')} за человека.` : '';
  const priceRo = firm.price_from ? `, prețuri de la ${money(firm.price_from, firm.currency || 'MDL')} de persoană.` : '';
  if (lang === 'ru') return truncate(`${(base || `Кейтеринговая компания в ${cityName}.`).trim()}${price}`, 160);
  return truncate(`${(base || `Firmă de catering în ${cityName}.`).trim()}${priceRo}`, 160);
}

/* ------------------------------------------------------------------- JSON-LD */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify({ '@context': 'https://schema.org', ...data }, null, 0);
}

export function websiteJsonLd(lang: Lang, base: string) {
  return jsonLd({
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: SITE_NAME,
    url: base,
    inLanguage: LOCALE_TAG[lang],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${base}/${lang}/cauta?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: base },
  });
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return jsonLd({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  });
}

export function faqJsonLd(faq: { q: string; a: string }[], lang: Lang, url: string) {
  return jsonLd({
    '@type': 'FAQPage',
    inLanguage: LOCALE_TAG[lang],
    url,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

export function itemListJsonLd(items: { name: string; url: string }[], lang: Lang, url: string) {
  return jsonLd({
    '@type': 'ItemList',
    inLanguage: LOCALE_TAG[lang],
    url,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  });
}

export function firmJsonLd(opts: {
  firm: Firm;
  cityName: string;
  city: City | null;
  url: string;
  services: Service[];
  reviews: Review[];
  lang: Lang;
}) {
  const { firm, cityName, city, url, services, reviews, lang } = opts;
  const base = siteUrl();
  const approved = reviews.filter((r) => r.status === 'approved');
  const avg = approved.length
    ? Number((approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(2))
    : Number(firm.rating_avg ?? 0);
  const count = approved.length || Number(firm.rating_count ?? 0);

  const node: Record<string, unknown> = {
    '@type': ['LocalBusiness', 'CateringService', 'FoodService'],
    '@id': `${url}#business`,
    name: firm.name,
    url,
    image: (firm.gallery?.[0] || firm.logo_url || `${base}/img/og-default.png`) as string,
    logo: firm.logo_url || undefined,
    description: truncate((lang === 'ru' ? firm.description_ru : firm.description_ro) || firm.name, 300),
    telephone: firm.phone || undefined,
    email: firm.email || undefined,
    priceRange: firm.price_from ? `${money(firm.price_from, firm.currency || 'MDL')}+` : undefined,
    currenciesAccepted: firm.currency || 'MDL',
    address: {
      '@type': 'PostalAddress',
      streetAddress: firm.address || undefined,
      addressLocality: cityName || undefined,
      addressRegion: firm.region || undefined,
      addressCountry: 'MD',
    },
    geo:
      firm.map_lat && firm.map_lng
        ? { '@type': 'GeoCoordinates', latitude: firm.map_lat, longitude: firm.map_lng }
        : city?.lat && city?.lng
          ? { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng }
          : undefined,
    areaServed: { '@type': 'City', name: cityName || undefined },
    knowsLanguage: ['ro-MD', 'ru-MD'],
    hasOfferCatalog: services.length
      ? {
          '@type': 'OfferCatalog',
          name: lang === 'ru' ? 'Услуги кейтеринга' : 'Servicii catering',
          itemListElement: services.slice(0, 20).map((s) => ({
            '@type': 'Offer',
            name: (lang === 'ru' ? s.title_ru : s.title_ro) || s.title_ro,
            description: truncate((lang === 'ru' ? s.description_ru : s.description_ro) || '', 200) || undefined,
            priceCurrency: firm.currency || 'MDL',
            price: s.price ?? undefined,
            itemOffered: { '@type': 'Service', name: (lang === 'ru' ? s.title_ru : s.title_ro) || s.title_ro },
          })),
        }
      : undefined,
  };

  // AggregateRating is emitted ONLY when at least one approved review exists.
  if (count > 0 && avg > 0) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    };
    node.review = approved.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author_name },
      datePublished: (r.created_at || '').slice(0, 10) || undefined,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      name: r.title || undefined,
      reviewBody: truncate(r.body || '', 300) || undefined,
    }));
  }

  return jsonLd(node);
}
