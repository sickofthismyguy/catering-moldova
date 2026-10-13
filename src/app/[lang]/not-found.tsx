import type { Metadata } from 'next';
import Link from 'next/link';
import { LANGS, LANG_SHORT, t } from '@/lib/i18n';

export const metadata: Metadata = { title: '404', robots: { index: false, follow: true } };

/**
 * Note: Next renders not-found boundaries WITHOUT route params, so this page
 * must not depend on them. We render the Romanian copy plus quick language
 * links, which covers every visitor.
 */
export default function LangNotFound() {
  return (
    <div className="container section">
      <div className="empty card" style={{ maxWidth: 640, marginInline: 'auto' }}>
        <p className="pill-note">404</p>
        <h1 className="mt-4">{t('ro', 'c_404_title')}</h1>
        <p className="mt-2">{t('ro', 'c_404_p')}</p>

        <div className="btn-row mt-5" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" href="/ro">{t('ro', 'c_404_btn')}</Link>
          <Link className="btn btn-outline" href="/ro/cauta">{t('ro', 'search_title')}</Link>
        </div>

        <div className="row mt-5" style={{ justifyContent: 'center' }}>
          {LANGS.map((l) => (
            <Link key={l} className="chip" href={`/${l}`}>
              {LANG_SHORT[l]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
