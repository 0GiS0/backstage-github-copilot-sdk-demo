# Electron Desktop App Template

Create modern cross-platform desktop applications with Electron, React, and TypeScript.

## What does this template include?

- **Electron Framework** - Build desktop apps with JavaScript, HTML, and CSS
- **React** - Modern UI library for building interactive interfaces
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast frontend build tool with HMR
- **TailwindCSS** - Utility-first CSS framework (optional)
- **Testing Stack**:
  - Vitest for unit testing
  - Playwright for E2E testing
- **Code Quality**:
  - ESLint for code linting
  - Prettier for code formatting
  - TypeScript for type safety
- **Development Environment**:
  - Dev Container configuration
  - GitHub Actions CI/CD workflows
  - Electron Builder for packaging

## Technologies & Versions

- **Electron** 27.x (latest stable)
- **React** 18.x
- **TypeScript** 5.x
- **Node.js** 18.x minimum
- **Vite** 5.x

## Project Structure

```
electron-app/
├── src/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Preload script for IPC
│   ├── index.tsx        # React entry point
│   ├── App.tsx          # Root React component
│   ├── App.css
│   └── index.css
├── public/
│   └── index.html       # Main HTML file
├── tests/
│   ├── example.test.ts  # Unit tests
│   └── e2e.spec.ts      # E2E tests with Playwright
├── .devcontainer/       # VS Code devcontainer config
├── .github/workflows/   # GitHub Actions workflows
│   ├── ci.yml          # Lint, test, build on push/PR
│   └── release.yml     # Build releases on tags
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .eslintrc.cjs
```

## Features

### Multi-Platform Support

Build for Windows, macOS, and Linux with a single codebase.

### Hot Module Replacement (HMR)

Instant feedback during development - change React components and see updates without reloading.

### IPC Communication

Built-in Electron IPC bridge for secure communication between main and renderer processes.

### Type Safety

Full TypeScript support with proper types for Electron, React, and Node.js APIs.

### Development Container

Consistent development environment with pre-configured VS Code extensions and tools.

### CI/CD Ready

GitHub Actions workflows for continuous integration, testing, and automated releases.

## Getting Started

### Quick Start

1. Create the application using Backstage
2. Clone the generated repository
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development:
   ```bash
   npm run dev
   ```

5. The app will open in a window with dev tools enabled

### Building

For production build:

```bash
npm run build  # Build both Vite app and Electron
npm run dist   # Package the application
```

Output will be in the `out/` directory for different platforms.

## Available Scripts

```bash
# Development
npm run dev              # Start dev server and Electron
npm run vite            # Start Vite dev server only
npm run electron        # Start Electron (requires running Vite separately)

# Building
npm run build           # Full build (Vite + Electron)
npm run build:vite      # Build React app with Vite
npm run build:electron  # Build Electron app
npm run package         # Package with Electron Builder

# Testing
npm test                # Run unit tests with Vitest
npm run test:ui         # Run tests in UI mode
npm run test:coverage   # Generate coverage report
npm run e2e             # Run E2E tests with Playwright

# Code Quality
npm run lint            # Check code with ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes
npm run type-check      # Check TypeScript types
```

## Customization Guide

### Changing App Name

Update in `package.json`:
```json
{
  "name": "my-app",
  "productName": "My Amazing App"
}
```

### Adding Electron Features

Main process can access full Node.js APIs:
```typescript
// src/main.ts
import fs from 'fs'
import path from 'path'

// Use Node.js modules directly
const configPath = path.join(app.getPath('userData'), 'config.json')
```

### IPC Communication Example

Main process:
```typescript
// src/main.ts
ipcMain.handle('read-file', async (event, filepath) => {
  return fs.readFileSync(filepath, 'utf-8')
})
```

Renderer process:
```typescript
// src/App.tsx
const content = await window.electron.invoke('read-file', '/path/to/file')
```

### Adding Native Modules

```bash
npm install native-module --build-from-source
```

Rebuild for Electron:
```bash
npm run build:electron
```

## Packaging & Distribution

The template uses Electron Builder with configurations for:

- **Windows**: NSIS installer and portable executable
- **macOS**: DMG and ZIP distributions
- **Linux**: AppImage and DEB packages

Customize in `package.json` `build` section.

## Troubleshooting

### App won't start in development

1. Ensure Vite dev server is running on port 5173
2. Check port isn't already in use: `lsof -i :5173`
3. Clear cache: `rm -rf node_modules dist dist-vite && npm install`

### Build errors

1. Clear TypeScript cache: `tsc --noEmit`
2. Rebuild native modules: `npm run build:electron`
3. Check Node.js version: should be 18.x or higher

### Packaging issues

1. Ensure all dependencies are in `dependencies`, not `devDependencies`
2. For native modules, rebuild before packaging
3. Check `public/` directory exists and has icon assets

## Best Practices

1. **Keep main process lightweight** - Move heavy operations to worker threads
2. **Use context isolation** - Always enable in BrowserWindow webPreferences
3. **Minimize IPC overhead** - Batch operations when possible
4. **Code signing** - Essential for distribution to App Store
5. **Auto-updates** - Consider electron-updater for automatic updates

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev)
- [Playwright Testing](https://playwright.dev)

## Next Steps

1. Customize the app name and icon
2. Add your React components and styling
3. Implement main process logic
4. Add IPC handlers for platform features
5. Configure code signing for distribution
6. Set up auto-updates with electron-updater
