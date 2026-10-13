import type { Metadata } from 'next';
import { RegisterForm } from '@/components/dashboard/RegisterForm';
import { getCities } from '@/lib/data';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = { title: 'Creează cont de firmă', robots: { index: false, follow: true } };
export const revalidate = 3600;

export default async function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const cities = await getCities();
  return <RegisterForm lang={lang as Lang} cities={cities} />;
}
