export const CUSTOMER_TYPES = [
  'adult',
  'child',
  'student',
  'senior'
] as const;

export type CustomerType =
  typeof CUSTOMER_TYPES[number];
