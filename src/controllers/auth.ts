import { Request, Response } from 'express';

import path from 'path';

const checkAuth = (req: Request, res: Response): void => {
    res.send(
        req.oidc.isAuthenticated()
            ? `Logged In: Authentication successful. Welcome to the San Juan Theater directory! Add '/api-docs' to the url to view API documentation!`
            : 'Logged out'
    );
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
