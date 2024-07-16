import { ObjectId } from 'mongodb';

export default class Showtime {
  constructor(
    public movieId: ObjectId,
    public startDate: string,
    public endDate: string,
    public time: string,
    public type: string,
    public ticketsAvailable: number,
    public _id?: ObjectId
  ) {}
}
