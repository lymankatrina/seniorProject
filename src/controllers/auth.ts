import { Request, Response } from 'express';
import { collections } from '../services/database.services';

const checkAuth = async (req: Request, res: Response): Promise<void> => {
  if (!req.oidc.isAuthenticated()) {
    res.sendFile('home.html', { root: './public' });
    return;
  }

  try {
    const user = req.oidc.user;

    if (!user) {
      res.status(401).send('User information not available');
      return;
    }

    const userEmail = user.email;

    const userRecord = await collections.users?.findOne({ email: userEmail });

    if (!userRecord) {
      res.status(404).send('User not found');
      return;
    }

    if (userRecord.isAdmin) {
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
