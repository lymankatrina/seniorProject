import type { ObjectId } from 'mongodb';
import type { ShowtimeType } from '../types/showtimeTypes';

export interface Showtime {
  movieId: ObjectId;
  date: string;
  time: string;
  showtimeType: ShowtimeType;
  _id?: ObjectId;
}
