import { ObjectId} from 'mongodb';
import { CustomerType } from './customerTypes'

export interface TicketCartItem {
  itemType: 'ticket';
  itemId: ObjectId;
  quantity: 1;
  addedAt: Date;
  customerType?: CustomerType;
}

export interface ProductCartItem {
  itemType: 'product';
  itemId: ObjectId;
  quantitye: number;
  addedAt: Date;
}

export type CartItem = 
  | TicketCartItem 
  | ProductCartItem;
  