'use client';

import { useCallback, useEffect, useState } from 'react';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

const TEXT_KEYS = [
  { key: 'hero_title_ro', label: 'adm_hero_title_ro' as const },
  { key: 'hero_title_ru', label: 'adm_hero_title_ru' as const },
  { key: 'hero_subtitle_ro', label: 'adm_hero_sub_ro' as const, textarea: true },
  { key: 'hero_subtitle_ru', label: 'adm_hero_sub_ru' as const, textarea: true },
  { key: 'seo_title_template', label: 'adm_seo_template' as const, hint: '{firm} {city} {site}' },
  { key: 'seo_description_ro', label: 'adm_seo_desc_ro' as const, textarea: true },
  { key: 'seo_description_ru', label: 'adm_seo_desc_ru' as const, textarea: true },
  { key: 'seo_description_en', label: 'Meta description EN', textarea: true },
  { key: 'contact_email', label: 'adm_contact_email' as const },
  { key: 'contact_phone', label: 'adm_contact_phone' as const },
  { key: 'footer_note_ro', label: 'adm_footer_ro' as const },
  { key: 'footer_note_ru', label: 'adm_footer_ru' as const },
];

const BOOL_KEYS = [
  { key: 'reviews_enabled', label: 'adm_reviews_enabled' as const },
  { key: 'inquiries_enabled', label: 'adm_inquiries_enabled' as const },
];

export function AdminSettings({ lang }: { lang: Lang }) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = sb();
    if (!client) { setLoading(false); return; }
    const { data } = await client.from('settings').select('key,value');
    const map: Record<string, any> = {};
    for (const row of (data as { key: string; value: unknown }[]) || []) map[row.key] = row.value;
    setValues(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const client = sb();
    if (!client) return;
    setBusy(true);
    setMsg(null);
    const rows = Object.entries(values)
      .filter(([k]) => [...TEXT_KEYS, ...BOOL_KEYS].some((f) => f.key === k))
      .map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await client.from('settings').upsert(rows, { onConflict: 'key' });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg(t(lang, 'adm_saved'));
  }

  if (loading) return <p className="muted">{t(lang, 'c_loading')}</p>;

  return (
    <form onSubmit={save}>
      <div className="row-between mb-4">
        <div>
          <h2 style={{ fontSize: '1.2rem' }}>{t(lang, 'adm_settings')}</h2>
          <p className="muted small">{t(lang, 'adm_settings_p')}</p>
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}</button>
      </div>

      {msg ? <div className="alert alert-ok mb-4" role="status">{msg}</div> : null}

      <section className="dash-card">
        <h3>{t(lang, 'adm_settings')}</h3>
        <div className="mt-4">
          {TEXT_KEYS.map((f) => (
            <div className="field" key={f.key}>
              <label htmlFor={`s-${f.key}`}>{t(lang, f.label as any) || f.label}</label>
              {f.textarea ? (
                <textarea className="textarea" id={`s-${f.key}`} style={{ minHeight: 70 }} maxLength={400}
                  value={String(values[f.key] ?? '')} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              ) : (
                <input className="input" id={`s-${f.key}`} maxLength={200}
                  value={String(values[f.key] ?? '')} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
              )}
              {f.hint ? <span className="hint">{f.hint}</span> : null}
            </div>
          ))}

          <fieldset>
            <legend>{t(lang, 'adm_settings')}</legend>
            <div className="stack-sm">
              {BOOL_KEYS.map((f) => (
                <label className="switch" key={f.key}>
                  <input type="checkbox" checked={Boolean(values[f.key])} onChange={(e) => setValues({ ...values, [f.key]: e.target.checked })} />
                  <span>{t(lang, f.label as any)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <button className="btn btn-primary mt-3" type="submit" disabled={busy}>{busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}</button>
      </section>
    </form>
  );
}
