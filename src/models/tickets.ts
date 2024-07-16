import { ObjectId } from 'mongodb';

export default class Ticket {
  constructor(
    public movieId: ObjectId,
    public showtimeId: ObjectId,
    public date: string,
    public time: string,
    public status: 'available' | 'reserved' | 'sold',
    public ticketNumber: number,
    public buyerId?: string,
    public addedAt?: Date,
    public _id?: ObjectId
  ) {}
}
