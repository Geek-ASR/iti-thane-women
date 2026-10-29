'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CalendarCheck, ClipboardList, FileText, Inbox, KeyRound, ListChecks, Megaphone, QrCode, ScanLine, TriangleAlert, UserPlus, UsersRound } from 'lucide-react';
import { useApi, fmtDate, fmtTime } from '@/lib/portal';
import type { Dashboard, User } from '@/lib/types';
import { trades } from '@/content/trades';
import { ColumnChart, Meter } from '@/components/charts';
import { Guard } from '@/components/portal/Guard';
import { ApplicationBadge, buttonClass, Card, CardTitle, cx, Empty, ErrorNote, JobStatusBadge, Loading, StatCard, tradeLabel } from '@/components/portal/kit';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
const CARD_ICONS: Record<string, React.ReactNode> = {
  attendance: <CalendarCheck className="size-5" aria-hidden />,
  quizzes: <ListChecks className="size-5" aria-hidden />,
  applications: <FileText className="size-5" aria-hidden />,
  jobs: <BriefcaseBusiness className="size-5" aria-hidden />,
  batches: <ClipboardList className="size-5" aria-hidden />,
  students: <UsersRound className="size-5" aria-hidden />,
  avg: <CalendarCheck className="size-5" aria-hidden />,
  low: <TriangleAlert className="size-5" aria-hidden />,
  enquiries: <Inbox className="size-5" aria-hidden />,
  applicants: <UsersRound className="size-5" aria-hidden />,
  shortlisted: <ListChecks className="size-5" aria-hidden />,
  selected: <BriefcaseBusiness className="size-5" aria-hidden />,
};

export default function DashboardPage() {
  return <Guard>{(user) => <DashboardView user={user} />}</Guard>;
}

