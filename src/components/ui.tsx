import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { href as langHref, t } from '@/lib/i18n';
import type { Accent } from '@/content/trades';

export const cx = (...c: (string | false | null | undefined | 0)[]) => c.filter(Boolean).join(' ');

/* ---------- Buttons ---------- */
type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'light' | 'glass';
type Size = 'sm' | 'md' | 'lg';
const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white shadow-soft hover:bg-brand-800 active:bg-brand-900',
  accent: 'bg-marigold-400 text-brand-950 shadow-soft hover:bg-marigold-300 active:bg-marigold-500',
  outline: 'border border-brand-200 bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
  light: 'bg-white text-brand-900 shadow-soft hover:bg-brand-50',
  glass: 'border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};
export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  cx('inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 hc-border', variants[variant], sizes[size], extra);

type ButtonLinkProps = { to: string; children: ReactNode; variant?: Variant; size?: Size; className?: string; external?: boolean; arrow?: boolean; lang?: Locale };

/** Internal paths are language-prefixed when `lang` is given; http(s), tel: and mailto: open natively. */
export function ButtonLink({ to, children, variant = 'primary', size = 'md', className, external, arrow, lang }: ButtonLinkProps) {
  const isExternal = external || /^(https?:|tel:|mailto:)/.test(to);
  const cls = buttonClass(variant, size, className);
  const content = (
    <>
      {children}
      {arrow && (isExternal && to.startsWith('http') ? <ArrowUpRight className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />)}
    </>
  );
  if (isExternal) {
    const newTab = to.startsWith('http');
    return (
      <a href={to} className={cls} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={lang ? langHref(lang, to) : to} className={cls}>
      {content}
    </Link>
  );
}

/* ---------- Section scaffolding ---------- */
export function Eyebrow({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'light' }) {
  return (
    <p className={cx('inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.14em]', tone === 'light' ? 'text-marigold-300' : 'text-brand-600')}>
      <span aria-hidden className="h-0.5 w-6 rounded-full bg-marigold-400" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'brand',
  action,
  id,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'brand' | 'light';
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className={cx('mb-8 flex flex-col gap-4 sm:mb-10', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={cx('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2 id={id} className={cx('display-tight mt-3 font-display text-[1.9rem] leading-[1.1] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]', tone === 'light' ? 'text-white' : 'text-brand-950')}>
          {title}
        </h2>
        {lead && <p className={cx('mt-4 text-base text-pretty sm:text-lg', tone === 'light' ? 'text-white/75' : 'text-stone-600')}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Section({ children, className, id, labelledBy }: { children: ReactNode; className?: string; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx('py-14 sm:py-20 lg:py-24', className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/* ---------- Badges ---------- */
export function Badge({ children, tone = 'brand', className }: { children: ReactNode; tone?: 'brand' | 'marigold' | 'stone' | 'green' | 'rose' | 'light'; className?: string }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100',
    marigold: 'bg-marigold-50 text-marigold-800 ring-marigold-200',
    stone: 'bg-stone-100 text-stone-700 ring-stone-200',
    green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    rose: 'bg-rose-50 text-rose-700 ring-rose-200',
    light: 'bg-white/10 text-white ring-white/20',
  };
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', tones[tone], className)}>{children}</span>;
}

/* ---------- Trade accents (literal classes so Tailwind can see them) ---------- */
export const accentClasses: Record<Accent, { soft: string; icon: string; ring: string; text: string }> = {
  amber: { soft: 'bg-amber-50', icon: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200', text: 'text-amber-700' },
  sky: { soft: 'bg-sky-50', icon: 'bg-sky-100 text-sky-700', ring: 'ring-sky-200', text: 'text-sky-700' },
  rose: { soft: 'bg-rose-50', icon: 'bg-rose-100 text-rose-700', ring: 'ring-rose-200', text: 'text-rose-700' },
  indigo: { soft: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-200', text: 'text-indigo-700' },
  teal: { soft: 'bg-teal-50', icon: 'bg-teal-100 text-teal-700', ring: 'ring-teal-200', text: 'text-teal-700' },
  violet: { soft: 'bg-violet-50', icon: 'bg-violet-100 text-violet-700', ring: 'ring-violet-200', text: 'text-violet-700' },
  pink: { soft: 'bg-pink-50', icon: 'bg-pink-100 text-pink-700', ring: 'ring-pink-200', text: 'text-pink-700' },
  fuchsia: { soft: 'bg-fuchsia-50', icon: 'bg-fuchsia-100 text-fuchsia-700', ring: 'ring-fuchsia-200', text: 'text-fuchsia-700' },
  orange: { soft: 'bg-orange-50', icon: 'bg-orange-100 text-orange-700', ring: 'ring-orange-200', text: 'text-orange-700' },
  emerald: { soft: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-200', text: 'text-emerald-700' },
  cyan: { soft: 'bg-cyan-50', icon: 'bg-cyan-100 text-cyan-700', ring: 'ring-cyan-200', text: 'text-cyan-700' },
};

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ lang, items }: { lang: Locale; items: { label: string; path?: string }[] }) {
  const ui = t(lang);
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-white/70">
        <li>
          <Link href={langHref(lang, '/')} className="hover:text-white">{ui.breadcrumbHome}</Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="size-3.5 opacity-60" aria-hidden />
            {it.path ? (
              <Link href={langHref(lang, it.path)} className="hover:text-white">{it.label}</Link>
            ) : (
              <span aria-current="page" className="font-medium text-white">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Decorative motif: stitches that become circuit traces ---------- */
export function ThreadCircuit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 420" fill="none" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M-20 330 C 140 330 210 250 330 250" strokeDasharray="10 9" />
        <path d="M330 250 H 520 L 580 190 H 760 L 800 150 H 1220" />
        <path d="M-20 380 C 180 380 260 320 420 320" strokeDasharray="10 9" opacity="0.7" />
        <path d="M420 320 H 640 L 690 270 H 900 L 940 230 H 1220" opacity="0.7" />
        <path d="M-20 90 C 120 90 170 140 300 140" strokeDasharray="10 9" opacity="0.5" />
        <path d="M300 140 H 450 L 490 100 H 700" opacity="0.5" />
        <path d="M760 190 V 110 H 860" opacity="0.6" />
        <path d="M900 270 V 340 H 1010" opacity="0.6" />
      </g>
      <g fill="currentColor">
        {[[330, 250], [580, 190], [800, 150], [420, 320], [690, 270], [940, 230], [300, 140], [490, 100], [860, 110], [1010, 340]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth="1.6">
        {[[700, 100], [1220, 150]].map(([x, y]) => (
          <circle key={`o${x}`} cx={x} cy={y} r="7" fill="none" />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Page hero for inner pages ---------- */
export function PageHero({
  lang,
  title,
  lead,
  crumbs,
  children,
  image,
}: {
  lang: Locale;
  title: string;
  lead?: string;
  crumbs: { label: string; path?: string }[];
  children?: ReactNode;
  image?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden bg-brand-950 text-white">
      <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="absolute -top-32 -right-24 -z-10 size-[28rem] rounded-full bg-brand-600/40 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -left-24 -z-10 size-[22rem] rounded-full bg-marigold-500/20 blur-3xl" />
      <ThreadCircuit className="absolute inset-x-0 bottom-0 -z-10 h-40 w-full text-white/10 sm:h-56" />
      <div className={cx('container-page relative py-10 sm:py-14 lg:py-16', !!image && 'grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]')}>
        <div>
          <Breadcrumbs lang={lang} items={crumbs} />
          <h1 className="display-tight mt-4 font-display text-[2.1rem] leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-[3.4rem]">{title}</h1>
          {lead && <p className="mt-4 max-w-2xl text-base text-white/75 text-pretty sm:text-lg">{lead}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
        {image && <div className="relative hidden lg:block">{image}</div>}
      </div>
    </header>
  );
}

/* ---------- Small stat ---------- */
export function StatPill({ value, label, tone = 'light' }: { value: ReactNode; label: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <div className={cx('rounded-2xl px-4 py-3', tone === 'light' ? 'bg-white/10 ring-1 ring-white/15' : 'bg-white ring-1 ring-line shadow-soft')}>
      <div className={cx('text-2xl font-bold tracking-tight', tone === 'light' ? 'text-white' : 'text-brand-950')}>{value}</div>
      <div className={cx('text-xs font-medium', tone === 'light' ? 'text-white/70' : 'text-stone-500')}>{label}</div>
    </div>
  );
}

export function ExternalA({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
