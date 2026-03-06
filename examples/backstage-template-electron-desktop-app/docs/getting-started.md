# Getting Started

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- VS Code (recommended)

## Create a New Project

### Step 1: Generate from Template

Using Backstage:
1. Navigate to the Backstage portal
2. Click "Create" → "Electron Desktop App"
3. Fill in the required information:
   - **Project Name**: Must be lowercase with hyphens (kebab-case)
   - **Description**: Brief description of your app
   - **System**: Select the system this component belongs to
   - **Service Tier**: Select the appropriate tier
   - **Team Owner**: Your team name

### Step 2: Clone the Generated Repository

```bash
git clone https://github.com/YOUR_ORG/your-electron-app
cd your-electron-app
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development

```bash
npm run dev
```

Your application will open in an Electron window with:
- Dev tools enabled for debugging
- Hot module replacement for instant feedback
- Vite dev server running on http://localhost:5173

## Project Layout

After generation, your project structure will be:

```
your-electron-app/
├── src/
│   ├── main.ts           # Electron main process
│   ├── preload.ts        # IPC bridge script
│   ├── index.tsx         # React entry point
│   ├── App.tsx           # Root React component
│   └── ...components
├── public/
│   └── index.html        # Main HTML template
├── tests/
│   ├── example.test.ts   # Unit tests
│   └── e2e.spec.ts       # E2E tests
├── .github/
│   └── workflows/        # CI/CD workflows
├── .devcontainer/        # Dev container config
├── package.json          # Project metadata
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── README.md
```

## First Steps

### 1. Update the App Name

Edit `package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Display Name"
}
```

### 2. Customize the Main Component

Edit `src/App.tsx`:
```typescript
function App() {
  return (
    <div className="App">
      <h1>Welcome to Your App</h1>
      <p>Your content here</p>
    </div>
  )
}
```

### 3. Add Your Styling

Edit `src/App.css` or use a CSS framework:
```css
.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
```

### 4. Handle Main Process Logic

Edit `src/main.ts`:
```typescript
// Add IPC handlers for main process functionality
ipcMain.handle('get-user-documents', async () => {
  return app.getPath('documents')
})
```

## Available Scripts

### Development
```bash
npm run dev              # Start dev server and Electron
npm run vite            # Vite dev server only
npm run electron        # Electron window only
```

### Building
```bash
npm run build           # Full production build
npm run build:vite      # Build React app
npm run build:electron  # Build Electron app
npm run package         # Create distributable packages
npm run dist            # Complete build and package
```

### Testing
```bash
npm test                # Run unit tests
npm run test:ui         # Test UI dashboard
npm run test:coverage   # Coverage report
npm run e2e             # E2E tests with Playwright
```

### Code Quality
```bash
npm run lint            # Check code
npm run lint:fix        # Fix issues
npm run format          # Format code
npm run format:check    # Check formatting
npm run type-check      # TypeScript check
```

## Using the IPC Bridge

### Calling Main Process from Renderer

Renderer process (React component):
```typescript
// src/App.tsx
import { useEffect, useState } from 'react'

export function MyComponent() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    window.electron.invoke('get-app-version').then(v => setVersion(v))
  }, [])

  return <div>App Version: {version}</div>
}
```

Main process handler:
```typescript
// src/main.ts
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})
```

### Receiving Events from Main

Listen to events from main process:
```typescript
// src/App.tsx
useEffect(() => {
  window.electron.on('app-update-available', () => {
    console.log('Update available!')
  })
}, [])
```

Emit from main process:
```typescript
// src/main.ts
mainWindow.webContents.send('app-update-available', { version: '2.0.0' })
```

## Adding Dependencies

### Regular Dependencies
```bash
npm install your-package
```

### Dev Dependencies
```bash
npm install --save-dev your-dev-package
```

### Native Modules
For modules with native code:
```bash
npm install native-module --build-from-source
npm run build:electron  # Rebuild for Electron
```

## Building for Distribution

### Create Installers

```bash
npm run dist
```

This creates:
- **Windows**: `.exe` installer and portable executable
- **macOS**: `.dmg` and `.zip` distributions
- **Linux**: `.AppImage` and `.deb` packages

Output is in the `out/` directory.

### Configuration

Edit `package.json` `build` section to customize:
- App ID
- Icon paths
- Distribution formats
- Signing certificates

## Deployment

### GitHub Releases

The CI/CD workflow automatically:
1. Builds for all platforms on tag push
2. Creates a GitHub release
3. Uploads installers as release assets

Push a tag to trigger:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Code Signing

For macOS and Windows distribution:

**macOS:**
```bash
# Set environment variables
export CSC_IDENTITY_AUTO_DISCOVERY=false
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password

npm run dist
```

**Windows:**
Update `package.json` build section with signing certificate details.

## Troubleshooting

### App crashes on startup

1. Check dev console for errors
2. Verify `preload.ts` exports correctly
3. Check `main.ts` for missing imports
4. Review dev tools output

### Port 5173 already in use

```bash
# Find process using port
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
VITE_PORT=5174 npm run dev
```

### Build fails

```bash
# Clear cache and reinstall
rm -rf node_modules dist dist-vite
npm install

# Rebuild TypeScript
npm run build:tsc

# Try again
npm run build
```

### Tests won't run

```bash
# Install Playwright browsers
npx playwright install

# Run tests
npm run e2e
```

## Next Steps

1. **Explore Components**: Add React components to `src/`
2. **Add Features**: Implement main process handlers
3. **Style Your App**: Use CSS or UI framework (TailwindCSS, etc.)
4. **Test Coverage**: Write unit and E2E tests
5. **Publishing**: Set up code signing and auto-updates
6. **Documentation**: Update README with your app specifics

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Playwright Testing](https://playwright.dev)

## Support

For questions and issues:
1. Check the main README.md
2. Review troubleshooting guide
3. Check GitHub Issues
4. Consult official documentation

---

**Happy coding! 🚀**
