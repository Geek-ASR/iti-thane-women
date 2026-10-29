import type { Metadata } from 'next';
import { tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { activities } from '@/content/life';
import { Img } from '@/components/Img';
import { Icon } from '@/components/Icon';
import { ButtonLink, cx, PageHero, Section } from '@/components/ui';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/student-life/', lang === 'mr' ? 'विद्यार्थी जीवन' : 'Student life', lang === 'mr' ? 'औद्योगिक भेटी, OJT, तंत्र प्रदर्शन, स्नेहसंमेलन, क्रीडा, महिला दिन व उद्यम उद्योजकता.' : 'Industrial visits, on-the-job training, technical exhibitions, annual function, sports, Women’s Day and the Udyam entrepreneurship programme.');
}

export default async function StudentLife({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero
        lang={lang}
        title={mr ? 'विद्यार्थी जीवन' : 'Student life'}
        lead={mr ? 'कौशल्यासोबत आत्मविश्वास, नेतृत्व व मैत्री — वर्गाबाहेरही शिकण्याचे भरपूर प्रसंग.' : 'Confidence, leadership and friendships alongside skills — there is plenty to learn beyond the workshop.'}
        crumbs={[{ label: mr ? 'परिसर' : 'Campus', path: '/campus/' }, { label: mr ? 'विद्यार्थी जीवन' : 'Student life' }]}
        image={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15">
            <Img name="annual-2" alt="" fill priority sizes="40vw" />
          </div>
        }
      >
        <nav aria-label={mr ? 'उपक्रम' : 'Activities'} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          {activities.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20">
              <Icon name={a.icon} className="size-4" />
              {tx(a.title, lang)}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section>
        <div className="space-y-16 sm:space-y-20">
          {activities.map((a, i) => (
            <article key={a.id} id={a.id} className={cx('grid scroll-mt-32 items-center gap-8 lg:grid-cols-2 lg:gap-14', i % 2 === 1 && 'lg:[&>div:first-child]:order-2')}>
              <div data-reveal className={cx('grid gap-3', a.images.length >= 3 ? 'grid-cols-2' : 'grid-cols-1')}>
                {a.images.slice(0, 3).map((img, j) => (
                  <div key={img} className={cx('relative overflow-hidden rounded-3xl', a.images.length >= 3 ? (j === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-[4/3]') : 'aspect-[16/10]')}>
                    <Img name={img} alt={j === 0 ? tx(a.title, lang) : ''} fill sizes="(min-width: 1024px) 45vw, 92vw" />
                  </div>
                ))}
              </div>
              <div data-reveal>
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-900 text-marigold-300">
                  <Icon name={a.icon} className="size-6" />
                </span>
                <h2 className="display-tight mt-4 font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{tx(a.title, lang)}</h2>
                <p className="mt-4 text-lg leading-relaxed text-stone-700">{tx(a.desc, lang)}</p>
                {a.images.length > 3 && (
                  <ButtonLink to={`/gallery/#${a.id === 'green' ? 'campus' : a.id}`} lang={lang} variant="outline" size="sm" arrow className="mt-6">
                    {mr ? 'आणखी छायाचित्रे' : 'More photos'}
                  </ButtonLink>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
