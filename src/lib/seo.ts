import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/config';
import type { Locale } from '@/lib/i18n';
import { institute } from '@/content/institute';

export const absolute = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Per-page metadata with canonical + hreflang alternates. `path` is language-neutral, e.g. "/trades/". */
export function pageMeta(lang: Locale, path: string, title: string, description: string, image = '/brand/og.jpg'): Metadata {
  const url = absolute(`/${lang}${path}`);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { 'en-IN': absolute(`/en${path}`), 'mr-IN': absolute(`/mr${path}`), 'x-default': absolute(`/en${path}`) },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: institute.short[lang],
      locale: lang === 'mr' ? 'mr_IN' : 'en_IN',
      images: [{ url: absolute(image), width: 1200, height: 630, alt: institute.name[lang] }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [absolute(image)] },
  };
}

/** schema.org structured data for the institute (rendered on the home page). */
export const organizationJsonLd = (lang: Locale) => ({
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'GovernmentOrganization'],
  name: institute.name[lang],
  alternateName: ['Govt. ITI (Women), Thane', 'ITI Thane Girls', 'Rajmata Jijau Govt. ITI Thane'],
  url: absolute(`/${lang}/`),
  logo: absolute('/brand/dvet-logo.png'),
  image: absolute('/brand/og.jpg'),
  email: institute.email,
  telephone: institute.phones.map((p) => p.tel),
  foundingDate: institute.established,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C/o Govt. Technical High School, Kopri Colony',
    addressLocality: 'Thane (East)',
    addressRegion: 'Maharashtra',
    postalCode: '400603',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: institute.geo.lat, longitude: institute.geo.lng },
  parentOrganization: { '@type': 'GovernmentOrganization', name: 'Directorate of Vocational Education & Training, Maharashtra', url: 'https://dvet.gov.in' },
  sameAs: [institute.officialPage],
});
