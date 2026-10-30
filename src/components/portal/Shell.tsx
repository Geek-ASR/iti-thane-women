'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import {
  BriefcaseBusiness, Building, CalendarCheck, ChartColumn, ClipboardList, FileText, Globe, House, Inbox, LayoutDashboard, ListChecks, LogIn, LogOut,
  Menu, QrCode, RotateCcw, Settings, Sparkles, UserRound, UsersRound, X, type LucideIcon,
} from 'lucide-react';
import { asset, BASE_PATH, DEMO_MODE } from '@/lib/config';
import { useInstallPrompt } from '@/lib/install';
import { AuthProvider, ToastProvider, useAuth } from '@/lib/portal';
import type { Role } from '@/lib/types';
import { Avatar, Button, cx } from './kit';

type NavItem = { href: string; label: string; icon: LucideIcon; match?: string[] };

const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: '/portal/dashboard/', label: 'Home', icon: House },
    { href: '/portal/attendance/', label: 'Attendance', icon: CalendarCheck, match: ['/portal/attendance'] },
    { href: '/portal/quizzes/', label: 'Quizzes', icon: ListChecks, match: ['/portal/quizzes'] },
    { href: '/portal/jobs/', label: 'Jobs', icon: BriefcaseBusiness, match: ['/portal/jobs', '/portal/applications'] },
    { href: '/portal/profile/', label: 'Profile', icon: UserRound, match: ['/portal/profile', '/portal/resume', '/portal/account'] },
  ],
  instructor: [
    { href: '/portal/dashboard/', label: 'Home', icon: House },
    { href: '/portal/attendance/', label: 'Attendance', icon: QrCode, match: ['/portal/attendance/live', '/portal/attendance/'] },
    { href: '/portal/attendance/reports/', label: 'Reports', icon: ChartColumn, match: ['/portal/attendance/reports'] },
    { href: '/portal/quizzes/', label: 'Quizzes', icon: ListChecks, match: ['/portal/quizzes'] },
    { href: '/portal/account/', label: 'Account', icon: Settings, match: ['/portal/account'] },
  ],
  admin: [
    { href: '/portal/dashboard/', label: 'Home', icon: LayoutDashboard },
    { href: '/portal/attendance/', label: 'Attendance', icon: QrCode, match: ['/portal/attendance/live', '/portal/attendance/'] },
    { href: '/portal/attendance/reports/', label: 'Reports', icon: ChartColumn, match: ['/portal/attendance/reports'] },
    { href: '/portal/quizzes/', label: 'Quizzes', icon: ListChecks, match: ['/portal/quizzes'] },
    { href: '/portal/jobs/', label: 'Placements', icon: BriefcaseBusiness, match: ['/portal/jobs'] },
    { href: '/portal/admin/enquiries/', label: 'Enquiries', icon: Inbox, match: ['/portal/admin/enquiries'] },
    { href: '/portal/admin/users/', label: 'People', icon: UsersRound, match: ['/portal/admin/users'] },
    { href: '/portal/admin/batches/', label: 'Batches', icon: Building, match: ['/portal/admin/batches'] },
    { href: '/portal/admin/content/', label: 'Website content', icon: FileText, match: ['/portal/admin/content'] },
    { href: '/portal/admin/settings/', label: 'Settings', icon: Settings, match: ['/portal/admin/settings', '/portal/account'] },
  ],
  employer: [
    { href: '/portal/dashboard/', label: 'Home', icon: House },
    { href: '/portal/jobs/?mine=1', label: 'My openings', icon: BriefcaseBusiness, match: ['/portal/jobs'] },
    { href: '/portal/jobs/edit/', label: 'Post opening', icon: ClipboardList, match: ['/portal/jobs/edit'] },
    { href: '/portal/account/', label: 'Account', icon: Settings, match: ['/portal/account'] },
  ],
};
const MOBILE_TABS: Record<Role, number> = { student: 5, instructor: 5, admin: 4, employer: 4 };
const ROLE_LABEL: Record<Role, string> = { student: 'Trainee', instructor: 'Instructor', admin: 'Admin · TPO', employer: 'Employer' };

const isActive = (pathname: string, item: NavItem) => {
  const path = item.href.split('?')[0];
  if (item.match) return item.match.some((m) => (m.endsWith('/') ? pathname === m : pathname.startsWith(m)));
  return pathname === path;
};

function DemoBar() {
  const [busy, setBusy] = useState(false);
  if (!DEMO_MODE) return null;
  return (
    <div className="no-print bg-marigold-400 text-brand-950">
      <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-1.5 text-center text-xs font-semibold sm:text-[0.8rem]">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="size-3.5" aria-hidden /> Preview mode — sample data, stored only in this browser.
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            if (!confirm('Reset the demo? All changes made in this browser will be cleared.')) return;
            setBusy(true);
            const { resetDemo } = await import('@/lib/demo/server');
            resetDemo();
            window.location.href = `${BASE_PATH}/portal/login/`;
          }}
          className="inline-flex items-center gap-1 rounded-full bg-brand-950/10 px-2.5 py-0.5 hover:bg-brand-950/20"
        >
          <RotateCcw className="size-3" aria-hidden /> Reset demo
        </button>
      </div>
    </div>
  );
}

