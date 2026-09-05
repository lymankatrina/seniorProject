import express from 'express';
import { EventsController } from '../controllers/events';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { eventValidationRules, updateEventValidationRules, validate } from '../middleware/validator';

export const eventRouter = express.Router();
const controller = new EventsController();

eventRouter.get('/all', requiresAuth(), validUserEmail, validAdmin, controller.getAllEvents);
eventRouter.get('/current', controller.getCurrentEvents);
eventRouter.get('/status/:status', controller.getEventByStatus);
eventRouter.get('/type/:type', controller.getEventByType);
eventRouter.get('/:id', controller.getEventById);
eventRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, eventValidationRules(), validate, controller.postEvent);
eventRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, updateEventValidationRules(), validate, controller.updateEventById);
eventRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteEventById);

export default eventRouter;