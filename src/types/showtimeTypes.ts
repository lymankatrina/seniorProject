export const SHOWTIME_TYPES = [
  'standard',
  'premiere',
  'special'
] as const;

export type ShowtimeType =
  typeof SHOWTIME_TYPES[number];