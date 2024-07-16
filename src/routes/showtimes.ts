import express from 'express';
import { ShowtimesController } from '../controllers/showtimes';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { showtimeValidationRules, validate } from '../middleware/validator';

export const showtimeRouter = express.Router();
const controller = new ShowtimesController();

showtimeRouter.get('/all', controller.getShowtimes);
showtimeRouter.get('/now-playing', controller.getNowPlayingMovies);
showtimeRouter.get('/coming-soon', controller.getComingSoonMovies);
showtimeRouter.get('/showtime/:id', controller.getShowtimeById);
showtimeRouter.get('/search/:movieId', controller.getShowtimesByMovie);
showtimeRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, showtimeValidationRules(), validate, controller.postShowtime);
showtimeRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, showtimeValidationRules(), validate, controller.updateShowtimeById);
showtimeRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteShowtimeById);

export default showtimeRouter;
