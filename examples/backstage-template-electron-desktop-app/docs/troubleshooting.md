# Troubleshooting

## Common Issues and Solutions

### Development Issues

#### App Won't Start

**Error**: Blank window or crash on startup

**Solutions**:
```bash
# 1. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Check if Vite server is running
# npm run dev should show:
# ➜  Local:   http://localhost:5173/

# 3. Check for console errors
# DevTools should show error messages
```

#### Port 5173 Already in Use

**Error**: `EADDRINUSE: address already in use :::5173`

**Solutions**:
```bash
# 1. Find process using port
lsof -i :5173

# 2. Kill the process
kill -9 <PID>

# 3. Or use different port
VITE_PORT=5174 npm run dev
```

#### HMR Not Working

**Error**: Changes don't appear without manual reload

**Solutions**:
```bash
# 1. Restart dev server
Ctrl+C
npm run dev

# 2. Check Vite server is accessible
curl http://localhost:5173

# 3. Check firewall (if developing remotely)

# 4. Clear browser cache
DevTools → Application → Clear Storage
```

#### Module Not Found Errors

**Error**: `Cannot find module '@/...'`

**Solutions**:
```bash
# 1. Check tsconfig.json has correct paths:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

# 2. Verify vite.config.ts alias:
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}

# 3. Restart dev server
npm run dev
```

#### TypeScript Errors

**Error**: Red squiggles in VS Code

**Solutions**:
```bash
# 1. Type check
npm run type-check

# 2. Restart TypeScript server
Ctrl+Shift+P → TypeScript: Restart TS Server

# 3. Install @types for packages
npm install --save-dev @types/package-name

# 4. Check tsconfig.json
```

### IPC/Communication Issues

#### IPC Handler Not Responding

**Error**: Promise hangs or times out

**Solutions**:
```typescript
// 1. Check handler is registered in main.ts
ipcMain.handle('my-handler', async (event, arg) => {
  console.log('Handler called!')  // Add logging
  return 'result'
})

// 2. Check preload.ts exposes the method
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
})

// 3. Check renderer is calling correctly
const result = await window.electron.invoke('my-handler', arg)

// 4. Add timeout
const timeout = setTimeout(() => {
  throw new Error('Handler timeout')
}, 5000)
const result = await window.electron.invoke('my-handler', arg)
clearTimeout(timeout)
```

#### "window.electron is not defined"

**Error**: `TypeError: Cannot read property 'invoke' of undefined`

**Solutions**:
```typescript
// 1. Check preload script is loaded
// In main.ts:
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,
}

// 2. Check preload.ts exports electron object
contextBridge.exposeInMainWorld('electron', { ... })

// 3. Check dist/preload.js exists (after build)
npm run build

// 4. Add type definitions
declare global {
  interface Window {
    electron: {
      invoke: (channel: string, ...args: any[]) => Promise<any>
      on: (channel: string, callback: any) => void
      off: (channel: string, callback: any) => void
    }
  }
}
```

#### Context Isolation Errors

**Error**: "Function not available due to context isolation"

**Solutions**:
```typescript
// ❌ Wrong - Don't use nodeIntegration
{
  nodeIntegration: true,  // BAD!
  contextIsolation: false  // BAD!
}

// ✅ Correct - Use preload bridge
{
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,  // REQUIRED
  enableRemoteModule: false  // REQUIRED
}

// Expose needed functions in preload.ts only
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
})
```

### Build Issues

#### Build Fails with TypeScript Errors

**Error**: `npm run build` fails with TS errors

**Solutions**:
```bash
# 1. Type check first
npm run type-check

# 2. Fix reported errors

# 3. Try build again
npm run build

# 4. Clear cache if needed
rm -rf dist dist-vite
npm run build
```

#### Build is Very Slow

**Error**: `npm run dist` takes too long

**Solutions**:
```bash
# 1. Check no unnecessary files
# .gitignore should exclude node_modules, coverage, etc

# 2. Use faster build
npm run build:vite  # Just frontend
npm run build:electron  # Just main/preload

# 3. Check disk space
df -h

# 4. Close other applications using CPU/disk
```

#### Electron Builder Errors

**Error**: `electron-builder` related messages

**Solutions**:
```bash
# 1. Check configuration
# package.json build section is valid

# 2. Verify files exist
# dist/ and dist-vite/ should exist

# 3. Clear electron-builder cache
rm -rf ~/Library/Caches/electron-builder  # macOS
rm -r %APPDATA%\electron-builder  # Windows
rm -r ~/.cache/electron-builder  # Linux

# 4. Try rebuilding
npm run build
npm run dist
```

### Testing Issues

#### Tests Won't Run

**Error**: `npm test` fails

**Solutions**:
```bash
# 1. Install dependencies
npm install

# 2. Check vitest config
# vitest.config.ts should exist

# 3. Check test files exist
ls tests/

# 4. Run single test with debugging
npx vitest run tests/example.test.ts
```

#### E2E Tests Fail

**Error**: Playwright tests hang or fail

**Solutions**:
```bash
# 1. Install browsers
npx playwright install

# 2. Ensure app is running
npm run dev  # in separate terminal

# 3. Check test URLs
# Should point to http://localhost:5173

# 4. Run with debugging
npx playwright test --debug

# 5. Check Playwright UI
npx playwright test --ui
```

#### Coverage Report is Empty

**Error**: `npm run test:coverage` shows 0% coverage

**Solutions**:
```bash
# 1. Check coverage config in vite.config.ts

# 2. Ensure tests are running
npm run test

# 3. Check test files have imports
import { functionToTest } from '@/module'

# 4. Generate coverage
npm run test:coverage
# Check coverage/ folder
```

