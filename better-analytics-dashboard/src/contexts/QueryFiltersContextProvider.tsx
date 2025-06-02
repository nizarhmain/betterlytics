import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { QueryFilter } from '@/entities/filter';
import { generateTempId } from '@/utils/temporaryId';

type DashboardQueryFilter = QueryFilter & {
  id: string;
};

type QueryFiltersContextProps = {
  queryFilters: DashboardQueryFilter[];
  addQueryFilter: Dispatch<QueryFilter>;
  removeQueryFilter: Dispatch<string>;
  updateQueryFilter: Dispatch<DashboardQueryFilter>;
  setQueryFilters: Dispatch<SetStateAction<DashboardQueryFilter[]>>;
};

const QueryFiltersContext = React.createContext<QueryFiltersContextProps>({} as QueryFiltersContextProps);

type QueryFiltersContextProviderProps = {
  children: React.ReactNode;
};

export function QueryFiltersContextProvider({ children }: QueryFiltersContextProviderProps) {
  const [queryFilters, setQueryFilters] = useState<DashboardQueryFilter[]>([]);

  const addQueryFilter = useCallback(
    (queryFilter: QueryFilter) => {
      const filter = {
        ...queryFilter,
        id: generateTempId(),
      };
      setQueryFilters((filters) => [...filters, filter]);
    },
    [setQueryFilters],
  );

  const removeQueryFilter = useCallback((id: string) => {
    setQueryFilters((filters) => filters.filter((filter) => filter.id !== id));
  }, []);

  const updateQueryFilter = useCallback((queryFilter: DashboardQueryFilter) => {
    setQueryFilters((filters) =>
      filters.with(
        filters.findIndex((filter) => filter.id === queryFilter.id),
        queryFilter,
      ),
    );
  }, []);

  return (
    <QueryFiltersContext.Provider
      value={{
        queryFilters,
        addQueryFilter,
        removeQueryFilter,
        updateQueryFilter,
        setQueryFilters,
      }}
    >
      {children}
    </QueryFiltersContext.Provider>
  );
}

export function useQueryFiltersContext() {
  return React.useContext(QueryFiltersContext);
}
