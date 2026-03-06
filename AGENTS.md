# AGENTS.md

Custom instructions for working in this repository (Backstage + GitHub Copilot SDK demo).

## Quick commands
- Install: `yarn install`
- Run (dev): `export GITHUB_TOKEN=$(gh auth token) && yarn start`
- Tests: `yarn test`
- Lint: `yarn lint:all`
- Build: `yarn build:all`

## Where the “working code” lives
This is a Backstage monorepo, so the equivalent of top-level `/app` or `/src` is under these paths:
- Frontend app: `packages/app/src`
- Backend app: `packages/backend/src`
- Copilot Chat frontend plugin: `plugins/copilot-chat/src`
- Copilot Chat backend plugin (agents/tools): `plugins/copilot-chat-backend/src`

## Copilot Chat implementation map
- Frontend UI entry points:
  - `plugins/copilot-chat/src/plugin.ts`
  - `plugins/copilot-chat/src/routes.ts`
  - `plugins/copilot-chat/src/components/CopilotChatPage/*`
- Backend plugin entry points:
  - `plugins/copilot-chat-backend/src/plugin.ts`
  - `plugins/copilot-chat-backend/src/router.ts`
- Agents:
  - `plugins/copilot-chat-backend/src/agents/*`
- Tools exposed to agents:
  - `plugins/copilot-chat-backend/src/tools/*`

## Security / Responsible AI notes (must follow)
- Never commit secrets (tokens, client secrets, cookies). Use env vars.
- Treat ALL user input as untrusted; avoid prompt injection by:
  - scoping tools to explicit user intent
  - not executing arbitrary code suggested by chat output
  - validating file paths and repo scope before read/write
- Use least privilege: prefer GitHub CLI auth (`gh auth token`) instead of long-lived PATs.

## When making changes
- Prefer surgical edits; don’t restructure the monorepo.
- Keep docs in `/docs` and deck in `/presentations` per challenge requirements.
