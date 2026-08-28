import { ObjectId } from 'mongodb';
import { ContentStatus } from '../types/contentStatuses';

export default class News {
  constructor(
    public title: string,
    public tagline: string,
    public description: string,
    public date: Date,
    public image: string,
    public link: string,
    public status: ContentStatus,
    public isActive: boolean,
    public _id?: ObjectId
  ) {}
}
