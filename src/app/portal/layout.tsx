import type { Metadata } from 'next';
import { PortalApp } from '@/components/portal/Shell';

export const metadata: Metadata = {
  title: { default: 'Smart Campus', template: '%s · Smart Campus · Govt. ITI (Women), Thane' },
  description: 'Smart attendance, online quizzes and the job & apprenticeship portal of Govt. ITI (Women), Thane.',
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalApp>{children}</PortalApp>;
}
