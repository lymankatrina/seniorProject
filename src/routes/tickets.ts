import express from 'express';
import { TicketsController } from '../controllers/tickets';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { ticketValidationRules, validate } from '../middleware/validator';

export const ticketRouter = express.Router();
const controller = new TicketsController();

ticketRouter.get('/generate/:showtimeId', requiresAuth(), validUserEmail, validAdmin, controller.generateTicketsFromShowtime);
ticketRouter.get('/all', requiresAuth(), validUserEmail, validAdmin, controller.getTickets);
ticketRouter.get('/seating/:showtimeId/:date', controller.getSeatingTicketsByDate);
ticketRouter.get('/available/:showtimeId/:date', controller.getAvailableTicketsByDate);
ticketRouter.post('/purchase/single', requiresAuth(), controller.purchaseSingleTicket);
ticketRouter.post('/purchase/multiple', requiresAuth(), controller.purchaseMultipleTickets);

export default ticketRouter;
