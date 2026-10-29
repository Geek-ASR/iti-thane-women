import type { MetadataRoute } from 'next';
import { BUILD_DATE } from '@/lib/config';
import { absolute } from '@/lib/seo';
import { trades } from '@/content/trades';
import { policies } from '@/content/policies';

export const dynamic = 'force-static';

export const publicPaths = [
  '/',
  '/about/',
  '/staff/',
  '/trades/',
  ...trades.map((t) => `/trades/${t.slug}/`),
  '/admissions/',
  '/campus/',
  '/placements/',
  '/industry/',
  '/student-life/',
  '/gallery/',
  '/notices/',
  '/events/',
  '/downloads/',
  '/faq/',
  '/contact/',
  '/grievance/',
  '/rti/',
  '/accessibility/',
  '/sitemap/',
  ...policies.map((p) => `/policies/${p.slug}/`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((p) => ({
    url: absolute(`/en${p}`),
    lastModified: BUILD_DATE,
    changeFrequency: p === '/' || p === '/notices/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/trades') || p === '/admissions/' ? 0.9 : 0.6,
    alternates: { languages: { en: absolute(`/en${p}`), mr: absolute(`/mr${p}`) } },
  }));
}
