import { Skeleton } from '@/components/ui/skeleton';

type SummaryCardsSkeletonProps = {
  count?: number;
};

export default function SummaryCardsSkeleton({ count = 4 }: SummaryCardsSkeletonProps) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className='bg-card rounded-lg border p-6'>
          <Skeleton className='mb-4 h-4 w-3/4' />
          <Skeleton className='mb-4 h-8 w-1/2' />
          <Skeleton className='h-16 w-full' />
        </div>
      ))}
    </div>
  );
}
