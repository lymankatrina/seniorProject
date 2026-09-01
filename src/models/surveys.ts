import type { ObjectId } from 'mongodb';

export interface Survey {
  surveyLink: string;
  isActive: boolean;
  _id?: ObjectId;
}
