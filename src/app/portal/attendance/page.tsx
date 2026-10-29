'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { CalendarCheck, ChartColumn, MapPin, QrCode, ScanLine } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { fmtDate, fmtTime, useApi, useToast } from '@/lib/portal';
import type { AttendanceSession, Batch, MyAttendance, User } from '@/lib/types';
import { ColumnChart, Meter } from '@/components/charts';
import { Guard } from '@/components/portal/Guard';
import { AttendanceBadge, Button, buttonClass, Card, CardTitle, cx, Empty, ErrorNote, Field, Input, Loading, PageHeader, Select, StatCard, Toggle } from '@/components/portal/kit';

export default function AttendancePage() {
  return <Guard roles={['student', 'instructor', 'admin']}>{(user) => (user.role === 'student' ? <StudentAttendance /> : <StaffAttendance user={user} />)}</Guard>;
}

function StudentAttendance() {
  const { data, error, loading, reload } = useApi<MyAttendance>('/attendance/me');
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  return (
    <>
      <title>My attendance</title>
      <PageHeader
        title="My attendance"
        subtitle="80% attendance is required to appear for the final trade test."
        actions={
          <Link href="/portal/attendance/scan/" className={buttonClass('accent', 'md')}>
            <ScanLine className="size-4" aria-hidden /> Mark attendance
          </Link>
        }
      />
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <Card>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-stone-600">Overall attendance</p>
                  <p className="text-5xl font-bold tracking-tight text-brand-950">{data.overall.total ? `${data.overall.pct}%` : '—'}</p>
                </div>
                <p className={cx('rounded-full px-3 py-1.5 text-xs font-bold', data.overall.pct >= 80 ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200')}>
                  {data.overall.pct >= 80 ? '✓ Eligible (80%+)' : `⚠ Needs ${Math.max(0, Math.ceil((0.8 * data.overall.total - (data.overall.present + data.overall.late)) / 0.2))} more sessions present`}
                </p>
              </div>
              <div className="mt-4">
                <Meter value={data.overall.pct} label="Attendance against the 80% requirement" />
              </div>
              <dl className="mt-5 grid grid-cols-4 gap-2 text-center">
                {(
                  [
                    ['Present', data.overall.present, 'text-emerald-700'],
                    ['Late', data.overall.late, 'text-amber-700'],
                    ['Absent', data.overall.absent, 'text-rose-700'],
                    ['Leave', data.overall.leave, 'text-stone-600'],
                  ] as const
                ).map(([k, v, c]) => (
                  <div key={k} className="rounded-2xl bg-paper p-3 ring-1 ring-line">
                    <dd className={cx('text-xl font-bold', c)}>{v}</dd>
                    <dt className="text-[0.7rem] font-medium text-stone-500">{k}</dt>
                  </div>
                ))}
              </dl>
            </Card>
            <Card>
              <CardTitle>By month</CardTitle>
              <ColumnChart data={data.months.map((m) => ({ label: new Date(`${m.month}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'short' }), value: m.pct, detail: `${m.present} of ${m.total} sessions` }))} labelIdx={[data.months.length - 1]} format={(v) => `${Math.round(v)}%`} caption="Attendance by month" headers={['Month', 'Attendance']} height={150} />
            </Card>
          </div>
          <Card>
            <CardTitle
              action={
                <div className="flex gap-1 rounded-full bg-stone-100 p-1 text-xs font-semibold">
                  {(['all', 'missed'] as const).map((f) => (
                    <button key={f} type="button" onClick={() => setFilter(f)} className={cx('rounded-full px-3 py-1', filter === f ? 'bg-white text-brand-900 shadow-soft' : 'text-stone-600')} aria-pressed={filter === f}>
                      {f === 'all' ? 'All' : 'Missed'}
                    </button>
                  ))}
                </div>
              }
            >
              Session history
            </CardTitle>
            <ul className="divide-y divide-line">
              {data.recent
                .filter((r) => filter === 'all' || r.status === 'absent' || r.status === null)
                .map((r) => (
                  <li key={r.session.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-brand-950">{r.session.topic}</span>
                      <span className="block text-xs text-stone-500">{fmtDate(r.session.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    </span>
                    <AttendanceBadge status={r.status} />
                  </li>
                ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}

const DURATIONS = [10, 15, 20, 30, 45, 60];

function StaffAttendance({ user }: { user: User }) {
  const router = useRouter();
  const toast = useToast();
  const batches = useApi<Batch[]>('/batches');
  const [batchFilter, setBatchFilter] = useState('');
  const sessions = useApi<AttendanceSession[]>(`/attendance/sessions?limit=40${batchFilter ? `&batchId=${batchFilter}` : ''}`, [batchFilter]);
  const [geofence, setGeofence] = useState(true);
  const [busy, setBusy] = useState(false);
  const batchName = (id: string) => batches.data?.find((b) => b.id === id)?.name ?? '';

  async function start(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      const s = await api<AttendanceSession>('/attendance/sessions', { method: 'POST', body: { batchId: f.batchId, topic: f.topic, durationMin: Number(f.durationMin), geofence } });
      router.push(`/portal/attendance/live/?id=${s.id}`);
    } catch (err) {
      toast(errorMessage(err), 'error');
      setBusy(false);
    }
  }

  return (
    <>
      <title>Attendance</title>
      <PageHeader
        title="Smart attendance"
        subtitle="Start a session — trainees scan the rotating QR code or type the 6-digit code."
        actions={
          <Link href="/portal/attendance/reports/" className={buttonClass('outline', 'md')}>
            <ChartColumn className="size-4" aria-hidden /> Reports
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card className="lg:sticky lg:top-6 lg:self-start">
          <CardTitle>Start a session</CardTitle>
          {batches.loading && !batches.data ? (
            <Loading />
          ) : !batches.data?.length ? (
            <p className="text-sm text-stone-600">{user.role === 'admin' ? 'Create a batch first under Batches.' : 'No batches are assigned to you yet. Ask the office to assign your batch.'}</p>
          ) : (
            <form onSubmit={start} className="space-y-4">
              <Field label="Batch" htmlFor="batch">
                <Select id="batch" name="batchId" required defaultValue={batches.data[0]?.id}>
                  {batches.data.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.studentCount})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Topic / practical" htmlFor="topic">
                <Input id="topic" name="topic" required placeholder="e.g. Motor starters — practical" />
              </Field>
              <Field label="Code stays open for" htmlFor="dur">
                <Select id="dur" name="durationMin" defaultValue="15">
                  {DURATIONS.map((m) => (
                    <option key={m} value={m}>
                      {m} minutes
                    </option>
                  ))}
                </Select>
              </Field>
              <Toggle checked={geofence} onChange={setGeofence} label="Campus location check" hint="Flags marks made more than 500 m from the institute." />
              <Button type="submit" variant="accent" size="lg" busy={busy} className="w-full">
                <QrCode className="size-5" aria-hidden /> Start & show QR
              </Button>
            </form>
          )}
        </Card>
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-brand-950">Recent sessions</h2>
            {!!batches.data?.length && (
              <Select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="h-10 w-auto max-w-[60%] text-sm" aria-label="Filter by batch">
                <option value="">All batches</option>
                {batches.data.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
          {sessions.error && <ErrorNote message={sessions.error} onRetry={sessions.reload} />}
          {sessions.loading && !sessions.data && <Loading />}
          {sessions.data && sessions.data.length === 0 && <Empty title="No sessions yet" icon={<CalendarCheck className="size-6" aria-hidden />}>Start your first session from the panel.</Empty>}
          <ul className="space-y-2.5">
            {sessions.data?.map((s) => {
              const pctV = s.totalCount ? Math.round(((s.presentCount ?? 0) / s.totalCount) * 100) : 0;
              return (
                <li key={s.id}>
                  <Link href={`/portal/attendance/live/?id=${s.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-line transition hover:ring-brand-300">
                    <span className={cx('grid size-12 shrink-0 place-items-center rounded-2xl text-center text-[0.65rem] leading-tight font-bold', s.status === 'open' ? 'bg-marigold-400 text-brand-950' : 'bg-brand-50 text-brand-800')}>
                      {s.status === 'open' ? 'LIVE' : fmtDate(s.date, { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-brand-950">{s.topic}</span>
                      <span className="block truncate text-xs text-stone-500">
                        {batchName(s.batchId)} · {fmtTime(s.startedAt)}
                        {s.geofence && (
                          <>
                            {' '}
                            · <MapPin className="inline size-3" aria-label="Location check on" />
                          </>
                        )}
                      </span>
                    </span>
                    <span className="w-20 shrink-0 text-right">
                      <span className="block text-sm font-bold text-brand-950 tabular-nums">
                        {s.presentCount}/{s.totalCount}
                      </span>
                      <span className="block text-xs text-stone-500">{pctV}% present</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
