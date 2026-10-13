'use client';

import { useState } from 'react';
import { Icon } from './Icons';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/**
 * Public inquiry form -> POST /api/inquiry
 * Spam protection: honeypot field + timestamp challenge + server-side rate limit.
 */
export function InquiryForm({ firmId, firmName, lang, emailTo }: { firmId: string; firmName: string; lang: Lang; emailTo?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [ts] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_id: firmId,
          name: String(fd.get('name') || ''),
          email: String(fd.get('email') || ''),
          phone: String(fd.get('phone') || ''),
          event_date: String(fd.get('event_date') || ''),
          guests: fd.get('guests') ? Number(fd.get('guests')) : null,
          message: String(fd.get('message') || ''),
          company: String(fd.get('company') || ''),
          ts: Number(fd.get('ts') || ts),
          lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState('ok');
        setMsg(data.message || t(lang, 'f_success_inquiry'));
        form.reset();
      } else {
        setState('error');
        setMsg(data.error || t(lang, 'f_error'));
      }
    } catch {
      setState('error');
      setMsg(t(lang, 'f_error'));
    }
  }

  if (state === 'ok') {
    return (
      <div className="alert alert-ok" role="status">
        <strong><Icon name="check" size={15} className="ico-inline" /> {t(lang, 'f_success_inquiry')}</strong>
        {emailTo ? <p className="mt-2 small">{t(lang, 'inq_reply')}: <a href={`mailto:${emailTo}`}>{emailTo}</a></p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      {state === 'error' ? <div className="alert alert-error mb-4" role="alert">{msg || t(lang, 'f_error')}</div> : null}

      <div className="field">
        <label htmlFor="inq-name">{t(lang, 'f_name')} *</label>
        <input className="input" id="inq-name" name="name" type="text" required maxLength={120} autoComplete="name" />
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="inq-email">{t(lang, 'f_email')} *</label>
          <input className="input" id="inq-email" name="email" type="email" required maxLength={160} autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="inq-phone">{t(lang, 'f_phone')}</label>
          <input className="input" id="inq-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="+373" />
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="inq-date">{t(lang, 'f_event_date')}</label>
          <input className="input" id="inq-date" name="event_date" type="date" />
        </div>
        <div className="field">
          <label htmlFor="inq-guests">{t(lang, 'f_guests')}</label>
          <input className="input" id="inq-guests" name="guests" type="number" min={1} max={5000} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="inq-message">{t(lang, 'f_message')} *</label>
        <textarea className="textarea" id="inq-message" name="message" required maxLength={2000}
          placeholder={lang === 'ru' ? `Здравствуйте! Интересует кейтеринг на ${new Date().getFullYear()} год…` : `Bună ziua! Mă interesează un meniu de catering pentru…`} />
        <span className="hint">{t(lang, 'f_privacy_note')}</span>
      </div>

      {/* Honeypot: hidden from people, irresistible to bots */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="inq-company">Company</label>
        <input id="inq-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="ts" value={ts} readOnly />

      <button className="btn btn-primary btn-block" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? <><span className="spinner" aria-hidden="true" /> {t(lang, 'f_sending')}</> : <><Icon name="mail" size={17} /> {t(lang, 'firm_inquiry')}</>}
      </button>
      <p className="tiny muted mt-2 center">{firmName}</p>
    </form>
  );
}
