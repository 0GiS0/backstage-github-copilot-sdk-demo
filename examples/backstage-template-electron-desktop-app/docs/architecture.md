# Architecture

## Overview

The Electron Desktop App template is built on a modern architecture that combines:

- **Electron** - Cross-platform desktop framework
- **React** - UI framework for the renderer process
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool for the frontend
- **Node.js** - Backend capabilities in the main process

## Process Architecture

### Main Process (Node.js)

The main process runs on Node.js and has full access to:
- File system
- Native OS APIs
- IPC communication
- Electron APIs

```typescript
// src/main.ts
import { app, BrowserWindow, ipcMain } from 'electron'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })
  // Load from Vite dev server or built files
  mainWindow.loadURL(devUrl || productionUrl)
}
```

### Renderer Process (React + Vite)

The renderer process is a web application built with:
- React for UI components
- TypeScript for type safety
- CSS for styling
- Vite for bundling and HMR

```typescript
// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### IPC Bridge (Secure Communication)

The preload script creates a secure bridge between main and renderer:

```typescript
// src/preload.ts
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  off: (channel, listener) => ipcRenderer.off(channel, listener),
})
```

## Build System

### Development Build

```
┌──────────────────┐
│  React Code      │  (src/App.tsx, src/index.tsx)
│  TypeScript      │
└──────────┬───────┘
           │
           ▼
    ┌─────────────┐
    │ Vite (HMR)  │  ← Hot Module Replacement on port 5173
    └─────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Electron Window  │
    └──────────────────┘
```

Development flow:
1. Vite starts dev server on port 5173
2. Electron loads from http://localhost:5173
3. Edit React component → Vite HMR → Instant update
4. Edit main.ts → Manual reload needed

### Production Build

```
┌──────────────────┐
│  React Code      │
│  TypeScript      │
└──────────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Vite Build   │  → dist-vite/ (optimized bundle)
    └──────────────┘
           │
           ▼
┌──────────────────────┐
│  Electron Code       │  (src/main.ts, src/preload.ts)
└──────────┬───────────┘
           │
           ▼
    ┌──────────────┐
    │ esbuild      │  → dist/ (bundled main/preload)
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │ Electron App │  (file:// protocol to dist-vite/)
    └──────────────┘
```

Production build steps:
1. Vite builds React app to `dist-vite/`
2. esbuild bundles main and preload to `dist/`
3. Electron Builder packages for distribution

## Directory Structure

```
src/
├── main.ts              # Electron main process
│                        # - Window management
│                        # - IPC handlers
│                        # - App lifecycle
│
├── preload.ts           # IPC bridge
│                        # - Expose safe APIs
│                        # - Security layer
│
├── index.tsx            # React entry point
│                        # - Mounts App component
│                        # - Sets up providers
│
├── App.tsx              # Root component
│                        # - Main UI
│                        # - State management
│
├── components/          # Reusable components
│
├── hooks/               # Custom React hooks
│
├── utils/               # Utility functions
│
├── App.css              # Global styles
│
└── index.css            # Vite entry styles

public/
└── index.html           # HTML template
                         # - Vite injects React app here
                         # - Preload script loaded here

tests/
├── *.test.ts            # Unit tests (Vitest)
└── e2e.spec.ts          # E2E tests (Playwright)

.devcontainer/
└── devcontainer.json    # Dev container config

.github/workflows/
├── ci.yml               # Lint, test, build
└── release.yml          # Build on tag push
```

## Data Flow

### User Interaction Flow

```
┌──────────────────┐
│  User clicks UI  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│  React Event Handler │
└────────┬─────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Need native functionality?         │
│  YES → Call window.electron.invoke  │
│  NO  → Update local state           │
└────────┬────────────────────────────┘
         │
         ▼ (if IPC)
┌──────────────────────────────────────┐
│  ipcRenderer.invoke('channel', ...)  │ (Renderer)
│  ipcMain.handle('channel', ...)      │ (Main)
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Execute in Main Process │  ← Access filesystem, OS APIs
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Return result           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Update React state      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Re-render component     │
└──────────────────────────┘
```

## Security Model

### Context Isolation

- Main process runs with full Node.js capabilities
- Renderer (web) isolated in separate context
- Communication only through IPC bridge

### Preload Script

Acts as a security layer:
```typescript
// SAFE - Exposed to renderer
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, ...args) => {
    // Only allow specific channels
    const ALLOWED_CHANNELS = ['get-app-version', 'read-file']
    if (ALLOWED_CHANNELS.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
  }
})

