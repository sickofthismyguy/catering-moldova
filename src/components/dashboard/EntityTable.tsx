'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/Icons';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'boolean' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  hideInTable?: boolean;
  placeholder?: string;
}

/**
 * Generic no-code CRUD table used by the admin for cities, categories and
 * taxonomies (cuisines / dietary). Reads and writes straight to Supabase;
 * RLS allows this only for administrators.
 */
export function EntityTable({
  lang, table, fields, title, order = { column: 'priority', ascending: false },
}: {
  lang: Lang;
  table: string;
  fields: FieldDef[];
  title: string;
  order?: { column: string; ascending: boolean };
}) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const blank = useCallback(() => {
    const o: Record<string, any> = {};
    for (const f of fields) o[f.key] = f.type === 'boolean' ? true : f.type === 'number' ? 0 : '';
    return o;
  }, [fields]);

  const load = useCallback(async () => {
    const client = sb();
    if (!client) { setLoading(false); return; }
    const { data, error } = await client.from(table).select('*').order(order.column, { ascending: order.ascending }).limit(500);
    if (error) setMsg(error.message);
    setRows((data as Record<string, any>[]) || []);
    setLoading(false);
  }, [table, order.column, order.ascending]);

  useEffect(() => { load(); }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const client = sb();
    if (!client) return;
    setBusy(true);
    setMsg(null);
    const payload: Record<string, any> = {};
    for (const f of fields) {
      const v = form[f.key];
      payload[f.key] = f.type === 'number' ? (v === '' || v === null ? null : Number(v)) : f.type === 'boolean' ? Boolean(v) : (v === '' ? null : String(v));
    }
    const { error } = editing === 'new'
      ? await client.from(table).insert(payload)
      : await client.from(table).update(payload).eq('id', editing);
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg(t(lang, 'adm_saved'));
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!window.confirm(t(lang, 'dash_confirm_delete'))) return;
    const client = sb();
    if (!client) return;
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) { setMsg(error.message); return; }
    await load();
  }

  const tableFields = fields.filter((f) => !f.hideInTable);

  return (
    <div>
      <div className="row-between mb-4">
        <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm(blank()); setEditing('new'); setMsg(null); }}>
          <Icon name="plus" size={15} /> {t(lang, 'adm_add')}
        </button>
      </div>

      {msg ? <div className="alert alert-info mb-4 small" role="status">{msg}</div> : null}

      {editing !== null ? (
        <form className="dash-card mb-4" onSubmit={save}>
          <div className="form-grid">
            {fields.map((f) => (
              <div className={`field ${f.type === 'textarea' ? 'full' : ''}`} key={f.key}>
                <label htmlFor={`f-${table}-${f.key}`}>{f.label}{f.required ? ' *' : ''}</label>
                {f.type === 'textarea' ? (
                  <textarea className="textarea" id={`f-${table}-${f.key}`} style={{ minHeight: 70 }}
                    value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                ) : f.type === 'select' ? (
                  <select className="select" id={`f-${table}-${f.key}`} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    <option value="">—</option>
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'boolean' ? (
                  <label className="switch">
                    <input type="checkbox" id={`f-${table}-${f.key}`} checked={Boolean(form[f.key])} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />
                    <span>{t(lang, 'c_yes')}</span>
                  </label>
                ) : (
                  <input className="input" id={`f-${table}-${f.key}`} type={f.type === 'number' ? 'number' : 'text'} step={f.type === 'number' ? 'any' : undefined}
                    required={f.required} placeholder={f.placeholder}
                    value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <div className="btn-row">
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(null)}>{t(lang, 'dash_cancel')}</button>
          </div>
        </form>
      ) : null}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {tableFields.map((f) => <th key={f.key}>{f.label}</th>)}
              <th style={{ width: 90 }} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={tableFields.length + 1} className="muted">{t(lang, 'c_loading')}</td></tr>
            ) : rows.length ? (
              rows.map((row) => (
                <tr key={row.id}>
                  {tableFields.map((f) => (
                    <td key={f.key}>
                      {f.type === 'boolean'
                        ? row[f.key] ? <span className="badge badge-ok">{t(lang, 'c_yes')}</span> : <span className="badge badge-neutral">{t(lang, 'c_no')}</span>
                        : <span style={{ wordBreak: 'break-word' }}>{String(row[f.key] ?? '—').slice(0, 60)}</span>}
                    </td>
                  ))}
                  <td>
                    <div className="list-row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...row }); setEditing(row.id); setMsg(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label={t(lang, 'svc_edit')}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(row.id)} aria-label={t(lang, 'dash_delete')}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={tableFields.length + 1} className="muted">{t(lang, 'adm_empty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="tiny muted mt-3">{rows.length} {t(lang, 'c_results')} · {t(lang, 'adm_export_hint')}</p>
    </div>
  );
}
