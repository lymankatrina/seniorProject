import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { collections } from '../services/database.services';
import Ticket from '../models/tickets';
import { getDatesBetween } from '../helpers/helpers';

export class TicketsController {
  generateTicketsFromShowtime = async (req: Request, res: Response): Promise<void> => {
    const { showtimeId } = req.params;

    // validate showtime ID
    if (!ObjectId.isValid(showtimeId)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    const showtimeObjectId = new ObjectId(showtimeId);

    try {
      // Find showtime
      const showtime = await collections.showtimes?.findOne({
        _id: showtimeObjectId
      });

      if (!showtime) {
        res.status(404).json({
          message: `Unable to find showtime with id: ${showtimeId}`
        });
        return;
      }

      // Validate ticket capacity
      if (
        !Number.isInteger(showtime.seatCapacity) || showtime.seatCapacity <= 0
      ) {
        res.status(400).json({
          message: 'Showtime does not have a valid seat capacity'
        });
        return;
      }

      // Get every date covered by this showtime
      const dates = getDatesBetween(
        showtime.startDate,
        showtime.endDate
      );

      if (dates.length === 0) {
        res.status(400).json({
          message: 'Showtime does not contain a valid date range'
        });
        return;
      }

      // Find tickets that already exist for this showtime
       const existingTickets = await collections.tickets?.find({
         showtimeId: showtimeObjectId
        }).toArray();

      const existingTicketKeys = new Set(
        existingTickets?.map(ticket =>
          `${ticket.date}-${ticket.ticketNumber}`
        )
      );

      const ticketsToInsert: Ticket[] = [];

      for (const date of dates) {
        const dateString = date.toISOString().split('T')[0];

        for (
          let ticketNumber = 1;
          ticketNumber <= showtime.seatCapacity;
          ticketNumber++
        ) {
          const ticketKey = `${dateString}-${ticketNumber}`;

          // Skip if ticket already exists
          if (existingTicketKeys.has(ticketKey)) {
            continue;
          }

          ticketsToInsert.push(
            new Ticket(
              showtime.movieId,
              showtimeObjectId,
              dateString,
              showtime.time,
              'available',
              ticketNumber
            )
          );
        }
      }

      // Nothing new needs to be generated
      if (ticketsToInsert.length === 0) {
        res.status(200).json({
          message: `All tickets already exist for showtime ID: ${showtimeId}`, insertedCount: 0
        });
        return;
      }

      // Insert missing tickets
      const result = await collections.tickets?.insertMany(
        ticketsToInsert
      );

      res.status(201).json({
        message: `Tickets for showtime ID ${showtimeId} created successfully:`, insertedCount: result?.insertedCount ?? 0
       });
    } catch (error) {
      console.error('Error generating tickets:', error);
      
      res.status(500).json({ 
        message: 'Error generating tickets'
      });
    }
  }; 

  getTicketsByShowtime = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { showtimeId } = req.params;

    // Validate showtime ID
    if (!ObjectId.isValid(showtimeId)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    const showtimeObjectId = new ObjectId(showtimeId);

    try {
      const tickets = await collections.tickets?.find({ 
        showtimeId: showtimeObjectId 
      })
      .sort({
        date: 1,
        ticketNumber: 1
      })
        .toArray();

      if (tickets?.length === 0) {
        res.status(404).json({
          message: `Unable to find any tickets with showtime ID: ${showtimeId}`
        });
        return;
      }

      res.status(200).json(tickets);
    } catch (error) {
      console.error('Error getting tickets by showtime:', error);

      res.status(500).json({
        message: 'Error getting tickets by showtime'
      });
    }
  };

  getSeatingTicketsByDate = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { showtimeId, date } = req.params;

    if (!ObjectId.isValid(showtimeId)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    try {
      const showtimeObjectId = new ObjectId(showtimeId);

      const tickets = await collections.tickets?.find({
          showtimeId: showtimeObjectId,
          date
        })
        .sort({
          ticketNumber: 1
        })
        .toArray();
      
        res.status(200).json(tickets);
    } catch (error) {
      console.error('Error getting seating tickets:', error);

      res.status(500).json({
        message: 'Error getting seating tickets'
      });
    }
  };

  getAvailableTicketsByDate = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
      const { showtimeId, date } = req.params;

      // Validate showtime ID
      if (!ObjectId.isValid(showtimeId)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    try {
      const showtimeObjectId = new ObjectId(showtimeId);

      const tickets = await collections.tickets?.find({
          showtimeId: showtimeObjectId,
          date,
          status: 'available'
        })
        .sort({
          ticketNumber: 1
        })
        .toArray();

      res.status(200).json(tickets ?? []);
    } catch (error) {
      console.error('Error getting available tickets:', error);

      res.status(500).json({
        message: 'Error getting available tickets'
      });
    }
  };
}
