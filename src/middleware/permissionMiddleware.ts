import { Request, Response, NextFunction } from 'express';
import { UsersController } from '../controllers/users';
import User from '../models/users';

const controller = new UsersController();

const getEmails = async () => {
    let users: User[] = await controller.getAllEmails();
    return users.map((user) => user.email);
};

const validEmail = async (req: Request) => {
    const email: string = req.oidc.user.email;
    try {
        const validEmails: string[] = await getEmails();
        if (!Array.isArray(validEmails)) {
            throw new Error('Emails data is not an array');
        }
        return validEmails.includes(email);
    } catch (error) {
        console.error('Error fetching or processing emails:', error);
        return false;
    }
};

const validUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    const isValidUser = await validEmail(req);
    if (!isValidUser) {
        res.status(403).send('Access denied.');
        return;
    }
    next();
};

const validAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let email: string = req.oidc.user.email;
    const user = await controller.getUserByEmail(email);
    if (!user || !user.isAdmin) {
        res.status(403).send('Access denied');
        return;
    }
    next();
};

export { validEmail, validUserEmail, validAdmin };
