'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, Download, ExternalLink, FileText, Link as LinkIcon, Search } from 'lucide-react';
import { groupStaff, useCollection } from '@/lib/cms';
import { t, tx, type L, type Locale } from '@/lib/i18n';
import { faqs, faqTopics, type Faq } from '@/content/faq';
import { cx } from '@/components/ui';

/* ---------- FAQ ---------- */
export function FaqList({ lang, topics }: { lang: Locale; topics?: Faq['topic'][] }) {
  const ui = t(lang);
  const [topic, setTopic] = useState<'all' | Faq['topic']>('all');
  const [q, setQ] = useState('');
  const pool = topics ? faqs.filter((f) => topics.includes(f.topic)) : faqs;
  const list = pool.filter((f) => (topic === 'all' || f.topic === topic) && (!q.trim() || `${f.q.en} ${f.q.mr} ${f.a.en} ${f.a.mr}`.toLowerCase().includes(q.trim().toLowerCase())));
  return (
    <div>
      {!topics && (
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label={ui.category} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {[{ id: 'all' as const, label: { en: 'All', mr: 'सर्व' } }, ...faqTopics].map((c) => (
              <button key={c.id} role="tab" type="button" aria-selected={topic === c.id} onClick={() => setTopic(c.id)} className={cx('h-9 shrink-0 rounded-full px-3.5 text-sm font-semibold hc-border', topic === c.id ? 'bg-brand-900 text-white' : 'bg-white text-stone-700 ring-1 ring-line hover:bg-brand-50')}>
                {tx(c.label, lang)}
              </button>
            ))}
          </div>
          <label className="relative block lg:w-72">
            <span className="sr-only">{ui.search}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={ui.search} className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-sm outline-none focus:border-brand-400" />
          </label>
        </div>
      )}
      <ul className="space-y-3">
        {list.map((f) => (
          <li key={f.q.en}>
            <details className="group rounded-2xl bg-white ring-1 ring-line open:shadow-soft">
              <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 text-left text-[1.02rem] font-semibold text-brand-950">
                {tx(f.q, lang)}
                <ChevronDown className="mt-0.5 size-5 shrink-0 text-brand-600 transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="-mt-1 px-5 pb-5 text-[0.95rem] leading-relaxed text-stone-600">{tx(f.a, lang)}</p>
            </details>
          </li>
        ))}
        {list.length === 0 && <li className="py-10 text-center text-stone-500">{ui.noResults}</li>}
      </ul>
    </div>
  );
}

/* ---------- Admission document checklist (remembered on this device) ---------- */
export const admissionDocs: { id: string; label: L; note?: L }[] = [
  { id: 'ssc', label: { en: 'SSC (10th) mark sheet & passing certificate', mr: 'दहावी गुणपत्रिका व उत्तीर्ण प्रमाणपत्र' }, note: { en: '8th pass mark sheet for Sewing Technology', mr: 'शिवणकाम तंत्रज्ञानासाठी आठवी गुणपत्रिका' } },
  { id: 'lc', label: { en: 'School leaving certificate (LC / TC)', mr: 'शाळा सोडल्याचा दाखला' } },
  { id: 'aadhaar', label: { en: 'Aadhaar card', mr: 'आधार कार्ड' } },
  { id: 'photo', label: { en: 'Recent passport-size photographs', mr: 'अलीकडील पासपोर्ट आकाराचे फोटो' } },
  { id: 'domicile', label: { en: 'Domicile / nationality certificate', mr: 'अधिवास / राष्ट्रीयत्व प्रमाणपत्र' } },
  { id: 'caste', label: { en: 'Caste certificate & caste validity', mr: 'जातीचा दाखला व जात वैधता' }, note: { en: 'Reserved categories only', mr: 'केवळ आरक्षित प्रवर्गासाठी' } },
  { id: 'ncl', label: { en: 'Non-creamy-layer certificate', mr: 'नॉन-क्रिमीलेयर प्रमाणपत्र' }, note: { en: 'Where applicable', mr: 'लागू असल्यास' } },
  { id: 'income', label: { en: 'Income certificate', mr: 'उत्पन्नाचा दाखला' }, note: { en: 'For EWS benefits, fee reimbursement and scholarships', mr: 'आर्थिक दुर्बल घटक लाभ, शुल्क प्रतिपूर्ती व शिष्यवृत्तीसाठी' } },
  { id: 'disability', label: { en: 'Disability certificate', mr: 'दिव्यांग प्रमाणपत्र' }, note: { en: 'Where applicable', mr: 'लागू असल्यास' } },
  { id: 'application', label: { en: 'Printout of the online application & allotment letter', mr: 'ऑनलाइन अर्ज व प्रवेश वाटप पत्राची प्रत' } },
];

