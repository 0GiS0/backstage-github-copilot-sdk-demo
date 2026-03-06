# Node.js Service Template Usage Guide

This guide explains how to use the **Node.js Service** template effectively to create new Node.js APIs and microservices.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- Node.js 18+ and npm installed on your development machine
- Basic understanding of JavaScript/TypeScript and Express.js
- Required permissions to create repositories in your organization

### Understanding This Template

**Template Type:** Backend Service
**Primary Use Case:** Create scalable Node.js APIs and microservices
**Technologies:** Node.js, TypeScript, Express.js, Jest

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for "Node.js Service Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

Fill in the required parameters for your new Node.js service.

### 3. Post-Creation Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-node-service.git
cd your-node-service

# Install dependencies
npm install

# Run development server
npm run dev

# Access API at http://localhost:3000
```

## Development

### Creating Routes

```typescript
import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();
const userController = new UserController();

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);

export default router;
```

### Controllers

```typescript
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService = new UserService();

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Bad request' });
    }
  };
}
```

## Testing

```typescript
import request from 'supertest';
import app from '../src/app';

describe('GET /api/users', () => {
  it('should return list of users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Format
npm run format
```

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
