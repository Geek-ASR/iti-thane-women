'use client';

import Link from 'next/link';
import { useEffect, useState, type ComponentType } from 'react';
import { ArrowDownToLine, Check, CircleCheck, Compass, Copy, EllipsisVertical, Globe, Info, MessageCircle, Share, Share2, SquarePlus, type LucideProps } from 'lucide-react';
import { useInstallPrompt } from '@/lib/install';
import type { Locale } from '@/lib/i18n';
import { buttonClass, cx } from '@/components/ui';

type Platform = 'android' | 'ios' | 'desktop';
type Device = { platform: Platform; inApp: boolean; standalone: boolean };

function detectDevice(): Device {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS reports itself as a Mac
  return {
    platform: ios ? 'ios' : /Android/i.test(ua) ? 'android' : 'desktop',
    inApp: /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|; wv\)/i.test(ua),
    standalone: matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true,
  };
}

/** Known only after hydration — the static page can't see the visitor's phone. */
function useDevice() {
  const [device, setDevice] = useState<Device | null>(null);
  useEffect(() => setDevice(detectDevice()), []);
  return device;
}

/** Hero call to action: the browser's install prompt where it is offered, otherwise the steps for this phone. */
export function InstallButton({ lang }: { lang: Locale }) {
  const mr = lang === 'mr';
  const device = useDevice();
  const install = useInstallPrompt();
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const done = () => setInstalled(true);
    window.addEventListener('appinstalled', done);
    return () => window.removeEventListener('appinstalled', done);
  }, []);

  if (device?.standalone || installed)
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="inline-flex items-start gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15">
          <CircleCheck className="mt-0.5 size-4 shrink-0 text-marigold-300" aria-hidden />
          {device?.standalone
            ? mr ? 'तुम्ही ॲप वापरत आहात.' : 'You’re using the app.'
            : mr ? 'ॲप इंस्टॉल झाले — होम स्क्रीनवर ITI Thane आयकॉन पाहा.' : 'Installed — look for the ITI Thane icon on your home screen.'}
        </p>
        <Link href="/portal/" className={buttonClass('accent', 'lg')}>
          {mr ? 'स्मार्ट कॅम्पस उघडा' : 'Open Smart Campus'}
        </Link>
      </div>
    );

  const desktop = device?.platform === 'desktop';
  const label = desktop
    ? mr ? 'या संगणकावर इंस्टॉल करा' : 'Install on this computer'
    : device?.platform === 'ios' ? (mr ? 'होम स्क्रीनवर जोडा' : 'Add to Home Screen') : mr ? 'ॲप इंस्टॉल करा' : 'Install the app';

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {install.available ? (
          <button type="button" className={buttonClass('accent', 'lg')} onClick={async () => (await install.prompt()) === 'accepted' && setInstalled(true)}>
            <ArrowDownToLine className="size-5" aria-hidden />
            {label}
          </button>
        ) : (
          !desktop && (
            <a href="#how-to-install" className={buttonClass('accent', 'lg')}>
              <ArrowDownToLine className="size-5" aria-hidden />
              {label}
            </a>
          )
        )}
        <Link href="/portal/" className={buttonClass(desktop && !install.available ? 'accent' : 'glass', 'lg')}>
          {desktop ? (mr ? 'स्मार्ट कॅम्पस उघडा' : 'Open Smart Campus') : mr ? 'ब्राउझरमध्येच वापरा' : 'Use in browser'}
        </Link>
      </div>
      {device?.inApp && (
        <p className="mt-4 flex max-w-lg items-start gap-2 rounded-2xl bg-marigold-400/15 px-4 py-3 text-sm text-marigold-100 ring-1 ring-marigold-300/30">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {mr
            ? 'ही लिंक दुसऱ्या ॲपमध्ये उघडली आहे. इंस्टॉल करण्यासाठी ती Chrome किंवा Safari मध्ये उघडा: ⋮ किंवा शेअर आयकॉन दाबा आणि “Open in browser” निवडा.'
            : 'You opened this link inside another app. To install, open it in Chrome or Safari: tap ⋮ or the share icon and choose “Open in browser”.'}
        </p>
      )}
      {desktop && <p className="mt-4 max-w-md text-sm text-white/70">{mr ? 'संगणकावर आहात? ॲप फोनवर घेण्यासाठी फोनच्या कॅमेऱ्याने QR कोड स्कॅन करा.' : 'On a computer? Scan the QR code with your phone’s camera to get the app on your phone.'}</p>}
      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/75">
        {(mr ? ['मोफत', 'Android व iPhone', 'Play Store ची गरज नाही'] : ['Free', 'Android & iPhone', 'No Play Store needed']).map((t) => (
          <li key={t} className="inline-flex items-center gap-1.5">
            <Check className="size-4 text-marigold-300" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Step = { Icon: ComponentType<LucideProps>; en: string; mr: string };

const STEPS: Record<'android' | 'ios', Step[]> = {
  android: [
    { Icon: Globe, en: 'Open this page in Chrome.', mr: 'हे पान Chrome मध्ये उघडा.' },
    {
      Icon: EllipsisVertical,
      en: 'Tap “Install the app” above. No button? Tap ⋮ at the top right and choose “Install app” or “Add to Home screen”.',
      mr: 'वरील “ॲप इंस्टॉल करा” बटण दाबा. बटण दिसत नसल्यास वर उजवीकडील ⋮ दाबा आणि “Install app” किंवा “Add to Home screen” निवडा.',
    },
    { Icon: ArrowDownToLine, en: 'Tap Install. The ITI Thane icon appears on your home screen and in your apps.', mr: 'Install दाबा. ITI Thane चा आयकॉन होम स्क्रीनवर व ॲप्सच्या यादीत दिसेल.' },
  ],
  ios: [
    { Icon: Compass, en: 'Open this page in Safari.', mr: 'हे पान Safari मध्ये उघडा.' },
    { Icon: Share, en: 'Tap the Share button — a square with an arrow. On newer iPhones, tap ⋯ first.', mr: 'शेअर बटण (बाण असलेला चौकोन) दाबा. नवीन iPhone वर आधी ⋯ दाबा.' },
    { Icon: SquarePlus, en: 'Choose “Add to Home Screen”, then tap Add.', mr: '“Add to Home Screen” निवडा आणि Add दाबा.' },
  ],
};
const MR_DIGITS = ['१', '२', '३'];

/** Install steps for Android and iPhone; opens on the visitor's own phone type. */
export function InstallSteps({ lang }: { lang: Locale }) {
  const mr = lang === 'mr';
  const device = useDevice();
  const [tab, setTab] = useState<'android' | 'ios' | null>(null);
  const active = tab ?? (device?.platform === 'ios' ? 'ios' : 'android');
  return (
    <div className="mx-auto max-w-2xl">
      <div role="tablist" aria-label={mr ? 'तुमचा फोन' : 'Your phone'} className="mx-auto grid max-w-xs grid-cols-2 rounded-full bg-white p-1 ring-1 ring-line">
        {(['android', 'ios'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={active === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={cx('h-10 rounded-full text-sm font-semibold transition-colors', active === id ? 'bg-brand-700 text-white shadow-soft' : 'text-brand-900 hover:bg-brand-50')}
          >
            {id === 'android' ? 'Android' : 'iPhone'}
          </button>
        ))}
      </div>
      {(['android', 'ios'] as const).map((id) => (
        <ol key={id} id={`panel-${id}`} role="tabpanel" aria-labelledby={`tab-${id}`} hidden={active !== id} className="mt-6 space-y-3">
          {STEPS[id].map((s, i) => (
            <li key={s.en} className="flex items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <s.Icon className="size-5" aria-hidden />
              </span>
              <span className="pt-0.5">
                <span className="block text-xs font-bold tracking-[0.14em] text-marigold-700 uppercase">{mr ? `पायरी ${MR_DIGITS[i]}` : `Step ${i + 1}`}</span>
                <span className="mt-1 block text-[0.98rem] leading-relaxed text-ink">{s[lang]}</span>
              </span>
            </li>
          ))}
        </ol>
      ))}
      <p className="mt-5 text-center text-sm text-balance text-stone-600">{mr ? 'नंतर होम स्क्रीनवरून ITI Thane उघडा आणि साइन इन करा.' : 'Then open ITI Thane from your home screen and sign in.'}</p>
    </div>
  );
}

/** The link to pass on: native share sheet, WhatsApp, copy, and a QR code to scan from this screen. */
export function ShareApp({ lang, link, qr, headingId }: { lang: Locale; link: string; qr: string; headingId: string }) {
  const mr = lang === 'mr';
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === 'function'), []);
  const message = mr ? 'ITI Thane ॲप मिळवा — उपस्थिती, प्रश्नमंजुषा व नोकरीच्या संधी तुमच्या फोनवर:' : 'Get the ITI Thane app — attendance, quizzes and jobs on your phone:';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked — the link stays visible to copy by hand */
    }
  };
  return (
    <div className="grid items-center gap-6 rounded-[1.75rem] bg-white p-5 ring-1 ring-line sm:grid-cols-[auto_1fr] sm:p-8 lg:grid-cols-1">
      <div role="img" aria-label={mr ? 'ॲपच्या लिंकचा QR कोड' : 'QR code for the app link'} className="mx-auto size-44 rounded-2xl bg-white p-2.5 ring-1 ring-line lg:hidden [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: qr }} />
      <div>
        <h2 id={headingId} className="font-display text-2xl font-semibold text-brand-950 sm:text-3xl">
          {mr ? 'ॲप शेअर करा' : 'Share the app'}
        </h2>
        <p className="mt-2 text-stone-600">{mr ? 'ही लिंक वर्गमैत्रिणींना पाठवा — किंवा त्यांना QR कोड स्कॅन करू द्या.' : 'Send this link to your classmates — or let them scan the QR code.'}</p>
        <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-[0.95rem] font-semibold break-all text-brand-900">{link.replace(/^https?:\/\//, '')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {canShare && (
            <button type="button" className={buttonClass('primary', 'md')} onClick={() => navigator.share({ title: 'ITI Thane app', text: message, url: link }).catch(() => {})}>
              <Share2 className="size-4" aria-hidden />
              {mr ? 'शेअर करा' : 'Share'}
            </button>
          )}
          <a href={`https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`} target="_blank" rel="noopener noreferrer" className={buttonClass(canShare ? 'outline' : 'primary', 'md')}>
            <MessageCircle className="size-4" aria-hidden />
            WhatsApp
          </a>
          <button type="button" className={buttonClass('outline', 'md')} onClick={copy} aria-live="polite">
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? (mr ? 'कॉपी झाली' : 'Copied') : mr ? 'लिंक कॉपी करा' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}
