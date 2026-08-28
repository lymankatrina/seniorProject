export const CONTENT_STATUSES = [
  'public',
  'private',
] as const;

export type ContentStatus =
  typeof CONTENT_STATUSES[number];