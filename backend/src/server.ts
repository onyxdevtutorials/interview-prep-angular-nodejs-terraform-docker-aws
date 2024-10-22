import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import knex from 'knex';
import knexConfig from './knex';
import cors from 'cors';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

const envFile =
  process.env['NODE_ENV'] === 'production'
    ? '../.env.production'
    : '../.env.local';
dotenv.config({ path: envFile });

const app = express();
const port = process.env['PORT'] || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use(logger);
app.use(errorHandler);

console.log('DATABASE_URL:', process.env['DATABASE_URL']);

// knex handles pooling
const db = knex(knexConfig[process.env['NODE_ENV'] || 'development']);

// Test route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
