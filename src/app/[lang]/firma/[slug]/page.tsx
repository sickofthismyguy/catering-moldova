import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FirmCard } from '@/components/FirmCard';
import { Gallery } from '@/components/Gallery';
import { Icon } from '@/components/Icons';
import { InquiryForm } from '@/components/InquiryForm';
import { ReviewForm } from '@/components/ReviewForm';
import { FavoriteButton } from '@/components/FavoriteButton';
import { MapEmbed } from '@/components/MapEmbed';
import { Stars, VerifiedBadge } from '@/components/Stars';
import { JsonLd } from '@/components/JsonLd';
import { ViewTracker } from '@/components/ViewTracker';
import {
  getCity, getCityMap, getFirmBySlug, getFirmReviews, getFirmServices, getPublicFirmSlugs,
  getSettings, getSimilarFirms, getTaxonomyMap, getCategories,
} from '@/lib/data';
import { formatDate, guestRange, initials, mailHref, money, pick, pickText, telHref, truncate, waHref } from '@/lib/format';
import { buildMetadata, breadcrumbJsonLd, firmJsonLd, firmSeoDescription, firmSeoTitle } from '@/lib/seo';
import { DB_READY, siteUrl } from '@/lib/config';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPublicFirmSlugs();
  return (['ro', 'ru', 'en'] as Lang[]).flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const [firm, settings, cityMap] = await Promise.all([getFirmBySlug(slug), getSettings(), getCityMap()]);
  if (!firm) return buildMetadata({ lang: l, title: 'Firma nu a fost găsită', description: '', path: `/firma/${slug}`, noindex: true });
  const cityName = firm.city ? pick(cityMap[firm.city], l) : '';
  return buildMetadata({
    lang: l,
    title: firmSeoTitle(firm, cityName, settings.seo_title_template),
    description: firmSeoDescription(firm, cityName, l),
    path: `/firma/${slug}`,
    image: firm.gallery?.[0] || firm.logo_url || null,
    type: 'article',
  });
}

