'use client';

import { useState } from 'react';
import { DashboardGate } from './Gate';
import { AdminFirms } from './AdminFirms';
import { AdminInquiries, AdminReviews } from './AdminFeed';
import { AdminSettings } from './AdminSettings';
import { EntityTable, type FieldDef } from './EntityTable';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

type Tab = 'firms' | 'inquiries' | 'reviews' | 'cities' | 'categories' | 'taxonomy' | 'settings';

const cityFields: FieldDef[] = [
  { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'chisinau' },
  { key: 'name_ro', label: 'Nume (RO)', type: 'text', required: true, placeholder: 'Chișinău' },
  { key: 'name_ru', label: 'Nume (RU)', type: 'text', placeholder: 'Кишинёв' },
  { key: 'name_en', label: 'Name (EN)', type: 'text', hideInTable: true },
  { key: 'region_ro', label: 'Raion (RO)', type: 'text', hideInTable: true },
  { key: 'region_ru', label: 'Район (RU)', type: 'text', hideInTable: true },
  { key: 'lat', label: 'Lat', type: 'number', hideInTable: true },
  { key: 'lng', label: 'Lng', type: 'number', hideInTable: true },
  { key: 'population', label: 'Populație', type: 'number', hideInTable: true },
  { key: 'priority', label: 'Prioritate', type: 'number' },
  { key: 'active', label: 'Activ', type: 'boolean' },
  { key: 'seo_intro_ro', label: 'Text SEO (RO)', type: 'textarea', hideInTable: true },
  { key: 'seo_intro_ru', label: 'Text SEO (RU)', type: 'textarea', hideInTable: true },
];

const categoryFields: FieldDef[] = [
  { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'nunti' },
  { key: 'kind', label: 'Tip', type: 'select', required: true, options: [
    { value: 'event', label: 'Eveniment / event' }, { value: 'service', label: 'Serviciu / service' },
  ] },
  { key: 'name_ro', label: 'Nume (RO)', type: 'text', required: true },
  { key: 'name_ru', label: 'Nume (RU)', type: 'text' },
  { key: 'name_en', label: 'Name (EN)', type: 'text', hideInTable: true },
  { key: 'icon', label: 'Icon', type: 'text', hideInTable: true, placeholder: 'rings, cake, briefcase…' },
  { key: 'description_ro', label: 'Descriere (RO)', type: 'textarea', hideInTable: true },
  { key: 'description_ru', label: 'Описание (RU)', type: 'textarea', hideInTable: true },
  { key: 'priority', label: 'Prioritate', type: 'number' },
  { key: 'active', label: 'Activ', type: 'boolean' },
];

const taxonomyFields: FieldDef[] = [
  { key: 'kind', label: 'Tip', type: 'select', required: true, options: [
    { value: 'cuisine', label: 'Bucătărie / cuisine' }, { value: 'dietary', label: 'Dietă / dietary' },
  ] },
  { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'moldoveneasca' },
  { key: 'name_ro', label: 'Nume (RO)', type: 'text', required: true },
  { key: 'name_ru', label: 'Nume (RU)', type: 'text' },
  { key: 'name_en', label: 'Name (EN)', type: 'text', hideInTable: true },
  { key: 'active', label: 'Activ', type: 'boolean' },
];

export function AdminPanel({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<Tab>('firms');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'firms', label: t(lang, 'adm_firms') },
    { id: 'inquiries', label: t(lang, 'adm_inquiries') },
    { id: 'reviews', label: t(lang, 'adm_reviews') },
    { id: 'cities', label: t(lang, 'adm_cities') },
    { id: 'categories', label: t(lang, 'adm_categories') },
    { id: 'taxonomy', label: t(lang, 'adm_taxonomy') },
    { id: 'settings', label: t(lang, 'adm_settings') },
  ];

  return (
    <DashboardGate lang={lang} requireAdmin>
      {({ user }) => (
        <div>
          <h1 className="mb-2" style={{ fontSize: '1.5rem' }}>{t(lang, 'adm_title')}</h1>
          <p className="tiny muted mb-4">{user.email}</p>

          <div className="tabs" role="tablist">
            {tabs.map((tb) => (
              <button key={tb.id} role="tab" aria-selected={tab === tb.id} onClick={() => setTab(tb.id)} type="button">
                {tb.label}
              </button>
            ))}
          </div>

          {tab === 'firms' ? <AdminFirms lang={lang} /> : null}
          {tab === 'inquiries' ? <AdminInquiries lang={lang} /> : null}
          {tab === 'reviews' ? <AdminReviews lang={lang} /> : null}
          {tab === 'cities' ? (
            <EntityTable lang={lang} table="cities" fields={cityFields} title={t(lang, 'adm_cities')} order={{ column: 'priority', ascending: false }} />
          ) : null}
          {tab === 'categories' ? (
            <EntityTable lang={lang} table="categories" fields={categoryFields} title={t(lang, 'adm_categories')} order={{ column: 'priority', ascending: false }} />
          ) : null}
          {tab === 'taxonomy' ? (
            <EntityTable lang={lang} table="taxonomies" fields={taxonomyFields} title={t(lang, 'adm_taxonomy')} order={{ column: 'kind', ascending: true }} />
          ) : null}
          {tab === 'settings' ? <AdminSettings lang={lang} /> : null}
        </div>
      )}
    </DashboardGate>
  );
}