export function DocChecklist({ lang }: { lang: Locale }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem('iti.docs') || '[]'));
    } catch {
      /* ignore */
    }
  }, []);
  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
    setDone(next);
    try {
      localStorage.setItem('iti.docs', JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };
  const pct = Math.round((done.length / admissionDocs.length) * 100);
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold text-brand-950">{lang === 'mr' ? 'माझी कागदपत्रे' : 'My documents'}</p>
        <p className="text-sm font-semibold text-brand-700 tabular-nums">
          {done.length}/{admissionDocs.length}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={lang === 'mr' ? 'तयारी' : 'Readiness'}>
        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-5 space-y-2">
        {admissionDocs.map((d) => {
          const on = done.includes(d.id);
          return (
            <li key={d.id}>
              <label className={cx('flex cursor-pointer items-start gap-3 rounded-2xl p-3 ring-1 transition-colors', on ? 'bg-emerald-50 ring-emerald-200' : 'bg-paper ring-line hover:bg-brand-50')}>
                <input type="checkbox" checked={on} onChange={() => toggle(d.id)} className="peer sr-only" />
                <span aria-hidden className={cx('mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg ring-1 peer-focus-visible:ring-2 peer-focus-visible:ring-marigold-400', on ? 'bg-emerald-600 text-white ring-emerald-600' : 'bg-white ring-stone-300')}>
                  {on && <Check className="size-4" />}
                </span>
                <span>
                  <span className={cx('block text-[0.95rem] font-medium', on ? 'text-emerald-900 line-through decoration-emerald-400' : 'text-brand-950')}>{tx(d.label, lang)}</span>
                  {d.note && <span className="block text-xs text-stone-500">{tx(d.note, lang)}</span>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-stone-500">{lang === 'mr' ? 'अंतिम यादी संचालनालयाच्या प्रवेश माहितीपुस्तिकेनुसार. आपली निवड या उपकरणावर जतन केली जाते.' : 'The final list is as per DVET’s admission brochure. Your ticks are saved on this device.'}</p>
    </div>
  );
}

/* ---------- Staff directory (CMS-backed) ---------- */
export function StaffDirectory({ lang }: { lang: Locale }) {
  const { items } = useCollection('staff');
  const groups = useMemo(() => groupStaff(items ?? []), [items]);
  if (items === null)
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-stone-200" />
        ))}
      </div>
    );
  return (
    <div className="space-y-12">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`staff-${g.id}`}>
          <h2 id={`staff-${g.id}`} className="mb-5 flex items-center gap-3 font-display text-2xl font-semibold text-brand-950">
            {tx(g.title, lang)}
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-sans text-sm font-semibold text-brand-700">{g.members.length}</span>
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.members.map((m) => {
              const initials = m.name.replace(/^(Mrs?|Miss|Ms|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('');
              return (
                <li key={m.name} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <span aria-hidden className={cx('grid size-12 shrink-0 place-items-center rounded-full font-display text-lg font-semibold', g.id === 'leadership' ? 'bg-marigold-400 text-brand-950' : 'bg-brand-100 text-brand-800')}>
                    {initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-brand-950">{m.name}</span>
                    <span className="block text-sm text-stone-600">
                      {tx(m.post, lang)}
                      {m.trade ? ` · ${m.trade}` : ''}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ---------- Downloads (CMS-backed) ---------- */
const groupTitles: Record<string, L> = {
  admission: { en: 'Admissions', mr: 'प्रवेश' },
  curriculum: { en: 'Syllabus & curriculum', mr: 'अभ्यासक्रम' },
  forms: { en: 'Forms', mr: 'अर्ज' },
  portals: { en: 'Government portals', mr: 'शासकीय पोर्टल' },
};

export function DownloadsList({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const { items } = useCollection('downloads');
  const groups = ['admission', 'curriculum', 'forms', 'portals'].map((g) => ({ g, list: (items ?? []).filter((d) => d.group === g) })).filter((x) => x.list.length);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {groups.map(({ g, list }) => (
        <section key={g} aria-labelledby={`dl-${g}`} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-line sm:p-7">
          <h2 id={`dl-${g}`} className="font-display text-xl font-semibold text-brand-950">{tx(groupTitles[g], lang)}</h2>
          <ul className="mt-4 divide-y divide-line">
            {list.map((d) => (
              <li key={d.url}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 py-4">
                  <span className={cx('grid size-11 shrink-0 place-items-center rounded-2xl', d.kind === 'pdf' ? 'bg-rose-50 text-rose-700' : d.kind === 'form' ? 'bg-marigold-50 text-marigold-800' : 'bg-brand-50 text-brand-700')}>
                    {d.kind === 'pdf' ? <FileText className="size-5" aria-hidden /> : d.kind === 'form' ? <LinkIcon className="size-5" aria-hidden /> : <ExternalLink className="size-5" aria-hidden />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-brand-950 group-hover:text-brand-700">{tx(d.title, lang)}</span>
                    <span className="block text-sm text-stone-600">{tx(d.desc, lang)}</span>
                  </span>
                  {d.kind === 'pdf' ? <Download className="mt-1 size-5 shrink-0 text-stone-400 group-hover:text-brand-700" aria-label={ui.download} /> : <ArrowUpRight className="mt-1 size-5 shrink-0 text-stone-400 group-hover:text-brand-700" aria-hidden />}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
