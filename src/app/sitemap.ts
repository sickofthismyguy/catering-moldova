import type { MetadataRoute } from 'next';
import { getCategories, getCities, getPublicFirmSlugs } from '@/lib/data';
import { siteUrl } from '@/lib/config';
import { LANGS } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

const STATIC_PATHS = ['/', '/cauta', '/adauga-firma', '/despre', '/contact', '/confidentialitate', '/termeni'];

function alternates(path: string) {
  const base = siteUrl();
  const languages: Record<string, string> = {};
  for (const l of LANGS) languages[l === 'ro' ? 'ro-MD' : l === 'ru' ? 'ru-MD' : 'en'] = `${base}/${l}${path === '/' ? '' : path}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [cities, cats, firmSlugs] = await Promise.all([getCities(), getCategories('event'), getPublicFirmSlugs()]);

  const entries: MetadataRoute.Sitemap = [];

  // Homepage — highest priority, one entry per language
  for (const l of LANGS as Lang[]) {
    entries.push({
      url: `${base}/${l}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: alternates('/'),
    });
  }

  for (const path of STATIC_PATHS.filter((p) => p !== '/')) {
    for (const l of LANGS as Lang[]) {
      entries.push({
        url: `${base}/${l}${path}`,
        lastModified: new Date('2026-01-15'),
        changeFrequency: 'monthly',
        priority: path === '/cauta' ? 0.7 : 0.35,
        alternates: alternates(path),
      });
    }
  }

  const catalogSlugs = [...cities.map((c) => c.slug), ...cats.map((c) => c.slug)];
  for (const slug of catalogSlugs) {
    for (const l of LANGS as Lang[]) {
      entries.push({
        url: `${base}/${l}/catering-${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: cities.some((c) => c.slug === slug) ? 0.9 : 0.8,
        alternates: alternates(`/catering-${slug}`),
      });
    }
  }

  for (const slug of firmSlugs) {
    for (const l of LANGS as Lang[]) {
      entries.push({
        url: `${base}/${l}/firma/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: alternates(`/firma/${slug}`),
      });
    }
  }

  return entries;
}
