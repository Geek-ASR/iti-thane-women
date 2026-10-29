'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useRequireUser } from '@/lib/portal';
import type { Role, User } from '@/lib/types';
import { buttonClass, Loading } from './kit';

/** Renders children only for signed-in users with an allowed role. */
export function Guard({ roles, children }: { roles?: Role[]; children: (user: User) => ReactNode }) {
  const { user, loading, allowed } = useRequireUser(roles);
  if (loading || !user) return <Loading />;
  if (!allowed)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-line">
        <ShieldAlert className="size-10 text-rose-600" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-brand-950">This page isn’t available for your account</p>
        <p className="mt-1 text-sm text-stone-600">Signed in as {user.name}. Use the menu to find what you need.</p>
        <Link href="/portal/dashboard/" className={buttonClass('primary', 'md', 'mt-6')}>
          Go to dashboard
        </Link>
      </div>
    );
  return <>{children(user)}</>;
}
