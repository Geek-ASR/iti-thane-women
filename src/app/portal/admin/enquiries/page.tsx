'use client';

import { useMemo, useState } from 'react';
import { Download, Mail, Phone, ShieldCheck } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { downloadCsv, fmtDateTime, useApi, useToast } from '@/lib/portal';
import type { Enquiry, EnquiryType } from '@/lib/types';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, cx, Empty, ErrorNote, Loading, PageHeader, Select, Tabs, tradeLabel } from '@/components/portal/kit';

const TYPE_LABEL: Record<EnquiryType, string> = { admission: 'Admission', contact: 'Contact', grievance: 'Grievance', industry: 'Industry' };
const STATUS_STYLE: Record<Enquiry['status'], string> = { new: 'bg-marigold-50 text-marigold-800 ring-marigold-200', 'in-progress': 'bg-sky-50 text-sky-800 ring-sky-200', resolved: 'bg-emerald-50 text-emerald-800 ring-emerald-200' };

export default function EnquiriesPage() {
  return <Guard roles={['admin']}>{() => <Enquiries />}</Guard>;
}

function Enquiries() {
  const toast = useToast();
  const { data, error, loading, reload } = useApi<Enquiry[]>('/enquiries');
  const [type, setType] = useState<'all' | EnquiryType>('all');
  const [status, setStatus] = useState<'' | Enquiry['status']>('');
  const list = useMemo(() => (data ?? []).filter((e) => (type === 'all' || e.type === type) && (!status || e.status === status)), [data, type, status]);

  async function setState(e: Enquiry, s: Enquiry['status']) {
    try {
      await api(`/enquiries/${e.id}`, { method: 'PATCH', body: { status: s } });
      reload();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  }

  return (
    <>
      <title>Enquiries</title>
      <PageHeader
        title="Enquiries & grievances"
        subtitle="Everything submitted through the website forms."
        actions={
          <Button variant="outline" disabled={!list.length} onClick={() => downloadCsv('enquiries.csv', [['Date', 'Type', 'Name', 'Mobile', 'Email', 'Trade / company', 'Subject', 'Message', 'Status'], ...list.map((e) => [fmtDateTime(e.createdAt), TYPE_LABEL[e.type], e.anonymous ? 'Anonymous' : e.name, e.phone, e.email, e.trade, e.subject, e.message, e.status])])}>
            <Download className="size-4" aria-hidden /> Export
          </Button>
        }
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={type} onChange={setType} tabs={[{ id: 'all', label: 'All', count: data?.length }, ...(Object.keys(TYPE_LABEL) as EnquiryType[]).map((t) => ({ id: t, label: TYPE_LABEL[t], count: data?.filter((e) => e.type === t).length }))]} />
        <Select value={status} onChange={(e) => setStatus(e.target.value as Enquiry['status'] | '')} className="h-10 sm:w-48" aria-label="Filter by status">
          <option value="">Any status</option>
          <option value="new">New</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
        </Select>
      </div>
      {error && <ErrorNote message={error} onRetry={reload} />}
      {loading && !data && <Loading />}
      {data && list.length === 0 && <Empty title="No enquiries here" />}
      <ul className="space-y-3">
        {list.map((e) => (
          <li key={e.id}>
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{TYPE_LABEL[e.type]}</span>
                <span className={cx('rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1', STATUS_STYLE[e.status])}>{e.status.replace('-', ' ')}</span>
                <span className="text-xs text-stone-500">{fmtDateTime(e.createdAt)}</span>
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-brand-950">
                    {e.anonymous ? (
                      <>
                        <ShieldCheck className="size-4 text-emerald-600" aria-hidden /> Anonymous
                      </>
                    ) : (
                      e.name || '—'
                    )}
                  </p>
                  {(e.subject || e.trade) && (
                    <p className="text-sm text-stone-600">
                      {[e.type === 'admission' ? tradeLabel(e.trade, trades) : e.trade, e.subject].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {e.message && <p className="mt-2 whitespace-pre-line text-[0.95rem] text-stone-800">{e.message}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {e.phone && (
                    <a href={`tel:${e.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-700 px-3.5 text-sm font-semibold text-white">
                      <Phone className="size-4" aria-hidden /> Call
                    </a>
                  )}
                  {e.email && (
                    <a href={`mailto:${e.email}`} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-brand-800 ring-1 ring-brand-200">
                      <Mail className="size-4" aria-hidden /> Email
                    </a>
                  )}
                  <Select value={e.status} onChange={(ev) => setState(e, ev.target.value as Enquiry['status'])} className="h-9 w-36 text-sm" aria-label="Update status">
                    <option value="new">New</option>
                    <option value="in-progress">In progress</option>
                    <option value="resolved">Resolved</option>
                  </Select>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
