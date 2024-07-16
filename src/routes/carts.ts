import express from 'express';
import { CartController } from '../controllers/carts';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail } from '../middleware/permissionMiddleware';
import { checkUserExists } from '../middleware/user';

export const cartRouter = express.Router();
const controller = new CartController();

cartRouter.get('/user', requiresAuth(), checkUserExists, validUserEmail, controller.displayCurrentUsersShoppingCart);
cartRouter.get('/user/:userId', requiresAuth(), checkUserExists, validUserEmail, controller.getShoppingCartByUser);
cartRouter.post('/items', requiresAuth(), checkUserExists, controller.addItemsToCart);
cartRouter.put('/updatePriceType', requiresAuth(), validUserEmail, controller.updatePriceType);
cartRouter.put('/update', requiresAuth(), checkUserExists, controller.removeItemsFromCart);
cartRouter.post('/remove-expired', requiresAuth(), validUserEmail, controller.removeExpiredItems);

export default cartRouter;
