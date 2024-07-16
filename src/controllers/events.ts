import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class EventsController {
  getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await collections.events.find().sort({ startDate: 1 }).toArray();
      if (events.length > 0) {
        res.status(200).json(events);
      } else {
        res.status(404).send(`No events found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getCurrentEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const publicEvents = await collections.events.find({ status: 'public' }).sort({ startDate: 1 }).toArray();
      const currentEvents = publicEvents.filter((event) => event.postStartDate <= currentDate && event.endDate >= currentDate);
      if (currentEvents.length > 0) {
        res.status(200).json(currentEvents);
      } else {
        res.status(404).send(`Unable to find any public events on ${currentDate}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getEventByType = async (req: Request, res: Response): Promise<void> => {
    const { type } = req.params;
    try {
      const eventsByType = await collections.events.find({ type }).sort({ startDate: 1 }).toArray();
      if (eventsByType.length > 0) {
        res.status(200).json(eventsByType);
      } else {
        res.status(404).send(`Unable to find any ${type} events.`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const eventId = new ObjectId(id);
      const event = await collections.events.findOne({ _id: eventId });
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).send(`Unable to find an event with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  postEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const newEvent = req.body;
      const result = await collections.events.insertOne(newEvent);
      if (result.acknowledged) {
        res.status(201).send(`Successfully created a new event with id ${result.insertedId}`);
      } else {
        res.status(500).send({ error: 'Failed to create a new event' });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  updateEventById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedEvent = req.body;
      const eventId = new ObjectId(id);
      const result = await collections.events.updateOne({ _id: eventId }, { $set: updatedEvent });

      if (result.modifiedCount > 0) {
        res.status(200).send(`Successfully updated event with id ${id}`);
      } else {
        res.status(304).send(`Event with id: ${id} not updated`);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  deleteEventById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const eventId = new ObjectId(id);
      const result = await collections.events.deleteOne({ _id: eventId });
      if (result.deletedCount === 1) {
        res.status(202).send(`Successfully removed event with id ${id}`);
      } else {
        res.status(404).send(`Event with id ${id} does not exist`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
