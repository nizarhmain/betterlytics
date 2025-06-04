import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import CreateDashboardForm from './CreateDashboardForm';

export default async function CreateDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='bg-background flex min-h-screen items-center justify-center'>
      <div className='bg-muted w-full max-w-md space-y-8 rounded-lg p-8 shadow'>
        <div>
          <h2 className='text-foreground mt-6 text-center text-3xl font-extrabold'>Better Analytics</h2>
          <p className='text-muted-foreground mt-2 text-center text-sm'>Create dashboard</p>
        </div>
        <CreateDashboardForm />
      </div>
    </div>
  );
}
