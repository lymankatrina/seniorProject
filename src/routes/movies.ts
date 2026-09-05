import express from 'express';
import { requiresAuth } from 'express-openid-connect';
import { MoviesController } from '../controllers/movies';
import { 
  validUserEmail, 
  validAdmin 
} from '../middleware/permissionMiddleware';
import { 
  movieIdParamValidationRules,
  movieTitleParamValidationRules,
  movieValidationRules, 
  updateMovieValidationRules, 
  validate 
} from '../middleware/validator';

export const movieRouter = express.Router();
const controller = new MoviesController();

movieRouter.get(
  '/all', 
  controller.getMovies
);
movieRouter.get(
  '/now-playing',
  controller.getNowPlayingMovies
);
movieRouter.get(
  '/coming-soon', 
  controller.getComingSoonMovies
);
movieRouter.get(
  '/search/:title', 
  movieTitleParamValidationRules(),
  validate,
  controller.searchByTitle
);
movieRouter.get(
  '/:movieId', 
  movieIdParamValidationRules(),
  validate,
  controller.getMovieById
);
movieRouter.post(
  '/new', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  movieValidationRules(), 
  validate, 
  controller.createMovie
);
movieRouter.put(
  '/update/:movieId', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  movieIdParamValidationRules(),
  updateMovieValidationRules(), 
  validate, 
  controller.updateMovieById
);
movieRouter.delete(
  '/delete/:movieId', 
  requiresAuth(), 
  validUserEmail, 
  validAdmin, 
  movieIdParamValidationRules(),
  validate,
  controller.deleteMovieById
);

export default movieRouter;