import type { Metadata } from 'next';
import { ArrowUpRight, CalendarRange, CircleCheck, Info } from 'lucide-react';
import { t, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { support } from '@/content/institute';
import { trades } from '@/content/trades';
import { ButtonLink, Eyebrow, PageHero, Section, SectionHeading } from '@/components/ui';
import { EnquiryForm } from '@/components/public/EnquiryForm';
import { DocChecklist, FaqList } from '@/components/public/Interactive';
import { AdmissionStatus } from '@/components/public/AdmissionStatus';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/admissions/', lang === 'mr' ? 'प्रवेश' : 'Admissions', lang === 'mr' ? 'ऑनलाइन CAP प्रवेश प्रक्रिया, पात्रता, कागदपत्रे, शिष्यवृत्ती व चौकशी.' : 'How to get admission at Govt. ITI (Women), Thane — DVET online CAP process, eligibility, documents, scholarships and enquiry.');
}

const steps = [
  { title: { en: 'Check eligibility & shortlist trades', mr: 'पात्रता तपासा व व्यवसाय निवडा' }, desc: { en: 'Engineering trades need 10th with Science & Maths; most others need 10th; Sewing Technology needs 8th.', mr: 'अभियांत्रिकी व्यवसायांसाठी विज्ञान व गणितासह दहावी; इतरांसाठी दहावी; शिवणकाम तंत्रज्ञानासाठी आठवी.' } },
  { title: { en: 'Register & apply online', mr: 'ऑनलाइन नोंदणी व अर्ज' }, desc: { en: 'Create your account on admission.dvet.gov.in, fill the application and pay the fee online.', mr: 'admission.dvet.gov.in वर खाते तयार करा, अर्ज भरा व ऑनलाइन शुल्क भरा.' } },
  { title: { en: 'Submit your option form', mr: 'विकल्प अर्ज सादर करा' }, desc: { en: 'Choose trades and select “Govt. ITI (Women), Thane” as your institute preference.', mr: 'व्यवसाय निवडा व संस्था पसंतीत “शासकीय आय.टी.आय. (मुलींची), ठाणे” निवडा.' } },
  { title: { en: 'Check CAP allotment', mr: 'CAP वाटप यादी पहा' }, desc: { en: 'Seats are allotted round-wise on merit and reservation. Confirm if you get your preferred trade.', mr: 'गुणवत्ता व आरक्षणानुसार फेरीनिहाय जागा वाटप होते. पसंतीचा व्यवसाय मिळाल्यास प्रवेश निश्चित करा.' } },
  { title: { en: 'Report with original documents', mr: 'मूळ कागदपत्रांसह हजर व्हा' }, desc: { en: 'Visit the institute within the given dates for document verification and fee payment.', mr: 'दिलेल्या मुदतीत कागदपत्र पडताळणी व शुल्क भरण्यासाठी संस्थेत या.' } },
  { title: { en: 'Institute-level rounds', mr: 'संस्थास्तरीय फेऱ्या' }, desc: { en: 'Any vacant seats are filled through institute-level counselling rounds announced by DVET.', mr: 'रिक्त जागा संचालनालयाने जाहीर केलेल्या संस्थास्तरीय फेऱ्यांतून भरल्या जातात.' } },
];

const months = [
  { m: { en: 'June', mr: 'जून' }, d: { en: 'Registration opens after SSC results', mr: 'दहावी निकालानंतर नोंदणी सुरू' } },
  { m: { en: 'July', mr: 'जुलै' }, d: { en: 'CAP rounds & document verification', mr: 'CAP फेऱ्या व कागदपत्र पडताळणी' } },
  { m: { en: 'August', mr: 'ऑगस्ट' }, d: { en: 'Institute-level rounds; training begins', mr: 'संस्थास्तरीय फेऱ्या; प्रशिक्षण सुरू' } },
];