// NOT EXPOSED - Can't be accessed from renderer
const fs = require('fs')  // ← Only available in main process
```

### Best Practices

1. ✅ **Validate all IPC data** in main process
2. ✅ **Whitelist IPC channels** in preload script
3. ✅ **Use contextIsolation: true** (enabled by default)
4. ✅ **Keep sensitive code in main** process
5. ❌ **Never disable context isolation**
6. ❌ **Don't use nodeIntegration: true**

## State Management

### Local Component State
```typescript
// Simple state in components
const [count, setCount] = useState(0)
```

### IPC-Based State
```typescript
// State from main process
const [appVersion, setAppVersion] = useState('')

useEffect(() => {
  window.electron.invoke('get-app-version')
    .then(version => setAppVersion(version))
}, [])
```

### Optional: Redux/Zustand
For complex applications, add state management:
```bash
npm install zustand
# or
npm install redux @reduxjs/toolkit
```

## Testing Architecture

### Unit Tests (Vitest)
- Test React components
- Test utilities and hooks
- Mock IPC calls

```typescript
// tests/example.test.ts
import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('renders welcome', () => {
  render(<App />)
  expect(screen.getByText(/welcome/i)).toBeInTheDocument()
})
```

### E2E Tests (Playwright)
- Test full user workflows
- Interact with actual Electron app
- Cross-platform testing

```typescript
// tests/e2e.spec.ts
test('user can interact with app', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.click('button')
  await expect(page).toContainText('clicked')
})
```

## Build Outputs

### Development
- `dist-vite/` - React app files (for dev server)
- Dev tools enabled
- Source maps included

### Production
- `dist/` - Main and preload bundles
- `dist-vite/` - Optimized React bundle
- `out/` - Platform-specific installers
  - Windows: `.exe`, `.nsis`
  - macOS: `.dmg`, `.zip`
  - Linux: `.AppImage`, `.deb`

## Performance Considerations

### Startup Time
- Preload script loaded early
- IPC bridge minimal overhead
- Vite handles frontend optimization

### Memory Usage
- Single window example (customizable)
- React optimizations applied
- Dev tools disabled in production

### Code Splitting
- Vite handles automatic splitting
- Use dynamic imports for large features
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

## Scalability

For larger applications:

1. **Split into modules**: Organize code by feature
2. **Add routing**: Use React Router for navigation
3. **State management**: Implement Zustand or Redux
4. **Testing**: Expand test coverage
5. **Multi-window**: Add multiple BrowserWindow instances
6. **Auto-updates**: Integrate electron-updater
7. **Crash reporting**: Add Sentry or similar

## Common Patterns

### Accessing User Data
```typescript
// Main process
ipcMain.handle('get-user-documents', () => {
  return app.getPath('documents')
})

// Renderer
const docsPath = await window.electron.invoke('get-user-documents')
```

### File Operations
```typescript
// Main process
import fs from 'fs'

ipcMain.handle('read-file', async (event, filepath) => {
  return fs.readFileSync(filepath, 'utf-8')
})
```

### Window Management
```typescript
// Minimize, maximize, close
ipcMain.handle('window-minimize', () => mainWindow.minimize())
ipcMain.handle('window-maximize', () => mainWindow.maximize())
ipcMain.handle('window-close', () => mainWindow.close())
```

---

For more details, see the main [README](../README.md) and [Development Guide](development.md).
