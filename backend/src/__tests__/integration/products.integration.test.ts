import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import knex from 'knex';
import knexConfig from '../../knexFile';
import dotenv from 'dotenv';
import {
  Product,
  ProductStatus,
} from '@onyxdevtutorials/interview-prep-shared';

dotenv.config({ path: '../../../.env.test' });

const db = knex(knexConfig['test']);

beforeAll(async () => {
  await db.migrate.latest();

  await db.seed.run();

  app.set('db', db);

  const products = await db('products').select('*');
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

describe('POST /products', () => {
  it('should create a new product', async () => {
    const newProduct: Omit<Product, 'id'> = {
      name: 'New Product',
      price: 100,
      description: 'New product description',
      status: ProductStatus.AVAILABLE,
    };

    const response = await request(app).post('/products').send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.price).toBe(newProduct.price);
    expect(response.body.status).toBe(newProduct.status);
  });

  it('should return a 400 for a product with missing fields', async () => {
    const newProduct: Omit<Product, 'id' | 'description'> = {
      name: 'New Product',
      price: 100,
      status: ProductStatus.AVAILABLE,
    };

    const response = await request(app).post('/products').send(newProduct);

    expect(response.status).toBe(400);
  });
});

describe('PUT /products/:id', () => {
  it('should update an existing product', async () => {
    const updatedProduct: Omit<Product, 'id'> = {
      name: 'Updated Product',
      price: 200,
      description: 'Updated product description',
      status: ProductStatus.AVAILABLE,
    };

    const response = await request(app).put('/products/1').send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedProduct.name);
    expect(response.body.price).toBe(updatedProduct.price);
    expect(response.body.description).toBe(updatedProduct.description);
    expect(response.body.status).toBe(updatedProduct.status);
  });

  it('should return a 400 for a product with missing fields', async () => {
    const updatedProduct: Omit<Product, 'id' | 'description'> = {
      name: 'Updated Product',
      price: 200,
      status: ProductStatus.AVAILABLE,
    };

    const response = await request(app).put('/products/1').send(updatedProduct);

    expect(response.status).toBe(400);
  });

  it('should return a 404 for a non-existent product', async () => {
    const updatedProduct: Omit<Product, 'id'> = {
      name: 'Updated Product',
      price: 200,
      description: 'Updated product description',
      status: ProductStatus.AVAILABLE,
    };

    const response = await request(app)
      .put('/products/999')
      .send(updatedProduct);

    expect(response.status).toBe(404);
  });
});

describe('PATCH /products/:id', () => {
  it('should update an existing product', async () => {
    const updatedProduct: Partial<Product> = {
      name: 'Updated Product',
    };

    const response = await request(app)
      .patch('/products/1')
      .send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedProduct.name);
  });

  it('should not return a 400 for a product with "missing" fields (should return 200)', async () => {
    const updatedProduct: Partial<Product> = {
      name: 'Updated Product',
    };

    const response = await request(app)
      .patch('/products/1')
      .send(updatedProduct);

    expect(response.status).toBe(200);
  });

  it('should return a 404 for a non-existent product', async () => {
    const updatedProduct: Partial<Product> = {
      name: 'Updated Product',
    };

    const response = await request(app)
      .patch('/products/999')
      .send(updatedProduct);

    expect(response.status).toBe(404);
  });
});

describe('DELETE /products/:id', () => {
  it('should delete an existing product', async () => {
    const response = await request(app).delete('/products/1');
    expect(response.status).toBe(204);
  });

  it('should return a 404 for a non-existent product', async () => {
    const response = await request(app).delete('/products/999');
    expect(response.status).toBe(404);
  });
});
