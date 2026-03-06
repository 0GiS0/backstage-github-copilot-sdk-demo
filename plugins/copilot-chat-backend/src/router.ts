import { LoggerService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { backstageExpertAgent } from './agents';
import { createBackstageTools } from './tools';

// @github/copilot-sdk is ESM-only; Backstage backend compiles to CJS,
// so we lazy-load with dynamic import() which works from CJS → ESM.
let _copilotSdk: any;
async function getCopilotSdk(): Promise<any> {
  if (!_copilotSdk) {
    try {
      // Jest can resolve the manual mock via require(), while the real runtime
      // falls back to dynamic import for the ESM-only SDK package.
      _copilotSdk = require('@github/copilot-sdk');
    } catch {
      _copilotSdk = await import('@github/copilot-sdk');
    }
  }
  return _copilotSdk;
}

const DEFAULT_MODEL = 'claude-opus-4.5';

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

function extractToolName(eventData: any): string {
  return (
    eventData?.mcpToolName ||
    eventData?.toolName ||
    eventData?.name ||
    eventData?.tool?.name ||
    eventData?.tool
  );
}

function extractToolExecutionId(eventData: any): string | undefined {
  return (
    eventData?.invocationId ||
    eventData?.toolCallId ||
    eventData?.callId ||
    eventData?.executionId ||
    eventData?.id
  );
}

function writeProgress(
  res: express.Response,
  payload: Record<string, unknown>,
) {
  writeSse(res, { type: 'progress', ...payload });
}

function writeSse(res: express.Response, payload: Record<string, unknown>) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
  if (typeof (res as any).flush === 'function') {
    (res as any).flush();
  }
}

