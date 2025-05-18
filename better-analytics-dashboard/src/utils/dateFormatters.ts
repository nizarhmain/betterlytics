import { DateString, DateTimeString } from '@/types/dates';
import { parseISO, format } from 'date-fns';

// Formats date strings to Clickhouse date column format
export function toDateString(date: string | Date): DateString {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

// Formats date strings to Clickhouse datetime column format
export function toDateTimeString(date: string | Date): DateTimeString {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

// Helper function to format duration in a user-friendly way
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) parts.push(`${Math.floor(hours)}h`);
  if (minutes > 0 || hours > 0) parts.push(`${Math.floor(minutes)}m`);
  parts.push(`${Math.floor(remainingSeconds)}s`);

  return parts.join(' ');
}

// Helper to format ISO date string to 'yyyy-MM-dd' for date pickers
export const formatISOToDatePicker = (isoDateString: string | undefined): string | undefined => {
  if (!isoDateString) return undefined;
  try {
    return format(parseISO(isoDateString), 'yyyy-MM-dd');
  } catch (error) {
    console.warn("Failed to parse ISO date for date picker:", isoDateString, error);
    return undefined;
  }
};