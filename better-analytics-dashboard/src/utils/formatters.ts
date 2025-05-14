/**
 * Format a number to a presentable string with K/M suffix
 * @param num The number to format
 * @param decimalPlaces Number of decimal places (default: 1)
 * @returns Formatted number string (e.g., "1.2K", "3.5M")
 */
export function formatNumber(num: number, decimalPlaces = 1): string {
  if (num === undefined || num === null) return '-';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(decimalPlaces)}M`;
  }
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(decimalPlaces)}K`;
  }
  
  return num.toString();
}

/**
 * Format a number as a percentage with % symbol
 * @param num The number to format as a percentage
 * @param decimalPlaces Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "42.5%")
 */
export function formatPercentage(num: number, decimalPlaces = 1): string {
  return `${num.toFixed(decimalPlaces)}%`;
}