export default async function FirmPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const L = (p: string) => `/${l}${p}`;

  const firm = await getFirmBySlug(slug);
  if (!firm) notFound();

  const [settings, services, reviews, cityMap, taxMap, categories, city, similar] = await Promise.all([
    getSettings(),
    getFirmServices(firm.id, true),
    getFirmReviews(firm.id),
    getCityMap(),
    getTaxonomyMap(),
    getCategories('service'),
    getCity(firm.city || ''),
    getSimilarFirms(firm.city, firm.id, 3),
  ]);

  const cityName = firm.city ? pick(cityMap[firm.city], l) : '';
  const description = pickText(firm as unknown as Record<string, unknown>, l, 'description');
  const tagline = pickText(firm as unknown as Record<string, unknown>, l, 'tagline');
  const url = `${siteUrl()}/${l}/firma/${firm.slug}`;
  const gallery = (firm.gallery || []).filter(Boolean).slice(0, 8);
  const lat = Number(firm.map_lat ?? city?.lat ?? 47.0105);
  const lng = Number(firm.map_lng ?? city?.lng ?? 28.8638);
  const waMessage = l === 'ru' ? `Здравствуйте! Нашли вас на Catering Moldova. Интересует кейтеринг…` : `Bună ziua! V-am găsit pe Catering Moldova. Mă interesează un meniu de catering…`;

  const eventName = (slugKey?: string | null) => (slugKey ? pick(categories.find((c) => c.slug === slugKey) as never, l) || slugKey : '');
  const taxName = (slugKey?: string | null) => (slugKey ? pick(taxMap[slugKey] as never, l) || slugKey : '');

  return (
    <div className="container section">
      <ViewTracker slug={firm.slug} />

      <Breadcrumbs
        items={[
          { name: t(l, 'c_home'), href: L('/') },
          ...(firm.city ? [{ name: `${l === 'ru' ? 'Кейтеринг ' : 'Catering '}${cityName}`, href: L(`/catering-${firm.city}`) }] : []),
          { name: firm.name },
        ]}
      />

      {/* ---------------------------------------------------------- header */}
      <header className="firm-head">
        <div className="avatar avatar-lg" aria-hidden="true">
          {firm.logo_url ? (
            <Image src={firm.logo_url} alt="" width={72} height={72} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          ) : (
            initials(firm.name)
          )}
        </div>

        <div className="firm-head-main">
          <h1 style={{ fontSize: 'clamp(1.5rem,4.4vw,2.1rem)' }}>{firm.name}</h1>
          {tagline ? <p className="muted mt-2">{tagline}</p> : null}

          <div className="firm-card-meta mt-3">
            {Number(firm.rating_avg) > 0 ? <Stars value={Number(firm.rating_avg)} count={Number(firm.rating_count) || undefined} /> : null}
            {firm.verified ? <VerifiedBadge label={t(l, 'firm_verified')} /> : null}
            {cityName ? <span><Icon name="pin" size={14} className="ico-inline" /> {cityName}{firm.region ? `, ${firm.region}` : ''}</span> : null}
            {firm.price_from ? <span className="price-tag">{t(l, 'price_from')} {money(firm.price_from, firm.currency || 'MDL')}</span> : null}
          </div>
        </div>

        <div className="firm-head-actions">
          {firm.phone ? (
            <a className="btn btn-primary" href={telHref(firm.phone)} rel="nofollow">
              <Icon name="phone" size={17} /> {t(l, 'firm_phone')}
            </a>
          ) : null}
          {firm.whatsapp ? (
            <a className="btn btn-outline" href={waHref(firm.whatsapp, waMessage)} target="_blank" rel="noopener nofollow">
              <Icon name="whatsapp" size={17} /> WhatsApp
            </a>
          ) : null}
          <FavoriteButton slug={firm.slug} lang={l} />
        </div>
      </header>

      {/* --------------------------------------------------------- gallery */}
      {gallery.length ? (
        <section className="mt-5" aria-label={t(l, 'firm_gallery')}>
          <Gallery images={gallery} alt={firm.name} />
        </section>
      ) : null}

      {/* ----------------------------------------------------------- body */}
      <div className="firm-layout mt-6">
        <div>
          {(firm.min_guests || firm.max_guests || firm.cuisines?.length || firm.event_types?.length) ? (
            <section className="card mb-4" aria-label={t(l, 'prof_details')}>
              <div className="facts">
                {firm.price_from ? (
                  <div className="fact"><b>{t(l, 'firm_price_from')}</b><span>{money(firm.price_from, firm.currency || 'MDL')}</span></div>
                ) : null}
                {(firm.min_guests || firm.max_guests) ? (
                  <div className="fact"><b>{t(l, 'firm_guests')}</b><span>{guestRange(firm.min_guests, firm.max_guests, l)}</span></div>
                ) : null}
                {firm.city ? <div className="fact"><b>{t(l, 'city_label')}</b><span>{cityName}</span></div> : null}
                {firm.cuisines?.length ? (
                  <div className="fact" style={{ gridColumn: 'span 2' }}>
                    <b>{t(l, 'firm_cuisines')}</b>
                    <span>{firm.cuisines.map((c) => taxName(c)).filter(Boolean).join(', ')}</span>
                  </div>
                ) : null}
                {firm.event_types?.length ? (
                  <div className="fact" style={{ gridColumn: 'span 2' }}>
                    <b>{t(l, 'firm_events')}</b>
                    <span>
                      {firm.event_types.map((e) => (
                        <Link key={e} href={L(`/catering-${e}`)} style={{ marginRight: 8 }}>{eventName(e)}</Link>
                      ))}
                    </span>
                  </div>
                ) : null}
                {firm.dietary?.length ? (
                  <div className="fact" style={{ gridColumn: 'span 2' }}>
                    <b>{t(l, 'firm_dietary')}</b>
                    <span>
                      {firm.dietary.map((d) => <span className="tag" key={d} style={{ marginRight: 6 }}>{taxName(d)}</span>)}
                    </span>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className="card mb-4">
            <h2 style={{ fontSize: '1.2rem' }}>{t(l, 'firm_about')}</h2>
            <div className="prose mt-3">
              {(description || '').split(/\n{2,}|\r\n\r\n/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
              {!description ? <p className="muted">{truncate(tagline || firm.name, 200)}</p> : null}
            </div>
            {firm.updated_at ? <p className="tiny muted mt-4">{t(l, 'firm_updated')}: {formatDate(firm.updated_at, l)}</p> : null}
          </section>

          <section className="card mb-4" id="servicii">
            <h2 style={{ fontSize: '1.2rem' }}>{t(l, 'firm_services')}</h2>
            {services.length ? (
              <div className="mt-2">
                {services.map((s) => {
                  const title = pickText(s as unknown as Record<string, unknown>, l, 'title') || s.title_ro;
                  const desc = pickText(s as unknown as Record<string, unknown>, l, 'description');
                  return (
                    <div className="service-item" key={s.id}>
                      {s.image_url ? (
                        <div className="service-thumb">
                          <Image src={s.image_url} alt={title} width={184} height={148} loading="lazy" decoding="async" />
                        </div>
                      ) : null}
                      <div className="service-body">
                        <h3>{title}</h3>
                        {desc ? <p>{truncate(desc, 180)}</p> : null}
                        {s.category ? <span className="tag mt-2">{eventName(s.category) || s.category}</span> : null}
                      </div>
                      <div className="service-price">
                        {s.price ? (
                          <span className="price-tag">
                            {money(s.price, firm.currency || 'MDL')}
                            <small>
                              {s.price_type === 'per_person' ? t(l, 'pt_per_person')
                                : s.price_type === 'per_event' ? t(l, 'pt_per_event')
                                : s.price_type === 'per_hour' ? t(l, 'pt_per_hour')
                                : s.price_type === 'on_request' ? t(l, 'pt_on_request')
                                : (s.unit || t(l, 'pt_fixed'))}
                            </small>
                          </span>
                        ) : (
                          <span className="muted small">{t(l, 'pt_on_request')}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="muted mt-3">{t(l, 'firm_no_services')}</p>
            )}
          </section>

          {settings.reviews_enabled ? (
            <section className="card" id="recenzii">
              <div className="row-between mb-3">
                <h2 style={{ fontSize: '1.2rem' }}>{t(l, 'firm_reviews')}</h2>
                {Number(firm.rating_avg) > 0 ? <Stars value={Number(firm.rating_avg)} count={Number(firm.rating_count) || undefined} size={18} /> : null}
              </div>

              {reviews.length ? (
                <div>
                  {reviews.map((r) => (
                    <article className="review" key={r.id}>
                      <div className="review-head">
                        <span className="review-author">{r.author_name}</span>
                        <Stars value={r.rating} />
                        <span className="tiny muted">{formatDate(r.created_at, l)}</span>
                      </div>
                      {r.title ? <p className="strong small">{r.title}</p> : null}
                      {r.body ? <p className="muted small mt-2">{r.body}</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="muted">{t(l, 'firm_no_reviews')}</p>
              )}

              {DB_READY ? (
                <div className="mt-5">
                  <ReviewForm firmId={firm.id} lang={l} />
                </div>
              ) : null}
            </section>
          ) : null}
        </div>

        {/* ---------------------------------------------------------- aside */}
        <aside>
          <div className="aside-sticky stack">
            <section className="card" id="contact">
              <h2 style={{ fontSize: '1.1rem' }}>{t(l, 'firm_contacts')}</h2>
              <ul className="contact-list mt-3">
                {firm.phone ? (
                  <li>
                    <span className="ico"><Icon name="phone" size={18} /></span>
                    <span><b>{t(l, 'firm_phone')}</b><a href={telHref(firm.phone)} rel="nofollow">{firm.phone}</a></span>
                  </li>
                ) : null}
                {firm.whatsapp ? (
                  <li>
                    <span className="ico"><Icon name="whatsapp" size={18} /></span>
                    <span><b>{t(l, 'firm_whatsapp')}</b>
                      <a href={waHref(firm.whatsapp, waMessage)} target="_blank" rel="noopener nofollow">{firm.whatsapp}</a>
                    </span>
                  </li>
                ) : null}
                {firm.email ? (
                  <li>
                    <span className="ico"><Icon name="mail" size={18} /></span>
                    <span><b>{t(l, 'firm_email')}</b><a href={mailHref(firm.email)} rel="nofollow">{firm.email}</a></span>
                  </li>
                ) : null}
                {firm.website ? (
                  <li>
                    <span className="ico"><Icon name="globe" size={18} /></span>
                    <span><b>{t(l, 'firm_website')}</b>
                      <a href={firm.website.startsWith('http') ? firm.website : `https://${firm.website}`} target="_blank" rel="noopener nofollow ugc">
                        {firm.website.replace(/^https?:\/\//, '')}
                      </a>
                    </span>
                  </li>
                ) : null}
                {firm.address ? (
                  <li>
                    <span className="ico"><Icon name="pin" size={18} /></span>
                    <span><b>{t(l, 'firm_address')}</b>{firm.address}</span>
                  </li>
                ) : null}
              </ul>

              {settings.inquiries_enabled && DB_READY ? (
                <div className="mt-5">
                  <h3 className="mb-3">{t(l, 'firm_inquiry')}</h3>
                  <p className="tiny muted mb-4">{t(l, 'firm_inquiry_p')}</p>
                  <InquiryForm firmId={firm.id} firmName={firm.name} lang={l} emailTo={firm.email || undefined} />
                </div>
              ) : (
                <div className="alert alert-info mt-5 small">
                  {firm.phone ? (
                    <>{t(l, 'firm_inquiry')}: <a href={telHref(firm.phone)}>{firm.phone}</a></>
                  ) : (
                    t(l, 'firm_not_published')
                  )}
                </div>
              )}
            </section>

            <section className="card" aria-label={t(l, 'firm_map')}>
              <h2 style={{ fontSize: '1.1rem' }}>{t(l, 'firm_map')}</h2>
              <div className="mt-3">
                <MapEmbed lat={lat} lng={lng} lang={l} label={cityName || firm.name} />
              </div>
              <p className="tiny muted mt-3">
                {firm.address || cityName} · <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`} target="_blank" rel="noopener nofollow">OpenStreetMap</a>
              </p>
            </section>
          </div>
        </aside>
      </div>

      {similar.length ? (
        <section className="section-tight">
          <div className="section-head">
            <h2 style={{ fontSize: '1.25rem' }}>{t(l, 'firm_similar')}</h2>
            <Link className="more" href={`${L('/cauta')}${firm.city ? `?city=${firm.city}` : ''}`}>{t(l, 'c_see_all')} →</Link>
          </div>
          <div className="grid-auto">
            {similar.map((f) => (
              <FirmCard key={f.id} firm={f} lang={l} cityName={cityName} />
            ))}
          </div>
        </section>
      ) : null}

      <JsonLd
        data={firmJsonLd({ firm, cityName, city, url, services, reviews, lang: l })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t(l, 'c_home'), url: `${siteUrl()}/${l}` },
          ...(firm.city ? [{ name: `${l === 'ru' ? 'Кейтеринг ' : 'Catering '}${cityName}`, url: `${siteUrl()}/${l}/catering-${firm.city}` }] : []),
          { name: firm.name, url },
        ])}
      />
    </div>
  );
}
