'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Flag, ListChecks, ShieldAlert, Target } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { useApi, useToast } from '@/lib/portal';
import type { AttemptResult, AttemptStart, Quiz } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, cx, ErrorNote, Loading, Modal } from '@/components/portal/kit';

export default function TakeQuizPage() {
  return <Guard roles={['student']}>{() => <Take />}</Guard>;
}

function Take() {
  const id = useSearchParams().get('id') ?? '';
  const meta = useApi<Quiz>(id ? `/quizzes/${id}` : null, [id]);
  const [run, setRun] = useState<AttemptStart | null>(null);
  const [starting, setStarting] = useState(false);
  const [err, setErr] = useState('');

  async function start() {
    setStarting(true);
    setErr('');
    try {
      setRun(await api<AttemptStart>(`/quizzes/${id}/attempts`, { method: 'POST' }));
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setStarting(false);
    }
  }

  if (meta.error) return <ErrorNote message={meta.error} />;
  if (!meta.data) return <Loading />;
  if (run) return <Player run={run} />;
  const q = meta.data;
  const used = (q.myAttempts ?? []).filter((a) => a.submittedAt).length;
  return (
    <div className="mx-auto max-w-xl">
      <title>{q.title}</title>
      <Card className="overflow-hidden" padded={false}>
        <div className="bg-brand-900 p-6 text-white">
          <p className="text-xs font-bold tracking-wider text-marigold-300 uppercase">Quiz</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">{q.title}</h1>
          {q.description && <p className="mt-2 text-white/75">{q.description}</p>}
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              [ListChecks, `${q.questionCount}`, 'questions'],
              [Clock, `${q.durationMin} min`, 'time limit'],
              [Target, `${q.passPct}%`, 'to pass'],
            ].map(([Icon, v, l]) => {
              const I = Icon as typeof Clock;
              return (
                <div key={String(l)} className="rounded-2xl bg-paper p-3 ring-1 ring-line">
                  <I className="mx-auto size-5 text-brand-600" aria-hidden />
                  <dd className="mt-1 text-lg font-bold text-brand-950">{String(v)}</dd>
                  <dt className="text-xs text-stone-500">{String(l)}</dt>
                </div>
              );
            })}
          </dl>
          <ul className="mt-6 space-y-2 text-sm text-stone-700">
            <li>• The timer starts when you press Start and the quiz submits itself when time runs out.</li>
            <li>• Your answers are saved as you go — you can change them until you submit.</li>
            <li>• Switching apps or tabs during the quiz is recorded and shared with your instructor.</li>
            <li>• Attempts used: {used} of {q.attemptsAllowed}.</li>
          </ul>
          {err && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{err}</p>}
          <Button variant="accent" size="lg" className="mt-6 w-full" busy={starting} onClick={start} disabled={used >= q.attemptsAllowed}>
            {used >= q.attemptsAllowed ? 'No attempts left' : 'Start quiz'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Player({ run }: { run: AttemptStart }) {
  const router = useRouter();
  const toast = useToast();
  const { attempt, quiz, questions } = run;
  const [answers, setAnswers] = useState<Record<string, number>>(attempt.answers ?? {});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [i, setI] = useState(0);
  const [switches, setSwitches] = useState(attempt.tabSwitches ?? 0);
  const [left, setLeft] = useState(() => new Date(attempt.deadline).getTime() - Date.now());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const q = questions[i];
  const answered = Object.keys(answers).length;

  const submit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      try {
        const res = await api<AttemptResult>(`/attempts/${attempt.id}/submit`, { method: 'POST', body: { answers, tabSwitches: switches } });
        if (auto) toast('Time is up — your quiz was submitted.', 'info');
        router.replace(`/portal/quizzes/result/?attempt=${res.attempt.id}`);
      } catch (e) {
        submittedRef.current = false;
        setSubmitting(false);
        toast(errorMessage(e), 'error');
      }
    },
    [answers, switches, attempt.id, router, toast],
  );

  // Timer + auto-submit
  useEffect(() => {
    const t = setInterval(() => {
      const ms = new Date(attempt.deadline).getTime() - Date.now();
      setLeft(ms);
      if (ms <= 0) submit(true);
    }, 500);
    return () => clearInterval(t);
  }, [attempt.deadline, submit]);

  // Tab-switch detection
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        setSwitches((n) => n + 1);
        toast('You left the quiz screen — this has been recorded.', 'error');
      }
    };
    document.addEventListener('visibilitychange', onVis);
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!submittedRef.current) e.preventDefault();
    };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [toast]);

  // Autosave (debounced)
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (!submittedRef.current) api(`/attempts/${attempt.id}`, { method: 'PATCH', body: { answers, tabSwitches: switches } }).catch(() => {});
    }, 700);
  }, [answers, switches, attempt.id]);

  const mm = Math.max(0, Math.floor(left / 60000));
  const ss = Math.max(0, Math.floor((left % 60000) / 1000));
  const low = left < 60_000;

  return (
    <div className="mx-auto max-w-3xl">
      <title>{`${quiz.title} — in progress`}</title>
      <div className="sticky top-14 z-20 -mx-4 mb-5 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:top-0 lg:mx-0 lg:rounded-2xl lg:border lg:bg-white">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-950">{quiz.title}</p>
            <p className="text-xs text-stone-500">
              {answered}/{questions.length} answered{switches ? ` · ${switches} tab switch${switches > 1 ? 'es' : ''}` : ''}
            </p>
          </div>
          <p className={cx('flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-base font-bold tabular-nums', low ? 'animate-pulse bg-rose-600 text-white' : 'bg-brand-900 text-white')} role="timer" aria-label={`${mm} minutes ${ss} seconds left`}>
            <Clock className="size-4" aria-hidden />
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </p>
          <Button variant="accent" size="sm" onClick={() => setConfirmOpen(true)} busy={submitting}>
            Submit
          </Button>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-brand-600">
            Question {i + 1} of {questions.length} · {q.marks} mark{q.marks > 1 ? 's' : ''}
          </p>
          <button type="button" onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))} aria-pressed={!!flags[q.id]} className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1', flags[q.id] ? 'bg-marigold-100 text-marigold-800 ring-marigold-300' : 'text-stone-600 ring-line')}>
            <Flag className="size-3.5" aria-hidden /> {flags[q.id] ? 'Marked for review' : 'Mark for review'}
          </button>
        </div>
        <h1 className="mt-3 text-xl leading-snug font-semibold text-brand-950 sm:text-2xl">{q.text}</h1>
        <fieldset className="mt-6">
          <legend className="sr-only">Choose one answer</legend>
          <ul className="space-y-2.5">
            {q.options.map((opt, k) => {
              const chosen = answers[q.id] === k;
              return (
                <li key={k}>
                  <label className={cx('flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl p-4 ring-1 transition', chosen ? 'bg-brand-50 ring-2 ring-brand-500' : 'bg-white ring-line hover:bg-stone-50')}>
                    <input type="radio" name={q.id} checked={chosen} onChange={() => setAnswers((a) => ({ ...a, [q.id]: k }))} className="peer sr-only" />
                    <span aria-hidden className={cx('grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold peer-focus-visible:ring-4 peer-focus-visible:ring-marigold-300', chosen ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-600')}>
                      {String.fromCharCode(65 + k)}
                    </span>
                    <span className="text-[1.02rem] text-brand-950">{opt}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </Button>
          {i < questions.length - 1 ? (
            <Button onClick={() => setI((x) => Math.min(questions.length - 1, x + 1))}>
              Next <ChevronRight className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button variant="accent" onClick={() => setConfirmOpen(true)}>
              Review & submit
            </Button>
          )}
        </div>
      </Card>

      <Card className="mt-5">
        <p className="mb-3 text-sm font-semibold text-brand-950">Jump to question</p>
        <ol className="grid grid-cols-6 gap-2 sm:grid-cols-10">
          {questions.map((qq, k) => (
            <li key={qq.id}>
              <button type="button" onClick={() => setI(k)} aria-label={`Question ${k + 1}${answers[qq.id] !== undefined ? ', answered' : ''}${flags[qq.id] ? ', marked for review' : ''}`} aria-current={k === i ? 'step' : undefined} className={cx('relative grid h-11 w-full place-items-center rounded-xl text-sm font-bold ring-1', k === i ? 'ring-2 ring-brand-600' : 'ring-line', answers[qq.id] !== undefined ? 'bg-brand-700 text-white' : 'bg-white text-stone-600')}>
                {k + 1}
                {flags[qq.id] && <span aria-hidden className="absolute -top-1 -right-1 size-3 rounded-full bg-marigold-400 ring-2 ring-white" />}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-brand-700" aria-hidden /> Answered</span>
          <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-marigold-400" aria-hidden /> For review</span>
        </p>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Submit quiz?"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Keep working</Button>
            <Button variant="accent" busy={submitting} onClick={() => submit(false)}>Submit now</Button>
          </>
        }
      >
        <p className="text-stone-700">
          You have answered <span className="font-bold">{answered}</span> of {questions.length} questions.
        </p>
        {answered < questions.length && <p className="mt-2 flex items-center gap-2 text-sm font-medium text-amber-800"><ShieldAlert className="size-4" aria-hidden /> {questions.length - answered} unanswered questions will score zero.</p>}
        {Object.values(flags).some(Boolean) && <p className="mt-2 text-sm text-stone-600">You marked {Object.values(flags).filter(Boolean).length} question(s) for review.</p>}
      </Modal>
    </div>
  );
}
