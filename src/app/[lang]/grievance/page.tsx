import type { Metadata } from 'next';
import { ArrowUpRight, Ban, Inbox, Phone, Scale, ShieldCheck, UsersRound } from 'lucide-react';
import { tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { institute } from '@/content/institute';
import { helplines } from '@/content/updates';
import { Eyebrow, PageHero, Section } from '@/components/ui';
import { EnquiryForm } from '@/components/public/EnquiryForm';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/grievance/', lang === 'mr' ? 'तक्रार निवारण व महिला सुरक्षा' : 'Grievance redressal & women’s safety', lang === 'mr' ? 'ऑनलाइन तक्रार, अंतर्गत तक्रार समिती, रॅगिंगविरोधी धोरण व हेल्पलाइन क्रमांक.' : 'Submit a grievance online, learn about the Internal Complaints Committee and anti-ragging policy, and find women’s helpline numbers.');
}

export default async function Grievance({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  const pillars = [
    { icon: UsersRound, title: { en: 'Internal Complaints Committee', mr: 'अंतर्गत तक्रार समिती' }, desc: { en: 'As required under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, complaints are heard confidentially by the Internal Complaints Committee.', mr: 'कामाच्या ठिकाणी महिलांचा लैंगिक छळ (प्रतिबंध, मनाई व निवारण) अधिनियम, २०१३ नुसार अंतर्गत तक्रार समिती तक्रारींची गोपनीयपणे सुनावणी करते.' } },
    { icon: Ban, title: { en: 'Zero tolerance for ragging', mr: 'रॅगिंगला पूर्ण मनाई' }, desc: { en: 'Ragging in any form is prohibited and is a punishable offence under the Maharashtra Prohibition of Ragging Act, 1999.', mr: 'कोणत्याही स्वरूपातील रॅगिंग प्रतिबंधित असून महाराष्ट्र रॅगिंग प्रतिबंध अधिनियम, १९९९ अंतर्गत दंडनीय गुन्हा आहे.' } },
    { icon: Inbox, title: { en: 'Women’s complaint box', mr: 'महिला तक्रार पेटी' }, desc: { en: 'A confidential complaint box (महिला तक्रार पेटी) is placed on campus for anyone who prefers to write in.', mr: 'लेखी तक्रार करू इच्छिणाऱ्यांसाठी परिसरात गोपनीय महिला तक्रार पेटी ठेवली आहे.' } },
    { icon: Scale, title: { en: 'Time-bound redressal', mr: 'कालबद्ध निवारण' }, desc: { en: 'Grievances submitted online receive a reference number and are reviewed by the Principal’s office.', mr: 'ऑनलाइन तक्रारींना संदर्भ क्रमांक दिला जातो व प्राचार्य कार्यालय त्यांचा आढावा घेते.' } },
  ];
  return (
    <>
      <PageHero lang={lang} title={mr ? 'तक्रार निवारण व महिला सुरक्षा' : 'Grievance redressal & safety'} lead={mr ? 'प्रत्येक प्रशिक्षणार्थीला सुरक्षित व सन्मानाचे वातावरण मिळावे हे आमचे वचन आहे.' : 'Every trainee deserves a safe, respectful campus. Tell us when something is wrong — we will act on it.'} crumbs={[{ label: mr ? 'तक्रार निवारण' : 'Grievance' }]}>
        <ul className="flex flex-wrap gap-2">
          {helplines.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.number}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm ring-1 ring-white/20 hover:bg-white/20">
                <Phone className="size-4 text-marigold-300" aria-hidden />
                <span className="font-bold">{h.number}</span>
                <span className="text-white/75">{tx(h.label, lang)}</span>
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
          <div className="space-y-4">
            {pillars.map((p) => (
              <div key={p.title.en} data-reveal className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-line">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-900 text-marigold-300">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-brand-950">{tx(p.title, lang)}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-stone-600">{tx(p.desc, lang)}</span>
                </span>
              </div>
            ))}
            <a href={institute.grievanceForm} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-3xl bg-brand-50 p-5 ring-1 ring-brand-100 hover:bg-brand-100">
              <span>
                <span className="block font-semibold text-brand-950">{mr ? 'संचालनालयाचा अधिकृत तक्रार अर्ज' : 'Official DVET grievance form'}</span>
                <span className="block text-sm text-stone-600">forms.gle · {mr ? 'संस्थेच्या अधिकृत पानावरील दुवा' : 'linked from the institute’s official page'}</span>
              </span>
              <ArrowUpRight className="size-5 text-brand-700" aria-hidden />
            </a>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-8">
              <Eyebrow>{mr ? 'ऑनलाइन तक्रार' : 'Online grievance'}</Eyebrow>
              <h2 className="mt-3 mb-6 flex items-center gap-2 font-display text-2xl font-semibold text-brand-950">
                <ShieldCheck className="size-6 text-emerald-600" aria-hidden />
                {mr ? 'आपली तक्रार नोंदवा' : 'Tell us what happened'}
              </h2>
              <EnquiryForm lang={lang} type="grievance" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
