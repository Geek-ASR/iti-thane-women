'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff, GraduationCap, KeyRound, QrCode, ShieldCheck, UserRound } from 'lucide-react';
import { asset, BASE_PATH, DEMO_MODE } from '@/lib/config';
import { errorMessage } from '@/lib/api';
import { useAuth } from '@/lib/portal';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '@/lib/demo/accounts';
import { Button, cx, Field, Input } from '@/components/portal/kit';

const ICONS = { student: GraduationCap, instructor: QrCode, admin: ShieldCheck, employer: BriefcaseBusiness } as const;

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const go = () => router.replace(next && next.startsWith('/portal') ? next : '/portal/dashboard/');
  useEffect(() => {
    if (!loading && user) go();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  async function submit(e?: FormEvent, id = identifier, pw = password) {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(id, pw);
      go();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100dvh-2.25rem)] lg:grid-cols-[1.05fr_1fr]">
      <title>Sign in</title>
      <div className="relative isolate hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="bg-dots absolute inset-0 -z-10 opacity-50" />
        <div aria-hidden className="absolute -right-24 -bottom-24 -z-10 size-[30rem] rounded-full bg-brand-600/40 blur-3xl" />
        <a href={`${BASE_PATH}/en/`} className="flex items-center gap-3">
          <span className="grid size-12 place-items-center overflow-hidden rounded-full bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/brand/dvet-logo.png')} alt="" className="size-[88%] object-contain" />
          </span>
          <span>
            <span className="block font-display text-lg font-semibold">Govt. ITI (Women), Thane</span>
            <span className="block text-xs text-white/60">Rajmata Jijau · Est. 1992</span>
          </span>
        </a>
        <div>
          <p className="text-sm font-bold tracking-[0.14em] text-marigold-300 uppercase">Smart Campus</p>
          <h1 className="display-tight mt-3 font-display text-5xl leading-[1.05] font-semibold">Attendance, tests and jobs — in one place.</h1>
          <ul className="mt-8 space-y-3 text-white/80">
            {['Scan the rotating QR to mark attendance in seconds', 'Take timed quizzes and review your answers', 'Apply to verified openings with a ready-made resume'].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-marigold-400" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/50">Directorate of Vocational Education & Training, Maharashtra</p>
      </div>

      <div className="flex items-start justify-center px-4 py-10 sm:items-center sm:py-12">
        <div className="w-full max-w-md">
          <a href={`${BASE_PATH}/en/`} className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset('/brand/dvet-logo.png')} alt="" className="size-[88%] object-contain" />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold text-brand-950">Smart Campus</span>
              <span className="block text-xs text-stone-500">Govt. ITI (Women), Thane</span>
            </span>
          </a>
          <h2 className="font-display text-3xl font-semibold text-brand-950">Welcome back</h2>
          <p className="mt-1 text-stone-600">Sign in with your email, mobile or enrollment number.</p>

          {DEMO_MODE && (
            <div className="mt-6 rounded-3xl bg-brand-50 p-4 ring-1 ring-brand-100">
              <p className="text-sm font-semibold text-brand-950">Try a demo account — one tap</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((a) => {
                  const Icon = ICONS[a.role];
                  return (
                    <button key={a.role} type="button" disabled={busy} onClick={() => submit(undefined, a.identifier, DEMO_PASSWORD)} className="flex items-start gap-2.5 rounded-2xl bg-white p-3 text-left ring-1 ring-line transition hover:ring-brand-300 disabled:opacity-60">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-900 text-marigold-300">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-brand-950">{a.label}</span>
                        <span className="block truncate text-[0.7rem] text-stone-500">{a.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[0.7rem] text-stone-500">Password for all demo accounts: <span className="font-mono font-semibold text-brand-900">{DEMO_PASSWORD}</span></p>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email, mobile or enrollment no." htmlFor="identifier">
              <div className="relative">
                <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
                <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" required className="h-12 pl-10" placeholder="e.g. ITI25ELE001" />
              </div>
            </Field>
            <Field label="Password" htmlFor="password">
              <div className="relative">
                <KeyRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
                <Input id="password" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="h-12 pr-12 pl-10" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-stone-500 hover:bg-stone-100" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
            </Field>
            {error && (
              <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" busy={busy} className="w-full">
              Sign in <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            New here?{' '}
            <Link href="/portal/register/" className="font-semibold text-brand-700 hover:underline">
              Create a trainee account
            </Link>{' '}
            ·{' '}
            <Link href="/portal/register/?role=employer" className="font-semibold text-brand-700 hover:underline">
              Register as employer
            </Link>
          </p>
          <p className={cx('mt-3 text-center text-xs text-stone-500')}>Forgot your password? Contact the institute office to reset it.</p>
        </div>
      </div>
    </div>
  );
}
