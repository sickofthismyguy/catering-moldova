import type { Metadata } from 'next';
import { ReviewsList } from '@/components/dashboard/ReviewsList';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Recenzii', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ReviewsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <ReviewsList lang={lang as Lang} />;
}
