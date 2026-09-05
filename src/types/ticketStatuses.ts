export const TICKET_STATUSES = [
  'available',
  'reserved',
  'sold',
  'cancelled'
] as const;

export type TicketStatus =
  typeof TICKET_STATUSES[number];
