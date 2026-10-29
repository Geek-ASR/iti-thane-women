import type { Metadata } from 'next';
import Link from 'next/link';
import { href, tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { footerColumns, mainNav, policyLinks } from '@/lib/nav';
import { PageHero, Section } from '@/components/ui';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/sitemap/', lang === 'mr' ? 'संकेतस्थळ नकाशा' : 'Sitemap', lang === 'mr' ? 'संकेतस्थळावरील सर्व पानांची यादी.' : 'A list of every page on this website.');
}

export default async function SitemapPage({ params }: Props) {
  const { lang } = await params;
  const link = (p: string) => (p.startsWith('/portal') ? p : href(lang, p));
  const groups = [
    ...mainNav.map((g) => ({ title: g.label, links: [...(g.path ? [{ label: g.label, path: g.path }] : []), ...(g.links ?? []), ...(g.columns?.flatMap((c) => c.links) ?? [])] })),
    ...footerColumns,
    { title: { en: 'Policies', mr: 'धोरणे' }, links: policyLinks },
  ];
  return (
    <>
      <PageHero lang={lang} title={lang === 'mr' ? 'संकेतस्थळ नकाशा' : 'Sitemap'} crumbs={[{ label: lang === 'mr' ? 'संकेतस्थळ नकाशा' : 'Sitemap' }]} />
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-semibold text-brand-950">{tx(g.title, lang)}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {g.links.map((l) => (
                  <li key={l.path}>
                    <Link href={link(l.path)} className="text-stone-700 hover:text-brand-700 hover:underline">
                      {tx(l.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
