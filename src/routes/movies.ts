import express from 'express';
import { MoviesController } from '../controllers/movies';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';

export const movieRouter = express.Router();
const controller = new MoviesController();

movieRouter.get('/all', controller.getMovies);
movieRouter.get('/nowplaying', controller.getNowPlaying);
movieRouter.get('/comingSoon', controller.getComingSoon);
movieRouter.get('/:id', controller.getMoviesById);
movieRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, controller.postMovie);
movieRouter.get('/title/:title', controller.getByTitle);
movieRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, controller.updateById);
movieRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteById);

export default movieRouter;
