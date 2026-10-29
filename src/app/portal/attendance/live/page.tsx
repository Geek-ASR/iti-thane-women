'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Download, Expand, Hash, Lock, MapPinOff, ShieldAlert, Sparkles, Smartphone, X } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { BASE_PATH, DEMO_MODE } from '@/lib/config';
import { TOKEN_WINDOW_MS, tokenFor } from '@/lib/attendance-core';
import { downloadCsv, fmtDateTime, fmtTime, useApi, useToast } from '@/lib/portal';
import type { AttendanceSession, AttendanceStatus, Batch, RosterRow } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { AttendanceBadge, Button, Card, cx, ErrorNote, Loading, PageHeader } from '@/components/portal/kit';
import { QrSvg } from '@/components/portal/qr';

type Detail = { session: AttendanceSession; roster: RosterRow[]; batch?: Batch };

export default function LivePage() {
  return <Guard roles={['instructor', 'admin']}>{() => <Live />}</Guard>;
}

function useRotatingToken(session: AttendanceSession | undefined) {
  const [tok, setTok] = useState<{ token: string; code: string; expiresInMs: number } | null>(null);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!session?.secret || session.status !== 'open') return setTok(null);
    let alive = true;
    const refresh = async () => {
      const t = await tokenFor(session.id, session.secret!);
      if (alive) setTok(t);
    };
    refresh();
    const tick = setInterval(() => {
      setNow(Date.now());
      if (Date.now() % TOKEN_WINDOW_MS < 260) refresh();
    }, 250);
    const exact = setInterval(refresh, TOKEN_WINDOW_MS);
    return () => {
      alive = false;
      clearInterval(tick);
      clearInterval(exact);
    };
  }, [session?.id, session?.secret, session?.status]);
  const remaining = TOKEN_WINDOW_MS - (now % TOKEN_WINDOW_MS);
  return { tok, remaining };
}

