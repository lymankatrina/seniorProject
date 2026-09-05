import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';
import type { Seat } from '../models/seats';
import type { CreateSeatInput, UpdateSeatInput } from '../dto/seats.dto';
import { collections } from '../services/database.services';

export class SeatsController {
  getSeats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const seats = await collections.seats
        .find()
        .toArray();
      res.status(200).json(seats);
    } catch (error) {
      console.error('Error getting seats:', error);
      res.status(500).json({
        message: 'Error getting seats'
      });
    }
  };

  getSeatById = async (req: Request, res: Response): Promise<void> => {

  };

  createSeat = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = matchedData(req) as CreateSeatInput;
      const newSeat: Seat = {
        ...data
      };
      const result = await collections.seats.insertOne(newSeat);
      res.status(201).json({
        message: 'Successfully created new seat',
        seatId: result.insertedId
      });
    } catch (error) {
      console.error('Error creating a new seat:', error);
      res.status(500).json({ 
        message: 'Error creating a new seat' 
      });
    }
  };

  updateSeatById = async (req: Request, res: Response): Promise<void> => {
const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid seat ID'
      });
      return;
    }
    try {
      const data = matchedData(req) as UpdateSeatInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No seat items provided for update'
        });
        return;
      }
      const updatedSeat: Partial<Seat> = {
        ...data
      };
      const result = await collections.seats.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updatedSeat }
      );
      if (result.matchedCount === 0) {
        res.status(404).json({
          message: 'Seat not found'
        });
        return;
      }
      res.status(200).json({
        message:
        result.modifiedCount > 0
        ? `Successfully updated seat with id ${id}`
        : 'Seat is already up to date'
      });
    } catch (error) {
      console.error('Error updating seat', error);
      res.status(500).json({
        message: 'Error updating seat'
      });
    }
  };

  deleteSeatById = async (req: Request, res: Response): Promise<void> => {
const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid seat ID'
      });
      return;
    }
    try {
      const seatId = new ObjectId(id);
      const result = await collections.seats.deleteOne({ _id: seatId });
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: `Seat with id ${id} not found.`
        });
        return;
      }
      res.status(200).json({
        message: 'Successfully deleted seat'
      });
    } catch (error) {
      console.error('Error deleting seat:', error);
      res.status(500).json({
        message: 'Error deleting seat'
      });
    }
  };
}

