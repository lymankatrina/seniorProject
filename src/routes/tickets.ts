import express from 'express';
import { TicketsController } from '../controllers/tickets';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { ticketValidationRules, validate } from '../middleware/validator';

export const ticketRouter = express.Router();
const controller = new TicketsController();

ticketRouter.get('/generate/:showtimeId', requiresAuth(), validUserEmail, validAdmin, ticketValidationRules, validate, controller.generateTicketsFromShowtime);
ticketRouter.get('/seating/:showtimeId/:date', controller.getSeatingTicketsByDate);
ticketRouter.get('/available/:showtimeId/:date', controller.getAvailableTicketsByDate);

export default ticketRouter;