### Packaging Issues

#### Installer Won't Create

**Error**: Build succeeds but no installer output

**Solutions**:
```bash
# 1. Check build succeeded
# dist/ and dist-vite/ should have files

# 2. Check package.json has correct build config
{
  "build": {
    "appId": "com.example.app",
    "productName": "MyApp"
  }
}

# 3. Check platform-specific settings
"win": { "target": [...] }
"mac": { "target": [...] }
"linux": { "target": [...] }

# 4. Try single platform
npm run build
electron-builder --win

# 5. Check permissions
chmod +x dist/*
```

#### Code Signing Issues

**Error**: `Could not find certificate` or signing fails

**Solutions**:
```bash
# macOS
# 1. Check certificate exists
security find-identity -v -p codesigning

# 2. Set environment variables
export CSC_IDENTITY_AUTO_DISCOVERY=false
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=yourpassword

# 3. Rebuild
npm run dist

# Windows
# 1. Check certificate installed
certutil -store MY

# 2. Update package.json
"certificateFile": "path/to/cert.pfx"
"certificatePassword": "password"
```

### Runtime Issues

#### App Crashes on Launch

**Error**: App closes immediately after opening

**Solutions**:
```typescript
// 1. Check main.ts createWindow function
// Add logging
const createWindow = () => {
  console.log('Creating window...')
  const mainWindow = new BrowserWindow(...)
  console.log('Window created')
  mainWindow.loadURL(...)
  console.log('URL loaded')
}

// 2. Check error events
mainWindow.webContents.on('crashed', () => {
  console.error('Renderer crashed!')
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
})
```

#### Out of Memory

**Error**: App uses excessive RAM

**Solutions**:
```typescript
// 1. Check for memory leaks in event listeners
// Always remove listeners
window.addEventListener('resize', handler)
// later...
window.removeEventListener('resize', handler)

// 2. Check large data structures aren't persisted
// Avoid keeping full datasets in memory

// 3. Profile memory usage
// DevTools → Memory → Take heap snapshot

// 4. Increase heap size (temporary fix)
NODE_OPTIONS=--max-old-space-size=4096 npm run dev
```

#### Performance Issues

**Error**: App is slow or laggy

**Solutions**:
```typescript
// 1. Check DevTools Performance tab
// Profile rendering

// 2. Optimize renders with React
import { memo, useMemo } from 'react'

const MemoComponent = memo(function Component({ data }) {
  return <div>{data}</div>
})

// 3. Profile IPC calls
// Log timing of handlers
ipcMain.handle('my-handler', async (event, arg) => {
  console.time('my-handler')
  const result = await process(arg)
  console.timeEnd('my-handler')
  return result
})

// 4. Optimize bundle size
npm run build
# Check dist-vite/ size
du -sh dist-vite/

// 5. Use code splitting
const Component = lazy(() => import('./Component'))
```

### Platform-Specific Issues

#### Windows EULA or Installation Issues

**Error**: "This app can't run on your PC" or SmartScreen warnings

**Solutions**:
```
1. Code sign the installer
   - Get certificate from CA
   - Use in build config
   - Rebuild installer

2. Add to SmartScreen whitelist
   - Submit to Microsoft
   - Takes 2-3 weeks

3. Reduce UAC prompts
   - In NSIS config
   - Request user approval once
```

#### macOS Notarization Issues

**Error**: "cannot be opened because the developer cannot be verified"

**Solutions**:
```bash
# 1. Ensure code signing is enabled
export CSC_IDENTITY_AUTO_DISCOVERY=false
export CSC_LINK=/path/to/cert.p12

# 2. Verify signing
codesign -v --deep /path/to/App.app

# 3. Notarize the app
xcrun altool --notarize-app \
  --file app.zip \
  --primary-bundle-id com.example.app \
  --username apple@example.com \
  --password @keychain:AC_PASSWORD

# 4. Check status
xcrun altool --notarization-info UUID \
  --username apple@example.com \
  --password @keychain:AC_PASSWORD
```

#### Linux Package Manager Issues

**Error**: DEB or RPM installation fails

**Solutions**:
```bash
# DEB issues
# 1. Check dependencies
cat DEBIAN/control

# 2. Install manually
dpkg -i app.deb

# 3. Install dependencies
apt install missing-dependency

# RPM issues
rpm -i app.rpm
# or
yum install app.rpm
```

### Debug Techniques

#### Enable Verbose Logging

```typescript
// src/main.ts
const isDev = !app.isPackaged

if (isDev) {
  console.log('Development mode enabled')
}

ipcMain.handle('debug-info', () => ({
  isDev,
  appVersion: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
}))
```

#### Use Browser DevTools

```typescript
// In development, press Ctrl+Shift+I
// Inspect elements, check console, use debugger
debugger  // Add breakpoints in code
```

#### Check Log Files

On different platforms:
```bash
# Linux
~/.config/YourApp/

# macOS
~/Library/Logs/YourApp/

# Windows
%APPDATA%\YourApp\Logs\
```

#### Remote Debugging

```typescript
// src/main.ts
if (isDev) {
  mainWindow.webContents.openDevTools()
}
```

## Getting Help

1. **Check the Docs**
   - [Electron Docs](https://www.electronjs.org/docs)
   - [React Docs](https://react.dev)
   - [Vite Docs](https://vitejs.dev)

2. **Search Issues**
   - GitHub issues in project
   - Stack Overflow
   - Electron Discord

3. **Create Issue**
   - Include error message
   - Provide reproducible example
   - List your OS and versions

4. **Community Help**
   - Electron Discord
   - Reddit r/electronjs
   - GitHub Discussions

---

See [Development](development.md) for more workflows.
