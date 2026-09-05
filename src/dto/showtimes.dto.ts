import type { ShowtimeType } from '../types/showtimeTypes';

export interface CreateShowtimeInput {
  movieId: string;
  startDate: string;
  endDate: string;
  time: string;
  showtimeType: ShowtimeType;
}

export interface UpdateShowtimeInput {
  movieId?: string;
  date?: string;
  time?: string;
  showtimeType?: ShowtimeType;
}
