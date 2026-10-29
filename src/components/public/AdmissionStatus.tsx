'use client';

import { BellRing, CircleCheck } from 'lucide-react';
import { useSiteSettings } from '@/lib/cms';
import type { Locale } from '@/lib/i18n';

/** Admin-controlled banner: “admissions open” vs “opening soon”. */
export function AdmissionStatus({ lang }: { lang: Locale }) {
  const s = useSiteSettings();
  const mr = lang === 'mr';
  const custom = mr ? s.admissionBanner_mr || s.admissionBanner_en : s.admissionBanner_en;
  return (
    <div className="container-page -mt-6 relative z-10">
      <div role="status" className={`flex items-start gap-3 rounded-2xl p-4 shadow-soft ring-1 sm:items-center ${s.admissionOpen ? 'bg-emerald-50 ring-emerald-200' : 'bg-white ring-line'}`}>
        {s.admissionOpen ? <CircleCheck className="size-6 shrink-0 text-emerald-600" aria-hidden /> : <BellRing className="size-6 shrink-0 text-marigold-600" aria-hidden />}
        <p className="text-sm text-brand-950 sm:text-base">
          <span className="font-semibold">{s.admissionOpen ? (mr ? 'प्रवेश सुरू आहेत. ' : 'Admissions are open. ') : mr ? 'प्रवेश लवकरच. ' : 'Admissions opening soon. '}</span>
          {custom || (mr ? 'वेळापत्रक जाहीर होताच येथे व सूचना फलकावर प्रसिद्ध केले जाईल.' : 'The schedule will be published here and on the notice board as soon as DVET announces it.')}
        </p>
      </div>
    </div>
  );
}
