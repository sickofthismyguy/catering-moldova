import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icons';
import { Stars, VerifiedBadge } from './Stars';
import { t } from '@/lib/i18n';
import { guestRange, initials, money, truncate, pickText } from '@/lib/format';
import type { Firm, Lang } from '@/lib/types';

export function FirmCard({ firm, lang, cityName }: { firm: Firm; lang: Lang; cityName?: string }) {
  const href = `/${lang}/firma/${firm.slug}`;
  const image = firm.gallery?.[0] || null;
  const tagline = pickText(firm as unknown as Record<string, unknown>, lang, 'tagline');
  const desc = tagline || pickText(firm as unknown as Record<string, unknown>, lang, 'description');

  return (
    <article className="firm-card">
      <div className="firm-card-media">
        {image ? (
          <Image
            src={image}
            alt={`${firm.name} — catering ${cityName || ''}`.trim()}
            fill
            sizes="(min-width: 1000px) 30vw, (min-width: 640px) 46vw, 100vw"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="logo-fallback" aria-hidden="true">{initials(firm.name)}</span>
        )}
        <div className="firm-card-badges">
          {firm.verified ? <VerifiedBadge label={t(lang, 'firm_verified')} /> : null}
          {firm.city ? <span className="badge badge-neutral"><Icon name="pin" size={11} /> {cityName || firm.city}</span> : null}
        </div>
      </div>

      <div className="firm-card-body">
        <h3 className="firm-card-title">
          <Link href={href}>{firm.name}</Link>
        </h3>

        <div className="firm-card-meta">
          {Number(firm.rating_avg) > 0 ? (
            <span>
              <Stars value={Number(firm.rating_avg)} count={Number(firm.rating_count) || undefined} />
            </span>
          ) : null}
          {(firm.min_guests || firm.max_guests) ? (
            <span><Icon name="users" size={13} className="ico-inline" /> {guestRange(firm.min_guests, firm.max_guests, lang)}</span>
          ) : null}
        </div>

        {desc ? <p className="firm-card-desc">{truncate(desc, 120)}</p> : null}

        <div className="firm-card-foot">
          {firm.price_from ? (
            <span className="price-tag">
              {t(lang, 'price_from')} {money(firm.price_from, firm.currency || 'MDL')}
              <small>{firm.price_from ? `/ ${t(lang, 'per_person')}` : ''}</small>
            </span>
          ) : (
            <span className="muted small">—</span>
          )}
          <Link href={href} className="btn btn-outline btn-sm">
            {t(lang, 'view_profile')} <Icon name="chevronRight" size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
