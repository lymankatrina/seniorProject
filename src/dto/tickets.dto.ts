import type { TicketStatus } from '../types/ticketStatuses';

export interface CreateTicketInput {
  movieId: string,
  showtimeId: string,
  seatId: string,
  date: string,
  time: string,
  status: TicketStatus
}

export interface UpdateTicketInput {
  seatId?: string;
  status?: TicketStatus;
}
