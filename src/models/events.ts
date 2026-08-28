import { ObjectId } from 'mongodb';
import { ContentStatus } from '../types/contentStatuses';

export default class Event {
  constructor(
    public title: string,
    public tagline: string,
    public description: string,
    public startDate: Date,
    public endDate: Date,
    public startTime: string,
    public endTime: string,
    public image: string,
    public link: string,
    public type: string,
    public postStartDate: Date,
    public postEndDate: Date,
    public status: ContentStatus,
    public _id?: ObjectId
  ) {}
}
