# Deployment

## Building for Production

### Creating Distributions

Build installers for all platforms:

```bash
npm run dist
```

This creates:
- **Windows**: NSIS installer and portable EXE
- **macOS**: DMG and ZIP archives
- **Linux**: AppImage and DEB package

Output: `out/` directory

### Platform-Specific Builds

Build for single platform:

```bash
# Windows
npm run build && electron-builder --win

# macOS
npm run build && electron-builder --mac

# Linux
npm run build && electron-builder --linux
```

## Code Signing

### macOS Code Signing

Required for distribution and running on other Macs.

1. **Create Certificate**
   - Use Apple Developer account
   - Create signing certificate

2. **Configure in Terraform/Environment**
   ```bash
   export CSC_LINK=/path/to/Certificates.p12
   export CSC_KEY_PASSWORD=your_password
   npm run dist
   ```

3. **Verify Signing**
   ```bash
   codesign -v --deep --strict /path/to/App.app
   ```

### Windows Code Signing

For authenticode signing:

1. **Obtain Certificate**
   - Get from certificate authority (Sectigo, DigiCert, etc.)

2. **Update package.json**
   ```json
   {
     "build": {
       "win": {
         "certificateFile": "path/to/certificate.pfx",
         "certificatePassword": "password",
         "signingHashAlgorithms": ["sha256"]
       }
     }
   }
   ```

3. **Build and Sign**
   ```bash
   npm run dist
   ```

### Notarization (macOS)

Required for macOS apps on Monterey+:

1. **Configure**
   ```bash
   export APPLE_ID=your@email.com
   export APPLE_ID_PASSWORD=app_password
   export APPLE_TEAM_ID=XXXXXXXXXX
   ```

2. **Build with Notarization**
   ```bash
   npm run dist
   ```

Electron Builder handles notarization automatically.

## Auto-Updates

### Using electron-updater

1. **Install**
   ```bash
   npm install electron-updater
   ```

2. **Configure in Main Process**
   ```typescript
   // src/main.ts
   import { autoUpdater } from 'electron-updater'

   autoUpdater.checkForUpdatesAndNotify()
   ```

3. **Host Updates**
   - GitHub releases
   - S3 bucket
   - Custom server

4. **Release New Version**
   ```bash
   npm version patch
   git push origin --tags
   # GitHub Actions builds and creates release
   ```

## Distribution Methods

### GitHub Releases

Automatically created via CI/CD:

1. Tag your release
   ```bash
   git tag v1.0.0
   git push origin --tags
   ```

2. GitHub Actions builds and uploads
3. Users download from releases page

### Homebrew (macOS)

Create tap for easy installation:

```bash
brew install your-org/your-app/your-app
```

### Microsoft Store

Upload to Windows Store for distribution.

### Mac App Store

Submit through App Store Connect.

### Linux Package Repositories

Maintain PPA for Ubuntu/Debian users.

## CI/CD Deployment

The template includes GitHub Actions workflows:

### CI Workflow (.github/workflows/ci.yml)

Runs on every push and PR:
- Linting
- Type checking
- Testing
- Building

### Release Workflow (.github/workflows/release.yml)

Triggers on version tags:
```bash
git tag v1.0.0
git push origin v1.0.0
```

- Builds for all platforms
- Creates GitHub release
- Uploads installers

### Customizing Workflows

Edit `.github/workflows/` files to:
- Add notifications
- Deploy to CDN
- Trigger other processes
- Add signing credentials

## Configuration

### Build Configuration

In `package.json` `build` section:

```json
{
  "build": {
    "appId": "com.example.app",
    "productName": "My App",
    "files": ["dist/**/*", "node_modules/**/*"],
    "win": {
      "target": ["nsis", "portable"],
      "certificateFile": "path/to/cert.pfx"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "identity": "Developer ID Application: Your Name"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Utility"
    }
  }
}
```

### Environment Variables

Create `.env.production`:
```
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Publishing

### GitHub Release

Automatic via workflow, includes:
- Release notes
- Installer downloads
- Source code
- SHA256 checksums

### Website Distribution

1. Upload to website
2. Create download page
3. Add version info
4. Document changes

### Beta Releases

Before releasing final version:

```bash
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1
```

Workflows create beta release with pre-release flag.

## Version Management

### Semantic Versioning

Follow semver:
- `MAJOR.MINOR.PATCH`
- `1.2.3` = v1, minor feature 2, patch 3

### Update Version

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch

# Minor release (1.0.0 → 1.1.0)
npm version minor

# Major release (1.0.0 → 2.0.0)
npm version major

# Push to trigger release
git push origin --tags
```

## Monitoring

### Crash Reporting

Add Sentry for crash tracking:

```bash
npm install @sentry/electron
```

```typescript
// src/main.ts
import * as Sentry from '@sentry/electron'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.MODE,
})
```

### Analytics

Track usage with analytics service:

```typescript
// src/utils/analytics.ts
export const trackEvent = (name: string, data?: any) => {
  // Send to analytics service
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ name, data })
  })
}
```

### Logs

Implement logging for troubleshooting:

```typescript
// src/utils/logger.ts
export const log = (message: string, level = 'info') => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${level}: ${message}`)
  
  // Optional: send to logging service
  if (level === 'error') {
    sendToLoggingService(message)
  }
}
```

## Rollback

If a release has issues:

1. Delete problematic release tag
   ```bash
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```

2. Fix the issue

3. Create new release
   ```bash
   npm version patch
   git push origin --tags
   ```

## Verification

### Before Release

```bash
# Test all platforms
npm run build

# Verify code quality
npm run lint
npm run type-check
npm test

# Check signatures
codesign -v --deep /path/to/app

# Test installer
# Run installer on each platform
```

### After Release

1. Download installer
2. Run on clean machine
3. Test core features
4. Check auto-update
5. Verify performance

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf dist dist-vite out node_modules
npm install

# Rebuild
npm run dist
```

### Signing Issues

```bash
# macOS: Check certificate
security find-identity -v -p codesigning

# Windows: Check certificate installed
certutil -store MY
```

### Auto-Update Issues

1. Verify release published
2. Check version number incremented
3. Verify file hashes in releases
4. Check network connectivity

### Platform-Specific Issues

**Windows:**
- NSIS installer quirks - test on Windows
- Portable EXE may be blocked by Windows Defender

**macOS:**
- Requires notarization for distribution
- Check Apple's developer logs

**Linux:**
- Test on target distributions
- AppImage provides portability
- DEB requires package dependencies

---

See [Development](development.md) for development workflow.
