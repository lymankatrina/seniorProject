import { ObjectId } from 'mongodb';

export default class Survey {
  constructor(
    public surveyLink: string,
    public isActive: boolean,
    public _id?: ObjectId
  ) {}
}
