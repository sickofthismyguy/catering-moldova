import type { Metadata } from 'next';
import { ServicesManager } from '@/components/dashboard/ServicesManager';
import { getCategories } from '@/lib/data';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Servicii', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const categories = await getCategories();
  return <ServicesManager lang={lang as Lang} categories={categories} />;
}
