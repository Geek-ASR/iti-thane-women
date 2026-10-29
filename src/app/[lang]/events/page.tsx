import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';
import { EventsList } from '@/components/public/Updates';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/events/', lang === 'mr' ? 'बातम्या व कार्यक्रम' : 'News & events', lang === 'mr' ? 'प्रयोगशाळा उद्घाटन, CSR उपक्रम, रोजगार मेळावे व विद्यार्थी कार्यक्रम.' : 'Lab inaugurations, CSR milestones, job fairs and student programmes at Govt. ITI (Women), Thane.');
}

export default async function Events({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'बातम्या व कार्यक्रम' : 'News & events'} lead={mr ? 'परिसरातील महत्त्वाच्या घडामोडी.' : 'Milestones and happenings from campus.'} crumbs={[{ label: mr ? 'कार्यक्रम' : 'Events' }]} />
      <Section>
        <div className="mx-auto max-w-4xl">
          <EventsList lang={lang} />
        </div>
      </Section>
    </>
  );
}
