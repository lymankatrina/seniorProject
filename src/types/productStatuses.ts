export const PRODUCT_STATUSES = [
  'active',
  'inactive'
] as const;

export type ProductStatus = typeof PRODUCT_STATUSES[number];