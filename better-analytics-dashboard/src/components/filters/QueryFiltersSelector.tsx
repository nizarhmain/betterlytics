import { useState } from "react";
import { ChevronDownIcon, FilterIcon, PlusIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { QueryFilterInputRow } from "./QueryFilterInputRow";


export default function QueryFiltersSelector() {
  const { queryFilters, addQueryFilter, updateQueryFilter, removeQueryFilter } = useQueryFiltersContext();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
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
      <PopoverContent className="w-[540px] p-4 space-y-3 shadow-2xl" align="end">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
          <Button
            className="size-7 rounded-full"
            onClick={() => addQueryFilter({ column: 'url', operator: '=', value: '' })}
          >
            <PlusIcon />
          </Button>
        </div>
        <div className="space-y-2">
          {
            queryFilters
              .map((filter) => (
                <QueryFilterInputRow
                  key={filter.id}
                  onFilterUpdate={updateQueryFilter}
                  filter={filter}
                  requestRemoval={(_filter) => (console.log(_filter), removeQueryFilter(_filter.id))}
                  disableDeletion={queryFilters.length === 1}
                />
              ))
          }
        </div>
      </PopoverContent>
    </Popover>
  );
}