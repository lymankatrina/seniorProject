import express from 'express';
import { GenresController } from '../controllers/genres';
import { requiresAuth } from 'express-openid-connect';
import { validUserEmail, validAdmin } from '../middleware/permissionMiddleware';

export const genresRouter = express.Router();
const controller = new GenresController();

genresRouter.get('/all', requiresAuth(), validUserEmail, controller.getGenres);
genresRouter.get('/:id', requiresAuth(), validUserEmail, controller.getGenresById);
genresRouter.put('/update/:id', requiresAuth(), validUserEmail, validAdmin, controller.updateById);
genresRouter.post('/new', requiresAuth(), validUserEmail, validAdmin, controller.postGenre);
genresRouter.delete('/delete/:id', requiresAuth(), validUserEmail, validAdmin, controller.deleteById);

export default genresRouter;
