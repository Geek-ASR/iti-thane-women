'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCollection, type GalleryEntry } from '@/lib/cms';
import { t, tx, type Locale } from '@/lib/i18n';
import { galleryCategories } from '@/content/life';
import { Img, imageSrc } from '@/components/Img';
import { cx } from '@/components/ui';

function Thumb({ e, lang }: { e: GalleryEntry; lang: Locale }) {
  if (e.image) return <Img name={e.image} alt={tx(e.caption, lang)} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw" className="rounded-2xl" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={e.src} alt={tx(e.caption, lang)} loading="lazy" className="h-auto w-full rounded-2xl bg-stone-200" />;
}

export function Gallery({ lang, initial = 'all', showFilters = true, limit }: { lang: Locale; initial?: string; showFilters?: boolean; limit?: number }) {
  const ui = t(lang);
  const { items } = useCollection('gallery');
  const [cat, setCat] = useState(initial);
  const [open, setOpen] = useState<number | null>(null);
  const all = items ?? [];
  const list = all.filter((g) => cat === 'all' || g.category === cat).slice(0, limit ?? 1000);
  const counts = Object.fromEntries(galleryCategories.map((c) => [c.id, all.filter((g) => g.category === c.id).length]));

  useEffect(() => {
    const fromHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    if (fromHash && galleryCategories.some((c) => c.id === fromHash)) setCat(fromHash);
  }, []);

  return (
    <div>
      {showFilters && (
        <div role="tablist" aria-label={ui.category} className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: 'all', label: { en: 'All photos', mr: 'सर्व छायाचित्रे' } }, ...galleryCategories].map((c) => {
            const n = c.id === 'all' ? all.length : counts[c.id] ?? 0;
            if (c.id !== 'all' && n === 0) return null;
            return (
              <button key={c.id} role="tab" type="button" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={cx('inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold hc-border', cat === c.id ? 'bg-brand-900 text-white' : 'bg-white text-stone-700 ring-1 ring-line hover:bg-brand-50')}>
                {tx(c.label, lang)}
                <span className={cx('text-xs', cat === c.id ? 'text-white/70' : 'text-stone-400')}>{n}</span>
              </button>
            );
          })}
        </div>
      )}
      {items === null ? (
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mb-3 animate-pulse rounded-2xl bg-stone-200" style={{ height: 120 + ((i * 37) % 90) }} />
          ))}
        </div>
      ) : (
        <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {list.map((e, i) => (
            <li key={e.key} className="mb-3 break-inside-avoid sm:mb-4">
              <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-2xl text-left" aria-label={`${tx(e.caption, lang)} — ${lang === 'mr' ? 'मोठे करून पहा' : 'view larger'}`}>
                <Thumb e={e} lang={lang} />
                <span aria-hidden className="absolute inset-0 flex items-end bg-linear-to-t from-brand-950/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex w-full items-end justify-between gap-2 text-xs font-medium text-white">
                    {tx(e.caption, lang)}
                    <Expand className="size-4 shrink-0" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open !== null && list[open] && <Lightbox list={list} index={open} setIndex={setOpen} lang={lang} />}
    </div>
  );
}

function Lightbox({ list, index, setIndex, lang }: { list: GalleryEntry[]; index: number; setIndex: (i: number | null) => void; lang: Locale }) {
  const ui = t(lang);
  const startX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const e = list[index];
  const go = useCallback((d: number) => setIndex((index + d + list.length) % list.length), [index, list.length, setIndex]);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setIndex(null);
      if (ev.key === 'ArrowRight') go(1);
      if (ev.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [go, setIndex]);

  const src = e.image ? imageSrc(e.image, 1600) : e.src;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tx(e.caption, lang)}
      className="fixed inset-0 z-[70] flex flex-col bg-black/92 text-white"
      onPointerDown={(ev) => (startX.current = ev.clientX)}
      onPointerUp={(ev) => {
        if (startX.current === null) return;
        const dx = ev.clientX - startX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
        <p className="text-sm text-white/70 tabular-nums">
          {index + 1} {ui.of} {list.length}
        </p>
        <button ref={closeRef} type="button" onClick={() => setIndex(null)} className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label={ui.close}>
          <X className="size-5" aria-hidden />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={src} src={src} alt={tx(e.caption, lang)} className="max-h-full max-w-full animate-fade-up rounded-lg object-contain" />
        <button type="button" onClick={() => go(-1)} className="absolute left-2 hidden size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label={ui.prev}>
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <button type="button" onClick={() => go(1)} className="absolute right-2 hidden size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:grid" aria-label={ui.next}>
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button type="button" onClick={() => go(-1)} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 sm:hidden" aria-label={ui.prev}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <p className="flex-1 text-center text-sm sm:text-base">{tx(e.caption, lang)}</p>
        <button type="button" onClick={() => go(1)} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 sm:hidden" aria-label={ui.next}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
