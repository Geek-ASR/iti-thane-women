import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { asset, BUILD_DATE } from '@/lib/config';
import { formatDate, href, t, tx, type Locale } from '@/lib/i18n';
import { footerColumns, policyLinks } from '@/lib/nav';
import { institute } from '@/content/institute';
import { officialLinks } from '@/content/updates';
import { ThreadCircuit } from '@/components/ui';

export function SiteFooter({ lang }: { lang: Locale }) {
  const ui = t(lang);
  const year = new Date(BUILD_DATE).getFullYear();
  return (
    <footer className="relative isolate overflow-hidden bg-brand-950 pb-28 text-white/80 lg:pb-0">
      <ThreadCircuit className="absolute inset-x-0 top-0 -z-10 h-48 w-full text-white/[0.06]" />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr] lg:gap-16 lg:py-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset('/brand/dvet-logo.png')} alt={ui.dvet} width={56} height={56} className="size-[88%] object-contain" loading="lazy" />
            </span>
            <div>
              <p className="font-display text-lg leading-tight font-semibold text-white">{ui.shortName}</p>
              <p className="text-xs text-white/60">{ui.dept}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{ui.fullName}</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-marigold-300" aria-hidden />
              <a href={institute.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {tx(institute.address, lang)}
              </a>
            </li>
            {institute.phones.map((p) => (
              <li key={p.tel} className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-marigold-300" aria-hidden />
                <a href={`tel:${p.tel}`} className="hover:text-white">
                  {p.display} <span className="text-white/50">· {tx(p.label, lang)}</span>
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-marigold-300" aria-hidden />
              <a href={`mailto:${institute.email}`} className="break-all hover:text-white">
                {institute.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/brand/skill-india.png')} alt="Skill India" className="h-10 w-auto rounded-md bg-white p-1" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/brand/iti-logo.png')} alt="Industrial Training Institute" className="h-10 w-auto rounded-md bg-white p-1" loading="lazy" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.title.en}>
              <p className="text-xs font-bold tracking-[0.14em] text-marigold-300 uppercase">{tx(col.title, lang)}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.path}>
                    <Link href={l.path.startsWith('/portal') ? l.path : href(lang, l.path)} className="hover:text-white">
                      {tx(l.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-bold tracking-[0.14em] text-marigold-300 uppercase">{ui.importantLinks}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {officialLinks.slice(0, 6).map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">
                    {tx(l.label, lang)} <ArrowUpRight className="size-3 opacity-60" aria-hidden />
                    <span className="sr-only">{lang === 'mr' ? '(नवीन टॅबमध्ये उघडते)' : '(opens in a new tab)'}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {policyLinks.map((p) => (
              <li key={p.path}>
                <Link href={href(lang, p.path)} className="hover:text-white">
                  {tx(p.label, lang)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-1 lg:items-end">
            <p>
              © {year} {ui.rights}
            </p>
            <p>
              {ui.lastUpdated}: {formatDate(BUILD_DATE, lang)} · {ui.designedBy} <span className="font-semibold text-white/80">Aditya Rekhe</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
