import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './services/database.services';
import routes from './routes/index';
import { routeNotFound } from './middleware/routeNotFound';
import * as dotenv from 'dotenv';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.use(express.json());
    app.use(cors());
    app.use(authMiddleware);
    app.use(express.static('public'));
    app.use('/', routes);
    app.use(routeNotFound);

    app.listen(port, () => {
      console.log(`Connected to DB and Web Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  });
