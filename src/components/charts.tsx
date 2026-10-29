'use client';

import { useId, useState } from 'react';

/**
 * Lightweight HTML/CSS charts (crisp text at any width — no scaled SVG labels).
 * Single-series colour is brand-500 (#5a4ccc), validated for band, chroma and 3:1 contrast on white.
 * Every chart has hover/focus tooltips and a table view; values are never colour-only.
 */

const SERIES = '#5a4ccc';
const SERIES_HOVER = '#7d72e0';
const GRID = '#e7e4dc';
const BASELINE = '#c3c2b7';

export type Datum = { label: string; value: number; detail?: string };

function TableView({ caption, headers, rows }: { caption: string; headers: [string, string]; rows: [string, string][] }) {
  return (
    <details className="group mt-3 text-sm">
      <summary className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50">
        <span className="group-open:hidden">View as table</span>
        <span className="hidden group-open:inline">Hide table</span>
      </summary>
      <div className="mt-2 overflow-x-auto rounded-xl ring-1 ring-line">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-stone-50 text-xs text-stone-500">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">{headers[0]}</th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">{headers[1]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(([a, b]) => (
              <tr key={a}>
                <td className="px-3 py-2 text-stone-700">{a}</td>
                <td className="px-3 py-2 text-right font-semibold text-brand-950 tabular-nums">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function ColumnChart({
  data,
  max = 100,
  ticks = [0, 25, 50, 75, 100],
  format = (v) => `${v}%`,
  labelIdx = [],
  caption,
  headers = ['Category', 'Value'],
  height = 200,
  baselineNote,
}: {
  data: Datum[];
  max?: number;
  ticks?: number[];
  format?: (v: number) => string;
  /** Indices that get a direct value label (keep it selective). */
  labelIdx?: number[];
  caption: string;
  headers?: [string, string];
  height?: number;
  baselineNote?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const id = useId();
  const axisH = 26;
  return (
    <figure aria-labelledby={`${id}-cap`}>
      <figcaption id={`${id}-cap`} className="sr-only">
        {caption}
      </figcaption>
      <div className="relative select-none" style={{ height: height + axisH }} onPointerLeave={() => setActive(null)}>
        {ticks.map((tk) => (
          <div key={tk} aria-hidden className="absolute right-0 left-0" style={{ bottom: axisH + (tk / max) * height, borderTop: `1px solid ${tk === 0 ? BASELINE : GRID}` }}>
            <span className="absolute -top-2 left-0 bg-white pr-1.5 text-[11px] leading-none text-stone-500 tabular-nums">{format(tk)}</span>
          </div>
        ))}
        <div className="absolute top-0 right-0 left-9 flex items-end" style={{ bottom: axisH }}>
          {data.map((d, i) => {
            const pct = Math.max(0, Math.min(1, d.value / max)) * 100;
            const isActive = active === i;
            return (
              <button
                key={d.label}
                type="button"
                className="relative flex h-full min-w-0 flex-1 items-end justify-center outline-none focus-visible:bg-brand-50/60"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${d.label}: ${format(d.value)}${d.detail ? ` — ${d.detail}` : ''}`}
              >
                <span aria-hidden className="block w-[55%] max-w-6 rounded-t-[4px] transition-colors" style={{ height: `${pct}%`, background: isActive ? SERIES_HOVER : SERIES }} />
                {labelIdx.includes(i) && !isActive && (
                  <span aria-hidden className="absolute left-1/2 -translate-x-1/2 text-[11px] font-bold whitespace-nowrap text-brand-950" style={{ bottom: `calc(${pct}% + 4px)` }}>
                    {format(d.value)}
                  </span>
                )}
                {isActive && (
                  <span role="tooltip" className="pointer-events-none absolute z-10 w-max max-w-44 -translate-x-1/2 rounded-xl bg-brand-950 px-3 py-2 text-left text-white shadow-lift" style={{ bottom: `calc(${pct}% + 8px)`, left: '50%' }}>
                    <span className="block text-sm font-bold">{format(d.value)}</span>
                    <span className="block text-[11px] text-white/70">{d.label}</span>
                    {d.detail && <span className="mt-0.5 block text-[11px] text-white/80">{d.detail}</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div aria-hidden className="absolute right-0 bottom-0 left-9 flex" style={{ height: axisH }}>
          {data.map((d) => (
            <span key={d.label} className="flex-1 truncate pt-1.5 text-center text-[11px] font-medium text-stone-500">
              {d.label}
            </span>
          ))}
        </div>
      </div>
      {baselineNote && <p className="mt-1 text-[11px] text-stone-500">{baselineNote}</p>}
      <TableView caption={caption} headers={headers} rows={data.map((d) => [d.label + (d.detail ? ` (${d.detail})` : ''), format(d.value)])} />
    </figure>
  );
}

export function HBarChart({
  data,
  max,
  format = (v) => String(v),
  caption,
  headers = ['Category', 'Value'],
}: {
  data: Datum[];
  max?: number;
  format?: (v: number) => string;
  caption: string;
  headers?: [string, string];
}) {
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  const [active, setActive] = useState<number | null>(null);
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="space-y-2.5">
        {data.map((d, i) => (
          <li key={d.label}>
            <button
              type="button"
              className="group grid w-full grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 rounded-lg text-left outline-none focus-visible:bg-brand-50 sm:grid-cols-[minmax(0,12rem)_1fr_auto]"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              aria-label={`${d.label}: ${format(d.value)}${d.detail ? ` — ${d.detail}` : ''}`}
            >
              <span className="truncate text-sm text-stone-700">{d.label}</span>
              <span aria-hidden className="relative h-3 rounded-r-[4px]" style={{ background: 'transparent' }}>
                <span className="absolute inset-y-0 left-0 rounded-r-[4px] transition-colors" style={{ width: `${Math.max(1.5, (d.value / top) * 100)}%`, background: active === i ? SERIES_HOVER : SERIES }} />
                {active === i && d.detail && (
                  <span role="tooltip" className="pointer-events-none absolute -top-9 left-0 z-10 w-max rounded-lg bg-brand-950 px-2.5 py-1.5 text-[11px] text-white shadow-lift">
                    {d.detail}
                  </span>
                )}
              </span>
              <span className="w-12 text-right text-sm font-semibold text-brand-950 tabular-nums">{format(d.value)}</span>
            </button>
          </li>
        ))}
      </ul>
      <TableView caption={caption} headers={headers} rows={data.map((d) => [d.label, format(d.value)])} />
    </figure>
  );
}

/** Fixed status palette (never themed) — always paired with an icon and a label. */
export const STATUS = { good: '#0ca30c', warning: '#fab219', serious: '#ec835a', critical: '#d03b3b', neutral: '#898781' } as const;

/** Meter: fill carries severity, the track is a lighter step of the same ramp. */
export function Meter({ value, threshold = 80, label }: { value: number; threshold?: number; label: string }) {
  const ok = value >= threshold;
  const warn = !ok && value >= threshold - 10;
  const fill = ok ? '#5a4ccc' : warn ? STATUS.warning : STATUS.critical;
  const track = ok ? '#e7e5fc' : warn ? '#fff0c7' : '#fbe2e2';
  return (
    <div role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} aria-label={label} className="relative h-2.5 w-full overflow-hidden rounded-full" style={{ background: track }}>
      <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, value)}%`, background: fill }} />
      <span aria-hidden className="absolute inset-y-0 w-0.5 bg-brand-950/40" style={{ left: `${threshold}%` }} />
    </div>
  );
}
