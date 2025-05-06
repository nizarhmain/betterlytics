import { TimeRangeValue } from "@/utils/timeRanges";
import React, { Dispatch, SetStateAction } from "react";

type TimeRangeContextProps = {
  range: TimeRangeValue;
  setRange: Dispatch<SetStateAction<TimeRangeValue>>;
}

const TimeRangeContext = React.createContext<TimeRangeContextProps>({} as TimeRangeContextProps);

type TimeRangeContextProviderProps = {
  children: React.ReactNode;
}

export function TimeRangeContextProvider({ children }: TimeRangeContextProviderProps) {
  const [ range, setRange ] = React.useState<TimeRangeValue>("7d");

  return (
    <TimeRangeContext.Provider value={{ range, setRange }}>
      {children}
    </TimeRangeContext.Provider>
  )
}

export function useTimeRangeContext() {
  return React.useContext(TimeRangeContext);
}
