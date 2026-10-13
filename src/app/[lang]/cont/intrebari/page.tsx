import type { Metadata } from 'next';
import { InquiriesManager } from '@/components/dashboard/InquiriesManager';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Cereri', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function InquiriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <InquiriesManager lang={lang as Lang} />;
}
