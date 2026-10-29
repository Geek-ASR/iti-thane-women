import type { Metadata } from 'next';
import { tx, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { accessibilityStatement } from '@/content/policies';
import { PageHero, Section } from '@/components/ui';
import { A11yControls, LangSwitch } from '@/components/site/controls';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta(lang, '/accessibility/', lang === 'mr' ? 'सुलभता विधान' : 'Accessibility statement', lang === 'mr' ? 'GIGW व WCAG नुसार सुलभता वैशिष्ट्ये, स्क्रीन रीडर व अभिप्राय.' : 'Accessibility features of this website following GIGW and WCAG 2.1 AA, screen-reader support and how to give feedback.');
}

export default async function AccessibilityPage({ params }: Props) {
  const { lang } = await params;
  const mr = lang === 'mr';
  return (
    <>
      <PageHero lang={lang} title={mr ? 'सुलभता विधान' : 'Accessibility statement'} crumbs={[{ label: mr ? 'सुलभता' : 'Accessibility' }]} />
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 rounded-3xl bg-white p-6 ring-1 ring-line">
            <p className="mb-4 font-semibold text-brand-950">{mr ? 'येथेच वापरून पहा' : 'Try it here'}</p>
            <div className="flex flex-wrap gap-3">
              <A11yControls lang={lang} variant="menu" />
              <LangSwitch lang={lang} variant="menu" />
            </div>
          </div>
          <div className="prose-iti">
            {accessibilityStatement.map((s, i) => (
              <div key={i}>
                {s.h && <h2>{tx(s.h, lang)}</h2>}
                {s.p.length > 1 ? (
                  <ul>
                    {s.p.map((p) => (
                      <li key={p.en}>{tx(p, lang)}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{tx(s.p[0], lang)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
