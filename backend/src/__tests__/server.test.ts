import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('should return "Hello, world!"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, world!');
  });
});

describe('Environment variables', () => {
  it('should have a DATABASE_URL', () => {
    expect(process.env['DATABASE_URL']).toBeDefined();
  });
});
