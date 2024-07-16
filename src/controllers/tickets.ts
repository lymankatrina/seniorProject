import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { collections } from '../services/database.services';
import Showtime from '../models/showtimes';
import Ticket from '../models/tickets';
import { getDatesBetween } from '../helpers/helpers';

export class TicketsController {
  generateTicketsFromShowtime = async (req: Request, res: Response): Promise<void> => {
    const { showtimeId } = req.params;

    try {
      const showtimeResponse = await fetch(`http://localhost:8080/showtimes/showtime/${showtimeId}`);
      if (!showtimeResponse.ok) {
        throw new Error('Failed to fetch showtime');
      }
      const showtime: Showtime = await showtimeResponse.json();

      const existingTickets = await collections.tickets.countDocuments({ showtimeId: new ObjectId(showtimeId) });

      if (existingTickets > 0) {
        console.log(`Tickets already generated for showtime ID: ${showtimeId}. Skipping...`);
        res.status(200).json({ message: `Tickets already generated for showtime ID: ${showtimeId}`, insertedCount: 0 });
        return;
      }

      const tickets: Ticket[] = [];
      const dates = getDatesBetween(showtime.startDate, showtime.endDate);
      dates.forEach((date: Date) => {
        for (let i = 0; i < showtime.ticketsAvailable; i++) {
          tickets.push(
            new Ticket(
              new ObjectId(showtime.movieId),
              new ObjectId(showtime._id),
              date.toISOString().split('T')[0],
              showtime.time,
              'available',
              i + 1
            )
          );
        }
      });

      if (tickets.length > 0) {
        const result = await collections.tickets.insertMany(tickets);
        console.log(`Tickets for showtime ID ${showtimeId} created successfully:`, result.insertedCount);
        res.status(200).json({ message: `Tickets for showtime ID ${showtimeId} created successfully:`, insertedCount: result.insertedCount });
      } else {
        res.status(200).json({ message: `No new tickets generated for showtime ID ${showtimeId}`, insertedCount: 0 });
      }
    } catch (error) {
      console.error('Error generating tickets:', error);
      res.status(500).json({ message: 'Error generating tickets', error: error.message });
    }
  };

  getTickets = async (req: Request, res: Response): Promise<void> => {
    try {
      const tickets = await collections.tickets.find({}).toArray();
      if (tickets.length > 0) {
        res.status(200).json(tickets);
      } else {
        res.status(404).send(`No tickets found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getTicketsByShowtime = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const showtimeId = new ObjectId(id);
      const tickets = await collections.tickets.find({ _id: showtimeId }).toArray();
      if (tickets) {
        res.status(200).json(tickets);
      } else {
        res.status(404).send(`Unable to find any tickets with showtime ID: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getSeatingTicketsByDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { showtimeId, date } = req.params;
      const tickets = await collections.tickets
        .find({
          showtimeId: new ObjectId(showtimeId),
          date
        })
        .sort({ticketNumber: 1})
        .toArray();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getAvailableTicketsByDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { showtimeId, date } = req.params;
      const tickets = await collections.tickets
        .find({
          showtimeId: new ObjectId(showtimeId),
          date,
          status: 'available'
        })
        .toArray();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  purchaseSingleTicket = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketId } = req.body;
      const user = req.oidc.user;

      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const buyerId = user.sub;

      const ticket = await collections.tickets.findOne({ _id: new ObjectId(ticketId), status: 'available' });

      if (!ticket) {
        res.status(400).json({ message: 'Ticket is not available' });
        return;
      }

      const result = await collections.tickets.updateOne({ _id: new ObjectId(ticketId) }, { $set: { status: 'sold', buyerId } });

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Ticket purchased successfully' });
      } else {
        res.status(500).json({ message: 'Failed to purchase ticket' });
      }
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      res.status(500).json({ message: 'Error purchasing ticket', error: error.message });
    }
  };

  purchaseMultipleTickets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketIds } = req.body;
      const user = req.oidc.user;

      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const buyerId = user.sub;

      if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
        res.status(400).json({ message: 'No ticket IDs provided' });
        return;
      }
      if (ticketIds.length > 20) {
        res.status(400).json({ message: 'Cannot purchase more than 20 tickets at a time' });
        return;
      }

      const ticketsToPurchase = await collections.tickets
        .find({
          _id: { $in: ticketIds.map((id) => new ObjectId(id)) },
          status: 'available'
        })
        .toArray();

      if (ticketsToPurchase.length !== ticketIds.length) {
        res.status(400).json({ message: 'Some tickets are not available' });
        return;
      }

      const result = await collections.tickets.updateMany(
        { _id: { $in: ticketsToPurchase.map((ticket) => ticket._id) } },
        { $set: { status: 'sold', buyerId } }
      );

      if (result.modifiedCount === ticketIds.length) {
        res.status(200).json({ message: 'Tickets purchased successfully' });
      } else {
        res.status(500).json({ message: 'Failed to purchase tickets' });
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      res.status(500).json({ message: 'Error purchasing tickets', error: error.message });
    }
  };
}
