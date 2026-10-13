'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardGate } from './Gate';
import { Icon } from '@/components/Icons';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { formatDateTime, mailHref, telHref, waHref } from '@/lib/format';
import type { Firm, Inquiry, InquiryStatus, Lang } from '@/lib/types';

const STATUSES: InquiryStatus[] = ['new', 'read', 'replied', 'archived', 'spam'];
const BADGE: Record<InquiryStatus, string> = {
  new: 'badge-danger', read: 'badge-info', replied: 'badge-ok', archived: 'badge-neutral', spam: 'badge-warn',
};

export function InquiriesManager({ lang }: { lang: Lang }) {
  return (
    <DashboardGate lang={lang}>
      {({ firm }) => <InquiriesBody lang={lang} firm={firm} />}
    </DashboardGate>
  );
}

function InquiriesBody({ lang, firm }: { lang: Lang; firm: Firm | null }) {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | InquiryStatus>('all');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    const client = sb();
    if (!client || !firm) { setLoading(false); return; }
    const { data } = await client.from('inquiries').select('*').eq('firm_id', firm.id).order('created_at', { ascending: false }).limit(300);
    setRows((data as Inquiry[]) || []);
    setLoading(false);
  }, [firm]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: InquiryStatus) {
    const client = sb();
    if (!client) return;
    await client.from('inquiries').update({ status }).eq('id', id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  async function remove(id: string) {
    if (!window.confirm(t(lang, 'dash_confirm_delete'))) return;
    const client = sb();
    if (!client) return;
    await client.from('inquiries').delete().eq('id', id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  if (!firm) return <div className="card empty"><h2>{t(lang, 'dash_no_firm')}</h2></div>;

  const visible = filter === 'all' ? rows : rows.filter((r) => (r.status || 'new') === filter);
  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = rows.filter((r) => (r.status || 'new') === s).length;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: '1.5rem' }}>{t(lang, 'inq_title')}</h1>

      <div className="chips mb-4">
        <button className={`chip ${filter === 'all' ? 'chip-active' : ''}`} onClick={() => setFilter('all')}>
          {t(lang, 'adm_all')} ({rows.length})
        </button>
        {STATUSES.map((s) => (
          <button key={s} className={`chip ${filter === s ? 'chip-active' : ''}`} onClick={() => setFilter(s)}>
            {t(lang, `inq_${s}` as any)} ({counts[s] || 0})
          </button>
        ))}
      </div>

      <section className="dash-card">
        {loading ? (
          <p className="muted">{t(lang, 'c_loading')}</p>
        ) : visible.length ? (
          visible.map((q) => {
            const expanded = open === q.id;
            const status = (q.status || 'new') as InquiryStatus;
            const subject = lang === 'ru' ? `Re: заявка — ${firm.name}` : `Re: cerere — ${firm.name}`;
            return (
              <div className="list-row" key={q.id}>
                <div className="list-row-main">
                  <div className="row" style={{ gap: 8 }}>
                    <strong>{q.name}</strong>
                    <span className={`badge ${BADGE[status]}`}>{t(lang, `inq_${status}` as any)}</span>
                    <span className="tiny muted">{formatDateTime(q.created_at, lang)}</span>
                  </div>
                  <p className="small muted mt-2" style={{ display: expanded ? 'block' : '-webkit-box', WebkitLineClamp: expanded ? undefined : 2, WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden' }}>
                    {q.message}
                  </p>
                  {expanded ? (
                    <div className="facts mt-3">
                      <div className="fact"><b>{t(lang, 'f_email')}</b><span><a href={mailHref(q.email, subject)}>{q.email}</a></span></div>
                      {q.phone ? <div className="fact"><b>{t(lang, 'f_phone')}</b><span><a href={telHref(q.phone)}>{q.phone}</a> · <a href={waHref(q.phone)} target="_blank" rel="noopener">WhatsApp</a></span></div> : null}
                      {q.event_date ? <div className="fact"><b>{t(lang, 'inq_date')}</b><span>{q.event_date}</span></div> : null}
                      {q.guests ? <div className="fact"><b>{t(lang, 'f_guests')}</b><span>{q.guests}</span></div> : null}
                    </div>
                  ) : null}
                </div>

                <div className="list-row-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setOpen(expanded ? null : q.id)} aria-expanded={expanded}>
                    {expanded ? t(lang, 'c_close') : t(lang, 'c_read_more')}
                  </button>
                  <a className="btn btn-primary btn-sm" href={mailHref(q.email, subject)}>
                    <Icon name="mail" size={15} /> {t(lang, 'inq_reply')}
                  </a>
                  <select
                    className="select"
                    style={{ width: 'auto', minHeight: 36, paddingBlock: 6 }}
                    value={status}
                    onChange={(e) => setStatus(q.id, e.target.value as InquiryStatus)}
                    aria-label={t(lang, 'inq_status')}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{t(lang, `inq_${s}` as any)}</option>)}
                  </select>
                  <button className="btn btn-ghost btn-sm" onClick={() => remove(q.id)} aria-label={t(lang, 'dash_delete')}>
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty">
            <h3>{t(lang, 'inq_empty')}</h3>
            <p>{t(lang, 'inq_empty_p')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
