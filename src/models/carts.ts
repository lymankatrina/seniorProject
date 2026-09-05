import { ObjectId } from 'mongodb';
import { CartItem } from '../types/cartItems';

export interface Cart {
  userId: ObjectId,
  items: CartItem[],
  createdAt: Date,
  updatedAt: Date,
  _id?: ObjectId
}
