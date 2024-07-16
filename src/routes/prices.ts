import express from 'express';
import { PricesController } from '../controllers/prices';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';

export const pricesRouter = express.Router();
const controller = new PricesController();

pricesRouter.get('/', requiresAuth(), validUserEmail, controller.getPrices);
pricesRouter.get('/:id', requiresAuth(), validUserEmail, controller.getPricesById);
pricesRouter.post('/add', requiresAuth(), validUserEmail, validAdmin, controller.addPrices);
pricesRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, controller.updatePrices);
pricesRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deletePrices);
