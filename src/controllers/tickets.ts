import { Request, Response } from 'express';
import { ObjectId, MongoServerError } from 'mongodb';
import { matchedData } from 'express-validator';
import type { Ticket } from '../models/tickets';
import type { UpdateTicketInput } from '../dto/tickets.dto';
import { collections } from '../services/database.services';
import { getDatesBetween } from '../helpers/helpers';
import { getEnv } from '../config/env';

const seatsCollectionName = getEnv('SEATS_COLLECTION_NAME');

export class TicketsController {
  generateTicketsFromShowtime = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { showtimeId } = matchedData(req, {
      locations: ['params']
    }) as unknown as ShowtimeIdParams;
    const showtimeObjectId = new ObjectId(showtimeId);
    try {
      const showtime = await collections.showtimes.findOne({
        _id: showtimeObjectId
      });
      if (!showtime) {
        res.status(404).json({
          message: `Unable to find showtime with id: ${showtimeId}`
        });
        return;
      }
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
      const seats = await collections.seats
        .find()
        .sort({
          section: 1,
          row: 1,
          seat: 1
        })
        .toArray();
      if (seats.length === 0) {
        res.status(400).json({
          message: 'No seats have been configured'
        });
        return;
      }
      const existingTickets = await collections.tickets
        .find({
          showtimeId: showtimeObjectId
        })
        .toArray();
      const existingTicketKeys = new Set(
        existingTickets.map(
          ticket =>
            `${ticket.date}-${ticket.time}-${ticket.seatId.toString()}`
        )
      );
      const ticketsToInsert: Ticket[] = [];
      for (const date of dates) {
        const dateString = 
          date.toISOString().split('T')[0];
        for (const seat of seats) {
          if (!seat._id) {
            continue;
          }
          const ticketKey =
            `${dateString}-${showtime.time}-${seat._id.toString()}`;
          if (existingTicketKeys.has(ticketKey)) {
            continue;
          }
          ticketsToInsert.push({
            movieId: showtime.movieId,
            showtimeId: showtimeObjectId,
            seatId: seat._id,
            date: dateString,
            time: showtime.time,
            status: 'available'
          });
        }
      }
      if (ticketsToInsert.length === 0) {
        res.status(200).json({
          message:
            `All tickets already exist for showtime ID: ${showtimeId}`,
          insertedCount: 0
        });
        return;
      }
      const result = 
        await collections.tickets.insertMany(
          ticketsToInsert
        );
      res.status(201).json({
        message:
          `Tickets for showtime ID ${showtimeId} created successfully`,
        insertedCount: result.insertedCount
      });
    } catch (error) {
      console.error(
        'Error generating tickets:', 
        error
      );
      res.status(500).json({ 
        message: 'Error generating tickets'
      });
    }
  }; 

  getTicketsByShowtime = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { showtimeId } = matchedData(req, {
      locations: ['params']
    }) as unknown as ShowtimeIdParams;
    const showtimeObjectId =
     new ObjectId(showtimeId);
    try {
      const tickets = 
        await collections.tickets
          .aggregate([
            {
              $match: {
                showtimeId: showtimeObjectId
              }
            },
            {
              $lookup: {
                from: seatsCollectionName,
                localField: 'seatId',
                foreignField: '_id',
                as: 'seat'
              }
            },
            {
              $unwind: '$seat'
            },
            {
              $sort: {
                date: 1,
                time: 1,
                'seat.section': 1,
                'seat.row': 1,
                'seat.seat': 1
              }
            }
          ])
          .toArray();
      if (tickets.length === 0) {
        res.status(404).json({
          message: 
            `Unable to find any tickets with showtime ID: ${showtimeId}`
        });
        return;
      }
      res.status(200).json(tickets);
    } catch (error) {
      console.error(
        'Error getting tickets by showtime:', 
        error
      );
      res.status(500).json({
        message: 
          'Error getting tickets by showtime'
      });
    }
  };

  getAvailableTicketsByShowtime = async(
    req: Request,
    res: Response
  ): Promise<void> => {};

  updateTicketById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { ticketId } = matchedData(req, {
      locations: ['params']
    }) as unknown as TicketIdParams;
    const data = matchedData(req, {
      locations: ['body']
    }) as UpdateTicketInput;
    if (Object.keys(data).length === 0) {
      res.status(400).json({
        message:
        'No ticket fields provided for update'
      });
      return;
    }
    const ticketObjectId = 
      new ObjectId(id);
    try {
      const existingTicket =
        await collections.tickets.findOne({
          _id: ticketObjectId
        });
      if (!existingTicket) {
        res.status(404).json({
          message: 'Ticket not found'
        });
        return;
      }
      const updateData: {
        seatId?: ObjectId;
        status?: Ticket['status'];
      } = {};
      if (data.seatId) {
        const seatObjectId =
          new ObjectId(data.seatId);
        const seat =
          await collections.seats.findOne({
            _id: seatObjectId
          });
        if(!seat) {
          res.status(404).json({
            message: 'Seat not found'
          });
          return;
        }
        updateData.seatId = seatObjectId;
      }
      if (data.status) {
        updateData.status = data.status;
      }
      const updateOperation: {
        $set: typeof updateData;
        $unset?: {
          buyerId: string;
          addedAt: string;
        };
      } = {
        $set: updateData
      };
      if (data.status === 'available') {
        updateOperation.$unset = {
          buyerId: '',
          addedAt: ''
        };
      }
      const result =
        await collections.tickets.updateOne(
          {
            _id: ticketObjectId
          },
          updateOperation
        );
      res.status(200).json({
        message:
          result.modifiedCount > 0
            ? `Successfully updated ticket with id ${ticketId}`
            : 'Ticket is already up to date'
      });
    } catch (error) {
      if (
        error instanceof MongoServerError &&
        error.code === 11000
      ) {
        res.status(409).json({
          message: 
            'That seat is already assigned to another ticket for this showing'
        });
        return;
      }
      console.error(
        'Error updating ticket:',
        error
      );
      res.status(500).json({
        message: 'Error updating ticket'
      });
    }
  };

  deleteTicketsByShowtime = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { showtimeId } = matchedData(req, {
      locations: ['params']
    }) as unknown as { showtimeId: string };
    const showtimeObjectId = 
      new ObjectId(showtimeId);
    const session = collections.client.startSession();
    try {
      const soldTicket =
        await collections.tickets.findOne(
          {
            showtimeId: showtimeObjectId,
            status: 'sold'
          },
          { session }
        );
      if (soldTicket) {
        res.status(409).json({
          message: 
            'Tickets cannot be deleted because one or more tickets have already been sold'
        });
        return;
      }
      const tickets = await collections.tickets
        .find(
          {
            showtimeId: showtimeObjectId
          },
          { session }
        )
        .toArray();
      if (tickets.length === 0) {
        res.status(404).json({
          message:
            `No tickets found for showtime ID: ${showtimeId}`
        })
        return;
      }
      const ticketIds = tickets.map(
        ticket => ticket._id
      );
      await session.withTransaction(async () => {
        await collections.carts.updateMany(
          {
            'tickets.ticketId': {
              $in: ticketIds
            }
          },
          {
            $pull: {
              tickets: {
                ticketId: {
                  $in: ticketIds
                }
              }
            },
            $set: {
              updatedAt: new Date()
            }
          },
          { session }
        );
        await collections.tickets.deleteMany(
          {
            showtimeId: showtimeObjectId
          },
          { session }
        );
      });
      res.status(200).json({
        message:
          `Successfully deleted tickets for showtime ID ${showtimeId}`,
          deletedCount: tickets.length
      });
    } catch (error) {
      console.error(
        'Error deleting tickets by showtime:',
        error
      );
      res.status(500).json({
        message: 'Error deleting tickets'
      });
    }
  };
}
