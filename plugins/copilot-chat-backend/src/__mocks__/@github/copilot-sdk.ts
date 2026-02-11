// Manual mock for @github/copilot-sdk (ESM-only, not compatible with Jest CJS)
export class CopilotClient {
  constructor(_opts: any) {}
  async start() {}
  async stop() {}
  async listModels() {
    return [];
  }
  async createSession(_opts: any) {
    return {
      on: jest.fn(),
      sendAndWait: jest.fn(),
    };
  }
  async resumeSession(_id: string, _opts: any) {
    return {
      on: jest.fn(),
      sendAndWait: jest.fn(),
    };
  }
}
