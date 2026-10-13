import Link from 'next/link';
import { Icon } from './Icons';
import { LangSwitcher } from './LangSwitcher';
import { t } from '@/lib/i18n';
import { DEMO_MODE, SITE_NAME } from '@/lib/config';
import { getCategories, getCities, getSettings } from '@/lib/data';
import { pick } from '@/lib/format';
import type { Lang } from '@/lib/types';

export async function SiteFooter({ lang }: { lang: Lang }) {
  const L = (p: string) => `/${lang}${p}`;
  const [cities, events, settings] = await Promise.all([getCities(), getCategories('event'), getSettings()]);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href={L('/')} className="brand" style={{ marginBottom: 10 }}>
              <span className="brand-mark" aria-hidden="true"><Icon name="fire" size={17} /></span>
              <span className="brand-name">{SITE_NAME}</span>
            </Link>
            <p className="muted small" style={{ maxWidth: '34ch' }}>{t(lang, 'ft_made')}</p>
            <p className="small mt-3">
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              {settings.contact_phone ? <><br /><a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}>{settings.contact_phone}</a></> : null}
            </p>
            <div className="mt-3"><LangSwitcher lang={lang} /></div>
          </div>

          <nav aria-labelledby="ft-cities">
            <h4 id="ft-cities">{t(lang, 'ft_cities')}</h4>
            <ul>
              {cities.slice(0, 9).map((c) => (
                <li key={c.slug}>
                  <Link href={L(`/catering-${c.slug}`)}>
                    {lang === 'ru' ? 'Кейтеринг ' : 'Catering '}{pick(c, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="ft-events">
            <h4 id="ft-events">{t(lang, 'ft_events')}</h4>
            <ul>
              {events.slice(0, 9).map((c) => (
                <li key={c.slug}><Link href={L(`/catering-${c.slug}`)}>{pick(c, lang)}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="ft-legal">
            <h4 id="ft-legal">{t(lang, 'ft_legal')}</h4>
            <ul>
              <li><Link href={L('/despre')}>{t(lang, 'nav_about')}</Link></li>
              <li><Link href={L('/contact')}>{t(lang, 'nav_contact')}</Link></li>
              <li><Link href={L('/confidentialitate')}>{t(lang, 'privacy_h1')}</Link></li>
              <li><Link href={L('/termeni')}>{t(lang, 'terms_h1')}</Link></li>
              <li><Link href={L('/cauta')}>{t(lang, 'nav_search')}</Link></li>
            </ul>
            <h4 className="mt-4">{t(lang, 'ft_for_business')}</h4>
            <ul>
              <li><Link href={L('/adauga-firma')}>{t(lang, 'nav_add_firm')}</Link></li>
              <li><Link href={L('/cont')}>{t(lang, 'nav_account')}</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {year} {SITE_NAME}. {t(lang, 'ft_rights')}</span>
          {DEMO_MODE ? <span className="pill-note"><Icon name="info" size={13} /> {t(lang, 'ft_demo')}</span> : null}
          {lang === 'ru' && settings.footer_note_ru ? <span className="muted">{settings.footer_note_ru}</span> : null}
          {lang !== 'ru' && settings.footer_note_ro ? <span className="muted">{settings.footer_note_ro}</span> : null}
        </div>
      </div>
    </footer>
  );
}
