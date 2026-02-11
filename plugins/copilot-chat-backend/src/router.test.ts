import { mockErrorHandler, mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
describe('createRouter', () => {
  let app: express.Express;

  beforeEach(async () => {
    const router = await createRouter({
      logger: mockServices.logger.mock(),
    });
    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  it('should reject chat without GitHub token', async () => {
    const response = await request(app).post('/chat').send({
      message: 'Hello',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Missing X-GitHub-Token header' });
  });

  it('should reject chat without message', async () => {
    const response = await request(app)
      .post('/chat')
      .set('X-GitHub-Token', 'fake-token')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'message is required' });
  });

  it('should reject models without GitHub token', async () => {
    const response = await request(app).get('/models');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Missing X-GitHub-Token header' });
  });
});
