import express from 'express';
import { SeatsController } from '../controllers/seats';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { seatValidationRules, updateSeatValidationRules, validate } from '../middleware/validator';

export const seatsRouter = express.Router();
const controller = new SeatsController();

seatsRouter.get('/all', requiresAuth(), validUserEmail, validAdmin, controller.getSeats);
seatsRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, seatValidationRules(), validate, controller.createSeat);
seatsRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, updateSeatValidationRules(), validate, controller.updateSeatById);
seatsRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteSeatById);

export default seatsRouter;