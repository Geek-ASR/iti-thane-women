import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Award, BookOpen, Briefcase, CircleCheck, Clock, Factory, GraduationCap, Layers, Users } from 'lucide-react';
import { t, tx, type Locale } from '@/lib/i18n';
import { absolute, pageMeta } from '@/lib/seo';
import { tradeBySlug, trades } from '@/content/trades';
import { institute } from '@/content/institute';
import { Img } from '@/components/Img';
import { Icon } from '@/components/Icon';
import { accentClasses, Badge, ButtonLink, cx, Eyebrow, PageHero, Section } from '@/components/ui';
import { TradeCard } from '@/components/public/TradeCards';
import { EnquiryForm } from '@/components/public/EnquiryForm';

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return trades.map((tr) => ({ slug: tr.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const tr = tradeBySlug(slug);
  if (!tr) return {};
  return pageMeta(lang, `/trades/${slug}/`, tx(tr.name, lang), `${tx(tr.tagline, lang)} ${tx(tr.overview, lang)}`.slice(0, 300), `/images/${tr.images[0]}-1600.webp`);
}

export default async function TradePage({ params }: Props) {
  const { lang, slug } = await params;
  const tr = tradeBySlug(slug);
  if (!tr) notFound();
  const ui = t(lang);
  const mr = lang === 'mr';
  const a = accentClasses[tr.accent];
  const related = trades.filter((x) => x.type === tr.type && x.slug !== tr.slug).slice(0, 3);
  const facts = [
    { icon: Clock, label: ui.duration, value: `${tr.durationYears} ${tr.durationYears === 1 ? ui.year : ui.years}` },
    { icon: GraduationCap, label: ui.eligibility, value: tx(tr.eligibility, lang) },
    { icon: Users, label: ui.seats, value: tr.seats ? String(tr.seats) : mr ? 'संचालनालय जाहीर करेल' : 'As notified by DVET' },
    { icon: Layers, label: ui.units, value: String(tr.units) },
    { icon: Award, label: ui.certification, value: ui.ncvt },
    { icon: Factory, label: mr ? 'क्षेत्र' : 'Sector', value: tx(tr.sector, lang) },
  ];
  const courseLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: tx(tr.name, lang),
    description: tx(tr.overview, lang),
    url: absolute(`/${lang}/trades/${tr.slug}/`),
    educationalCredentialAwarded: 'National Trade Certificate (NCVT)',
    timeRequired: `P${tr.durationYears}Y`,
    inLanguage: lang === 'mr' ? 'mr' : 'en',
    provider: { '@type': 'EducationalOrganization', name: institute.name.en, sameAs: institute.officialPage },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }} />
      <PageHero
        lang={lang}
        title={tx(tr.name, lang)}
        lead={tx(tr.tagline, lang)}
        crumbs={[{ label: ui.trades, path: '/trades/' }, { label: tx(tr.short ?? tr.name, lang) }]}
        image={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
            <Img name={tr.images[0]} alt={tx(tr.name, lang)} fill priority sizes="40vw" />
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="light">{tr.code}</Badge>
          <Badge tone="light">{tr.type === 'engineering' ? ui.engineering : ui.nonEngineering}</Badge>
          <Badge tone="light">
            <Clock className="size-3.5" aria-hidden /> {tr.durationYears} {tr.durationYears === 1 ? ui.year : ui.years}
          </Badge>
          {tr.isNew && <Badge tone="marigold">{ui.new}</Badge>}
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="#enquiry" variant="accent" size="lg" external>{ui.applyNow}</ButtonLink>
          <ButtonLink to="/admissions/" lang={lang} variant="glass" size="lg">{mr ? 'प्रवेश प्रक्रिया' : 'How to apply'}</ButtonLink>
        </div>
      </PageHero>

      {/* Mobile hero image */}
      <div className="container-page -mb-4 pt-6 lg:hidden">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-soft">
          <Img name={tr.images[0]} alt={tx(tr.name, lang)} fill priority sizes="92vw" />
        </div>
      </div>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div className="space-y-12">
            <div data-reveal>
              <Eyebrow>{mr ? 'व्यवसायाविषयी' : 'About this trade'}</Eyebrow>
              <p className="mt-4 text-lg leading-relaxed text-stone-700">{tx(tr.overview, lang)}</p>
            </div>

            <div data-reveal>
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-brand-950 sm:text-3xl">
                <BookOpen className="size-6 text-brand-600" aria-hidden />
                {mr ? 'आपण काय शिकाल' : 'What you will learn'}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {tr.learn.map((l) => (
                  <li key={l.en} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                    <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden />
                    <span className="text-[0.95rem] text-stone-800">{tx(l, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-brand-950 sm:text-3xl">
                <Briefcase className="size-6 text-brand-600" aria-hidden />
                {mr ? 'करिअरच्या संधी' : 'Career paths'}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {tr.careers.map((c, i) => (
                  <li key={c.en} className={cx('flex items-center gap-3 rounded-2xl p-4', i === 0 ? 'bg-brand-900 text-white' : 'bg-white ring-1 ring-line')}>
                    <span className={cx('grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold', i === 0 ? 'bg-marigold-400 text-brand-950' : a.icon)}>{i + 1}</span>
                    <span className={cx('text-[0.95rem] font-medium', i === 0 ? 'text-white' : 'text-stone-800')}>{tx(c, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {(tr.lab || tr.ojt) && (
              <div data-reveal className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-brand-950">{mr ? 'प्रयोगशाळा व प्रत्यक्ष प्रशिक्षण' : 'Labs & hands-on training'}</h2>
                {tr.lab && (
                  <p className="mt-3 flex gap-3 text-stone-700">
                    <Icon name="Building" className="mt-1 size-5 shrink-0 text-brand-600" />
                    {tx(tr.lab, lang)}
                  </p>
                )}
                {tr.ojt && (
                  <p className="mt-3 flex gap-3 text-stone-700">
                    <Icon name="HardHat" className="mt-1 size-5 shrink-0 text-brand-600" />
                    {tx(tr.ojt, lang)}
                  </p>
                )}
                {tr.images.length > 1 && (
                  <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {tr.images.slice(1, 4).map((img) => (
                      <li key={img} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <Img name={img} alt="" fill sizes="(min-width: 640px) 20vw, 45vw" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line">
              <div className={cx('flex items-center gap-3 p-5', a.soft)}>
                <span className={cx('grid size-11 place-items-center rounded-2xl', a.icon)}>
                  <Icon name={tr.icon} className="size-5" />
                </span>
                <p className="font-semibold text-brand-950">{mr ? 'एका दृष्टिक्षेपात' : 'At a glance'}</p>
              </div>
              <dl className="divide-y divide-line px-5">
                {facts.map((f) => (
                  <div key={f.label} className="flex items-start gap-3 py-3.5">
                    <f.icon className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                    <dt className="w-28 shrink-0 text-sm text-stone-500">{f.label}</dt>
                    <dd className="text-sm font-semibold text-brand-950">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="p-5 pt-2">
                <ButtonLink to="#enquiry" external variant="accent" className="w-full">{ui.applyNow}</ButtonLink>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="bg-white" id="enquiry">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <Eyebrow>{ui.applyNow}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{mr ? 'या व्यवसायाबद्दल प्रश्न आहेत?' : 'Questions about this trade?'}</h2>
            <p className="mt-4 text-stone-600">{mr ? 'आपला क्रमांक द्या — आमचे कार्यालय प्रवेश प्रक्रिया, जागा व शिष्यवृत्तीबाबत मार्गदर्शन करेल.' : 'Leave your number and our office will guide you on the admission process, seats and scholarships.'}</p>
          </div>
          <div className="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-8">
            <EnquiryForm lang={lang} type="admission" defaultTrade={tr.slug} />
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section>
          <h2 className="mb-6 font-display text-2xl font-semibold text-brand-950 sm:text-3xl">{mr ? 'इतर व्यवसाय' : 'Related trades'}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <TradeCard trade={r} lang={lang} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
