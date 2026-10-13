'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardGate } from './Gate';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Firm, Lang } from '@/lib/types';

export function AccountSettings({ lang }: { lang: Lang }) {
  return (
    <DashboardGate lang={lang}>
      {({ user, firm }) => <SettingsBody lang={lang} email={user.email} firm={firm} />}
    </DashboardGate>
  );
}

function SettingsBody({ lang, email, firm }: { lang: Lang; email: string; firm: Firm | null }) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState(email);
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    const client = sb();
    if (!client) return;
    setBusy(true);
    setMsg(null);
    if (pass && pass.length < 8) { setBusy(false); return setMsg({ kind: 'error', text: t(lang, 'auth_err_weak') }); }
    if (pass && pass !== pass2) { setBusy(false); return setMsg({ kind: 'error', text: t(lang, 'auth_err_weak') }); }
    const payload: { email?: string; password?: string } = {};
    if (newEmail.trim() !== email) payload.email = newEmail.trim();
    if (pass) payload.password = pass;
    if (!Object.keys(payload).length) { setBusy(false); return; }
    const { error } = await client.auth.updateUser(payload);
    setBusy(false);
    if (error) return setMsg({ kind: 'error', text: error.message });
    setPass(''); setPass2('');
    setMsg({ kind: 'ok', text: t(lang, 'dash_saved') });
  }

  async function signOut() {
    const client = sb();
    if (!client) return;
    await client.auth.signOut();
    router.push(`/${lang}/cont/intrare`);
    router.refresh();
  }

  async function deleteFirm() {
    const text = lang === 'ru'
      ? 'Удалить профиль компании вместе со всеми услугами, заявками и отзывами? Это действие необратимо.'
      : 'Ștergi profilul firmei împreună cu serviciile, cererile și recenziile? Acțiunea este ireversibilă.';
    if (!window.confirm(text)) return;
    const client = sb();
    if (!client || !firm) return;
    setBusy(true);
    const { error } = await client.from('firms').delete().eq('id', firm.id);
    setBusy(false);
    if (error) return setMsg({ kind: 'error', text: error.message });
    setMsg({ kind: 'ok', text: t(lang, 'dash_saved') });
    router.refresh();
  }

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: '1.5rem' }}>{t(lang, 'dash_nav_settings')}</h1>
      {msg ? <div className={`alert ${msg.kind === 'ok' ? 'alert-ok' : 'alert-error'} mb-4`} role="status">{msg.text}</div> : null}

      <form className="dash-card" onSubmit={saveAccount}>
        <h2>{t(lang, 'dash_nav_settings')}</h2>
        <div className="field mt-4">
          <label htmlFor="a-email">{t(lang, 'f_email')}</label>
          <input className="input" id="a-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="a-pass">{t(lang, 'f_password')}</label>
            <input className="input" id="a-pass" type="password" minLength={8} autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <span className="hint">{t(lang, 'c_optional')}</span>
          </div>
          <div className="field">
            <label htmlFor="a-pass2">{t(lang, 'f_password_confirm')}</label>
            <input className="input" id="a-pass2" type="password" minLength={8} autoComplete="new-password" value={pass2} onChange={(e) => setPass2(e.target.value)} />
          </div>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}</button>
          <button className="btn btn-outline" type="button" onClick={signOut}>
            {t(lang, 'nav_logout')}
          </button>
        </div>
      </form>

      <section className="dash-card mt-4" style={{ borderColor: '#fecaca' }}>
        <h2 style={{ color: 'var(--danger)' }}>{lang === 'ru' ? 'Опасная зона' : 'Zonă periculoasă'}</h2>
        <p className="muted small mt-2">
          {lang === 'ru'
            ? 'Удаление профиля убирает компанию из каталога и стирает её услуги, заявки и отзывы. Аккаунт остаётся — можно создать новый профиль.'
            : 'Ștergerea profilului elimină firma din catalog și șterge serviciile, cererile și recenziile. Contul rămâne — poți crea un profil nou.'}
        </p>
        <button className="btn btn-danger mt-4" type="button" onClick={deleteFirm} disabled={busy || !firm}>
          {t(lang, 'dash_delete')} {firm?.name}
        </button>
      </section>
    </div>
  );
}
