'use client';

import { useCallback } from 'react';
import { TimeRangeValue, getDateRangeForTimePresets } from '@/utils/timeRanges';
import { GranularityRangeValues, getValidGranularityFallback } from '@/utils/granularityRanges';
import { type TZDate, UTCDate, createTimezoneHelper } from '@/utils/timezoneHelpers';

export type TempState = {
  range: TimeRangeValue;
  granularity: GranularityRangeValues;
  customStart: TZDate | undefined;
  customEnd: TZDate | undefined;
  compareEnabled: boolean;
  compareStart: TZDate | undefined;
  compareEnd: TZDate | undefined;
};

interface UseTimeRangeHandlersProps {
  tempState: TempState;
  updateTempState: (updates: Partial<TempState>) => void;
  allowedGranularities: GranularityRangeValues[];
  periodDurationDays: number | null;
  userTimezone: string;
  onApply: (tempState: TempState) => void;
}

export function useTimeRangeHandlers({
  tempState,
  updateTempState,
  allowedGranularities,
  periodDurationDays,
  userTimezone,
  onApply,
}: UseTimeRangeHandlersProps) {
  const handleQuickSelect = useCallback(
    (value: TimeRangeValue) => {
      if (value === 'custom') {
        updateTempState({ range: value });
        return;
      }

      // Get UTC dates from preset
      const { startDate, endDate } = getDateRangeForTimePresets(value, userTimezone);

      // Convert to user timezone for display in temp state
      const helper = createTimezoneHelper(userTimezone);
      const startTZ = helper.toUserTimezone(startDate);
      const endTZ = helper.toUserTimezone(endDate);

      const durationMs = endDate.getTime() - startDate.getTime();

      const compareEnd = new Date(startDate.getTime() - 1_000) as UTCDate;
      const compareStart = new Date(compareEnd.getTime() - durationMs + 1_000) as UTCDate;
      const compareStartTZ = helper.toUserTimezone(compareStart);
      const compareEndTZ = helper.toUserTimezone(compareEnd);

      console.log(['', startDate, endDate, compareStart, compareEndTZ].join('\n'));

      updateTempState({
        range: value,
        customStart: startTZ,
        customEnd: endTZ,
        compareStart: compareStartTZ,
        compareEnd: compareEndTZ,
      });
    },
    [updateTempState, userTimezone, periodDurationDays],
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
        customStart: date as TZDate,
      });
    },
    [updateTempState],
  );

  const handleEndDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      updateTempState({
        range: 'custom',
        customEnd: date as TZDate,
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

      // Calculate exact duration in milliseconds to preserve time
      const durationMs = periodDurationDays * 24 * 60 * 60 * 1000;
      const compareEnd = new Date(date.getTime() + durationMs);
      updateTempState({
        compareStart: date as TZDate,
        compareEnd: compareEnd as TZDate,
      });
    },
    [updateTempState, periodDurationDays],
  );

  const handleCompareEndDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date || !periodDurationDays) return;

      // Calculate exact duration in milliseconds to preserve time
      const durationMs = periodDurationDays * 24 * 60 * 60 * 1000;
      const compareStart = new Date(date.getTime() - durationMs);
      updateTempState({
        compareStart: compareStart as TZDate,
        compareEnd: date as TZDate,
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
