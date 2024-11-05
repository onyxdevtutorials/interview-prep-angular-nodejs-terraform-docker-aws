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

beforeEach(async () => {
  await db.raw('BEGIN')
});

afterEach(async () => {
  await db.raw('ROLLBACK')
});

// describe('GET /products', () => {
//   it('should return a list of products', async () => {
//     const response = await request(app).get('/products');
//     expect(response.status).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });
// });

// describe('GET /products/:id', () => {
//   it('should return a single product', async () => {
//     const response = await request(app).get('/products/1');
//     expect(response.status).toBe(200);
//     expect(response.body.id).toBe(1);
//   });
// });

// describe('POST /products', () => {
//   it('should create a new product', async () => {
//     const newProduct: Omit<Product, 'id'> = {
//       name: 'New Product',
//       price: 100,
//       description: 'New product description',
//       status: ProductStatus.AVAILABLE,
//     };

//     const response = await request(app).post('/products').send(newProduct);

//     expect(response.status).toBe(201);
//     expect(response.body.name).toBe(newProduct.name);
//     expect(response.body.price).toBe(newProduct.price);
//     expect(response.body.status).toBe(newProduct.status);
//   });
// });


describe('GET /products', () => {
  it('should return a list of products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should handle an error', async () => {
    jest.spyOn(db, 'select').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app).get('/products');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
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

  it.todo('should handle non-404 errors');
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

  it.todo('should handle non-400 (non-validation) errors');
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

  it.todo('should handle other errors');
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
      description: 'Updated Product Description',
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

  it.todo("should handle a validation error if field isn't in schema at all");

  it.todo('should handle other errors');
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

  it.todo('should handle other errors');
});
