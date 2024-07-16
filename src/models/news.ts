import { ObjectId } from 'mongodb';

export default class News {
  constructor(
    public title: string,
    public tagline: string,
    public description: string,
    public date: string,
    public image: string,
    public link: string,
    public status: string,
    public isActive: boolean,
    public _id?: ObjectId
  ) {}
}
