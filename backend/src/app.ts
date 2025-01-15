import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import knex from 'knex';
import knexConfig from './knexFile';
import { Request, Response, NextFunction } from 'express-serve-static-core';

const app = express();
app.use(bodyParser.json());

let corsOrigin: string;

if (process.env['NODE_ENV'] === 'local') {
  corsOrigin = 'http://localhost:4200';
} else {
  corsOrigin = 'http://dev.interviewprep.onyxdevtutorials.com';
}

const corsOptions = {
  origin: corsOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(logger);

// db will be test if running tests
if (!app.get('db')) {
  const db = knex(knexConfig[process.env['NODE_ENV'] || 'development']);
  app.set('db', db);
}

app.use(
  '/api/v0/users',
  (req: Request, res: Response, next: NextFunction) => {
    req.db = app.get('db');
    next();
  },
  usersRouter
);

app.use(
  '/api/v0/products',
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
