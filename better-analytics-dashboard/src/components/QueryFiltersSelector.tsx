import { useState } from "react";
import { ChevronDownIcon, FilterIcon, PlusIcon, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useQueryFiltersContext } from "@/contexts/QueryFiltersContextProvider";
import { FILTER_COLUMNS, FILTER_OPERATORS } from "@/entities/filter";
import { Input } from "./ui/input";


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
      <PopoverContent className="w-auto p-6 space-y-6" align="end">
        <h3 className="text-sm font-medium text-muted-foreground">Filters</h3>
        <div>
          {
            queryFilters
              .map((filter) => (
                <div key={filter.id} className="flex justify-between gap-2">
                  <select
                    className="border-1 p-1 rounded-sm"
                    onChange={(evt) => updateQueryFilter({ ...filter, column: evt.target.value as typeof FILTER_COLUMNS[number] })}
                  >
                    {
                      FILTER_COLUMNS
                        .map((column) => <option key={column} value={column}>{column.replaceAll("_", " ")}</option>)
                    }
                  </select>
                  <select
                    className="border-1 p-1 grow rounded-sm"
                    onChange={(evt) => updateQueryFilter({ ...filter, operator: evt.target.value as typeof FILTER_OPERATORS[number] })}
                  >
                    <option value='='>is</option>
                    <option value='!='>is not</option>
                  </select>
                  <Input
                    value={filter.value}
                    onChange={(evt) => updateQueryFilter({ ...filter, value: evt.target.value })}
                    className="h-10 rounded-sm"
                  />
                  <Button
                    className="size-10 rounded-sm"
                    variant='outline'
                    onClick={() => removeQueryFilter(filter.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))
          }
        </div>
        <Button
          className="size-8 rounded-full"
          onClick={() => addQueryFilter({ column: 'url', operator: '=', value: '' })}
        >
          <PlusIcon />
        </Button>
      </PopoverContent>
    </Popover>
  );
}