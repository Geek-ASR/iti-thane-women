import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { href, tx, type L, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { institute } from '@/content/institute';
import { PageHero, Section } from '@/components/ui';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/rti/', lang === 'mr' ? 'माहितीचा अधिकार' : 'Right to Information', lang === 'mr' ? 'माहितीचा अधिकार अधिनियम, २००५ अंतर्गत अर्ज कसा करावा व स्वयंप्रेरणेने प्रकट माहिती.' : 'How to file an application under the RTI Act, 2005 and proactive disclosures of Govt. ITI (Women), Thane.');
}

const disclosures: { label: L; path: string }[] = [
  { label: { en: 'Organisation, functions and duties', mr: 'संस्थेची रचना, कार्ये व कर्तव्ये' }, path: '/about/' },
  { label: { en: 'Directory of officers and employees', mr: 'अधिकारी व कर्मचाऱ्यांची निर्देशिका' }, path: '/staff/' },
  { label: { en: 'Institute Management Committee', mr: 'संस्था व्यवस्थापन समिती' }, path: '/about/#imc' },
  { label: { en: 'Trades, units and intake capacity', mr: 'व्यवसाय, तुकड्या व प्रवेश क्षमता' }, path: '/trades/#compare' },
  { label: { en: 'Scholarships, stipends and concessions', mr: 'शिष्यवृत्ती, विद्यावेतन व सवलती' }, path: '/admissions/#support' },
  { label: { en: 'Facilities available to trainees', mr: 'प्रशिक्षणार्थींसाठी उपलब्ध सुविधा' }, path: '/campus/' },
  { label: { en: 'Grievance redressal mechanism', mr: 'तक्रार निवारण यंत्रणा' }, path: '/grievance/' },
  { label: { en: 'Notices and circulars', mr: 'सूचना व परिपत्रके' }, path: '/notices/' },
];

export default async function Rti({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  const steps: L[] = [
    { en: 'Write your application in English or Marathi, addressed to the Public Information Officer of the institute, clearly describing the information you need.', mr: 'आवश्यक माहितीचे स्पष्ट वर्णन करून संस्थेच्या जन माहिती अधिकाऱ्यांना उद्देशून इंग्रजी किंवा मराठीत अर्ज लिहा.' },
    { en: 'Attach the application fee of ₹10 as prescribed under the Maharashtra RTI Rules (BPL applicants are exempt on proof).', mr: 'महाराष्ट्र माहितीचा अधिकार नियमांनुसार ₹१० अर्ज शुल्क जोडा (दारिद्र्यरेषेखालील अर्जदारांना पुराव्यासह सूट).' },
    { en: 'Submit it in person or by post at the institute office, or file online on the Government of Maharashtra RTI portal.', mr: 'अर्ज संस्था कार्यालयात प्रत्यक्ष किंवा टपालाने द्या, अथवा महाराष्ट्र शासनाच्या RTI पोर्टलवर ऑनलाइन सादर करा.' },
    { en: 'Information is provided within 30 days. If you are not satisfied, you may file a first appeal with the First Appellate Authority.', mr: '३० दिवसांत माहिती दिली जाते. समाधान न झाल्यास प्रथम अपिलीय अधिकाऱ्यांकडे अपील करता येते.' },
  ];
  return (
    <>
      <PageHero lang={lang} title={mr ? 'माहितीचा अधिकार' : 'Right to Information'} lead={mr ? 'माहितीचा अधिकार अधिनियम, २००५ अंतर्गत नागरिकांना माहिती मिळवण्याचा अधिकार.' : 'Citizens may seek information from the institute under the Right to Information Act, 2005.'} crumbs={[{ label: 'RTI' }]} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-950 sm:text-3xl">{mr ? 'अर्ज कसा करावा' : 'How to apply'}</h2>
            <ol className="mt-5 space-y-3">
              {steps.map((s, i) => (
                <li key={s.en} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-900 text-sm font-bold text-white">{i + 1}</span>
                  <span className="text-[0.95rem] text-stone-700">{tx(s, lang)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-3xl bg-paper p-6 ring-1 ring-line">
              <p className="font-semibold text-brand-950">{mr ? 'जन माहिती अधिकारी' : 'Public Information Officer'}</p>
              <p className="mt-1 text-sm text-stone-700">{mr ? 'प्राचार्य कार्यालय, ' : 'Office of the Principal, '}{tx(institute.name, lang)}</p>
              <p className="mt-1 text-sm text-stone-700">{tx(institute.address, lang)}</p>
              <p className="mt-1 text-sm">
                <a href={`mailto:${institute.email}`} className="font-semibold text-brand-700 hover:underline">{institute.email}</a> · {institute.phones[0].display}
              </p>
              <p className="mt-3 text-xs text-stone-500">{mr ? 'नियुक्त जन माहिती अधिकारी व प्रथम अपिलीय अधिकारी यांच्या नावांसाठी संस्था कार्यालयाशी संपर्क साधा.' : 'For the names of the designated PIO and First Appellate Authority, please contact the institute office.'}</p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-brand-950 sm:text-3xl">{mr ? 'स्वयंप्रेरणेने प्रकट माहिती' : 'Proactive disclosure'}</h2>
            <p className="mt-2 text-sm text-stone-600">{mr ? 'कलम ४(१)(ब) अंतर्गत माहिती' : 'Information under Section 4(1)(b)'}</p>
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-3xl bg-white ring-1 ring-line">
              {disclosures.map((d) => (
                <li key={d.path}>
                  <Link href={href(lang, d.path)} className="flex items-center gap-3 px-5 py-4 hover:bg-brand-50">
                    <FileText className="size-5 shrink-0 text-brand-600" aria-hidden />
                    <span className="font-medium text-brand-950">{tx(d.label, lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
