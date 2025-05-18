import { TimeRangeValue, getRangeForValue } from "@/utils/timeRanges";
import { GranularityRangeValues } from "@/utils/granularityRanges";
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { startOfDay, endOfDay } from 'date-fns';

type TimeRangeContextProps = {
  range: TimeRangeValue;
  setRange: (value: TimeRangeValue) => void;
  granularity: GranularityRangeValues;
  setGranularity: Dispatch<SetStateAction<GranularityRangeValues>>;
  customStartDate?: Date;
  customEndDate?: Date;
  setCustomDateRange: (startDate: Date, endDate: Date) => void;
  compareEnabled: boolean;
  setCompareEnabled: Dispatch<SetStateAction<boolean>>;
  startDate: Date;
  endDate: Date;
}

const TimeRangeContext = React.createContext<TimeRangeContextProps>({} as TimeRangeContextProps);

type TimeRangeContextProviderProps = {
  children: React.ReactNode;
}

export function TimeRangeContextProvider({ children }: TimeRangeContextProviderProps) {
  const [range, setRangeState] = React.useState<TimeRangeValue>("7d");
  const [granularity, setGranularity] = React.useState<GranularityRangeValues>("day");
  const [customStartDate, setCustomStartDate] = React.useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = React.useState<Date | undefined>(undefined);
  const [compareEnabled, setCompareEnabled] = React.useState<boolean>(false);

  const handleSetRange = useCallback((value: TimeRangeValue) => {
    setRangeState(value);
    if (value !== 'custom') {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  }, []);

  const handleSetCustomDateRange = useCallback((startDate: Date, endDate: Date) => {
    setCustomStartDate(startOfDay(startDate));
    setCustomEndDate(endOfDay(endDate));
    setRangeState('custom');
  }, []);

  const { startDate, endDate } = useMemo(() => {
    if (range === 'custom' && customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    return getRangeForValue(range);
  }, [range, customStartDate, customEndDate]);

  return (
    <TimeRangeContext.Provider value={{
      range,
      setRange: handleSetRange,
      granularity,
      setGranularity,
      customStartDate: customStartDate,
      customEndDate: customEndDate,
      setCustomDateRange: handleSetCustomDateRange,
      compareEnabled,
      setCompareEnabled,
      startDate,
      endDate
    }}>
      {children}
    </TimeRangeContext.Provider>
  )
}

export function useTimeRangeContext() {
  return React.useContext(TimeRangeContext);
}
