import { notFound } from 'next/navigation';
import { isLocale, locales, t } from '@/lib/i18n';
import { TopBar, SiteHeader } from '@/components/site/SiteHeader';
import { NoticeTicker } from '@/components/site/NoticeTicker';
import { SiteFooter } from '@/components/site/SiteFooter';
import { MobileDock } from '@/components/site/MobileDock';
import { RevealObserver } from '@/components/site/controls';

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ui = t(lang);
  return (
    <div lang={lang} className={lang === 'mr' ? 'lang-mr' : 'lang-en'}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-full focus:bg-marigold-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-950 md:hidden">
        {ui.skip}
      </a>
      <TopBar lang={lang} />
      <SiteHeader lang={lang} />
      <NoticeTicker lang={lang} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter lang={lang} />
      <MobileDock lang={lang} />
      <RevealObserver />
    </div>
  );
}
