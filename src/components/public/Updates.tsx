'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, Pin, Search } from 'lucide-react';
import { useCollection } from '@/lib/cms';
import { formatDate, href, t, tx, type Locale } from '@/lib/i18n';
import { noticeCategories, type Notice, type NoticeCategory } from '@/content/updates';
import { Img } from '@/components/Img';
import { Badge, cx } from '@/components/ui';

const catLabel = (c: NoticeCategory, lang: Locale) => tx(noticeCategories.find((x) => x.id === c)?.label ?? { en: c, mr: c }, lang);
const isRecent = (iso: string) => Date.now() - new Date(iso).getTime() < 1000 * 60 * 60 * 24 * 30;

function SkeletonRows({ n = 4 }: { n?: number }) {
  return (
    <ul className="divide-y divide-line" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className="space-y-2 py-4">
          <div className="h-3 w-24 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200" />
        </li>
      ))}
    </ul>
  );
}

export function NoticeRow({ n, lang, expanded }: { n: Notice; lang: Locale; expanded?: boolean }) {
  const ui = t(lang);
  return (
    <article id={n.id} className="scroll-mt-32 py-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <time dateTime={n.date} className="font-semibold text-stone-500">{formatDate(n.date, lang)}</time>
        <Badge tone="brand">{catLabel(n.category, lang)}</Badge>
        {n.pinned && (
          <Badge tone="marigold">
            <Pin className="size-3" aria-hidden /> {ui.pinned}
          </Badge>
        )}
        {isRecent(n.date) && <Badge tone="green">{ui.new}</Badge>}
      </div>
      <h3 className="mt-2 text-[1.02rem] leading-snug font-semibold text-brand-950">{tx(n.title, lang)}</h3>
      {expanded && <p className="mt-2 text-sm leading-relaxed text-stone-600">{tx(n.body, lang)}</p>}
      {expanded && n.link && (
        <a href={n.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          {n.linkLabel ? tx(n.linkLabel, lang) : ui.open} <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
    </article>
  );
}

/** Compact notice board for the home page. */
export function NoticeBoard({ lang, limit = 5 }: { lang: Locale; limit?: number }) {
  const ui = t(lang);
  const { items } = useCollection('notices');
  const list = (items ?? []).slice().sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date)).slice(0, limit);
  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold text-brand-950">{lang === 'mr' ? 'सूचना फलक' : 'Notice board'}</h3>
        <Link href={href(lang, '/notices/')} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          {ui.viewAll} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      {items === null ? (
        <SkeletonRows />
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {list.map((n) => (
            <li key={n.id}>
              <Link href={href(lang, `/notices/#${n.id}`)} className="block rounded-xl transition-colors hover:bg-brand-50/50">
                <NoticeRow n={n} lang={lang} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Full notice listing with category filter and search. */
export function NoticeArchive({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const { items } = useCollection('notices');
  const [cat, setCat] = useState<'all' | NoticeCategory>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (items ?? [])
      .filter((n) => cat === 'all' || n.category === cat)
      .filter((n) => !needle || `${n.title.en} ${n.title.mr} ${n.body.en} ${n.body.mr}`.toLowerCase().includes(needle))
      .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date));
  }, [items, cat, q]);
  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label={ui.category} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {[{ id: 'all' as const, label: { en: 'All', mr: 'सर्व' } }, ...noticeCategories].map((c) => (
            <button key={c.id} role="tab" type="button" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={cx('h-9 shrink-0 rounded-full px-3.5 text-sm font-semibold hc-border', cat === c.id ? 'bg-brand-900 text-white' : 'bg-white text-stone-700 ring-1 ring-line hover:bg-brand-50')}>
              {tx(c.label, lang)}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">{ui.search}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={ui.search} className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-sm outline-none focus:border-brand-400" />
        </label>
      </div>
      <div className="mt-6 rounded-3xl bg-white px-5 shadow-soft ring-1 ring-line sm:px-8">
        {items === null ? (
          <SkeletonRows n={5} />
        ) : list.length === 0 ? (
          <p className="py-12 text-center text-stone-500">{ui.noResults}</p>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((n) => (
              <li key={n.id}>
                <NoticeRow n={n} lang={lang} expanded />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EventImage({ image, alt }: { image?: string; alt: string }) {
  if (!image) return <div aria-hidden className="bg-dots-ink grid h-full w-full place-items-center bg-brand-50 text-brand-300"><CalendarDays className="size-8" /></div>;
  if (/[/:]/.test(image)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover" />;
  }
  return <Img name={image} alt={alt} fill sizes="(min-width: 1024px) 30vw, 90vw" />;
}

export function EventsList({ lang, limit, variant = 'list' }: { lang: Locale; limit?: number; variant?: 'list' | 'compact' }) {
  const ui = t(lang);
  const { items } = useCollection('events');
  const list = (items ?? []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit ?? 100);
  if (items === null) return <SkeletonRows n={3} />;
  if (variant === 'compact')
    return (
      <ul className="space-y-3">
        {list.map((e) => (
          <li key={e.id}>
            <Link href={href(lang, `/events/#${e.id}`)} className="group flex gap-4 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-line transition hover:shadow-lift">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                <EventImage image={e.image} alt="" />
              </div>
              <div className="min-w-0 py-0.5">
                <time dateTime={e.date} className="text-xs font-semibold text-marigold-700">{formatDate(e.date, lang, { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                <p className="mt-1 line-clamp-2 text-[0.95rem] leading-snug font-semibold text-brand-950 group-hover:text-brand-700">{tx(e.title, lang)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  return (
    <ol className="relative space-y-6 border-l-2 border-dashed border-brand-200 pl-6 sm:pl-8">
      {list.map((e) => (
        <li key={e.id} id={e.id} className="relative scroll-mt-32">
          <span aria-hidden className="absolute top-6 -left-[2.05rem] size-4 rounded-full bg-marigold-400 ring-4 ring-paper sm:-left-[2.55rem]" />
          <article className="grid overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line md:grid-cols-[16rem_1fr]">
            <div className="relative aspect-[16/9] md:aspect-auto md:h-full">
              <EventImage image={e.image} alt={tx(e.title, lang)} />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <time dateTime={e.date} className="font-bold text-marigold-700">{formatDate(e.date, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                <Badge tone="brand">{tx(e.tag, lang)}</Badge>
              </div>
              <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-brand-950">{tx(e.title, lang)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{tx(e.body, lang)}</p>
            </div>
          </article>
        </li>
      ))}
      {list.length === 0 && <li className="text-stone-500">{ui.noResults}</li>}
    </ol>
  );
}
