import { useTimeRangeContext } from "@/contexts/TimeRangeContextProvider";
import { TIME_RANGE_PRESETS, TimeRangeValue } from "@/utils/timeRanges";
import { GRANULARITY_RANGE_PRESETS, GranularityRangeValues } from "@/utils/granularityRanges";

interface TimeRangeSelectorProps {
  showGranularity?: boolean;
  granularity?: GranularityRangeValues;
  onGranularityChange?: (value: GranularityRangeValues) => void;
  className?: string;
}

export default function TimeRangeSelector({
  showGranularity = false,
  granularity,
  onGranularityChange,
  className = "",
}: TimeRangeSelectorProps) {
  const { range, setRange } = useTimeRangeContext();

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="relative inline-block text-left">
        <select
          className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={range}
          onChange={(e) => setRange(e.target.value as TimeRangeValue)}
        >
          {TIME_RANGE_PRESETS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      
      {showGranularity && granularity !== undefined && onGranularityChange && (
        <div className="relative inline-block text-left">
          <select
            className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={granularity}
            onChange={(e) => onGranularityChange(e.target.value as GranularityRangeValues)}
          >
            {GRANULARITY_RANGE_PRESETS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 