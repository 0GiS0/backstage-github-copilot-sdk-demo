# Quick Start

This guide helps you run the `BACKSTAGE_ENTITY_NAME` service quickly.

## Prerequisites

- Node.js >= 18
- npm

## Steps

```bash
npm install
npm run dev
```

The service will start (by default) at `http://localhost:3000`.

## Verification

- `GET /health` should return 200.
- Run tests: `npm test`.

## Next Steps

- Review the Architecture section.
- Add required environment variables.
- Publish the documentation: `mkdocs build`.
