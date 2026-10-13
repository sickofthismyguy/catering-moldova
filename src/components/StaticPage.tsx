import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { staticPages } from '@/lib/content';
import { getSettings } from '@/lib/data';
import { buildMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { telHref, mailHref } from '@/lib/format';
import { Icon } from './Icons';
import type { Lang } from '@/lib/types';

type PageKey = keyof typeof staticPages;

export async function StaticPage({ lang, pageKey, path }: { lang: Lang; pageKey: PageKey; path: string }) {
  const L = (p: string) => `/${lang}${p}`;
  const data = staticPages[pageKey][lang] ?? staticPages[pageKey].ro;
  const settings = await getSettings();

  return (
    <div className="container container-narrow section">
      <Breadcrumbs items={[{ name: t(lang, 'c_home'), href: L('/') }, { name: data.title }]} />
      <h1>{data.title}</h1>

      <div className="prose mt-4">
        {data.blocks.map((block, i) => (
          <section key={i}>
            {block.h ? <h2>{block.h}</h2> : null}
            {block.p?.map((para, j) => <p key={j}>{para}</p>)}
            {block.list ? <ul>{block.list.map((li, j) => <li key={j}>{li}</li>)}</ul> : null}
          </section>
        ))}

        {pageKey === 'privacy' || pageKey === 'terms' ? (
          <section>
            <h2>{t(lang, 'nav_contact')}</h2>
            <p>
              <a href={mailHref(settings.contact_email)}>{settings.contact_email}</a>
              {settings.contact_phone ? <> · <a href={telHref(settings.contact_phone)}>{settings.contact_phone}</a></> : null}
            </p>
          </section>
        ) : null}
      </div>

      <div className="card mt-6">
        <div className="row-between">
          <div>
            <h2 style={{ fontSize: '1.05rem' }}>{t(lang, 'firms_cta_title')}</h2>
            <p className="muted small mt-2">{t(lang, 'firms_cta_p')}</p>
          </div>
          <Link className="btn btn-primary" href={L('/cont/inregistrare')}>{t(lang, 'firms_cta_btn')}</Link>
        </div>
      </div>
    </div>
  );
}

export function StaticMetadata(lang: Lang, pageKey: PageKey, path: string) {
  const data = staticPages[pageKey][lang] ?? staticPages[pageKey].ro;
  return buildMetadata({ lang, title: data.title, description: data.blocks[0]?.p?.[0] || data.title, path });
}

/** Contact page uses live settings + direct channels. */
export async function ContactBody({ lang }: { lang: Lang }) {
  const settings = await getSettings();
  return (
    <div className="stack">
      <ul className="contact-list card">
        <li>
          <span className="ico"><Icon name="mail" size={18} /></span>
          <span><b>{t(lang, 'firm_email')}</b><a href={mailHref(settings.contact_email)}>{settings.contact_email}</a></span>
        </li>
        {settings.contact_phone ? (
          <li>
            <span className="ico"><Icon name="phone" size={18} /></span>
            <span><b>{t(lang, 'firm_phone')}</b><a href={telHref(settings.contact_phone)}>{settings.contact_phone}</a></span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
