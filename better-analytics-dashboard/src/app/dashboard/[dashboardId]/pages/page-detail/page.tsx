import PageDetailClient from './PageDetailClient';
import { redirect } from 'next/navigation';

interface SearchParams {
  path?: string;
}

export default async function PageDetailPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  if (!params.path) {
    redirect('/');
  }

  const decodedPath = decodeURIComponent(params.path);

  return <PageDetailClient path={decodedPath} />;
}
