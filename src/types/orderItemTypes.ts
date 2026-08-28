export const ORDER_ITEM_TYPES = [
  'ticket',
  'product'
] as const;

export type OrderItemType = typeof ORDER_ITEM_TYPES[number];