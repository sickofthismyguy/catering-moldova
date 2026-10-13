'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { t } from '@/lib/i18n';
import { pick } from '@/lib/format';
import type { Category, City, Lang, SearchParams, Taxonomy } from '@/lib/types';

export function Filters({
  lang,
  cities,
  events,
  cuisines,
  dietary,
  value,
  basePath,
  resultCount,
}: {
  lang: Lang;
  cities: City[];
  events: Category[];
  cuisines: Taxonomy[];
  dietary: Taxonomy[];
  value: Omit<SearchParams, 'lang'>;
  basePath: string;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1000) setOpen(true);
  }, []);

  const active = Boolean(
    value.q || value.city || value.event || value.cuisine || value.dietary?.length ||
    value.priceMin !== undefined || value.priceMax !== undefined || value.guests !== undefined,
  );

  return (
    <details className="filters" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary>
        <span><Icon name="filter" size={16} className="ico-inline" /> {t(lang, 'filters_title')}
          {active ? <span className="badge badge-accent" style={{ marginLeft: 8 }}>•</span> : null}
        </span>
        <span className="muted tiny hidden-desktop">{resultCount} {t(lang, 'c_results')}</span>
      </summary>

      <form action={basePath} method="get" className="mt-4" id="filters-form">
        <div className="filter-group">
          <div className="field">
            <label htmlFor="f-q">{t(lang, 'keyword_label')}</label>
            <input className="input" id="f-q" name="q" type="search" defaultValue={value.q || ''} maxLength={80} />
          </div>
          <div className="field">
            <label htmlFor="f-city">{t(lang, 'city_label')}</label>
            <select className="select" id="f-city" name="city" defaultValue={value.city || ''}>
              <option value="">{t(lang, 'c_all')}</option>
              {cities.map((c) => <option key={c.slug} value={c.slug}>{pick(c, lang)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-event">{t(lang, 'event_label')}</label>
            <select className="select" id="f-event" name="event" defaultValue={value.event || ''}>
              <option value="">{t(lang, 'c_all')}</option>
              {events.map((e) => <option key={e.slug} value={e.slug}>{pick(e, lang)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-cuisine">{t(lang, 'cuisine_label')}</label>
            <select className="select" id="f-cuisine" name="cuisine" defaultValue={value.cuisine || ''}>
              <option value="">{t(lang, 'c_all')}</option>
              {cuisines.map((c) => <option key={c.slug} value={c.slug}>{pick(c, lang)}</option>)}
            </select>
          </div>
        </div>

        <div className="filter-group">
          <fieldset>
            <legend>{t(lang, 'dietary_label')}</legend>
            <div className="checks">
              {dietary.map((d) => (
                <label className="check" key={d.slug}>
                  <input type="checkbox" name="dietary" value={d.slug} defaultChecked={value.dietary?.includes(d.slug)} />
                  {pick(d, lang)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="filter-group">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="f-pmin">{t(lang, 'price_min_label')}</label>
              <input className="input" id="f-pmin" name="pmin" type="number" min={0} max={100000} step={10} defaultValue={value.priceMin ?? ''} />
            </div>
            <div className="field">
              <label htmlFor="f-pmax">{t(lang, 'price_max_label')}</label>
              <input className="input" id="f-pmax" name="pmax" type="number" min={0} max={100000} step={10} defaultValue={value.priceMax ?? ''} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-guests">{t(lang, 'guests_label')}</label>
            <input className="input" id="f-guests" name="guests" type="number" min={1} max={5000} defaultValue={value.guests ?? ''} />
            <span className="hint">{t(lang, 'c_optional')}</span>
          </div>
        </div>

        <button className="btn btn-primary btn-block" type="submit">{t(lang, 'apply_filters')}</button>
        <Link href={basePath} className="btn btn-ghost btn-block mt-2">{t(lang, 'reset_filters')}</Link>
      </form>
    </details>
  );
}
