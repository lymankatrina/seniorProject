import type { ShowtimeType } from '../types/showtimeTypes';

export interface CreateShowtimeInput {
  movieId: string;
  startDate: string;
  endDate: string;
  time: string;
  showtimeType: ShowtimeType;
  seatCapacity: number;
}

export type UpdateShowtimeInput = Partial<CreateShowtimeInput>;