export default async function Admissions({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'प्रवेश २०२७–२८' : 'Admissions 2027–28'} lead={mr ? 'सर्व व्यवसायांचे प्रवेश व्यवसाय शिक्षण व प्रशिक्षण संचालनालयाच्या केंद्रीभूत ऑनलाइन प्रक्रियेद्वारे (CAP) होतात.' : 'Admission to every trade is through the centralised online admission process (CAP) of the Directorate of Vocational Education & Training, Maharashtra.'} crumbs={[{ label: mr ? 'प्रवेश' : 'Admissions' }]}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="https://admission.dvet.gov.in" variant="accent" size="lg" arrow>{mr ? 'प्रवेश पोर्टल' : 'DVET admission portal'}</ButtonLink>
          <ButtonLink to="#enquiry" external variant="glass" size="lg">{mr ? 'कॉलबॅक मागवा' : 'Request a callback'}</ButtonLink>
        </div>
      </PageHero>

      <AdmissionStatus lang={lang} />

      <Section>
        <SectionHeading eyebrow={mr ? 'टप्प्याटप्प्याने' : 'Step by step'} title={mr ? 'प्रवेश कसा घ्यावा' : 'How to get admission'} />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title.en} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 80}ms` }} className="relative rounded-3xl bg-white p-6 ring-1 ring-line">
              <span className="font-display text-5xl font-semibold text-brand-100">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-2 text-lg font-bold text-brand-950">{tx(s.title, lang)}</h3>
              <p className="mt-1.5 text-sm text-stone-600">{tx(s.desc, lang)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-3xl bg-brand-900 p-6 text-white sm:p-8">
          <p className="flex items-center gap-2 font-semibold">
            <CalendarRange className="size-5 text-marigold-300" aria-hidden />
            {mr ? 'नेहमीचे वेळापत्रक' : 'Typical timeline'}
          </p>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {months.map((m) => (
              <li key={m.m.en} className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
                <p className="font-display text-2xl font-semibold text-marigold-300">{tx(m.m, lang)}</p>
                <p className="mt-1 text-sm text-white/75">{tx(m.d, lang)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-start gap-2 text-xs text-white/60">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            {mr ? 'अचूक तारखा दरवर्षी संचालनालय जाहीर करते. सूचना फलक पाहत राहा.' : 'Exact dates are announced by DVET every year — keep an eye on the notice board.'}
          </p>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading eyebrow={ui.eligibility} title={mr ? 'व्यवसायनिहाय पात्रता' : 'Eligibility by trade'} />
            <ul className="divide-y divide-line overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
              {trades.map((tr) => (
                <li key={tr.slug} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3.5">
                  <span className="font-semibold text-brand-950">{tx(tr.short ?? tr.name, lang)}</span>
                  <span className="text-sm text-stone-600">
                    {tx(tr.eligibility, lang)} · {tr.durationYears} {tr.durationYears === 1 ? ui.year : ui.years}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-sm text-stone-600">
              <p className="flex gap-2"><CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />{mr ? 'संस्थेत केवळ महिलांना प्रवेश.' : 'Admission is for women candidates only.'}</p>
              <p className="flex gap-2"><CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />{mr ? 'सात तुकड्या अनुसूचित जमातीच्या मुलींसाठी राखीव; शासनाच्या आरक्षण धोरणानुसार प्रवेश.' : 'Seven units are reserved for Scheduled Tribe girls; admissions follow the State’s reservation policy.'}</p>
              <p className="flex gap-2"><CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />{mr ? 'किमान वय १४ वर्षे (संचालनालयाच्या नियमानुसार).' : 'Minimum age 14 years, as per DVET rules.'}</p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow={mr ? 'कागदपत्रे' : 'Documents'} title={mr ? 'कागदपत्रांची तपासणी सूची' : 'Your document checklist'} />
            <DocChecklist lang={lang} />
          </div>
        </div>
      </Section>

      <Section id="support">
        <SectionHeading eyebrow={mr ? 'आर्थिक सहाय्य' : 'Financial support'} title={mr ? 'शिष्यवृत्ती, भत्ते व शुल्क प्रतिपूर्ती' : 'Scholarships, allowances & fee reimbursement'} lead={mr ? 'आर्थिक अडचण शिक्षणाच्या आड येऊ नये यासाठी.' : 'So that money never stands between a young woman and her training.'} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {support.map((s, i) => (
            <li key={s.title.en} data-reveal style={{ ['--reveal-delay' as string]: `${i * 60}ms` }} className="flex flex-col rounded-3xl bg-white p-5 ring-1 ring-line">
              <p className="text-3xl font-bold tracking-tight text-brand-900">{s.amount}</p>
              <p className="text-xs font-semibold text-marigold-700">{tx(s.per, lang)}</p>
              <p className="mt-3 font-semibold text-brand-950">{tx(s.title, lang)}</p>
              <p className="mt-1 text-sm text-stone-600">{tx(s.desc, lang)}</p>
            </li>
          ))}
        </ul>
        <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
          {mr ? 'राज्य शिष्यवृत्तीसाठी महाडीबीटी पोर्टल' : 'Apply for State scholarships on MahaDBT'} <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </Section>

      <Section className="bg-white" id="enquiry">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <Eyebrow>{ui.applyNow}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{mr ? 'प्रवेशाबद्दल मदत हवी आहे?' : 'Need help with admission?'}</h2>
            <p className="mt-4 text-stone-600">{mr ? 'आपला तपशील द्या; प्रवेश प्रक्रिया सुरू झाल्यावर आमचे कार्यालय आपल्याला कॉल करेल.' : 'Share your details and our office will call you back — and remind you when the admission process opens.'}</p>
            <div className="mt-8">
              <h3 className="mb-3 font-semibold text-brand-950">{mr ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently asked'}</h3>
              <FaqList lang={lang} topics={['admission', 'fees']} />
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-8">
              <EnquiryForm lang={lang} type="admission" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
