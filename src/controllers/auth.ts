import { Request, Response } from 'express';
import { collections } from '../services/database.services';
import User from '../models/users';

const checkAuth = async (req: Request, res: Response): Promise<void> => {
  if (!req.oidc.isAuthenticated()) {
    res.sendFile('home.html', { root: './public' });
    return;
  }

  try {
    const userEmail = req.oidc.user.email;
    const user = await collections.users?.findOne({ email: userEmail });

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    if (user.isAdmin) {
      res.sendFile('admin.html', { root: './public' });
    } else {
      res.sendFile('loggedIn.html', { root: './public' });
    }
  } catch (error) {
    console.error('Error checking user authentication:', error);
    res.status(500).send('Internal Server Error');
  }
};


const callback = (req: Request, res: Response) => {
  res.send(`Authentication successful. Welcome to the San Juan Theater Directory! Add '/api-docs' to the url to view API documentation!`);
};

const getProfile = (req: Request, res: Response) => {
  res.status(200).json({
    userProfile: req.oidc.user,
    title: 'Profile page'
  });
};

export default { callback, checkAuth, getProfile };
