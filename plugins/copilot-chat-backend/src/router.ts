import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';

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

export async function createRouter({
  logger,
}: {
  logger: LoggerService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  // ── GET /models ──────────────────────────────────────────────
  router.get('/models', async (req, res) => {
    const githubToken = req.headers['x-github-token'] as string | undefined;
    if (!githubToken) {
      res.status(401).json({ error: 'Missing X-GitHub-Token header' });
      return;
    }

    try {
      const ClientClass = await getCopilotClient();
      const client = new ClientClass({ githubToken });
      await client.start();
      const models = await client.listModels();

      const available = models
        .filter((m: any) => m.policy?.state !== 'disabled')
        .map((m: any) => ({
          id: m.id,
          name: m.name,
          premiumRequests: m.billing?.multiplier ?? 1,
        }));

      await client.stop();
      logger.info(`Listed ${available.length} models`);
      res.json(available);
    } catch (err: any) {
      logger.error(`Failed to list models: ${err.message}`);
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

    logger.info(
      `Chat request — model: ${model}, session: ${
        incomingSessionId ? incomingSessionId.slice(0, 8) + '…' : '(new)'
      }`,
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
      const ClientClass = await getCopilotClient();
      client = new ClientClass({ githubToken });
      await client.start();

      // Create or resume session
      if (incomingSessionId) {
        sessionId = incomingSessionId;
        session = await client.resumeSession(sessionId, {
          model,
          streaming: true,
        });
        logger.info(`Resumed session ${sessionId.slice(0, 8)}…`);
      } else {
        sessionId = `backstage-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;
        session = await client.createSession({
          sessionId,
          model,
          streaming: true,
        });
        logger.info(`Created session ${sessionId.slice(0, 8)}…`);
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
      await session.sendAndWait({ prompt: message });

      completed = true;
      unsubscribeDelta();
      req.off('close', onClose);

      await session.destroy();
      await client.stop();

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      logger.info(`Response complete — ${chunkCount} chunks in ${elapsed}s`);

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (err: any) {
      logger.error(`Chat error: ${err.message}`);

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
