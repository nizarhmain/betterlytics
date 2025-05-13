import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate a consistent hash code from a string
 * This is used to get a consistent colors for a type across users
 * Perhaps we should instead use a consistent color for different types
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a HSL color from a hash value
 * This creates visually distinct colors that are consistent for the same input
 */
export function generateColorFromHash(hash: number): string {
  // Use the hash to determine hue (0-360)
  // Using golden ratio conjugate to get a good distribution
  const hue = (hash * 137.508) % 360;
  
  const saturation = 65 + (hash % 20);
  const lightness = 45 + (hash % 15);
  
  return `hsl(${Math.floor(hue)}, ${saturation}%, ${lightness}%)`;
}