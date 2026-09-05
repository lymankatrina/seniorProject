export const SECTION_TYPES = [
  'left',
  'middle',
  'right'
] as const;

export type SectionType =
  typeof SECTION_TYPES[number];
