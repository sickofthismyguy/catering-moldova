import type { Metadata } from 'next';
import { LoginForm } from '@/components/dashboard/LoginForm';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Intrare în cont', robots: { index: false, follow: true } };

export default async function LoginPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LoginForm lang={lang as Lang} />;
}
