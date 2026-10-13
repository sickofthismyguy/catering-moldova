import type { Metadata } from 'next';
import { AccountSettings } from '@/components/dashboard/AccountSettings';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Setări cont', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function SettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <AccountSettings lang={lang as Lang} />;
}
