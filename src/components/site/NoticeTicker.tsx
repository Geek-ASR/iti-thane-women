'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Megaphone, Pause, Play } from 'lucide-react';
import { useCollection, useSiteSettings } from '@/lib/cms';
import { href, t, tx, type Locale } from '@/lib/i18n';

/** Accessible “latest notices” ticker: pausable, pauses on hover/focus, static list when motion is reduced. */
export function NoticeTicker({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const { items } = useCollection('notices');
  const settings = useSiteSettings();
  const [paused, setPaused] = useState(false);
  if (!settings.tickerEnabled) return null;
  const list = (items ?? []).slice().sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date)).slice(0, 6);
  const banner = lang === 'mr' ? settings.admissionBanner_mr || settings.admissionBanner_en : settings.admissionBanner_en;

  return (
    <div className="border-b border-marigold-200 bg-marigold-50 text-brand-950">
      <div className="container-page flex h-11 items-center gap-3">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-900 px-2.5 py-1 text-[0.7rem] font-bold tracking-wider text-white uppercase">
          <Megaphone className="size-3.5" aria-hidden />
          {ui.latest}
        </span>
        <div className="marquee relative min-w-0 flex-1 overflow-hidden" data-paused={paused} aria-live="off">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-linear-to-r from-marigold-50" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-marigold-50" />
          {list.length === 0 ? (
            <div className="h-4 w-2/3 animate-pulse rounded bg-marigold-200/60" />
          ) : (
            <ul className="marquee-track flex w-max animate-marquee items-center gap-10 motion-reduce:animate-none" style={{ ['--marquee-duration' as string]: `${Math.max(28, list.length * 9)}s` }}>
              {[0, 1].map((copy) =>
                [...(banner ? [{ id: 'banner', text: banner, link: href(lang, '/admissions/') }] : []), ...list.map((n) => ({ id: n.id, text: tx(n.title, lang), link: href(lang, `/notices/#${n.id}`) }))].map((n) => (
                  <li key={`${copy}-${n.id}`} aria-hidden={copy === 1} className="flex items-center gap-3 whitespace-nowrap text-sm font-medium">
                    <span aria-hidden className="size-1.5 rounded-full bg-marigold-500" />
                    <Link href={n.link} tabIndex={copy === 1 ? -1 : undefined} className="hover:text-brand-700 hover:underline">
                      {n.text}
                    </Link>
                  </li>
                )),
              )}
            </ul>
          )}
        </div>
        <button type="button" onClick={() => setPaused((p) => !p)} className="grid size-8 shrink-0 place-items-center rounded-full text-brand-800 hover:bg-marigold-100" aria-label={paused ? ui.play : ui.pause} aria-pressed={paused}>
          {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
