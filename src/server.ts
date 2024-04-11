import http from 'http';
import express from 'express';
import './config/logging';

import { corsHandler } from './middleware/corsHandler';
import { loggingHandler } from './middleware/loggingHandler';
import routes from './routes/index';
import { routeNotFound } from './middleware/routeNotFound';
import { SERVER } from './config/config';

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = () => {
    logging.info('--------------------------------------------------');
    logging.info('Initializing API');
    logging.info('--------------------------------------------------');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    logging.info('--------------------------------------------------');
    logging.info('Logging & Configuration');
    logging.info('--------------------------------------------------');
    application.use(loggingHandler);
    application.use(corsHandler);

    logging.info('--------------------------------------------------');
    logging.info('Define Controller Routing');
    logging.info('--------------------------------------------------');
    application.use('/', routes);

    logging.info('--------------------------------------------------');
    logging.info('Define Routing Error');
    logging.info('--------------------------------------------------');
    application.use(routeNotFound);

    logging.info('--------------------------------------------------');
    logging.info('Starting Server');
    logging.info('--------------------------------------------------');
    httpServer = http.createServer(application);
    httpServer.listen(SERVER.SERVER_PORT, () => {
        logging.info('--------------------------------------------------');
        logging.info(`Server Started on ${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`);
        logging.info('--------------------------------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
