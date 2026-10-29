'use client';

import Link from 'next/link';
import { Mail, MapPin, Pencil, Phone, Printer } from 'lucide-react';
import { useApi } from '@/lib/portal';
import type { Profile, User } from '@/lib/types';
import { trades } from '@/content/trades';
import { Guard } from '@/components/portal/Guard';
import { Button, buttonClass, ErrorNote, Loading, tradeLabel } from '@/components/portal/kit';

export default function ResumePage() {
  return <Guard roles={['student']}>{(u) => <Resume user={u} />}</Guard>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2 className="mb-2 border-b-2 border-brand-900 pb-1 text-xs font-bold tracking-[0.16em] text-brand-900 uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Resume({ user }: { user: User }) {
  const { data: p, error, loading } = useApi<Profile>('/profile/me');
  if (error) return <ErrorNote message={error} />;
  if (loading || !p) return <Loading />;
  return (
    <>
      <title>{`Resume — ${user.name}`}</title>
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/portal/profile/" className={buttonClass('outline', 'md')}>
          <Pencil className="size-4" aria-hidden /> Edit profile
        </Link>
        <Button variant="accent" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden /> Print / save as PDF
        </Button>
      </div>
      <article className="mx-auto max-w-[52rem] bg-white p-7 text-[0.93rem] leading-relaxed text-stone-800 shadow-soft ring-1 ring-line sm:p-12 print:max-w-none print:p-0 print:shadow-none print:ring-0">
        <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold text-brand-950">{user.name}</h1>
            <p className="mt-1 text-lg text-brand-700">{p.headline || `${tradeLabel(user.tradeSlug, trades)} trainee`}</p>
          </div>
          <ul className="space-y-1 text-sm text-stone-600 sm:text-right">
            {user.phone && <li className="flex items-center gap-2 sm:justify-end"><Phone className="size-3.5" aria-hidden /> {user.phone}</li>}
            {user.email && <li className="flex items-center gap-2 sm:justify-end"><Mail className="size-3.5" aria-hidden /> {user.email}</li>}
            {p.address && <li className="flex items-center gap-2 sm:justify-end"><MapPin className="size-3.5" aria-hidden /> {p.address}</li>}
          </ul>
        </header>
        <div className="mt-6 grid gap-7 sm:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {p.about && (
              <Section title="Profile">
                <p>{p.about}</p>
              </Section>
            )}
            <Section title="Education">
              <ul className="space-y-2">
                {(p.education.length ? p.education : [{ title: `ITI — ${tradeLabel(user.tradeSlug, trades)} (NCVT)`, institute: 'Govt. ITI (Women), Thane', year: '', score: 'Pursuing' }]).map((e) => (
                  <li key={e.title}>
                    <p className="font-semibold text-brand-950">{e.title}</p>
                    <p className="text-sm text-stone-600">
                      {e.institute}
                      {e.year && ` · ${e.year}`}
                      {e.score && ` · ${e.score}`}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
            {!!p.projects.length && (
              <Section title="Projects">
                <ul className="space-y-2">
                  {p.projects.map((pr) => (
                    <li key={pr.title}>
                      <p className="font-semibold text-brand-950">{pr.title}</p>
                      <p className="text-sm">{pr.description}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
          <div className="space-y-6">
            <Section title="Trade">
              <p className="font-semibold text-brand-950">{tradeLabel(user.tradeSlug, trades)}</p>
              {user.enrollmentNo && <p className="text-sm text-stone-600">Enrollment: {user.enrollmentNo}</p>}
              <p className="text-sm text-stone-600">Govt. ITI (Women), Thane</p>
            </Section>
            {!!p.skills.length && (
              <Section title="Skills">
                <ul className="space-y-1">
                  {p.skills.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-marigold-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {!!p.certifications.length && (
              <Section title="Training & certificates">
                <ul className="space-y-1 text-sm">
                  {p.certifications.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Section>
            )}
            {!!p.languages.length && (
              <Section title="Languages">
                <p>{p.languages.join(' · ')}</p>
              </Section>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
