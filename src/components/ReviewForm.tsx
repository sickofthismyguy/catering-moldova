'use client';

import { useState } from 'react';
import { Icon } from './Icons';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export function ReviewForm({ firmId, lang }: { firmId: string; lang: Lang }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [ts] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('sending');
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_id: firmId,
          author_name: String(fd.get('author_name') || ''),
          rating: Number(fd.get('rating') || 0),
          title: String(fd.get('title') || ''),
          body: String(fd.get('body') || ''),
          company: String(fd.get('company') || ''),
          ts: Number(fd.get('ts') || ts),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState('ok');
        setMsg(data.message || t(lang, 'f_success_review'));
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

  if (state === 'ok') return <div className="alert alert-ok" role="status"><Icon name="check" size={15} className="ico-inline" /> {msg || t(lang, 'f_success_review')}</div>;

  return (
    <form onSubmit={onSubmit} className="card card-plain">
      <h3 className="mb-3">{t(lang, 'firm_review_write')}</h3>
      {state === 'error' ? <div className="alert alert-error mb-4" role="alert">{msg}</div> : null}

      <fieldset>
        <legend>{t(lang, 'f_rating')} *</legend>
        <div className="checks">
          {[5, 4, 3, 2, 1].map((n) => (
            <label className="check" key={n}>
              <input type="radio" name="rating" value={n} required defaultChecked={n === 5} />
              {n} ★
            </label>
          ))}
        </div>
      </fieldset>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="rv-name">{t(lang, 'f_name')} *</label>
          <input className="input" id="rv-name" name="author_name" required maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor="rv-title">{t(lang, 'f_review_title')}</label>
          <input className="input" id="rv-title" name="title" maxLength={120} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="rv-body">{t(lang, 'f_review_body')} *</label>
        <textarea className="textarea" id="rv-body" name="body" required maxLength={1500} />
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="rv-company">Company</label>
        <input id="rv-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="ts" value={ts} readOnly />

      <button className="btn btn-outline" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? t(lang, 'f_sending') : t(lang, 'f_submit')}
      </button>
    </form>
  );
}
