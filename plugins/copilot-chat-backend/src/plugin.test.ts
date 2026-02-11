import { startTestBackend } from '@backstage/backend-test-utils';
import { copilotChatPlugin } from './plugin';
import request from 'supertest';

// Plugin integration tests
describe('plugin', () => {
  it('should reject chat requests without GitHub token', async () => {
    const { server } = await startTestBackend({
      features: [copilotChatPlugin],
    });

    const response = await request(server)
      .post('/api/copilot-chat/chat')
      .send({ message: 'Hello' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Missing X-GitHub-Token header' });
  });

  it('should reject chat requests without message', async () => {
    const { server } = await startTestBackend({
      features: [copilotChatPlugin],
    });

    const response = await request(server)
      .post('/api/copilot-chat/chat')
      .set('X-GitHub-Token', 'fake-token')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'message is required' });
  });

  it('should reject models requests without GitHub token', async () => {
    const { server } = await startTestBackend({
      features: [copilotChatPlugin],
    });

    const response = await request(server).get('/api/copilot-chat/models');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Missing X-GitHub-Token header' });
  });
});
