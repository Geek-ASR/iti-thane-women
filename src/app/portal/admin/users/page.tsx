'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
import { Check, KeyRound, Pencil, Search, Trash, Upload, UserPlus } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { parseCsv, useApi, useToast } from '@/lib/portal';
import type { Batch, Role, User, UserStatus } from '@/lib/types';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { Avatar, Button, Card, cx, Empty, ErrorNote, Field, Input, Loading, Modal, PageHeader, Select, Tabs, Textarea, tradeLabel, UserStatusBadge } from '@/components/portal/kit';

type Tab = 'student' | 'staff' | 'employer' | 'pending';

export default function UsersPage() {
  return <Guard roles={['admin']}>{(me) => <Users meId={me.id} />}</Guard>;
}

function Users({ meId }: { meId: string }) {
  const toast = useToast();
  const initial = useSearchParams().get('status') === 'pending' ? 'pending' : 'student';
  const [tab, setTab] = useState<Tab>(initial);
  const [q, setQ] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const users = useApi<User[]>('/users');
  const batches = useApi<Batch[]>('/batches');
  const [edit, setEdit] = useState<Partial<User> | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [temp, setTemp] = useState<{ name: string; password: string } | null>(null);

  const list = useMemo(() => {
    const all = users.data ?? [];
    const byTab = all.filter((u) => (tab === 'pending' ? u.status === 'pending' : tab === 'staff' ? (u.role === 'admin' || u.role === 'instructor') && u.status !== 'pending' : u.role === tab && u.status !== 'pending'));
    const needle = q.trim().toLowerCase();
    return byTab.filter((u) => (!batchFilter || u.batchId === batchFilter) && (!needle || `${u.name} ${u.email} ${u.phone} ${u.enrollmentNo} ${u.company}`.toLowerCase().includes(needle)));
  }, [users.data, tab, q, batchFilter]);
  const count = (t: Tab) => (users.data ?? []).filter((u) => (t === 'pending' ? u.status === 'pending' : t === 'staff' ? (u.role === 'admin' || u.role === 'instructor') && u.status !== 'pending' : u.role === t && u.status !== 'pending')).length;
  const batchName = (id: string | null) => batches.data?.find((b) => b.id === id)?.name ?? '—';

  async function patch(u: User, body: Partial<User>, msg: string) {
    try {
      await api(`/users/${u.id}`, { method: 'PATCH', body });
      toast(msg);
      users.reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function reset(u: User) {
    if (!confirm(`Reset the password for ${u.name}?`)) return;
    try {
      const r = await api<{ tempPassword: string }>(`/users/${u.id}/reset-password`, { method: 'POST' });
      setTemp({ name: u.name, password: r.tempPassword });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function remove(u: User) {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await api(`/users/${u.id}`, { method: 'DELETE' });
      toast('Account deleted.');
      users.reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }
  async function saveUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      if (edit?.id) {
        await api(`/users/${edit.id}`, { method: 'PATCH', body: f });
        toast('Saved.');
      } else {
        const r = await api<{ user: User; tempPassword: string }>('/users', { method: 'POST', body: f });
        setTemp({ name: r.user.name, password: r.tempPassword });
      }
      setEdit(null);
      users.reload();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  }

  return (
    <>
      <title>People</title>
      <PageHeader
        title="People"
        subtitle="Trainees, staff and employers. Approve self-registrations and manage batches."
        actions={
          <>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="size-4" aria-hidden /> Import trainees
            </Button>
            <Button variant="accent" onClick={() => setEdit({ role: tab === 'staff' ? 'instructor' : tab === 'employer' ? 'employer' : 'student' })}>
              <UserPlus className="size-4" aria-hidden /> Add person
            </Button>
          </>
        }
      />
      <Tabs className="mb-4" value={tab} onChange={setTab} tabs={[{ id: 'student', label: 'Trainees', count: count('student') }, { id: 'staff', label: 'Staff', count: count('staff') }, { id: 'employer', label: 'Employers', count: count('employer') }, { id: 'pending', label: 'Pending approval', count: count('pending') }]} />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_16rem]">
        <label className="relative block">
          <span className="sr-only">Search people</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, mobile, email, enrollment" className="pl-10" />
        </label>
        {tab === 'student' && (
          <Select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} aria-label="Filter by batch">
            <option value="">All batches</option>
            {batches.data?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        )}
      </div>
      {users.error && <ErrorNote message={users.error} onRetry={users.reload} />}
      {users.loading && !users.data && <Loading />}
      {users.data && list.length === 0 && <Empty title="No one here" />}
      <ul className="space-y-2.5">
        {list.map((u) => (
          <li key={u.id}>
            <Card className="flex flex-col gap-3 sm:flex-row sm:items-center" padded={false}>
              <div className="flex min-w-0 flex-1 items-center gap-3 p-4 pb-0 sm:pb-4">
                <Avatar name={u.name} />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-brand-950">
                    {u.name} <UserStatusBadge status={u.status} />
                  </p>
                  <p className="truncate text-xs text-stone-500">
                    {u.role === 'student' ? `${u.enrollmentNo ?? 'No enrollment'} · ${u.batchId ? batchName(u.batchId) : tradeLabel(u.tradeSlug, trades)}` : u.role === 'employer' ? u.company : u.role === 'admin' ? 'Admin / TPO' : `Instructor · ${tradeLabel(u.tradeSlug, trades)}`}
                    {u.phone ? ` · ${u.phone}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 px-4 pb-4 sm:pb-0">
                {u.status === 'pending' && (
                  <Button size="sm" onClick={() => (u.role === 'student' && !u.batchId ? setEdit(u) : patch(u, { status: 'active' }, `${u.name} approved.`))}>
                    <Check className="size-4" aria-hidden /> Approve
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setEdit(u)} aria-label="Edit">
                  <Pencil className="size-4" aria-hidden />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => reset(u)} aria-label="Reset password">
                  <KeyRound className="size-4" aria-hidden />
                </Button>
                {u.status === 'active' && u.id !== meId && (
                  <Button size="sm" variant="ghost" onClick={() => patch(u, { status: 'disabled' as UserStatus }, 'Account disabled.')}>
                    Disable
                  </Button>
                )}
                {u.status === 'disabled' && (
                  <Button size="sm" variant="ghost" onClick={() => patch(u, { status: 'active' }, 'Account enabled.')}>
                    Enable
                  </Button>
                )}
                {u.id !== meId && (
                  <Button size="sm" variant="ghost" onClick={() => remove(u)} aria-label="Delete">
                    <Trash className="size-4 text-rose-600" aria-hidden />
                  </Button>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? `Edit ${edit.name}` : 'Add person'}>
        {edit && (
          <form id="user-form" onSubmit={saveUser} className="space-y-4">
            {!edit.id && (
              <Field label="Role" htmlFor="ur">
                <Select id="ur" name="role" defaultValue={edit.role}>
                  {(['student', 'instructor', 'admin', 'employer'] as Role[]).map((r) => (
                    <option key={r} value={r}>
                      {r === 'student' ? 'Trainee' : r === 'admin' ? 'Admin / TPO' : r[0].toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
            )}
            <Field label="Full name" htmlFor="un" required>
              <Input id="un" name="name" required defaultValue={edit.name} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile" htmlFor="up">
                <Input id="up" name="phone" type="tel" defaultValue={edit.phone ?? ''} />
              </Field>
              <Field label="Email" htmlFor="ue">
                <Input id="ue" name="email" type="email" defaultValue={edit.email ?? ''} />
              </Field>
            </div>
            {(edit.role === 'student' || !edit.id) && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Enrollment no." htmlFor="uen">
                  <Input id="uen" name="enrollmentNo" defaultValue={edit.enrollmentNo ?? ''} />
                </Field>
                <Field label="Batch" htmlFor="ub" hint={edit.status === 'pending' ? 'Assign a batch to approve' : undefined}>
                  <Select id="ub" name="batchId" defaultValue={edit.batchId ?? ''}>
                    <option value="">No batch</option>
                    {batches.data?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}
            {edit.role === 'employer' && (
              <Field label="Company" htmlFor="uc">
                <Input id="uc" name="company" defaultValue={edit.company ?? ''} />
              </Field>
            )}
            {edit.id && (
              <Field label="Status" htmlFor="us">
                <Select id="us" name="status" defaultValue={edit.status === 'pending' ? 'active' : edit.status}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="disabled">Disabled</option>
                </Select>
              </Field>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
              <Button type="submit">{edit.id ? 'Save' : 'Create account'}</Button>
            </div>
          </form>
        )}
      </Modal>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} batches={batches.data ?? []} onDone={() => users.reload()} />

      <Modal open={!!temp} onClose={() => setTemp(null)} title="Temporary password" footer={<Button onClick={() => setTemp(null)}>Done</Button>}>
        {temp && (
          <div className="text-center">
            <p className="text-stone-700">Share this one-time password with {temp.name}. They will be asked to change it after signing in.</p>
            <p className="mt-4 rounded-2xl bg-brand-50 py-4 font-mono text-3xl font-bold tracking-wider text-brand-950 ring-1 ring-brand-100">{temp.password}</p>
          </div>
        )}
      </Modal>
    </>
  );
}

function ImportModal({ open, onClose, batches, onDone }: { open: boolean; onClose: () => void; batches: Batch[]; onDone: () => void }) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [batchId, setBatchId] = useState('');
  const [result, setResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);
  const rows = useMemo(() => {
    const parsed = parseCsv(text);
    if (!parsed.length) return [];
    const header = parsed[0].map((h) => h.toLowerCase());
    const hasHeader = header.some((h) => /name|enrol|phone|mobile|email/.test(h));
    const idx = (re: RegExp, fallback: number) => (hasHeader ? header.findIndex((h) => re.test(h)) : fallback);
    const iName = idx(/name/, 0), iEnr = idx(/enrol/, 1), iPhone = idx(/phone|mobile/, 2), iEmail = idx(/mail/, 3);
    return (hasHeader ? parsed.slice(1) : parsed).map((r) => ({ name: r[iName] ?? '', enrollmentNo: iEnr >= 0 ? r[iEnr] ?? '' : '', phone: iPhone >= 0 ? r[iPhone] ?? '' : '', email: iEmail >= 0 ? r[iEmail] ?? '' : '' })).filter((r) => r.name);
  }, [text]);

  async function run() {
    try {
      const r = await api<{ created: number; skipped: number; errors: string[] }>('/users/import', { method: 'POST', body: { rows, batchId: batchId || batches[0]?.id } });
      setResult(r);
      toast(`${r.created} trainees imported.`);
      onDone();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); setResult(null); }}
      title="Import trainees"
      wide
      footer={
        result ? (
          <Button onClick={() => { onClose(); setResult(null); setText(''); }}>Close</Button>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button disabled={!rows.length} onClick={run}>Import {rows.length || ''} trainees</Button>
          </>
        )
      }
    >
      {result ? (
        <div>
          <p className="text-lg font-semibold text-brand-950">{result.created} created · {result.skipped} skipped</p>
          {result.errors.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-rose-700">
              {result.errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
          <p className="mt-3 text-sm text-stone-600">Default password: <span className="font-mono">iti@</span> + last 4 digits of the mobile number (trainees must change it on first sign-in).</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Batch" htmlFor="ib">
            <Select id="ib" value={batchId} onChange={(e) => setBatchId(e.target.value)}>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Paste from Excel or CSV" htmlFor="it" hint="Columns: name, enrollment no., mobile, email (a header row is optional).">
            <Textarea id="it" rows={8} className="font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={'Name,Enrollment,Mobile,Email\nRiya Patil,ITI26COPA009,9000012345,riya@example.com'} />
          </Field>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-700">
            <Upload className="size-4" aria-hidden /> Or choose a .csv file
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setText(await f.text()); }} />
          </label>
          {rows.length > 0 && (
            <div className={cx('overflow-hidden rounded-2xl ring-1 ring-line')}>
              <p className="bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-600">Preview — {rows.length} rows</p>
              <ul className="max-h-48 divide-y divide-line overflow-y-auto text-sm">
                {rows.slice(0, 50).map((r, i) => (
                  <li key={i} className="flex justify-between gap-3 px-3 py-2">
                    <span className="font-medium text-brand-950">{r.name}</span>
                    <span className="truncate text-stone-500">{[r.enrollmentNo, r.phone].filter(Boolean).join(' · ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
