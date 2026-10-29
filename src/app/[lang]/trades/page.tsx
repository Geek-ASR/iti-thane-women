import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { href, t, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { shortCourses, totalSeats, totalUnits, trades } from '@/content/trades';
import { Icon } from '@/components/Icon';
import { accentClasses, Badge, ButtonLink, cx, PageHero, Section, SectionHeading, StatPill } from '@/components/ui';
import { TradeExplorer } from '@/components/public/TradeCards';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/trades/', lang === 'mr' ? 'व्यवसाय (ट्रेड)' : 'Trades & courses', lang === 'mr' ? '११ NCVT व्यवसायांची कालावधी, पात्रता व जागांसह माहिती.' : 'All 11 NCVT trades at Govt. ITI (Women), Thane with duration, eligibility, units and seats — plus short-term courses.');
}

export default async function Trades({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'व्यवसाय (ट्रेड)' : 'Trades & courses'} lead={mr ? 'अभियांत्रिकी व बिगर-अभियांत्रिकी — १ किंवा २ वर्षांचे NCVT व्यवसाय, उद्योगसहाय्यित प्रयोगशाळांसह.' : 'Engineering and non-engineering trades of one or two years, each backed by industry-supported labs and leading to the NCVT National Trade Certificate.'} crumbs={[{ label: ui.trades }]}>
        <div className="grid max-w-lg grid-cols-3 gap-3">
          <StatPill value={trades.length} label={mr ? 'व्यवसाय' : 'Trades'} />
          <StatPill value={totalUnits} label={ui.units} />
          <StatPill value={totalSeats} label={mr ? 'जागा' : 'Seats'} />
        </div>
      </PageHero>

      <Section>
        <TradeExplorer lang={lang} layout="grid" />
      </Section>

      <Section className="bg-white" id="compare">
        <SectionHeading eyebrow={mr ? 'तुलना' : 'Compare'} title={mr ? 'सर्व व्यवसाय एका नजरेत' : 'All trades at a glance'} />
        {/* Mobile: stacked cards. Desktop: table. */}
        <ul className="space-y-3 md:hidden">
          {trades.map((tr) => (
            <li key={tr.slug}>
              <Link href={href(lang, `/trades/${tr.slug}/`)} className="flex items-center gap-4 rounded-2xl bg-paper p-4 ring-1 ring-line">
                <span className={cx('grid size-11 shrink-0 place-items-center rounded-2xl', accentClasses[tr.accent].icon)}>
                  <Icon name={tr.icon} className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-brand-950">{tx(tr.short ?? tr.name, lang)}</span>
                  <span className="mt-0.5 block text-xs text-stone-600">
                    {tr.durationYears} {tr.durationYears === 1 ? ui.year : ui.years} · {tx(tr.eligibility, lang)} · {tr.seats ? `${tr.seats} ${mr ? 'जागा' : 'seats'}` : mr ? 'नवीन' : 'New'}
                  </span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-brand-600" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-hidden rounded-3xl ring-1 ring-line md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{mr ? 'व्यवसायांची तुलना' : 'Comparison of trades'}</caption>
            <thead className="bg-brand-950 text-xs text-white/80">
              <tr>
                {[ui.trades, ui.type, ui.duration, ui.eligibility, ui.units, ui.seats].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {trades.map((tr) => (
                <tr key={tr.slug} className="hover:bg-brand-50/50">
                  <th scope="row" className="px-5 py-4">
                    <Link href={href(lang, `/trades/${tr.slug}/`)} className="flex items-center gap-3 font-semibold text-brand-950 hover:text-brand-700">
                      <span className={cx('grid size-9 shrink-0 place-items-center rounded-xl', accentClasses[tr.accent].icon)}>
                        <Icon name={tr.icon} className="size-4" />
                      </span>
                      {tx(tr.name, lang)}
                      {tr.isNew && <Badge tone="marigold">{ui.new}</Badge>}
                    </Link>
                  </th>
                  <td className="px-5 py-4 text-stone-600">{tr.type === 'engineering' ? ui.engineering : ui.nonEngineering}</td>
                  <td className="px-5 py-4 text-stone-700">{tr.durationYears} {tr.durationYears === 1 ? ui.year : ui.years}</td>
                  <td className="px-5 py-4 text-stone-700">{tx(tr.eligibility, lang)}</td>
                  <td className="px-5 py-4 text-stone-700 tabular-nums">{tr.units}</td>
                  <td className="px-5 py-4 font-semibold text-brand-900 tabular-nums">{tr.seats ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-stone-500">{mr ? 'प्रवेश क्षमता संस्थेच्या नोंदींनुसार; प्रत्येक फेरीसाठी उपलब्ध जागा संचालनालय प्रसिद्ध करते.' : 'Intake capacity as per institute records; the seats available in each admission round are published by DVET.'}</p>
      </Section>

      <Section id="short-courses">
        <SectionHeading eyebrow={mr ? 'अल्पमुदतीचे अभ्यासक्रम' : 'Short-term courses'} title={mr ? 'झटपट स्वयंरोजगार कौशल्ये' : 'Quick skills for self-employment'} lead={mr ? 'गृहिणी व नोकरी करणाऱ्या महिलांसाठी अल्पमुदतीचे प्रमाणपत्र अभ्यासक्रम.' : 'Certificate courses for homemakers and working women who want a fast route to earning.'} />
        <ul className="grid gap-4 md:grid-cols-3">
          {shortCourses.map((c) => (
            <li key={c.name.en} data-reveal className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <span className="grid size-12 place-items-center rounded-2xl bg-marigold-100 text-marigold-800">
                <Icon name={c.icon} className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-brand-950">{tx(c.name, lang)}</h3>
              <p className="mt-1.5 text-sm text-stone-600">{tx(c.desc, lang)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink to="/contact/" lang={lang} variant="outline" arrow>{mr ? 'पुढील तुकडीबाबत चौकशी' : 'Ask about the next batch'}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
