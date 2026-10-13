import type { Metadata } from 'next';
import { DashNav } from '@/components/dashboard/DashNav';
import type { Lang } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Cont',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ContLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  return (
    <div className="container section">
      <div className="dash-layout">
        <DashNav lang={l} />
        <div style={{ minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
