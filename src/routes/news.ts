import express from 'express';
import { NewsController } from '../controllers/news';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { newsValidationRules, validate } from '../middleware/validator';

export const newsRouter = express.Router();
const controller = new NewsController();

newsRouter.get('/public', controller.getActivePublicNews);
newsRouter.get('/all', requiresAuth(), validUserEmail, validAdmin, controller.getAllNews);
newsRouter.get('/current', requiresAuth(), validUserEmail, validAdmin, controller.getActiveNews);
newsRouter.get('/:id', requiresAuth(), validUserEmail, validAdmin, controller.getNewsById);
newsRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, newsValidationRules(), validate, controller.postNews);
newsRouter.get('/status/:status', requiresAuth(), validUserEmail, validAdmin, controller.getNewsByStatus);
newsRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, newsValidationRules(), validate, controller.updateNewsById);
newsRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteNewsById);
