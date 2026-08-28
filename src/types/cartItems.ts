import { ObjectId} from 'mongodb';
import { CustomerType } from './customerTypes'

export type CartItemType = 'ticket' | 'product';

export interface CartItem {
  itemType: CartItemType;
  itemId: ObjectId;
  quantity: number;
  addedAt: Date;
  customerType?: CustomerType;
}