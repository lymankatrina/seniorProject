import { Request, Response } from 'express';
import fs from 'fs';

const checkAuth = (req: Request, res: Response): void => {
  if (req.oidc.isAuthenticated()) {
    fs.readFile('./public/loggedIn.html', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error reading file');
        return;
      }

      const modifiedData = data.replace('{{userName}}', req.oidc.user.given_name);
      res.send(modifiedData);
    });
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
