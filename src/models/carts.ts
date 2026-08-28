import { ObjectId } from 'mongodb';
import { CartItem } from '../types/cartItems';

export default class Cart {
  constructor(
    public userId: ObjectId,
    public items: CartItem[],
    public createdAt: Date,
    public updatedAt: Date,
    public _id?: ObjectId
  ) {}
}
