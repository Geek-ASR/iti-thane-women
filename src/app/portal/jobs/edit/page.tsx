'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { localDay } from '@/lib/dates';
import { useEffect, useState, type FormEvent } from 'react';
import { api, errorMessage } from '@/lib/api';
import { useApi, useToast } from '@/lib/portal';
import type { Job, JobKind } from '@/lib/types';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, cx, ErrorNote, Field, Input, Loading, PageHeader, Select, Textarea } from '@/components/portal/kit';
import { KIND_LABEL } from '@/components/portal/jobs';

export default function EditJobPage() {
  return <Guard roles={['employer', 'admin']}>{(u) => <EditJob isAdmin={u.role === 'admin'} pending={u.status !== 'active'} />}</Guard>;
}

function EditJob({ isAdmin, pending }: { isAdmin: boolean; pending: boolean }) {
  const id = useSearchParams().get('id');
  const router = useRouter();
  const toast = useToast();
  const existing = useApi<Job>(id ? `/jobs/${id}` : null, [id]);
  const [selTrades, setSelTrades] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (existing.data) setSelTrades(existing.data.trades);
  }, [existing.data]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      const body = { ...f, openings: Number(f.openings), trades: selTrades };
      const job = id ? await api<Job>(`/jobs/${id}`, { method: 'PATCH', body }) : await api<Job>('/jobs', { method: 'POST', body });
      toast(job.status === 'pending' ? 'Submitted — the placement cell will review and publish it.' : 'Opening saved and live.');
      router.replace(`/portal/jobs/view/?id=${job.id}`);
    } catch (err) {
      toast(errorMessage(err), 'error');
      setBusy(false);
    }
  }

  if (id && existing.error) return <ErrorNote message={existing.error} />;
  if (id && !existing.data) return <Loading />;
  const j = existing.data;
  const minDate = localDay();

  return (
    <div className="mx-auto max-w-3xl">
      <title>{id ? 'Edit opening' : 'Post an opening'}</title>
      <PageHeader back={{ href: isAdmin ? '/portal/jobs/' : '/portal/jobs/?mine=1', label: 'Openings' }} title={id ? 'Edit opening' : 'Post an opening'} subtitle={isAdmin ? 'Openings posted by the placement cell go live immediately.' : 'Your opening will be reviewed by the placement cell before it goes live.'} />
      {pending && <p className="mb-5 rounded-2xl bg-marigold-50 p-4 text-sm text-brand-950 ring-1 ring-marigold-200">Your employer account is awaiting verification — you can post now, and the opening will go live after approval.</p>}
      <form onSubmit={submit}>
        <Card className="space-y-5">
          <Field label="Job title" htmlFor="jt" required>
            <Input id="jt" name="title" required defaultValue={j?.title} placeholder="e.g. Apprentice — Electrician" />
          </Field>
          {isAdmin && (
            <Field label="Company" htmlFor="jc" required>
              <Input id="jc" name="company" required defaultValue={j?.company} />
            </Field>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" htmlFor="jk" required>
              <Select id="jk" name="kind" defaultValue={j?.kind ?? 'job'}>
                {(Object.keys(KIND_LABEL) as JobKind[]).map((k) => (
                  <option key={k} value={k}>
                    {KIND_LABEL[k]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Location" htmlFor="jl">
              <Input id="jl" name="location" defaultValue={j?.location} placeholder="e.g. Wagle Estate, Thane" />
            </Field>
            <Field label="Salary / stipend" htmlFor="js">
              <Input id="js" name="stipend" defaultValue={j?.stipend} placeholder="e.g. ₹12,000 per month" />
            </Field>
            <Field label="Openings" htmlFor="jo">
              <Input id="jo" name="openings" type="number" min={1} defaultValue={j?.openings ?? 1} />
            </Field>
            <Field label="Last date to apply" htmlFor="jd" required>
              <Input id="jd" name="lastDate" type="date" required min={id ? undefined : minDate} defaultValue={j?.lastDate} />
            </Field>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-brand-950">Eligible trades</legend>
            <div className="flex flex-wrap gap-2">
              {trades.map((t) => {
                const on = selTrades.includes(t.slug);
                return (
                  <label key={t.slug} className={cx('cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition', on ? 'bg-brand-900 text-white ring-brand-900' : 'bg-white text-stone-700 ring-line hover:bg-brand-50')}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => setSelTrades((s) => (on ? s.filter((x) => x !== t.slug) : [...s, t.slug]))} />
                    {(t.short ?? t.name).en}
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-stone-500">Leave all unselected to accept every trade.</p>
          </fieldset>
          <Field label="Description" htmlFor="jdesc">
            <Textarea id="jdesc" name="description" rows={5} defaultValue={j?.description} placeholder="What will the trainee do? Shift timings, training, benefits…" />
          </Field>
          <Field label="Requirements" htmlFor="jreq">
            <Textarea id="jreq" name="requirements" rows={3} defaultValue={j?.requirements} placeholder="Trade, year of passing, skills, documents to bring…" />
          </Field>
          <div className="flex justify-end gap-2 border-t border-line pt-5">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" variant="accent" busy={busy}>
              {id ? 'Save changes' : isAdmin ? 'Publish opening' : 'Submit for approval'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
