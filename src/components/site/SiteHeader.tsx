'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Mail, Menu, Navigation, Phone, Search, UserRound, X } from 'lucide-react';
import { mainNav, type NavGroup } from '@/lib/nav';
import { href, t, tx, type Locale } from '@/lib/i18n';
import { institute } from '@/content/institute';
import { Icon } from '@/components/Icon';
import { buttonClass, cx } from '@/components/ui';
import { A11yControls, LangSwitch, Logo } from './controls';

const SearchDialog = dynamic(() => import('./SearchDialog'), { ssr: false });

export function TopBar({ lang }: { lang: Locale }) {
  const ui = t(lang);
  return (
    <div className="bg-brand-950 text-white">
      <div className="container-page flex h-9 items-center justify-between gap-3 text-xs">
        <p className="flex min-w-0 items-center gap-2 truncate">
          <span className="font-semibold">{ui.gov}</span>
          <span aria-hidden className="hidden text-white/40 sm:inline">|</span>
          <span className="hidden truncate text-white/70 sm:inline">{ui.dvet}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <a href="#main" className="hidden rounded-md px-2 py-1 text-white/80 hover:bg-white/10 hover:text-white md:inline-block">
            {ui.skip}
          </a>
          <span aria-hidden className="hidden h-4 w-px bg-white/20 md:block" />
          <div className="hidden md:block">
            <A11yControls lang={lang} />
          </div>
          <span aria-hidden className="hidden h-4 w-px bg-white/20 md:block" />
          <LangSwitch lang={lang} />
        </div>
      </div>
    </div>
  );
}

function linkPath(lang: Locale, path: string) {
  return path.startsWith('/portal') ? path : href(lang, path);
}

function isActive(pathname: string, lang: Locale, g: NavGroup) {
  const paths = [g.path, ...(g.links ?? []).map((l) => l.path), ...(g.columns ?? []).flatMap((c) => c.links.map((l) => l.path))].filter(Boolean) as string[];
  return paths.some((p) => {
    if (p.startsWith('/portal')) return false;
    const full = href(lang, p.split('#')[0]);
    return full !== `/${lang}/` && pathname.startsWith(full);
  });
}

