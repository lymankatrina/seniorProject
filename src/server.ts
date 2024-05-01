import express from 'express';
import { connectToDatabase } from './services/database.services';
import routes from './routes/index';
import { routeNotFound } from './middleware/routeNotFound';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const host = process.env.PROD_HOSTNAME;
const port = process.env.SERVER_PORT || 3000;

const app = express();

connectToDatabase()
  .then(() => {
    app.use(express.json());
    app.use(cors());
    app.use(authMiddleware);
    app.use(express.static('public'));
    app.use('/', routes);
    app.use(routeNotFound);

    app.listen(port, () => {
      console.log(`Server started at ${host} port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
