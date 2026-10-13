import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Icon } from '@/components/Icons';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/config';
import { getCategories, getCities, getPublicStats } from '@/lib/data';
import { pick } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  return buildMetadata({
    lang: l,
    title: l === 'ru' ? 'Добавить кейтеринговую компанию бесплатно — Catering Moldova' : t(l, 'addfirm_h1'),
    description:
      l === 'ru'
        ? 'Бесплатная регистрация кейтеринговой компании: профиль, меню с ценами, галерея и заявки от клиентов со всей Молдовы.'
        : 'Înscriere gratuită pentru firme de catering: profil, meniuri cu prețuri, galerie foto și cereri de la clienți din toată Moldova.',
    path: '/adauga-firma',
  });
}

export default async function AddFirmPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const L = (p: string) => `/${l}${p}`;
  const [cities, events, stats] = await Promise.all([getCities(), getCategories('event'), getPublicStats()]);

  const benefits = [
    { icon: 'tag', t: t(l, 'addfirm_b1_t'), p: t(l, 'addfirm_b1_p') },
    { icon: 'search', t: t(l, 'addfirm_b2_t'), p: t(l, 'addfirm_b2_p') },
    { icon: 'inbox', t: t(l, 'addfirm_b3_t'), p: t(l, 'addfirm_b3_p') },
  ];

  const steps = l === 'ru'
    ? [
        { t: 'Создайте аккаунт', p: 'E-mail, пароль и название компании. Занимает меньше двух минут.' },
        { t: 'Заполните профиль', p: 'Город, контакты, фото, меню, цены, число гостей, кухни и типы событий.' },
        { t: 'Дождитесь проверки', p: 'Администратор проверяет профиль — обычно в течение 24 часов.' },
        { t: 'Получайте заявки', p: 'Клиенты пишут через форму, звонят или сообщают в WhatsApp. Заявки видны в личном кабинете.' },
      ]
    : l === 'en'
      ? [
          { t: 'Create an account', p: 'Email, password and company name. Takes under two minutes.' },
          { t: 'Complete your profile', p: 'City, contacts, photos, menus, prices, guest count, cuisines and event types.' },
          { t: 'Wait for approval', p: 'An administrator reviews the profile — usually within 24 hours.' },
          { t: 'Receive inquiries', p: 'Clients use the form, call or message on WhatsApp. Everything lands in your dashboard.' },
        ]
      : [
          { t: 'Creează contul', p: 'E-mail, parolă și denumirea firmei. Durează sub două minute.' },
          { t: 'Completează profilul', p: 'Oraș, contacte, fotografii, meniuri, prețuri, număr de invitați, bucătării și tipuri de evenimente.' },
          { t: 'Așteaptă aprobarea', p: 'Un administrator verifică profilul — de obicei în maximum 24 de ore.' },
          { t: 'Primește cereri', p: 'Clienții scriu prin formular, sună sau mesaj pe WhatsApp. Toate cererile apar în panoul tău.' },
        ];

  const faq = l === 'ru'
    ? [
        { q: 'Это действительно бесплатно?', a: 'Да. Профиль, услуги и получение заявок бесплатны. Мы не берём комиссию с ваших договоров.' },
        { q: 'Сколько длится модерация?', a: 'Обычно до 24 часов в рабочие дни. Вы получите письмо, когда профиль будет опубликован.' },
        { q: 'Можно ли скрыть профиль?', a: 'Да, в кабинете есть переключатель «Опубликовать / Скрыть» — профиль исчезает из поиска мгновенно.' },
        { q: 'Какие фото лучше загружать?', a: 'Реальные фотографии ваших блюд и накрытых столов, горизонтальные, в хорошем свете. Минимум 4–6 кадров.' },
      ]
    : [
        { q: 'Este într-adevăr gratuit?', a: 'Da. Profilul, serviciile și primirea cererilor sunt gratuite. Nu percepem comision din contractele tale.' },
        { q: 'Cât durează aprobarea?', a: 'De obicei maximum 24 de ore în zilele lucrătoare. Vei primi un e-mail când profilul devine public.' },
        { q: 'Îmi pot ascunde profilul?', a: 'Da, în panoul de control există butonul „Publică / Ascunde” — profilul dispare imediat din căutări.' },
        { q: 'Ce fotografii să încarc?', a: 'Fotografii reale cu preparatele și mesele aranjate, în format orizontal, bine luminate. Minim 4–6 imagini.' },
      ];

  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: t(l, 'c_home'), href: L('/') }, { name: t(l, 'nav_add_firm') }]} />

      <div className="row-between" style={{ alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '62ch' }}>
          <h1>{t(l, 'addfirm_h1')}</h1>
          <p className="muted mt-3">{t(l, 'addfirm_p')}</p>
          <div className="btn-row mt-5">
            <Link className="btn btn-primary btn-lg" href={L('/cont/inregistrare')}>{t(l, 'auth_register_btn')}</Link>
            <Link className="btn btn-outline btn-lg" href={L('/cont/intrare')}>{t(l, 'auth_have_account')} {t(l, 'auth_login_btn')}</Link>
          </div>
          <p className="tiny muted mt-3">
            {stats.firms} {t(l, 'stat_firms')} · {stats.cities} {t(l, 'stat_cities')} · {stats.services} {t(l, 'stat_services')}
          </p>
        </div>
      </div>

      <div className="grid grid-3 mt-6">
        {benefits.map((b) => (
          <div className="card" key={b.t}>
            <span className="ico" style={{ color: 'var(--accent-strong)' }}><Icon name={b.icon} size={22} /></span>
            <h2 className="mt-3" style={{ fontSize: '1.05rem' }}>{b.t}</h2>
            <p className="muted small mt-2">{b.p}</p>
          </div>
        ))}
      </div>

      <section className="section-tight mt-5">
        <h2>{l === 'ru' ? 'Как зарегистрироваться' : l === 'en' ? 'How to list' : 'Cum te înscrii'}</h2>
        <ol className="steps mt-4" style={{ listStyle: 'none', padding: 0 }}>
          {steps.map((s, i) => (
            <li className="step" key={s.t}>
              <span className="badge badge-accent">{i + 1}</span>
              <h3 className="mt-2">{s.t}</h3>
              <p>{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-tight">
        <h2>{l === 'ru' ? 'Где вас увидят клиенты' : 'Unde te văd clienții'}</h2>
        <div className="chips mt-3">
          {cities.slice(0, 10).map((c) => (
            <Link key={c.slug} className="chip" href={L(`/catering-${c.slug}`)}>{l === 'ru' ? 'Кейтеринг ' : 'Catering '}{pick(c, l)}</Link>
          ))}
        </div>
        <div className="chips mt-3">
          {events.slice(0, 9).map((e) => (
            <Link key={e.slug} className="chip" href={L(`/catering-${e.slug}`)}>{pick(e, l)}</Link>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <h2>FAQ</h2>
        <div className="faq mt-3">
          {faq.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <JsonLd data={faqJsonLd(faq, l, `${siteUrl()}/${l}/adauga-firma`)} />
    </div>
  );
}
