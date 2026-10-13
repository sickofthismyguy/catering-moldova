'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/Icons';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { formatDateTime } from '@/lib/format';
import type { Lang } from '@/lib/types';

type Row = Record<string, any>;

export function AdminInquiries({ lang }: { lang: Lang }) {
  return <AdminFeed lang={lang} table="inquiries" title={t(lang, 'adm_inquiries')} kind="inquiry" />;
}

export function AdminReviews({ lang }: { lang: Lang }) {
  return <AdminFeed lang={lang} table="reviews" title={t(lang, 'adm_reviews')} kind="review" />;
}

/** Shared moderation feed for inquiries and reviews (admin-wide). */
function AdminFeed({ lang, table, title, kind }: { lang: Lang; table: string; title: string; kind: 'inquiry' | 'review' }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const load = useCallback(async () => {
    const client = sb();
    if (!client) { setLoading(false); return; }
    const { data, error } = await client.from(table).select('*, firms(name,slug)').order('created_at', { ascending: false }).limit(400);
    if (error) setMsg(error.message);
    setRows((data as Row[]) || []);
    setLoading(false);
  }, [table]);

  useEffect(() => { load(); }, [load]);

  async function patch(id: string, values: Record<string, unknown>) {
    const client = sb();
    if (!client) return;
    const { error } = await client.from(table).update(values).eq('id', id);
    if (error) { setMsg(error.message); return; }
    setMsg(t(lang, 'adm_saved'));
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...values } : x)));
  }

  async function remove(id: string) {
    if (!window.confirm(t(lang, 'dash_confirm_delete'))) return;
    const client = sb();
    if (!client) return;
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) { setMsg(error.message); return; }
    setRows((r) => r.filter((x) => x.id !== id));
  }

  const statuses = kind === 'inquiry' ? ['new', 'read', 'replied', 'archived', 'spam'] : ['pending', 'approved', 'rejected', 'spam'];
  const visible = filter === 'all' ? rows : rows.filter((r) => (r.status || statuses[0]) === filter);

  return (
    <div>
      <div className="row-between mb-4">
        <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
        <span className="tiny muted">{rows.length}</span>
      </div>

      {msg ? <div className="alert alert-info mb-4 small" role="status">{msg}</div> : null}

      <div className="chips mb-4">
        <button className={`chip ${filter === 'all' ? 'chip-active' : ''}`} onClick={() => setFilter('all')}>{t(lang, 'adm_all')} ({rows.length})</button>
        {statuses.map((s) => (
          <button key={s} className={`chip ${filter === s ? 'chip-active' : ''}`} onClick={() => setFilter(s)}>
            {s} ({rows.filter((r) => (r.status || statuses[0]) === s).length})
          </button>
        ))}
      </div>

      <section className="dash-card">
        {loading ? <p className="muted">{t(lang, 'c_loading')}</p> : visible.length ? visible.map((r) => (
          <div className="list-row" key={r.id}>
            <div className="list-row-main">
              <div className="row" style={{ gap: 8 }}>
                <strong>{kind === 'inquiry' ? r.name : r.author_name}</strong>
                <span className="badge badge-neutral">{r.firms?.name || '—'}</span>
                <span className="badge badge-warn">{r.status}</span>
                <span className="tiny muted">{formatDateTime(r.created_at, lang)}</span>
              </div>
              {kind === 'review' ? <div className="tiny muted mt-2">★ {r.rating}/5</div> : null}
              <p className="small muted mt-2">{kind === 'inquiry' ? r.message : (r.body || '')}</p>
              {kind === 'inquiry' ? (
                <p className="tiny muted mt-2">
                  {r.email}{r.phone ? ` · ${r.phone}` : ''}{r.guests ? ` · ${r.guests} ${t(lang, 'c_guests')}` : ''}{r.event_date ? ` · ${r.event_date}` : ''}
                </p>
              ) : null}
            </div>
            <div className="list-row-actions">
              <select
                className="select" style={{ width: 'auto', minHeight: 36, paddingBlock: 6 }}
                value={r.status || statuses[0]}
                onChange={(e) => patch(r.id, { status: e.target.value })}
                aria-label={t(lang, 'inq_status')}
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {kind === 'review' && r.status !== 'approved' ? (
                <button className="btn btn-primary btn-sm" onClick={() => patch(r.id, { status: 'approved' })}>
                  <Icon name="check" size={14} /> {t(lang, 'adm_approve')}
                </button>
              ) : null}
              <button className="btn btn-ghost btn-sm" onClick={() => remove(r.id)} aria-label={t(lang, 'dash_delete')}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>
        )) : <div className="empty"><h3>{t(lang, 'adm_empty')}</h3></div>}
      </section>
    </div>
  );
}
