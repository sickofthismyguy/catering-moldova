'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { DashboardGate } from './Gate';
import { Icon } from '@/components/Icons';
import { sb, uploadMedia } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { money, pick } from '@/lib/format';
import type { Category, Firm, Lang, Service } from '@/lib/types';

const PRICE_TYPES = ['per_person', 'per_event', 'per_hour', 'fixed', 'on_request'] as const;
const empty = {
  title_ro: '', title_ru: '', description_ro: '', description_ru: '',
  category: '', price: '', price_type: 'per_person', unit: '', image_url: '', active: true, sort: 0,
};

export function ServicesManager({ lang, categories }: { lang: Lang; categories: Category[] }) {
  return (
    <DashboardGate lang={lang}>
      {({ firm, user }) => <ServicesBody lang={lang} categories={categories} firm={firm} userId={user.id} />}
    </DashboardGate>
  );
}

function ServicesBody({ lang, categories, firm, userId }: { lang: Lang; categories: Category[]; firm: Firm | null; userId: string }) {
  const [rows, setRows] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, any>>(empty);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    const client = sb();
    if (!client || !firm) { setLoading(false); return; }
    const { data } = await client.from('services').select('*').eq('firm_id', firm.id).order('sort', { ascending: true }).order('created_at', { ascending: true });
    setRows((data as Service[]) || []);
    setLoading(false);
  }, [firm]);

  useEffect(() => { load(); }, [load]);

  if (!firm) return <div className="card empty"><h2>{t(lang, 'dash_no_firm')}</h2></div>;

  const startNew = () => { setForm(empty); setEditing('new'); setMsg(null); };
  const startEdit = (s: Service) => {
    setForm({
      title_ro: s.title_ro || '', title_ru: s.title_ru || '', description_ro: s.description_ro || '',
      description_ru: s.description_ru || '', category: s.category || '', price: s.price ?? '',
      price_type: s.price_type || 'per_person', unit: s.unit || '', image_url: s.image_url || '',
      active: s.active !== false, sort: s.sort ?? 0,
    });
    setEditing(s.id);
    setMsg(null);
  };

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const res = await uploadMedia(file, userId, 'service');
    setBusy(false);
    e.target.value = '';
    if (res.url) setForm((f) => ({ ...f, image_url: res.url }));
    else setMsg({ kind: 'error', text: res.error === 'size' ? 'Max 5 MB' : res.error === 'type' ? 'JPG / PNG / WebP' : (res.error || 'error') });
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const client = sb();
    if (!client) return;
    setBusy(true);
    const payload = {
      firm_id: firm!.id,
      title_ro: String(form.title_ro).trim(),
      title_ru: String(form.title_ru).trim() || null,
      description_ro: String(form.description_ro).trim() || null,
      description_ru: String(form.description_ru).trim() || null,
      category: form.category || null,
      price: form.price === '' ? null : Number(form.price),
      price_type: form.price_type,
      unit: String(form.unit).trim() || null,
      image_url: form.image_url || null,
      active: Boolean(form.active),
      sort: Number(form.sort) || 0,
    };
    if (!payload.title_ro) { setBusy(false); setMsg({ kind: 'error', text: t(lang, 'svc_title_ro') }); return; }

    const { error } = editing === 'new'
      ? await client.from('services').insert(payload)
      : await client.from('services').update(payload).eq('id', editing!);
    setBusy(false);
    if (error) { setMsg({ kind: 'error', text: error.message }); return; }
    setMsg({ kind: 'ok', text: t(lang, 'dash_saved') });
    setEditing(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!window.confirm(t(lang, 'dash_confirm_delete'))) return;
    const client = sb();
    if (!client) return;
    await client.from('services').delete().eq('id', id);
    await load();
  }

  async function onToggle(s: Service) {
    const client = sb();
    if (!client) return;
    await client.from('services').update({ active: !s.active }).eq('id', s.id);
    await load();
  }

  return (
    <div>
      <div className="row-between mb-4">
        <h1 style={{ fontSize: '1.5rem' }}>{t(lang, 'svc_title')}</h1>
        <button className="btn btn-primary" onClick={startNew} disabled={editing !== null}>
          <Icon name="plus" size={16} /> {t(lang, 'svc_add')}
        </button>
      </div>

      {msg ? <div className={`alert ${msg.kind === 'ok' ? 'alert-ok' : 'alert-error'} mb-4`} role="status">{msg.text}</div> : null}

      {editing !== null ? (
        <form className="dash-card mb-4" onSubmit={onSave}>
          <h2>{editing === 'new' ? t(lang, 'svc_add') : t(lang, 'svc_edit')}</h2>
          <div className="form-grid mt-4">
            <div className="field">
              <label htmlFor="s-tro">{t(lang, 'svc_title_ro')} *</label>
              <input className="input" id="s-tro" required maxLength={140} value={form.title_ro} onChange={(e) => setForm({ ...form, title_ro: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="s-tru">{t(lang, 'svc_title_ru')}</label>
              <input className="input" id="s-tru" maxLength={140} value={form.title_ru} onChange={(e) => setForm({ ...form, title_ru: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="s-dro">{t(lang, 'svc_desc_ro')}</label>
            <textarea className="textarea" id="s-dro" maxLength={1200} value={form.description_ro} onChange={(e) => setForm({ ...form, description_ro: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="s-dru">{t(lang, 'svc_desc_ru')}</label>
            <textarea className="textarea" id="s-dru" maxLength={1200} value={form.description_ru} onChange={(e) => setForm({ ...form, description_ru: e.target.value })} />
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="s-cat">{t(lang, 'svc_category')}</label>
              <select className="select" id="s-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">—</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{pick(c, lang)}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="s-price">{t(lang, 'svc_price')}</label>
              <input className="input" id="s-price" type="number" min={0} step={1} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="s-pt">{t(lang, 'svc_price_type')}</label>
              <select className="select" id="s-pt" value={form.price_type} onChange={(e) => setForm({ ...form, price_type: e.target.value })}>
                {PRICE_TYPES.map((p) => <option key={p} value={p}>{t(lang, `pt_${p}` as any)}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="s-unit">{t(lang, 'svc_unit')}</label>
              <input className="input" id="s-unit" maxLength={40} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="MDL / persoană" />
            </div>
            <div className="field">
              <label htmlFor="s-sort">Sort</label>
              <input className="input" id="s-sort" type="number" value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} />
            </div>
            <div className="field">
              <span className="label">{t(lang, 'svc_image')}</span>
              <label className="btn btn-outline btn-sm">
                <Icon name="upload" size={16} /> {t(lang, 'f_upload')}
                <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onUpload} disabled={busy} />
              </label>
            </div>
          </div>

          {form.image_url ? (
            <div className="thumb" style={{ width: 120, height: 90, position: 'relative' }}>
              <Image src={form.image_url} alt="" fill sizes="120px" style={{ objectFit: 'cover' }} unoptimized />
              <button type="button" aria-label={t(lang, 'f_remove')} onClick={() => setForm({ ...form, image_url: '' })}>×</button>
            </div>
          ) : null}

          <label className="switch mt-4">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <span>{t(lang, 'svc_active')}</span>
          </label>

          <div className="btn-row mt-4">
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>{t(lang, 'dash_cancel')}</button>
          </div>
        </form>
      ) : null}

      <section className="dash-card">
        {loading ? (
          <p className="muted">{t(lang, 'c_loading')}</p>
        ) : rows.length ? (
          rows.map((s) => (
            <div className="list-row" key={s.id}>
              <div className="list-row-main row" style={{ gap: 12 }}>
                {s.image_url ? (
                  <div className="service-thumb" style={{ width: 74, height: 60 }}>
                    <Image src={s.image_url} alt="" width={148} height={120} style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                ) : null}
                <div>
                  <strong>{pickText(s, lang, 'title') || s.title_ro}</strong>
                  <div className="tiny muted">
                    {s.price ? money(s.price, firm.currency || 'MDL') : t(lang, 'pt_on_request')}
                    {s.category ? ` · ${pick(categories.find((c) => c.slug === s.category) as never, lang) || s.category}` : ''}
                  </div>
                  {!s.active ? <span className="badge badge-neutral mt-2">{t(lang, 'svc_inactive')}</span> : null}
                </div>
              </div>
              <div className="list-row-actions">
                <button className="btn btn-outline btn-sm" onClick={() => onToggle(s)}>
                  {s.active ? t(lang, 'svc_inactive') : t(lang, 'svc_active')}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => startEdit(s)}><Icon name="edit" size={15} /></button>
                <button className="btn btn-ghost btn-sm" onClick={() => onDelete(s.id)} aria-label={t(lang, 'dash_delete')}><Icon name="trash" size={15} /></button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">
            <h3>{t(lang, 'svc_empty')}</h3>
            <p>{t(lang, 'svc_empty_p')}</p>
            <button className="btn btn-primary mt-4" onClick={startNew}><Icon name="plus" size={16} /> {t(lang, 'svc_add')}</button>
          </div>
        )}
      </section>
    </div>
  );
}

/** local helper: pick the localized title/description of a service row */
function pickText(row: Record<string, any>, lang: Lang, base: string): string {
  const order = lang === 'ru' ? [`${base}_ru`, `${base}_ro`] : lang === 'en' ? [`${base}_en`, `${base}_ro`] : [`${base}_ro`, `${base}_ru`];
  for (const k of order) if (typeof row?.[k] === 'string' && row[k].trim()) return row[k];
  return '';
}
