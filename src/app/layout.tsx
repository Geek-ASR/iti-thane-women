import type { Metadata, Viewport } from 'next';
import { Fraunces, Mukta, Plus_Jakarta_Sans, Tiro_Devanagari_Marathi } from 'next/font/google';
import { BASE_PATH, SITE_URL } from '@/lib/config';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'opsz'], variable: '--font-fraunces', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const mukta = Mukta({ subsets: ['devanagari'], weight: ['400', '500', '600', '700'], variable: '--font-mukta', display: 'swap' });
const tiro = Tiro_Devanagari_Marathi({ subsets: ['devanagari'], weight: '400', variable: '--font-tiro', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: 'Govt. ITI (Women), Thane — Rajmata Jijau Government Industrial Training Institute', template: '%s · Govt. ITI (Women), Thane' },
  description:
    'Rajmata Jijau Government Industrial Training Institute (Women), Thane — NCVT trades in electrical, electronics, IT, healthcare technology, beauty, fashion and office management for young women since 1992.',
  applicationName: 'ITI Thane (Women)',
  authors: [{ name: 'Aditya Rekhe' }],
  creator: 'Aditya Rekhe',
  formatDetection: { telephone: false },
  appleWebApp: { capable: true, title: 'ITI Thane', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1d1856',
};

/** Applies saved language / text-size / contrast before first paint to avoid flashes. */
const prefs = `(function(){try{var d=document.documentElement,b=${JSON.stringify(BASE_PATH)},p=location.pathname;if(b&&p.indexOf(b)===0)p=p.slice(b.length);if(p.indexOf('/mr')===0)d.lang='mr';var f=localStorage.getItem('iti.fs');if(f)d.dataset.fs=f;if(localStorage.getItem('iti.contrast')==='high')d.dataset.contrast='high';}catch(e){}})();`;

/** Holds the browser's install prompt from the first moment, for the "Install" buttons to use (see lib/install). */
const installCapture = `addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__itiInstall=e;dispatchEvent(new Event('iti:install'))});addEventListener('appinstalled',function(){window.__itiInstall=null;dispatchEvent(new Event('iti:install'))});`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${jakarta.variable} ${mukta.variable} ${tiro.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefs + installCapture }} />
      </head>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
