'use client';

import { usePathname } from 'next/navigation';
import PublicTopBar from './PublicTopBar';

export default function ConditionalTopBar() {
  const pathname = usePathname();

  const isAuthenticatedPage =
    pathname?.startsWith('/dashboard') || pathname?.startsWith('/dashboards') || pathname?.startsWith('/billing');

  if (isAuthenticatedPage) {
    return null;
  }

  return <PublicTopBar />;
}
