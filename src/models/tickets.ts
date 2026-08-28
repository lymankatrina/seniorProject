import { ObjectId } from 'mongodb';
import { TicketStatus } from '../types/ticketStatuses';

export default class Ticket {
  constructor(
    public movieId: ObjectId,
    public showtimeId: ObjectId,
    public date: string,
    public time: string,
    public status: TicketStatus,
    public ticketNumber: number,
    public _id?: ObjectId
  ) {}
}
