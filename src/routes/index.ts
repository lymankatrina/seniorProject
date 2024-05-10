import { Router } from 'express';
import { userRouter } from './users';
import { authRouter } from './auth';
import { swaggerRouter } from './swagger';
import { movieRouter } from './movies';

const routes = Router();

routes.use('/', authRouter);
routes.use('/', swaggerRouter);
routes.use('/users', userRouter);
routes.use('/movies', movieRouter);

export default routes;
