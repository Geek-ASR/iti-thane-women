'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BriefcaseBusiness, Check, Plus, Search, X } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { fmtDate, useApi, useAuth, useToast } from '@/lib/portal';
import type { ApplicationStatus, Job, JobKind, JobStatus } from '@/lib/types';
import { trades } from '@/content/trades';
import { HBarChart } from '@/components/charts';
import { Button, buttonClass, Card, CardTitle, Empty, ErrorNote, Input, JobStatusBadge, Loading, PageHeader, Select, StatCard, Tabs, tradeLabel } from '@/components/portal/kit';
import { JobCard, KindBadge, KIND_LABEL } from '@/components/portal/jobs';

type Stats = { totals: { openJobs: number; applications: number; selected: number; employers: number }; byStatus: { status: ApplicationStatus; count: number }[]; byTrade: { trade: string; applications: number; selected: number }[] };

export default function JobsPage() {
  const { user, loading } = useAuth();
  const mine = useSearchParams().get('mine') === '1';
  if (loading) return <Loading />;
  if (user?.role === 'admin') return <AdminJobs />;
  if (user?.role === 'employer' && mine) return <EmployerJobs />;
  return <Board signedIn={!!user} isStudent={user?.role === 'student'} defaultTrade={user?.role === 'student' ? user.tradeSlug ?? '' : ''} />;
}

function Board({ signedIn, isStudent, defaultTrade }: { signedIn: boolean; isStudent: boolean; defaultTrade: string }) {
  const [kind, setKind] = useState<'all' | JobKind>('all');
  const [trade, setTrade] = useState(defaultTrade);
  const [q, setQ] = useState('');
  const { data, error, loading, reload } = useApi<Job[]>(`/jobs?${trade ? `trade=${trade}&` : ''}${kind !== 'all' ? `kind=${kind}` : ''}`, [trade, kind]);
  const list = (data ?? []).filter((j) => !q.trim() || `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <>
      <title>Jobs & apprenticeships</title>
      <PageHeader
        title="Jobs & apprenticeships"
        subtitle="Verified openings for ITI (Women) Thane trainees and pass-outs."
        actions={
          isStudent ? (
            <Link href="/portal/applications/" className={buttonClass('outline', 'md')}>
              My applications
            </Link>
          ) : !signedIn ? (
            <Link href="/portal/register/?role=employer" className={buttonClass('outline', 'md')}>
              Post an opening
            </Link>
          ) : null
        }
      />
      <div className="mb-5 space-y-3">
        <Tabs value={kind} onChange={setKind} tabs={[{ id: 'all', label: 'All' }, ...(Object.keys(KIND_LABEL) as JobKind[]).map((k) => ({ id: k, label: KIND_LABEL[k] }))]} />
        <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
          <label className="relative block">
            <span className="sr-only">Search openings</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, company or location" className="pl-10" />
          </label>
          <Select value={trade} onChange={(e) => setTrade(e.target.value)} aria-label="Filter by trade">
            <option value="">All trades</option>
            {trades.map((t) => (
              <option key={t.slug} value={t.slug}>
                {(t.short ?? t.name).en}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && list.length === 0 && <Empty title="No openings match your filters" icon={<BriefcaseBusiness className="size-6" aria-hidden />}>Try another trade or type — new openings are posted regularly.</Empty>}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((j) => (
          <li key={j.id}>
            <JobCard job={j} />
          </li>
        ))}
      </ul>
    </>
  );
}

function EmployerJobs() {
  const { data, error, loading, reload } = useApi<Job[]>('/jobs?mine=1');
  return (
    <>
      <title>My openings</title>
      <PageHeader
        title="My openings"
        subtitle="Openings go live once the placement cell approves them."
        actions={
          <Link href="/portal/jobs/edit/" className={buttonClass('accent', 'md')}>
            <Plus className="size-4" aria-hidden /> Post opening
          </Link>
        }
      />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data?.length === 0 && <Empty title="You haven’t posted any openings yet" />}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data?.map((j) => (
          <li key={j.id}>
            <JobCard job={j} showStatus />
          </li>
        ))}
      </ul>
    </>
  );
}

function AdminJobs() {
  const toast = useToast();
  const initial = (useSearchParams().get('status') as JobStatus | null) ?? 'all';
  const [tab, setTab] = useState<'all' | JobStatus>(initial);
  const { data, error, loading, reload } = useApi<Job[]>('/jobs');
  const stats = useApi<Stats>('/placements/stats');
  const list = useMemo(() => (data ?? []).filter((j) => tab === 'all' || j.status === tab), [data, tab]);
  const count = (s: JobStatus) => (data ?? []).filter((j) => j.status === s).length;

  async function setStatus(j: Job, status: JobStatus) {
    try {
      await api(`/jobs/${j.id}`, { method: 'PATCH', body: { status } });
      toast(status === 'open' ? 'Opening approved and live.' : status === 'rejected' ? 'Opening rejected.' : 'Updated.');
      reload();
      stats.reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }

  return (
    <>
      <title>Placements</title>
      <PageHeader
        title="Placement cell"
        subtitle="Approve openings, track applications and selections."
        actions={
          <Link href="/portal/jobs/edit/" className={buttonClass('accent', 'md')}>
            <Plus className="size-4" aria-hidden /> Post opening
          </Link>
        }
      />
      {stats.data && (
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Live openings" value={stats.data.totals.openJobs} />
            <StatCard label="Applications" value={stats.data.totals.applications} tone="marigold" />
            <StatCard label="Selected" value={stats.data.totals.selected} tone="green" />
            <StatCard label="Verified employers" value={stats.data.totals.employers} tone="rose" />
          </div>
          <Card>
            <CardTitle>Applications by trade</CardTitle>
            <HBarChart data={stats.data.byTrade.map((t) => ({ label: tradeLabel(t.trade, trades), value: t.applications, detail: `${t.selected} selected` }))} caption="Applications by trade" headers={['Trade', 'Applications']} />
          </Card>
        </div>
      )}
      <Tabs className="mb-5" value={tab} onChange={setTab} tabs={[{ id: 'all', label: 'All', count: data?.length }, { id: 'pending', label: 'Awaiting approval', count: count('pending') }, { id: 'open', label: 'Live', count: count('open') }, { id: 'closed', label: 'Closed', count: count('closed') }, { id: 'rejected', label: 'Rejected', count: count('rejected') }]} />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && list.length === 0 && <Empty title="Nothing here" />}
      <ul className="space-y-3">
        {list.map((j) => (
          <li key={j.id}>
            <Card className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <KindBadge kind={j.kind} />
                  <JobStatusBadge status={j.status} />
                </div>
                <Link href={`/portal/jobs/view/?id=${j.id}`} className="mt-2 block font-bold text-brand-950 hover:underline">
                  {j.title}
                </Link>
                <p className="text-sm text-stone-600">
                  {j.company} · {j.location} · apply by {fmtDate(j.lastDate)} · {j.applicationCount ?? 0} applied
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {j.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => setStatus(j, 'open')}>
                      <Check className="size-4" aria-hidden /> Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(j, 'rejected')}>
                      <X className="size-4" aria-hidden /> Reject
                    </Button>
                  </>
                )}
                {j.status === 'open' && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(j, 'closed')}>
                    Close
                  </Button>
                )}
                {(j.status === 'closed' || j.status === 'rejected') && (
                  <Button size="sm" variant="ghost" onClick={() => setStatus(j, 'open')}>
                    Reopen
                  </Button>
                )}
                <Link href={`/portal/jobs/applicants/?id=${j.id}`} className={buttonClass('outline', 'sm')}>
                  Applicants
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
