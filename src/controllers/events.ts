import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';
import type { Event } from '../models/events';
import type { CreateEventInput, UpdateEventInput } from '../dto/events.dto';
import { collections } from '../services/database.services';
import { CONTENT_STATUSES } from '../types/contentStatuses';
import type { ContentStatus } from '../types/contentStatuses';
import { EVENT_TYPES } from '../types/eventTypes';
import type { EventType } from '../types/eventTypes';

export class EventsController {
  getAllEvents = async (
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const events = await collections.events
        .find()
        .sort({ startDate: 1 })
        .toArray();
      res.status(200).json(events);
    } catch (error) {
      console.error('Error getting events:', error);
      res.status(500).json({
        message: 'Error getting events'
      });
    }
  };

  getCurrentEvents = async (
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const currentEvents = await collections.events
        .find({ 
          status: 'public',
          postStartDate: { $lte: today },
          postEndDate: { $gte: today }
        })
          .sort({ startDate: 1 })
          .toArray();
      res.status(200).json(currentEvents);
    } catch (error) {
      console.error(
        'Error getting current events:',
        error
      );
      res.status(500).json({
        message: 'Error getting current events'
      });
    }
  };

  getEventByType = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { type } = req.params;
    if (typeof type !== 'string' || !type.trim()) {
      res.status(400).json({
        message: 'Event type is required'
      });
      return;
    }
    const normalizedType = type
      .trim()
      .toLowerCase();
    if (
      !EVENT_TYPES.includes(
        normalizedType as EventType
      )
    ) {
      res.status(400).json({
        message: 'Invalid event type'
      });
      return;
    }
    try {
      const eventsByType = await collections.events
        .find({ type: normalizedType as EventType })
        .sort({ startDate: 1 })
        .toArray();
      res.status(200).json(eventsByType);
    } catch (error) {
      console.error('Error getting events by type:', error);
      res.status(500).json({
        message: 'Error getting events by type'
      });
    }
  };

  getEventByStatus = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { status } = req.params;
    if (typeof status !== 'string' || !status.trim()) {
      res.status(400).json({
        message: 'Event status is required'
      });
      return;
    }
    const normalizedStatus = status
      .trim()
      .toLowerCase();
    if (
      !CONTENT_STATUSES.includes(
        normalizedStatus as ContentStatus
      )
    ) {
      res.status(400).json({
        message: 'Invalid event status'
      });
      return;
    }
    try {
      const eventsByStatus = await collections.events
        .find({ status: normalizedStatus as ContentStatus })
        .sort({ startDate: 1 })
        .toArray();
      res.status(200).json(eventsByStatus);
    } catch (error) {
      console.error('Error getting events by status:', error);
      res.status(500).json({
        message: 'Error getting events by status'
      });
    }
  };

  getEventById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid event ID'
      });
      return;
    }
    try {
      const event = await collections.events.findOne({ _id: new ObjectId(id) });
      if (!event) {
        res.status(404).json({
          message: 'Event not found'
        });
        return;
      }
      res.status(200).json(event);
    } catch (error) {
      console.error('Error getting event by ID:', error);
      res.status(500).json({
        message: 'Error getting event by ID'
      });
    }
  };

  postEvent = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const data = matchedData(req) as CreateEventInput;
      const newEvent: Event = {
        ...data,
        startDate: new Date(
          `${data.startDate}T00:00:00.000Z`
        ),
        endDate: new Date(
          `${data.endDate}T00:00:00.000Z`
        ),
        postStartDate: new Date(
          `${data.postStartDate}T00:00:00.000Z`
        ),
        postEndDate: new Date(
          `${data.postEndDate}T00:00:00.000Z`
        )
      };
      const result = await collections.events.insertOne(newEvent);
      res.status(201).json({
        message: 'Successfully created a new event', 
        eventId: result.insertedId
      });
    } catch (error) {
      console.error('Error creating event item:', error)
      res.status(500).json({ 
        message: 'Unable to create event item'
       });
    }
  };

  updateEventById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id!== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid event ID'
      });
      return;
    }
    try {
      const eventId = new ObjectId(id);
      const existingEvent = 
        await collections.events.findOne({
          _id: eventId
        });
      if (!existingEvent) {
        res.status(404).json({
          message: 'Event item not found'
        });
        return;
      }
      const data = 
        matchedData(req) as UpdateEventInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No event item fields provided for update'
        });
        return;
      }
      const existingStartDate =
        existingEvent.startDate
          .toISOString()
          .slice(0, 10);
        const existingEndDate =
        existingEvent.endDate
          .toISOString()
          .slice(0, 10);
        const existingPostStartDate =
        existingEvent.postStartDate
          .toISOString()
          .slice(0, 10);
        const existingPostEndDate =
        existingEvent.postEndDate
          .toISOString()
          .slice(0, 10);
        const finalStartDate =
          data.startDate ?? existingStartDate;
        const finalEndDate =
          data.endDate ?? existingEndDate;
        const finalPostStartDate =
          data.postStartDate ?? existingPostStartDate;
        const finalPostEndDate =
          data.postEndDate ?? existingPostEndDate;
        if (finalEndDate < finalStartDate) {
          res.status(400).json({
            message: 'End date must be on or after start date'
          });
          return;
        }
        if (
          finalPostEndDate < finalPostStartDate
        ) {
          res.status(400).json({
            message:
            'Post end date must be on or after post start date'
          });
          return;
        }
        const {
          startDate,
          endDate,
          postStartDate,
          postEndDate,
          ...eventData
        } = data;
        const updatedEvent : Partial<Event> = {
          ...eventData,
          ...(startDate !== undefined && {
            startDate: new Date(
              `${startDate}T00:00:00.000Z`
            )
          }),
          ...(endDate !== undefined && {
            endDate: new Date(
              `${endDate}T00:00:00.000Z`
            )
          }),
          ...(postStartDate !== undefined && {
            postStartDate: new Date(
              `${postStartDate}T00:00:00.000Z`
            )
          }),
          ...(postEndDate !== undefined && {
            postEndDate: new Date(
              `${postEndDate}T00:00:00.000Z`
            )
          })
        };
        const result = await collections.events.updateOne(
          { _id: eventId }, 
          { $set: updatedEvent }
        );
      res.status(200).json({
      message: 
        result.modifiedCount > 0
        ? 'Successfully updated event'
        : 'Event item is already up to date'
      });
    } catch (error) {
      console.error('Error updating event item:', error);
      res.status(500).json({
        message: 'Error updating event item'
      });
    }
  };

  deleteEventById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid event item ID'
      });
      return;
    }
    try {
      const eventId = new ObjectId(id);
      const result = await collections.events.deleteOne({ _id: eventId });
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: 'Event item not found'
        });
        return;
      }
      res.status(200).json({
        message: 'Successfully deleted event item'
      });
    } catch (error) {
      console.error('Error deleting event item:', error)
      res.status(500).json({
        message: 'Unable to delete event item'
      });
    }
  };
}
