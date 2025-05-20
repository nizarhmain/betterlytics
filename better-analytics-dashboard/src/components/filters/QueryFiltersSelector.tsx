import { useCallback, useState } from "react";
import { ChevronDownIcon, FilterIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { QueryFilterInputRow } from "./QueryFilterInputRow";

export default function QueryFiltersSelector() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const { queryFilters, addQueryFilter, updateQueryFilter, removeQueryFilter } = useQueryFiltersContext();
  const createFilter = useCallback(() => {
    addQueryFilter({ column: 'url', operator: '=', value: '' })
  }, [addQueryFilter]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={"min-w-[200px] justify-between shadow-sm"}
        >
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            <span>Filters</span>
          </div>
          <ChevronDownIcon className={`ml-2 h-4 w-4 shrink-0 opacity-50`} /> 
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[540px] p-4 space-y-4 shadow-2xl" align="end">
        {
          queryFilters.length > 0 ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
                <Button
                  className="size-7 rounded-full"
                  onClick={createFilter}
                  >
                  <PlusIcon />
                </Button>
              </div>
              <div className="space-y-3 mb-2">
                {
                  queryFilters
                    .map((filter) => (
                      <QueryFilterInputRow
                      key={filter.id}
                      onFilterUpdate={updateQueryFilter}
                      filter={filter}
                      requestRemoval={(_filter) => (console.log(_filter), removeQueryFilter(_filter.id))}
                      />
                    ))
                }
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center pb-8 py-4 px-4 text-center">
              <div className="bg-muted rounded-full p-3 mb-4">
                <FilterIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium mb-1">No active filters</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-[260px]">
                Add filters to refine your analytics data and focus on specific segments.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Button className="w-full" size="sm" onClick={createFilter}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add your first filter
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <SettingsIcon className="h-3 w-3" />
                  <span>Common filters: Country, Browser, URL, Device</span>
                </div>
              </div>
            </div>
          )
        }
      </PopoverContent>
    </Popover>
  );
}
