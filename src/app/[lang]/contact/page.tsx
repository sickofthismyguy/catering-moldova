import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ContactBody } from '@/components/StaticPage';
import { buildMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  return buildMetadata({
    lang: l,
    title: t(l, 'contact_h1'),
    description:
      l === 'ru'
        ? 'Свяжитесь с администрацией каталога Catering Moldova: e-mail и телефон для вопросов, предложений и жалоб.'
        : 'Contactează echipa Catering Moldova: e-mail și telefon pentru întrebări, propuneri sau sesizări.',
    path: '/contact',
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  const L = (p: string) => `/${l}${p}`;

  return (
    <div className="container container-narrow section">
      <Breadcrumbs items={[{ name: t(l, 'c_home'), href: L('/') }, { name: t(l, 'contact_h1') }]} />
      <h1>{t(l, 'contact_h1')}</h1>
      <p className="muted mt-2">
        {l === 'ru'
          ? 'Пишите нам по вопросам каталога, сотрудничества, жалоб на объявления или удаления профиля. Отвечаем в течение 2 рабочих дней.'
          : l === 'en'
            ? 'Write to us about the directory, partnerships, complaints about a listing or profile removal. We reply within 2 working days.'
            : 'Scrie-ne pentru întrebări despre catalog, colaborări, sesizări legate de un anunț sau pentru ștergerea unui profil. Răspundem în maximum 2 zile lucrătoare.'}
      </p>

      <div className="mt-5">
        <ContactBody lang={l} />
      </div>

      <div className="card mt-5">
        <h2 style={{ fontSize: '1.05rem' }}>
          {l === 'ru' ? 'Вы кейтеринговая компания?' : l === 'en' ? 'Are you a catering company?' : 'Ești o firmă de catering?'}
        </h2>
        <p className="muted small mt-2">
          {l === 'ru'
            ? 'Регистрация бесплатна и занимает меньше двух минут. Профиль публикуется после проверки администратором.'
            : l === 'en'
              ? 'Listing is free and takes under two minutes. Profiles go live after admin approval.'
              : 'Înscrierea este gratuită și durează sub două minute. Profilul devine public după aprobarea administratorului.'}
        </p>
        <a className="btn btn-primary mt-4" href={L('/cont/inregistrare')}>{t(l, 'firms_cta_btn')}</a>
      </div>
    </div>
  );
}
