import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../../openapi.json';

export const swaggerRouter = express.Router();

swaggerRouter.use('/api-docs', swaggerUi.serve);
swaggerRouter.get('/api-docs', swaggerUi.setup(swaggerDocument));
