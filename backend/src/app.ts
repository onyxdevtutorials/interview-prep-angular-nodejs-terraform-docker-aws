import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import knex from 'knex';
import knexConfig from './knexFile';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express-serve-static-core';

const envFile =
  process.env['NODE_ENV'] === 'production'
    ? '../.env.production'
    : process.env['NODE_ENV'] === 'test'
    ? '../.env.test'
    : '../.env.local';

dotenv.config({ path: envFile });

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(logger);

// db will be test if running tests
if (!app.get('db')) {
  const db = knex(knexConfig[process.env['NODE_ENV'] || 'development']);
  app.set('db', db);
}

app.use(
  '/users',
  (req: Request, res: Response, next: NextFunction) => {
    req.db = app.get('db');
    next();
  },
  usersRouter
);

app.use(
  '/products',
  async (req: Request, res: Response, next: NextFunction) => {
    const db = app.get('db');
    req.db = db;
    next();
  },
  productsRouter
);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);

export default app;
