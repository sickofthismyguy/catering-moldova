import Link from 'next/link';
import { Icon } from './Icons';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export function Pager({ page, total, basePath, query, lang }: {
  page: number; total: number; basePath: string; query: Record<string, string | string[] | undefined>; lang: Lang;
}) {
  const pages = Math.max(1, Math.ceil(total / 12));
  if (pages <= 1) return null;

  const build = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === '') continue;
      if (Array.isArray(v)) v.forEach((x) => x && params.append(k, x));
      else params.set(k, v);
    }
    params.delete('page');
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className="pager" aria-label="Paginare">
      {page > 1 ? (
        <Link href={build(page - 1)} className="btn btn-outline" rel="prev">
          <Icon name="arrowLeft" size={16} /> {t(lang, 'page_prev')}
        </Link>
      ) : <span className="btn btn-outline" aria-disabled="true"><Icon name="arrowLeft" size={16} /> {t(lang, 'page_prev')}</span>}

      <span className="muted small">{t(lang, 'page_of', { page, total: pages })}</span>

      {page < pages ? (
        <Link href={build(page + 1)} className="btn btn-outline" rel="next">
          {t(lang, 'page_next')} <Icon name="arrowRight" size={16} />
        </Link>
      ) : <span className="btn btn-outline" aria-disabled="true">{t(lang, 'page_next')} <Icon name="arrowRight" size={16} /></span>}
    </nav>
  );
}
