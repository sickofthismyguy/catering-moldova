'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { DashboardGate } from './Gate';
import { Icon } from '@/components/Icons';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { DEMO_MODE } from '@/lib/config';
import { formatDate, money } from '@/lib/format';
import type { Firm, Lang } from '@/lib/types';

function completeness(f: Firm | null, services: number): number {
  if (!f) return 0;
  const checks = [
    Boolean(f.name), Boolean(f.description_ro), Boolean(f.city), Boolean(f.phone), Boolean(f.email),
    f.price_from !== null && f.price_from !== undefined, Boolean(f.min_guests), Boolean(f.max_guests),
    Boolean(f.cuisines?.length), Boolean(f.event_types?.length), (f.gallery?.length ?? 0) >= 3,
    Boolean(f.logo_url), services >= 1, Boolean(f.tagline_ro),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function Overview({ lang }: { lang: Lang }) {
  const L = (p: string) => `/${lang}${p}`;

  return (
    <DashboardGate lang={lang}>
      {({ firm, user, refresh, isAdmin }) => (
        <OverviewBody lang={lang} firm={firm} email={user.email} refresh={refresh} isAdmin={isAdmin} L={L} />
      )}
    </DashboardGate>
  );
}

function OverviewBody({
  lang, firm, email, refresh, isAdmin, L,
}: {
  lang: Lang; firm: Firm | null; email: string; refresh: () => Promise<void>; isAdmin: boolean; L: (p: string) => string;
}) {
  const [counts, setCounts] = useState({ inquiries: 0, services: 0, newInquiries: 0 });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadCounts = useCallback(async () => {
    const client = sb();
    if (!client || !firm) return;
    const [inq, svc, fresh] = await Promise.all([
      client.from('inquiries').select('id', { count: 'exact', head: true }).eq('firm_id', firm.id),
      client.from('services').select('id', { count: 'exact', head: true }).eq('firm_id', firm.id).eq('active', true),
      client.from('inquiries').select('id', { count: 'exact', head: true }).eq('firm_id', firm.id).eq('status', 'new'),
    ]);
    setCounts({ inquiries: inq.count ?? 0, services: svc.count ?? 0, newInquiries: fresh.count ?? 0 });
  }, [firm]);

  useEffect(() => { loadCounts(); }, [loadCounts]);

  async function togglePublished() {
    const client = sb();
    if (!client || !firm) return;
    setBusy(true);
    const { error } = await client.from('firms').update({ published: !firm.published }).eq('id', firm.id);
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg(t(lang, 'dash_saved'));
    await refresh();
  }

  const pct = completeness(firm, counts.services);
  const status = firm?.status || 'pending';

  return (
    <div>
      <div className="row-between mb-4">
        <h1 style={{ fontSize: '1.5rem' }}>{t(lang, 'dash_title')}</h1>
        <span className="tiny muted">{email}</span>
      </div>

      {DEMO_MODE ? <div className="alert alert-warn mb-4">{t(lang, 'dash_demo_notice')}</div> : null}
      {msg ? <div className="alert alert-ok mb-4" role="status">{msg}</div> : null}

      {!firm ? (
        <div className="card empty">
          <h2>{t(lang, 'dash_no_firm')}</h2>
          <p className="muted mt-2">{t(lang, 'auth_register_p')}</p>
          <Link className="btn btn-primary mt-4" href={L('/cont/inregistrare')}>{t(lang, 'dash_create_firm')}</Link>
        </div>
      ) : (
        <>
          {/* status */}
          <section className="dash-card">
            <div className="row-between">
              <div>
                <h2>{t(lang, 'dash_status')}</h2>
                <p className="muted small mt-2">
                  {status === 'pending' ? t(lang, 'dash_status_pending_p')
                    : status === 'approved' ? t(lang, 'dash_status_approved_p')
                    : (firm.rejection_reason || t(lang, 'dash_status_rejected'))}
                </p>
              </div>
              <div className="row" style={{ gap: 8 }}>
                {status === 'pending' ? <span className="badge badge-warn">{t(lang, 'dash_status_pending')}</span> : null}
                {status === 'approved' ? <span className="badge badge-ok">{t(lang, 'dash_status_approved')}</span> : null}
                {status === 'rejected' ? <span className="badge badge-danger">{t(lang, 'dash_status_rejected')}</span> : null}
                {firm.published
                  ? <span className="badge badge-info">{t(lang, 'dash_published')}</span>
                  : <span className="badge badge-neutral">{t(lang, 'dash_unpublished')}</span>}
              </div>
            </div>

            <div className="btn-row mt-4">
              <button className="btn btn-outline" onClick={togglePublished} disabled={busy || status !== 'approved'}>
                <Icon name={firm.published ? 'eye' : 'x'} size={16} />
                {firm.published ? t(lang, 'dash_unpublish') : t(lang, 'dash_publish')}
              </button>
              <Link className="btn btn-primary" href={L('/cont/profil')}>{t(lang, 'dash_edit_profile')}</Link>
              <Link className="btn btn-outline" href={L('/cont/servicii')}>{t(lang, 'dash_add_service')}</Link>
              {status === 'approved' && firm.published ? (
                <Link className="btn btn-ghost" href={L(`/firma/${firm.slug}`)} target="_blank">
                  <Icon name="external" size={16} /> {t(lang, 'adm_view_site')}
                </Link>
              ) : null}
            </div>
            {status !== 'approved' ? (
              <p className="tiny muted mt-3">
                <Icon name="info" size={13} className="ico-inline" />{' '}
                {lang === 'ru' ? 'Кнопка публикации станет активной после одобрения профиля администратором.' : 'Butonul de publicare devine activ după aprobarea profilului de către administrator.'}
              </p>
            ) : null}
          </section>

          {/* KPIs */}
          <div className="kpis mt-4">
            <Link className="kpi" href={L('/cont/intrebari')}>
              <b>{counts.inquiries}</b><span>{t(lang, 'dash_inquiries_count')}</span>
              {counts.newInquiries > 0 ? <span className="badge badge-danger mt-2">+{counts.newInquiries}</span> : null}
            </Link>
            <Link className="kpi" href={L('/cont/servicii')}>
              <b>{counts.services}</b><span>{t(lang, 'dash_services_count')}</span>
            </Link>
            <div className="kpi"><b>{firm.views ?? 0}</b><span>{t(lang, 'dash_views')}</span></div>
            <div className="kpi"><b>{firm.price_from ? money(firm.price_from, firm.currency || 'MDL') : '—'}</b><span>{t(lang, 'firm_price_from')}</span></div>
          </div>

          {/* completeness */}
          <section className="dash-card mt-4">
            <div className="row-between">
              <h2>{t(lang, 'dash_completeness')}</h2>
              <strong>{pct}%</strong>
            </div>
            <div className="meter mt-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t(lang, 'dash_completeness')}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <p className="muted small mt-3">{t(lang, 'dash_completeness_p')}</p>
            <div className="chips mt-3">
              {!firm.description_ro ? <Link className="chip" href={L('/cont/profil')}>+ {t(lang, 'f_full_desc_ro')}</Link> : null}
              {(firm.gallery?.length ?? 0) < 3 ? <Link className="chip" href={L('/cont/profil')}>+ {t(lang, 'f_gallery')}</Link> : null}
              {!firm.logo_url ? <Link className="chip" href={L('/cont/profil')}>+ {t(lang, 'f_logo')}</Link> : null}
              {counts.services < 1 ? <Link className="chip" href={L('/cont/servicii')}>+ {t(lang, 'svc_title')}</Link> : null}
              {!firm.price_from ? <Link className="chip" href={L('/cont/profil')}>+ {t(lang, 'f_price_from')}</Link> : null}
              {!firm.whatsapp ? <Link className="chip" href={L('/cont/profil')}>+ WhatsApp</Link> : null}
            </div>
          </section>

          {isAdmin ? (
            <section className="dash-card mt-4">
              <h2>{t(lang, 'dash_nav_admin')}</h2>
              <p className="muted small mt-2">{t(lang, 'adm_settings_p')}</p>
              <Link className="btn btn-soft mt-3" href={L('/cont/admin')}>{t(lang, 'adm_title')} →</Link>
            </section>
          ) : null}

          <p className="tiny muted mt-4">
            {lang === 'ru' ? 'Аккаунт создан' : 'Cont creat'}: {formatDate(firm.created_at, lang)}
          </p>
        </>
      )}
    </div>
  );
}
