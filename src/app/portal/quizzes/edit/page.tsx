'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, ClipboardPaste, Copy, Plus, Trash } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { useApi, useToast } from '@/lib/portal';
import type { Batch, Question, Quiz } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, CardTitle, cx, ErrorNote, Field, Input, Loading, Modal, PageHeader, Select, Textarea, Toggle } from '@/components/portal/kit';

type Draft = Omit<Quiz, 'id' | 'createdBy' | 'createdAt' | 'questionCount' | 'totalMarks'> & { questions: Question[] };
const blankQ = (): Question => ({ id: `new-${Math.random().toString(36).slice(2, 9)}`, text: '', options: ['', '', '', ''], correct: 0, explanation: '', marks: 1 });
const blank: Draft = { title: '', description: '', tradeSlug: null, batchId: null, durationMin: 10, passPct: 60, shuffle: true, showAnswers: true, attemptsAllowed: 1, status: 'draft', questions: [blankQ()] };

/** Parses “Q: … / A) … / B) … *” blocks; the option ending with * is correct. */
function parseBulk(text: string): Question[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length >= 3)
    .map((lines) => {
      const qLine = lines[0].replace(/^(Q(uestion)?\s*\d*[:.)]\s*|\d+[.)]\s*)/i, '');
      let explanation = '';
      const opts: string[] = [];
      let correct = 0;
      lines.slice(1).forEach((l) => {
        if (/^(ans(wer)?|explanation|exp)\s*[:-]/i.test(l)) {
          explanation = l.replace(/^[^:-]+[:-]\s*/, '');
          return;
        }
        const clean = l.replace(/^[A-Fa-f][).:-]\s*/, '');
        const isCorrect = /\*\s*$/.test(clean);
        if (isCorrect) correct = opts.length;
        opts.push(clean.replace(/\s*\*\s*$/, ''));
      });
      return { ...blankQ(), text: qLine, options: opts.slice(0, 6), correct: Math.min(correct, opts.length - 1), explanation };
    })
    .filter((q) => q.text && q.options.length >= 2);
}

export default function EditQuizPage() {
  return <Guard roles={['instructor', 'admin']}>{() => <Editor />}</Guard>;
}

