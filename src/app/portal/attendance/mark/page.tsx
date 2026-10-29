'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import { deviceId } from '@/lib/attendance-core';
import { Guard } from '@/components/portal/Guard';
import { buttonClass, Card, Loading } from '@/components/portal/kit';
import { getLocation } from '@/components/portal/qr';
import { MarkOutcome, type MarkResult } from '@/components/portal/MarkOutcome';

/** Landing page for the attendance QR — opened by the phone's own camera app. */
export default function MarkFromQr() {
  return <Guard roles={['student']}>{() => <Mark />}</Guard>;
}

function Mark() {
  const params = useSearchParams();
  const sessionId = params.get('s') ?? '';
  const token = params.get('t') ?? '';
  const [result, setResult] = useState<MarkResult | null>(null);
  const [error, setError] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !sessionId || !token) return;
    started.current = true;
    (async () => {
      try {
        const loc = await getLocation();
        setResult(await api<MarkResult>('/attendance/mark', { method: 'POST', body: { sessionId, token, ...(loc ?? {}), deviceId: deviceId() } }));
      } catch (e) {
        setError(errorMessage(e));
      }
    })();
  }, [sessionId, token]);

  return (
    <div className="mx-auto max-w-md pt-4">
      <title>Attendance</title>
      {!sessionId || !token ? (
        <Card className="text-center">
          <p className="font-semibold text-brand-950">This link is incomplete.</p>
          <Link href="/portal/attendance/scan/" className={buttonClass('primary', 'md', 'mt-4')}>
            Scan again
          </Link>
        </Card>
      ) : result || error ? (
        <>
          <MarkOutcome result={result} error={error} />
          {error && (
            <div className="mt-4 text-center">
              <Link href="/portal/attendance/scan/" className={buttonClass('primary', 'md')}>
                Scan the latest QR
              </Link>
            </div>
          )}
        </>
      ) : (
        <Card>
          <Loading label="Marking your attendance…" />
        </Card>
      )}
    </div>
  );
}
