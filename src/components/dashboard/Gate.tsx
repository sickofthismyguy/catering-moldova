'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { sb, dbReady } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Firm, Lang } from '@/lib/types';

export interface Profile {
  id: string;
  role: 'firm' | 'admin';
  full_name?: string | null;
}

export interface DashCtx {
  user: { id: string; email: string };
  profile: Profile | null;
  firm: Firm | null;
  refresh: () => Promise<void>;
  isAdmin: boolean;
}

/**
 * Loads the Supabase session, the user's role and their firm, then renders the
 * dashboard body. Every protected page is wrapped in this so nothing is
 * visible before the user is authenticated (RLS also enforces it server-side).
 */
export function DashboardGate({
  lang,
  requireAdmin = false,
  children,
}: {
  lang: Lang;
  requireAdmin?: boolean;
  children: (ctx: DashCtx) => ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [ctx, setCtx] = useState<DashCtx | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = sb();
    if (!client) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await client.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        setCtx(null);
        setLoading(false);
        return;
      }
      const [profileRes, firmRes] = await Promise.all([
        client.from('profiles').select('id,role,full_name').eq('id', user.id).maybeSingle(),
        client.from('firms').select('*').eq('owner_id', user.id).maybeSingle(),
      ]);
      setCtx({
        user: { id: user.id, email: user.email || '' },
        profile: (profileRes.data as Profile) || null,
        firm: (firmRes.data as Firm) || null,
        isAdmin: profileRes.data?.role === 'admin',
        refresh: load,
      });
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const client = sb();
    if (!client) return;
    const { data } = client.auth.onAuthStateChange(() => {
      setLoading(true);
      load();
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  if (!dbReady()) {
    return (
      <div className="card empty">
        <h2>{t(lang, 'c_error')}</h2>
        <p className="muted mt-2">{t(lang, 'dash_demo_notice')}</p>
        <p className="small mt-4">
          Supabase → Project Settings → API → adaugă <code>NEXT_PUBLIC_SUPABASE_URL</code> și{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> în variabilele de mediu Vercel, apoi apasă <strong>Redeploy</strong>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty" aria-busy="true">
        <span className="spinner" style={{ borderColor: 'rgba(0,0,0,.15)', borderTopColor: '#b45309' }} />
        <span className="sr-only">{t(lang, 'c_loading')}</span>
      </div>
    );
  }

  if (error) return <div className="alert alert-error">{error}</div>;

  if (!ctx) {
    return (
      <div className="card empty" style={{ maxWidth: 520, marginInline: 'auto' }}>
        <h2>{t(lang, 'auth_login_title')}</h2>
        <p className="muted mt-2">{t(lang, 'auth_login_p')}</p>
        <div className="btn-row mt-5" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" href={`/${lang}/cont/intrare`}>{t(lang, 'auth_login_btn')}</Link>
          <Link className="btn btn-outline" href={`/${lang}/cont/inregistrare`}>{t(lang, 'auth_register_btn')}</Link>
        </div>
      </div>
    );
  }

  if (requireAdmin && !ctx.isAdmin) {
    return <div className="alert alert-error">{t(lang, 'adm_denied')}</div>;
  }

  return <>{children(ctx)}</>;
}
