import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import BillingPageClient from '@/app/billing/BillingPageClient';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  return <BillingPageClient user={session.user} />;
}
