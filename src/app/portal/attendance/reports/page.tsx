'use client';

import { useMemo, useState } from 'react';
import { localDay } from '@/lib/dates';
import { Download, Printer } from 'lucide-react';
import { downloadCsv, useApi } from '@/lib/portal';
import type { AttendanceSummaryRow, Batch } from '@/lib/types';
import { HBarChart, Meter } from '@/components/charts';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, CardTitle, cx, Empty, ErrorNote, Field, Input, Loading, PageHeader, Select, StatCard } from '@/components/portal/kit';

const iso = (d: Date) => localDay(d);
function presetRange(p: string): { from: string; to: string } {
  const now = new Date();
  if (p === 'this-month') return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to: iso(now) };
  if (p === 'last-month') return { from: iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)), to: iso(new Date(now.getFullYear(), now.getMonth(), 0)) };
  if (p === '30') return { from: iso(new Date(now.getTime() - 30 * 86400000)), to: iso(now) };
  return { from: '', to: '' };
}
const band = (pct: number) => (pct >= 80 ? 'Eligible' : pct >= 70 ? 'At risk' : 'Defaulter');

export default function ReportsPage() {
  return <Guard roles={['instructor', 'admin']}>{() => <Reports />}</Guard>;
}

function Reports() {
  const batches = useApi<Batch[]>('/batches');
  const [batchId, setBatchId] = useState('');
  const [preset, setPreset] = useState('all');
  const [custom, setCustom] = useState({ from: '', to: '' });
  const range = preset === 'custom' ? custom : presetRange(preset);
  const activeBatch = batchId || batches.data?.[0]?.id || '';
  const report = useApi<AttendanceSummaryRow[]>(activeBatch ? `/attendance/report?batchId=${activeBatch}&from=${range.from}&to=${range.to}` : null, [activeBatch, range.from, range.to]);
  const rows = report.data ?? [];
  const stats = useMemo(() => {
    const withData = rows.filter((r) => r.total);
    const avg = withData.length ? Math.round((withData.reduce((s, r) => s + r.pct, 0) / withData.length) * 10) / 10 : 0;
    return { avg, eligible: withData.filter((r) => r.pct >= 80).length, risk: withData.filter((r) => r.pct < 80 && r.pct >= 70).length, defaulters: withData.filter((r) => r.pct < 70).length, sessions: Math.max(0, ...rows.map((r) => r.total)) };
  }, [rows]);
  const batch = batches.data?.find((b) => b.id === activeBatch);

  return (
    <>
      <title>Attendance reports</title>
      <PageHeader
        title="Attendance reports"
        subtitle="Monthly registers, defaulter lists and exports for your batches."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden /> Print
            </Button>
            <Button
              disabled={!rows.length}
              onClick={() =>
                downloadCsv(`attendance-report-${batch?.name ?? 'batch'}-${range.from || 'all'}.csv`, [
                  ['Enrollment', 'Name', 'Present', 'Late', 'Absent', 'Leave', 'Sessions', 'Attendance %', 'Status'],
                  ...rows.map((r) => [r.student.enrollmentNo ?? '', r.student.name, r.present, r.late, r.absent, r.leave, r.total, r.pct, band(r.pct)]),
                ])
              }
            >
              <Download className="size-4" aria-hidden /> Export CSV
            </Button>
          </>
        }
      />
      <Card className="no-print mb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Batch" htmlFor="rb">
            <Select id="rb" value={activeBatch} onChange={(e) => setBatchId(e.target.value)}>
              {batches.data?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Period" htmlFor="rp">
            <Select id="rp" value={preset} onChange={(e) => setPreset(e.target.value)}>
              <option value="all">All sessions</option>
              <option value="this-month">This month</option>
              <option value="last-month">Last month</option>
              <option value="30">Last 30 days</option>
              <option value="custom">Custom range…</option>
            </Select>
          </Field>
          {preset === 'custom' && (
            <>
              <Field label="From" htmlFor="rf">
                <Input id="rf" type="date" value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} />
              </Field>
              <Field label="To" htmlFor="rt">
                <Input id="rt" type="date" value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} />
              </Field>
            </>
          )}
        </div>
      </Card>
      {report.error && <ErrorNote message={report.error} onRetry={report.reload} />}
      {(report.loading || batches.loading) && !report.data && <Loading />}
      {report.data && (
        <div className={cx('space-y-6 transition-opacity', report.loading && 'opacity-60')}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Average attendance" value={`${stats.avg}%`} hint={`${stats.sessions} sessions`} />
            <StatCard label="Eligible (80%+)" value={stats.eligible} tone="green" />
            <StatCard label="At risk (70–80%)" value={stats.risk} tone="marigold" />
            <StatCard label="Defaulters (<70%)" value={stats.defaulters} tone="rose" />
          </div>
          {rows.length === 0 ? (
            <Empty title="No trainees in this batch yet" />
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <Card padded={false}>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Attendance summary for {batch?.name}</caption>
                    <thead className="bg-stone-50 text-xs text-stone-500">
                      <tr>
                        {['Trainee', 'Present', 'Late', 'Absent', 'Leave', 'Attendance'].map((h) => (
                          <th key={h} scope="col" className="px-4 py-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line tabular-nums">
                      {rows.map((r) => (
                        <tr key={r.student.id} className={cx(r.total && r.pct < 70 && 'bg-rose-50/40')}>
                          <th scope="row" className="px-4 py-3 text-left">
                            <span className="block font-semibold text-brand-950">{r.student.name}</span>
                            <span className="block text-xs font-normal text-stone-500">{r.student.enrollmentNo}</span>
                          </th>
                          <td className="px-4 py-3">{r.present}</td>
                          <td className="px-4 py-3">{r.late}</td>
                          <td className="px-4 py-3">{r.absent}</td>
                          <td className="px-4 py-3">{r.leave}</td>
                          <td className="w-48 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className={cx('w-12 font-bold', r.pct >= 80 ? 'text-brand-950' : 'text-rose-700')}>{r.pct}%</span>
                              <Meter value={r.pct} label={`${r.student.name}: ${r.pct}%`} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="divide-y divide-line md:hidden">
                  {rows.map((r) => (
                    <li key={r.student.id} className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-brand-950">{r.student.name}</span>
                          <span className="block text-xs text-stone-500">
                            {r.student.enrollmentNo} · P {r.present} · L {r.late} · A {r.absent}
                          </span>
                        </span>
                        <span className={cx('text-lg font-bold', r.pct >= 80 ? 'text-brand-950' : 'text-rose-700')}>{r.pct}%</span>
                      </div>
                      <div className="mt-2">
                        <Meter value={r.pct} label={`${r.student.name}: ${r.pct}%`} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <CardTitle>Lowest attendance first</CardTitle>
                <HBarChart data={[...rows].filter((r) => r.total).sort((a, b) => a.pct - b.pct).slice(0, 10).map((r) => ({ label: r.student.name, value: r.pct, detail: `${r.present + r.late} of ${r.total} sessions` }))} max={100} format={(v) => `${v}%`} caption="Trainees with the lowest attendance" headers={['Trainee', 'Attendance']} />
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
