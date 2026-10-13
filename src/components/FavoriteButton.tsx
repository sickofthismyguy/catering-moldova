'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

const KEY = 'cm:favorites';

function readFavs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string').slice(0, 200) : [];
  } catch {
    return [];
  }
}

export function FavoriteButton({ slug, lang, className = '' }: { slug: string; lang: Lang; className?: string }) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readFavs().includes(slug));
    setReady(true);
  }, [slug]);

  function toggle() {
    const list = readFavs();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list].slice(0, 200);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ }
    setSaved(next.includes(slug));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn ${saved ? 'btn-soft' : 'btn-outline'} ${className}`}
      aria-pressed={saved}
      aria-label={saved ? t(lang, 'firm_favorited') : t(lang, 'firm_favorite')}
      title={saved ? t(lang, 'firm_favorited') : t(lang, 'firm_favorite')}
      style={ready ? undefined : { visibility: 'hidden' }}
    >
      <Icon name="heart" size={17} /> <span className="hidden-mobile">{saved ? t(lang, 'firm_favorited') : t(lang, 'firm_favorite')}</span>
    </button>
  );
}

export function FavoritesPage({ lang }: { lang: Lang }) {
  const [favs, setFavs] = useState<string[] | null>(null);
  const [firms, setFirms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = readFavs();
    setFavs(list);
    (async () => {
      if (!list.length) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/favorites?slugs=${encodeURIComponent(list.join(','))}`);
        const data = await res.json();
        setFirms(Array.isArray(data?.items) ? data.items : []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="empty"><span className="spinner" style={{ borderColor: 'rgba(0,0,0,.15)', borderTopColor: '#b45309' }} /> <span className="sr-only">{t(lang, 'c_loading')}</span></div>;

  if (!favs?.length) {
    return (
      <div className="empty card">
        <h3>{t(lang, 'nav_favorites')}</h3>
        <p>{lang === 'ru' ? 'Сохранённых компаний пока нет.' : 'Nu ai încă firme salvate.'}</p>
        <a href={`/${lang}/cauta`} className="btn btn-primary mt-4">{t(lang, 'search_submit')}</a>
      </div>
    );
  }

  return (
    <div className="grid grid-3">
      {firms.map((f) => (
        <a className="firm-card" key={f.id} href={`/${lang}/firma/${f.slug}`}>
          <div className="firm-card-body">
            <h3 className="firm-card-title">{f.name}</h3>
            <div className="firm-card-meta"><span>{f.city}</span></div>
          </div>
        </a>
      ))}
      {!firms.length ? <p className="muted">{t(lang, 'firm_not_found')}</p> : null}
    </div>
  );
}
