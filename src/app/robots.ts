import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cont/', '/api/', '/*?*sort=', '/*?*page='],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
