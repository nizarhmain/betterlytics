import { useCallback, useMemo, useState } from 'react';
import { ChevronDownIcon, FilterIcon, PlusIcon, SaveIcon, SettingsIcon, Undo2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { useQueryFiltersContext } from '@/contexts/QueryFiltersContextProvider';
import { QueryFilterInputRow } from './QueryFilterInputRow';
import { useInstantLocalQueryFilters } from '@/hooks/use-instant-local-query-filters';
import { Separator } from '../ui/separator';

export default function QueryFiltersSelector() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { queryFilters: contextQueryFilters, setQueryFilters } = useQueryFiltersContext();
  const {
    queryFilters,
    setQueryFilters: setLocalQueryFilters,
    addEmptyQueryFilter,
    removeQueryFilter,
    updateQueryFilter,
  } = useInstantLocalQueryFilters();

  const saveFilters = useCallback(() => {
    setQueryFilters(queryFilters);
  }, [queryFilters]);

  const cancelFilters = useCallback(() => {
    setLocalQueryFilters(contextQueryFilters);
  }, [contextQueryFilters]);

  const isFiltersModified = useMemo(() => {
    if (contextQueryFilters.length !== queryFilters.length) {
      return true;
    }

    return (
      queryFilters.every((filter, index) => {
        const ctxFilter = contextQueryFilters[index];
        return (
          ctxFilter.id === filter.id &&
          ctxFilter.column === filter.column &&
          ctxFilter.operator === filter.operator &&
          ctxFilter.value === filter.value
        );
      }) === false
    );
  }, [contextQueryFilters, queryFilters]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' className={'min-w-[200px] justify-between shadow-sm'}>
          <div className='flex items-center gap-2'>
            <FilterIcon className='h-4 w-4' />
            <span>Filters</span>
          </div>
          <ChevronDownIcon className={`ml-2 h-4 w-4 shrink-0 opacity-50`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[540px] max-w-[90svw] space-y-4 border p-4 shadow-2xl' align='end'>
        {queryFilters.length > 0 || isFiltersModified ? (
          <div className='space-y-2 pb-2'>
            <div className='space-y-3'>
              {queryFilters.map((filter) => (
                <QueryFilterInputRow
                  key={filter.id}
                  onFilterUpdate={updateQueryFilter}
                  filter={filter}
                  requestRemoval={(_filter) => removeQueryFilter(_filter.id)}
                />
              ))}
              {queryFilters.length === 0 && <span className='text-muted-foreground'>No filters</span>}
            </div>
            <Separator />
            <div className='flex justify-between'>
              <Button className='h-7' onClick={addEmptyQueryFilter}>
                <PlusIcon />
              </Button>
              <div className='flex items-center justify-end gap-3'>
                <Button
                  className='h-7 w-28'
                  disabled={isFiltersModified === false}
                  onClick={cancelFilters}
                  variant={isFiltersModified ? 'destructive' : 'ghost'}
                >
                  <Undo2 /> Cancel
                </Button>
                <Button
                  className='h-7 w-28'
                  disabled={isFiltersModified === false}
                  onClick={saveFilters}
                  variant={isFiltersModified ? 'default' : 'ghost'}
                >
                  <SaveIcon /> Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-4 pb-8 text-center'>
            <div className='bg-muted mb-4 rounded-full p-3'>
              <FilterIcon className='text-muted-foreground h-6 w-6' />
            </div>
            <h3 className='mb-1 text-base font-medium'>No active filters</h3>
            <p className='text-muted-foreground mb-4 max-w-[260px] text-sm'>
              Add filters to refine your analytics data and focus on specific segments.
            </p>
            <div className='flex w-full flex-col gap-2'>
              <Button className='w-full' size='sm' onClick={addEmptyQueryFilter}>
                <PlusIcon className='mr-2 h-4 w-4' />
                Add your first filter
              </Button>
              <div className='text-muted-foreground mt-2 flex items-center gap-2 text-xs'>
                <SettingsIcon className='h-3 w-3' />
                <span>Common filters: Country, Browser, URL, Device</span>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