export function SiteHeader({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const pathname = usePathname() || '';
  const [open, setOpen] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(null);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName);
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const enter = useCallback((id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  }, []);
  const leave = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }, []);

  return (
    <>
      <div className={cx('sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300', scrolled ? 'border-line bg-white/90 shadow-soft backdrop-blur-xl' : 'border-transparent bg-white')}>
        <div className="container-page relative flex h-16 items-center gap-2 lg:h-[4.75rem]">
          <Logo lang={lang} />
          <nav ref={navRef} aria-label={lang === 'mr' ? 'मुख्य मेनू' : 'Main'} className="ml-auto hidden xl:block">
            <ul className="flex items-center">
              {mainNav.map((g, i) => {
                const hasMenu = !!(g.links || g.columns);
                const active = isActive(pathname, lang, g);
                const base = cx('relative flex h-10 items-center gap-1 rounded-full px-2.5 text-[0.92rem] font-semibold whitespace-nowrap transition-colors 2xl:px-3.5', active ? 'text-brand-700' : 'text-stone-700 hover:bg-brand-50 hover:text-brand-800');
                if (!hasMenu)
                  return (
                    <li key={g.id}>
                      <Link href={linkPath(lang, g.path!)} className={base} aria-current={active ? 'page' : undefined}>
                        {tx(g.label, lang)}
                        {active && <span aria-hidden className="absolute inset-x-3 -bottom-[0.95rem] h-0.5 rounded-full bg-marigold-400" />}
                      </Link>
                    </li>
                  );
                const isOpen = open === g.id;
                const mega = !!g.columns;
                return (
                  <li key={g.id} className={mega ? 'static' : 'relative'} onMouseEnter={() => enter(g.id)} onMouseLeave={leave}>
                    <button type="button" className={cx(base, isOpen && 'bg-brand-50 text-brand-800')} aria-expanded={isOpen} aria-controls={`menu-${g.id}`} onClick={() => setOpen(isOpen ? null : g.id)}>
                      {tx(g.label, lang)}
                      <ChevronDown className={cx('size-4 transition-transform', isOpen && 'rotate-180')} aria-hidden />
                      {active && <span aria-hidden className="absolute inset-x-3 -bottom-[0.95rem] h-0.5 rounded-full bg-marigold-400" />}
                    </button>
                    <div id={`menu-${g.id}`} hidden={!isOpen} className={cx('absolute top-full z-50 pt-3', mega ? 'inset-x-4' : i > 3 ? 'right-0' : 'left-0')}>
                      {mega ? (
                        <div className="overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-line">
                          <div className="grid grid-cols-[1fr_1fr_18rem]">
                            {g.columns!.map((col) => (
                              <div key={col.title.en} className="p-6">
                                <p className="mb-3 text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">{tx(col.title, lang)}</p>
                                <ul className="space-y-0.5">
                                  {col.links.map((l) => (
                                    <li key={l.path}>
                                      <Link href={linkPath(lang, l.path)} className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-[0.93rem] font-medium text-stone-700 hover:bg-brand-50 hover:text-brand-800">
                                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                                          <Icon name={l.icon ?? 'Circle'} className="size-4" />
                                        </span>
                                        <span className="line-clamp-1">{tx(l.label, lang)}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            <div className="flex flex-col justify-between bg-brand-950 p-6 text-white">
                              <div>
                                <p className="font-display text-xl font-semibold">{lang === 'mr' ? 'कोणता व्यवसाय निवडावा?' : 'Not sure which trade?'}</p>
                                <p className="mt-2 text-sm text-white/70">{lang === 'mr' ? 'कालावधी, पात्रता व जागा यांची एकत्रित तुलना पहा.' : 'Compare duration, eligibility and seats for all 11 trades side by side.'}</p>
                              </div>
                              <div className="mt-6 flex flex-col gap-2">
                                <Link href={href(lang, '/trades/')} className={buttonClass('accent', 'sm')}>
                                  {lang === 'mr' ? 'सर्व व्यवसाय' : 'Compare all trades'} <ArrowRight className="size-4" aria-hidden />
                                </Link>
                                <Link href={href(lang, '/trades/#short-courses')} className="text-center text-sm font-semibold text-white/80 hover:text-white">
                                  {lang === 'mr' ? 'अल्पमुदतीचे अभ्यासक्रम →' : 'Short-term courses →'}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ul className="w-80 rounded-3xl bg-white p-2.5 shadow-lift ring-1 ring-line">
                          {g.links!.map((l) => (
                            <li key={l.path}>
                              <Link href={linkPath(lang, l.path)} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-brand-50">
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                                  <Icon name={l.icon ?? 'Circle'} className="size-[1.1rem]" />
                                </span>
                                <span>
                                  <span className="block text-[0.93rem] font-semibold text-brand-950">{tx(l.label, lang)}</span>
                                  {l.desc && <span className="block text-xs text-stone-500">{tx(l.desc, lang)}</span>}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-1.5 xl:ml-2">
            <button type="button" onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center rounded-full text-brand-900 hover:bg-brand-50" aria-label={ui.search}>
              <Search className="size-5" aria-hidden />
            </button>
            <span className="hidden sm:block">
              <Link href="/portal/" className={buttonClass('primary', 'sm')}>
                <UserRound className="size-4" aria-hidden />
                <span className="xl:hidden 2xl:inline">{ui.portal}</span>
                <span className="hidden xl:inline 2xl:hidden">{ui.portalShort}</span>
              </Link>
            </span>
            <button type="button" className="grid size-10 place-items-center rounded-full bg-brand-50 text-brand-900 hover:bg-brand-100 xl:hidden" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}>
              <Menu className="size-5" aria-hidden />
              <span className="sr-only">{ui.menu}</span>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && <MobileMenu lang={lang} onClose={() => setMenuOpen(false)} onSearch={() => { setMenuOpen(false); setSearchOpen(true); }} />}
      {searchOpen && <SearchDialog lang={lang} onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function MobileMenu({ lang, onClose, onSearch }: { lang: Locale; onClose: () => void; onSearch: () => void }) {
  const ui = t(lang);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div id="mobile-menu" role="dialog" aria-modal="true" aria-label={ui.menu} className="fixed inset-0 z-50 flex flex-col bg-paper xl:hidden">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line bg-white px-4">
        <Logo lang={lang} />
        <button ref={closeRef} type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-900" aria-label={ui.close}>
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-10">
        <button type="button" onClick={onSearch} className="flex h-12 w-full items-center gap-3 rounded-2xl border border-line bg-white px-4 text-left text-stone-500 shadow-soft">
          <Search className="size-5 text-brand-700" aria-hidden />
          {ui.searchPlaceholder}
        </button>

        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          <li>
            <Link href={href(lang, '/')} className="flex h-14 items-center px-4 text-base font-semibold text-brand-950">
              {ui.home}
            </Link>
          </li>
          {mainNav.map((g) => {
            const links = g.links ?? g.columns?.flatMap((c) => c.links) ?? [];
            if (!links.length)
              return (
                <li key={g.id}>
                  <Link href={linkPath(lang, g.path!)} className="flex h-14 items-center px-4 text-base font-semibold text-brand-950">
                    {tx(g.label, lang)}
                  </Link>
                </li>
              );
            const isOpen = expanded === g.id;
            return (
              <li key={g.id}>
                <button type="button" className="flex h-14 w-full items-center justify-between px-4 text-left text-base font-semibold text-brand-950" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : g.id)}>
                  {tx(g.label, lang)}
                  <ChevronDown className={cx('size-5 text-stone-400 transition-transform', isOpen && 'rotate-180 text-brand-700')} aria-hidden />
                </button>
                {isOpen && (
                  <ul className="grid gap-1 px-2 pb-3">
                    {g.path && (
                      <li>
                        <Link href={linkPath(lang, g.path)} className="flex items-center gap-3 rounded-xl bg-brand-50 px-3 py-2.5 text-[0.95rem] font-semibold text-brand-800">
                          {ui.viewAll} — {tx(g.label, lang)}
                        </Link>
                      </li>
                    )}
                    {links.map((l) => (
                      <li key={l.path}>
                        <Link href={linkPath(lang, l.path)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] text-stone-700 active:bg-brand-50">
                          <Icon name={l.icon ?? 'ChevronRight'} className="size-4 shrink-0 text-brand-600" />
                          {tx(l.label, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <a href={`tel:${institute.phones[0].tel}`} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-sm font-semibold text-brand-900 ring-1 ring-line">
            <Phone className="size-5 text-brand-600" aria-hidden />
            {ui.call}
          </a>
          <a href={`mailto:${institute.email}`} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-sm font-semibold text-brand-900 ring-1 ring-line">
            <Mail className="size-5 text-brand-600" aria-hidden />
            {ui.email}
          </a>
          <a href={institute.directionsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-sm font-semibold text-brand-900 ring-1 ring-line">
            <Navigation className="size-5 text-brand-600" aria-hidden />
            {ui.directions}
          </a>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-line">
          <p className="mb-3 text-xs font-bold tracking-[0.14em] text-stone-500 uppercase">{ui.accessibility}</p>
          <div className="flex flex-wrap items-center gap-2">
            <A11yControls lang={lang} variant="menu" />
            <LangSwitch lang={lang} variant="menu" />
          </div>
        </div>

        <Link href="/portal/" className={buttonClass('primary', 'lg', 'mt-4 w-full')}>
          <UserRound className="size-5" aria-hidden />
          {ui.portal}
        </Link>
      </div>
    </div>
  );
}
