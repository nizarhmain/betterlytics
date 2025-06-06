import { redirect } from 'next/navigation';
import { getAuthSession } from '@/auth/auth-actions';
import { getAllUserDashboardsAction } from '../actions/dashboard';
import DashboardsClientWrapper from '@/app/dashboards/DashboardsClientWrapper';

export default async function DashboardsPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect('/');
  }

  const dashboards = await getAllUserDashboardsAction();

  return <DashboardsClientWrapper dashboards={dashboards} />;
}
