import express from 'express';
import { SurveysController } from '../controllers/surveys';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';

export const surveysRouter = express.Router();
const controller = new SurveysController();

surveysRouter.get('/all', requiresAuth(), validUserEmail, validAdmin, controller.getSurveys);
surveysRouter.get('/active', controller.getActiveSurveys);
surveysRouter.get('/:id', requiresAuth(), validUserEmail, controller.getSurveyById);
surveysRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, controller.createSurvey);
surveysRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, controller.updateSurveyById);
surveysRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteSurveyById);

export default surveysRouter;
