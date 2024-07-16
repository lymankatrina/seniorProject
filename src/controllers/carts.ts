import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { collections } from '../services/database.services';
import Cart from '../models/carts';
import Ticket from '../models/tickets';

export class CartController {
  addItemsToCart = async (req: Request, res: Response): Promise<void> => {
    const { ticketIds } = req.body;
    const userEmail = req.oidc.user.email;

    try {
      const user = await collections.users?.findOne({ email: userEmail });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userId = user._id;

      const tickets = await collections.tickets?.find({ _id: { $in: ticketIds.map((id: string) => new ObjectId(id)) } }).toArray();
      const unavailableTickets = tickets.filter(ticket => ticket.status !== 'available');

      if (unavailableTickets.length > 0) {
        res.status(400).json({ message: 'One or more tickets are no longer available. Please select available tickets only.'});
        return;
      }

      await collections.tickets?.updateMany(
        { _id: { $in: ticketIds.map((id: string) => new ObjectId(id)) } },
        { $set: { status: 'reserved', priceType: 'Adult' } }
      );

      const cart = await collections.carts?.findOne(
        { userId: new ObjectId(userId) });
        
        if (!cart) {
          const newCart = new Cart(
            new ObjectId(userId),
            ticketIds.map((id: string) => ({
              ticketId: new ObjectId(id), 
              addedAt: new Date(),
              priceType: 'Adult' })),
            new Date(),
            new Date()
          );
          await collections.carts?.insertOne(newCart);
          res.status(200).json(newCart);
        } else {
          const updatedCart = await collections.carts?.findOneAndUpdate(
            { userId: new ObjectId(userId) },
            {
              $push: { tickets: { $each: ticketIds.map((id: string) => ({ ticketId: new ObjectId(id), addedAt: new Date(), priceType: 'Adult' })) } },
              $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
          );
        res.status(200).json(updatedCart);
        }
      } catch (error) {
      res.status(500).json({ message: 'Failed to add to cart', error });
    }
  };

  updatePriceType = async (req: Request, res: Response): Promise<void> => {
    const { ticketId, priceType } = req.body;
    const userEmail = req.oidc.user.email;

    try {
      const user = await collections.users?.findOne({ email: userEmail });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userId = user._id;
      const cart = await collections.carts?.findOne({ userId: new ObjectId(userId) });

      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }

      const updatedTickets = cart.tickets.map((ticket) => {
        if (ticket.ticketId.equals(new ObjectId(ticketId))) {
          return { ...ticket, priceType };
        }
        return ticket;
      });

      const updatedCart = await collections.carts?.findOneAndUpdate(
        { userId: new ObjectId(userId) },
        { $set: { tickets: updatedTickets, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update price type', error });
    }
  };

  displayCurrentUsersShoppingCart = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.oidc.user.email;

    try {
      const user = await collections.users?.findOne({ email: userEmail });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userId = user._id;
      const cart = await collections.carts?.findOne({ userId: new ObjectId(userId) });
      
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }
      
      const populatedTickets = await Promise.all(cart.tickets.flat().map(async (ticket) => {
        const ticketDetails = await collections.tickets?.findOne({ _id: new ObjectId(ticket.ticketId) });
        if (!ticketDetails) {
          throw new Error(`Ticket not found: ${ticket.ticketId}`);
        }

        const showtimeDetails = await collections.showtimes?.findOne({ _id: new ObjectId(ticketDetails.showtimeId) });
        if (!showtimeDetails) {
          throw new Error(`Showtime not found: ${ticketDetails.showtimeId}`);
        }

        const movieDetails = await collections.movies?.findOne({ _id: new ObjectId(showtimeDetails.movieId) });
        if (!movieDetails) {
          throw new Error(`Movie not found: ${showtimeDetails.movieId}`);
        }

        return {
          ticketId: ticket.ticketId,
          addedAt: ticket.addedAt,
          priceType: ticket.priceType,
          ticketNumber: ticketDetails.ticketNumber,
          showtimeDate: ticketDetails.date,
          showtimeTime: ticketDetails.time,
          movieTitle: movieDetails.title,
        };
      }));

      res.status(200).json({ ...cart, tickets: populatedTickets });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch cart', error });
    }
  };

  getShoppingCartByUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
      const cart = await collections.carts?.findOne({ userId: new ObjectId(userId) });
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch cart', error });
    }
  };

  removeItemsFromCart = async (req: Request, res: Response): Promise<void> => {
    const { ticketIds } = req.body;
    const userEmail = req.oidc.user.email;

    try {
      const user = await collections.users?.findOne({ email: userEmail });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userId = user._id;

      await collections.tickets?.updateMany(
        { _id: { $in: ticketIds.map((id: string) => new ObjectId(id)) } },
        { $set: { status: 'available' } }
      );

      // Get the current user's cart
      const cart = await collections.carts?.findOne({ userId: new ObjectId(userId)});
      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }

      // Get the ticketIds from the cart
      const currentCartTicketIds = cart.tickets.map(ticket => ticket.ticketId);

      // Check the status of each ticket in the cart
      const updatedTickets = [];
      for (const ticket of cart.tickets) {
        const ticketDetails = await collections.tickets?.findOne({ _id: ticket.ticketId });
        if (ticketDetails) {
          if (ticketDetails.status !== 'available') {
          updatedTickets.push(ticket);
        }
      }
    }

      const updatedCart = await collections.carts?.findOneAndUpdate(
        { userId: new ObjectId(userId) },
        {
          $set: { tickets: updatedTickets, updatedAt: new Date() }
        },
        { returnDocument: 'after' }
      );

      if (!updatedCart) {
        res.status(404).json({ message: 'Failed to update cart' });
        return;
      }

      res.status(200).json(updatedCart);      
    } catch (error) {
      res.status(500).json({ message: 'Failed to update cart', error });
    }
  };

  removeExpiredItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const carts = await collections.carts?.find().toArray();

      for (const cart of carts ?? []) {
        const expiredTickets = cart.tickets.filter((ticket) => {
          const expirationTime = new Date(ticket.addedAt).getTime() + 1800 * 1000;
          return Date.now() > expirationTime;
        });

        if (expiredTickets.length > 0) {
          const expiredTicketIds = expiredTickets.map((ticket) => new ObjectId(ticket.ticketId));
          await collections.tickets?.updateMany({ _id: { $in: expiredTicketIds } }, { $set: { status: 'available' } });

          cart.tickets = cart.tickets.filter((ticket) => !expiredTicketIds.includes(ticket.ticketId));
          await collections.carts?.updateOne({ _id: cart._id }, { $set: { tickets: cart.tickets, updatedAt: new Date() } });
        }
      }
      res.status(200).json({ message: 'Expired items removed from cart' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove expired items', error });
    }
  };

}
