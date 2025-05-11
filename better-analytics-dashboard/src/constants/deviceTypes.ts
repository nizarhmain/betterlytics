import { hashString, generateColorFromHash } from "@/lib/utils";

/**
 * Format a device type string for display
 * Capitalizes first letter of each word and handles special cases
 */
export function getDeviceLabel(deviceType: string): string {
  if (!deviceType) return "Unknown";
  
  const lowerType = deviceType.toLowerCase();
  
  // Otherwise, capitalize each word
  return lowerType
    .split(/[_\s-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get a consistent color for a device type
 * - Uses predefined colors for common device types
 * - Generates unique colors for other types using hashing
 */
export function getDeviceColor(deviceType: string): string {
  if (!deviceType) return "#94A3B8" // Gray for unknown
  
  const displayLabel = getDeviceLabel(deviceType).toLowerCase();
  
  // Generate a unique color based on the display label
  const hash = hashString(displayLabel);
  return generateColorFromHash(hash);
} 