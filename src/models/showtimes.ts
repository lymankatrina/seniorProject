import { ObjectId } from 'mongodb';
import { ShowtimeType } from '../types/showtimeTypes';

export default class Showtime {
  constructor(
    public movieId: ObjectId,
    public startDate: string,
    public endDate: string,
    public time: string,
    public showtimeType: ShowtimeType,
    public seatCapacity: number,
    public _id?: ObjectId
  ) {}
}
