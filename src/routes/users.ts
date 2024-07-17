import express from 'express';
import { UsersController } from '../controllers/users';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { validateEmailRule, userValidationRules, validate } from '../middleware/validator';

export const userRouter = express.Router();
const controller = new UsersController();

userRouter.get('/all', requiresAuth(), validUserEmail, controller.getUsers);
userRouter.get('/check-admin', controller.getCurrentUserAdminStatus);
userRouter.get('/:id', requiresAuth(), validUserEmail, controller.getUsersById);
userRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, userValidationRules(), validate, controller.postUsers);
userRouter.get('/email/:email', requiresAuth(), validUserEmail, validateEmailRule(), validate, controller.getByEmail);
userRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, userValidationRules(), validate, controller.updateUserById);
userRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteUserById);

export default userRouter;
