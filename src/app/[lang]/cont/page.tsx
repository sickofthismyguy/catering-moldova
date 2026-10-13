import type { Metadata } from 'next';
import { Overview } from '@/components/dashboard/Overview';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Panoul firmei', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DashHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <Overview lang={lang as Lang} />;
}
