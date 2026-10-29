'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/portal';
import { Loading } from '@/components/portal/kit';

export default function PortalIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) router.replace(user ? '/portal/dashboard/' : '/portal/login/');
  }, [user, loading, router]);
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <title>Smart Campus</title>
      <Loading label="Opening Smart Campus…" />
    </div>
  );
}
