import type { Metadata } from 'next';
import { BookOpen, CircleCheck } from 'lucide-react';
import { t, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { facilities, greenCampus, guestHouse, hostel, library, safety } from '@/content/campus';
import { campusFacts } from '@/content/institute';
import { Img } from '@/components/Img';
import { Icon } from '@/components/Icon';
import { Badge, ButtonLink, cx, Eyebrow, PageHero, Section, SectionHeading } from '@/components/ui';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/campus/', lang === 'mr' ? 'प्रयोगशाळा व सुविधा' : 'Labs & infrastructure', lang === 'mr' ? 'CSR सहाय्यित प्रयोगशाळा, ग्रंथालय, दृकश्राव्य कक्ष, मुलींचे वसतिगृह व हरित परिसर.' : 'CSR-built labs and workshops, library, audio-visual room, girls’ hostel and green campus of Govt. ITI (Women), Thane.');
}

export default async function Campus({ params }: Props) {
  const { lang } = await params;
  const ui = t(lang);
  const mr = lang === 'mr';
  return (
    <>
      <PageHero
        lang={lang}
        title={mr ? 'प्रयोगशाळा व सुविधा' : 'Labs & infrastructure'}
        lead={mr ? 'उद्योगांच्या सहकार्याने आधुनिक केलेल्या प्रयोगशाळा, सुरक्षित वसतिगृह व हिरवागार परिसर.' : 'Workshops modernised with industry partners, a safe hostel and a leafy, clean campus in the heart of Thane East.'}
        crumbs={[{ label: mr ? 'परिसर' : 'Campus' }]}
        image={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
            <Img name="lab-electrician-hall" alt="" fill priority sizes="40vw" />
          </div>
        }
      >
        <ul className="grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
          {campusFacts.slice(0, 3).map((f) => (
            <li key={f.value} className="rounded-2xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
              <p className="font-bold">{f.value}</p>
              <p className="text-[0.7rem] text-white/65">{tx(f.label, lang)}</p>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section>
        <SectionHeading eyebrow={mr ? 'प्रयोगशाळा' : 'Labs & workshops'} title={mr ? 'प्रत्यक्ष कामातून शिकण्यासाठी' : 'Built for learning by doing'} lead={mr ? 'प्रत्येक व्यवसायासाठी DGT मानकांनुसार सुसज्ज प्रयोगशाळा.' : 'Every trade has a dedicated lab equipped to DGT norms — many rebuilt under CSR by our industry partners.'} />
        <ul className="grid gap-6 md:grid-cols-2">
          {facilities.map((f, i) => (
            <li key={f.id} id={f.id} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 2) * 80}ms` }} className="scroll-mt-32 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line">
              <div className={cx('grid gap-1', f.images.length > 1 ? 'grid-cols-[2fr_1fr]' : 'grid-cols-1')}>
                <div className={cx('relative overflow-hidden', f.images.length > 1 ? 'row-span-2 aspect-[4/3]' : 'aspect-[16/9]')}>
                  <Img name={f.images[0]} alt={tx(f.title, lang)} fill sizes="(min-width: 768px) 30vw, 62vw" />
                </div>
                {f.images.slice(1, 3).map((img) => (
                  <div key={img} className="relative overflow-hidden">
                    <Img name={img} alt="" fill sizes="(min-width: 768px) 15vw, 30vw" />
                  </div>
                ))}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={f.icon} className="size-5" />
                  </span>
                  <h3 className="font-display text-xl font-semibold text-brand-950">{tx(f.title, lang)}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{tx(f.desc, lang)}</p>
                {f.partner && (
                  <p className="mt-4">
                    <Badge tone="marigold">{mr ? 'CSR सहकार्य' : 'CSR support'}: {f.partner}</Badge>
                  </p>
                )}
              </div>
            </li>
          ))}
          <li data-reveal className="flex flex-col justify-between rounded-3xl bg-brand-900 p-6 text-white sm:p-8">
            <div>
              <BookOpen className="size-9 text-marigold-300" aria-hidden />
              <h3 className="mt-4 font-display text-2xl font-semibold">{tx(library.title, lang)}</h3>
              <p className="mt-2 text-white/75">{tx(library.desc, lang)}</p>
            </div>
            <p className="mt-6 text-5xl font-bold">1,200+</p>
          </li>
        </ul>
      </Section>

      <Section className="bg-white" id="hostel">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div data-reveal className="grid grid-cols-2 gap-3">
            {hostel.images.map((img, i) => (
              <div key={img} className={cx('relative overflow-hidden rounded-2xl', i === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-[4/3]', i === 3 && 'hidden sm:block')}>
                <Img name={img} alt={i === 0 ? tx(hostel.title, lang) : ''} fill sizes="(min-width: 1024px) 24vw, 46vw" />
              </div>
            ))}
          </div>
          <div data-reveal>
            <Eyebrow>{mr ? 'निवास' : 'Accommodation'}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{tx(hostel.title, lang)}</h2>
            <p className="mt-4 leading-relaxed text-stone-700">{tx(hostel.desc, lang)}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {hostel.points.map((p) => (
                <li key={p.en} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2.5 text-sm font-medium text-brand-950 ring-1 ring-line">
                  <CircleCheck className="size-4 shrink-0 text-emerald-600" aria-hidden />
                  {tx(p, lang)}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-paper p-5 ring-1 ring-line">
              <p className="font-semibold text-brand-950">{tx(guestHouse.title, lang)}</p>
              <p className="mt-1 text-sm text-stone-600">{tx(guestHouse.desc, lang)}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <Eyebrow>{mr ? 'हरित परिसर' : 'Green campus'}</Eyebrow>
            <h2 className="display-tight mt-3 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{tx(greenCampus.title, lang)}</h2>
            <p className="mt-4 leading-relaxed text-stone-700">{tx(greenCampus.desc, lang)}</p>
            <h3 className="mt-10 font-display text-2xl font-semibold text-brand-950">{mr ? 'सुरक्षितता' : 'Safety on campus'}</h3>
            <ul className="mt-4 space-y-3">
              {safety.map((s) => (
                <li key={s.title.en} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon name={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-brand-950">{tx(s.title, lang)}</span>
                    <span className="block text-sm text-stone-600">{tx(s.desc, lang)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ul data-reveal className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[13rem]">
            {greenCampus.images.map((img, i) => (
              <li key={img} className={cx('relative overflow-hidden rounded-3xl', i === 0 && 'row-span-2')}>
                <Img name={img} alt="" fill sizes="(min-width: 1024px) 26vw, 46vw" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink to="/gallery/" lang={lang} arrow>{mr ? 'छायाचित्र दालन' : 'View the photo gallery'}</ButtonLink>
          <ButtonLink to="/student-life/" lang={lang} variant="outline">{mr ? 'विद्यार्थी जीवन' : 'Student life'}</ButtonLink>
          <ButtonLink to="/contact/" lang={lang} variant="ghost">{ui.contact}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
