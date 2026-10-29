import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, tx, type Locale } from '@/lib/i18n';
import { BUILD_DATE } from '@/lib/config';
import { pageMeta } from '@/lib/seo';
import { policies } from '@/content/policies';
import { PageHero, Section } from '@/components/ui';

type Props = { params: Promise<{ lang: Locale; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta(lang, `/policies/${slug}/`, tx(p.title, lang), tx(p.sections[0].p[0], lang).slice(0, 200));
}

export default async function PolicyPage({ params }: Props) {
  const { lang, slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PageHero lang={lang} title={tx(p.title, lang)} crumbs={[{ label: lang === 'mr' ? 'धोरणे' : 'Policies' }, { label: tx(p.title, lang) }]} />
      <Section>
        <article className="prose-iti mx-auto max-w-3xl">
          {p.sections.map((s, i) => (
            <section key={i}>
              {s.h && <h2>{tx(s.h, lang)}</h2>}
              {s.p.map((para) => (
                <p key={para.en}>{tx(para, lang)}</p>
              ))}
            </section>
          ))}
          <p className="mt-10 text-sm text-stone-500">
            {lang === 'mr' ? 'अखेरचे पुनरावलोकन' : 'Last reviewed'}: {formatDate(BUILD_DATE, lang)}
          </p>
        </article>
      </Section>
    </>
  );
}
