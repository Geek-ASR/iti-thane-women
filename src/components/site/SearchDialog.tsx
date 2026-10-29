'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Search, X } from 'lucide-react';
import { href, t, tx, type L, type Locale } from '@/lib/i18n';
import { mainNav, policyLinks } from '@/lib/nav';
import { trades } from '@/content/trades';
import { faqs } from '@/content/faq';
import { facilities } from '@/content/campus';
import { useCollection } from '@/lib/cms';
import { Icon } from '@/components/Icon';
import { cx } from '@/components/ui';

type Entry = { title: L; sub?: L; path: string; icon: string; kind: L; keywords?: string };

const K = {
  page: { en: 'Page', mr: 'पान' },
  trade: { en: 'Trade', mr: 'व्यवसाय' },
  faq: { en: 'FAQ', mr: 'प्रश्न' },
  lab: { en: 'Facility', mr: 'सुविधा' },
  notice: { en: 'Notice', mr: 'सूचना' },
};

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

export default function SearchDialog({ lang, onClose }: { lang: Locale; onClose: () => void }) {
  const ui = t(lang);
  const router = useRouter();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items: notices } = useCollection('notices');

  const index = useMemo<Entry[]>(() => {
    const pages: Entry[] = mainNav.flatMap((g) => [
      ...(g.path ? [{ title: g.label, path: g.path, icon: 'ArrowRight', kind: K.page }] : []),
      ...(g.links ?? []).map((l) => ({ title: l.label, sub: l.desc, path: l.path, icon: l.icon ?? 'ArrowRight', kind: K.page })),
    ]);
    const extra: Entry[] = [
      { title: { en: 'Grievance & women’s safety', mr: 'तक्रार निवारण व महिला सुरक्षा' }, path: '/grievance/', icon: 'ShieldCheck', kind: K.page, keywords: 'complaint icc posh helpline' },
      { title: { en: 'Right to Information', mr: 'माहितीचा अधिकार' }, path: '/rti/', icon: 'Scale', kind: K.page, keywords: 'rti pio' },
      { title: { en: 'Scholarships & allowances', mr: 'शिष्यवृत्ती व भत्ते' }, path: '/admissions/#support', icon: 'HandCoins', kind: K.page, keywords: 'scholarship stipend fee schindler' },
      { title: { en: 'Smart Campus — attendance, quizzes, jobs', mr: 'स्मार्ट कॅम्पस — उपस्थिती, प्रश्नमंजुषा, नोकरी' }, path: '/portal/', icon: 'QrCode', kind: K.page, keywords: 'login portal attendance quiz test' },
      ...policyLinks.map((p) => ({ title: p.label, path: p.path, icon: 'FileText', kind: K.page })),
    ];
    const tradeEntries: Entry[] = trades.map((tr) => ({ title: tr.name, sub: tr.tagline, path: `/trades/${tr.slug}/`, icon: tr.icon, kind: K.trade, keywords: `${tr.code} ${tr.sector.en} ${tr.sector.mr} ${tr.type}` }));
    const faqEntries: Entry[] = faqs.map((f) => ({ title: f.q, path: '/faq/', icon: 'CircleQuestionMark', kind: K.faq, keywords: f.a.en.slice(0, 160) }));
    const labEntries: Entry[] = facilities.map((f) => ({ title: f.title, sub: { en: f.partner ?? '', mr: f.partner ?? '' }, path: `/campus/#${f.id}`, icon: f.icon, kind: K.lab }));
    const noticeEntries: Entry[] = (notices ?? []).map((n) => ({ title: n.title, path: `/notices/#${n.id}`, icon: 'Megaphone', kind: K.notice }));
    return [...tradeEntries, ...pages, ...extra, ...labEntries, ...noticeEntries, ...faqEntries];
  }, [notices]);

  const results = useMemo(() => {
    const terms = norm(q.trim()).split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((e) => e.kind === K.trade || e.kind === K.page).slice(0, 8);
    return index
      .map((e) => {
        const title = norm(`${e.title.en} ${e.title.mr}`);
        const rest = norm(`${e.sub?.en ?? ''} ${e.sub?.mr ?? ''} ${e.keywords ?? ''}`);
        let score = 0;
        for (const term of terms) {
          if (title.includes(term)) score += title.startsWith(term) ? 4 : 3;
          else if (rest.includes(term)) score += 1;
          else return { e, score: 0 };
        }
        return { e, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.e);
  }, [q, index]);

  useEffect(() => {
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  useEffect(() => setSel(0), [q]);

  const go = (e: Entry) => {
    onClose();
    router.push(e.path.startsWith('/portal') ? e.path : href(lang, e.path));
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={ui.search} className="fixed inset-0 z-[60] flex items-start justify-center bg-brand-950/50 p-3 pt-[8vh] backdrop-blur-sm sm:p-6 sm:pt-[12vh]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex max-h-[78vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-line">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-5 shrink-0 text-brand-600" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              if (e.key === 'Enter' && results[sel]) go(results[sel]);
            }}
            placeholder={ui.searchPlaceholder}
            aria-label={ui.search}
            aria-controls="search-results"
            aria-activedescendant={results[sel] ? `sr-${sel}` : undefined}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-brand-950 outline-none placeholder:text-stone-400"
          />
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full text-stone-500 hover:bg-stone-100" aria-label={ui.close}>
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <ul id="search-results" role="listbox" className="overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-10 text-center text-sm text-stone-500">{ui.noResults}</li>}
          {results.map((r, i) => (
            <li key={`${r.path}-${i}`} id={`sr-${i}`} role="option" aria-selected={i === sel}>
              <button type="button" onMouseEnter={() => setSel(i)} onClick={() => go(r)} className={cx('flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left', i === sel ? 'bg-brand-50' : 'hover:bg-stone-50')}>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name={r.icon} className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.95rem] font-semibold text-brand-950">{tx(r.title, lang)}</span>
                  {r.sub && tx(r.sub, lang) && <span className="block truncate text-xs text-stone-500">{tx(r.sub, lang)}</span>}
                </span>
                <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[0.68rem] font-semibold text-stone-600">{tx(r.kind, lang)}</span>
                {i === sel && <CornerDownLeft className="hidden size-4 text-stone-400 sm:block" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
