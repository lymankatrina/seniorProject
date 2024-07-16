import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class PricesController {
  addPrices = async (req: Request, res: Response): Promise<void> => {
    const { priceType, price } = req.body;

    if (!priceType || !price) {
      res.status(400).json({ message: 'Type and price are required' });
      return;
    }

    try {
      const newPrice = { priceType, price };
      const result = await collections.prices.insertOne(newPrice);
      res.status(201).json(result);     
    } catch (error) {
      res.status(500).json({ message: 'Failed to add price', error });
    }
  };
  
  getPrices = async (req: Request, res: Response): Promise<void> => {
    try {
      const prices = await collections.prices.find({}).toArray();
      res.status(200).json(prices);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

    getPricesById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const priceId = new ObjectId(id);
      const price = await collections.prices.findOne({ _id: priceId });
      if (price) {
        res.status(200).json(price);
      } else {
        res.status(404).send(`Unable to find a price with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


  updatePrices = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { priceType, price } = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    if (!priceType && !price) {
      res.status(400).json({ message: 'PriceType or price must be provided' });
      return;
    }
    
    try {
      const updatedPrice = { ...(priceType && { priceType }), ...(price && { price }) };
      const result = await collections.prices.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPrice }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({ message: 'Price not found' });
        return;
      }

      res.status(200).json({ message: 'Price updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update price', error });
    }
  };

  deletePrices = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    try {
      const result = await collections.prices.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Price not found' });
        return;
      }

      res.status(200).json({ message: 'Price deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete price', error });
    }
  };
}
