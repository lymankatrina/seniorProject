import { Request, Response, NextFunction } from 'express';
import { UsersController } from '../controllers/users';

const controller = new UsersController();

export const getUserIdFromEmail = async (req: Request) => {
    const userEmail = req.oidc.user.email;
    const user = await controller.getUserByEmail(userEmail);
    return String(user._id);
};
