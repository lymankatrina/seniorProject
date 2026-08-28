import { ObjectId } from 'mongodb';
import { ShowtimeType } from '../types/showtimeTypes'
import { CustomerType } from '../types/customerTypes'

export default class Price {
  constructor(
    public itemType: string,
    public showtimeType: ShowtimeType,
    public customerType: CustomerType,
    public price: number,
    public _id?: ObjectId
  ) {}
}
