import request from 'supertest';
import app from '../../app';
import knex from 'knex';
import knexConfig from '../../knexFile';
import dotenv from 'dotenv';
import { User, UserStatus } from '@onyxdevtutorials/interview-prep-shared';
import retry from "retry";

dotenv.config({ path: '../../../.env.test' });

const db = knex(knexConfig['test_users']);

const waitForDb = async (): Promise<void> => {
    const operation = retry.operation({
    retries: 10,
    factor: 2,
    minTimeout: 2000,
    maxTimeout: 10000,
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        await db.raw('SELECT 1');
        resolve();
      } catch (error) {
        if (operation.retry(error as Error)) {
          return;
        }
        reject(error);
      }
    });
  });
};

beforeAll(async () => {
  // await waitForDb();

  await db.migrate.latest();

  await db.seed.run();

  app.set('db', db);

  const users = await db('users').select('*');
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

describe('GET /users', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it.todo('should handle an error');
});

describe('GET /users/:id', () => {
  it('should return a single user', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  it('should return a 404 for a non-existent user', async () => {
    const response = await request(app).get('/users/999');
    expect(response.status).toBe(404);
  });

  it.todo('should handle non-404 errors');
});

describe('POST /users', () => {
  it('should create a new user', async () => {
    const newUser: Omit<User, 'id'> = {
      email: 'elvis.presley@graceland.com',
      first_name: 'Elvis',
      last_name: 'Presley',
      status: UserStatus.ACTIVE,
    };

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.first_name).toBe(newUser.first_name);
    expect(response.body.last_name).toBe(newUser.last_name);
    expect(response.body.status).toBe(newUser.status);
  });

  it('should return a 400 for a user with missing fields', async () => {
    const newUser: Omit<User, 'id' | 'status'> = {
      email: 'elvis.presley@graceland.com',
      first_name: 'Elvis',
      last_name: 'Presley',
    };

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(400);
  });

  it.todo('should handle other errors');
});

describe('PUT /users/:id', () => {
  it('should update an existing user', async () => {
    const updatedUser: Omit<User, 'id'> = {
      email: 'elvis.presley@graceland.com',
      first_name: 'Elvis',
      last_name: 'Presley',
      status: UserStatus.ACTIVE,
    };

    const response = await request(app).put('/users/1').send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(updatedUser.email);
    expect(response.body.first_name).toBe(updatedUser.first_name);
    expect(response.body.last_name).toBe(updatedUser.last_name);
    expect(response.body.status).toBe(updatedUser.status);
  });

  it('should return 400 for a user with missing fields', async () => {
    const updatedUser: Omit<User, 'id' | 'status'> = {
      email: 'elvis.presley@graceland.com',
      first_name: 'Elvis',
      last_name: 'Presley',
    };

    const response = await request(app).put('/users/1').send(updatedUser);

    expect(response.status).toBe(400);
  });

  it('should return a 404 for a non-existent user', async () => {
    const updatedUser: Omit<User, 'id'> = {
      email: 'elvis.presley@graceland.com',
      first_name: 'Elvis',
      last_name: 'Presley',
      status: UserStatus.ACTIVE,
    };

    const response = await request(app).put('/users/999').send(updatedUser);

    expect(response.status).toBe(404);
  });

  it.todo('should handle other errors');
});

describe('PATCH /users/:id', () => {
  it('should update an existing user', async () => {
    const updatedUser: Partial<User> = {
      email: 'elvis.presley@graceland.com',
    };

    const response = await request(app).patch('/users/1').send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(updatedUser.email);
  });

  it('should return 400 for a user with "missing" fields (should return 200)', async () => {
    const updatedUser: Partial<User> = {
      email: 'elvis.presley@graceland.com',
    };

    const response = await request(app).patch('/users/1').send(updatedUser);

    expect(response.status).toBe(200);
  });

  it('should return a 404 for a non-existent user', async () => {
    const updatedUser: Partial<User> = {
      email: 'elvis.presley@graceland.com',
    };

    const response = await request(app).patch('/users/999').send(updatedUser);

    expect(response.status).toBe(404);
  });

  it.todo('should handle other errors');
});

describe('DELETE /users/:id', () => {
  it('should delete an existing user', async () => {
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(204);
  });

  it('should return a 404 for a non-existent user', async () => {
    const response = await request(app).delete('/users/999');
    expect(response.status).toBe(404);
  });

  it.todo('should handle other errors');
});
