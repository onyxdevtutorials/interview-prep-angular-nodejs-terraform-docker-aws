import request from 'supertest';
import app from '../../app';
import knex from 'knex';
import knexConfig from '../../knex';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env.test' });

const db = knex(knexConfig['test']);

beforeAll(async () => {
  //   console.log('Running migrations...');
  await db.migrate.latest();
  //   console.log('Migrations completed.');

  //   console.log('Running seeds...');
  await db.seed.run();
  //   console.log('Seeds completed.');

  app.set('db', db);

  const tables = await db.raw(
    'SELECT name FROM sqlite_master WHERE type="table"'
  );
  //   console.log('tables in database after seeding:', tables);

  const products = await db('products').select('*');
  //   console.log('products in database after seeding:', products);
});

afterAll(async () => {
  await db.destroy();
});

describe('GET /products', () => {
  it('should return a list of products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('GET /products/:id', () => {
  it('should return a single product', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it('should return a 404 for a non-existent product', async () => {
    const response = await request(app).get('/products/999');
    expect(response.status).toBe(404);
  });
});
