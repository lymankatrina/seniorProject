import express from 'express';
import { UsersController } from '../controllers/users';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';

export const userRouter = express.Router();
const controller = new UsersController();

userRouter.get('/all', requiresAuth(), validUserEmail, controller.getUsers);
userRouter.get('/:id', requiresAuth(), validUserEmail, controller.getUsersById);
userRouter.get('/email/:email', requiresAuth(), validUserEmail, controller.getByEmail);
userRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, controller.updateById);
userRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, controller.postUsers);
userRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteById);

export default userRouter;
