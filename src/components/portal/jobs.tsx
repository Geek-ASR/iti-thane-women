'use client';

import Link from 'next/link';
import { CalendarClock, IndianRupee, MapPin, Users } from 'lucide-react';
import type { Job, JobKind } from '@/lib/types';
import { trades } from '@/content/trades';
import { fmtDate } from '@/lib/portal';
import { ApplicationBadge, cx, JobStatusBadge, tradeLabel } from './kit';

export const KIND_LABEL: Record<JobKind, string> = { job: 'Job', apprenticeship: 'Apprenticeship', internship: 'Internship', drive: 'Campus drive' };
const KIND_TONE: Record<JobKind, string> = {
  job: 'bg-brand-50 text-brand-700 ring-brand-100',
  apprenticeship: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  internship: 'bg-sky-50 text-sky-800 ring-sky-200',
  drive: 'bg-marigold-50 text-marigold-800 ring-marigold-200',
};

export const daysLeft = (iso: string) => Math.ceil((new Date(`${iso}T23:59:59`).getTime() - Date.now()) / 86_400_000);

export function KindBadge({ kind }: { kind: JobKind }) {
  return <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', KIND_TONE[kind])}>{KIND_LABEL[kind]}</span>;
}

export function JobCard({ job, showStatus }: { job: Job; showStatus?: boolean }) {
  const dl = daysLeft(job.lastDate);
  return (
    <Link href={`/portal/jobs/view/?id=${job.id}`} className="group flex h-full flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex flex-wrap items-center gap-2">
        <KindBadge kind={job.kind} />
        {showStatus && <JobStatusBadge status={job.status} />}
        {job.myApplication && <ApplicationBadge status={job.myApplication.status} />}
      </div>
      <h3 className="mt-3 text-lg leading-snug font-bold text-brand-950 group-hover:text-brand-700">{job.title}</h3>
      <p className="text-sm font-medium text-stone-600">{job.company}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-stone-600">
        <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-brand-500" aria-hidden /> {job.location || 'Thane'}</li>
        {job.stipend && <li className="flex items-center gap-2"><IndianRupee className="size-4 shrink-0 text-brand-500" aria-hidden /> {job.stipend}</li>}
        <li className="flex items-center gap-2"><Users className="size-4 shrink-0 text-brand-500" aria-hidden /> {job.openings} opening{job.openings > 1 ? 's' : ''}{job.applicationCount !== undefined ? ` · ${job.applicationCount} applied` : ''}</li>
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <p className="flex flex-wrap gap-1">
          {job.trades.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-stone-100 px-2 py-0.5 text-[0.7rem] font-semibold text-stone-600">
              {tradeLabel(t, trades)}
            </span>
          ))}
          {job.trades.length > 2 && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[0.7rem] font-semibold text-stone-600">+{job.trades.length - 2}</span>}
        </p>
        <p className={cx('flex items-center gap-1 text-xs font-semibold', dl <= 3 ? 'text-rose-700' : 'text-stone-500')}>
          <CalendarClock className="size-3.5" aria-hidden />
          {dl < 0 ? `Closed ${fmtDate(job.lastDate)}` : dl === 0 ? 'Last day today' : `${dl} day${dl > 1 ? 's' : ''} left`}
        </p>
      </div>
    </Link>
  );
}
