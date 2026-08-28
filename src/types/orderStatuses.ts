export const ORDER_STATUSES = [
  'pending',
  'paid',
  'cancelled',
  'refunded'
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];