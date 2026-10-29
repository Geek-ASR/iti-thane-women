'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { errorMessage } from '@/lib/api';
import { useAuth } from '@/lib/portal';
import { trades } from '@/content/trades';
import { Button, cx, Field, Input, Select } from '@/components/portal/kit';

export default function RegisterPage() {
  const params = useSearchParams();
  const [role, setRole] = useState<'student' | 'employer'>(params.get('role') === 'employer' ? 'employer' : 'student');
  const { register } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (f.password !== f.confirm) return setError('Passwords do not match.');
    setBusy(true);
    setError('');
    try {
      await register({ ...f, role });
      router.replace('/portal/dashboard/');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-2.25rem)] justify-center px-4 py-10">
      <title>Create account</title>
      <div className="w-full max-w-lg">
        <Link href="/portal/login/" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Back to sign in
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-brand-950">Create your account</h1>
        <p className="mt-1 text-stone-600">Accounts are activated after verification by the institute.</p>
        <div role="tablist" className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 ring-1 ring-line">
          {[
            { id: 'student' as const, label: 'I am a trainee', icon: GraduationCap },
            { id: 'employer' as const, label: 'I am an employer', icon: BriefcaseBusiness },
          ].map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={role === t.id} onClick={() => setRole(t.id)} className={cx('flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold', role === t.id ? 'bg-brand-900 text-white' : 'text-stone-700 hover:bg-brand-50')}>
              <t.icon className="size-4" aria-hidden /> {t.label}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-7">
          <Field label={role === 'employer' ? 'Your name' : 'Full name'} htmlFor="r-name" required>
            <Input id="r-name" name="name" required autoComplete="name" />
          </Field>
          {role === 'employer' && (
            <Field label="Company name" htmlFor="r-company" required>
              <Input id="r-company" name="company" required autoComplete="organization" />
            </Field>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="r-email" required>
              <Input id="r-email" name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Mobile number" htmlFor="r-phone" required>
              <Input id="r-phone" name="phone" type="tel" inputMode="numeric" required autoComplete="tel-national" />
            </Field>
          </div>
          {role === 'student' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trade" htmlFor="r-trade" required>
                <Select id="r-trade" name="tradeSlug" required defaultValue="">
                  <option value="" disabled>
                    Select your trade
                  </option>
                  {trades.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {(t.short ?? t.name).en}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Enrollment no." htmlFor="r-enr" hint="If you have one">
                <Input id="r-enr" name="enrollmentNo" />
              </Field>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Password" htmlFor="r-pw" required hint="At least 6 characters">
              <Input id="r-pw" name="password" type="password" required minLength={6} autoComplete="new-password" />
            </Field>
            <Field label="Confirm password" htmlFor="r-pw2" required>
              <Input id="r-pw2" name="confirm" type="password" required minLength={6} autoComplete="new-password" />
            </Field>
          </div>
          {error && (
            <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" busy={busy} className="w-full">
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
