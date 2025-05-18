import { TimeRangeValue } from "@/utils/timeRanges";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import React, { Dispatch, SetStateAction } from "react";

type TimeRangeContextProps = {
  range: TimeRangeValue;
  setRange: Dispatch<SetStateAction<TimeRangeValue>>;
  granularity: GranularityRangeValues;
  setGranularity: Dispatch<SetStateAction<GranularityRangeValues>>;
}

const TimeRangeContext = React.createContext<TimeRangeContextProps>({} as TimeRangeContextProps);

type TimeRangeContextProviderProps = {
  children: React.ReactNode;
}

export function TimeRangeContextProvider({ children }: TimeRangeContextProviderProps) {
  const [range, setRange] = React.useState<TimeRangeValue>("7d");
  const [granularity, setGranularity] = React.useState<GranularityRangeValues>("day");

  return (
    <TimeRangeContext.Provider value={{ range, setRange, granularity, setGranularity }}>
      {children}
    </TimeRangeContext.Provider>
  )
}

export function useTimeRangeContext() {
  return React.useContext(TimeRangeContext);
}
