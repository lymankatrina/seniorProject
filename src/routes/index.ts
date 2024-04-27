import { Router } from 'express';
import { userRouter } from './users';
import { authRouter } from './auth';
import { swaggerRouter } from './swagger';

const routes = Router();

routes.use('/', authRouter);
routes.use('/', swaggerRouter);
routes.use('/users', userRouter);

export default routes;
