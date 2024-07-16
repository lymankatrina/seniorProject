import express, { Router } from 'express';
import { EventsController } from '../controllers/events';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { eventValidationRules, validate } from '../middleware/validator';

export const eventRouter: Router = express.Router();
const controller = new EventsController();

eventRouter.get('/all', controller.getAllEvents);
eventRouter.get('/current', controller.getCurrentEvents);
eventRouter.get('/:id', controller.getEventById);
eventRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, eventValidationRules(), validate, controller.postEvent);
eventRouter.get('/type/:type', controller.getEventByType);
eventRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, eventValidationRules(), validate, controller.updateEventById);
eventRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteEventById);
