'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/** Dashboard side navigation. Hidden on the login / register screens. */
export function DashNav({ lang }: { lang: Lang }) {
  const pathname = usePathname() || '';
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isAuthPage = pathname.endsWith('/intrare') || pathname.endsWith('/inregistrare');

  useEffect(() => {
    const client = sb();
    if (!client || isAuthPage) return;
    let alive = true;
    (async () => {
      const { data } = await client.auth.getSession();
      if (!alive) return;
      const user = data.session?.user;
      setSignedIn(Boolean(user));
      if (user) {
        const { data: p } = await client.from('profiles').select('role').eq('id', user.id).maybeSingle();
        if (alive) setIsAdmin(p?.role === 'admin');
      }
    })();
    return () => { alive = false; };
  }, [isAuthPage, pathname]);

  if (isAuthPage || !signedIn) return null;

  const base = `/${lang}/cont`;
  const items = [
    { href: base, label: t(lang, 'dash_nav_overview'), icon: 'chart', exact: true },
    { href: `${base}/profil`, label: t(lang, 'dash_nav_profile'), icon: 'edit' },
    { href: `${base}/servicii`, label: t(lang, 'dash_nav_services'), icon: 'list' },
    { href: `${base}/intrebari`, label: t(lang, 'dash_nav_inquiries'), icon: 'inbox' },
    { href: `${base}/pareri`, label: t(lang, 'dash_nav_reviews'), icon: 'star' },
    { href: `${base}/setari`, label: t(lang, 'dash_nav_settings'), icon: 'settings' },
  ];

  return (
    <nav className="dash-nav" aria-label={t(lang, 'dash_title')}>
      {items.map((it) => {
        const current = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={current ? 'page' : undefined}>
            {it.label}
          </Link>
        );
      })}
      {isAdmin ? (
        <Link href={`${base}/admin`} aria-current={pathname.startsWith(`${base}/admin`) ? 'page' : undefined}>
          {t(lang, 'dash_nav_admin')}
        </Link>
      ) : null}
      <Link href={`/${lang}`}>{t(lang, 'dash_back_site')}</Link>
    </nav>
  );
}
