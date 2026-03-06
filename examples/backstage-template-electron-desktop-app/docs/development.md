# Development

## Development Workflow

### Starting the Development Server

```bash
npm run dev
```

This command:
1. Starts Vite dev server on port 5173
2. Launches Electron with dev tools enabled
3. Watches for file changes

### HMR (Hot Module Replacement)

When you edit React files, the app updates instantly:
- Edit `src/App.tsx` → See changes immediately
- Edit `src/index.tsx` → HMR handles the update
- CSS changes apply without reload

### Rebuilding Main Process

For changes to `src/main.ts` or `src/preload.ts`:
1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again

The main process must be rebuilt to pick up changes.

## Project Structure Guidelines

### Components Organization

```
src/components/
├── common/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── features/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.test.ts
│   └── Settings/
│       ├── Settings.tsx
│       └── Settings.test.ts
└── layout/
    └── MainLayout.tsx
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Imports Organization

Group imports in this order:
```typescript
// 1. External libraries
import React, { useState } from 'react'
import { format } from 'date-fns'

// 2. Internal modules
import { useAppContext } from '@/hooks/useAppContext'
import { Button } from '@/components/common/Button'

// 3. Styles
import './Component.css'
```

## Working with IPC

### Adding a New IPC Handler

1. **Define in main process** (`src/main.ts`):
```typescript
ipcMain.handle('my-handler', async (event, arg) => {
  // Validate input
  if (!arg) throw new Error('Invalid argument')
  
  // Process
  const result = await myAsyncFunction(arg)
  
  // Return result
  return result
})
```

2. **Expose in preload** (`src/preload.ts`):
```typescript
// Optional: add to whitelist if restricting channels
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, ...args) => {
    const ALLOWED = ['my-handler', 'another-handler']
    if (ALLOWED.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
  }
})
```

3. **Call from renderer** (`src/App.tsx`):
```typescript
const handleClick = async () => {
  try {
    const result = await window.electron.invoke('my-handler', 'arg')
    console.log(result)
  } catch (error) {
    console.error('Handler failed:', error)
  }
}
```

### Testing IPC Handlers

```typescript
// tests/example.test.ts
import { ipcMain } from 'electron'

test('my-handler processes data', async () => {
  const mockArg = 'test'
  
  // Mock the handler
  ipcMain.handle('my-handler', async (event, arg) => {
    return arg.toUpperCase()
  })
  
  // Test it
  // Note: In actual tests, you'd use mocking libraries
})
```

## Adding Dependencies

### NPM Packages

```bash
# Add to project
npm install package-name

# Add as dev dependency
npm install --save-dev dev-package
```

### Native Modules

Some packages have native code that must be compiled for Electron:

```bash
# Install
npm install native-module

# Rebuild for Electron
npm run build:electron
```

### Common Additions

**UI Framework:**
```bash
npm install tailwindcss postcss autoprefixer
```

**State Management:**
```bash
npm install zustand
# or
npm install redux @reduxjs/toolkit react-redux
```

**HTTP Client:**
```bash
npm install axios
```

**Date Handling:**
```bash
npm install date-fns
```

**Form Handling:**
```bash
npm install react-hook-form
```

## Code Quality

### Linting

The project uses ESLint with recommended rules:

```bash
# Check for issues
npm run lint

# Fix automatically
npm run lint:fix
```

### Formatting

Prettier keeps code consistently formatted:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Type Checking

TypeScript ensures type safety:

```bash
# Check types
npm run type-check
```

### Recommended Workflow

```bash
# Before committing
npm run lint:fix
npm run format
npm run type-check
npm run test
```

## Testing

### Unit Tests

Tests for individual functions and components:

```typescript
// src/utils.ts
export const add = (a: number, b: number) => a + b

// tests/utils.test.ts
import { describe, it, expect } from 'vitest'
import { add } from '../src/utils'

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

Run with:
```bash
npm test                # Run all tests
npm run test:ui         # Interactive test UI
npm run test:coverage   # Coverage report
```

### Component Testing

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handler = vi.fn()
    const { container } = render(<Button onClick={handler} />)
    container.querySelector('button').click()
    expect(handler).toHaveBeenCalled()
  })
})
```

### E2E Testing

Testing complete user workflows:

```typescript
// tests/workflow.spec.ts
import { test, expect } from '@playwright/test'

test('user can complete task', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:5173')
  
  // Interact
  await page.click('button:has-text("Start")')
  
  // Verify
  await expect(page).toContainText('Complete')
})
```

Run E2E tests:
```bash
npm run e2e
```

## Debugging

### In Renderer Process

Dev tools are enabled in development:
- Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
- Inspect elements
- Check console errors
- Use Network tab to monitor

### In Main Process

Add logging or use debugger:

```typescript
// src/main.ts
console.log('Debug info:', value)

// Or use debugger
if (isDev) {
  mainWindow.webContents.openDevTools()
}
```

### VS Code Debugging

1. Install "Debugger for Chrome" extension
2. Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach to Electron",
      "port": 9222,
      "pathMapping": {
        "/": "${workspaceRoot}/src/"
      }
    }
  ]
}
```

## Performance Optimization

### Code Splitting

Split large bundles with dynamic imports:

```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Memoization

Prevent unnecessary re-renders:

```typescript
import { memo, useMemo, useCallback } from 'react'

const MemoComponent = memo(function Component({ data }) {
  return <div>{data}</div>
})

function Parent() {
  const expensive = useMemo(() => complexCalc(), [])
  const handleClick = useCallback(() => { /* ... */ }, [])
  
  return <MemoComponent data={expensive} onClick={handleClick} />
}
```

### Bundle Analysis

```bash
npm run build:vite
# Check dist-vite/ folder size
du -sh dist-vite/
```

## Committing Code

### Commit Messages

Follow conventional commits:

```
type(scope): description

feat(auth): add login form
fix(ui): fix button alignment
docs(readme): update installation
refactor(ipc): simplify handler registration
test(components): add button tests
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

## Git Workflow

1. Create feature branch:
```bash
git checkout -b feature/my-feature
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: add my feature"
```

3. Push and create PR:
```bash
git push origin feature/my-feature
```

4. After review and merge:
```bash
git checkout main
git pull origin main
```

## CI/CD Pipelines

### GitHub Actions Workflow

Automatic checks on push and PR:

1. **Lint**: ESLint checks
2. **Format**: Prettier verification
3. **Type**: TypeScript checking
4. **Test**: Unit tests with coverage
5. **Build**: Multi-platform build

View in `.github/workflows/ci.yml`

### Release Process

Tag and push to create release:

```bash
# Update version
npm version minor

# Push tag (triggers release workflow)
git push origin --tags
```

This automatically:
- Builds for Windows, macOS, Linux
- Creates GitHub release
- Uploads installers

## Development Tips

### Hot Reload Issues

If HMR stops working:
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### Dependencies Cache

Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Conflicts

Change Vite port:
```bash
VITE_PORT=5174 npm run dev
```

### Environment Variables

Create `.env.local`:
```
VITE_APP_TITLE=My App
VITE_API_URL=http://localhost:3000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)

---

See [Architecture](architecture.md) for deeper technical details.
