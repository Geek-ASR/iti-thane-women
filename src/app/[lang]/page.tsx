import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarCheck, Check, ClipboardList, HandCoins, Mail, MapPin, Phone, Quote, ShieldCheck, Sparkles } from 'lucide-react';
import { href, t, tx, type Locale } from '@/lib/i18n';
import { pageMeta, organizationJsonLd } from '@/lib/seo';
import { achievements, campusFacts, history, institute, keyStats, principalMessage, results } from '@/content/institute';
import { partners } from '@/content/industry';
import { Img } from '@/components/Img';
import { Icon } from '@/components/Icon';
import { Badge, ButtonLink, Eyebrow, Section, SectionHeading, ThreadCircuit, cx } from '@/components/ui';
import { TradeExplorer } from '@/components/public/TradeCards';
import { NoticeBoard, EventsList } from '@/components/public/Updates';
import { MapEmbed } from '@/components/public/MapEmbed';
import { ResultsChart } from '@/components/public/ResultsChart';
import { PhoneMockup } from '@/components/public/PhoneMockup';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(
    lang,
    '/',
    lang === 'mr' ? 'राजमाता जिजाऊ शासकीय औद्योगिक प्रशिक्षण संस्था (मुलींची), ठाणे' : 'Rajmata Jijau Govt. ITI (Women), Thane — Skills that power her future',
    lang === 'mr'
      ? '१९९२ पासून युवतींसाठी NCVT संलग्न ११ व्यवसाय — वीजतंत्री, इलेक्ट्रॉनिक्स, IT, मेडिकल इलेक्ट्रॉनिक्स, कॉस्मेटोलॉजी, फॅशन व अधिक. वसतिगृह, शिष्यवृत्ती व प्लेसमेंट.'
      : '11 NCVT trades for young women since 1992 — electrician, electronics, IT, medical electronics, cosmetology, fashion and more. Industry-built labs, hostel, scholarships and placements.',
  );
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  const avgPass = Math.round((results.reduce((s, r) => s + r.passPct, 0) / results.length) * 10) / 10;
  const totalPassed = results.reduce((s, r) => s + r.passed, 0);

  const quick = [
    { icon: 'GraduationCap', label: ui.trades, path: '/trades/' },
    { icon: 'ClipboardCheck', label: mr ? 'प्रवेश' : 'Admissions', path: '/admissions/' },
    { icon: 'Megaphone', label: mr ? 'सूचना' : 'Notices', path: '/notices/' },
    { icon: 'HandCoins', label: mr ? 'शिष्यवृत्ती' : 'Scholarships', path: '/admissions/#support' },
    { icon: 'BriefcaseBusiness', label: mr ? 'प्लेसमेंट' : 'Placements', path: '/placements/' },
    { icon: 'Images', label: mr ? 'छायाचित्रे' : 'Gallery', path: '/gallery/' },
    { icon: 'QrCode', label: mr ? 'स्मार्ट कॅम्पस' : 'Smart Campus', path: '/portal/' },
    { icon: 'Phone', label: ui.contact, path: '/contact/' },
  ];

  const life = [
    { image: 'ojt-helmets', label: mr ? 'टाटा पॉवर येथे OJT' : 'OJT at Tata Power', cls: 'col-span-2 row-span-2' },
    { image: 'annual-3', label: mr ? 'वार्षिक स्नेहसंमेलन' : 'Annual function', cls: '' },
    { image: 'exhibition-3', label: mr ? 'तंत्र प्रदर्शन' : 'Technical exhibition', cls: '' },
    { image: 'sports-kho-kho', label: mr ? 'वार्षिक क्रीडा' : 'Annual sports', cls: '' },
    { image: 'udyam-5', label: mr ? 'नेतृत्व कार्यक्रम' : 'Leadership programme', cls: '' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(lang)) }} />

      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-50" />
        <div aria-hidden className="absolute -top-48 right-[-12%] -z-10 size-[38rem] rounded-full bg-brand-600/45 blur-3xl" />
        <div aria-hidden className="absolute bottom-[-14rem] left-[-10rem] -z-10 size-[30rem] rounded-full bg-marigold-500/25 blur-3xl" />
        <ThreadCircuit className="absolute inset-x-0 bottom-0 -z-10 h-48 w-full text-white/10 sm:h-64" />
        <div className="container-page grid gap-10 pt-9 pb-20 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-16 lg:pb-28">
          <div className="animate-fade-up">
            <div className="flex flex-wrap gap-2">
              <Badge tone="light">
                <BadgeCheck className="size-3.5 text-marigold-300" aria-hidden /> NCVT · DGT
              </Badge>
              <Badge tone="light">{mr ? 'व्य.शि.प्र.सं. महाराष्ट्र' : 'DVET Maharashtra'}</Badge>
            </div>
            <p className="mt-5 text-sm font-semibold text-marigold-300 sm:text-base">{ui.tagline}</p>
            <h1 className="display-tight mt-3 font-display text-[2.65rem] leading-[1.02] font-semibold text-balance sm:text-6xl lg:text-[4.3rem]">
              {mr ? (
                <>
                  <span className="text-marigold-300">तिच्या</span> भविष्याला बळ देणारी कौशल्ये.
                </>
              ) : (
                <>
                  Skills that power <em className="pr-[0.12em] font-medium text-marigold-300">her</em> future.
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/75 text-pretty sm:text-lg">
              {mr
                ? 'वीजतंत्री व इलेक्ट्रॉनिक्सपासून IT, वैद्यकीय तंत्रज्ञान, सौंदर्य व फॅशनपर्यंत ११ NCVT व्यवसाय — उद्योगांच्या सहकार्याने उभारलेल्या प्रयोगशाळांमध्ये, केवळ युवतींसाठी.'
                : 'Eleven NCVT trades — from electrician and electronics to IT, healthcare technology, beauty and fashion — taught in industry-built labs, exclusively for young women.'}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/trades/" lang={lang} variant="accent" size="lg" arrow>
                {mr ? '११ व्यवसाय पहा' : 'Explore 11 trades'}
              </ButtonLink>
              <ButtonLink to="/admissions/" lang={lang} variant="glass" size="lg">
                {mr ? 'प्रवेश प्रक्रिया' : 'How to apply'}
              </ButtonLink>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-2.5 text-sm text-white/75 sm:flex sm:flex-wrap sm:gap-x-6">
              <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-marigold-300" aria-hidden />{mr ? 'शासकीय संस्था · केवळ महिलांसाठी' : 'Government institute · women only'}</li>
              <li className="flex items-center gap-2"><HandCoins className="size-4 text-marigold-300" aria-hidden />{mr ? 'शिष्यवृत्ती व विद्यावेतन' : 'Scholarships & stipends'}</li>
              <li className="flex items-center gap-2"><Sparkles className="size-4 text-marigold-300" aria-hidden />{mr ? 'CSR सहाय्यित आधुनिक प्रयोगशाळा' : 'CSR-built modern labs'}</li>
            </ul>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="grid grid-cols-[1.15fr_1fr] gap-3 sm:gap-4">
              <div className="relative row-span-2 overflow-hidden rounded-[1.75rem] ring-1 ring-white/15">
                <Img name="ojt-drill" alt={mr ? 'हार्ड हॅट घालून साधनावर काम करणारी प्रशिक्षणार्थी' : 'Trainee in a hard hat working with a power tool during on-the-job training'} fill priority sizes="(min-width: 1024px) 28vw, 55vw" className="object-[50%_35%]" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] ring-1 ring-white/15">
                <Img name="trade-electrician-1" alt={mr ? 'नियंत्रण पॅनेलवर वीजतंत्री प्रशिक्षणार्थी' : 'Electrician trainees at control panels'} fill priority sizes="(min-width: 1024px) 22vw, 42vw" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] ring-1 ring-white/15">
                <Img name="trade-copa-1" alt={mr ? 'संगणक प्रयोगशाळेत COPA प्रशिक्षणार्थी' : 'COPA trainees in the computer lab'} fill sizes="(min-width: 1024px) 22vw, 42vw" />
              </div>
            </div>
            <div className="absolute -bottom-6 left-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-950 shadow-lift sm:left-6">
              <span className="grid size-10 place-items-center rounded-xl bg-marigold-100 text-marigold-700">
                <Icon name="Trophy" className="size-5" />
              </span>
              <span>
                <span className="block text-xl leading-none font-bold">{avgPass}%</span>
                <span className="block text-xs text-stone-500">{mr ? 'सरासरी निकाल (८ सत्रे)' : 'avg. pass rate, 8 sessions'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Quick access ---------- */}
      <div className="container-page relative z-10 -mt-9">
        <nav aria-label={mr ? 'झटपट प्रवेश' : 'Quick access'} className="grid grid-cols-4 gap-1 rounded-3xl bg-white p-2.5 shadow-lift ring-1 ring-line sm:gap-2 sm:p-3 lg:grid-cols-8">
          {quick.map((q) => (
            <Link key={q.path} href={q.path.startsWith('/portal') ? q.path : href(lang, q.path)} className="group flex flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition-colors hover:bg-brand-50">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white sm:size-12">
                <Icon name={q.icon} className="size-5" />
              </span>
              <span className="text-[0.72rem] leading-tight font-semibold text-brand-950 sm:text-[0.82rem]">{q.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ---------- Key stats ---------- */}
      <Section className="pb-6 sm:pb-8 lg:pb-10" labelledBy="stats-h">
        <h2 id="stats-h" className="sr-only">{mr ? 'संस्था एका दृष्टिक्षेपात' : 'The institute at a glance'}</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {keyStats.map((s, i) => (
            <div key={s.label.en} data-reveal style={{ ['--reveal-delay' as string]: `${i * 60}ms` }} className="flex flex-col border-l-2 border-marigold-400 pl-4">
              <dt className="order-2 mt-1 text-sm text-stone-600">{tx(s.label, lang)}</dt>
              <dd className="order-1 text-3xl font-bold tracking-tight text-brand-950 sm:text-[2.1rem]">
                {'prefix' in s ? s.prefix : ''}
                {'plain' in s ? s.value : s.value.toLocaleString('en-IN')}
                {'suffix' in s ? s.suffix : ''}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ---------- About snapshot ---------- */}
      <Section labelledBy="about-h">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
              <Img name="campus-entrance" alt={mr ? 'संस्थेच्या इमारतीचे हिरवेगार प्रवेशद्वार' : 'The green entrance of the institute building at Kopri Colony'} fill sizes="(min-width: 1024px) 45vw, 92vw" />
            </div>
            <div className="absolute -right-2 -bottom-8 hidden w-44 overflow-hidden rounded-2xl shadow-lift ring-4 ring-paper sm:block lg:-right-8 lg:w-56">
              <Img name="campus-building" alt="" sizes="14rem" />
            </div>
            <div className="absolute top-4 left-4 rounded-2xl bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
              <p className="text-xs font-semibold text-stone-500">{mr ? 'स्थापना' : 'Since'}</p>
              <p className="text-lg font-bold text-brand-950">{mr ? '२४ जुलै १९९२' : '24 July 1992'}</p>
            </div>
          </div>
          <div data-reveal>
            <Eyebrow>{mr ? 'संस्थेविषयी' : 'About the institute'}</Eyebrow>
            <h2 id="about-h" className="display-tight mt-3 font-display text-[1.9rem] leading-[1.1] font-semibold text-brand-950 text-balance sm:text-4xl lg:text-[2.6rem]">
              {mr ? 'तांत्रिक करिअर घडवणाऱ्या महिलांसाठी उभारलेली शासकीय संस्था' : 'A government institute built for women in technical careers'}
            </h2>
            <p className="mt-5 text-stone-600 text-pretty">{tx(history, lang).split('. ').slice(0, 3).join('. ')}.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {campusFacts.slice(0, 4).map((f) => (
                <li key={f.value} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                  <p className="text-xl font-bold text-brand-900">{f.value}</p>
                  <p className="text-sm text-stone-600">{tx(f.label, lang)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink to="/about/" lang={lang} arrow>{mr ? 'आमची वाटचाल' : 'Our story'}</ButtonLink>
              <ButtonLink to="/campus/" lang={lang} variant="outline">{ui.ourLabs}</ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Trades ---------- */}
      <Section className="bg-white" labelledBy="trades-h">
        <SectionHeading
          id="trades-h"
          eyebrow={mr ? 'व्यवसाय (ट्रेड)' : 'Trades'}
          title={mr ? 'आपला व्यवसाय निवडा' : 'Choose a trade, build a career'}
          lead={mr ? '५ अभियांत्रिकी व ६ बिगर-अभियांत्रिकी व्यवसाय — १ किंवा २ वर्षांचे, NCVT राष्ट्रीय व्यवसाय प्रमाणपत्रासह.' : 'Five engineering and six non-engineering trades — one or two years long, leading to the NCVT National Trade Certificate.'}
          action={<ButtonLink to="/trades/" lang={lang} variant="outline" arrow>{mr ? 'तुलना करा' : 'Compare all trades'}</ButtonLink>}
        />
        <TradeExplorer lang={lang} />
      </Section>

      {/* ---------- Results ---------- */}
      <Section labelledBy="results-h">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
          <div data-reveal>
            <Eyebrow>{mr ? 'निकाल' : 'Results'}</Eyebrow>
            <h2 id="results-h" className="display-tight mt-3 font-display text-[1.9rem] leading-[1.1] font-semibold text-brand-950 text-balance sm:text-4xl lg:text-[2.6rem]">
              {mr ? 'सातत्यपूर्ण उत्कृष्ट निकाल' : 'Results that speak for themselves'}
            </h2>
            <p className="mt-4 text-stone-600">{mr ? 'गेल्या आठ प्रवेश सत्रांत अंतिम परीक्षेस बसलेल्या प्रशिक्षणार्थींपैकी सरासरी ९५% उत्तीर्ण.' : 'Across the last eight admission sessions, an average of 95% of trainees who appeared for the final trade test passed.'}</p>
            <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-6">
              <div>
                <p className="text-6xl font-bold tracking-tight text-brand-900">{avgPass}%</p>
                <p className="mt-1 text-sm text-stone-600">{mr ? 'सरासरी निकाल, २०१६–२०२३' : 'average pass rate, 2016–2023'}</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-brand-950">{totalPassed.toLocaleString('en-IN')}</p>
                <p className="mt-1 text-sm text-stone-600">{mr ? 'उत्तीर्ण प्रशिक्षणार्थी' : 'trainees certified'}</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-brand-950">~90%</p>
                <p className="mt-1 text-sm text-stone-600">{mr ? 'शिकाऊ उमेदवारी' : 'apprenticeship rate'}</p>
              </div>
            </div>
          </div>
          <div data-reveal className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-7">
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <p className="font-semibold text-brand-950">{mr ? 'निकालाची टक्केवारी, प्रवेश सत्रनिहाय' : 'Pass rate by admission session'}</p>
              <p className="text-xs text-stone-500">{mr ? 'स्रोत: संस्था नोंदी' : 'Source: institute records'}</p>
            </div>
            <ResultsChart lang={lang} />
          </div>
        </div>
      </Section>

      {/* ---------- Highlights ---------- */}
      <Section className="bg-white" labelledBy="why-h">
        <SectionHeading id="why-h" align="center" eyebrow={mr ? 'आम्हालाच का निवडावे' : 'Why ITI Thane (Women)'} title={mr ? 'शिकण्याचे सुरक्षित, आधुनिक ठिकाण' : 'A safe, modern place to learn a trade'} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <li key={a.title.en} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 3) * 80}ms` }} className="rounded-3xl bg-paper p-6 ring-1 ring-line">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-900 text-marigold-300">
                <Icon name={a.icon} className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-brand-950">{tx(a.title, lang)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{tx(a.desc, lang)}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- Industry ---------- */}
      <section aria-labelledby="industry-h" className="overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            id="industry-h"
            eyebrow={mr ? 'उद्योग भागीदारी' : 'Industry partnerships'}
            title={mr ? 'उद्योगांनी उभारलेल्या प्रयोगशाळा' : 'Labs built hand-in-hand with industry'}
            lead={mr ? 'CSR अंतर्गत प्रयोगशाळा, सामंजस्य करार, OJT व शिष्यवृत्तीद्वारे नामांकित कंपन्या आमच्या प्रशिक्षणार्थींच्या पाठीशी आहेत.' : 'Leading companies back our trainees through CSR-funded labs, MoUs, on-the-job training and scholarships.'}
            action={<ButtonLink to="/industry/" lang={lang} variant="outline" arrow>{mr ? 'भागीदार व CSR' : 'Partners & CSR'}</ButtonLink>}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { image: 'lab-electrician-schindler', partner: 'Schindler India', title: { en: 'Electrician Lab 2 — 23 machines', mr: 'वीजतंत्री प्रयोगशाळा २ — २३ यंत्रे' } },
              { image: 'lab-cosmetology', partner: 'D’Mart', title: { en: 'Salon-style Cosmetology lab', mr: 'सलूनसारखी कॉस्मेटोलॉजी प्रयोगशाळा' } },
              { image: 'lab-ictsm', partner: 'SGS Vikhroli', title: { en: 'ICTSM & electronics labs', mr: 'ICTSM व इलेक्ट्रॉनिक्स प्रयोगशाळा' } },
            ].map((c, i) => (
              <figure key={c.image} data-reveal style={{ ['--reveal-delay' as string]: `${i * 90}ms` }} className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
                <Img name={c.image} alt={tx(c.title, lang)} fill sizes="(min-width: 768px) 32vw, 92vw" className="transition duration-700 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-bold tracking-wider text-marigold-300 uppercase">{c.partner}</p>
                  <p className="mt-1 text-lg font-semibold">{tx(c.title, lang)}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="marquee relative mt-10 overflow-hidden border-y border-line bg-white py-5" aria-label={mr ? 'उद्योग भागीदार' : 'Industry partners'}>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white" />
          <ul className="marquee-track flex w-max animate-marquee items-center gap-4 motion-reduce:animate-none" style={{ ['--marquee-duration' as string]: '50s' }}>
            {[0, 1].map((copy) =>
              partners.map((p) => (
                <li key={`${copy}-${p.name}`} aria-hidden={copy === 1} className="flex items-center gap-3 rounded-2xl bg-paper px-5 py-3 ring-1 ring-line">
                  <span className="text-[1.05rem] font-bold whitespace-nowrap text-brand-950">{p.short ?? p.name}</span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[0.65rem] font-bold whitespace-nowrap text-brand-700">{tx(p.kind, lang)}</span>
                </li>
              )),
            )}
          </ul>
        </div>
      </section>

      {/* ---------- Smart Campus ---------- */}
      <section aria-labelledby="smart-h" className="relative isolate overflow-hidden bg-brand-950 py-16 text-white sm:py-20 lg:py-24">
        <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-40" />
        <div aria-hidden className="absolute top-1/2 left-1/2 -z-10 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/35 blur-3xl" />
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow tone="light">{mr ? 'स्मार्ट कॅम्पस' : 'Smart Campus'}</Eyebrow>
            <h2 id="smart-h" className="display-tight mt-3 font-display text-[1.9rem] leading-[1.1] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
              {mr ? 'संपूर्ण आय.टी.आय. आपल्या मोबाईलवर' : 'Your whole ITI, right on your phone'}
            </h2>
            <p className="mt-4 max-w-xl text-white/75">{mr ? 'प्रशिक्षणार्थी, निदेशक व नियोक्त्यांसाठी एकच सुरक्षित पोर्टल — कागदाविना उपस्थिती, ऑनलाइन चाचण्या व नोकरीच्या संधी.' : 'One secure portal for trainees, instructors and employers — paperless attendance, online tests and job openings, built for the phone in every trainee’s pocket.'}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: 'QrCode', title: { en: 'Smart attendance', mr: 'स्मार्ट उपस्थिती' }, desc: { en: 'Rotating QR codes with geo-check; live %, 80% eligibility alerts.', mr: 'बदलणारे QR कोड व स्थान पडताळणी; ८०% पात्रता सूचना.' } },
                { icon: 'ListChecks', title: { en: 'Online quizzes', mr: 'ऑनलाइन प्रश्नमंजुषा' }, desc: { en: 'Timed tests, instant results, answer review and leaderboards.', mr: 'वेळबद्ध चाचण्या, त्वरित निकाल व उत्तर पुनरावलोकन.' } },
                { icon: 'BriefcaseBusiness', title: { en: 'Job & apprenticeship portal', mr: 'नोकरी व शिकाऊ उमेदवारी' }, desc: { en: 'Verified employers, one-tap apply, resume builder.', mr: 'पडताळलेले नियोक्ते, एका क्लिकवर अर्ज, रेझ्युमे बिल्डर.' } },
              ].map((f) => (
                <li key={f.title.en} className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10 lg:flex lg:items-start lg:gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-marigold-400 text-brand-950">
                    <Icon name={f.icon} className="size-5" />
                  </span>
                  <span className="block">
                    <span className="mt-3 block font-semibold lg:mt-0">{tx(f.title, lang)}</span>
                    <span className="mt-1 block text-sm text-white/65">{tx(f.desc, lang)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/portal/" variant="accent" size="lg" arrow>{mr ? 'स्मार्ट कॅम्पस उघडा' : 'Open Smart Campus'}</ButtonLink>
              <ButtonLink to="/app/" lang={lang} variant="glass" size="lg" className="in-app-hidden">
                <Icon name="Smartphone" className="size-5" />
                {mr ? 'ॲप मिळवा' : 'Get the app'}
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <PhoneMockup lang={lang} />
          </div>
        </div>
      </section>

      {/* ---------- Life at ITI ---------- */}
      <Section labelledBy="life-h">
        <SectionHeading
          id="life-h"
          eyebrow={mr ? 'विद्यार्थी जीवन' : 'Life at ITI Thane'}
          title={mr ? 'वर्गाबाहेरचे शिक्षण' : 'Learning that goes beyond the classroom'}
          action={<ButtonLink to="/student-life/" lang={lang} variant="outline" arrow>{mr ? 'विद्यार्थी जीवन' : 'Student life'}</ButtonLink>}
        />
        <ul className="grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:grid-cols-4">
          {life.map((p, i) => (
            <li key={p.image} data-reveal style={{ ['--reveal-delay' as string]: `${i * 70}ms` }} className={cx('group relative overflow-hidden rounded-3xl', p.cls)}>
              <Img name={p.image} alt={p.label} fill sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'} className="transition duration-700 group-hover:scale-105" />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-950/75 to-transparent" />
              <p className="absolute bottom-3 left-4 text-sm font-semibold text-white sm:text-base">{p.label}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- Notices & events ---------- */}
      <Section className="bg-white" labelledBy="updates-h">
        <SectionHeading id="updates-h" eyebrow={mr ? 'अद्ययावत माहिती' : 'Stay updated'} title={mr ? 'सूचना व घडामोडी' : 'Notices & happenings'} />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <NoticeBoard lang={lang} />
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-brand-950">{mr ? 'कार्यक्रम' : 'Events'}</h3>
              <Link href={href(lang, '/events/')} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
                {ui.viewAll} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <EventsList lang={lang} limit={4} variant="compact" />
          </div>
        </div>
      </Section>

      {/* ---------- Principal ---------- */}
      <Section labelledBy="principal-h">
        <figure data-reveal className="relative overflow-hidden rounded-[2rem] bg-brand-900 p-7 text-white sm:p-12 lg:p-14">
          <div aria-hidden className="bg-dots absolute inset-0 opacity-40" />
          <Quote aria-hidden className="absolute top-6 right-6 size-24 text-white/10 sm:size-32" />
          <div className="relative max-w-3xl">
            <Eyebrow tone="light">{mr ? 'प्राचार्यांचे मनोगत' : 'From the Principal’s desk'}</Eyebrow>
            <h2 id="principal-h" className="sr-only">{mr ? 'प्राचार्यांचे मनोगत' : 'Principal’s message'}</h2>
            <blockquote className="mt-5 font-display text-xl leading-relaxed text-white/95 sm:text-2xl">“{tx(principalMessage.paragraphs[0], lang)}”</blockquote>
            <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full bg-marigold-400 font-display text-lg font-semibold text-brand-950">SM</span>
                <div>
                  <p className="font-semibold">{institute.principal.name}</p>
                  <p className="text-sm text-white/65">{tx(institute.principal.title, lang)}, {ui.shortName}</p>
                </div>
              </div>
              <ButtonLink to="/about/#principal" lang={lang} variant="glass" size="sm" arrow>{ui.readMore}</ButtonLink>
            </figcaption>
          </div>
        </figure>
      </Section>

      {/* ---------- Admission CTA ---------- */}
      <section aria-labelledby="cta-h" className="relative isolate overflow-hidden bg-marigold-400 py-14 text-brand-950 sm:py-16">
        <div aria-hidden className="bg-dots-ink absolute inset-0 -z-10 opacity-60" />
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 id="cta-h" className="display-tight font-display text-[1.9rem] leading-[1.1] font-semibold text-balance sm:text-4xl">
              {mr ? 'प्रवेश २०२७–२८: आत्ताच तयारी सुरू करा' : 'Admissions 2027–28: start preparing today'}
            </h2>
            <ol className="mt-5 grid gap-2 text-[0.95rem] font-medium sm:grid-cols-3">
              {(mr ? ['admission.dvet.gov.in वर नोंदणी', 'विकल्प अर्जात आमची संस्था निवडा', 'CAP फेरीनंतर कागदपत्रांसह हजर व्हा'] : ['Register on admission.dvet.gov.in', 'Pick “Govt. ITI (Women), Thane” in options', 'Report with documents after CAP allotment']).map((s, i) => (
                <li key={s} className="flex items-start gap-2.5 rounded-2xl bg-white/45 p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-950 text-xs font-bold text-white">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ButtonLink to="/admissions/" lang={lang} size="lg" arrow>
              <ClipboardList className="size-5" aria-hidden />
              {mr ? 'प्रवेश मार्गदर्शक' : 'Admission guide'}
            </ButtonLink>
            <ButtonLink to="/admissions/#enquiry" lang={lang} variant="light" size="lg">
              <CalendarCheck className="size-5" aria-hidden />
              {mr ? 'कॉलबॅक मागवा' : 'Request a callback'}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------- Visit ---------- */}
      <Section labelledBy="visit-h">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div data-reveal>
            <Eyebrow>{ui.reachUs}</Eyebrow>
            <h2 id="visit-h" className="display-tight mt-3 font-display text-[1.9rem] leading-[1.1] font-semibold text-brand-950 sm:text-4xl">{mr ? 'आम्हाला भेट द्या' : 'Visit the campus'}</h2>
            <p className="mt-4 text-stone-600">{mr ? 'ठाणे रेल्वे स्थानकाच्या (पूर्व) पासून १०–१५ मिनिटांच्या चालण्याच्या अंतरावर.' : 'A 10–15 minute walk from the east side of Thane railway station.'}</p>
            <ul className="mt-6 space-y-3">
              <li className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                <span className="text-sm text-stone-700">{tx(institute.address, lang)}</span>
              </li>
              <li className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                <span className="flex flex-col gap-1 text-sm">
                  {institute.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="font-semibold text-brand-900 hover:underline">
                      {p.display}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                <a href={`mailto:${institute.email}`} className="text-sm font-semibold break-all text-brand-900 hover:underline">
                  {institute.email}
                </a>
              </li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-2 text-xs text-stone-600">
              {(mr ? ['ठाणे रेल्वे स्थानक (पूर्व)', 'बस थांबा: ठाणे स्टेशन (पूर्व) कोपरी'] : ['Thane railway station (East)', 'Bus stop: Thane Station (East) Kopri']).map((x) => (
                <li key={x} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-line">
                  <Check className="size-3.5 text-emerald-600" aria-hidden /> {x}
                </li>
              ))}
            </ul>
          </div>
          <MapEmbed lang={lang} className="min-h-80 lg:min-h-full" />
        </div>
      </Section>
    </>
  );
}
