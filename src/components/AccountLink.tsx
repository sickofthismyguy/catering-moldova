'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/** Shows "Sign in" or "My account" depending on the Supabase session. No JS blocking. */
export function AccountLink({ lang }: { lang: Lang }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const client = sb();
    if (!client) {
      setSignedIn(false);
      return;
    }
    let alive = true;
    (async () => {
      const { data } = await client.auth.getSession();
      if (!alive) return;
      const user = data.session?.user;
      setSignedIn(Boolean(user));
      if (user) {
        const { data: profile } = await client.from('profiles').select('role').eq('id', user.id).maybeSingle();
        if (alive) setIsAdmin(profile?.role === 'admin');
      }
    })();
    const { data: sub } = client.auth.onAuthStateChange((_e, session) => {
      if (!alive) return;
      setSignedIn(Boolean(session?.user));
      if (!session?.user) setIsAdmin(false);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (signedIn === null) {
    return (
      <Link href={`/${lang}/cont/intrare`} className="btn btn-outline btn-sm">
        {t(lang, 'nav_login')}
      </Link>
    );
  }
  if (!signedIn) {
    return (
      <Link href={`/${lang}/cont/intrare`} className="btn btn-outline btn-sm">
        {t(lang, 'nav_login')}
      </Link>
    );
  }
  return (
    <>
      <Link href={`/${lang}/cont`} className="btn btn-outline btn-sm">
        {t(lang, 'nav_account')}
      </Link>
      {isAdmin ? (
        <Link href={`/${lang}/cont/admin`} className="btn btn-soft btn-sm">
          {t(lang, 'nav_admin')}
        </Link>
      ) : null}
    </>
  );
}
