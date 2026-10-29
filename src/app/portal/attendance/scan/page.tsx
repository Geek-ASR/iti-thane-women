'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Hash, MapPin, QrCode } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { deviceId } from '@/lib/attendance-core';
import { fmtTime, useApi } from '@/lib/portal';
import type { AttendanceStatus } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { MarkOutcome, type MarkResult } from '@/components/portal/MarkOutcome';
import { Button, Card, cx, Loading, PageHeader } from '@/components/portal/kit';
import { getLocation, QrScanner } from '@/components/portal/qr';

type Open = { session: { id: string; topic: string; startedAt: string; endsAt: string; geofence: boolean; batchName: string } | null; myStatus: AttendanceStatus | null };

export default function ScanPage() {
  return <Guard roles={['student']}>{() => <Scan />}</Guard>;
}

function Scan() {
  const open = useApi<Open>('/attendance/open');
  const [mode, setMode] = useState<'scan' | 'code'>('scan');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<MarkResult | null>(null);
  const [error, setError] = useState('');
  const codeRef = useRef<HTMLInputElement>(null);

  async function submit(payload: { sessionId: string; token?: string; code?: string }) {
    setBusy(true);
    setError('');
    try {
      const loc = await getLocation();
      const r = await api<MarkResult>('/attendance/mark', { method: 'POST', body: { ...payload, ...(loc ?? {}), deviceId: deviceId() } });
      setResult(r);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  function onScan(text: string) {
    try {
      const u = new URL(text);
      const s = u.searchParams.get('s');
      const t = u.searchParams.get('t');
      if (!s || !t) throw new Error();
      submit({ sessionId: s, token: t });
    } catch {
      setError('That QR code is not a Smart Campus attendance code.');
    }
  }

  function onCode(e: FormEvent) {
    e.preventDefault();
    const code = (codeRef.current?.value ?? '').replace(/\D/g, '');
    if (code.length !== 6) return setError('Enter the 6-digit code shown on the screen.');
    if (!open.data?.session) return setError('No attendance session is open for your batch right now.');
    submit({ sessionId: open.data.session.id, code });
  }

  return (
    <div className="mx-auto max-w-md">
      <title>Mark attendance</title>
      <PageHeader back={{ href: '/portal/attendance/', label: 'My attendance' }} title="Mark attendance" />
      {result ? (
        <MarkOutcome result={result} error="" />
      ) : (
        <>
          <div className="mb-4 rounded-2xl bg-white p-4 ring-1 ring-line">
            {open.loading && !open.data ? (
              <Loading label="Checking for an open session…" />
            ) : open.data?.session ? (
              <div className="flex items-center gap-3">
                <span className="size-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-950">{open.data.session.topic}</p>
                  <p className="text-xs text-stone-500">
                    {open.data.session.batchName} · open until {fmtTime(open.data.session.endsAt)}
                  </p>
                </div>
                {open.data.myStatus && <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">Marked</span>}
              </div>
            ) : (
              <p className="text-sm text-stone-600">No session is open for your batch right now. When your instructor starts one, scan the QR code on the screen.</p>
            )}
          </div>
          <div role="tablist" className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 ring-1 ring-line">
            {[
              { id: 'scan' as const, label: 'Scan QR', icon: QrCode },
              { id: 'code' as const, label: 'Enter code', icon: Hash },
            ].map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={mode === t.id} onClick={() => { setMode(t.id); setError(''); }} className={cx('flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold', mode === t.id ? 'bg-brand-900 text-white' : 'text-stone-700')}>
                <t.icon className="size-4" aria-hidden /> {t.label}
              </button>
            ))}
          </div>
          {busy ? (
            <Card>
              <Loading label="Marking your attendance…" />
            </Card>
          ) : mode === 'scan' ? (
            <QrScanner onResult={onScan} />
          ) : (
            <Card>
              <form onSubmit={onCode}>
                <label htmlFor="code" className="block text-center text-sm font-semibold text-brand-950">
                  6-digit code from the screen
                </label>
                <input ref={codeRef} id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} placeholder="000 000" className="mt-3 h-16 w-full rounded-2xl border border-line bg-paper text-center font-mono text-3xl font-bold tracking-[0.3em] text-brand-950 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100" />
                <Button type="submit" size="lg" className="mt-4 w-full">
                  Mark present
                </Button>
              </form>
            </Card>
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
              {error}
            </p>
          )}
          <p className="mt-4 flex items-start gap-2 text-xs text-stone-500">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /> Your approximate location is checked once to confirm you are on campus. Tip: your phone camera app can also scan the QR directly.
          </p>
        </>
      )}
    </div>
  );
}
