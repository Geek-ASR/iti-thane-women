'use client';

import { useState, type FormEvent } from 'react';
import { CircleCheck, Loader, Send, ShieldCheck } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import { DEMO_MODE } from '@/lib/config';
import { t, tx, type L, type Locale } from '@/lib/i18n';
import { trades } from '@/content/trades';
import type { Enquiry, EnquiryType } from '@/lib/types';
import { buttonClass, cx } from '@/components/ui';

const field = 'h-12 w-full rounded-xl border border-line bg-white px-4 text-[0.95rem] text-brand-950 outline-none transition placeholder:text-stone-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100';
const labelCls = 'mb-1.5 block text-sm font-semibold text-brand-950';

const grievanceCats: L[] = [
  { en: 'Academic / training', mr: 'शैक्षणिक / प्रशिक्षण' },
  { en: 'Scholarship / fees', mr: 'शिष्यवृत्ती / शुल्क' },
  { en: 'Hostel', mr: 'वसतिगृह' },
  { en: 'Facilities / infrastructure', mr: 'सुविधा / पायाभूत' },
  { en: 'Harassment / safety (ICC)', mr: 'छळ / सुरक्षितता (अंतर्गत तक्रार समिती)' },
  { en: 'Other', mr: 'इतर' },
];
const industryInterests: L[] = [
  { en: 'Campus recruitment', mr: 'कॅम्पस भरती' },
  { en: 'Apprenticeship / OJT', mr: 'शिकाऊ उमेदवारी / OJT' },
  { en: 'CSR / lab partnership', mr: 'CSR / प्रयोगशाळा भागीदारी' },
  { en: 'Guest lecture / workshop', mr: 'अतिथी व्याख्यान / कार्यशाळा' },
];
const qualifications: L[] = [
  { en: '10th pass (Science & Maths)', mr: 'दहावी उत्तीर्ण (विज्ञान व गणित)' },
  { en: '10th pass', mr: 'दहावी उत्तीर्ण' },
  { en: '12th pass or above', mr: 'बारावी किंवा अधिक' },
  { en: '8th / 9th pass', mr: 'आठवी / नववी उत्तीर्ण' },
  { en: 'Appearing for 10th', mr: 'दहावीची परीक्षा देत आहे' },
];

