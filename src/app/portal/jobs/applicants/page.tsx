'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CalendarCheck, Download, Mail, Phone } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { downloadCsv, fmtDate, useApi, useToast } from '@/lib/portal';
import type { Application, ApplicationStatus, Job } from '@/lib/types';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { ApplicationBadge, Avatar, Button, Card, cx, Empty, ErrorNote, Field, Loading, Modal, PageHeader, Tabs, Textarea, tradeLabel } from '@/components/portal/kit';

const STAGES: ApplicationStatus[] = ['applied', 'shortlisted', 'interview', 'selected', 'rejected'];
const STAGE_LABEL: Record<string, string> = { applied: 'Applied', shortlisted: 'Shortlisted', interview: 'Interview', selected: 'Selected', rejected: 'Not selected' };

export default function ApplicantsPage() {
  return <Guard roles={['employer', 'admin']}>{() => <Applicants />}</Guard>;
}

function Applicants() {
  const id = useSearchParams().get('id') ?? '';
  const toast = useToast();
  const job = useApi<Job>(id ? `/jobs/${id}` : null, [id]);
  const apps = useApi<Application[]>(id ? `/jobs/${id}/applications` : null, [id]);
  const [stage, setStage] = useState<ApplicationStatus>('applied');
  const [open, setOpen] = useState<Application | null>(null);
  const [note, setNote] = useState('');

  async function move(a: Application, status: ApplicationStatus) {
    try {
      await api(`/applications/${a.id}`, { method: 'PATCH', body: { status, note: open?.id === a.id ? note : undefined } });
      toast(`${a.student?.name} → ${STAGE_LABEL[status]}`);
      setOpen(null);
      apps.reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }

  if (job.error || apps.error) return <ErrorNote message={job.error ?? apps.error ?? ''} />;
  if (!job.data || !apps.data) return <Loading />;
  const by = (s: ApplicationStatus) => apps.data!.filter((a) => a.status === s);

  const card = (a: Application) => (
    <button type="button" onClick={() => { setOpen(a); setNote(a.note); }} className="w-full rounded-2xl bg-white p-3 text-left shadow-soft ring-1 ring-line transition hover:ring-brand-300">
      <div className="flex items-center gap-3">
        <Avatar name={a.student?.name ?? '?'} size="sm" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-brand-950">{a.student?.name}</span>
          <span className="block truncate text-xs text-stone-500">{tradeLabel(a.student?.tradeSlug, trades)}</span>
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
        {a.student?.attendancePct !== null && a.student?.attendancePct !== undefined && (
          <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold', a.student.attendancePct >= 80 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>
            <CalendarCheck className="size-3" aria-hidden /> {a.student.attendancePct}% attendance
          </span>
        )}
        <span>{fmtDate(a.createdAt, { day: 'numeric', month: 'short' })}</span>
      </div>
    </button>
  );

  return (
    <>
      <title>{`Applicants — ${job.data.title}`}</title>
      <PageHeader
        back={{ href: `/portal/jobs/view/?id=${id}`, label: 'Opening' }}
        title="Applicants"
        subtitle={`${job.data.title} · ${job.data.company}`}
        actions={
          <Button variant="outline" disabled={!apps.data.length} onClick={() => downloadCsv(`applicants-${job.data!.title}.csv`, [['Name', 'Enrollment', 'Trade', 'Phone', 'Email', 'Attendance %', 'Status', 'Applied on'], ...apps.data!.map((a) => [a.student?.name, a.student?.enrollmentNo, tradeLabel(a.student?.tradeSlug, trades), a.student?.phone, a.student?.email, a.student?.attendancePct, STAGE_LABEL[a.status], fmtDate(a.createdAt)])])}>
            <Download className="size-4" aria-hidden /> Export
          </Button>
        }
      />
      {apps.data.length === 0 ? (
        <Empty title="No applicants yet">Applications appear here as soon as trainees apply.</Empty>
      ) : (
        <>
          <Tabs className="mb-4 lg:hidden" value={stage} onChange={setStage} tabs={STAGES.map((s) => ({ id: s, label: STAGE_LABEL[s], count: by(s).length }))} />
          <div className="space-y-2 lg:hidden">{by(stage).length ? by(stage).map((a) => <div key={a.id}>{card(a)}</div>) : <p className="py-8 text-center text-sm text-stone-500">No one in this stage.</p>}</div>
          <div className="hidden gap-3 lg:grid lg:grid-cols-5">
            {STAGES.map((s) => (
              <section key={s} aria-label={STAGE_LABEL[s]} className="rounded-3xl bg-stone-100/70 p-3">
                <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-bold text-brand-950">
                  {STAGE_LABEL[s]} <span className="rounded-full bg-white px-2 text-xs text-stone-500">{by(s).length}</span>
                </h2>
                <div className="space-y-2">{by(s).map((a) => <div key={a.id}>{card(a)}</div>)}</div>
              </section>
            ))}
          </div>
        </>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.student?.name ?? 'Applicant'} wide>
        {open && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <ApplicationBadge status={open.status} />
              <span className="text-sm text-stone-600">
                {open.student?.enrollmentNo} · {tradeLabel(open.student?.tradeSlug, trades)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {open.student?.phone && (
                <a href={`tel:${open.student.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 font-semibold text-brand-800">
                  <Phone className="size-4" aria-hidden /> {open.student.phone}
                </a>
              )}
              {open.student?.email && (
                <a href={`mailto:${open.student.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 font-semibold text-brand-800">
                  <Mail className="size-4" aria-hidden /> {open.student.email}
                </a>
              )}
            </div>
            {open.coverNote && <p className="rounded-2xl bg-paper p-4 text-sm text-stone-700 ring-1 ring-line">“{open.coverNote}”</p>}
            {open.student?.profile && (
              <div className="space-y-3 text-sm">
                {open.student.profile.headline && <p className="font-semibold text-brand-950">{open.student.profile.headline}</p>}
                {open.student.profile.about && <p className="text-stone-700">{open.student.profile.about}</p>}
                {!!open.student.profile.skills.length && (
                  <p className="flex flex-wrap gap-1.5">
                    {open.student.profile.skills.map((s) => (
                      <span key={s} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">{s}</span>
                    ))}
                  </p>
                )}
                {open.student.profile.education.map((e) => (
                  <p key={e.title} className="text-stone-600">
                    <span className="font-semibold text-brand-950">{e.title}</span> — {e.institute}, {e.year} {e.score && `· ${e.score}`}
                  </p>
                ))}
              </div>
            )}
            <Field label="Note (visible to the trainee)" htmlFor="an">
              <Textarea id="an" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Interview on Monday 10 am at our Thane office" />
            </Field>
            <div className="flex flex-wrap gap-2">
              {STAGES.filter((s) => s !== open.status).map((s) => (
                <Button key={s} size="sm" variant={s === 'selected' ? 'accent' : s === 'rejected' ? 'ghost' : 'outline'} onClick={() => move(open, s)}>
                  Move to {STAGE_LABEL[s]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
