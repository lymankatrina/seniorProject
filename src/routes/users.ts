import express from 'express';
import { UsersController } from '../controllers/users';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';

export const userRouter = express.Router();
const controller = new UsersController();

userRouter.get('/all', requiresAuth(), validUserEmail, controller.getUsers);
userRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, controller.postUsers);

export default userRouter;
