import { LangRedirect } from '@/components/site/LangRedirect';

/** Root: send visitors to their language (saved preference, then browser language, else English). */
export default function RootRedirect() {
  return <LangRedirect />;
}
