import { Router } from 'express';
import { userRouter } from './users';
import { authRouter } from './auth';

const routes = Router();

routes.use('/', authRouter);
routes.use('/users', userRouter);

export default routes;
