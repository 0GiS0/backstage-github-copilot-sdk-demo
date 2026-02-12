import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { backstageExpertAgent } from './agents';
import { createBackstageTools } from './tools';

// @github/copilot-sdk is ESM-only; Backstage backend compiles to CJS,
// so we lazy-load with dynamic import() which works from CJS → ESM.
let _CopilotClient: any;
async function getCopilotClient(): Promise<any> {
  if (!_CopilotClient) {
    const sdk = await import('@github/copilot-sdk');
    _CopilotClient = sdk.CopilotClient;
  }
  return _CopilotClient;
}

const DEFAULT_MODEL = 'gpt-4.1';

const BACKSTAGE_MCP_SERVER = {
  type: 'http' as const,
  url: 'http://localhost:7007/api/mcp-actions/v1',
  headers: {
    Authorization: 'Bearer mcp-test-token-local-dev',
  },
  tools: ['*'],
};

const GITHUB_MCP_SERVER = {
  type: 'http' as const,
  url: 'https://api.githubcopilot.com/mcp/',
};

export async function createRouter({
  logger,
}: {
  logger: LoggerService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  // ── Pre-load custom Backstage tools (lazy-loads defineTool from ESM SDK) ──
  logger.info('[init] Creating custom Backstage catalog tools…');
  const backstageTools = await createBackstageTools(logger);
  logger.info(`[init] ${backstageTools.length} custom tools ready`);

  // ── GET /models ──────────────────────────────────────────────
  router.get('/models', async (req, res) => {
    const githubToken = req.headers['x-github-token'] as string | undefined;
    if (!githubToken) {
      res.status(401).json({ error: 'Missing X-GitHub-Token header' });
      return;
    }

    logger.info('[models] Fetching available models…');

    try {
      const ClientClass = await getCopilotClient();
      logger.info('[models] CopilotClient class loaded');
      const client = new ClientClass({ githubToken });
      logger.info('[models] Starting client…');
      await client.start();
      logger.info('[models] Client started, listing models…');
      const models = await client.listModels();
      logger.info(`[models] Raw models returned: ${models.length}`);

      const available = models
        .filter((m: any) => m.policy?.state !== 'disabled')
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          premiumRequests: m.billing?.multiplier ?? 1,
        }));

      await client.stop();
      logger.info(`[models] Listed ${available.length} available models`);
      res.json(available);
    } catch (err: any) {
      logger.error(`[models] Failed to list models: ${err.message}`);
      logger.error(`[models] Stack: ${err.stack}`);
      res.status(500).json({ error: 'Failed to list models' });
    }
  });

  // ── POST /chat ───────────────────────────────────────────────
  router.post('/chat', async (req, res) => {
    const githubToken = req.headers['x-github-token'] as string | undefined;
    if (!githubToken) {
      res.status(401).json({ error: 'Missing X-GitHub-Token header' });
      return;
    }

    const {
      message,
      sessionId: incomingSessionId,
      model: requestedModel,
    } = req.body;

    if (!message) {
      res.status(400).json({ error: 'message is required' });
      return;
    }

    const model = requestedModel || DEFAULT_MODEL;

    logger.info(`[chat] ── New chat request ──────────────────────`);
    logger.info(
      `[chat] Model: ${model}, Session: ${
        incomingSessionId
          ? `${incomingSessionId.slice(0, 8)}… (existing)`
          : '(new)'
      }`,
    );
    logger.info(
      `[chat] Message: "${
        message.length > 120 ? `${message.slice(0, 120)}…` : message
      }"`,
    );

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let client: any;
    let session: any;
    let sessionId: string;

    try {
      logger.info('[chat] Loading CopilotClient class…');
      const ClientClass = await getCopilotClient();
      logger.info('[chat] Creating CopilotClient instance…');
      client = new ClientClass({ githubToken });
      logger.info('[chat] Starting client…');
      await client.start();
      logger.info('[chat] Client started successfully');

      // Create or resume session
      if (incomingSessionId) {
        sessionId = incomingSessionId;
        logger.info(`[chat] Resuming session ${sessionId.slice(0, 8)}…`);
        session = await client.resumeSession(sessionId, {
          model,
          streaming: true,
          tools: backstageTools,
          mcpServers: {
            'backstage-mcp': BACKSTAGE_MCP_SERVER,
            github: GITHUB_MCP_SERVER,
          },
          customAgents: [backstageExpertAgent],
        });
        logger.info(`[chat] Session resumed: ${sessionId.slice(0, 8)}…`);
      } else {
        sessionId = `backstage-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;
        logger.info(
          `[chat] Creating new session ${sessionId.slice(
            0,
            8,
          )}… (model: ${model})…`,
        );
        session = await client.createSession({
          sessionId,
          model,
          streaming: true,
          tools: backstageTools,
          mcpServers: {
            'backstage-mcp': BACKSTAGE_MCP_SERVER,
            github: GITHUB_MCP_SERVER,
          },
          customAgents: [backstageExpertAgent],
        });
        logger.info(`[chat] Session created: ${sessionId.slice(0, 8)}…`);
      }

      // Send session ID to client
      res.write(`data: ${JSON.stringify({ type: 'session', sessionId })}\n\n`);

      // Stream the response
      let chunkCount = 0;
      const startTime = Date.now();
      let completed = false;

      const unsubscribeDelta = session.on(
        'assistant.message_delta',
        (event: any) => {
          if (completed) return;
          const delta = event.data?.deltaContent ?? '';
          chunkCount++;
          if (chunkCount <= 3 || chunkCount % 20 === 0) {
            logger.info(
              `[chat] Delta #${chunkCount}: "${
                delta.length > 80 ? `${delta.slice(0, 80)}…` : delta
              }"`,
            );
          }
          res.write(
            `data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`,
          );
        },
      );

      const onClose = () => {
        if (!completed) {
          logger.warn('Client disconnected');
          unsubscribeDelta();
          req.off('close', onClose);
          session?.destroy().catch(() => {});
          client?.stop().catch(() => {});
        }
      };
      req.on('close', onClose);

      // Send message and wait for full response
      logger.info('[chat] Sending message to Copilot…');
      await session.sendAndWait({ prompt: message });
      logger.info('[chat] sendAndWait completed');

      completed = true;
      unsubscribeDelta();
      req.off('close', onClose);

      logger.info('[chat] Destroying session…');
      await session.destroy();
      logger.info('[chat] Stopping client…');
      await client.stop();

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      logger.info(
        `[chat] ✔ Response complete — ${chunkCount} chunks in ${elapsed}s`,
      );

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (err: any) {
      logger.error(`[chat] ✖ Chat error: ${err.message}`);
      logger.error(`[chat] Stack: ${err.stack}`);

      if (session) {
        try {
          await session.destroy();
        } catch {
          // ignore cleanup errors
        }
      }
      if (client) {
        try {
          await client.stop();
        } catch {
          // ignore cleanup errors
        }
      }

      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          error: err.message,
          resetSession: true,
        })}\n\n`,
      );
      res.end();
    }
  });

  return router;
}
