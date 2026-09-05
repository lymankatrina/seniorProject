import express from 'express';
import { TicketsController } from '../controllers/tickets';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { 
  showtimeIdParamValidationRules, 
  ticketDateParamValidationRules, 
  ticketIdParamValidationRules, 
  updateTicketValidationRules, 
  validate } from '../middleware/validator';

export const ticketRouter = express.Router();
const controller = new TicketsController();

ticketRouter.get(
  '/showtime/:showtimeId',
  showtimeIdParamValidationRules(),
  validate,
  controller.getTicketsByShowtime
);
ticketRouter.get(
  '/seating/:showtimeId/:date', 
  ticketDateParamValidationRules(), 
  validate, 
  controller.getSeatingTicketsByDate
);
ticketRouter.get(
  '/available/:showtimeId/:date', 
  ticketDateParamValidationRules(),
  validate, 
  controller.getAvailableTicketsByDate
);
ticketRouter.post(
  '/generate/:showtimeId', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  showtimeIdParamValidationRules(), 
  validate, 
  controller.generateTicketsFromShowtime
);
ticketRouter.put(
  '/update/:ticketId', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  ticketIdParamValidationRules(), 
  updateTicketValidationRules(), 
  validate, 
  controller.updateTicketById
);
ticketRouter.delete(
  '/showtime/:showtimeId',
  requiresAuth(),
  validUserEmail,
  validAdmin,
  showtimeIdParamValidationRules(),
  validate,
  controller.deleteTicketsByShowtime
);

export default ticketRouter;
