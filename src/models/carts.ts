import { ObjectId } from 'mongodb';

export default class Cart {
  constructor(
    public userId: ObjectId,
    public tickets: { ticketId: ObjectId; addedAt: Date; priceType?: string }[],
    public createdAt: Date,
    public updatedAt: Date,
    public _id?: ObjectId
  ) {}
}
