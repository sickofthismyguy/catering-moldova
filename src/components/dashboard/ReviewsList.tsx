'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardGate } from './Gate';
import { Stars } from '@/components/Stars';
import { sb } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { formatDate } from '@/lib/format';
import type { Firm, Lang, Review } from '@/lib/types';

const BADGE: Record<string, string> = { pending: 'badge-warn', approved: 'badge-ok', rejected: 'badge-neutral', spam: 'badge-danger' };

export function ReviewsList({ lang }: { lang: Lang }) {
  return (
    <DashboardGate lang={lang}>
      {({ firm }) => <ReviewsBody lang={lang} firm={firm} />}
    </DashboardGate>
  );
}

function ReviewsBody({ lang, firm }: { lang: Lang; firm: Firm | null }) {
  const [rows, setRows] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const client = sb();
    if (!client || !firm) { setLoading(false); return; }
    const { data } = await client.from('reviews').select('*').eq('firm_id', firm.id).order('created_at', { ascending: false }).limit(200);
    setRows((data as Review[]) || []);
    setLoading(false);
  }, [firm]);

  useEffect(() => { load(); }, [load]);

  if (!firm) return <div className="card empty"><h2>{t(lang, 'dash_no_firm')}</h2></div>;

  return (
    <div>
      <h1 className="mb-4" style={{ fontSize: '1.5rem' }}>{t(lang, 'dash_nav_reviews')}</h1>
      <div className="alert alert-info mb-4 small">
        {lang === 'ru'
          ? 'Отзывы публикуются после проверки администратором. Здесь вы видите все отзывы о вашей компании.'
          : 'Recenziile devin publice după aprobarea administratorului. Aici vezi toate recenziile firmei tale.'}
      </div>

      <section className="dash-card">
        {loading ? (
          <p className="muted">{t(lang, 'c_loading')}</p>
        ) : rows.length ? (
          rows.map((r) => (
            <div className="review" key={r.id}>
              <div className="review-head">
                <span className="review-author">{r.author_name}</span>
                <Stars value={r.rating} />
                <span className={`badge ${BADGE[r.status || 'pending']}`}>{r.status || 'pending'}</span>
                <span className="tiny muted">{formatDate(r.created_at, lang)}</span>
              </div>
              {r.title ? <p className="strong small">{r.title}</p> : null}
              {r.body ? <p className="muted small mt-2">{r.body}</p> : null}
            </div>
          ))
        ) : (
          <div className="empty">
            <h3>{t(lang, 'firm_no_reviews')}</h3>
          </div>
        )}
      </section>
    </div>
  );
}
