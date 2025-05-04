import { DateString, DateTimeString } from '@/types/dates';

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
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
} 