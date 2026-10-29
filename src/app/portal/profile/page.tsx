'use client';

import Link from 'next/link';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { FileText, Plus, Trash, X } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { useApi, useToast } from '@/lib/portal';
import type { Profile } from '@/lib/types';
import { Meter } from '@/components/charts';
import { Guard } from '@/components/portal/Guard';
import { Button, buttonClass, Card, CardTitle, ErrorNote, Field, Input, Loading, PageHeader, Textarea } from '@/components/portal/kit';

const SKILL_IDEAS = ['House wiring', 'Panel wiring', 'Soldering', 'PCB assembly', 'MS Office', 'Typing (Eng/Marathi)', 'Hardware & networking', 'Hair styling', 'Makeup', 'Pattern making', 'Machine stitching', 'AutoCAD basics', 'Customer service'];

function Chips({ values, onChange, placeholder, ideas }: { values: string[]; onChange: (v: string[]) => void; placeholder: string; ideas?: string[] }) {
  const [text, setText] = useState('');
  const add = (v: string) => {
    const t = v.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setText('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-100">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="grid size-6 place-items-center rounded-full hover:bg-brand-100" aria-label={`Remove ${v}`}>
              <X className="size-3.5" aria-hidden />
            </button>
          </span>
        ))}
      </div>
      <Input className="mt-2" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text); } }} onBlur={() => add(text)} placeholder={placeholder} aria-label={placeholder} />
      {ideas && (
        <p className="mt-2 flex flex-wrap gap-1.5">
          {ideas.filter((i) => !values.includes(i)).slice(0, 8).map((i) => (
            <button key={i} type="button" onClick={() => add(i)} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 hover:bg-stone-200">
              + {i}
            </button>
          ))}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return <Guard roles={['student']}>{() => <ProfileEditor />}</Guard>;
}

function ProfileEditor() {
  const toast = useToast();
  const { data, error, loading } = useApi<Profile>('/profile/me');
  const [p, setP] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (data) setP(data);
  }, [data]);
  if (error) return <ErrorNote message={error} />;
  if (loading || !p) return <Loading />;

  const filled = [p.headline, p.about, p.skills.length, p.education.length, p.languages.length, p.certifications.length || p.projects.length, p.address].filter(Boolean).length;
  const completeness = Math.round((filled / 7) * 100);
  const set = (patch: Partial<Profile>) => setP({ ...p, ...patch });

  async function save() {
    setBusy(true);
    try {
      setP(await api<Profile>('/profile/me', { method: 'PUT', body: p }));
      toast('Profile saved.');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pb-24">
      <title>My profile</title>
      <PageHeader
        title="Profile & resume"
        subtitle="Employers see this when you apply. A complete profile gets shortlisted faster."
        actions={
          <Link href="/portal/resume/" className={buttonClass('outline', 'md')}>
            <FileText className="size-4" aria-hidden /> View resume
          </Link>
        }
      />
      <Card className="mb-6">
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="font-semibold text-brand-950">Profile strength</p>
          <p className="font-bold text-brand-800">{completeness}%</p>
        </div>
        <div className="mt-2">
          <Meter value={completeness} threshold={80} label="Profile completeness" />
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <CardTitle>About you</CardTitle>
          <Field label="Headline" htmlFor="ph" hint="One line, e.g. “Electrician trainee · wiring & solar PV”">
            <Input id="ph" value={p.headline} maxLength={120} onChange={(e) => set({ headline: e.target.value })} />
          </Field>
          <Field label="Summary" htmlFor="pa">
            <Textarea id="pa" rows={5} value={p.about} maxLength={1500} onChange={(e) => set({ about: e.target.value })} placeholder="Your training, interests and the kind of work you want." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date of birth" htmlFor="pd">
              <Input id="pd" type="date" value={p.dob} onChange={(e) => set({ dob: e.target.value })} />
            </Field>
            <Field label="Locality / city" htmlFor="pl">
              <Input id="pl" value={p.address} onChange={(e) => set({ address: e.target.value })} placeholder="e.g. Kopri, Thane (East)" />
            </Field>
          </div>
        </Card>
        <Card className="space-y-5">
          <CardTitle>Skills & languages</CardTitle>
          <Field label="Skills">
            <Chips values={p.skills} onChange={(skills) => set({ skills })} placeholder="Type a skill and press Enter" ideas={SKILL_IDEAS} />
          </Field>
          <Field label="Languages">
            <Chips values={p.languages} onChange={(languages) => set({ languages })} placeholder="e.g. Marathi" ideas={['Marathi', 'Hindi', 'English']} />
          </Field>
          <Field label="Certifications & training">
            <Chips values={p.certifications} onChange={(certifications) => set({ certifications })} placeholder="e.g. OJT at Tata Power (15 days)" />
          </Field>
        </Card>
        <Card className="space-y-4">
          <CardTitle action={<Button size="sm" variant="ghost" onClick={() => set({ education: [...p.education, { title: '', institute: '', year: '', score: '' }] })}><Plus className="size-4" aria-hidden /> Add</Button>}>Education</CardTitle>
          {p.education.length === 0 && <p className="text-sm text-stone-500">Add your ITI course and SSC details.</p>}
          {p.education.map((e, i) => (
            <div key={i} className="grid gap-2 rounded-2xl bg-paper p-3 ring-1 ring-line sm:grid-cols-2">
              <Input value={e.title} onChange={(ev) => set({ education: p.education.map((x, k) => (k === i ? { ...x, title: ev.target.value } : x)) })} placeholder="Course, e.g. ITI — Electrician" aria-label="Course" />
              <Input value={e.institute} onChange={(ev) => set({ education: p.education.map((x, k) => (k === i ? { ...x, institute: ev.target.value } : x)) })} placeholder="Institute / board" aria-label="Institute" />
              <Input value={e.year} onChange={(ev) => set({ education: p.education.map((x, k) => (k === i ? { ...x, year: ev.target.value } : x)) })} placeholder="Year" aria-label="Year" />
              <div className="flex gap-2">
                <Input value={e.score} onChange={(ev) => set({ education: p.education.map((x, k) => (k === i ? { ...x, score: ev.target.value } : x)) })} placeholder="Score" aria-label="Score" />
                <Button variant="ghost" size="sm" onClick={() => set({ education: p.education.filter((_, k) => k !== i) })} aria-label="Remove">
                  <Trash className="size-4 text-rose-600" aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <CardTitle action={<Button size="sm" variant="ghost" onClick={() => set({ projects: [...p.projects, { title: '', description: '' }] })}><Plus className="size-4" aria-hidden /> Add</Button>}>Projects</CardTitle>
          {p.projects.length === 0 && <p className="text-sm text-stone-500">Exhibition models, practical projects or anything you built.</p>}
          {p.projects.map((pr, i) => (
            <div key={i} className="space-y-2 rounded-2xl bg-paper p-3 ring-1 ring-line">
              <div className="flex gap-2">
                <Input value={pr.title} onChange={(ev) => set({ projects: p.projects.map((x, k) => (k === i ? { ...x, title: ev.target.value } : x)) })} placeholder="Project title" aria-label="Project title" />
                <Button variant="ghost" size="sm" onClick={() => set({ projects: p.projects.filter((_, k) => k !== i) })} aria-label="Remove">
                  <Trash className="size-4 text-rose-600" aria-hidden />
                </Button>
              </div>
              <Textarea rows={2} value={pr.description} onChange={(ev) => set({ projects: p.projects.map((x, k) => (k === i ? { ...x, description: ev.target.value } : x)) })} placeholder="What did you make and how?" aria-label="Project description" />
            </div>
          ))}
        </Card>
      </div>
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-72">
        <div className="mx-auto flex max-w-6xl justify-end">
          <Button variant="accent" busy={busy} onClick={save}>
            Save profile
          </Button>
        </div>
      </div>
    </div>
  );
}
