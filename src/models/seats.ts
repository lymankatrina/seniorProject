import type { ObjectId } from 'mongodb';
import type { SectionType } from '../types/section';

export interface Seat {
  seat: number;
  row: string;
  section: SectionType;
  _id?: ObjectId;
}