function DashboardView({ user }: { user: User }) {
  const { data, error, loading, reload } = useApi<Dashboard>('/dashboard');
  const first = user.role === 'employer' ? user.name : user.name.split(' ')[0];
  return (
    <>
      <title>Dashboard</title>
      <section className="relative mb-6 overflow-hidden rounded-3xl bg-brand-900 p-5 text-white sm:p-7">
        <div aria-hidden className="bg-dots absolute inset-0 opacity-40" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-white/70">{greeting()},</p>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{first}</h1>
            <p className="mt-1 text-sm text-white/70">
              {user.role === 'student' ? `${tradeLabel(user.tradeSlug, trades)} · ${user.enrollmentNo ?? 'Enrollment pending'}` : user.role === 'employer' ? user.company : new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          {user.status === 'active' && (
            <div className="flex flex-wrap gap-2">
              {user.role === 'student' && (
                <>
                  <Link href="/portal/attendance/scan/" className={buttonClass('accent', 'lg')}>
                    <ScanLine className="size-5" aria-hidden /> Mark attendance
                  </Link>
                  <Link href="/portal/quizzes/" className={buttonClass('glass', 'lg')}>
                    Quizzes
                  </Link>
                </>
              )}
              {(user.role === 'instructor' || user.role === 'admin') && (
                <Link href="/portal/attendance/" className={buttonClass('accent', 'lg')}>
                  <QrCode className="size-5" aria-hidden /> Start attendance
                </Link>
              )}
              {user.role === 'employer' && (
                <Link href="/portal/jobs/edit/" className={buttonClass('accent', 'lg')}>
                  <ClipboardList className="size-5" aria-hidden /> Post an opening
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {user.mustChangePassword && (
        <Link href="/portal/account/" className="mb-6 flex items-center gap-3 rounded-2xl bg-marigold-50 p-4 text-sm font-medium text-brand-950 ring-1 ring-marigold-200">
          <KeyRound className="size-5 shrink-0 text-marigold-700" aria-hidden /> Please set a new password for your account. <ArrowRight className="ml-auto size-4" aria-hidden />
        </Link>
      )}

      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {data.cards.map((c, i) => (
              <StatCard key={c.key} label={c.label} value={c.value} hint={c.hint} icon={CARD_ICONS[c.key]} tone={(['brand', 'marigold', 'green', 'rose'] as const)[i % 4]} />
            ))}
          </div>
          {user.role === 'student' && <StudentPanels d={data} />}
          {(user.role === 'instructor' || user.role === 'admin') && <StaffPanels d={data} admin={user.role === 'admin'} />}
          {user.role === 'employer' && <EmployerPanels d={data} />}
        </>
      )}
    </>
  );
}

function TrendCard({ d, title }: { d: Dashboard; title: string }) {
  if (!d.attendanceTrend?.length) return null;
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <ColumnChart data={d.attendanceTrend.map((t) => ({ label: t.label, value: t.pct }))} labelIdx={[d.attendanceTrend.length - 1]} format={(v) => `${Math.round(v)}%`} caption={title} headers={['Month', 'Attendance']} height={150} />
    </Card>
  );
}

function StudentPanels({ d }: { d: Dashboard }) {
  const att = d.cards.find((c) => c.key === 'attendance');
  const pctNum = parseFloat(String(att?.value ?? '0')) || 0;
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardTitle action={<Link href="/portal/attendance/" className="text-sm font-semibold text-brand-700 hover:underline">Details</Link>}>Attendance</CardTitle>
          <div className="flex items-end justify-between gap-3">
            <p className="text-4xl font-bold tracking-tight text-brand-950">{att?.value}</p>
            <p className={cx('rounded-full px-3 py-1 text-xs font-bold', pctNum >= 80 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700')}>{pctNum >= 80 ? '✓ Eligible for exam (80%+)' : '⚠ Below 80% requirement'}</p>
          </div>
          <div className="mt-4">
            <Meter value={pctNum} label="Attendance against the 80% requirement" />
          </div>
          <p className="mt-2 text-xs text-stone-500">{att?.hint} · DGT requires at least 80% attendance to appear for the final trade test.</p>
        </Card>
        <TrendCard d={d} title="Monthly attendance" />
      </div>
      <div className="space-y-6">
        <Card>
          <CardTitle action={<Link href="/portal/quizzes/" className="text-sm font-semibold text-brand-700 hover:underline">All quizzes</Link>}>Quizzes for you</CardTitle>
          {d.upcomingQuizzes?.length ? (
            <ul className="space-y-2.5">
              {d.upcomingQuizzes.map((q) => (
                <li key={q.id} className="flex items-center gap-3 rounded-2xl bg-paper p-3 ring-1 ring-line">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-900 text-marigold-300">
                    <ListChecks className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-brand-950">{q.title}</span>
                    <span className="block text-xs text-stone-500">
                      {q.questionCount} questions · {q.durationMin} min
                    </span>
                  </span>
                  <Link href={`/portal/quizzes/take/?id=${q.id}`} className={buttonClass('primary', 'sm')}>
                    Start
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">You are all caught up. 🎉</p>
          )}
        </Card>
        <Card>
          <CardTitle action={<Link href="/portal/applications/" className="text-sm font-semibold text-brand-700 hover:underline">Track</Link>}>My applications</CardTitle>
          {d.recentApplications?.length ? (
            <ul className="divide-y divide-line">
              {d.recentApplications.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-brand-950">{a.job?.title}</span>
                    <span className="block truncate text-xs text-stone-500">{a.job?.company}</span>
                  </span>
                  <ApplicationBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">No applications yet.</p>
          )}
          {!!d.openJobs?.length && (
            <Link href="/portal/jobs/" className="mt-4 flex items-center justify-between rounded-2xl bg-marigold-50 p-3 text-sm font-semibold text-brand-950 ring-1 ring-marigold-200">
              {d.openJobs.length} openings match your trade <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
        </Card>
      </div>
    </div>
  );
}

function StaffPanels({ d, admin }: { d: Dashboard; admin: boolean }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        {admin && d.pending && (
          <Card>
            <CardTitle>Needs your attention</CardTitle>
            <ul className="grid gap-2.5 sm:grid-cols-3">
              {[
                { label: 'Accounts to approve', value: d.pending.employers, href: '/portal/admin/users/?status=pending', icon: UserPlus },
                { label: 'Openings to review', value: d.pending.jobs, href: '/portal/jobs/?status=pending', icon: BriefcaseBusiness },
                { label: 'New enquiries', value: d.pending.enquiries, href: '/portal/admin/enquiries/', icon: Inbox },
              ].map((p) => (
                <li key={p.label}>
                  <Link href={p.href} className={cx('flex items-center gap-3 rounded-2xl p-3 ring-1', p.value ? 'bg-marigold-50 ring-marigold-200' : 'bg-paper ring-line')}>
                    <p.icon className="size-5 shrink-0 text-brand-700" aria-hidden />
                    <span>
                      <span className="block text-xl leading-none font-bold text-brand-950">{p.value}</span>
                      <span className="text-xs text-stone-600">{p.label}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
        <TrendCard d={d} title="Attendance by month (your batches)" />
        <Card>
          <CardTitle action={<Link href="/portal/attendance/" className="text-sm font-semibold text-brand-700 hover:underline">All sessions</Link>}>Today’s sessions</CardTitle>
          {d.todaySessions?.length ? (
            <ul className="divide-y divide-line">
              {d.todaySessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span>
                    <span className="block text-sm font-semibold text-brand-950">{s.topic}</span>
                    <span className="block text-xs text-stone-500">
                      {fmtTime(s.startedAt)} · {s.presentCount}/{s.totalCount} present
                    </span>
                  </span>
                  <Link href={`/portal/attendance/live/?id=${s.id}`} className={buttonClass(s.status === 'open' ? 'accent' : 'outline', 'sm')}>
                    {s.status === 'open' ? 'Live' : 'View'}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No session started today" icon={<QrCode className="size-6" aria-hidden />}>
              <Link href="/portal/attendance/" className="font-semibold text-brand-700 hover:underline">Start one now →</Link>
            </Empty>
          )}
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardTitle action={<Link href="/portal/attendance/reports/" className="text-sm font-semibold text-brand-700 hover:underline">Reports</Link>}>Below 80% attendance</CardTitle>
          {d.lowAttendance?.length ? (
            <ul className="space-y-3">
              {d.lowAttendance.map((r) => (
                <li key={r.student.id}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold text-brand-950">{r.student.name}</span>
                    <span className="font-bold text-rose-700 tabular-nums">{r.pct}%</span>
                  </div>
                  <Meter value={r.pct} label={`${r.student.name}: ${r.pct}% attendance`} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">Everyone is above 80%. 👏</p>
          )}
        </Card>
        <Card>
          <CardTitle action={<Link href="/portal/quizzes/" className="text-sm font-semibold text-brand-700 hover:underline">Manage</Link>}>Quizzes</CardTitle>
          <ul className="divide-y divide-line">
            {(d.upcomingQuizzes ?? []).map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-brand-950">{q.title}</span>
                  <span className="block text-xs text-stone-500">
                    {q.status} · {q.attemptCount ?? 0} attempts
                  </span>
                </span>
                <Link href={`/portal/quizzes/insights/?id=${q.id}`} className="text-sm font-semibold text-brand-700 hover:underline">
                  Insights
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        {admin && (
          <Card>
            <CardTitle>Quick actions</CardTitle>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/portal/admin/content/?c=notices', label: 'Post a notice', icon: Megaphone },
                { href: '/portal/admin/users/', label: 'Add trainees', icon: UserPlus },
                { href: '/portal/jobs/edit/', label: 'Post an opening', icon: BriefcaseBusiness },
                { href: '/portal/attendance/reports/', label: 'Export attendance', icon: FileText },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center gap-2 rounded-2xl bg-paper p-3 text-sm font-semibold text-brand-950 ring-1 ring-line hover:ring-brand-300">
                  <a.icon className="size-4 text-brand-600" aria-hidden /> {a.label}
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function EmployerPanels({ d }: { d: Dashboard }) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardTitle action={<Link href="/portal/jobs/?mine=1" className="text-sm font-semibold text-brand-700 hover:underline">All</Link>}>Your openings</CardTitle>
        {d.openJobs?.length ? (
          <ul className="divide-y divide-line">
            {d.openJobs.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <Link href={`/portal/jobs/applicants/?id=${j.id}`} className="block truncate text-sm font-semibold text-brand-950 hover:underline">
                    {j.title}
                  </Link>
                  <span className="block text-xs text-stone-500">
                    {j.applicationCount ?? 0} applicants · apply by {fmtDate(j.lastDate)}
                  </span>
                </span>
                <JobStatusBadge status={j.status} />
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="No openings yet">
            <Link href="/portal/jobs/edit/" className="font-semibold text-brand-700 hover:underline">Post your first opening →</Link>
          </Empty>
        )}
      </Card>
      <Card>
        <CardTitle>Recent applicants</CardTitle>
        {d.recentApplications?.length ? (
          <ul className="divide-y divide-line">
            {d.recentApplications.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-brand-950">{a.student?.name}</span>
                  <span className="block truncate text-xs text-stone-500">{a.job?.title}</span>
                </span>
                <ApplicationBadge status={a.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-stone-500">Applicants will appear here.</p>
        )}
      </Card>
    </div>
  );
}
