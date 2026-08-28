export const PRODUCT_TYPES = [
  'snack',
  'drink',
  'swag'
] as const;

export type ProductType = typeof PRODUCT_TYPES[number];