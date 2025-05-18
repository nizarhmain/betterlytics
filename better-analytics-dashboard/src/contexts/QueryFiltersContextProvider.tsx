import React, { Dispatch, SetStateAction, useState } from "react";
import { QueryFilter } from "@/entities/filter";

type QueryFiltersContextProps = {
  queryFilters: QueryFilter[];
  setQueryFilters: Dispatch<SetStateAction<QueryFilter[]>>;
}

const QueryFiltersContext = React.createContext<QueryFiltersContextProps>({} as QueryFiltersContextProps);

type QueryFiltersContextProviderProps = {
  children: React.ReactNode;
}

export function QueryFiltersContextProvider({ children }: QueryFiltersContextProviderProps) {
  const [ queryFilters, setQueryFilters ] = useState<QueryFilter[]>([]);

  return (
    <QueryFiltersContext.Provider value={{
      queryFilters,
      setQueryFilters
    }}>
      {children}
    </QueryFiltersContext.Provider>
  )
}

export function useQueryFiltersContext() {
  return React.useContext(QueryFiltersContext);
}
