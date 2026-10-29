'use client';

import Link from 'next/link';
import { CircleCheck, CircleX } from 'lucide-react';
import { fmtTime } from '@/lib/portal';
import type { AttendanceRecord } from '@/lib/types';
import { Button, buttonClass, Card } from './kit';

export type MarkResult = { record: AttendanceRecord; session: { id: string; topic: string; batchName: string }; alreadyMarked: boolean };

export function MarkOutcome({ result, error, onRetry }: { result: MarkResult | null; error: string; onRetry?: () => void }) {
  if (result)
    return (
      <Card className="text-center">
        <CircleCheck className="mx-auto size-16 text-emerald-600" aria-hidden />
        <p className="mt-4 font-display text-2xl font-semibold text-brand-950">{result.alreadyMarked ? 'Already marked' : result.record.status === 'late' ? 'Marked — late' : 'You’re marked present'}</p>
        <p className="mt-1 text-stone-600">
          {result.session.topic} · {result.session.batchName}
        </p>
        <p className="mt-1 text-sm text-stone-500">at {fmtTime(result.record.markedAt)}</p>
        {result.record.flagged && <p className="mx-auto mt-4 max-w-sm rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200">Your mark will be reviewed by your instructor (location unavailable or outside campus).</p>}
        <Link href="/portal/attendance/" className={buttonClass('primary', 'md', 'mt-6')}>
          View my attendance
        </Link>
      </Card>
    );
  return (
    <Card className="text-center">
      <CircleX className="mx-auto size-16 text-rose-600" aria-hidden />
      <p className="mt-4 font-display text-2xl font-semibold text-brand-950">Couldn’t mark attendance</p>
      <p className="mx-auto mt-2 max-w-sm text-stone-600">{error}</p>
      {onRetry && (
        <Button className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}
