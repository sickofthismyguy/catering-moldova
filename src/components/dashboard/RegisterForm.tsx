'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { pick, slugify } from '@/lib/format';
import type { City, Lang } from '@/lib/types';

export function RegisterForm({ lang, cities }: { lang: Lang; cities: City[] }) {
  const router = useRouter();
  const [firmName, setFirmName] = useState('');
  const [city, setCity] = useState(cities[0]?.slug || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needConfirm, setNeedConfirm] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError(t(lang, 'auth_err_weak'));
    if (password !== password2) return setError(t(lang, 'auth_err_weak'));
    if (!agree) return setError(t(lang, 'auth_terms_agree'));

    const client = sb();
    if (!client) return;
    setBusy(true);

    const { data, error: err } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { firm_name: firmName.trim(), city, phone: phone.trim(), full_name: firmName.trim() },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/${lang}/cont` : undefined,
      },
    });

    if (err) {
      setBusy(false);
      if (err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('already been registered')) {
        return setError(t(lang, 'auth_err_email_taken'));
      }
      return setError(err.message);
    }

    // A database trigger creates the profile + firm row from the sign-up metadata.
    if (!data.session) {
      setBusy(false);
      setNeedConfirm(true);
      return;
    }

    // Session available (email confirmation disabled): make sure the firm row exists.
    const { data: existing } = await client.from('firms').select('id').eq('owner_id', data.session.user.id).maybeSingle();
    if (!existing) {
      await client.from('firms').insert({
        owner_id: data.session.user.id,
        owner_email: email.trim(),
        name: firmName.trim(),
        slug: slugify(firmName) || `firma-${Date.now().toString(36)}`,
        city,
        phone: phone.trim() || null,
        status: 'pending',
        published: false,
        currency: 'MDL',
      });
    }
    router.push(`/${lang}/cont`);
    router.refresh();
  }

  if (needConfirm) {
    return (
      <div className="card" style={{ maxWidth: 520, marginInline: 'auto' }}>
        <h1 style={{ fontSize: '1.35rem' }}>{t(lang, 'auth_register_btn')}</h1>
        <div className="alert alert-ok mt-4">{t(lang, 'auth_check_email')}</div>
        <Link className="btn btn-primary mt-4" href={`/${lang}/cont/intrare`}>{t(lang, 'auth_login_btn')}</Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 560, marginInline: 'auto' }}>
      <h1 style={{ fontSize: '1.4rem' }}>{t(lang, 'auth_register_title')}</h1>
      <p className="muted small mt-2">{t(lang, 'auth_register_p')}</p>

      {error ? <div className="alert alert-error mt-4" role="alert">{error}</div> : null}

      <form onSubmit={onSubmit} className="mt-4">
        <div className="field">
          <label htmlFor="r-firm">{t(lang, 'f_firm_name')} *</label>
          <input className="input" id="r-firm" required maxLength={120} value={firmName} onChange={(e) => setFirmName(e.target.value)} autoComplete="organization" />
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="r-city">{t(lang, 'f_city')} *</label>
            <select className="select" id="r-city" required value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => <option key={c.slug} value={c.slug}>{pick(c, lang)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="r-phone">{t(lang, 'f_phone')}</label>
            <input className="input" id="r-phone" type="tel" maxLength={40} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+373" autoComplete="tel" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="r-email">{t(lang, 'f_email')} *</label>
          <input className="input" id="r-email" type="email" required maxLength={160} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="r-pass">{t(lang, 'f_password')} *</label>
            <input className="input" id="r-pass" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            <span className="hint">min. 8</span>
          </div>
          <div className="field">
            <label htmlFor="r-pass2">{t(lang, 'f_password_confirm')} *</label>
            <input className="input" id="r-pass2" type="password" required minLength={8} value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" />
          </div>
        </div>

        <label className="check-line mb-4">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
          <span>
            {t(lang, 'auth_terms_agree')}{' '}
            <Link href={`/${lang}/termeni`} target="_blank">{t(lang, 'terms_h1')}</Link> ·{' '}
            <Link href={`/${lang}/confidentialitate`} target="_blank">{t(lang, 'privacy_h1')}</Link>
          </span>
        </label>

        <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={busy}>
          {busy ? t(lang, 'c_loading') : t(lang, 'auth_register_btn')}
        </button>
      </form>

      <p className="small muted mt-5 center">
        {t(lang, 'auth_have_account')} <Link href={`/${lang}/cont/intrare`}>{t(lang, 'auth_login_btn')}</Link>
      </p>
    </div>
  );
}
