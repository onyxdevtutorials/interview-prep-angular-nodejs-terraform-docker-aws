import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

let envFile: string;

switch (process.env['NODE_ENV']) {
  case 'production':
    envFile = '../.env.production';
    break;
  case 'development':
    envFile = '../.env.development';
    break;
  case 'test':
    envFile = '../.env.test';
    break;
  default:
    envFile = '../.env.local';
}

dotenv.config({ path: envFile });

const config: { [key: string]: Knex.Config } = {
  local: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: path.join(__dirname, '../migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../seeds'),
    },
    debug: true,
  },
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
      directory: path.join(__dirname, '../migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../seeds'),
    },
  },
  test_users: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: path.join(__dirname, '../migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../seeds'),
    },
  },
  test_products: {
    client: 'pg',
    connection: process.env['DATABASE_URL'],
    migrations: {
      directory: path.join(__dirname, '../migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../seeds'),
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
