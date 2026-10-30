import type { Metadata } from 'next';
import { tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { officialLinks } from '@/content/updates';
import { asset } from '@/lib/config';
import { ButtonLink, PageHero, Section, SectionHeading } from '@/components/ui';
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
        <div className="in-app-hidden mb-10 flex flex-col gap-4 rounded-[1.75rem] bg-brand-950 p-5 text-white sm:flex-row sm:items-center sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/icons/icon-192.png')} alt="" width={56} height={56} className="size-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-semibold">{mr ? 'ITI Thane ॲप' : 'ITI Thane app'}</p>
            <p className="mt-0.5 text-sm text-white/70">{mr ? 'उपस्थिती, प्रश्नमंजुषा व नोकरीच्या संधी तुमच्या फोनवर — Android व iPhone साठी मोफत.' : 'Attendance, quizzes and jobs on your phone — free for Android and iPhone.'}</p>
          </div>
          <ButtonLink to="/app/" lang={lang} variant="accent" arrow>
            {mr ? 'ॲप मिळवा' : 'Get the app'}
          </ButtonLink>
        </div>
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
