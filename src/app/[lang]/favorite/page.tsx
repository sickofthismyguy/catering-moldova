import type { Metadata } from 'next';
import { FavoritesPage } from '@/components/FavoriteButton';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata({ lang: lang as Lang, title: t(lang as Lang, 'nav_favorites'), description: '', path: '/favorite', noindex: true });
}

export default async function FavoritesRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang as Lang;
  return (
    <div className="container section">
      <Breadcrumbs items={[{ name: t(l, 'c_home'), href: `/${l}` }, { name: t(l, 'nav_favorites') }]} />
      <h1>{t(l, 'nav_favorites')}</h1>
      <p className="muted mt-2">
        {l === 'ru'
          ? 'Сохранённые компании хранятся только в этом браузере — аккаунт не нужен.'
          : 'Firmele salvate sunt păstrate doar în acest browser — nu ai nevoie de cont.'}
      </p>
      <div className="mt-5">
        <FavoritesPage lang={l} />
      </div>
    </div>
  );
}
