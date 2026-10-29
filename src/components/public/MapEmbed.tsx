'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { institute } from '@/content/institute';
import { t, tx, type Locale } from '@/lib/i18n';
import { buttonClass } from '@/components/ui';

/** Click-to-load map: keeps ~1 MB of Google Maps scripts off the page until the visitor asks for it. */
export function MapEmbed({ lang, className = '' }: { lang: Locale; className?: string }) {
  const ui = t(lang);
  const [load, setLoad] = useState(false);
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-brand-50 ring-1 ring-line ${className}`}>
      {load ? (
        <iframe title={lang === 'mr' ? 'संस्थेचे स्थान — नकाशा' : 'Institute location map'} src={institute.mapEmbed} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className="bg-dots-ink absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <svg aria-hidden viewBox="0 0 400 240" className="absolute inset-0 h-full w-full text-brand-200" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
              <path d="M-20 170 C 80 150 140 190 220 160 S 360 120 430 140" />
              <path d="M120 -20 C 130 60 160 120 150 260" strokeWidth="6" />
              <path d="M300 -20 C 280 80 300 160 270 260" strokeWidth="6" />
            </g>
            <path d="M-20 60 C 60 80 120 40 200 70 S 330 60 430 40" fill="none" stroke="#a5d8ff" strokeWidth="14" opacity="0.6" />
          </svg>
          <span className="relative grid size-14 place-items-center rounded-full bg-marigold-400 text-brand-950 shadow-lift animate-pulse-ring">
            <MapPin className="size-7" aria-hidden />
          </span>
          <div className="relative">
            <p className="font-display text-lg font-semibold text-brand-950">Kopri Colony, Thane (East)</p>
            <p className="mt-1 max-w-xs text-sm text-stone-600">{tx(institute.address, lang)}</p>
          </div>
          <div className="relative flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setLoad(true)} className={buttonClass('primary', 'sm')}>
              <MapPin className="size-4" aria-hidden />
              {lang === 'mr' ? 'नकाशा दाखवा' : 'Show map'}
            </button>
            <a href={institute.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('outline', 'sm')}>
              <Navigation className="size-4" aria-hidden />
              {ui.directions}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
