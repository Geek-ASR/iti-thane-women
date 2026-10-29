'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChartColumn, Clock, Copy, ListChecks, Pencil, Plus, Target, Trash, Trophy } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { fmtDate, useApi, useToast } from '@/lib/portal';
import type { Quiz, User } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { Button, buttonClass, Card, cx, Empty, ErrorNote, Loading, PageHeader, QuizStatusBadge, Tabs } from '@/components/portal/kit';

export default function QuizzesPage() {
  return <Guard roles={['student', 'instructor', 'admin']}>{(u) => (u.role === 'student' ? <StudentQuizzes /> : <StaffQuizzes user={u} />)}</Guard>;
}

function StudentQuizzes() {
  const { data, error, loading, reload } = useApi<Quiz[]>('/quizzes');
  const [tab, setTab] = useState<'todo' | 'done'>('todo');
  const done = (q: Quiz) => (q.myAttempts ?? []).some((a) => a.submittedAt);
  const list = (data ?? []).filter((q) => (tab === 'todo' ? !done(q) : done(q)));
  return (
    <>
      <title>Quizzes</title>
      <PageHeader title="Quizzes & tests" subtitle="Timed practice tests from your instructors. Results appear instantly." />
      <Tabs className="mb-5" value={tab} onChange={setTab} tabs={[{ id: 'todo', label: 'To do', count: (data ?? []).filter((q) => !done(q)).length }, { id: 'done', label: 'Completed', count: (data ?? []).filter(done).length }]} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && list.length === 0 && <Empty title={tab === 'todo' ? 'No pending quizzes' : 'No completed quizzes yet'} icon={<ListChecks className="size-6" aria-hidden />}>{tab === 'todo' ? 'New quizzes from your instructor will show up here.' : 'Finish a quiz to see your results here.'}</Empty>}
      <ul className="grid gap-4 md:grid-cols-2">
        {list.map((q) => {
          const subs = (q.myAttempts ?? []).filter((a) => a.submittedAt);
          const best = subs.length ? Math.max(...subs.map((a) => a.percentage ?? 0)) : null;
          const left = q.attemptsAllowed - subs.length;
          const last = subs[subs.length - 1];
          return (
            <li key={q.id}>
              <Card className="flex h-full flex-col">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-900 text-marigold-300">
                    <ListChecks className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-bold text-brand-950">{q.title}</h2>
                    {q.description && <p className="mt-0.5 line-clamp-2 text-sm text-stone-600">{q.description}</p>}
                  </div>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-stone-600">
                  <li className="flex items-center gap-1"><ListChecks className="size-3.5" aria-hidden /> {q.questionCount} questions</li>
                  <li className="flex items-center gap-1"><Clock className="size-3.5" aria-hidden /> {q.durationMin} min</li>
                  <li className="flex items-center gap-1"><Target className="size-3.5" aria-hidden /> Pass {q.passPct}%</li>
                </ul>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  {best !== null ? (
                    <p className="text-sm">
                      Best: <span className={cx('font-bold', best >= q.passPct ? 'text-emerald-700' : 'text-rose-700')}>{best}%</span>
                      <span className="text-stone-500"> · {left > 0 ? `${left} attempt${left > 1 ? 's' : ''} left` : 'no attempts left'}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-stone-500">{q.attemptsAllowed} attempt{q.attemptsAllowed > 1 ? 's' : ''} allowed</p>
                  )}
                  <div className="flex gap-2">
                    {last && (
                      <Link href={`/portal/quizzes/result/?attempt=${last.id}`} className={buttonClass('outline', 'sm')}>
                        Result
                      </Link>
                    )}
                    {left > 0 && (
                      <Link href={`/portal/quizzes/take/?id=${q.id}`} className={buttonClass(subs.length ? 'outline' : 'accent', 'sm')}>
                        {subs.length ? 'Retake' : 'Start'}
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function StaffQuizzes({ user }: { user: User }) {
  const toast = useToast();
  const { data, error, loading, reload } = useApi<Quiz[]>('/quizzes');
  const [tab, setTab] = useState<'all' | 'published' | 'draft'>('all');
  const list = (data ?? []).filter((q) => tab === 'all' || q.status === tab);

  async function setStatus(q: Quiz, status: Quiz['status']) {
    try {
      await api(`/quizzes/${q.id}`, { method: 'PATCH', body: { status } });
      toast(status === 'published' ? 'Quiz published — trainees can take it now.' : 'Quiz moved to drafts.');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function duplicate(q: Quiz) {
    try {
      const full = await api<Quiz>(`/quizzes/${q.id}`);
      await api('/quizzes', { method: 'POST', body: { ...full, title: `${full.title} (copy)`, status: 'draft', questions: full.questions?.map(({ id: _id, ...rest }) => rest) } });
      toast('Copy created as a draft.');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function remove(q: Quiz) {
    if (!confirm(`Delete “${q.title}” and all its attempts?`)) return;
    try {
      await api(`/quizzes/${q.id}`, { method: 'DELETE' });
      toast('Quiz deleted.');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }

  return (
    <>
      <title>Quizzes</title>
      <PageHeader
        title="Quizzes & tests"
        subtitle={user.role === 'admin' ? 'All quizzes across trades.' : 'Create timed MCQ tests for your batches and see how every question performs.'}
        actions={
          <Link href="/portal/quizzes/edit/" className={buttonClass('accent', 'md')}>
            <Plus className="size-4" aria-hidden /> New quiz
          </Link>
        }
      />
      <Tabs className="mb-5" value={tab} onChange={setTab} tabs={[{ id: 'all', label: 'All', count: data?.length }, { id: 'published', label: 'Published', count: data?.filter((q) => q.status === 'published').length }, { id: 'draft', label: 'Drafts', count: data?.filter((q) => q.status === 'draft').length }]} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && list.length === 0 && <Empty title="No quizzes here yet" icon={<ListChecks className="size-6" aria-hidden />}>Create your first quiz — or paste questions in bulk from a document.</Empty>}
      <ul className="space-y-3">
        {list.map((q) => (
          <li key={q.id}>
            <Card className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-brand-950">{q.title}</h2>
                  <QuizStatusBadge status={q.status} />
                </div>
                <p className="mt-1 text-sm text-stone-600">
                  {q.questionCount} questions · {q.totalMarks} marks · {q.durationMin} min · pass {q.passPct}% · created {fmtDate(q.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span>
                  <span className="block text-lg font-bold text-brand-950">{q.attemptCount ?? 0}</span>
                  <span className="text-xs text-stone-500">attempts</span>
                </span>
                <span>
                  <span className="block text-lg font-bold text-brand-950">{q.avgPct !== null && q.avgPct !== undefined ? `${q.avgPct}%` : '—'}</span>
                  <span className="text-xs text-stone-500">average</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/portal/quizzes/insights/?id=${q.id}`} className={buttonClass('outline', 'sm')}>
                  <ChartColumn className="size-4" aria-hidden /> Insights
                </Link>
                <Link href={`/portal/quizzes/edit/?id=${q.id}`} className={buttonClass('outline', 'sm')}>
                  <Pencil className="size-4" aria-hidden /> Edit
                </Link>
                {q.status === 'published' ? (
                  <Button variant="ghost" size="sm" onClick={() => setStatus(q, 'draft')}>Unpublish</Button>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => setStatus(q, 'published')}>Publish</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => duplicate(q)} aria-label="Duplicate">
                  <Copy className="size-4" aria-hidden />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(q)} aria-label="Delete">
                  <Trash className="size-4 text-rose-600" aria-hidden />
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      {!!data?.length && (
        <p className="mt-6 flex items-center gap-2 text-xs text-stone-500">
          <Trophy className="size-4" aria-hidden /> Questions and options are shuffled per trainee when “shuffle” is on, and tab switches during a test are recorded.
        </p>
      )}
    </>
  );
}
