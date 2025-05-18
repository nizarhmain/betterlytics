import React, { Dispatch, useCallback, useState } from "react";
import { QueryFilter } from "@/entities/filter";
import { generateTempId } from "@/utils/temporaryId";

/**
 * This is just a local type adding a temporary id to each Query Filter
 * You can use this directly as a QueryFilter, as it will be stripped later
 */
type DashboardQueryFilter = QueryFilter & {
  id: string;
};

type QueryFiltersContextProps = {
  queryFilters: DashboardQueryFilter[];
  addQueryFilter: Dispatch<QueryFilter>;
  removeQueryFilter: Dispatch<string>;
  updateQueryFilter: Dispatch<DashboardQueryFilter>;
}

const QueryFiltersContext = React.createContext<QueryFiltersContextProps>({} as QueryFiltersContextProps);

type QueryFiltersContextProviderProps = {
  children: React.ReactNode;
}

export function QueryFiltersContextProvider({ children }: QueryFiltersContextProviderProps) {
  const [ queryFilters, setQueryFilters ] = useState<DashboardQueryFilter[]>([]);

  const addQueryFilter = useCallback((queryFilter: QueryFilter) => {
    const filter = {
      ...queryFilter,
      id: generateTempId()
    }
    setQueryFilters((filters) => [...filters, filter])
  }, [setQueryFilters]);

  const removeQueryFilter = useCallback((id: string) => {
    setQueryFilters((filters) => filters.filter((filter) => filter.id === id));
  }, []);

  const updateQueryFilter = useCallback((queryFilter: DashboardQueryFilter) => {
    setQueryFilters(
      (filters) => filters.with(
        filters.findIndex((filter) => filter.id === queryFilter.id),
        queryFilter
      )
    )
  }, []);

  return (
    <QueryFiltersContext.Provider value={{
      queryFilters,
      addQueryFilter,
      removeQueryFilter,
      updateQueryFilter
    }}>
      {children}
    </QueryFiltersContext.Provider>
  )
}

export function useQueryFiltersContext() {
  return React.useContext(QueryFiltersContext);
}
