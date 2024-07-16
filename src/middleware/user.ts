import { Request, Response, NextFunction } from 'express';
import { collections } from '../services/database.services';
import User from '../models/users';

export const checkUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.oidc || !req.oidc.user || !req.oidc.user.email) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  const userEmail = req.oidc.user.email;

  try {
    const user = await collections.users?.findOne({ email: userEmail });

    if (!user) {
      const newUser = new User(
        req.oidc.user.given_name || '',
        req.oidc.user.family_name || '',
        req.oidc.user.name || '',
        req.oidc.user.phone_number || '',
        userEmail,
        false
      );
      
      await collections.users?.insertOne(newUser);
    }
    
    next();
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to check or add user', error });
  }
};
