import { Request, Response } from 'express';

const checkAuth = (req: Request, res: Response): void => {
  if (req.oidc.isAuthenticated()) {
    res.sendFile('loggedIn.html', { root: './public' });
  } else {
    res.sendFile('home.html', { root: './public' });
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
