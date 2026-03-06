# CopilotSDKBackstageDemo — Challenge Submission Docs

## Short project summary (≤150 words)
This project demonstrates how the GitHub Copilot SDK can turn a Backstage developer portal into an AI-assisted, self-service platform experience. Inside Backstage, developers can chat with Copilot to discover catalog entities (systems, components, APIs), understand ownership and relationships, and get contextual help without leaving the portal. The solution pairs a Copilot Chat UI plugin with a backend plugin that hosts the agent, tools, and guardrails; the agent can retrieve Backstage context and (optionally) use GitHub MCP capabilities to help with day‑to‑day engineering workflows. The business value is faster onboarding, fewer interruptions to platform teams, and a consistent “single pane of glass” for internal software knowledge and creation.

## Problem → solution
### Problem
Engineering organizations often struggle with:
- Fragmented knowledge (wikis, tickets, repos, tribal knowledge)
- Slow onboarding and repeated questions to platform/DevEx teams
- High context-switching while navigating systems, docs, and templates

### Solution
Embed GitHub Copilot **inside Backstage** so developers can:
- Ask natural-language questions grounded in the Backstage catalog context
- Get guided help on entities (ownership, dependencies, purpose)
- Discover and launch software templates more easily

## Working code locations (monorepo note)
This is a Backstage monorepo; the equivalent of top-level `/app` or `/src` is under:
- Frontend app: `packages/app/src`
- Backend app: `packages/backend/src`
- Copilot Chat frontend plugin: `plugins/copilot-chat/src`
- Copilot Chat backend plugin (agents/tools): `plugins/copilot-chat-backend/src`

## Setup instructions
### Prerequisites
- Node.js 20 or 22
- Yarn (via corepack)
- GitHub CLI (`gh`) authenticated
- GitHub Copilot access

### Install
```bash
corepack enable
# Optional: ensure the exact Yarn version declared in package.json
corepack prepare yarn@4.4.1 --activate

yarn install
```

### Configure environment
```bash
# Required for GitHub API access (recommended: derive from gh)
export GITHUB_TOKEN=$(gh auth token)

# Required for Backstage internal MCP Actions endpoint (dev)
export BACKSTAGE_MCP_ACTIONS_TOKEN=your_local_token

# Required: GitHub OAuth (Backstage sign-in)
export GITHUB_APP_CLIENT_ID=your_client_id
export GITHUB_APP_CLIENT_SECRET=your_client_secret
```

### Run locally
```bash
export GITHUB_TOKEN=$(gh auth token) && yarn start
```
- Frontend: http://localhost:3000
- Backend: http://localhost:7007

## Deployment notes
This repo uses Backstage standard workflows:
- Production build (all packages): `yarn build:all`
- Backend container build: `yarn build-image` (workspace backend)

For enterprise evaluation, the typical path is:
1. Build the backend artifact/container
2. Configure runtime env vars/secrets
3. Deploy behind your usual ingress / identity provider

## Architecture diagram (Excalidraw)
Source-of-truth diagram file:
- `docs/architecture.excalidraw`

How to view it:
1. Open https://excalidraw.com
2. **Import** `docs/architecture.excalidraw`

High-level flow (left → right):
- **User → Backstage Portal (Copilot Chat)**
- **Backstage Portal → GitHub Copilot** via a **Copilot SDK implementation** hosted in the `copilot-chat-backend` plugin:
  - Custom agent (Backstage expert)
  - MCP server: **GitHub**
  - MCP server: **Backstage internal** (`/api/mcp-actions/v1`)
  - Custom tools for catalog-aware assistance

Auth note:
- Backstage **GitHub OAuth** sign-in is reused to authenticate Copilot SDK sessions, enabling a seamless sign-in experience.

## Responsible AI (RAI) notes
- **Data minimization:** only send what’s needed for the user’s question; prefer IDs/metadata vs full docs.
- **Tool safety:** restrict tool calls to explicit user intent; never execute arbitrary code from model output.
- **Prompt injection resistance:** treat external content (issues/PRs/docs) as untrusted; don’t follow instructions embedded in data.
- **Secrets handling:** no secrets in repo; use env vars and prefer short-lived tokens.
- **Transparency:** responses should cite what they used (catalog entity, repo, etc.) when possible.

## Demo deck
- `presentations/CopilotSDKBackstageDemo.pptx`
