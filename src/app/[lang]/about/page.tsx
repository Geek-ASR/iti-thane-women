import type { Metadata } from 'next';
import { Eye, Target } from 'lucide-react';
import { t, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { achievements, campusFacts, history, imc, institute, mission, principalMessage, results, schemes, timeline, vision } from '@/content/institute';
import { Img } from '@/components/Img';
import { Icon } from '@/components/Icon';
import { ButtonLink, Eyebrow, PageHero, Section, SectionHeading } from '@/components/ui';
import { ResultsChart } from '@/components/public/ResultsChart';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/about/', lang === 'mr' ? 'संस्था परिचय' : 'About the institute', lang === 'mr' ? 'इतिहास, ध्येय, प्राचार्यांचे मनोगत, संस्था व्यवस्थापन समिती व निकाल.' : 'History, vision and mission, Principal’s message, Institute Management Committee and results of Govt. ITI (Women), Thane.');
}

export default async function About({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  return (
    <>
      <PageHero
        lang={lang}
        title={mr ? 'संस्था परिचय' : 'About the institute'}
        lead={tx(institute.name, lang)}
        crumbs={[{ label: mr ? 'संस्थेविषयी' : 'About' }]}
        image={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
            <Img name="campus-walkway" alt="" fill priority sizes="40vw" />
          </div>
        }
      >
        <dl className="grid max-w-xl grid-cols-3 gap-3">
          {[
            { v: '1992', l: mr ? 'स्थापना' : 'Established' },
            { v: institute.ncvtCode, l: mr ? 'NCVT MIS कोड' : 'NCVT MIS code' },
            { v: mr ? 'मुंबई' : 'Mumbai', l: mr ? 'विभाग' : 'DVET region' },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
              <dt className="text-[0.7rem] text-white/65">{s.l}</dt>
              <dd className="text-sm font-bold sm:text-base">{s.v}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div data-reveal>
            <Eyebrow>{mr ? 'आमची वाटचाल' : 'Our story'}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl leading-tight font-semibold text-brand-950 sm:text-4xl">{mr ? '१९९२ पासून युवतींसाठी तांत्रिक शिक्षण' : 'Technical education for young women since 1992'}</h2>
            <p className="mt-5 leading-relaxed text-stone-700">{tx(history, lang)}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-brand-900 p-6 text-white">
                <Eye className="size-7 text-marigold-300" aria-hidden />
                <h3 className="mt-3 font-display text-xl font-semibold">{mr ? 'दृष्टी' : 'Vision'}</h3>
                <p className="mt-2 text-sm text-white/80">{tx(vision, lang)}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
                <Target className="size-7 text-brand-600" aria-hidden />
                <h3 className="mt-3 font-display text-xl font-semibold text-brand-950">{mr ? 'ध्येय' : 'Mission'}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                  {mission.map((m) => (
                    <li key={m.en} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-marigold-500" />
                      {tx(m, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div data-reveal>
            <h3 className="font-display text-xl font-semibold text-brand-950">{mr ? 'वाटचालीतील टप्पे' : 'Milestones'}</h3>
            <ol className="mt-5 space-y-5 border-l-2 border-brand-100 pl-6">
              {timeline.map((m) => (
                <li key={tx(m.title, lang)} className="relative">
                  <span aria-hidden className="absolute top-1 -left-[1.95rem] size-3.5 rounded-full bg-marigold-400 ring-4 ring-paper" />
                  <p className="text-sm font-bold text-brand-600">{typeof m.year === 'string' ? m.year : tx(m.year, lang)}</p>
                  <p className="mt-0.5 text-[0.95rem] text-stone-700">{tx(m.title, lang)}</p>
                </li>
              ))}
            </ol>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {campusFacts.map((f) => (
                <li key={f.value} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                  <p className="text-lg font-bold text-brand-900">{f.value}</p>
                  <p className="text-xs text-stone-600">{tx(f.label, lang)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="bg-white" id="principal">
        <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-brand-900 p-7 text-white">
              <span className="grid size-20 place-items-center rounded-full bg-marigold-400 font-display text-3xl font-semibold text-brand-950">SM</span>
              <p className="mt-5 font-display text-2xl font-semibold">{institute.principal.name}</p>
              <p className="text-white/70">{tx(institute.principal.title, lang)}</p>
              <p className="mt-4 text-sm text-white/60">{ui.shortName}</p>
            </div>
          </div>
          <div data-reveal>
            <Eyebrow>{mr ? 'प्राचार्यांचे मनोगत' : 'Principal’s message'}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{mr ? 'प्रत्येक युवतीला स्वावलंबी करणारे प्रशिक्षण' : 'Training that makes every young woman self-reliant'}</h2>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-stone-700">
              {principalMessage.paragraphs.map((p) => (
                <p key={p.en}>{tx(p, lang)}</p>
              ))}
            </div>
            <p className="mt-6 font-display text-lg font-semibold text-brand-900">— {institute.principal.name}</p>
          </div>
        </div>
      </Section>

      <Section id="results">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div data-reveal>
            <SectionHeading eyebrow={mr ? 'निकाल' : 'Results'} title={mr ? 'प्रवेश व निकाल, २०१६–२०२३' : 'Admissions & results, 2016–2023'} lead={mr ? 'संस्थेच्या नोंदीनुसार प्रवेश सत्रनिहाय आकडेवारी.' : 'Session-wise figures from institute records.'} />
            <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-line">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">{mr ? 'प्रवेश व निकाल' : 'Admissions and results by session'}</caption>
                <thead className="bg-stone-50 text-xs text-stone-500">
                  <tr>
                    {(mr ? ['सत्र', 'जागा', 'प्रवेशित', 'परीक्षार्थी', 'उत्तीर्ण', 'निकाल'] : ['Session', 'Seats', 'Admitted', 'Appeared', 'Passed', 'Pass %']).map((h) => (
                      <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line tabular-nums">
                  {results.map((r) => (
                    <tr key={r.session}>
                      <th scope="row" className="px-4 py-3 font-semibold text-brand-950">{r.session}</th>
                      <td className="px-4 py-3">{r.seats}</td>
                      <td className="px-4 py-3">{r.admitted}</td>
                      <td className="px-4 py-3">{r.appeared}</td>
                      <td className="px-4 py-3">{r.passed}</td>
                      <td className="px-4 py-3 font-bold text-brand-800">{r.passPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div data-reveal className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-7 lg:mt-24">
            <p className="mb-5 font-semibold text-brand-950">{mr ? 'निकालाची टक्केवारी' : 'Pass rate by admission session'}</p>
            <ResultsChart lang={lang} />
          </div>
        </div>
      </Section>

      <Section className="bg-white" id="imc">
        <SectionHeading eyebrow={mr ? 'संस्था व्यवस्थापन समिती' : 'Institute Management Committee'} title={mr ? 'उद्योगांच्या नेतृत्वाखालील व्यवस्थापन' : 'Industry-led governance'} lead={mr ? 'नोंदणीकृत संस्था व्यवस्थापन समितीत उद्योग, शासन व प्रशिक्षणार्थींचे प्रतिनिधी आहेत.' : 'A registered IMC brings together industry, government and trainee representatives to guide training and partnerships.'} />
        <div className="grid gap-4 lg:grid-cols-3">
          {[imc.chair, imc.secretary].map((m) => (
            <div key={m.name} data-reveal className="rounded-3xl bg-brand-900 p-6 text-white">
              <p className="text-xs font-bold tracking-wider text-marigold-300 uppercase">{tx(m.role, lang)}</p>
              <p className="mt-2 font-display text-xl font-semibold">{m.name}</p>
              <p className="mt-1 text-sm text-white/70">{m.org}</p>
            </div>
          ))}
          <div data-reveal className="rounded-3xl bg-paper p-6 ring-1 ring-line">
            <p className="text-xs font-bold tracking-wider text-brand-600 uppercase">{mr ? 'उद्योग सदस्य' : 'Industry members'}</p>
            <ul className="mt-3 space-y-2.5">
              {imc.industry.map((m) => (
                <li key={m.name}>
                  <p className="font-semibold text-brand-950">{m.name}</p>
                  <p className="text-xs text-stone-600">{tx(m.sector, lang)}{m.org ? ` · ${m.org}` : ''}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {imc.members.map((m) => (
            <li key={typeof m.name === 'string' ? m.name : m.name.en} className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="font-semibold text-brand-950">{typeof m.name === 'string' ? m.name : tx(m.name, lang)}</p>
              <p className="text-xs text-stone-600">{m.org || (mr ? 'सदस्य' : 'Member')}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="achievements">
        <SectionHeading eyebrow={mr ? 'यश व उपक्रम' : 'Achievements & schemes'} title={mr ? 'राष्ट्रीय उपक्रमांत सहभाग' : 'Part of national reform programmes'} />
        <div className="grid gap-4 md:grid-cols-3">
          {schemes.map((s) => (
            <div key={s.name} data-reveal className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <p className="font-display text-3xl font-semibold text-brand-700">{s.name}</p>
              <p className="mt-2 font-semibold text-brand-950">{tx(s.title, lang)}</p>
              <p className="mt-1 text-sm text-stone-600">{tx(s.desc, lang)}</p>
            </div>
          ))}
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <li key={a.title.en} data-reveal className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-line">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-marigold-100 text-marigold-800">
                <Icon name={a.icon} className="size-5" />
              </span>
              <span>
                <span className="block font-semibold text-brand-950">{tx(a.title, lang)}</span>
                <span className="mt-1 block text-sm text-stone-600">{tx(a.desc, lang)}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/staff/" lang={lang} arrow>{mr ? 'अधिकारी व कर्मचारी' : 'Meet our faculty & staff'}</ButtonLink>
          <ButtonLink to="/campus/" lang={lang} variant="outline">{ui.ourLabs}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
