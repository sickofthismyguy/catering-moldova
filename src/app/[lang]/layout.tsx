import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { JsonLd } from '@/components/JsonLd';
import { DEFAULT_LANG, LANGS, LOCALE_TAG, isLang } from '@/lib/i18n';
import { getSettings } from '@/lib/data';
import { buildMetadata, websiteJsonLd } from '@/lib/seo';
import { SITE_NAME, siteUrl } from '@/lib/config';
import type { Lang } from '@/lib/types';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Lang = isLang(lang) ? lang : DEFAULT_LANG;
  const settings = await getSettings();
  const description =
    l === 'ru' ? settings.seo_description_ru : l === 'en' ? settings.seo_description_en : settings.seo_description_ro;
  const title =
    l === 'ru'
      ? 'Кейтеринг в Молдове — каталог компаний'
      : l === 'en'
        ? 'Catering in Moldova — company directory'
        : 'Catering în Moldova — catalogul firmelor';
  return {
    ...buildMetadata({ lang: l, title, description, path: '/' }),
    applicationName: SITE_NAME,
    title: { default: `${SITE_NAME} — ${title}`, template: `%s | ${SITE_NAME}` },
    description,
    keywords: [
      'catering Moldova', 'servicii catering', 'catering Chișinău', 'catering nunți', 'catering corporate',
      'meniu catering', 'preț catering', 'кейтеринг Молдова', 'кейтеринг Кишинёв',
    ],
    category: 'business',
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { telephone: true, address: false, email: false },
    icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: [{ url: '/icon.svg' }] },
    manifest: '/site.webmanifest',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const l = lang as Lang;

  return (
    <html lang={LOCALE_TAG[l]}>
      <body>
      <a className="skip-link" href="#main">
        {l === 'ru' ? 'Перейти к содержимому' : l === 'en' ? 'Skip to content' : 'Sari la conținut'}
      </a>
      <SiteHeader lang={l} />
      <main id="main">{children}</main>
      <SiteFooter lang={l} />
      <JsonLd data={websiteJsonLd(l, siteUrl())} />
      </body>
    </html>
  );
}
