'use client';

import Link from 'next/link';
import { Check, FileText } from 'lucide-react';
import { fmtDate, useApi } from '@/lib/portal';
import type { Application, ApplicationStatus } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { ApplicationBadge, buttonClass, Card, cx, Empty, ErrorNote, Loading, PageHeader } from '@/components/portal/kit';
import { KindBadge } from '@/components/portal/jobs';

const FLOW: ApplicationStatus[] = ['applied', 'shortlisted', 'interview', 'selected'];

export default function ApplicationsPage() {
  return <Guard roles={['student']}>{() => <Applications />}</Guard>;
}

function Applications() {
  const { data, error, loading, reload } = useApi<Application[]>('/applications/me');
  return (
    <>
      <title>My applications</title>
      <PageHeader
        title="My applications"
        subtitle="Follow every application from submission to selection."
        actions={
          <Link href="/portal/jobs/" className={buttonClass('accent', 'md')}>
            Browse openings
          </Link>
        }
      />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data?.length === 0 && (
        <Empty title="You haven’t applied anywhere yet" icon={<FileText className="size-6" aria-hidden />}>
          Complete your profile, then apply to openings that match your trade.
        </Empty>
      )}
      <ul className="space-y-4">
        {data?.map((a) => {
          const stepIdx = FLOW.indexOf(a.status);
          const ended = a.status === 'rejected' || a.status === 'withdrawn';
          return (
            <li key={a.id}>
              <Card>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.job && <KindBadge kind={a.job.kind} />}
                      <ApplicationBadge status={a.status} />
                    </div>
                    <Link href={`/portal/jobs/view/?id=${a.jobId}`} className="mt-2 block text-lg font-bold text-brand-950 hover:underline">
                      {a.job?.title ?? 'Opening'}
                    </Link>
                    <p className="text-sm text-stone-600">
                      {a.job?.company} · applied {fmtDate(a.createdAt)}
                    </p>
                  </div>
                  <p className="text-xs text-stone-500">Updated {fmtDate(a.updatedAt)}</p>
                </div>
                {!ended && (
                  <ol className="mt-5 grid grid-cols-4 gap-1" aria-label="Application progress">
                    {FLOW.map((s, k) => (
                      <li key={s} className="flex flex-col items-center gap-1.5 text-center">
                        <span className={cx('grid size-7 place-items-center rounded-full text-xs font-bold', k <= stepIdx ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-400')} aria-current={k === stepIdx ? 'step' : undefined}>
                          {k < stepIdx ? <Check className="size-3.5" aria-hidden /> : k + 1}
                        </span>
                        <span className={cx('text-[0.7rem] font-semibold capitalize', k <= stepIdx ? 'text-brand-900' : 'text-stone-400')}>{s}</span>
                      </li>
                    ))}
                  </ol>
                )}
                {a.note && <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-900">💬 {a.note}</p>}
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