function Editor() {
  const id = useSearchParams().get('id');
  const router = useRouter();
  const toast = useToast();
  const batches = useApi<Batch[]>('/batches');
  const existing = useApi<Quiz>(id ? `/quizzes/${id}` : null, [id]);
  const [d, setD] = useState<Draft>(blank);
  const [busy, setBusy] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulk, setBulk] = useState('');

  useEffect(() => {
    if (existing.data) setD({ ...blank, ...existing.data, questions: existing.data.questions?.length ? existing.data.questions : [blankQ()] });
  }, [existing.data]);
  useEffect(() => {
    if (!id && batches.data?.length && !d.batchId) setD((x) => ({ ...x, batchId: batches.data![0].id }));
  }, [batches.data, id, d.batchId]);

  const setQ = (i: number, patch: Partial<Question>) => setD((x) => ({ ...x, questions: x.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) }));
  const move = (i: number, dir: -1 | 1) =>
    setD((x) => {
      const qs = [...x.questions];
      const j = i + dir;
      if (j < 0 || j >= qs.length) return x;
      [qs[i], qs[j]] = [qs[j], qs[i]];
      return { ...x, questions: qs };
    });

  async function save(status: Draft['status']) {
    setBusy(true);
    try {
      const body = { ...d, status, questions: d.questions.map((q) => ({ ...q, id: q.id.startsWith('new-') ? undefined : q.id, options: q.options.filter((o) => o.trim()) })) };
      const res = id ? await api<Quiz>(`/quizzes/${id}`, { method: 'PATCH', body }) : await api<Quiz>('/quizzes', { method: 'POST', body });
      toast(status === 'published' ? 'Quiz published.' : 'Draft saved.');
      router.replace(status === 'published' ? '/portal/quizzes/' : `/portal/quizzes/edit/?id=${res.id}`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  }

  if (id && existing.error) return <ErrorNote message={existing.error} />;
  if ((id && !existing.data) || batches.loading) return <Loading />;
  const totalMarks = d.questions.reduce((s, q) => s + (Number(q.marks) || 1), 0);

  return (
    <div className="pb-24">
      <title>{id ? 'Edit quiz' : 'New quiz'}</title>
      <PageHeader back={{ href: '/portal/quizzes/', label: 'Quizzes' }} title={id ? 'Edit quiz' : 'New quiz'} subtitle={`${d.questions.length} questions · ${totalMarks} marks`} actions={<Button variant="outline" onClick={() => setBulkOpen(true)}><ClipboardPaste className="size-4" aria-hidden /> Paste questions</Button>} />
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <CardTitle>Settings</CardTitle>
          <Field label="Title" htmlFor="qt" required>
            <Input id="qt" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. Electrical Safety — Unit 1" />
          </Field>
          <Field label="Instructions / description" htmlFor="qd">
            <Textarea id="qd" rows={3} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
          </Field>
          <Field label="Batch" htmlFor="qb">
            <Select id="qb" value={d.batchId ?? ''} onChange={(e) => setD({ ...d, batchId: e.target.value || null })}>
              {batches.data?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Minutes" htmlFor="qm">
              <Input id="qm" type="number" min={1} max={180} value={d.durationMin} onChange={(e) => setD({ ...d, durationMin: Number(e.target.value) })} />
            </Field>
            <Field label="Pass %" htmlFor="qp">
              <Input id="qp" type="number" min={0} max={100} value={d.passPct} onChange={(e) => setD({ ...d, passPct: Number(e.target.value) })} />
            </Field>
            <Field label="Attempts" htmlFor="qa">
              <Input id="qa" type="number" min={1} max={10} value={d.attemptsAllowed} onChange={(e) => setD({ ...d, attemptsAllowed: Number(e.target.value) })} />
            </Field>
          </div>
          <Toggle checked={d.shuffle} onChange={(v) => setD({ ...d, shuffle: v })} label="Shuffle questions & options" hint="Each trainee sees a different order." />
          <Toggle checked={d.showAnswers} onChange={(v) => setD({ ...d, showAnswers: v })} label="Show answers after submission" hint="Trainees can review correct answers and explanations." />
        </Card>

        <div className="space-y-4">
          {d.questions.map((q, i) => (
            <Card key={q.id}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-brand-600">Question {i + 1}</p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp className="size-4" aria-hidden /></Button>
                  <Button variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === d.questions.length - 1} aria-label="Move down"><ArrowDown className="size-4" aria-hidden /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setD((x) => ({ ...x, questions: [...x.questions.slice(0, i + 1), { ...q, id: blankQ().id }, ...x.questions.slice(i + 1)] }))} aria-label="Duplicate"><Copy className="size-4" aria-hidden /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setD((x) => ({ ...x, questions: x.questions.filter((_, k) => k !== i) }))} disabled={d.questions.length === 1} aria-label="Delete question"><Trash className="size-4 text-rose-600" aria-hidden /></Button>
                </div>
              </div>
              <Textarea rows={2} value={q.text} onChange={(e) => setQ(i, { text: e.target.value })} placeholder="Type the question" aria-label={`Question ${i + 1} text`} />
              <fieldset className="mt-3">
                <legend className="mb-2 text-xs font-semibold text-stone-500">Options — select the correct one</legend>
                <ul className="space-y-2">
                  {q.options.map((o, k) => (
                    <li key={k} className="flex items-center gap-2">
                      <label className={cx('grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl text-sm font-bold ring-1', q.correct === k ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white text-stone-600 ring-line')}>
                        <input type="radio" name={`c-${q.id}`} checked={q.correct === k} onChange={() => setQ(i, { correct: k })} className="sr-only" aria-label={`Option ${String.fromCharCode(65 + k)} is correct`} />
                        {String.fromCharCode(65 + k)}
                      </label>
                      <Input value={o} onChange={(e) => setQ(i, { options: q.options.map((x, m) => (m === k ? e.target.value : x)) })} placeholder={`Option ${String.fromCharCode(65 + k)}`} aria-label={`Option ${String.fromCharCode(65 + k)}`} />
                      {q.options.length > 2 && (
                        <Button variant="ghost" size="sm" onClick={() => setQ(i, { options: q.options.filter((_, m) => m !== k), correct: q.correct! > k ? q.correct! - 1 : q.correct === k ? 0 : q.correct })} aria-label="Remove option">
                          <Trash className="size-4" aria-hidden />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {q.options.length < 6 && (
                  <button type="button" onClick={() => setQ(i, { options: [...q.options, ''] })} className="mt-2 text-sm font-semibold text-brand-700 hover:underline">
                    + Add option
                  </button>
                )}
              </fieldset>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_7rem]">
                <Input value={q.explanation ?? ''} onChange={(e) => setQ(i, { explanation: e.target.value })} placeholder="Explanation shown after submission (optional)" aria-label="Explanation" />
                <Input type="number" min={1} max={10} value={q.marks} onChange={(e) => setQ(i, { marks: Number(e.target.value) })} aria-label="Marks" />
              </div>
            </Card>
          ))}
          <Button variant="outline" className="w-full" onClick={() => setD((x) => ({ ...x, questions: [...x.questions, blankQ()] }))}>
            <Plus className="size-4" aria-hidden /> Add question
          </Button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-72">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2">
          <Button variant="outline" busy={busy} onClick={() => save('draft')}>Save draft</Button>
          <Button variant="accent" busy={busy} onClick={() => save('published')}>Publish</Button>
        </div>
      </div>

      <Modal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Paste questions"
        wide
        footer={
          <>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                const parsed = parseBulk(bulk);
                if (!parsed.length) return toast('No questions found — check the format.', 'error');
                setD((x) => ({ ...x, questions: [...x.questions.filter((q) => q.text.trim()), ...parsed] }));
                setBulk('');
                setBulkOpen(false);
                toast(`${parsed.length} questions added.`);
              }}
            >
              Add questions
            </Button>
          </>
        }
      >
        <p className="text-sm text-stone-600">Separate questions with a blank line. Put a <span className="font-mono font-bold">*</span> after the correct option. An optional “Explanation:” line is shown after submission.</p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-paper p-3 text-xs text-stone-700 ring-1 ring-line">{`Q: Which instrument measures current?
A) Voltmeter
B) Ammeter *
C) Ohmmeter
D) Wattmeter
Explanation: An ammeter is connected in series.`}</pre>
        <Textarea className="mt-3 font-mono text-sm" rows={10} value={bulk} onChange={(e) => setBulk(e.target.value)} aria-label="Questions to import" placeholder="Paste your questions here" />
        {bulk && <p className="mt-2 text-xs font-semibold text-brand-700">{parseBulk(bulk).length} question(s) detected</p>}
      </Modal>
    </div>
  );
}