async function disconnectSession(session: any) {
  if (typeof session?.disconnect === 'function') {
    await session.disconnect();
    return;
  }

  if (typeof session?.destroy === 'function') {
    await session.destroy();
  }
}

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

    logger.info('[models] Fetching available models…');

    try {
      const { CopilotClient: ClientClass } = await getCopilotSdk();
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
      currentUrl,
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
    if (currentUrl) {
      logger.info(`[chat] Current URL: ${currentUrl}`);
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    let client: any;
    let session: any;
    let sessionId: string;

    try {
      logger.info('[chat] Creating custom Backstage catalog tools…');
      const backstageTools = await createBackstageTools(logger, {
        githubToken,
      });
      logger.info(`[chat] ${backstageTools.length} custom tools ready`);

      logger.info('[chat] Loading CopilotClient class…');
      const { CopilotClient: ClientClass, approveAll: onPermissionRequest } =
        await getCopilotSdk();
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
          onPermissionRequest,
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
          onPermissionRequest,
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
      writeSse(res, { type: 'session', sessionId });

      // Stream the response
      let chunkCount = 0;
      const startTime = Date.now();
      let completed = false;
      const activeToolExecutions = new Map<string, string>();
      let unsubscribeDelta = () => {};
      let unsubscribeMessage = () => {};
      let unsubscribeToolStart = () => {};
      let unsubscribeToolComplete = () => {};
      let unsubscribeAgentStart = () => {};
      let unsubscribeAgentComplete = () => {};
      let unsubscribeIdle = () => {};
      let onClose = () => {};

      const finishResponse = async () => {
        if (completed) {
          return;
        }

        completed = true;
        unsubscribeDelta();
        unsubscribeMessage();
        unsubscribeToolStart();
        unsubscribeToolComplete();
        unsubscribeAgentStart();
        unsubscribeAgentComplete();
        unsubscribeIdle();
        req.off('close', onClose);

        logger.info('[chat] Disconnecting session…');
        await disconnectSession(session);
        logger.info('[chat] Stopping client…');
        await client.stop();

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        logger.info(
          `[chat] ✔ Response complete — ${chunkCount} chunks in ${elapsed}s`,
        );

        writeSse(res, { type: 'done' });
        res.end();
      };

      unsubscribeDelta = session.on('assistant.message_delta', (event: any) => {
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
        writeSse(res, { type: 'delta', content: delta });
      });

      unsubscribeMessage = session.on('assistant.message', (event: any) => {
        if (completed) return;
        const content = event.data?.content ?? '';
        if (content) {
          logger.info(
            `[chat] Final assistant message received (${content.length} chars)`,
          );
        }
      });

      unsubscribeToolStart = session.on(
        'tool.execution_start',
        (event: any) => {
          if (completed) return;
          const toolName = extractToolName(event.data);
          const executionId = extractToolExecutionId(event.data);

          if (executionId && toolName) {
            activeToolExecutions.set(executionId, toolName);
          }

          if (!toolName) {
            logger.info('[chat] Tool started without a resolvable name');
            return;
          }

          logger.info(`[chat] Tool started: ${toolName}`);
          writeProgress(res, { action: 'tool_start', tool: toolName });
        },
      );

      unsubscribeToolComplete = session.on(
        'tool.execution_complete',
        (event: any) => {
          if (completed) return;
          const executionId = extractToolExecutionId(event.data);
          const toolName =
            extractToolName(event.data) ||
            (executionId ? activeToolExecutions.get(executionId) : undefined);
          const success = event.data?.success ?? true;

          if (executionId) {
            activeToolExecutions.delete(executionId);
          }

          if (!toolName) {
            logger.info(
              '[chat] Tool completed without a resolvable name; skipping progress event',
            );
            return;
          }

          logger.info(
            `[chat] Tool completed: ${toolName} (${success ? 'ok' : 'error'})`,
          );
          writeProgress(res, {
            action: 'tool_end',
            tool: toolName,
            success,
          });
        },
      );

      unsubscribeAgentStart = session.on('subagent.started', (event: any) => {
        if (completed) return;
        const agentName =
          event.data?.agentDisplayName || event.data?.agentName || 'agent';
        logger.info(`[chat] Subagent started: ${agentName}`);
        writeProgress(res, { action: 'agent_start', agent: agentName });
      });

      unsubscribeAgentComplete = session.on(
        'subagent.completed',
        (event: any) => {
          if (completed) return;
          const agentName =
            event.data?.agentDisplayName || event.data?.agentName || 'agent';
          logger.info(`[chat] Subagent completed: ${agentName}`);
          writeProgress(res, { action: 'agent_end', agent: agentName });
        },
      );

      unsubscribeIdle = session.on('session.idle', async () => {
        if (completed) {
          return;
        }

        logger.info('[chat] Session is idle; completing response');
        await finishResponse();
      });

      onClose = () => {
        if (!completed) {
          logger.warn('Client disconnected');
          unsubscribeDelta();
          unsubscribeMessage();
          unsubscribeToolStart();
          unsubscribeToolComplete();
          unsubscribeAgentStart();
          unsubscribeAgentComplete();
          unsubscribeIdle();
          req.off('close', onClose);
          disconnectSession(session).catch(() => {});
          client?.stop().catch(() => {});
        }
      };
      req.on('close', onClose);

      // Send message and wait for full response
      // Enrich prompt with current page context when available
      let prompt = message;
      if (currentUrl) {
        prompt = `[Context: The user is currently viewing this page in Backstage: ${currentUrl}]\n\n${message}`;
      }
      logger.info('[chat] Sending message to Copilot…');
      await session.send({ prompt });
      logger.info('[chat] Message sent; awaiting session idle');
    } catch (err: any) {
      logger.error(`[chat] ✖ Chat error: ${err.message}`);
      logger.error(`[chat] Stack: ${err.stack}`);

      if (session) {
        try {
          await disconnectSession(session);
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

      writeSse(res, {
        type: 'error',
        error: err.message,
        resetSession: true,
      });
      res.end();
    }
  });

  return router;
}
