const DEVICE_COLORS: Record<string, string> = {
  mobile: '#22c55e', // green-500
  tablet: '#f59e0b', // amber-500
  laptop: '#8b5cf6', // violet-500
  desktop: '#3b82f6', // blue-500
  unknown: '#9ca3af', // gray-400
};

export function getDeviceColor(deviceType: string): string {
  const lowerDeviceType = deviceType.toLowerCase();
  if (DEVICE_COLORS[lowerDeviceType]) {
    return DEVICE_COLORS[lowerDeviceType];
  }
  return DEVICE_COLORS.unknown;
}
