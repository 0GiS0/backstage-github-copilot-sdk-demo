# Electron Desktop App Template

Welcome to the Electron Desktop App template documentation!

This template provides a complete, production-ready setup for building cross-platform desktop applications using:

- 🖥️ **Electron** - Framework for building desktop apps
- ⚛️ **React** - Modern UI library
- 📘 **TypeScript** - Type-safe development
- ⚡ **Vite** - Lightning-fast build tool
- 🧪 **Testing** - Vitest + Playwright

## Quick Links

- [Getting Started](getting-started.md) - Set up your first Electron app
- [Architecture Guide](architecture.md) - Understand the project structure
- [Development](development.md) - Development workflows and best practices
- [Deployment](deployment.md) - Build and distribute your app

## Why Choose This Template?

✅ **Modern Stack** - Latest versions of all dependencies  
✅ **Type Safe** - Full TypeScript support  
✅ **Fast Development** - HMR with Vite  
✅ **Well Tested** - Unit and E2E testing setup  
✅ **Production Ready** - Packaging and CI/CD configured  
✅ **Multi-Platform** - Windows, macOS, Linux  
✅ **Developer Experience** - Dev containers and VS Code integration

## Getting Started

### Create a new project

Use Backstage to generate a new project from this template.

### Install dependencies

```bash
npm install
```

### Start development

```bash
npm run dev
```

The app will open with dev tools enabled. Try editing `src/App.tsx` and see the changes instantly!

### Build for production

```bash
npm run dist
```

Your distributable packages will be in the `out/` directory.

## What's Included

- **Production-ready Electron setup** with proper context isolation
- **React + TypeScript** boilerplate with modern patterns
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **ESLint + Prettier** for code quality
- **GitHub Actions** CI/CD workflows
- **Electron Builder** for multi-platform packaging
- **Dev Container** for consistent development environment

## Key Features

### IPC Bridge

Secure communication between main and renderer processes:

```typescript
// Main process
ipcMain.handle('get-app-version', () => app.getVersion())

// Renderer
const version = await window.electron.invoke('get-app-version')
```

### Hot Module Replacement

Edit React components and see changes instantly without reloading:

```bash
npm run dev
```

### Multi-Platform Distribution

Build installers for Windows, macOS, and Linux:

```bash
npm run dist
```

### Automated Testing

Unit tests:
```bash
npm run test
```

E2E tests:
```bash
npm run e2e
```

## Project Structure

```
src/
  ├── main.ts       # Electron main process
  ├── preload.ts    # IPC bridge
  ├── index.tsx     # React entry point
  ├── App.tsx       # Main component
  └── ...components
  
tests/
  ├── *.test.ts     # Unit tests
  └── e2e.spec.ts   # E2E tests

public/
  └── index.html    # HTML template

.github/workflows/
  ├── ci.yml        # Test & lint
  └── release.yml   # Build releases
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run dist` | Build distributable packages |
| `npm test` | Run unit tests |
| `npm run e2e` | Run E2E tests |
| `npm run lint` | Lint code |
| `npm run format` | Format code |

## Learn More

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For issues and questions:

1. Check the [Troubleshooting](troubleshooting.md) guide
2. Review Electron's official documentation
3. Check GitHub issues for similar problems

---

**Happy building! 🚀**
