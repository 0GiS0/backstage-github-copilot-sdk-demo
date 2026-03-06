# Backstage + GitHub Copilot SDK Demo

<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Follow-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Follow-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>

---

This repository demonstrates how to embed the **GitHub Copilot SDK** into a **Backstage** developer portal to deliver a catalog-aware, self-service assistant inside the portal.

## Short project summary (≤150 words)
This project demonstrates how the GitHub Copilot SDK can turn a Backstage developer portal into an AI-assisted, self-service platform experience. Inside Backstage, developers can chat with Copilot to discover catalog entities such as systems, components, and APIs, understand ownership and relationships, and ask contextual questions without leaving the portal. The assistant can also use page context from Backstage to explain a specific entity in place, answer follow-up questions about it, and guide users through the catalog. Beyond answering questions, Copilot acts as a self-service assistant that can create new projects directly from the software templates made available to developers, all through chat and without requiring them to fill out the standard scaffolder form. The solution combines a Copilot Chat UI plugin with a backend plugin that hosts the agent, tools, and guardrails.

## What you get
- **Copilot Chat inside Backstage** (UI plugin + backend plugin)
- **Backstage context grounding** (catalog entities, ownership, relationships)
- **MCP-powered actions** (via GitHub MCP server) with explicit tool boundaries
- **Scaffolder templates** included under [`/examples`](./examples)
- **GitHub OAuth sign-in** (reused to authenticate Copilot SDK sessions for a smooth UX)

## Prerequisites
- Node.js **20 or 22** (see `.node-version`)
- Yarn via Corepack (project uses Yarn `4.4.1`)
- GitHub CLI (`gh`) authenticated
- GitHub Copilot access
- (Optional) Docker, if you plan to generate TechDocs locally

## Quickstart (local dev)
```bash
git clone https://github.com/0GiS0/backstage-github-copilot-sdk-demo.git
cd backstage-github-copilot-sdk-demo

corepack enable
corepack prepare yarn@4.4.1 --activate

yarn install

# GitHub token used by Backstage integrations + GitHub MCP tools
export GITHUB_TOKEN=$(gh auth token)

# Backstage internal MCP Actions auth (dev)
# Used to call: http://localhost:7007/api/mcp-actions/v1
export BACKSTAGE_MCP_ACTIONS_TOKEN=your_local_token

# GitHub OAuth for Backstage sign-in (required)
export GITHUB_APP_CLIENT_ID=your_client_id
export GITHUB_APP_CLIENT_SECRET=your_client_secret

yarn start
```
- Frontend: http://localhost:3000
- Backend: http://localhost:7007

## Configuration
### 1) GitHub token (`GITHUB_TOKEN`)
This token is used by `integrations.github` (and any GitHub MCP-backed actions). The easiest setup is:
```bash
export GITHUB_TOKEN=$(gh auth token)
```

### 2) Backstage internal MCP Actions token (`BACKSTAGE_MCP_ACTIONS_TOKEN`)
This token protects the local MCP Actions endpoint used by the backend:
- `http://localhost:7007/api/mcp-actions/v1`

Provide it via env var and ensure it matches `backend.auth.externalAccess` in `app-config.local.yaml`:
```bash
export BACKSTAGE_MCP_ACTIONS_TOKEN=your_local_token
```

### 3) GitHub OAuth (Backstage sign-in)
Backstage auth provider is configured in [`app-config.yaml`](./app-config.yaml) under `auth.providers.github`. Provide the client ID/secret via env vars:
```bash
export GITHUB_APP_CLIENT_ID=your_client_id
export GITHUB_APP_CLIENT_SECRET=your_client_secret
```

> Note: `app-config.local.yaml` is intentionally tracked but **must not contain real secrets**. It references env vars only.

## How to use the demo
- Copilot Chat page: http://localhost:3000/copilot-chat
- Scaffolder (templates): http://localhost:3000/create

## Project structure (monorepo)
This is a Backstage monorepo, so the equivalent of top-level `/app` or `/src` lives under:
- Frontend app: `packages/app/src`
- Backend app: `packages/backend/src`
- Copilot Chat frontend plugin: `plugins/copilot-chat/src`
- Copilot Chat backend plugin (agents/tools): `plugins/copilot-chat-backend/src`

## Software templates
This demo includes templates stored locally under [`/examples`](./examples) and loaded via `catalog.locations` in [`app-config.yaml`](./app-config.yaml).

## Responsible AI notes (high level)
- Minimize data sent to the model; prefer IDs/metadata over full documents.
- Treat external content as untrusted; resist prompt injection.
- Never commit secrets; use env vars and least privilege.

For the full write-up, see [`/docs/README.md`](./docs/README.md).

## Scripts
- `yarn start` — run frontend + backend (dev)
- `yarn lint:all` — lint
- `yarn test` — tests
- `yarn build:all` — build

## Follow
<div align="center">

[![YouTube Channel Subscribers](https://img.shields.io/youtube/channel/subscribers/UC140iBrEZbOtvxWsJ-Tb0lQ?style=for-the-badge&logo=youtube&logoColor=white&color=red)](https://www.youtube.com/c/GiselaTorres?sub_confirmation=1)
[![GitHub followers](https://img.shields.io/github/followers/0GiS0?style=for-the-badge&logo=github&logoColor=white)](https://github.com/0GiS0)
[![LinkedIn Follow](https://img.shields.io/badge/LinkedIn-Follow-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/giselatorresbuitrago/)
[![X Follow](https://img.shields.io/badge/X-Follow-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/0GiS0)

</div>
