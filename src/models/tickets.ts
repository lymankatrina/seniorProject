import { ObjectId } from 'mongodb';
import type { TicketStatus } from '../types/ticketStatuses';

export interface Ticket {
  movieId: ObjectId,
  showtimeId: ObjectId,
  seatId: ObjectId,
  date: string,
  time: string,
  status: TicketStatus,
  buyerId?: string,
  addedAt?: Date,
  _id?: ObjectId
}
