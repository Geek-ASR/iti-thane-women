'use client';

import Link from 'next/link';
import { useEffect, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { CircleAlert, Inbox, LoaderCircle, X } from 'lucide-react';
import type { ApplicationStatus, AttendanceStatus, JobStatus, QuizStatus, UserStatus } from '@/lib/types';
import { buttonClass, cx } from '@/components/ui';

export { cx, buttonClass };

export function PageHeader({ title, subtitle, actions, back }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            ← {back.label}
          </Link>
        )}
        <h1 className="font-display text-[1.75rem] leading-tight font-semibold text-brand-950 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-600 sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, padded = true }: { children: ReactNode; className?: string; padded?: boolean }) {
  return <div className={cx('rounded-3xl bg-white shadow-soft ring-1 ring-line', padded && 'p-5 sm:p-6', className)}>{children}</div>;
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-[1.05rem] font-bold text-brand-950">{children}</h2>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, tone = 'brand' }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; tone?: 'brand' | 'marigold' | 'green' | 'rose' }) {
  const tones = { brand: 'bg-brand-50 text-brand-700', marigold: 'bg-marigold-100 text-marigold-800', green: 'bg-emerald-50 text-emerald-700', rose: 'bg-rose-50 text-rose-700' };
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-line sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-stone-600">{label}</p>
        {icon && <span className={cx('grid size-9 shrink-0 place-items-center rounded-xl', tones[tone])}>{icon}</span>}
      </div>
      <p className="mt-2 text-[1.9rem] leading-none font-bold tracking-tight text-brand-950">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cx('animate-spin text-brand-600', className ?? 'size-5')} aria-hidden />;
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-sm text-stone-500">
      <Spinner /> {label}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-2xl bg-rose-50 p-4 text-sm text-rose-800 ring-1 ring-rose-200 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-2">
        <CircleAlert className="size-5 shrink-0" aria-hidden /> {message}
      </span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold underline">
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({ title, children, icon }: { title: string; children?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">{icon ?? <Inbox className="size-6" aria-hidden />}</span>
      <p className="mt-4 font-semibold text-brand-950">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-stone-600">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('animate-pulse rounded-xl bg-stone-200/80', className)} />;
}

/* ---------- Form controls ---------- */
const control = 'w-full rounded-xl border border-line bg-white px-3.5 text-[0.95rem] text-brand-950 outline-none transition placeholder:text-stone-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 disabled:bg-stone-50 disabled:text-stone-500';

export function Field({ label, hint, error, children, required, htmlFor }: { label: string; hint?: ReactNode; error?: string; children: ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-brand-950">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(control, 'h-11', className)} />;
export const Select = ({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} className={cx(control, 'h-11 pr-8', className)}>
    {children}
  </select>
);
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={cx(control, 'py-2.5', className)} />;

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-paper p-3.5 ring-1 ring-line">
      <span>
        <span className="block text-sm font-semibold text-brand-950">{label}</span>
        {hint && <span className="block text-xs text-stone-500">{hint}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span aria-hidden className="h-6 w-11 rounded-full bg-stone-300 transition-colors peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-marigold-300" />
        <span aria-hidden className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function Button({ variant = 'primary', size = 'md', className, busy, children, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'light' | 'glass'; size?: 'sm' | 'md' | 'lg'; busy?: boolean }) {
  return (
    <button type="button" {...p} disabled={p.disabled || busy} className={buttonClass(variant, size, className)}>
      {busy && <Spinner className="size-4 text-current" />}
      {children}
    </button>
  );
}

export function Tabs<T extends string>({ value, onChange, tabs, className }: { value: T; onChange: (v: T) => void; tabs: { id: T; label: ReactNode; count?: number }[]; className?: string }) {
  return (
    <div role="tablist" className={cx('no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0', className)}>
      {tabs.map((t) => (
        <button key={t.id} role="tab" type="button" aria-selected={value === t.id} onClick={() => onChange(t.id)} className={cx('inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors hc-border', value === t.id ? 'bg-brand-900 text-white' : 'bg-white text-stone-700 ring-1 ring-line hover:bg-brand-50')}>
          {t.label}
          {t.count !== undefined && <span className={cx('rounded-full px-1.5 text-xs', value === t.id ? 'bg-white/20' : 'bg-stone-100 text-stone-500')}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Bottom sheet on phones, centred dialog on larger screens. */
export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.querySelector<HTMLElement>('input,select,textarea,button')?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-brand-950/50 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cx('flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl', wide ? 'sm:max-w-3xl' : 'sm:max-w-lg')}>
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-brand-950">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full text-stone-500 hover:bg-stone-100" aria-label="Close">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-line bg-paper px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}

export function Avatar({ name, size = 'md', tone = 'brand' }: { name: string; size?: 'sm' | 'md' | 'lg'; tone?: 'brand' | 'marigold' }) {
  const initials = name.replace(/^(Mrs?|Miss|Ms|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' };
  return (
    <span aria-hidden className={cx('grid shrink-0 place-items-center rounded-full font-bold', sizes[size], tone === 'brand' ? 'bg-brand-100 text-brand-800' : 'bg-marigold-400 text-brand-950')}>
      {initials || '?'}
    </span>
  );
}

/* ---------- Status badges (status colour always paired with a label) ---------- */
const pill = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap';
const dot = (c: string) => <span aria-hidden className="size-1.5 rounded-full" style={{ background: c }} />;

export function AttendanceBadge({ status }: { status: AttendanceStatus | null }) {
  const map: Record<string, [string, string, string]> = {
    present: ['Present', 'bg-emerald-50 text-emerald-800 ring-emerald-200', '#0ca30c'],
    late: ['Late', 'bg-amber-50 text-amber-800 ring-amber-200', '#fab219'],
    absent: ['Absent', 'bg-rose-50 text-rose-700 ring-rose-200', '#d03b3b'],
    leave: ['Leave', 'bg-stone-100 text-stone-700 ring-stone-200', '#898781'],
    none: ['Not marked', 'bg-white text-stone-500 ring-stone-200', '#c3c2b7'],
  };
  const [label, cls, c] = map[status ?? 'none'];
  return (
    <span className={cx(pill, cls)}>
      {dot(c)}
      {label}
    </span>
  );
}

export function ApplicationBadge({ status }: { status: ApplicationStatus }) {
  const map: Record<ApplicationStatus, [string, string]> = {
    applied: ['Applied', 'bg-brand-50 text-brand-700 ring-brand-100'],
    shortlisted: ['Shortlisted', 'bg-sky-50 text-sky-800 ring-sky-200'],
    interview: ['Interview', 'bg-amber-50 text-amber-800 ring-amber-200'],
    selected: ['Selected', 'bg-emerald-50 text-emerald-800 ring-emerald-200'],
    rejected: ['Not selected', 'bg-rose-50 text-rose-700 ring-rose-200'],
    withdrawn: ['Withdrawn', 'bg-stone-100 text-stone-600 ring-stone-200'],
  };
  const [label, cls] = map[status];
  return <span className={cx(pill, cls)}>{label}</span>;
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const map: Record<JobStatus, [string, string]> = {
    open: ['Live', 'bg-emerald-50 text-emerald-800 ring-emerald-200'],
    pending: ['Awaiting approval', 'bg-amber-50 text-amber-800 ring-amber-200'],
    closed: ['Closed', 'bg-stone-100 text-stone-600 ring-stone-200'],
    rejected: ['Rejected', 'bg-rose-50 text-rose-700 ring-rose-200'],
  };
  const [label, cls] = map[status];
  return <span className={cx(pill, cls)}>{label}</span>;
}

export function QuizStatusBadge({ status }: { status: QuizStatus }) {
  const map: Record<QuizStatus, [string, string]> = {
    published: ['Published', 'bg-emerald-50 text-emerald-800 ring-emerald-200'],
    draft: ['Draft', 'bg-stone-100 text-stone-600 ring-stone-200'],
    closed: ['Closed', 'bg-rose-50 text-rose-700 ring-rose-200'],
  };
  const [label, cls] = map[status];
  return <span className={cx(pill, cls)}>{label}</span>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, [string, string]> = {
    active: ['Active', 'bg-emerald-50 text-emerald-800 ring-emerald-200'],
    pending: ['Pending approval', 'bg-amber-50 text-amber-800 ring-amber-200'],
    disabled: ['Disabled', 'bg-stone-100 text-stone-600 ring-stone-200'],
  };
  const [label, cls] = map[status];
  return <span className={cx(pill, cls)}>{label}</span>;
}

export const tradeLabel = (slug: string | null | undefined, trades: { slug: string; short?: { en: string }; name: { en: string } }[]) => {
  const t = trades.find((x) => x.slug === slug);
  return t ? (t.short ?? t.name).en : slug ?? '—';
};
