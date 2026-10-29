import type { Metadata } from 'next';
import { tx, type Locale } from '@/lib/i18n';
import { formatDate } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { csrActivities, csrLabs, facultyDevelopment, mous } from '@/content/industry';
import { imc } from '@/content/institute';
import { Img } from '@/components/Img';
import { Eyebrow, PageHero, Section, SectionHeading } from '@/components/ui';
import { EnquiryForm } from '@/components/public/EnquiryForm';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/industry/', lang === 'mr' ? 'उद्योग व CSR' : 'Industry & CSR', lang === 'mr' ? 'CSR प्रयोगशाळा, सामंजस्य करार, निदेशक प्रशिक्षण व भागीदारीसाठी संपर्क.' : 'CSR-built labs, MoUs with Skoda Auto Volkswagen, SRF Foundation and Mahindra & Mahindra, faculty development and how to partner with us.');
}

export default async function Industry({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero
        lang={lang}
        title={mr ? 'उद्योग व CSR भागीदारी' : 'Industry & CSR partnerships'}
        lead={mr ? 'नामांकित कंपन्यांनी आमच्या प्रयोगशाळा, वसतिगृह व परिसर घडवण्यास मदत केली आहे.' : 'Leading companies have helped rebuild our labs, hostel and campus — and they hire our trainees.'}
        crumbs={[{ label: mr ? 'प्लेसमेंट' : 'Placements', path: '/placements/' }, { label: mr ? 'उद्योग व CSR' : 'Industry & CSR' }]}
        image={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
            <Img name="lab-inauguration-1" alt="" fill priority sizes="40vw" />
          </div>
        }
      />

      <Section>
        <SectionHeading eyebrow="CSR" title={mr ? 'CSR अंतर्गत विकसित प्रयोगशाळा व कामे' : 'Labs & works developed under CSR'} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {csrLabs.map((c, i) => (
            <li key={i} data-reveal className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-marigold-100 text-sm font-bold text-marigold-800">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block font-semibold text-brand-950">{tx(c.trade, lang)}</span>
                <span className="block text-sm text-stone-600">{c.partner}</span>
              </span>
            </li>
          ))}
        </ul>
        <h3 className="mt-12 mb-4 font-display text-2xl font-semibold text-brand-950">{mr ? 'अलीकडील CSR उपक्रम' : 'Recent CSR activities'}</h3>
        <ul className="grid gap-4 md:grid-cols-3">
          {csrActivities.map((a) => (
            <li key={a.date} data-reveal className="rounded-3xl bg-brand-900 p-6 text-white">
              <p className="text-sm font-semibold text-marigold-300">{formatDate(`${a.date}-01`, lang, { month: 'long', year: 'numeric' })}</p>
              <p className="mt-2 font-display text-xl font-semibold">{tx(a.activity, lang)}</p>
              <p className="mt-1 text-sm text-white/70">{a.partner}</p>
              <p className="mt-5 text-3xl font-bold">
                {a.beneficiaries} <span className="text-base font-medium text-white/70">{mr ? 'लाभार्थी' : 'trainees benefited'}</span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading eyebrow="MoU" title={mr ? 'सामंजस्य करार' : 'Memoranda of understanding'} />
            <ul className="space-y-4">
              {mous.map((m) => (
                <li key={m.partner} data-reveal className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                  <p className="font-display text-xl font-semibold text-brand-950">{m.partner}</p>
                  <p className="mt-1.5 text-stone-700">{tx(m.scope, lang)}</p>
                  <p className="mt-3 text-xs font-semibold text-stone-500">
                    {formatDate(m.from, lang)} – {formatDate(m.to, lang)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow={mr ? 'निदेशक विकास' : 'Faculty development'} title={mr ? 'उद्योगांकडून निदेशकांचे प्रशिक्षण' : 'Instructors trained by industry'} />
            <ul className="space-y-3">
              {facultyDevelopment.map((f) => (
                <li key={f.by} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <span>
                    <span className="block font-semibold text-brand-950">{tx(f.programme, lang)}</span>
                    <span className="block text-sm text-stone-600">{f.by}</span>
                  </span>
                  <span className="text-right text-sm text-stone-600">
                    {formatDate(`${f.date}-01`, lang, { month: 'short', year: 'numeric' })}
                    <span className="block font-semibold text-brand-800">{f.days} {mr ? 'दिवस' : 'days'}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100">
              <Eyebrow>IMC</Eyebrow>
              <p className="mt-2 text-stone-700">
                {mr ? 'संस्था व्यवस्थापन समितीचे अध्यक्षपद ' : 'The Institute Management Committee is chaired by '}
                <span className="font-semibold text-brand-950">{imc.chair.name}</span> ({imc.chair.org})
                {mr ? ' यांच्याकडे आहे.' : ', with members from electronics, beauty & wellness and textile industries.'}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="partner">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <Eyebrow>{mr ? 'भागीदार व्हा' : 'Partner with us'}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{mr ? 'CSR, भरती किंवा प्रशिक्षणासाठी सहकार्य करा' : 'Collaborate on CSR, hiring or training'}</h2>
            <p className="mt-4 text-stone-600">{mr ? 'प्रयोगशाळा प्रायोजित करा, शिकाऊ उमेदवार घ्या, अतिथी व्याख्यान द्या किंवा कॅम्पस भरती करा.' : 'Sponsor a lab, take apprentices, deliver a guest lecture or run a campus drive — our team will get back within a few working days.'}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-8">
            <EnquiryForm lang={lang} type="industry" />
          </div>
        </div>
      </Section>
    </>
  );
}
