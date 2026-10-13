import type { Metadata } from 'next';
import { AdminPanel } from '@/components/dashboard/AdminPanel';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Administrare', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AdminPanel lang={lang as Lang} />;
}
