import { Router } from 'express';
import { mainRouter } from './mainRouter';

const routes = Router();

routes.use('/main', mainRouter);

export default routes;
