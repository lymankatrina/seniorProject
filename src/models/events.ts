import { ObjectId } from 'mongodb';

export default class Event {
  constructor(
    public title: string,
    public tagline: string,
    public description: string,
    public date: Date,
    public time: string,
    public image: string,
    public link: string,
    public type: string,
    public postStartDate: Date,
    public postEndDate: Date,
    public status: string,
    public _id?: ObjectId
  ) {}
}
