import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { collections } from '../services/database.services';
import {Cart} from '../models/carts';

export class CartController {
  getCurrentUserCart = async (
    req: Request,
    res: Response
  ): Promise<void> => {};

  addTicketToCart = async (
    req: Request, 
    res: Response
  ): Promise<void> => {};

  addProductToCart = async (
    req: Request, 
    res: Response
  ): Promise<void> => {};

  updateTicketCustomerType = async (
    req: Request, 
    res: Response
  ): Promise<void> => {};

  updateProductQuantity = async (
    req: Request,
    res: Response
  ): Promise<void> => {};

  removeItemFromCart = async (
    req: Request, 
    res: Response
  ): Promise<void> => {};

  clearCart = async (
    req: Request,
    res: Response
  ): Promise<void> => {};

  removeExpiredTickets = async (
    req: Request, 
    res: Response
  ): Promise<void> => {};
}

