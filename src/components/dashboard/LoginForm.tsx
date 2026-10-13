'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export function LoginForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const client = sb();
    if (!client) { setBusy(false); return; }
    const { error: err } = await client.auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setError(err.message.includes('Invalid login') ? t(lang, 'auth_err_invalid') : err.message);
      setBusy(false);
      return;
    }
    router.push(`/${lang}/cont`);
    router.refresh();
  }

  async function onReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError(t(lang, 'auth_err_invalid'));
      return;
    }
    setResetting(true);
    setError(null);
    const client = sb();
    if (!client) { setResetting(false); return; }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin}/${lang}/cont/setari` });
    setNotice(t(lang, 'auth_reset_sent'));
    setResetting(false);
  }

  return (
    <div className="card" style={{ maxWidth: 480, marginInline: 'auto' }}>
      <h1 style={{ fontSize: '1.4rem' }}>{t(lang, 'auth_login_title')}</h1>
      <p className="muted small mt-2">{t(lang, 'auth_login_p')}</p>

      {error ? <div className="alert alert-error mt-4" role="alert">{error}</div> : null}
      {notice ? <div className="alert alert-ok mt-4" role="status">{notice}</div> : null}

      <form onSubmit={onSubmit} className="mt-4">
        <div className="field">
          <label htmlFor="login-email">{t(lang, 'f_email')}</label>
          <input className="input" id="login-email" type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="login-pass">{t(lang, 'f_password')}</label>
          <input className="input" id="login-pass" type="password" required autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? t(lang, 'c_loading') : t(lang, 'auth_login_btn')}
        </button>
      </form>

      <form onSubmit={onReset} className="mt-4">
        <button className="btn btn-ghost btn-block btn-sm" type="submit" disabled={resetting}>
          {t(lang, 'auth_forgot')}
        </button>
      </form>

      <p className="small muted mt-5 center">
        {t(lang, 'auth_no_account')}{' '}
        <Link href={`/${lang}/cont/inregistrare`}>{t(lang, 'auth_register_btn')}</Link>
      </p>
    </div>
  );
}
