import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { PageHero, Section } from '@/components/ui';
import { Gallery } from '@/components/public/Gallery';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/gallery/', lang === 'mr' ? 'छायाचित्र दालन' : 'Photo gallery', lang === 'mr' ? 'परिसर, वसतिगृह, प्रयोगशाळा, CSR, औद्योगिक भेटी, क्रीडा, स्नेहसंमेलन व महिला दिनाची छायाचित्रे.' : 'Photos of the campus, hostel, labs, workshops, CSR activities, industrial visits, sports, annual function and Women’s Day.');
}

export default async function GalleryPage({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'छायाचित्र दालन' : 'Photo gallery'} lead={mr ? 'छायाचित्रांतून आमची संस्था — प्रयोगशाळांपासून स्नेहसंमेलनापर्यंत.' : 'Our institute in pictures — from the workshops to the annual function stage.'} crumbs={[{ label: mr ? 'परिसर' : 'Campus', path: '/campus/' }, { label: mr ? 'छायाचित्र दालन' : 'Gallery' }]} />
      <Section>
        <Gallery lang={lang} />
      </Section>
    </>
  );
}
