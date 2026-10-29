'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardCheck, GraduationCap, House, Phone, UserRound } from 'lucide-react';
import { href, t, type Locale } from '@/lib/i18n';
import { cx } from '@/components/ui';

/** Bottom navigation for phones — the five things visitors need most, within thumb reach. */
export function MobileDock({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const pathname = usePathname() || '';
  const items = [
    { to: href(lang, '/'), label: ui.home, Icon: House, active: pathname === `/${lang}/` || pathname === `/${lang}` },
    { to: href(lang, '/trades/'), label: ui.trades, Icon: GraduationCap, active: pathname.startsWith(`/${lang}/trades`) },
    { to: href(lang, '/admissions/'), label: lang === 'mr' ? 'प्रवेश' : 'Admission', Icon: ClipboardCheck, active: pathname.startsWith(`/${lang}/admissions`), primary: true },
    { to: href(lang, '/contact/'), label: ui.contact, Icon: Phone, active: pathname.startsWith(`/${lang}/contact`) },
    { to: '/portal/', label: ui.portalShort, Icon: UserRound, active: false },
  ];
  return (
    <nav aria-label={lang === 'mr' ? 'झटपट दुवे' : 'Quick navigation'} className="no-print fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end rounded-[1.4rem] bg-white/92 px-1 shadow-lift ring-1 ring-line backdrop-blur-xl">
        {items.map(({ to, label, Icon, active, primary }) => (
          <li key={to}>
            <Link href={to} aria-current={active ? 'page' : undefined} className={cx('flex flex-col items-center gap-0.5 pt-2 pb-2 text-[0.68rem] font-semibold', active ? 'text-brand-700' : 'text-stone-500')}>
              {primary ? (
                <span className="-mt-6 mb-0.5 grid size-12 place-items-center rounded-full bg-marigold-400 text-brand-950 shadow-lift ring-4 ring-paper">
                  <Icon className="size-[1.35rem]" aria-hidden />
                </span>
              ) : (
                <span className={cx('grid h-7 w-12 place-items-center rounded-full transition-colors', active && 'bg-brand-50')}>
                  <Icon className="size-5" aria-hidden />
                </span>
              )}
              <span className="max-w-full truncate px-0.5">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
