'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Clock, Users } from 'lucide-react';
import { href, t, tx, type Locale } from '@/lib/i18n';
import { trades, type Trade, type TradeType } from '@/content/trades';
import { Img } from '@/components/Img';
import { Icon } from '@/components/Icon';
import { accentClasses, cx } from '@/components/ui';

export function TradeCard({ trade, lang, priority }: { trade: Trade; lang: Locale; priority?: boolean }) {
  const ui = t(lang);
  const a = accentClasses[trade.accent];
  return (
    <Link href={href(lang, `/trades/${trade.slug}/`)} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-lift hc-border">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img name={trade.images[0]} alt="" fill priority={priority} sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 85vw" className="transition duration-700 group-hover:scale-[1.04]" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-brand-950/55 via-transparent to-transparent" />
        <span className={cx('absolute top-3 left-3 grid size-10 place-items-center rounded-2xl shadow-soft', a.icon)}>
          <Icon name={trade.icon} className="size-5" />
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-bold text-brand-900 backdrop-blur">
          {trade.type === 'engineering' ? ui.engineering : ui.nonEngineering}
        </span>
        {trade.isNew && <span className="absolute bottom-3 left-3 rounded-full bg-marigold-400 px-2.5 py-1 text-[0.7rem] font-bold text-brand-950">{ui.new}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className={cx('text-xs font-bold tracking-wider uppercase', a.text)}>{trade.code} · {tx(trade.sector, lang)}</p>
        <h3 className="mt-1.5 font-display text-xl leading-snug font-semibold text-brand-950">{tx(trade.short ?? trade.name, lang)}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">{tx(trade.tagline, lang)}</p>
        <div className="mt-auto flex items-center gap-4 pt-4 text-sm text-stone-600">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-brand-500" aria-hidden />
            {trade.durationYears} {trade.durationYears === 1 ? ui.year : ui.years}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-brand-500" aria-hidden />
            {trade.seats ? `${trade.seats} ${lang === 'mr' ? 'जागा' : 'seats'}` : lang === 'mr' ? 'नवीन व्यवसाय' : 'New trade'}
          </span>
          <ArrowRight className="ml-auto size-5 text-brand-600 transition-transform group-hover:translate-x-1" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

/** Filterable trade grid; a horizontal snap carousel on phones, a grid on larger screens. */
export function TradeExplorer({ lang, layout = 'carousel' }: { lang: Locale; layout?: 'carousel' | 'grid' }) {
  const ui = t(lang);
  const [filter, setFilter] = useState<'all' | TradeType>('all');
  const list = trades.filter((tr) => filter === 'all' || tr.type === filter);
  const tabs: { id: 'all' | TradeType; label: string; count: number }[] = [
    { id: 'all', label: ui.all, count: trades.length },
    { id: 'engineering', label: ui.engineering, count: trades.filter((x) => x.type === 'engineering').length },
    { id: 'non-engineering', label: ui.nonEngineering, count: trades.filter((x) => x.type === 'non-engineering').length },
  ];
  return (
    <div>
      <div role="tablist" aria-label={ui.trades} className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            role="tab"
            type="button"
            aria-selected={filter === tb.id}
            onClick={() => setFilter(tb.id)}
            className={cx('inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors hc-border', filter === tb.id ? 'bg-brand-900 text-white' : 'bg-white text-stone-700 ring-1 ring-line hover:bg-brand-50')}
          >
            {tb.label}
            <span className={cx('rounded-full px-1.5 text-xs', filter === tb.id ? 'bg-white/20' : 'bg-stone-100 text-stone-500')}>{tb.count}</span>
          </button>
        ))}
      </div>
      <ul
        className={cx(
          layout === 'carousel'
            ? 'no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {list.map((tr, i) => (
          <li key={tr.slug} className={cx(layout === 'carousel' && 'w-[82%] shrink-0 snap-start sm:w-auto')}>
            <TradeCard trade={tr} lang={lang} priority={i < 2 && layout === 'grid'} />
          </li>
        ))}
      </ul>
    </div>
  );
}
