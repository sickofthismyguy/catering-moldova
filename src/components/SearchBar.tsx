import { Icon } from './Icons';
import { t } from '@/lib/i18n';
import { pick } from '@/lib/format';
import type { Category, City, Lang } from '@/lib/types';

/**
 * Zero-JavaScript search bar: a plain GET form. Works without JS, indexes
 * cleanly and is instant on mobile.
 */
export function SearchBar({
  lang,
  cities,
  events,
  action,
  defaultCity,
  defaultEvent,
  defaultQ,
  compact,
}: {
  lang: Lang;
  cities: City[];
  events: Category[];
  action: string;
  defaultCity?: string;
  defaultEvent?: string;
  defaultQ?: string;
  compact?: boolean;
}) {
  return (
    <form className="searchbox" action={action} method="get" role="search" aria-label={t(lang, 'search_title')}>
      <div className="field">
        <label htmlFor="q">{t(lang, 'keyword_label')}</label>
        <input
          className="input"
          id="q"
          name="q"
          type="search"
          defaultValue={defaultQ || ''}
          placeholder={t(lang, 'search_keyword_ph')}
          autoComplete="off"
          maxLength={80}
        />
      </div>

      <div className="field">
        <label htmlFor="city">{t(lang, 'city_label')}</label>
        <select className="select" id="city" name="city" defaultValue={defaultCity || ''}>
          <option value="">{t(lang, 'search_city_all')}</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>{pick(c, lang)}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="event">{t(lang, 'event_label')}</label>
        <select className="select" id="event" name="event" defaultValue={defaultEvent || ''}>
          <option value="">{t(lang, 'search_event_all')}</option>
          {events.map((e) => (
            <option key={e.slug} value={e.slug}>{pick(e, lang)}</option>
          ))}
        </select>
      </div>

      <button className={`btn btn-primary ${compact ? '' : 'btn-lg'}`} type="submit">
        <Icon name="search" size={17} /> <span className="hidden-mobile">{t(lang, 'search_submit')}</span>
      </button>
    </form>
  );
}
