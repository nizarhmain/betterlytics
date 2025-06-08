import React, { type Dispatch, type SetStateAction } from 'react';
import { type QueryFilter } from '@/entities/filter';
import { type QueryFilterWithId, useQueryFilters } from '@/hooks/use-query-filters';

type QueryFiltersContextProps = {
  queryFilters: QueryFilterWithId[];
  addQueryFilter: Dispatch<QueryFilter>;
  addEmptyQueryFilter: Dispatch<void>;
  removeQueryFilter: Dispatch<string>;
  updateQueryFilter: Dispatch<QueryFilterWithId>;
  setQueryFilters: Dispatch<SetStateAction<QueryFilterWithId[]>>;
};

const QueryFiltersContext = React.createContext<QueryFiltersContextProps>({} as QueryFiltersContextProps);

type QueryFiltersContextProviderProps = {
  children: React.ReactNode;
};

export function QueryFiltersContextProvider({ children }: QueryFiltersContextProviderProps) {
  const localQueryFilters = useQueryFilters();

  return <QueryFiltersContext.Provider value={localQueryFilters}>{children}</QueryFiltersContext.Provider>;
}

export function useQueryFiltersContext() {
  return React.useContext(QueryFiltersContext);
}
