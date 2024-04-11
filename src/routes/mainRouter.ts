import express from 'express';
import { MainController } from '../controllers/mainController';

export const mainRouter = express.Router();
const controller = new MainController();

mainRouter.get('/healthCheck', controller.getHealthCheck);
