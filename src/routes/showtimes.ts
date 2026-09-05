import express from 'express';
import { requiresAuth } from 'express-openid-connect';
import { ShowtimesController } from '../controllers/showtimes';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { 
  showtimeIdParamValidationRules, 
  movieIdParamValidationRules, 
  showtimeValidationRules, 
  updateShowtimeValidationRules, 
  validate 
} from '../middleware/validator';

export const showtimeRouter = express.Router();
const controller = new ShowtimesController();

showtimeRouter.get(
  '/all', 
  controller.getShowtimes
);
showtimeRouter.get(
  '/showtime/:showtimeId', 
  showtimeIdParamValidationRules(),
  validate,
  controller.getShowtimeById
);
showtimeRouter.get(
  '/search/:movieId', 
  movieIdParamValidationRules(),
  validate,
  controller.getShowtimesByMovie
);
showtimeRouter.post(
  '/new', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  showtimeValidationRules(), 
  validate, 
  controller.createShowtimes
);
showtimeRouter.put(
  '/update/:showtimeId', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin,
  showtimeIdParamValidationRules(), 
  updateShowtimeValidationRules(), 
  validate, 
  controller.updateShowtimeById
);
showtimeRouter.delete(
  '/delete/:showtimeId', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  showtimeIdParamValidationRules(),
  validate,
  controller.deleteShowtimeById
);

export default showtimeRouter;