function Live() {
  const id = useSearchParams().get('id') ?? '';
  const toast = useToast();
  const { data, error, loading, reload, setData } = useApi<Detail>(id ? `/attendance/sessions/${id}` : null, [id]);
  const [projector, setProjector] = useState(false);
  const [busy, setBusy] = useState('');
  const session = data?.session;
  const { tok, remaining } = useRotatingToken(session);
  const open = session?.status === 'open';

  // Live roster: poll while open (and react instantly to other tabs in demo mode).
  useEffect(() => {
    if (!open) return;
    const t = setInterval(reload, 3000);
    const onStorage = () => reload();
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(t);
      window.removeEventListener('storage', onStorage);
    };
  }, [open, reload]);

  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const minsLeft = session ? Math.max(0, Math.ceil((new Date(session.endsAt).getTime() - clock) / 60000)) : 0;

  const url = useMemo(() => (session && tok ? `${typeof window !== 'undefined' ? window.location.origin : ''}${BASE_PATH}/portal/attendance/mark/?s=${session.id}&t=${tok.token}` : ''), [session, tok]);
  const counts = useMemo(() => {
    const r = data?.roster ?? [];
    return { present: r.filter((x) => x.record?.status === 'present' || x.record?.status === 'late').length, total: r.length, flagged: r.filter((x) => x.record?.flagged).length };
  }, [data]);

  const mark = useCallback(
    async (studentId: string, status: AttendanceStatus) => {
      setBusy(studentId);
      try {
        await api(`/attendance/sessions/${id}/mark`, { method: 'POST', body: { studentId, status } });
        await reload();
      } catch (e) {
        toast(errorMessage(e), 'error');
      } finally {
        setBusy('');
      }
    },
    [id, reload, toast],
  );

  async function close() {
    if (!confirm('Close this session? Trainees will no longer be able to mark attendance.')) return;
    try {
      await api(`/attendance/sessions/${id}/close`, { method: 'POST' });
      toast('Session closed.');
      setProjector(false);
      reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }

  async function markRestAbsent() {
    const rest = (data?.roster ?? []).filter((r) => !r.record);
    for (const r of rest) await api(`/attendance/sessions/${id}/mark`, { method: 'POST', body: { studentId: r.student.id, status: 'absent' } });
    toast(`${rest.length} marked absent.`);
    reload();
  }

  if (!id) return <ErrorNote message="No session selected." />;
  if (error && !data) return <ErrorNote message={error} onRetry={reload} />;
  if (loading && !data) return <Loading />;
  if (!data || !session) return null;

  const progress = remaining / TOKEN_WINDOW_MS;
  return (
    <>
      <title>{open ? 'Live attendance' : 'Session'}</title>
      <PageHeader
        back={{ href: '/portal/attendance/', label: 'Attendance' }}
        title={session.topic}
        subtitle={`${data.batch?.name ?? ''} · started ${fmtDateTime(session.startedAt)}`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv(`attendance-${session.date}-${data.batch?.name ?? 'batch'}.csv`, [
                  ['Enrollment', 'Name', 'Status', 'Method', 'Marked at', 'Distance (m)', 'Flagged'],
                  ...data.roster.map((r) => [r.student.enrollmentNo ?? '', r.student.name, r.record?.status ?? 'not marked', r.record?.method ?? '', r.record ? fmtTime(r.record.markedAt) : '', r.record?.distanceM ?? '', r.record?.flagged ? 'yes' : '']),
                ])
              }
            >
              <Download className="size-4" aria-hidden /> CSV
            </Button>
            {open && (
              <Button variant="primary" onClick={close}>
                <Lock className="size-4" aria-hidden /> Close session
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <Card className={cx('flex flex-col items-center text-center', !open && 'bg-paper')}>
          {open && tok ? (
            <>
              <div className="flex w-full items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" aria-hidden /> Live
                </span>
                <span className="text-stone-500">{minsLeft} min left</span>
              </div>
              <QrSvg text={url} className="mt-4 w-full max-w-[19rem] [&>svg]:h-auto [&>svg]:w-full" />
              <div className="mt-3 h-1.5 w-full max-w-[19rem] overflow-hidden rounded-full bg-brand-100" role="progressbar" aria-label="Time until the code changes" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-brand-500 transition-[width] duration-200 ease-linear" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="mt-4 text-xs font-semibold tracking-wider text-stone-500 uppercase">Or type this code</p>
              <p className="font-mono text-5xl font-bold tracking-[0.18em] text-brand-950 tabular-nums">
                {tok.code.slice(0, 3)} {tok.code.slice(3)}
              </p>
              <p className="mt-2 text-xs text-stone-500">Changes every 15 s — a photo of the screen stops working almost immediately.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setProjector(true)}>
                  <Expand className="size-4" aria-hidden /> Projector view
                </Button>
                {DEMO_MODE && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const r = await api<{ marked: number }>(`/attendance/sessions/${id}/simulate`, { method: 'POST' });
                      toast(`${r.marked} trainees scanned (simulated).`, 'info');
                      reload();
                    }}
                  >
                    <Sparkles className="size-4" aria-hidden /> Simulate scans
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="py-8">
              <Lock className="mx-auto size-10 text-stone-400" aria-hidden />
              <p className="mt-3 font-semibold text-brand-950">Session closed</p>
              <p className="mt-1 text-sm text-stone-600">You can still correct individual entries from the roster.</p>
            </div>
          )}
          <dl className="mt-6 grid w-full grid-cols-3 gap-2">
            {[
              ['Present', `${counts.present}/${counts.total}`],
              ['Not marked', counts.total - (data.roster.filter((r) => r.record).length)],
              ['Flagged', counts.flagged],
            ].map(([k, v]) => (
              <div key={String(k)} className="rounded-2xl bg-paper p-3 ring-1 ring-line">
                <dd className="text-xl font-bold text-brand-950">{v}</dd>
                <dt className="text-[0.7rem] text-stone-500">{k}</dt>
              </div>
            ))}
          </dl>
        </Card>

        <Card padded={false}>
          <div className="flex items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
            <h2 className="font-bold text-brand-950">Roster</h2>
            {data.roster.some((r) => !r.record) && (
              <Button variant="ghost" size="sm" onClick={markRestAbsent}>
                Mark unmarked absent
              </Button>
            )}
          </div>
          <ul className="divide-y divide-line">
            {data.roster.map((r) => (
              <li key={r.student.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 truncate text-sm font-semibold text-brand-950">
                    {r.student.name}
                    {r.record?.flagged && <ShieldAlert className="size-4 shrink-0 text-amber-600" aria-label="Flagged for review" />}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500">
                    {r.student.enrollmentNo}
                    {r.record && (
                      <span className="inline-flex items-center gap-1">
                        · {r.record.method === 'qr' ? <Smartphone className="size-3" aria-hidden /> : r.record.method === 'code' ? <Hash className="size-3" aria-hidden /> : null}
                        {fmtTime(r.record.markedAt)}
                        {r.record.distanceM !== null ? ` · ${r.record.distanceM} m` : r.record.method !== 'manual' ? <MapPinOff className="size-3" aria-label="No location" /> : null}
                      </span>
                    )}
                  </span>
                </span>
                <AttendanceBadge status={r.record?.status ?? null} />
                <span className="flex gap-1" role="group" aria-label={`Set status for ${r.student.name}`}>
                  {(['present', 'absent'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={busy === r.student.id}
                      onClick={() => mark(r.student.id, s)}
                      aria-pressed={r.record?.status === s}
                      className={cx('grid size-9 place-items-center rounded-xl ring-1 transition-colors', r.record?.status === s ? (s === 'present' ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-rose-600 text-white ring-rose-600') : 'bg-white text-stone-500 ring-line hover:bg-stone-50')}
                      aria-label={s === 'present' ? 'Mark present' : 'Mark absent'}
                    >
                      {s === 'present' ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}
                    </button>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          {counts.flagged > 0 && <p className="border-t border-line p-4 text-xs text-stone-500">⚠ Flagged marks were made far from campus, without location, or from a phone that already marked another trainee. Review before finalising.</p>}
        </Card>
      </div>

      {projector && open && tok && (
        <div role="dialog" aria-modal="true" aria-label="Projector view" className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-white p-6 text-center">
          <button type="button" onClick={() => setProjector(false)} className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-stone-100 hover:bg-stone-200" aria-label="Exit projector view">
            <X className="size-6" aria-hidden />
          </button>
          <p className="font-display text-3xl font-semibold text-brand-950 sm:text-4xl">{session.topic}</p>
          <QrSvg text={url} className="w-[min(70vh,80vw)] [&>svg]:h-auto [&>svg]:w-full" />
          <div className="flex flex-wrap items-center justify-center gap-8">
            <p className="font-mono text-6xl font-bold tracking-[0.2em] text-brand-950 tabular-nums sm:text-7xl">
              {tok.code.slice(0, 3)} {tok.code.slice(3)}
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              {counts.present}/{counts.total} present
            </p>
          </div>
        </div>
      )}
    </>
  );
}
