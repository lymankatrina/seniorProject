import express from 'express';
import cors from 'cors';

import { connectToDatabase, mongoClient } from './services/database.services';
import routes from './routes/index';
import { routeNotFound } from './middleware/routeNotFound';
import { authMiddleware } from './middleware/authMiddleware';

const port = process.env.PORT || 3000;

const app = express();

connectToDatabase()
  .then(() => {
    app.use(express.json());
    app.use(cors());
    app.use(authMiddleware);
    app.use(express.static('public'));
    app.use('/', routes);
    app.use(routeNotFound);

    const server = app.listen(port, () => {
      console.log(`Server is listening at port ${port}`);
    });

    const shutdown = async () => {
      console.log('Shutting down server...');

      server.close(async () => {
        await mongoClient.close();

        console.log(
          'MongoDB connection closed'
        );

        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
