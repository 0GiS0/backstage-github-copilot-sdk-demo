# Vue.js Frontend Template Documentation

## Overview

This template helps you bootstrap a Vue.js frontend application with modern tooling and best practices.

## Directory Structure

The generated repository will have the following structure:

```
.
├── .devcontainer/      # Development environment configuration
├── .github/            # GitHub Actions workflows
├── public/             # Static assets
├── src/
│   ├── assets/         # Project assets (images, fonts, etc.)
│   ├── components/     # Vue components
│   ├── composables/    # Composition API composables
│   ├── router/         # Vue Router configuration (if enabled)
│   ├── stores/         # Pinia stores (if enabled)
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── catalog-info.yaml   # Backstage catalog entity
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## Getting Started

After creating the repository:

1. Clone the repository.
2. Open it in VS Code (it will prompt to reopen in Container).
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
