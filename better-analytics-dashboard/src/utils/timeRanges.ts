import { subDays, subMonths, startOfDay, endOfDay } from 'date-fns';

export type TimeRangeValue = '24h' | '7d' | '28d' | '3mo';
export type TimeGrouping = 'minute' | 'hour' | 'day';

export interface TimeRangePreset {
  label: string;
  value: TimeRangeValue;
  getRange: () => { startDate: string; endDate: string };
}

export const TIME_RANGE_PRESETS: TimeRangePreset[] = [
  {
    label: 'Last 24 hours',
    value: '24h',
    getRange: () => {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    },
  },
  {
    label: 'Last 7 days',
    value: '7d',
    getRange: () => {
      const end = endOfDay(new Date());
      const start = startOfDay(subDays(end, 6));
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    },
  },
  {
    label: 'Last 28 days',
    value: '28d',
    getRange: () => {
      const end = endOfDay(new Date());
      const start = startOfDay(subDays(end, 27));
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    },
  },
  {
    label: 'Last 3 months',
    value: '3mo',
    getRange: () => {
      const end = endOfDay(new Date());
      const start = startOfDay(subMonths(end, 3));
      return { startDate: start.toISOString(), endDate: end.toISOString() };
    },
  },
];

export function getRangeForValue(value: TimeRangeValue): { startDate: string; endDate: string } {
  const preset = TIME_RANGE_PRESETS.find(p => p.value === value);
  return preset ? preset.getRange() : TIME_RANGE_PRESETS[1].getRange();
}

export function toDateString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export function toDateTimeString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

export function getGroupingForRange(startDate: string, endDate: string): TimeGrouping {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  if (diff <= 60 * 60 * 1000) return 'minute';
  if (diff <= 24 * 60 * 60 * 1000) return 'hour';
  return 'day';
} 

// Helper function to format duration in a user-friendly way
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
} 