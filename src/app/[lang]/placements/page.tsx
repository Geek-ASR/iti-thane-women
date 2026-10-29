import type { Metadata } from 'next';
import { ArrowUpRight, BadgeCheck, Building, FileText, GraduationCap, Handshake, Search } from 'lucide-react';
import { t, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { ojtPrograms, outcomes, partners } from '@/content/industry';
import { events } from '@/content/life';
import { Img } from '@/components/Img';
import { ButtonLink, Eyebrow, PageHero, Section, SectionHeading } from '@/components/ui';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/placements/', lang === 'mr' ? 'प्लेसमेंट व शिकाऊ उमेदवारी' : 'Placement & apprenticeship', lang === 'mr' ? 'सुमारे ९०% शिकाऊ उमेदवारी, OJT भागीदार, रोजगार मेळावे व नोकरी पोर्टल.' : 'About 90% of pass-outs get apprenticeships. OJT partners, job fairs, apprenticeship guidance and the Smart Campus job portal.');
}

export default async function Placements({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  const fair = events.find((e) => e.id === 'job-fair-2021');
  const path = [
    { icon: GraduationCap, title: { en: 'Train on industry equipment', mr: 'उद्योगातील उपकरणांवर प्रशिक्षण' }, desc: { en: 'CSR-built labs mirror real workplaces.', mr: 'CSR प्रयोगशाळा प्रत्यक्ष कार्यस्थळासारख्या.' } },
    { icon: Building, title: { en: 'On-the-job training', mr: 'प्रत्यक्ष कामावरील प्रशिक्षण' }, desc: { en: '15 days to a month at partner companies.', mr: 'भागीदार कंपन्यांत १५ दिवस ते १ महिना.' } },
    { icon: FileText, title: { en: 'Resume & interview prep', mr: 'रेझ्युमे व मुलाखत तयारी' }, desc: { en: 'Build your resume in the Smart Campus portal.', mr: 'स्मार्ट कॅम्पस पोर्टलवर रेझ्युमे तयार करा.' } },
    { icon: Handshake, title: { en: 'Apprenticeship or job', mr: 'शिकाऊ उमेदवारी किंवा नोकरी' }, desc: { en: 'Campus drives, job fairs and Apprenticeship India.', mr: 'कॅम्पस ड्राइव्ह, रोजगार मेळावे व अप्रेंटिसशिप इंडिया.' } },
  ];
  return (
    <>
      <PageHero
        lang={lang}
        title={mr ? 'प्लेसमेंट व शिकाऊ उमेदवारी' : 'Placement & apprenticeship'}
        lead={mr ? 'प्रशिक्षणापासून करिअरपर्यंत — OJT, शिकाऊ उमेदवारी व नोकरीसाठी प्लेसमेंट विभागाचे मार्गदर्शन.' : 'From training to a career — our placement cell connects trainees with OJT, apprenticeships and jobs.'}
        crumbs={[{ label: mr ? 'प्लेसमेंट' : 'Placements' }]}
        image={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
            <Img name="ojt-tatapower-1" alt="" fill priority sizes="40vw" />
          </div>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/portal/jobs/" variant="accent" size="lg">
            <Search className="size-5" aria-hidden />
            {mr ? 'नोकरीच्या संधी पहा' : 'Browse openings'}
          </ButtonLink>
          <ButtonLink to="/portal/register/?role=employer" variant="glass" size="lg">{mr ? 'नियोक्ता नोंदणी' : 'Hire from us'}</ButtonLink>
        </div>
      </PageHero>

      <Section>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <div key={o.value + i} data-reveal className="flex flex-col rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
              <dt className="order-2 mt-1 text-sm text-stone-600">{tx(o.label, lang)}</dt>
              <dd className="order-1 text-4xl font-bold tracking-tight text-brand-900">{o.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-stone-500">{mr ? 'संस्थेच्या नोंदींनुसार अंदाजे आकडेवारी.' : 'Approximate figures as reported in institute records.'}</p>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow={mr ? 'प्रवास' : 'The journey'} title={mr ? 'प्रशिक्षणार्थी ते व्यावसायिक' : 'From trainee to professional'} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {path.map((p, i) => (
            <li key={p.title.en} data-reveal style={{ ['--reveal-delay' as string]: `${i * 80}ms` }} className="relative rounded-3xl bg-paper p-6 ring-1 ring-line">
              <span className="absolute top-5 right-5 font-display text-4xl font-semibold text-brand-100">{i + 1}</span>
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-900 text-marigold-300">
                <p.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-bold text-brand-950">{tx(p.title, lang)}</h3>
              <p className="mt-1 text-sm text-stone-600">{tx(p.desc, lang)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow="OJT" title={mr ? 'प्रत्यक्ष कामावरील प्रशिक्षण भागीदार' : 'On-the-job training partners'} lead={mr ? 'एका वर्षात २१६ प्रशिक्षणार्थींनी कारखान्यात प्रत्यक्ष प्रशिक्षण घेतले.' : '216 trainees trained on real shop floors in a single year.'} />
            <ul className="space-y-3">
              {ojtPrograms.map((o) => (
                <li key={o.companies + o.trade.en} className="grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-line sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-semibold text-brand-950">{o.companies}</p>
                    <p className="text-sm text-stone-600">{tx(o.trade, lang)} · {tx(o.duration, lang)}</p>
                  </div>
                  <p className="text-sm font-bold text-brand-800 sm:text-right">
                    {o.trainees} <span className="font-medium text-stone-500">{mr ? 'प्रशिक्षणार्थी' : 'trainees'}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div data-reveal className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line">
              <div className="relative aspect-[16/9]">
                <Img name="ojt-helmets" alt={mr ? 'सौर प्रकल्पावर प्रशिक्षण' : 'Field training at a solar installation'} fill sizes="(min-width: 1024px) 34vw, 92vw" />
              </div>
              <div className="p-6">
                <Eyebrow>{mr ? 'शिकाऊ उमेदवारी' : 'Apprenticeship'}</Eyebrow>
                <p className="mt-3 text-stone-700">{mr ? 'उत्तीर्ण झाल्यावर Apprenticeship India पोर्टलवर नोंदणी करा. प्लेसमेंट विभाग प्रोफाइल पूर्ण करण्यास व अर्ज करण्यास मदत करतो.' : 'After passing, register on the Apprenticeship India portal. The placement cell helps you complete your profile and apply to establishments.'}</p>
                <a href="https://www.apprenticeshipindia.gov.in" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
                  apprenticeshipindia.gov.in <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
            {fair && (
              <div data-reveal className="rounded-3xl bg-brand-900 p-6 text-white">
                <p className="text-xs font-bold tracking-wider text-marigold-300 uppercase">{mr ? 'रोजगार मेळावा' : 'Job fair'}</p>
                <p className="mt-2 font-display text-xl font-semibold">{tx(fair.title, lang)}</p>
                <p className="mt-2 text-sm text-white/75">{tx(fair.body, lang)}</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow={mr ? 'भागीदार' : 'Partners'} title={mr ? 'आमच्याशी जोडलेल्या कंपन्या' : 'Companies that work with us'} action={<ButtonLink to="/industry/" lang={lang} variant="outline" arrow>{mr ? 'उद्योग व CSR' : 'Industry & CSR'}</ButtonLink>} />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((p) => (
            <li key={p.name} className="flex flex-col justify-between gap-2 rounded-2xl bg-paper p-4 ring-1 ring-line">
              <span className="font-bold text-brand-950">{p.name}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <BadgeCheck className="size-3.5" aria-hidden /> {tx(p.kind, lang)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-3xl bg-marigold-400 p-6 text-brand-950 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-display text-2xl font-semibold">{mr ? 'आमच्या प्रशिक्षणार्थींना नियुक्त करा' : 'Hire skilled women technicians'}</p>
            <p className="mt-1 text-brand-950/80">{mr ? 'नियोक्ता म्हणून नोंदणी करा व पडताळणीनंतर संधी प्रसिद्ध करा.' : 'Register as an employer and post openings once our placement cell verifies you.'}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:mt-0 sm:flex-row">
            <ButtonLink to="/portal/register/?role=employer" size="lg">{mr ? 'नियोक्ता नोंदणी' : 'Employer sign-up'}</ButtonLink>
            <ButtonLink to="/industry/#partner" lang={lang} variant="light" size="lg">{ui.contact}</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
