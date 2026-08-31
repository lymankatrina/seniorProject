export const EVENT_TYPES = [
  'premiere',
  'club',
  'private',
  'special'
] as const;

export type EventType =
  typeof EVENT_TYPES[number];
  