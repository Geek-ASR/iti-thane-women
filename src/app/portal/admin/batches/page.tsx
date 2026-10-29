'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash, UsersRound } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { useApi, useToast } from '@/lib/portal';
import type { Batch, User } from '@/lib/types';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, Empty, ErrorNote, Field, Input, Loading, Modal, PageHeader, Select, tradeLabel } from '@/components/portal/kit';

export default function BatchesPage() {
  return <Guard roles={['admin']}>{() => <Batches />}</Guard>;
}

function Batches() {
  const toast = useToast();
  const batches = useApi<Batch[]>('/batches');
  const staff = useApi<User[]>('/users?role=instructor');
  const [edit, setEdit] = useState<Partial<Batch> | null>(null);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = { ...f, year: Number(f.year), instructorId: f.instructorId || null };
    try {
      if (edit?.id) await api(`/batches/${edit.id}`, { method: 'PATCH', body });
      else await api('/batches', { method: 'POST', body });
      toast('Batch saved.');
      setEdit(null);
      batches.reload();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  }
  async function remove(b: Batch) {
    if (!confirm(`Delete ${b.name}?`)) return;
    try {
      await api(`/batches/${b.id}`, { method: 'DELETE' });
      toast('Batch deleted.');
      batches.reload();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  }
  const instructorName = (id: string | null) => staff.data?.find((s) => s.id === id)?.name ?? 'Unassigned';

  return (
    <>
      <title>Batches</title>
      <PageHeader title="Batches" subtitle="Each batch (unit) links a trade, a session and its craft instructor." actions={<Button variant="accent" onClick={() => setEdit({ year: 1 })}><Plus className="size-4" aria-hidden /> New batch</Button>} />
      {batches.error && <ErrorNote message={batches.error} onRetry={batches.reload} />}
      {batches.loading && !batches.data && <Loading />}
      {batches.data?.length === 0 && <Empty title="No batches yet">Create a batch for each unit of each trade.</Empty>}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {batches.data?.map((b) => (
          <li key={b.id}>
            <Card className="flex h-full flex-col">
              <p className="text-xs font-bold tracking-wider text-brand-600 uppercase">{tradeLabel(b.tradeSlug, trades)}</p>
              <h2 className="mt-1 font-bold text-brand-950">{b.name}</h2>
              <p className="mt-1 text-sm text-stone-600">
                Session {b.session} · Year {b.year}
              </p>
              <p className="mt-1 text-sm text-stone-600">Instructor: {instructorName(b.instructorId)}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <Link href={`/portal/admin/users/`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
                  <UsersRound className="size-4" aria-hidden /> {b.studentCount ?? 0} trainees
                </Link>
                <span className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEdit(b)} aria-label="Edit">
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(b)} aria-label="Delete">
                    <Trash className="size-4 text-rose-600" aria-hidden />
                  </Button>
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit batch' : 'New batch'}>
        {edit && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Batch name" htmlFor="bn" required hint="e.g. Electrician · 2026–28 · Unit 2">
              <Input id="bn" name="name" required defaultValue={edit.name} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trade" htmlFor="bt" required>
                <Select id="bt" name="tradeSlug" defaultValue={edit.tradeSlug ?? trades[0].slug}>
                  {trades.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {(t.short ?? t.name).en}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Instructor" htmlFor="bi">
                <Select id="bi" name="instructorId" defaultValue={edit.instructorId ?? ''}>
                  <option value="">Unassigned</option>
                  {staff.data?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Session" htmlFor="bs">
                <Input id="bs" name="session" defaultValue={edit.session} placeholder="2026–27" />
              </Field>
              <Field label="Year" htmlFor="by">
                <Select id="by" name="year" defaultValue={String(edit.year ?? 1)}>
                  <option value="1">1st year</option>
                  <option value="2">2nd year</option>
                </Select>
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
              <Button type="submit">Save batch</Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
