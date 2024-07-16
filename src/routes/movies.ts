import express from 'express';
import { MoviesController } from '../controllers/movies';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';
import { movieValidationRules, validate } from '../middleware/validator';

export const movieRouter = express.Router();
const controller = new MoviesController();

movieRouter.get('/all', controller.getMovies);
movieRouter.get('/:id', controller.getMoviesById);
movieRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, movieValidationRules(), validate, controller.postMovie);
movieRouter.get('/search/:title', controller.searchByTitle);
movieRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, movieValidationRules(), validate, controller.updateMovieById);
movieRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteMovieById);

export default movieRouter;
