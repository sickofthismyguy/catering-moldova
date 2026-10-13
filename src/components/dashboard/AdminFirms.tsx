'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/Icons';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { formatDate, initials } from '@/lib/format';
import type { Firm, Lang } from '@/lib/types';

const FILTERS = ['pending', 'approved', 'rejected', 'all'] as const;

export function AdminFirms({ lang }: { lang: Lang }) {
  const [rows, setRows] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('pending');
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = sb();
    if (!client) { setLoading(false); return; }
    const { data, error } = await client.from('firms').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) setMsg(error.message);
    setRows((data as Firm[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function patch(id: string, values: Record<string, unknown>) {
    const client = sb();
    if (!client) return;
    setBusy(id);
    const { error } = await client.from('firms').update(values).eq('id', id);
    setBusy(null);
    if (error) { setMsg(error.message); return; }
    setMsg(t(lang, 'adm_saved'));
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...values } as Firm : x)));
  }

  async function remove(id: string) {
    if (!window.confirm(t(lang, 'dash_confirm_delete'))) return;
    const client = sb();
    if (!client) return;
    setBusy(id);
    const { error } = await client.from('firms').delete().eq('id', id);
    setBusy(null);
    if (error) { setMsg(error.message); return; }
    setRows((r) => r.filter((x) => x.id !== id));
  }

  async function reject(id: string) {
    const reason = window.prompt(t(lang, 'adm_reject_reason')) ?? '';
    await patch(id, { status: 'rejected', rejection_reason: reason || null, published: false });
  }

  const visible = filter === 'all' ? rows : rows.filter((r) => (r.status || 'pending') === filter);
  const counts = FILTERS.reduce<Record<string, number>>((acc, f) => {
    acc[f] = f === 'all' ? rows.length : rows.filter((r) => (r.status || 'pending') === f).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="row-between mb-4">
        <h2 style={{ fontSize: '1.2rem' }}>{t(lang, 'adm_firms')}</h2>
        <span className="tiny muted">{rows.length}</span>
      </div>

      {msg ? <div className="alert alert-info mb-4 small" role="status">{msg}</div> : null}

      <div className="chips mb-4">
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? t(lang, 'adm_all') : t(lang, `dash_status_${f === 'pending' ? 'pending' : f === 'approved' ? 'approved' : 'rejected'}` as any)} ({counts[f]})
          </button>
        ))}
      </div>

      <section className="dash-card">
        {loading ? <p className="muted">{t(lang, 'c_loading')}</p> : visible.length ? visible.map((f) => (
          <div className="list-row" key={f.id}>
            <div className="list-row-main row" style={{ gap: 12 }}>
              <div className="avatar" aria-hidden="true">{initials(f.name)}</div>
              <div style={{ minWidth: 0 }}>
                <strong>{f.name}</strong>
                <div className="tiny muted">
                  {f.city || '—'} · {t(lang, 'adm_owner_email')}: {(f as any).owner_email
                    ? <a href={`mailto:${(f as any).owner_email}`}>{(f as any).owner_email}</a>
                    : <span>—</span>}
                  {(f as any).source_url ? (
                    <> · <a href={(f as any).source_url} target="_blank" rel="noopener noreferrer">sursă lead</a></>
                  ) : null}
                </div>
                {(f as any).source_note ? <p className="tiny muted mt-2">↳ {(f as any).source_note}</p> : null}
                <div className="row mt-2" style={{ gap: 6 }}>
                  <span className={`badge ${f.status === 'approved' ? 'badge-ok' : f.status === 'rejected' ? 'badge-danger' : 'badge-warn'}`}>{f.status || 'pending'}</span>
                  {f.published ? <span className="badge badge-info">{t(lang, 'dash_published')}</span> : <span className="badge badge-neutral">{t(lang, 'dash_unpublished')}</span>}
                  {f.verified ? <span className="badge badge-ok">{t(lang, 'adm_verified')}</span> : null}
                  <span className="tiny muted">{formatDate(f.created_at, lang)}</span>
                </div>
                {f.rejection_reason ? <p className="tiny muted mt-2">↳ {f.rejection_reason}</p> : null}
              </div>
            </div>

            <div className="list-row-actions">
              {f.status !== 'approved' ? (
                <button className="btn btn-primary btn-sm" disabled={busy === f.id} onClick={() => patch(f.id, { status: 'approved', published: true, rejection_reason: null })}>
                  <Icon name="check" size={14} /> {t(lang, 'adm_approve')}
                </button>
              ) : null}
              {f.status !== 'rejected' ? (
                <button className="btn btn-outline btn-sm" disabled={busy === f.id} onClick={() => reject(f.id)}>{t(lang, 'adm_reject')}</button>
              ) : null}
              <button className="btn btn-outline btn-sm" disabled={busy === f.id} onClick={() => patch(f.id, { verified: !f.verified })}>
                <Icon name="shield" size={14} /> {f.verified ? '−' : '+'}
              </button>
              <button className="btn btn-outline btn-sm" disabled={busy === f.id} onClick={() => patch(f.id, { published: !f.published })}>
                <Icon name="eye" size={14} />
              </button>
              <Link className="btn btn-ghost btn-sm" href={`/${lang}/firma/${f.slug}`} target="_blank" aria-label={t(lang, 'adm_view_site')}>
                <Icon name="external" size={14} />
              </Link>
              <button className="btn btn-ghost btn-sm" disabled={busy === f.id} onClick={() => remove(f.id)} aria-label={t(lang, 'dash_delete')}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        )) : <div className="empty"><h3>{t(lang, 'adm_empty')}</h3></div>}
      </section>
    </div>
  );
}
