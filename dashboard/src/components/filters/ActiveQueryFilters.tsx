'use client';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import { Badge } from '../ui/badge';
import { formatQueryFilter } from '@/utils/queryFilters';
import { XIcon } from 'lucide-react';

export function ActiveQueryFilters() {
  const { queryFilters, removeQueryFilter } = useQueryFiltersContext();

  return (
    <div className='flex flex-wrap gap-1 md:justify-end-safe'>
      {queryFilters.map((filter) => (
        <Badge
          key={filter.id}
          variant='outline'
          className='text-muted-foreground px-2 py-1'
          onClick={() => removeQueryFilter(filter.id)}
        >
          {formatQueryFilter(filter)} <XIcon />
        </Badge>
      ))}
    </div>
  );
}
