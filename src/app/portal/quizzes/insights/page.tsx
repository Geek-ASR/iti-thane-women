'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Download, MonitorSmartphone, Pencil } from 'lucide-react';
import { downloadCsv, fmtDateTime, useApi } from '@/lib/portal';
import type { QuizInsights } from '@/lib/types';
import { ColumnChart, HBarChart } from '@/components/charts';
import { Guard } from '@/components/portal/Guard';
import { Button, buttonClass, Card, CardTitle, cx, Empty, ErrorNote, Loading, PageHeader, StatCard } from '@/components/portal/kit';

export default function InsightsPage() {
  return <Guard roles={['instructor', 'admin']}>{() => <Insights />}</Guard>;
}

function Insights() {
  const id = useSearchParams().get('id') ?? '';
  const { data, error, loading } = useApi<QuizInsights>(id ? `/quizzes/${id}/insights` : null, [id]);
  if (error) return <ErrorNote message={error} />;
  if (loading || !data) return <Loading />;
  const { quiz, attempts, questionStats, distribution } = data;
  const n = attempts.length;
  const avg = n ? Math.round((attempts.reduce((s, a) => s + (a.percentage ?? 0), 0) / n) * 10) / 10 : 0;
  const passRate = n ? Math.round((attempts.filter((a) => a.passed).length / n) * 100) : 0;
  const top = n ? Math.max(...attempts.map((a) => a.percentage ?? 0)) : 0;
  const hardest = [...questionStats].sort((a, b) => a.correctPct - b.correctPct);

  return (
    <>
      <title>{`Insights — ${quiz.title}`}</title>
      <PageHeader
        back={{ href: '/portal/quizzes/', label: 'Quizzes' }}
        title={quiz.title}
        subtitle={`${quiz.questionCount} questions · pass ${quiz.passPct}%`}
        actions={
          <>
            <Link href={`/portal/quizzes/edit/?id=${quiz.id}`} className={buttonClass('outline', 'md')}>
              <Pencil className="size-4" aria-hidden /> Edit
            </Link>
            <Button
              disabled={!n}
              onClick={() =>
                downloadCsv(`${quiz.title}-results.csv`, [
                  ['Rank', 'Enrollment', 'Name', 'Score', 'Max', 'Percentage', 'Result', 'Tab switches', 'Submitted'],
                  ...attempts.map((a, i) => [i + 1, a.student.enrollmentNo ?? '', a.student.name, a.score, a.maxScore, a.percentage, a.passed ? 'Pass' : 'Fail', a.tabSwitches, fmtDateTime(a.submittedAt)]),
                ])
              }
            >
              <Download className="size-4" aria-hidden /> Export
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Attempts" value={n} />
        <StatCard label="Average score" value={`${avg}%`} tone="marigold" />
        <StatCard label="Pass rate" value={`${passRate}%`} tone="green" />
        <StatCard label="Top score" value={`${top}%`} tone="rose" />
      </div>
      {n === 0 ? (
        <div className="mt-6">
          <Empty title="No attempts yet">Results appear here as soon as trainees submit.</Empty>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Score distribution</CardTitle>
              <ColumnChart data={distribution.map((b) => ({ label: `${b.bucket}%`, value: b.count, detail: `${b.count} trainee(s)` }))} max={Math.max(1, ...distribution.map((b) => b.count))} ticks={Array.from(new Set([0, Math.ceil(Math.max(1, ...distribution.map((b) => b.count)) / 2), Math.max(1, ...distribution.map((b) => b.count))]))} format={(v) => String(v)} labelIdx={[]} caption="Number of trainees in each score band" headers={['Score band', 'Trainees']} height={160} />
            </Card>
            <Card>
              <CardTitle>Hardest questions first</CardTitle>
              <HBarChart data={hardest.slice(0, 8).map((q) => ({ label: q.text, value: q.correctPct, detail: `${q.correctPct}% answered correctly` }))} max={100} format={(v) => `${v}%`} caption="Share of trainees who answered each question correctly" headers={['Question', 'Correct']} />
            </Card>
          </div>
          <Card className="mt-6" padded={false}>
            <div className="border-b border-line p-5">
              <h2 className="font-bold text-brand-950">Leaderboard</h2>
            </div>
            <ul className="divide-y divide-line">
              {attempts.map((a, i) => (
                <li key={a.id} className="flex items-center gap-4 px-5 py-3">
                  <span className={cx('grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold', i < 3 ? 'bg-marigold-400 text-brand-950' : 'bg-stone-100 text-stone-600')}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-brand-950">{a.student.name}</span>
                    <span className="block text-xs text-stone-500">
                      {a.student.enrollmentNo} · {fmtDateTime(a.submittedAt)}
                    </span>
                  </span>
                  {a.tabSwitches > 0 && (
                    <span className="hidden items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 sm:inline-flex" title="Tab switches during the quiz">
                      <MonitorSmartphone className="size-3.5" aria-hidden /> {a.tabSwitches}
                    </span>
                  )}
                  <span className="w-16 text-right">
                    <span className={cx('block font-bold', a.passed ? 'text-brand-950' : 'text-rose-700')}>{a.percentage}%</span>
                    <span className="block text-xs text-stone-500">
                      {a.score}/{a.maxScore}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </>
  );
}