function Brand({ dark }: { dark?: boolean }) {
  return (
    <Link href="/portal/dashboard/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/brand/dvet-logo.png')} alt="" width={40} height={40} className="size-[88%] object-contain" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={cx('block truncate font-display text-[1.02rem] font-semibold', dark ? 'text-white' : 'text-brand-950')}>Smart Campus</span>
        <span className={cx('block truncate text-[0.7rem] font-semibold', dark ? 'text-white/60' : 'text-stone-500')}>Govt. ITI (Women), Thane</span>
      </span>
    </Link>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const { user, logout } = useAuth();
  const [more, setMore] = useState(false);
  const install = useInstallPrompt();
  useEffect(() => setMore(false), [pathname]);

  const bare = /^\/portal\/(login|register)\/?$/.test(pathname) || /^\/portal\/?$/.test(pathname);
  if (bare)
    return (
      <>
        <DemoBar />
        {children}
      </>
    );

  if (!user)
    return (
      <div className="min-h-dvh">
        <DemoBar />
        <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
            <Brand />
            <div className="flex items-center gap-2">
              <a href={`${BASE_PATH}/en/`} className="hidden text-sm font-semibold text-stone-600 hover:text-brand-700 sm:block">
                Main website
              </a>
              <Link href={`/portal/login/?next=${encodeURIComponent(pathname)}`} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white">
                <LogIn className="size-4" aria-hidden /> Sign in
              </Link>
            </div>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          {children}
        </main>
      </div>
    );

  const nav = NAV[user.role];
  const tabs = nav.slice(0, MOBILE_TABS[user.role] - (nav.length > MOBILE_TABS[user.role] ? 1 : 0));
  const overflow = nav.length > MOBILE_TABS[user.role];

  return (
    <div className="min-h-dvh lg:pl-72 print:pl-0">
      {/* Desktop sidebar */}
      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-brand-950 text-white lg:flex">
        <div className="flex h-20 items-center px-5">
          <Brand dark />
        </div>
        <nav aria-label="Portal" className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? 'page' : undefined} className={cx('flex h-11 items-center gap-3 rounded-xl px-3 text-[0.93rem] font-semibold transition-colors', active ? 'bg-white text-brand-950' : 'text-white/75 hover:bg-white/10 hover:text-white')}>
                    <item.icon className={cx('size-5', active ? 'text-brand-600' : '')} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          <a href={`${BASE_PATH}/en/`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <Globe className="size-4" aria-hidden /> Main website
          </a>
          <div className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3">
            <Avatar name={user.name} tone="marigold" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-white/60">{ROLE_LABEL[user.role]}</p>
            </div>
            <button type="button" onClick={logout} className="grid size-9 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white" aria-label="Sign out">
              <LogOut className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </aside>

      <DemoBar />
      {/* Mobile top bar */}
      <header className="no-print sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Brand />
          <Link href="/portal/account/" className="flex items-center gap-2 rounded-full p-0.5 pr-0.5" aria-label="Account">
            <Avatar name={user.name} size="sm" tone="marigold" />
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pt-5 pb-28 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12 print:max-w-none print:p-0">
        {user.status !== 'active' ? <PendingNotice role={user.role} /> : null}
        {install.available && (
          <div className="no-print mb-5 flex items-center justify-between gap-3 rounded-2xl bg-brand-50 p-3 text-sm ring-1 ring-brand-100">
            <span className="font-medium text-brand-900">Install Smart Campus on your phone for one-tap attendance.</span>
            <Button size="sm" onClick={() => install.prompt()}>Install</Button>
          </div>
        )}
        {children}
      </main>

      {/* Mobile bottom tabs */}
      <nav aria-label="Portal" className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <ul className="mx-auto grid max-w-lg" style={{ gridTemplateColumns: `repeat(${tabs.length + (overflow ? 1 : 0)}, minmax(0, 1fr))` }}>
          {tabs.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? 'page' : undefined} className={cx('flex flex-col items-center gap-0.5 py-2 text-[0.68rem] font-semibold', active ? 'text-brand-700' : 'text-stone-500')}>
                  <span className={cx('grid h-7 w-12 place-items-center rounded-full', active && 'bg-brand-50')}>
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <span className="max-w-full truncate px-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
          {overflow && (
            <li>
              <button type="button" onClick={() => setMore(true)} className="flex w-full flex-col items-center gap-0.5 py-2 text-[0.68rem] font-semibold text-stone-500" aria-expanded={more}>
                <span className="grid h-7 w-12 place-items-center rounded-full">
                  <Menu className="size-5" aria-hidden />
                </span>
                More
              </button>
            </li>
          )}
        </ul>
      </nav>

      {more && (
        <div className="fixed inset-0 z-50 flex items-end bg-brand-950/50 backdrop-blur-sm lg:hidden" onMouseDown={(e) => e.target === e.currentTarget && setMore(false)}>
          <div role="dialog" aria-modal="true" aria-label="More" className="w-full rounded-t-3xl bg-white p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lift">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-brand-950">Menu</p>
              <button type="button" onClick={() => setMore(false)} className="grid size-9 place-items-center rounded-full hover:bg-stone-100" aria-label="Close">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={cx('flex flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-semibold ring-1', isActive(pathname, item) ? 'bg-brand-50 text-brand-800 ring-brand-200' : 'text-stone-700 ring-line')}>
                    <item.icon className="size-5" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a href={`${BASE_PATH}/en/`} className="flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-stone-700 ring-1 ring-line">
                <Globe className="size-4" aria-hidden /> Website
              </a>
              <button type="button" onClick={logout} className="flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
                <LogOut className="size-4" aria-hidden /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PendingNotice({ role }: { role: Role }) {
  return (
    <div role="status" className="mb-6 rounded-3xl bg-marigold-50 p-5 ring-1 ring-marigold-200">
      <p className="font-semibold text-brand-950">Your account is awaiting approval</p>
      <p className="mt-1 text-sm text-stone-700">
        {role === 'employer'
          ? 'The placement cell will verify your company shortly. You can explore the portal meanwhile; posting openings unlocks after approval.'
          : 'The institute office will verify your details and assign your batch. You can complete your profile meanwhile.'}
      </p>
    </div>
  );
}

export function PortalApp({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={null}>
          <Shell>{children}</Shell>
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
}