export function EnquiryForm({ lang, type, compact, defaultTrade = '' }: { lang: Locale; type: EnquiryType; compact?: boolean; defaultTrade?: string }) {
  const ui = t(lang);
  const mr = lang === 'mr';
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [ref, setRef] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('website')) return; // honeypot
    const phone = String(f.get('phone') ?? '').replace(/[\s-]/g, '').replace(/^(\+91|0)/, '');
    if (!(type === 'grievance' && anonymous) && !/^[6-9]\d{9}$/.test(phone)) {
      setState('error');
      setError(mr ? 'कृपया वैध १० अंकी मोबाईल क्रमांक लिहा.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    const body = {
      type,
      name: anonymous ? '' : String(f.get('name') ?? '').trim(),
      phone: anonymous ? '' : phone,
      email: anonymous ? '' : String(f.get('email') ?? '').trim(),
      trade: String(f.get('trade') ?? ''),
      subject: String(f.get('subject') ?? ''),
      message: String(f.get('message') ?? '').trim(),
      anonymous,
    };
    setState('sending');
    try {
      const res = await api<Enquiry>('/enquiries', { method: 'POST', body });
      setRef(res.id.slice(-6).toUpperCase());
      setState('done');
    } catch (err) {
      setState('error');
      setError(errorMessage(err) || ui.formError);
    }
  }

  if (state === 'done')
    return (
      <div role="status" className="flex flex-col items-center rounded-3xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
        <CircleCheck className="size-12 text-emerald-600" aria-hidden />
        <p className="mt-4 font-display text-2xl font-semibold text-brand-950">{ui.sent}</p>
        <p className="mt-2 text-sm text-stone-600">
          {mr ? 'संदर्भ क्रमांक' : 'Reference'}: <span className="font-mono font-bold text-brand-900">#{ref}</span>
        </p>
        <p className="mt-1 text-sm text-stone-600">{type === 'grievance' ? (mr ? 'आपल्या तक्रारीची गोपनीय दखल घेतली जाईल.' : 'Your grievance will be reviewed confidentially.') : mr ? 'आमचे कार्यालय लवकरच संपर्क साधेल.' : 'Our office will get back to you shortly.'}</p>
        <button type="button" onClick={() => setState('idle')} className={buttonClass('outline', 'sm', 'mt-6')}>
          {mr ? 'आणखी एक संदेश पाठवा' : 'Send another'}
        </button>
      </div>
    );

  const showIdentity = !(type === 'grievance' && anonymous);
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {type === 'grievance' && (
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="mt-1 size-5 accent-brand-700" />
          <span>
            <span className="block text-sm font-semibold text-brand-950">{mr ? 'नाव न सांगता तक्रार करा' : 'Submit anonymously'}</span>
            <span className="block text-xs text-stone-600">{mr ? 'आपले नाव व संपर्क नोंदवले जाणार नाहीत. मात्र त्यामुळे आम्हाला उत्तर देता येणार नाही.' : 'Your name and contact will not be recorded — but we will not be able to reply to you.'}</span>
          </span>
        </label>
      )}
      {showIdentity && (
        <div className={cx('grid gap-4', !compact && 'sm:grid-cols-2')}>
          <div>
            <label htmlFor={`${type}-name`} className={labelCls}>
              {type === 'industry' ? (mr ? 'संपर्क व्यक्तीचे नाव' : 'Contact person') : ui.name} <span className="text-rose-600">*</span>
            </label>
            <input id={`${type}-name`} name="name" required autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor={`${type}-phone`} className={labelCls}>
              {ui.phone} <span className="text-rose-600">*</span>
            </label>
            <input id={`${type}-phone`} name="phone" type="tel" inputMode="numeric" required autoComplete="tel-national" placeholder="98XXXXXXXX" className={field} />
          </div>
          {type !== 'admission' && (
            <div className={cx(!compact && 'sm:col-span-2')}>
              <label htmlFor={`${type}-email`} className={labelCls}>{ui.emailAddr}</label>
              <input id={`${type}-email`} name="email" type="email" autoComplete="email" className={field} />
            </div>
          )}
        </div>
      )}
      {type === 'admission' && (
        <div className={cx('grid gap-4', !compact && 'sm:grid-cols-2')}>
          <div>
            <label htmlFor="adm-trade" className={labelCls}>{ui.tradeInterest}</label>
            <select id="adm-trade" name="trade" className={field} defaultValue={defaultTrade}>
              <option value="">{ui.any}</option>
              {trades.map((tr) => (
                <option key={tr.slug} value={tr.slug}>{tx(tr.name, lang)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="adm-qual" className={labelCls}>{mr ? 'शैक्षणिक पात्रता' : 'Qualification'}</label>
            <select id="adm-qual" name="subject" className={field} defaultValue="">
              <option value="" disabled>{mr ? 'निवडा' : 'Select'}</option>
              {qualifications.map((q) => (
                <option key={q.en} value={q.en}>{tx(q, lang)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {type === 'grievance' && (
        <div>
          <label htmlFor="gr-cat" className={labelCls}>{ui.category}</label>
          <select id="gr-cat" name="subject" className={field} defaultValue={grievanceCats[0].en}>
            {grievanceCats.map((c) => (
              <option key={c.en} value={c.en}>{tx(c, lang)}</option>
            ))}
          </select>
        </div>
      )}
      {type === 'industry' && (
        <div className={cx('grid gap-4', !compact && 'sm:grid-cols-2')}>
          <div>
            <label htmlFor="ind-company" className={labelCls}>{mr ? 'कंपनीचे नाव' : 'Company'} <span className="text-rose-600">*</span></label>
            <input id="ind-company" name="trade" required autoComplete="organization" className={field} />
          </div>
          <div>
            <label htmlFor="ind-interest" className={labelCls}>{mr ? 'सहकार्याचा प्रकार' : 'Interested in'}</label>
            <select id="ind-interest" name="subject" className={field} defaultValue={industryInterests[0].en}>
              {industryInterests.map((c) => (
                <option key={c.en} value={c.en}>{tx(c, lang)}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {type === 'contact' && (
        <div>
          <label htmlFor="ct-subject" className={labelCls}>{mr ? 'विषय' : 'Subject'}</label>
          <input id="ct-subject" name="subject" className={field} />
        </div>
      )}
      <div>
        <label htmlFor={`${type}-msg`} className={labelCls}>
          {ui.message} {(type === 'grievance' || type === 'contact') && <span className="text-rose-600">*</span>}
        </label>
        <textarea id={`${type}-msg`} name="message" rows={compact ? 3 : 4} required={type === 'grievance' || type === 'contact'} className={cx(field, 'h-auto py-3')} />
      </div>
      {state === 'error' && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs text-stone-500">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
          {DEMO_MODE ? ui.demoNote : mr ? 'आपली माहिती केवळ या चौकशीसाठी वापरली जाईल.' : 'Your details are used only to respond to this request.'}
        </p>
        <button type="submit" disabled={state === 'sending'} className={buttonClass(type === 'admission' ? 'accent' : 'primary', 'lg', 'w-full sm:w-auto')}>
          {state === 'sending' ? <Loader className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
          {state === 'sending' ? ui.sending : type === 'admission' ? (mr ? 'कॉलबॅक मागवा' : 'Request a callback') : ui.submit}
        </button>
      </div>
    </form>
  );
}
