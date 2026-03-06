// Manual mock for @github/copilot-sdk (ESM-only, not compatible with Jest CJS)
const createDefaultSession = () => ({
  on: jest.fn(() => jest.fn()),
  send: jest.fn(),
  sendAndWait: jest.fn(),
  disconnect: jest.fn(),
  destroy: jest.fn(),
});

let mockSessionFactory = () => createDefaultSession();
let lastCreateSessionOptions: any;
let lastResumeSessionOptions: any;

export function __setMockSessionFactory(factory: () => any) {
  mockSessionFactory = factory;
}

export function __resetMockSessionFactory() {
  mockSessionFactory = () => createDefaultSession();
  lastCreateSessionOptions = undefined;
  lastResumeSessionOptions = undefined;
}

export function __getLastCreateSessionOptions() {
  return lastCreateSessionOptions;
}

export function __getLastResumeSessionOptions() {
  return lastResumeSessionOptions;
}

export class CopilotClient {
  constructor(_opts: any) {}
  async start() {}
  async stop() {}
  async listModels() {
    return [];
  }
  async createSession(opts: any) {
    lastCreateSessionOptions = opts;
    return mockSessionFactory();
  }
  async resumeSession(_id: string, opts: any) {
    lastResumeSessionOptions = opts;
    return mockSessionFactory();
  }
}

export const approveAll = jest.fn(async () => ({
  outcome: 'approved',
}));

/**
 * Mock defineTool – returns a serialisable tool descriptor that the SDK
 * would normally build. Good enough for unit testing.
 */
export function defineTool(name: string, opts: any) {
  return { name, ...opts };
}
