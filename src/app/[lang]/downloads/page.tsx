import type { Metadata } from 'next';
import { tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { officialLinks } from '@/content/updates';
import { PageHero, Section, SectionHeading } from '@/components/ui';
import { DownloadsList } from '@/components/public/Interactive';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/downloads/', lang === 'mr' ? 'डाउनलोड व दुवे' : 'Downloads & links', lang === 'mr' ? 'प्रवेश पोर्टल, अभ्यासक्रम, अर्ज व शासकीय पोर्टल.' : 'Admission portal, trade curricula, forms and useful government portals.');
}

export default async function Downloads({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'डाउनलोड व दुवे' : 'Downloads & links'} lead={mr ? 'अधिकृत अर्ज, अभ्यासक्रम व पोर्टल एकाच ठिकाणी.' : 'Official forms, curricula and portals in one place.'} crumbs={[{ label: mr ? 'डाउनलोड' : 'Downloads' }]} />
      <Section>
        <DownloadsList lang={lang} />
        <div className="mt-14">
          <SectionHeading eyebrow={mr ? 'उपयुक्त संकेतस्थळे' : 'Useful websites'} title={mr ? 'शासकीय संकेतस्थळे' : 'Government websites'} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {officialLinks.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-white p-4 ring-1 ring-line hover:ring-brand-300">
                  <span className="block font-semibold text-brand-950">{tx(l.label, lang)}</span>
                  <span className="block truncate text-xs text-stone-500">{l.url.replace(/^https?:\/\//, '')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
