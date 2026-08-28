import { 
  Request, 
  Response, 
  NextFunction } from 'express';

import { collections } from '../services/database.services';
import User from '../models/users';

export const checkUserExists = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authUser = req.oidc?.user;

  if (!authUser?.email) {
    res.status(401).json({
      message: 'User not authenticated'
    });
    return;
  }

  const userEmail = authUser.email;

  try {
    const existingUser = await collections.users.findOne({ email: userEmail });

    if (!existingUser) {
      const firstName = authUser.given_name;
      const lastName = authUser.family_name;
      const userName = authUser.name || userEmail;

      if (!firstName || !lastName) {
        res.status(400).json({
          message: 'User profile is missing required name information'
        });
        return;
      }

      const newUser = new User(
        firstName,
        lastName,
        userName,
        userEmail,
        false,
        authUser.phone_number || undefined
      );
      
      await collections.users?.insertOne(newUser);
    }
    
    next();
    
  } catch (error) {
    console.error('Failed to check or add user', error);

    res.status(500).json({
      message: 'Failed to check or add user'
    });
  }
};
