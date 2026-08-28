import { ObjectId } from 'mongodb';
import { ProductType } from '../types/productTypes';
import { ProductStatus } from '../types/productStatuses';

export default class Product {
  constructor(
    public name: string,
    public description: string,
    public productType: ProductType,
    public priceInCents: number,
    public inventory: number,
    public image: string,
    public status: ProductStatus,
    public _id?: ObjectId
  ) {}
}