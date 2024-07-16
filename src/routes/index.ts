import { Router } from 'express';
import { userRouter } from './users';
import { authRouter } from './auth';
import { swaggerRouter } from './swagger';
import { movieRouter } from './movies';
import { eventRouter } from './events';
import { newsRouter } from './news';
import { ticketRouter } from './tickets';
import { surveysRouter } from './surveys';
import { showtimeRouter } from './showtimes';
import { cartRouter } from './carts';
import { pricesRouter } from './prices';

const routes = Router();

routes.use('/', authRouter);
routes.use('/', swaggerRouter);
routes.use('/users', userRouter);
routes.use('/movies', movieRouter);
routes.use('/events', eventRouter);
routes.use('/news', newsRouter);
routes.use('/tickets', ticketRouter);
routes.use('/surveys', surveysRouter);
routes.use('/showtimes', showtimeRouter);
routes.use('/carts', cartRouter);
routes.use('/prices', pricesRouter);

export default routes;
