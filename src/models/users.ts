import { ObjectId } from 'mongodb';

export default class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public userName: string,
    public email: string,
    public isAdmin: boolean,
    public phone?: string,
    public _id?: ObjectId
  ) {}
}
