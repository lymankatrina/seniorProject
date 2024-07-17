import express, { Router } from 'express';
import authController from '../controllers/auth';
import { requiresAuth } from 'express-openid-connect';

export const authRouter: Router = express.Router();

authRouter.get('/', authController.checkAuth);

authRouter.get('/landingpage', authController.callback);

authRouter.get('/profile', requiresAuth(), authController.getProfile);

