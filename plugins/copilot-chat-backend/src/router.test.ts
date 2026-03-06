import { mockErrorHandler, mockServices } from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

jest.mock('@github/copilot-sdk');

const {
  __getLastCreateSessionOptions,
  __resetMockSessionFactory,
  __setMockSessionFactory,
  approveAll,
} = require('@github/copilot-sdk');

jest.mock('./tools', () => ({
  createBackstageTools: jest.fn(async () => []),
}));

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

  afterEach(() => {
    __resetMockSessionFactory();
    jest.clearAllMocks();
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

  it('should complete chat when the session becomes idle', async () => {
    const handlers = new Map<string, (event: any) => void>();
    const session = {
      on: jest.fn((eventType: string, handler: (event: any) => void) => {
        handlers.set(eventType, handler);
        return jest.fn(() => handlers.delete(eventType));
      }),
      send: jest.fn(async () => {
        handlers.get('assistant.message_delta')?.({
          data: { deltaContent: 'Hello' },
        });
        handlers.get('assistant.message')?.({
          data: { content: 'Hello from Copilot' },
        });
        handlers.get('assistant.turn_end')?.({
          data: { turnId: 'turn-1' },
        });
        handlers.get('session.idle')?.({
          data: {},
        });
      }),
      disconnect: jest.fn(),
      destroy: jest.fn(),
    };

    __setMockSessionFactory(() => session);

    const response = await request(app)
      .post('/chat')
      .set('X-GitHub-Token', 'fake-token')
      .send({ message: 'Hello' });

    expect(response.status).toBe(200);
    expect(response.text).toContain('"type":"session"');
    expect(response.text).toContain('"type":"delta","content":"Hello"');
    expect(response.text).toContain('"type":"done"');
    expect(session.send).toHaveBeenCalledTimes(1);
    expect(session.disconnect).toHaveBeenCalledTimes(1);
    expect(session.destroy).not.toHaveBeenCalled();
  });

  it('should stream progress events for tool execution', async () => {
    const handlers = new Map<string, (event: any) => void>();
    const session = {
      on: jest.fn((eventType: string, handler: (event: any) => void) => {
        handlers.set(eventType, handler);
        return jest.fn(() => handlers.delete(eventType));
      }),
      send: jest.fn(async () => {
        handlers.get('tool.execution_start')?.({
          data: { toolName: 'backstage_create_scaffolder_task' },
        });
        handlers.get('tool.execution_complete')?.({
          data: { toolName: 'backstage_create_scaffolder_task', success: true },
        });
        handlers.get('assistant.message')?.({
          data: { content: 'Task launched' },
        });
        handlers.get('session.idle')?.({ data: {} });
      }),
      disconnect: jest.fn(),
      destroy: jest.fn(),
    };

    __setMockSessionFactory(() => session);

    const response = await request(app)
      .post('/chat')
      .set('X-GitHub-Token', 'fake-token')
      .send({ message: 'Create an app' });

    expect(response.status).toBe(200);
    expect(response.text).toContain(
      '"type":"progress","action":"tool_start","tool":"backstage_create_scaffolder_task"',
    );
    expect(response.text).toContain(
      '"label":"backstage_create_scaffolder_task"',
    );
    expect(response.text).toContain('"status":"running"');
    expect(response.text).toContain(
      '"type":"progress","action":"tool_end","tool":"backstage_create_scaffolder_task","success":true',
    );
  });

  it('should not emit unknown tool names when completion only includes an execution id', async () => {
    const handlers = new Map<string, (event: any) => void>();
    const session = {
      on: jest.fn((eventType: string, handler: (event: any) => void) => {
        handlers.set(eventType, handler);
        return jest.fn(() => handlers.delete(eventType));
      }),
      send: jest.fn(async () => {
        handlers.get('tool.execution_start')?.({
          data: {
            toolName: 'github_check_repo_availability',
            invocationId: 'tool-1',
          },
        });
        handlers.get('tool.execution_complete')?.({
          data: { invocationId: 'tool-1', success: true },
        });
        handlers.get('session.idle')?.({ data: {} });
      }),
      disconnect: jest.fn(),
      destroy: jest.fn(),
    };

    __setMockSessionFactory(() => session);

    const response = await request(app)
      .post('/chat')
      .set('X-GitHub-Token', 'fake-token')
      .send({ message: 'Create an app' });

    expect(response.status).toBe(200);
    expect(response.text).toContain(
      '"type":"progress","action":"tool_end","tool":"github_check_repo_availability","success":true',
    );
    expect(response.text).not.toContain('"tool":"unknown"');
  });

  it('should pass approveAll as the session permission handler', async () => {
    __setMockSessionFactory(() => ({
      on: jest.fn((eventType: string, handler: (event: any) => void) => {
        if (eventType === 'assistant.message') {
          handler({ data: { content: 'Hello from Copilot' } });
        }
        if (eventType === 'session.idle') {
          setTimeout(() => handler({ data: {} }), 0);
        }
        return jest.fn();
      }),
      send: jest.fn(async () => {}),
      disconnect: jest.fn(),
      destroy: jest.fn(),
    }));

    const response = await request(app)
      .post('/chat')
      .set('X-GitHub-Token', 'fake-token')
      .send({ message: 'Hello' });

    expect(response.status).toBe(200);
    expect(__getLastCreateSessionOptions()).toEqual(
      expect.objectContaining({
        onPermissionRequest: approveAll,
      }),
    );
  });
});
