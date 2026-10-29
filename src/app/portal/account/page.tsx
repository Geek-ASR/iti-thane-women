'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { FileText, LogOut, RotateCcw } from 'lucide-react';
import { api, errorMessage, tokenStore } from '@/lib/api';
import { BASE_PATH, DEMO_MODE } from '@/lib/config';
import { useAuth, useToast } from '@/lib/portal';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { Avatar, Button, Card, CardTitle, Field, Input, PageHeader, tradeLabel, UserStatusBadge } from '@/components/portal/kit';

export default function AccountPage() {
  const { logout, refresh } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (f.newPassword !== f.confirm) return toast('New passwords do not match.', 'error');
    setBusy(true);
    try {
      const res = await api<{ token?: string }>('/auth/change-password', { method: 'POST', body: { currentPassword: f.currentPassword, newPassword: f.newPassword } });
      if (res.token) tokenStore.set(res.token); // the server rotates tokens so other devices are signed out
      toast('Password updated.');
      form.reset();
      refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Guard>
      {(user) => (
        <>
          <title>Account</title>
          <PageHeader title="Account" subtitle="Your details and security" />
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <Card>
              <div className="flex items-center gap-4">
                <Avatar name={user.name} size="lg" tone="marigold" />
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-brand-950">{user.name}</p>
                  <p className="text-sm text-stone-600 capitalize">{user.role === 'admin' ? 'Admin / TPO' : user.role}</p>
                </div>
              </div>
              <dl className="mt-6 divide-y divide-line text-sm">
                {[
                  ['Status', <UserStatusBadge key="s" status={user.status} />],
                  ['Email', user.email ?? '—'],
                  ['Mobile', user.phone ?? '—'],
                  ...(user.role === 'student' ? [['Enrollment no.', user.enrollmentNo ?? '—'], ['Trade', tradeLabel(user.tradeSlug, trades)]] : []),
                  ...(user.role === 'employer' ? [['Company', user.company ?? '—']] : []),
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-stone-500">{k}</dt>
                    <dd className="text-right font-medium text-brand-950">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {user.role === 'student' && (
                  <Link href="/portal/resume/" className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50">
                    <FileText className="size-4" aria-hidden /> My resume
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="size-4" aria-hidden /> Sign out
                </Button>
              </div>
            </Card>
            <div className="space-y-6">
              <Card>
                <CardTitle>{user.mustChangePassword ? 'Set a new password (required)' : 'Change password'}</CardTitle>
                <form onSubmit={changePassword} className="space-y-4">
                  <Field label="Current password" htmlFor="cp">
                    <Input id="cp" name="currentPassword" type="password" required autoComplete="current-password" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="New password" htmlFor="np" hint="At least 6 characters">
                      <Input id="np" name="newPassword" type="password" required minLength={6} autoComplete="new-password" />
                    </Field>
                    <Field label="Confirm new password" htmlFor="np2">
                      <Input id="np2" name="confirm" type="password" required minLength={6} autoComplete="new-password" />
                    </Field>
                  </div>
                  <Button type="submit" busy={busy}>Update password</Button>
                </form>
              </Card>
              {DEMO_MODE && (
                <Card>
                  <CardTitle>Preview mode</CardTitle>
                  <p className="text-sm text-stone-600">All data in this preview lives in your browser. Resetting restores the original sample data for every module.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={async () => {
                      if (!confirm('Reset all demo data in this browser?')) return;
                      const { resetDemo } = await import('@/lib/demo/server');
                      resetDemo();
                      window.location.href = `${BASE_PATH}/portal/login/`;
                    }}
                  >
                    <RotateCcw className="size-4" aria-hidden /> Reset demo data
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </Guard>
  );
}
