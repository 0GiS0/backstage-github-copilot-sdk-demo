# Operations - Local Run

## Start the Service

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.example` (create if missing) or main README section.

## Logs

Currently using `console.log`. Replace with a structured logger (e.g. pino) in the future.

## Tests

```bash
npm test
```

## Cleanup

- Stop Node processes.
- Clean dependencies: `rm -rf node_modules && npm install` (when needed).
