'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Database, KeyRound, Server } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { API_URL, DEMO_MODE } from '@/lib/config';
import { useApi, useToast } from '@/lib/portal';
import type { SiteSettings } from '@/lib/types';
import { Guard } from '@/components/portal/Guard';
import { Button, Card, CardTitle, ErrorNote, Field, Input, Loading, PageHeader, Toggle } from '@/components/portal/kit';

export default function SettingsPage() {
  return <Guard roles={['admin']}>{() => <Settings />}</Guard>;
}

function Settings() {
  const toast = useToast();
  const { data, error, loading } = useApi<SiteSettings>('/settings');
  const [s, setS] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (data) setS(data);
  }, [data]);
  if (error) return <ErrorNote message={error} />;
  if (loading || !s) return <Loading />;

  async function save() {
    setBusy(true);
    try {
      setS(await api<SiteSettings>('/settings', { method: 'PUT', body: s }));
      toast('Settings saved — the website updates right away.');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <title>Settings</title>
      <PageHeader title="Settings" subtitle="Site-wide switches and system information." />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="space-y-4">
          <CardTitle>Website</CardTitle>
          <Toggle checked={s.tickerEnabled} onChange={(v) => setS({ ...s, tickerEnabled: v })} label="Show “Latest” notice ticker" hint="The scrolling strip under the header." />
          <Toggle checked={s.admissionOpen} onChange={(v) => setS({ ...s, admissionOpen: v })} label="Admissions are open" hint="Shows a green “Admissions are open” banner on the Admissions page." />
          <Field label="Admission banner (English)" htmlFor="ab" hint="e.g. CAP round 1 option form open till 30 June">
            <Input id="ab" value={s.admissionBanner_en} onChange={(e) => setS({ ...s, admissionBanner_en: e.target.value })} />
          </Field>
          <Field label="Admission banner (Marathi)" htmlFor="abm">
            <Input id="abm" value={s.admissionBanner_mr} onChange={(e) => setS({ ...s, admissionBanner_mr: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Office hours (English)" htmlFor="oh">
              <Input id="oh" value={s.officeHours_en} onChange={(e) => setS({ ...s, officeHours_en: e.target.value })} placeholder="Mon–Fri, 10:00–17:30" />
            </Field>
            <Field label="Office hours (Marathi)" htmlFor="ohm">
              <Input id="ohm" value={s.officeHours_mr} onChange={(e) => setS({ ...s, officeHours_mr: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button variant="accent" busy={busy} onClick={save}>Save settings</Button>
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardTitle>System</CardTitle>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Server className="mt-0.5 size-5 text-brand-600" aria-hidden />
                <div>
                  <dt className="font-semibold text-brand-950">Data source</dt>
                  <dd className="text-stone-600">{DEMO_MODE ? 'Preview mode — sample data stored in this browser.' : `Live API · ${API_URL}`}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="mt-0.5 size-5 text-brand-600" aria-hidden />
                <div>
                  <dt className="font-semibold text-brand-950">Going live</dt>
                  <dd className="text-stone-600">Deploy the backend, then set the repository variable <span className="font-mono">API_URL</span> and re-run the Pages deployment. See the README for step-by-step instructions.</dd>
                </div>
              </div>
            </dl>
          </Card>
          <Card>
            <CardTitle>Your account</CardTitle>
            <Link href="/portal/account/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
              <KeyRound className="size-4" aria-hidden /> Change password
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}
