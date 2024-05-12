import { ObjectId } from 'mongodb';

export default class Genre {
  constructor(public genre: string, public _id?: ObjectId) {}
}
