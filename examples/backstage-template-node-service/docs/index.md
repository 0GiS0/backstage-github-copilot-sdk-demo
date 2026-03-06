# Node.js Service Template

Template for creating Node.js microservices and APIs using modern JavaScript/TypeScript.

## Overview

This Backstage software template helps developers quickly create new Node.js service projects following our organization's standards and best practices.

## Template Information

**Template Type:** Backend Service
**Primary Technology:** Node.js + TypeScript + Express
**Purpose:** Create scalable Node.js APIs and microservices

This template generates projects with:

- Modern Node.js project structure with TypeScript
- Express.js framework for API development
- Database integration options
- Authentication and authorization middleware
- OpenAPI/Swagger documentation
- Testing with Jest
- Complete documentation structure with TechDocs
- CI/CD pipeline configuration
- Development environment setup

## Quick Start

### Using this Template in Backstage

1. **Navigate to Backstage:** Open your Backstage instance
2. **Create Component:** Click "Create Component"
3. **Select Template:** Choose "Node.js Service Template"
4. **Fill Form:** Complete the required information
5. **Create:** Click "Create" to generate your new project

### Template Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | Service name (kebab-case) | ✅ |
| **Description** | Service description | ✅ |
| **Owner** | Service owner (team or user) | ✅ |
| **System** | System this service belongs to | ✅ |
| **Repository URL** | GitHub repository location | ✅ |

## Generated Project Structure

```
my-node-service/
├── README.md                 # Project documentation
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore patterns
├── catalog-info.yaml       # Backstage catalog registration
├── mkdocs.yml              # TechDocs configuration
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── docs/                   # Project documentation
├── .github/workflows/     # CI/CD pipelines
├── src/
│   ├── index.ts          # Application entry point
│   ├── app.ts            # Express app configuration
│   ├── routes/           # API route handlers
│   ├── controllers/      # Request controllers
│   ├── services/         # Business logic services
│   ├── models/           # Data models
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
├── tests/                # Test files
└── docker/
    ├── Dockerfile        # Container configuration
    └── docker-compose.yml # Local development setup
```

## Features

### 🚀 Modern Node.js Stack

- **TypeScript** for type safety and better development experience
- **Express.js** for robust API development
- **ESLint** and **Prettier** for code quality
- **Jest** for comprehensive testing
- **Winston** for structured logging

### 🔧 Development Tools

- **Nodemon** for development auto-restart
- **ts-node** for TypeScript execution
- **Swagger/OpenAPI** for API documentation
- **Helmet** for security headers
- **CORS** middleware for cross-origin requests

## Getting Started After Creation

1. **Install Node.js 18+** and npm/yarn
2. **Install dependencies:** `npm install`
3. **Configure environment variables** in `.env`
4. **Run development server:** `npm run dev`
5. **Access API documentation** at `http://localhost:3000/api-docs`

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
