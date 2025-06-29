'use client';

import { useCallback } from 'react';
import { addDays } from 'date-fns';
import { TimeRangeValue, getDateRangeForTimePresets } from '@/utils/timeRanges';
import { GranularityRangeValues, getValidGranularityFallback } from '@/utils/granularityRanges';

export type TempState = {
  range: TimeRangeValue;
  granularity: GranularityRangeValues;
  customStart: Date | undefined;
  customEnd: Date | undefined;
  compareEnabled: boolean;
  compareStart: Date | undefined;
  compareEnd: Date | undefined;
};

interface UseTimeRangeHandlersProps {
  tempState: TempState;
  updateTempState: (updates: Partial<TempState>) => void;
  allowedGranularities: GranularityRangeValues[];
  periodDurationDays: number | null;
  onApply: (tempState: TempState) => void;
}

export function useTimeRangeHandlers({
  tempState,
  updateTempState,
  allowedGranularities,
  periodDurationDays,
  onApply,
}: UseTimeRangeHandlersProps) {
  const handleQuickSelect = useCallback(
    (value: TimeRangeValue) => {
      if (value === 'custom') {
        updateTempState({ range: value });
        return;
      }

      const { startDate, endDate } = getDateRangeForTimePresets(value);

      const duration = endDate.getTime() - startDate.getTime();
      // Note: -1 & +1 are to ensure duration remains correct
      const compareEnd = new Date(startDate.getTime() - 1);
      const compareStart = new Date(compareEnd.getTime() - duration + 1);

      updateTempState({
        range: value,
        customStart: startDate,
        customEnd: endDate,
        compareStart: compareStart,
        compareEnd: compareEnd,
      });
    },
    [updateTempState],
  );

  const handleGranularitySelect = useCallback(
    (granularity: GranularityRangeValues) => {
      if (!allowedGranularities.includes(granularity)) return;
      updateTempState({ granularity });
    },
    [updateTempState, allowedGranularities],
  );

  const handleStartDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      updateTempState({
        range: 'custom',
        customStart: date,
      });
    },
    [updateTempState],
  );

  const handleEndDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      updateTempState({
        range: 'custom',
        customEnd: date,
      });
    },
    [updateTempState],
  );

  const handleCompareEnabledChange = useCallback(
    (enabled: boolean) => {
      updateTempState({ compareEnabled: enabled });
    },
    [updateTempState],
  );

  const handleCompareStartDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date || !periodDurationDays) return;

      const compareEnd = addDays(date, periodDurationDays - 1);
      updateTempState({
        compareStart: date,
        compareEnd: compareEnd,
      });
    },
    [updateTempState, periodDurationDays],
  );

  const handleCompareEndDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date || !periodDurationDays) return;

      const compareStart = addDays(date, -(periodDurationDays - 1));
      updateTempState({
        compareStart: compareStart,
        compareEnd: date,
      });
    },
    [updateTempState, periodDurationDays],
  );

  const handleApply = useCallback(() => {
    // Validate granularity before applying
    let finalGranularity = tempState.granularity;
    if (!allowedGranularities.includes(finalGranularity)) {
      finalGranularity = getValidGranularityFallback(finalGranularity, allowedGranularities);
    }

    const finalState = {
      ...tempState,
      granularity: finalGranularity,
    };

    onApply(finalState);
  }, [tempState, allowedGranularities, onApply]);

  return {
    handleQuickSelect,
    handleGranularitySelect,
    handleStartDateSelect,
    handleEndDateSelect,
    handleCompareEnabledChange,
    handleCompareStartDateSelect,
    handleCompareEndDateSelect,
    handleApply,
  };
}
