import { Knex } from 'knex';
import dotenv from 'dotenv';

const envFile =
  process.env['NODE_ENV'] === 'production'
    ? '../.env.production'
    : process.env['NODE_ENV'] === 'test'
    ? '../.env.test'
    : '../.env.local';
dotenv.config({ path: envFile });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  test: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default config;
