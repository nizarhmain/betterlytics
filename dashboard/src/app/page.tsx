import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { env } from '@/lib/env';
import LandingPage from './(landing)/page';

export default async function HomePage() {
  if (!env.IS_CLOUD) {
    const session = await getServerSession(authOptions);

    if (session) {
      redirect('/dashboards');
    } else {
      redirect('/signin');
    }
  }

  return <LandingPage />;
}
