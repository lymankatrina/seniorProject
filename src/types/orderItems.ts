import { ObjectId } from 'mongodb';
import { CustomerType } from './customerTypes';
import { OrderItemType } from './orderItemTypes';

export interface OrderItem {
  itemType: OrderItemType;
  itemId: ObjectId;
  name: string;
  quantity: number;
  unitPriceInCents: number;
  totalPriceInCents: number;
  customerType?: CustomerType;
  ticketNumber?: number;
  showtimeDate?: string;
  movieTitle?: string;
}