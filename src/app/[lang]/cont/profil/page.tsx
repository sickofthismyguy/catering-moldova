import type { Metadata } from 'next';
import { ProfileEditor } from '@/components/dashboard/ProfileEditor';
import { getCategories, getCities, getTaxonomies } from '@/lib/data';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Profilul firmei', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const [cities, events, cuisines, dietary] = await Promise.all([
    getCities(false), getCategories('event'), getTaxonomies('cuisine'), getTaxonomies('dietary'),
  ]);
  return <ProfileEditor lang={lang as Lang} cities={cities} events={events} cuisines={cuisines} dietary={dietary} />;
}
