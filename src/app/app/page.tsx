import type { Metadata } from 'next';
import { absolute } from '@/lib/seo';
import { LangRedirect } from '@/components/site/LangRedirect';

const title = 'Get the ITI Thane app';
const description = 'Attendance, quizzes and jobs on your phone — install free on Android or iPhone. No Play Store needed.';

/** The short link people share. Link previews (WhatsApp etc.) read these tags; visitors go on to /en/app/ or /mr/app/. */
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absolute('/en/app/') },
  openGraph: { type: 'website', url: absolute('/app/'), title, description, siteName: 'Govt. ITI (Women), Thane', images: [{ url: absolute('/brand/og-app.jpg'), width: 1200, height: 630, alt: title }] },
  twitter: { card: 'summary_large_image', title, description, images: [absolute('/brand/og-app.jpg')] },
};

export default function AppLink() {
  return <LangRedirect path="/app/" />;
}
