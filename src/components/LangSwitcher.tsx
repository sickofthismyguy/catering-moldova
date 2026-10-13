'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGS, LANG_SHORT } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/** Language switcher that keeps the visitor on the same page. */
export function LangSwitcher({ lang, className = 'lang-switch' }: { lang: Lang; className?: string }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.replace(new RegExp(`^/${lang}(/|$)`), '/');
  const target = rest === '/' ? '' : rest.replace(/\/$/, '');

  return (
    <span className={className} aria-label="Language / Limba / Язык">
      {LANGS.map((l) => {
        const href = `/${l}${target}`;
        const hrefLang = l === 'ro' ? 'ro-MD' : l === 'ru' ? 'ru-MD' : 'en';
        return (
          <Link key={l} href={href} hrefLang={hrefLang} lang={hrefLang} aria-current={l === lang ? 'true' : undefined} title={hrefLang}>
            {LANG_SHORT[l]}
          </Link>
        );
      })}
    </span>
  );
}
