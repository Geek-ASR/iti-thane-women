'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Contrast, Languages } from 'lucide-react';
import { asset } from '@/lib/config';
import { href as langHref, t, type Locale } from '@/lib/i18n';
import { cx } from '@/components/ui';

const SIZES = ['sm', 'md', 'lg', 'xl'] as const;
type Fs = (typeof SIZES)[number];

const save = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* ignore */
  }
};

/** GIGW text-size and contrast controls. Preferences persist and are applied before paint (see root layout). */
export function A11yControls({ lang, variant = 'bar' }: { lang: Locale; variant?: 'bar' | 'menu' }) {
  const ui = t(lang);
  const [fs, setFs] = useState<Fs>('md');
  const [hc, setHc] = useState(false);

  useEffect(() => {
    const d = document.documentElement;
    setFs((d.dataset.fs as Fs) || 'md');
    setHc(d.dataset.contrast === 'high');
  }, []);

  const applyFs = (v: Fs) => {
    const d = document.documentElement;
    if (v === 'md') delete d.dataset.fs;
    else d.dataset.fs = v;
    save('iti.fs', v === 'md' ? null : v);
    setFs(v);
  };
  const idx = SIZES.indexOf(fs);
  const toggleHc = () => {
    const d = document.documentElement;
    const next = !hc;
    if (next) d.dataset.contrast = 'high';
    else delete d.dataset.contrast;
    save('iti.contrast', next ? 'high' : null);
    setHc(next);
  };

  const btn =
    variant === 'bar'
      ? 'grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-xs font-bold text-white/80 hover:bg-white/10 hover:text-white aria-pressed:bg-white/15 aria-pressed:text-white'
      : 'grid h-11 min-w-11 place-items-center rounded-xl border border-line bg-white px-3 text-sm font-bold text-brand-900 aria-pressed:border-brand-600 aria-pressed:bg-brand-50';

  return (
    <div role="group" aria-label={ui.accessibility} className={cx('flex items-center', variant === 'bar' ? 'gap-0.5' : 'gap-2')}>
      <button type="button" className={btn} onClick={() => applyFs(SIZES[Math.max(0, idx - 1)])} aria-label={lang === 'mr' ? 'अक्षर आकार कमी करा' : 'Decrease text size'} disabled={idx === 0}>
        A<span aria-hidden>−</span>
      </button>
      <button type="button" className={btn} onClick={() => applyFs('md')} aria-pressed={fs === 'md'} aria-label={lang === 'mr' ? 'मूळ अक्षर आकार' : 'Default text size'}>
        A
      </button>
      <button type="button" className={btn} onClick={() => applyFs(SIZES[Math.min(SIZES.length - 1, idx + 1)])} aria-label={lang === 'mr' ? 'अक्षर आकार वाढवा' : 'Increase text size'} disabled={idx === SIZES.length - 1}>
        A<span aria-hidden>+</span>
      </button>
      <button type="button" className={cx(btn, 'gap-1.5', variant === 'menu' && 'flex px-4')} onClick={toggleHc} aria-pressed={hc} aria-label={ui.contrast}>
        <Contrast className="size-4" aria-hidden />
        {variant === 'menu' && <span className="text-sm font-semibold">{ui.contrast}</span>}
      </button>
    </div>
  );
}

/** Switches between /en/... and /mr/... for the current page and remembers the choice. */
export function LangSwitch({ lang, variant = 'bar' }: { lang: Locale; variant?: 'bar' | 'menu' | 'pill' }) {
  const pathname = usePathname() || `/${lang}/`;
  const other: Locale = lang === 'en' ? 'mr' : 'en';
  const target = /^\/(en|mr)(\/|$)/.test(pathname) ? pathname.replace(/^\/(en|mr)/, `/${other}`) : langHref(other, '/');
  const label = other === 'mr' ? 'मराठी' : 'English';
  const cls =
    variant === 'bar'
      ? 'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-white hover:bg-white/10'
      : variant === 'pill'
        ? 'inline-flex h-10 items-center gap-1.5 rounded-full bg-brand-50 px-3 text-sm font-semibold text-brand-800 hover:bg-brand-100'
        : 'inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-brand-900';
  return (
    <Link href={target} hrefLang={other} lang={other} className={cls} onClick={() => save('iti.lang', other)} aria-label={lang === 'mr' ? 'Switch to English' : 'मराठीत पहा'}>
      <Languages className="size-4" aria-hidden />
      {label}
    </Link>
  );
}

export function Logo({ lang, tone = 'dark' }: { lang: Locale; tone?: 'dark' | 'light' }) {
  const ui = t(lang);
  return (
    <Link href={langHref(lang, '/')} className="group flex min-w-0 items-center gap-2.5 sm:gap-3 xl:shrink-0" aria-label={`${ui.fullName} — ${ui.home}`}>
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-soft ring-1 ring-line sm:size-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/brand/dvet-logo.png')} alt="" width={48} height={48} className="size-[88%] object-contain" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={cx('block truncate font-display text-[1.02rem] font-semibold sm:text-[1.15rem]', tone === 'dark' ? 'text-brand-950' : 'text-white')}>{ui.headerName}</span>
        <span className={cx('block truncate text-[0.7rem] font-semibold tracking-wide sm:text-xs', tone === 'dark' ? 'text-stone-500' : 'text-white/65')}>
          {lang === 'mr' ? 'शासकीय · राजमाता जिजाऊ · स्थापना १९९२' : 'Rajmata Jijau · Est. 1992 · DVET'}
        </span>
      </span>
    </Link>
  );
}

/**
 * Scroll reveal: after hydration, anything already on screen is shown immediately and only
 * content below the fold animates in. Without JS everything is simply visible.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
        else io.observe(el);
      });
    };
    scan();
    document.documentElement.classList.add('reveal-ready');
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
