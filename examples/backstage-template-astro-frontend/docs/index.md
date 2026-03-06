# Astro Frontend Template

Template for creating modern frontend applications using Astro framework.

## Overview

This Backstage software template helps developers quickly create new Astro frontend projects following our organization's standards and best practices.

## Template Information

**Template Type:** Frontend Application
**Primary Technology:** Astro + TypeScript
**Purpose:** Create fast, modern frontend applications

This template generates projects with:

- Pre-configured Astro project structure
- TypeScript support out of the box
- Modern frontend dependencies
- Standard configuration files
- Complete documentation structure with TechDocs
- CI/CD pipeline configuration
- Development environment setup

## Quick Start

### Using this Template in Backstage

1. **Navigate to Backstage:** Open your Backstage instance
2. **Create Component:** Click "Create Component"
3. **Select Template:** Choose "Astro Frontend Template"
4. **Fill Form:** Complete the required information
5. **Create:** Click "Create" to generate your new project

### Template Parameters

When using this template, you'll be prompted for:

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | Project name (kebab-case) | ✅ |
| **Description** | Project description | ✅ |
| **Owner** | Project owner (team or user) | ✅ |
| **System** | System this component belongs to | ✅ |
| **Repository URL** | GitHub repository location | ✅ |

## Generated Project Structure

The template creates a complete project with:

```
my-astro-frontend/
├── README.md                 # Project documentation
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore patterns
├── catalog-info.yaml       # Backstage catalog registration
├── mkdocs.yml              # TechDocs configuration
├── package.json            # Node.js dependencies
├── astro.config.mjs        # Astro configuration
├── tsconfig.json           # TypeScript configuration
├── docs/                   # Project documentation
│   ├── index.md           # Main documentation page
│   ├── getting-started.md # Setup and installation guide
│   ├── development.md     # Development guidelines
│   ├── components.md      # Component documentation
│   └── deployment.md      # Deployment guide
├── .github/
│   └── workflows/         # CI/CD pipelines
├── src/                   # Source code
│   ├── components/       # Astro components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── styles/           # CSS/SCSS files
│   └── utils/            # Utility functions
├── public/               # Static assets
└── tests/                # Test files
```

## Features

### ⚡ Astro Framework

- **Static Site Generation** with dynamic capabilities
- **Component-based architecture** with multiple framework support
- **Built-in TypeScript** support
- **Zero-config setup** with sensible defaults
- **Optimized performance** with automatic optimizations

### 📚 TechDocs Integration

- **MkDocs configuration** for documentation generation
- **Comprehensive documentation structure** with multiple sections
- **Material theme** for professional documentation appearance
- **Search functionality** and navigation features
- **Automatic integration** with Backstage TechDocs

### 🔧 Development Environment

- **Dev Container configuration** for consistent development environments
- **Environment variables template** with example values
- **Linting and formatting tools** pre-configured (ESLint, Prettier)
- **Testing framework setup** with Vitest
- **Package management** with npm/yarn/pnpm support

### 🚀 CI/CD Pipeline

- **GitHub Actions workflows** for automated testing and deployment
- **Code quality checks** including linting and testing
- **Security scanning** with CodeQL and dependency checks
- **Automated deployments** to various hosting platforms

## Typical Use Cases

This template is ideal for:

- **Marketing websites** with dynamic content
- **Documentation sites** with interactive features
- **Landing pages** for products or services
- **Portfolio websites** for showcasing work
- **Blog platforms** with modern features

## Included Technologies

- **Astro 4.x** as the main framework
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vitest** for testing
- **ESLint** and **Prettier** for code quality
- **PostCSS** for modern CSS processing

## Framework Integrations

Out of the box support for:

- **React** components
- **Vue** components
- **Svelte** components
- **Solid** components
- **Lit** components

## Getting Started After Creation

1. **Install dependencies:** `npm install`
2. **Configure environment variables** in `.env`
3. **Start development server:** `npm run dev`
4. **Access application** at `http://localhost:4321`
5. **Build for production:** `npm run build`

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment Options

The template supports deployment to:

- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**
- **AWS S3/CloudFront**
- **Custom hosting**

## Support

### Getting Help

- **Template Issues:** Contact `@platform-team`
- **Backstage Issues:** Contact `@platform-team`
- **Generated Project Issues:** Contact the project owner
- **Security Concerns:** Contact `@security`

## Contributing

To contribute to this template:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make changes** to skeleton files or template configuration
4. **Test thoroughly** with local Backstage instance
5. **Submit pull request** with detailed description

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Backstage Software Templates Documentation](https://backstage.io/docs/features/software-templates/)
- [Frontend Development Guidelines](../frontend-guidelines.md)
- [TypeScript Best Practices](../typescript-best-practices.md)
