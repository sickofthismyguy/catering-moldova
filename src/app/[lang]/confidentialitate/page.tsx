import type { Metadata } from 'next';
import { StaticMetadata, StaticPage } from '@/components/StaticPage';
import type { Lang } from '@/lib/types';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return StaticMetadata(lang as Lang, 'privacy', '/confidentialitate');
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <StaticPage lang={lang as Lang} pageKey="privacy" path="/confidentialitate" />;
}
