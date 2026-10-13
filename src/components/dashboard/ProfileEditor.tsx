'use client';

import Image from 'next/image';
import { useState } from 'react';
import { DashboardGate } from './Gate';
import { Icon } from '@/components/Icons';
import { sb, uploadMedia } from '@/lib/supabase-browser';
import { t } from '@/lib/i18n';
import { pick, slugify } from '@/lib/format';
import type { Category, City, Firm, Lang, Taxonomy } from '@/lib/types';

interface Props {
  lang: Lang;
  cities: City[];
  events: Category[];
  cuisines: Taxonomy[];
  dietary: Taxonomy[];
}

export function ProfileEditor(props: Props) {
  return (
    <DashboardGate lang={props.lang}>
      {({ firm, user, refresh }) => <ProfileForm {...props} firm={firm} userId={user.id} refresh={refresh} />}
    </DashboardGate>
  );
}

function ProfileForm({ lang, cities, events, cuisines, dietary, firm, userId, refresh }: Props & { firm: Firm | null; userId: string; refresh: () => Promise<void> }) {
  const [form, setForm] = useState<Record<string, any>>({
    name: firm?.name || '',
    slug: firm?.slug || '',
    tagline_ro: firm?.tagline_ro || '',
    tagline_ru: firm?.tagline_ru || '',
    description_ro: firm?.description_ro || '',
    description_ru: firm?.description_ru || '',
    city: firm?.city || cities[0]?.slug || '',
    region: firm?.region || '',
    address: firm?.address || '',
    phone: firm?.phone || '',
    whatsapp: firm?.whatsapp || '',
    email: firm?.email || '',
    website: firm?.website || '',
    price_from: firm?.price_from ?? '',
    currency: firm?.currency || 'MDL',
    min_guests: firm?.min_guests ?? '',
    max_guests: firm?.max_guests ?? '',
    map_lat: firm?.map_lat ?? '',
    map_lng: firm?.map_lng ?? '',
    seo_title: firm?.seo_title || '',
    seo_description_ro: firm?.seo_description_ro || '',
    seo_description_ru: firm?.seo_description_ru || '',
    cuisines: firm?.cuisines || [],
    event_types: firm?.event_types || [],
    dietary: firm?.dietary || [],
    gallery: firm?.gallery || [],
    logo_url: firm?.logo_url || '',
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const toggleArray = (key: string, value: string) =>
    setForm((f) => {
      const arr: string[] = Array.isArray(f[key]) ? f[key] : [];
      return { ...f, [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] };
    });

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>, kind: 'logo' | 'gallery') {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMsg(null);
    const urls: string[] = [];
    for (const file of files.slice(0, kind === 'logo' ? 1 : 12)) {
      const res = await uploadMedia(file, userId, kind);
      if (res.url) urls.push(res.url);
      else if (res.error === 'size') setMsg({ kind: 'error', text: lang === 'ru' ? 'Файл больше 5 МБ.' : 'Fișierul depășește 5 MB.' });
      else if (res.error === 'type') setMsg({ kind: 'error', text: lang === 'ru' ? 'Только JPG, PNG или WebP.' : 'Doar JPG, PNG sau WebP.' });
    }
    setUploading(false);
    e.target.value = '';
    if (!urls.length) return;
    if (kind === 'logo') set('logo_url', urls[0]);
    else set('gallery', [...(form.gallery as string[]), ...urls].slice(0, 12));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const client = sb();
    if (!client) return;
    setBusy(true);
    setMsg(null);

    const slug = slugify(String(form.slug || form.name));
    const payload: Record<string, unknown> = {
      ...form,
      slug,
      price_from: form.price_from === '' ? null : Number(form.price_from),
      min_guests: form.min_guests === '' ? null : Number(form.min_guests),
      max_guests: form.max_guests === '' ? null : Number(form.max_guests),
      map_lat: form.map_lat === '' ? null : Number(form.map_lat),
      map_lng: form.map_lng === '' ? null : Number(form.map_lng),
      logo_url: form.logo_url || null,
      updated_at: new Date().toISOString(),
    };
    delete (payload as any).id;

    const { error } = await client.from('firms').update(payload).eq('id', firm!.id);
    setBusy(false);
    if (error) {
      setMsg({
        kind: 'error',
        text: error.code === '23505'
          ? lang === 'ru' ? 'Этот адрес страницы (slug) уже занят. Измените его.' : 'Această adresă (slug) este deja folosită. Alege alta.'
          : error.message,
      });
      return;
    }
    setMsg({ kind: 'ok', text: t(lang, 'dash_saved') });
    await refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!firm) {
    return (
      <div className="card empty">
        <h2>{t(lang, 'dash_no_firm')}</h2>
        <p className="muted mt-2">{t(lang, 'auth_register_p')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSave}>
      <div className="row-between mb-4">
        <h1 style={{ fontSize: '1.5rem' }}>{t(lang, 'prof_title')}</h1>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}
        </button>
      </div>
      <p className="muted small mb-4">{t(lang, 'prof_p')}</p>

      {msg ? <div className={`alert ${msg.kind === 'ok' ? 'alert-ok' : 'alert-error'} mb-4`} role="status">{msg.text}</div> : null}

      {/* ------------------------------------------------------------ media */}
      <section className="dash-card">
        <h2>{t(lang, 'prof_media')}</h2>

        <div className="field mt-4">
          <span className="label">{t(lang, 'f_logo')}</span>
          <div className="upload-drop">
            {form.logo_url ? (
              <div className="thumb" style={{ width: 84, height: 84 }}>
                <Image src={form.logo_url} alt="" width={84} height={84} style={{ objectFit: 'cover' }} unoptimized />
                <button type="button" aria-label={t(lang, 'f_remove')} onClick={() => set('logo_url', '')}>×</button>
              </div>
            ) : (
              <div className="thumb" style={{ width: 84, height: 84, display: 'grid', placeItems: 'center', color: 'var(--text-3)' }}>
                <Icon name="image" size={22} />
              </div>
            )}
            <label className="btn btn-outline btn-sm">
              <Icon name="upload" size={16} /> {t(lang, 'f_upload')}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => onUpload(e, 'logo')} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="field">
          <span className="label">{t(lang, 'f_gallery')}</span>
          <span className="hint mb-3">{t(lang, 'f_gallery_p')}</span>
          <label className="btn btn-outline btn-sm">
            <Icon name="upload" size={16} /> {uploading ? t(lang, 'prof_uploading') : t(lang, 'f_upload')}
            <input type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={(e) => onUpload(e, 'gallery')} disabled={uploading} />
          </label>
          {form.gallery?.length ? (
            <div className="thumb-grid">
              {form.gallery.map((url: string, i: number) => (
                <div className="thumb" key={`${url}-${i}`}>
                  <Image src={url} alt="" fill sizes="120px" style={{ objectFit: 'cover' }} unoptimized />
                  <button type="button" aria-label={t(lang, 'f_remove')}
                    onClick={() => set('gallery', (form.gallery as string[]).filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ------------------------------------------------------------ basic */}
      <section className="dash-card mt-4">
        <h2>{t(lang, 'prof_basic')}</h2>
        <div className="form-grid mt-4">
          <div className="field">
            <label htmlFor="p-name">{t(lang, 'f_name_firm')} *</label>
            <input className="input" id="p-name" required maxLength={120} value={form.name}
              onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-slug">{t(lang, 'f_slug')}</label>
            <input className="input" id="p-slug" maxLength={70} value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              onBlur={(e) => { if (!e.target.value) set('slug', slugify(form.name)); }} />
            <span className="hint">/ro/firma/{slugify(form.slug || form.name) || '…'}</span>
          </div>
        </div>

        <div className="field">
          <label htmlFor="p-tag-ro">{t(lang, 'f_tagline_ro')}</label>
          <input className="input" id="p-tag-ro" maxLength={160} value={form.tagline_ro} onChange={(e) => set('tagline_ro', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="p-tag-ru">{t(lang, 'f_tagline_ru')}</label>
          <input className="input" id="p-tag-ru" maxLength={160} value={form.tagline_ru} onChange={(e) => set('tagline_ru', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="p-desc-ro">{t(lang, 'f_full_desc_ro')}</label>
          <textarea className="textarea" id="p-desc-ro" maxLength={4000} value={form.description_ro} onChange={(e) => set('description_ro', e.target.value)} />
          <span className="hint">{lang === 'ru' ? 'Рекомендуется 500–1500 символов: что готовите, как работаете, что входит в цену.' : 'Recomandat 500–1500 de caractere: ce gătiți, cum lucrați, ce include prețul.'}</span>
        </div>
        <div className="field">
          <label htmlFor="p-desc-ru">{t(lang, 'f_full_desc_ru')}</label>
          <textarea className="textarea" id="p-desc-ru" maxLength={4000} value={form.description_ru} onChange={(e) => set('description_ru', e.target.value)} />
        </div>
      </section>

      {/* ---------------------------------------------------------- contact */}
      <section className="dash-card mt-4">
        <h2>{t(lang, 'prof_contact')}</h2>
        <div className="form-grid mt-4">
          <div className="field">
            <label htmlFor="p-city">{t(lang, 'f_city')} *</label>
            <select className="select" id="p-city" required value={form.city} onChange={(e) => set('city', e.target.value)}>
              {cities.map((c) => <option key={c.slug} value={c.slug}>{pick(c, lang)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="p-region">{t(lang, 'f_region')}</label>
            <input className="input" id="p-region" maxLength={80} value={form.region} onChange={(e) => set('region', e.target.value)} />
          </div>
          <div className="field full">
            <label htmlFor="p-address">{t(lang, 'f_address')}</label>
            <input className="input" id="p-address" maxLength={180} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-phone">{t(lang, 'f_phone')}</label>
            <input className="input" id="p-phone" type="tel" maxLength={40} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+373 6X XXX XXX" />
          </div>
          <div className="field">
            <label htmlFor="p-wa">WhatsApp</label>
            <input className="input" id="p-wa" type="tel" maxLength={40} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+3736XXXXXXX" />
          </div>
          <div className="field">
            <label htmlFor="p-email">{t(lang, 'f_email')}</label>
            <input className="input" id="p-email" type="email" maxLength={160} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-site">{t(lang, 'f_website')}</label>
            <input className="input" id="p-site" type="url" maxLength={180} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
          </div>
          <div className="field">
            <label htmlFor="p-lat">Lat</label>
            <input className="input" id="p-lat" type="number" step="0.0001" value={form.map_lat} onChange={(e) => set('map_lat', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-lng">Lng</label>
            <input className="input" id="p-lng" type="number" step="0.0001" value={form.map_lng} onChange={(e) => set('map_lng', e.target.value)} />
          </div>
        </div>
        <p className="hint">{t(lang, 'f_map_hint')}</p>
      </section>

      {/* ---------------------------------------------------------- details */}
      <section className="dash-card mt-4">
        <h2>{t(lang, 'prof_details')}</h2>
        <div className="form-grid mt-4">
          <div className="field">
            <label htmlFor="p-price">{t(lang, 'f_price_from')}</label>
            <input className="input" id="p-price" type="number" min={0} step={10} value={form.price_from} onChange={(e) => set('price_from', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-cur">{t(lang, 'f_currency')}</label>
            <select className="select" id="p-cur" value={form.currency} onChange={(e) => set('currency', e.target.value)}>
              <option value="MDL">MDL</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="p-min">{t(lang, 'f_min_guests')}</label>
            <input className="input" id="p-min" type="number" min={1} max={20000} value={form.min_guests} onChange={(e) => set('min_guests', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="p-max">{t(lang, 'f_max_guests')}</label>
            <input className="input" id="p-max" type="number" min={1} max={20000} value={form.max_guests} onChange={(e) => set('max_guests', e.target.value)} />
          </div>
        </div>

        <fieldset>
          <legend>{t(lang, 'f_events')}</legend>
          <div className="checks">
            {events.map((e) => (
              <label className="check" key={e.slug}>
                <input type="checkbox" checked={form.event_types?.includes(e.slug)} onChange={() => toggleArray('event_types', e.slug)} />
                {pick(e, lang)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>{t(lang, 'f_cuisines')}</legend>
          <div className="checks">
            {cuisines.map((c) => (
              <label className="check" key={c.slug}>
                <input type="checkbox" checked={form.cuisines?.includes(c.slug)} onChange={() => toggleArray('cuisines', c.slug)} />
                {pick(c, lang)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>{t(lang, 'f_dietary')}</legend>
          <div className="checks">
            {dietary.map((d) => (
              <label className="check" key={d.slug}>
                <input type="checkbox" checked={form.dietary?.includes(d.slug)} onChange={() => toggleArray('dietary', d.slug)} />
                {pick(d, lang)}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* -------------------------------------------------------------- seo */}
      <section className="dash-card mt-4">
        <h2>{t(lang, 'prof_seo')}</h2>
        <p className="hint mb-4">
          {lang === 'ru' ? 'Если оставить пустым, заголовок и описание будут созданы автоматически.' : 'Dacă lași gol, titlul și descrierea se generează automat.'}
        </p>
        <div className="field">
          <label htmlFor="p-seo-title">{t(lang, 'f_seo_title')}</label>
          <input className="input" id="p-seo-title" maxLength={70} value={form.seo_title} onChange={(e) => set('seo_title', e.target.value)} />
          <span className="hint">{String(form.seo_title || form.name).length}/70</span>
        </div>
        <div className="field">
          <label htmlFor="p-seo-ro">{t(lang, 'f_seo_desc_ro')}</label>
          <textarea className="textarea" id="p-seo-ro" maxLength={200} style={{ minHeight: 80 }} value={form.seo_description_ro} onChange={(e) => set('seo_description_ro', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="p-seo-ru">{t(lang, 'f_seo_desc_ru')}</label>
          <textarea className="textarea" id="p-seo-ru" maxLength={200} style={{ minHeight: 80 }} value={form.seo_description_ru} onChange={(e) => set('seo_description_ru', e.target.value)} />
        </div>
      </section>

      <div className="mt-4">
        <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
          {busy ? t(lang, 'dash_saving') : t(lang, 'dash_save')}
        </button>
      </div>
    </form>
  );
}
