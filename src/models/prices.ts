import { ObjectId } from 'mongodb';

export default class Price {
  constructor(
    public priceType: string,
    public price: string,
    public _id?: ObjectId
  ) {}
}
