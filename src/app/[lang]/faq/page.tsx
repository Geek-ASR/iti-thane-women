import type { Metadata } from 'next';
import { tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { faqs } from '@/content/faq';
import { ButtonLink, PageHero, Section } from '@/components/ui';
import { FaqList } from '@/components/public/Interactive';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/faq/', lang === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently asked questions', lang === 'mr' ? 'प्रवेश, शुल्क, शिष्यवृत्ती, वसतिगृह, परीक्षा व करिअरविषयी प्रश्नोत्तरे.' : 'Answers about admissions, fees, scholarships, hostel, exams, careers and the Smart Campus portal.');
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: tx(f.q, lang), acceptedAnswer: { '@type': 'Answer', text: tx(f.a, lang) } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero lang={lang} title={mr ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently asked questions'} lead={mr ? 'आपल्या प्रश्नाचे उत्तर येथे नसल्यास आम्हाला संपर्क करा.' : 'Can’t find your answer here? Our office is happy to help.'} crumbs={[{ label: 'FAQ' }]}>
        <ButtonLink to="/contact/" lang={lang} variant="accent" arrow>{mr ? 'संपर्क करा' : 'Ask us'}</ButtonLink>
      </PageHero>
      <Section>
        <div className="mx-auto max-w-4xl">
          <FaqList lang={lang} />
        </div>
      </Section>
    </>
  );
}
