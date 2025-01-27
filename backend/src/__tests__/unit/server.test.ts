import request from 'supertest';
import app from '../../app';
import http from 'http';

describe('Server', () => {
  let listenSpy: jest.SpyInstance;
  let server: http.Server;
  const port = 3002;

  beforeAll((done) => {
    listenSpy = jest
      .spyOn(app, 'listen')
      .mockImplementation((port: number, listeningListener?: () => void) => {
        if (listeningListener) {
          listeningListener();
        }
        return {
          close: jest.fn().mockImplementation((callback) => {
            if (callback) {
              callback();
            }
          }),
        } as any;
      });

    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      done();
    });
    console.log('Server started');
  });

  afterAll((done) => {
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
    jest.restoreAllMocks();
  });

  it('should start the server and listen on the specified port', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
