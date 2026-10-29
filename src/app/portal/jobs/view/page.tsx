'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CalendarClock, CircleCheck, IndianRupee, MapPin, Pencil, Users } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { fmtDate, useApi, useAuth, useToast } from '@/lib/portal';
import type { Job } from '@/lib/types';
import { trades } from '@/content/trades';
import { ApplicationBadge, Button, buttonClass, Card, ErrorNote, Field, JobStatusBadge, Loading, PageHeader, Textarea, tradeLabel } from '@/components/portal/kit';
import { daysLeft, KindBadge } from '@/components/portal/jobs';

export default function JobViewPage() {
  const id = useSearchParams().get('id') ?? '';
  const { user } = useAuth();
  const toast = useToast();
  const { data: job, error, loading, reload } = useApi<Job>(id ? `/jobs/${id}` : null, [id, user?.id]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function apply() {
    setBusy(true);
    try {
      await api(`/jobs/${id}/apply`, { method: 'POST', body: { coverNote: note } });
      toast('Application sent! Track it under My applications.');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  }
  async function withdraw() {
    if (!job?.myApplication || !confirm('Withdraw your application?')) return;
    try {
      await api(`/applications/${job.myApplication.id}/withdraw`, { method: 'POST' });
      toast('Application withdrawn.', 'info');
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }

  if (error) return <ErrorNote message={error} />;
  if (loading && !job) return <Loading />;
  if (!job) return null;
  const owner = user && (user.role === 'admin' || job.postedBy === user.id);
  const eligible = !job.trades.length || job.trades.includes(user?.tradeSlug ?? '');
  const dl = daysLeft(job.lastDate);

  return (
    <>
      <title>{job.title}</title>
      <PageHeader back={{ href: '/portal/jobs/', label: 'All openings' }} title={job.title} subtitle={job.company} />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <KindBadge kind={job.kind} />
              {owner && <JobStatusBadge status={job.status} />}
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                [MapPin, 'Location', job.location || 'Thane'],
                [IndianRupee, job.kind === 'apprenticeship' || job.kind === 'internship' ? 'Stipend' : 'Salary', job.stipend || 'As per norms'],
                [Users, 'Openings', String(job.openings)],
                [CalendarClock, 'Apply by', `${fmtDate(job.lastDate)}${dl >= 0 ? ` (${dl === 0 ? 'today' : `${dl} days left`})` : ' (closed)'}`],
              ].map(([Icon, k, v]) => {
                const I = Icon as typeof MapPin;
                return (
                  <div key={String(k)} className="flex gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <I className="size-5" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs text-stone-500">{String(k)}</dt>
                      <dd className="font-semibold text-brand-950">{String(v)}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
            <div className="mt-5">
              <p className="text-xs font-semibold text-stone-500">For trades</p>
              <p className="mt-1.5 flex flex-wrap gap-1.5">
                {job.trades.length ? job.trades.map((t) => <span key={t} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">{tradeLabel(t, trades)}</span>) : <span className="text-sm text-stone-600">All trades</span>}
              </p>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-brand-950">About the role</h2>
            <p className="mt-2 whitespace-pre-line text-stone-700">{job.description || '—'}</p>
            {job.requirements && (
              <>
                <h2 className="mt-6 font-bold text-brand-950">Requirements</h2>
                <p className="mt-2 whitespace-pre-line text-stone-700">{job.requirements}</p>
              </>
            )}
          </Card>
        </div>
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            {owner ? (
              <div className="space-y-3">
                <p className="font-semibold text-brand-950">{job.applicationCount ?? 0} applicants</p>
                <Link href={`/portal/jobs/applicants/?id=${job.id}`} className={buttonClass('primary', 'md', 'w-full')}>
                  Review applicants
                </Link>
                <Link href={`/portal/jobs/edit/?id=${job.id}`} className={buttonClass('outline', 'md', 'w-full')}>
                  <Pencil className="size-4" aria-hidden /> Edit opening
                </Link>
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="font-semibold text-brand-950">Interested?</p>
                <p className="mt-1 text-sm text-stone-600">Sign in with your trainee account to apply in one tap.</p>
                <Link href={`/portal/login/?next=${encodeURIComponent(`/portal/jobs/view/?id=${job.id}`)}`} className={buttonClass('accent', 'lg', 'mt-4 w-full')}>
                  Sign in to apply
                </Link>
              </div>
            ) : user.role !== 'student' ? (
              <p className="text-sm text-stone-600">Only trainee accounts can apply to openings.</p>
            ) : job.myApplication && job.myApplication.status !== 'withdrawn' ? (
              <div className="text-center">
                <CircleCheck className="mx-auto size-10 text-emerald-600" aria-hidden />
                <p className="mt-2 font-semibold text-brand-950">You have applied</p>
                <div className="mt-2">
                  <ApplicationBadge status={job.myApplication.status} />
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Link href="/portal/applications/" className={buttonClass('primary', 'md', 'w-full')}>
                    Track application
                  </Link>
                  {job.myApplication.status === 'applied' && (
                    <Button variant="ghost" size="sm" onClick={withdraw}>
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ) : !eligible ? (
              <p className="text-sm text-stone-600">This opening is for other trades. Browse openings for your trade instead.</p>
            ) : dl < 0 ? (
              <p className="text-sm text-stone-600">Applications for this opening have closed.</p>
            ) : (
              <div className="space-y-4">
                <p className="font-semibold text-brand-950">Apply with your Smart Campus profile</p>
                <Field label="Short note to the employer" htmlFor="cn" hint="Optional — why you are a good fit">
                  <Textarea id="cn" rows={4} value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
                </Field>
                <Button variant="accent" size="lg" className="w-full" busy={busy} onClick={apply}>
                  Apply now
                </Button>
                <Link href="/portal/profile/" className="block text-center text-sm font-semibold text-brand-700 hover:underline">
                  Update my profile & resume
                </Link>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
