import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';
import { NoticeArchive } from '@/components/public/Updates';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/notices/', lang === 'mr' ? 'सूचना फलक' : 'Notice board', lang === 'mr' ? 'प्रवेश, परीक्षा, शिष्यवृत्ती, प्लेसमेंट व वसतिगृहाविषयी सूचना.' : 'Latest notices on admissions, exams, scholarships, placement and hostel at Govt. ITI (Women), Thane.');
}

export default async function Notices({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'सूचना फलक' : 'Notice board'} lead={mr ? 'संस्थेच्या अधिकृत सूचना व परिपत्रके.' : 'Official notices and circulars from the institute.'} crumbs={[{ label: mr ? 'सूचना' : 'Notices' }]} />
      <Section>
        <NoticeArchive lang={lang} />
      </Section>
    </>
  );
}
