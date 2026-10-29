'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CircleCheck, CircleX, Clock, MonitorSmartphone, Trophy } from 'lucide-react';
import { fmtDateTime, useApi } from '@/lib/portal';
import type { AttemptResult } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { buttonClass, Card, cx, ErrorNote, Loading, PageHeader, Tabs } from '@/components/portal/kit';

export default function ResultPage() {
  return <Guard roles={['student', 'instructor', 'admin']}>{() => <Result />}</Guard>;
}

function Ring({ pct, pass }: { pct: number; pass: boolean }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-40">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e7e5fc" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none" stroke={pass ? '#5a4ccc' : '#d03b3b'} strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} className="transition-[stroke-dashoffset] duration-1000" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-4xl font-bold tracking-tight text-brand-950">{Math.round(pct)}%</p>
          <p className="text-xs text-stone-500">score</p>
        </div>
      </div>
    </div>
  );
}

function Result() {
  const id = useSearchParams().get('attempt') ?? '';
  const { data, error, loading } = useApi<AttemptResult>(id ? `/attempts/${id}` : null, [id]);
  const [tab, setTab] = useState<'all' | 'wrong'>('all');
  if (error) return <ErrorNote message={error} />;
  if (loading || !data) return <Loading />;
  const { attempt, quiz, review } = data;
  const pct = attempt.percentage ?? 0;
  const pass = !!attempt.passed;
  const mins = attempt.submittedAt ? Math.max(1, Math.round((new Date(attempt.submittedAt).getTime() - new Date(attempt.startedAt).getTime()) / 60000)) : 0;
  const list = (review ?? []).filter((q) => tab === 'all' || !q.isCorrect);
  return (
    <div className="mx-auto max-w-3xl">
      <title>{`Result — ${quiz.title}`}</title>
      <PageHeader back={{ href: '/portal/quizzes/', label: 'Quizzes' }} title={quiz.title} subtitle={`Submitted ${fmtDateTime(attempt.submittedAt)}`} />
      <Card className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
        <Ring pct={pct} pass={pass} />
        <div className="flex-1 text-center sm:text-left">
          <p className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ring-1', pass ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-rose-200')}>
            {pass ? <CircleCheck className="size-4" aria-hidden /> : <CircleX className="size-4" aria-hidden />} {pass ? 'Passed' : 'Not passed'} · pass mark {quiz.passPct}%
          </p>
          <p className="mt-3 text-2xl font-bold text-brand-950">
            {attempt.score} / {attempt.maxScore} marks
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-stone-600 sm:justify-start">
            {data.rank && (
              <li className="flex items-center gap-1.5"><Trophy className="size-4 text-marigold-600" aria-hidden /> Rank {data.rank} of {data.of}</li>
            )}
            <li className="flex items-center gap-1.5"><Clock className="size-4" aria-hidden /> {mins} min</li>
            {attempt.tabSwitches > 0 && <li className="flex items-center gap-1.5 text-amber-800"><MonitorSmartphone className="size-4" aria-hidden /> {attempt.tabSwitches} tab switch(es) recorded</li>}
          </ul>
          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Link href="/portal/quizzes/" className={buttonClass('primary', 'md')}>
              Back to quizzes
            </Link>
          </div>
        </div>
      </Card>

      {review ? (
        <>
          <div className="mt-8 mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-brand-950">Answer review</h2>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'all', label: 'All', count: review.length }, { id: 'wrong', label: 'Incorrect', count: review.filter((q) => !q.isCorrect).length }]} />
          </div>
          <ol className="space-y-3">
            {list.map((q) => (
              <li key={q.id}>
                <Card>
                  <div className="flex items-start gap-3">
                    {q.isCorrect ? <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-label="Correct" /> : <CircleX className="mt-0.5 size-5 shrink-0 text-rose-600" aria-label="Incorrect" />}
                    <p className="font-semibold text-brand-950">{q.text}</p>
                  </div>
                  <ul className="mt-3 space-y-1.5 pl-8">
                    {q.options.map((o, k) => (
                      <li key={k} className={cx('rounded-xl px-3 py-2 text-sm ring-1', k === q.correct ? 'bg-emerald-50 font-semibold text-emerald-900 ring-emerald-200' : k === q.chosen ? 'bg-rose-50 text-rose-800 ring-rose-200' : 'text-stone-600 ring-transparent')}>
                        {String.fromCharCode(65 + k)}. {o}
                        {k === q.correct && ' ✓'}
                        {k === q.chosen && k !== q.correct && ' — your answer'}
                      </li>
                    ))}
                  </ul>
                  {q.chosen === null && <p className="mt-2 pl-8 text-xs font-semibold text-amber-800">Not answered</p>}
                  {q.explanation && <p className="mt-3 ml-8 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-900">💡 {q.explanation}</p>}
                </Card>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="mt-6 text-center text-sm text-stone-500">Your instructor has chosen not to show answers for this quiz.</p>
      )}
    </div>
  );
}
