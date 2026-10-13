import Link from 'next/link';
import { Icon } from './Icons';
import { LangSwitcher } from './LangSwitcher';
import { AccountLink } from './AccountLink';
import { t } from '@/lib/i18n';
import { SITE_NAME } from '@/lib/config';
import type { Lang } from '@/lib/types';

export function SiteHeader({ lang }: { lang: Lang }) {
  const L = (p: string) => `/${lang}${p}`;
  const links = [
    { href: L('/cauta'), label: t(lang, 'nav_search') },
    { href: L('/catering-chisinau'), label: t(lang, 'nav_cities') },
    { href: L('/catering-nunti'), label: t(lang, 'nav_events') },
    { href: L('/despre'), label: t(lang, 'nav_about') },
  ];

  return (
    <header className="site-header">
      <div className="container inner">
        <Link href={L('/')} className="brand" aria-label={`${SITE_NAME} — ${t(lang, 'nav_home')}`}>
          <span className="brand-mark" aria-hidden="true">
            <Icon name="fire" size={17} />
          </span>
          <span className="brand-name">
            {SITE_NAME}
            <span className="hidden-mobile">{t(lang, 'site_tagline')}</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label={t(lang, 'nav_menu')}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
          <Link href={L('/favorite')} className="nav-link" aria-label={t(lang, 'nav_favorites')}>
            <Icon name="heart" size={17} />
          </Link>
          <LangSwitcher lang={lang} />
          <AccountLink lang={lang} />
          <Link href={L('/adauga-firma')} className="btn btn-primary btn-sm nav-cta">
            {t(lang, 'nav_add_firm')}
          </Link>
        </nav>

        <details className="nav-toggle">
          <summary>
            <Icon name="menu" size={18} /> <span>{t(lang, 'nav_menu')}</span>
          </summary>
          <div className="nav-panel">
            <div className="container">
              <Link href={L('/')} className="nav-link">{t(lang, 'nav_home')}</Link>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
              ))}
              <Link href={L('/favorite')} className="nav-link">{t(lang, 'nav_favorites')}</Link>
              <Link href={L('/cont')} className="nav-link">{t(lang, 'nav_account')}</Link>
              <Link href={L('/adauga-firma')} className="nav-link">{t(lang, 'nav_add_firm')}</Link>
              <div className="nav-sep" />
              <div style={{ padding: '0 12px' }}>
                <LangSwitcher lang={lang} />
              </div>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
