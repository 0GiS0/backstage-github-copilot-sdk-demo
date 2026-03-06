# Astro Frontend Template Usage Guide

This guide explains how to use the **Astro Frontend** template effectively to create new frontend applications.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- Basic understanding of frontend development and Astro framework
- Node.js 18+ installed on your development machine
- Required permissions to create repositories in your organization

### Understanding This Template

**Template Type:** Frontend Application
**Primary Use Case:** Create modern, fast frontend applications
**Technologies:** Astro, TypeScript, Vite

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for "Astro Frontend Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

The template will prompt you for several required parameters:

#### **Project Name**
- **Format:** kebab-case (lowercase with hyphens)
- **Example:** `marketing-website`, `product-landing-page`
- **Requirements:** Must be unique within your organization

#### **Description**
- **Purpose:** Brief description of what your frontend application does
- **Example:** "Marketing website for our new product with interactive features"
- **Best Practice:** Keep it concise but descriptive

#### **Owner**
- **Format:** Team or individual username
- **Example:** `frontend-team`, `marketing-team`, `jane.doe`
- **Recommendation:** Use team names rather than individual names when possible

#### **System**
- **Purpose:** Logical grouping of related components
- **Example:** `marketing`, `product-showcase`, `company-website`
- **Note:** Should align with your organization's system architecture

### 3. Review and Create

1. **Review Parameters:** Verify that all information is correct
2. **Create Project:** Click "Create" to generate the project
3. **Wait for Generation:** The process may take a few minutes
4. **Access Repository:** Once created, access the new repository

## Post-Creation Setup

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-astro-frontend.git
cd your-astro-frontend

# Install dependencies (using npm, yarn, or pnpm)
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Site configuration
SITE_URL=http://localhost:4321
SITE_TITLE="My Astro Site"

# API endpoints
API_BASE_URL=https://api.example.com
API_KEY=your_api_key_here

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# CMS integration (optional)
CMS_API_URL=https://cms.example.com
CMS_API_TOKEN=your_cms_token
```

### 3. Start Development

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:4321
```

## Project Customization

### 1. Site Configuration

Edit `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yoursite.com',
  integrations: [
    // Add integrations here
  ],
  vite: {
    // Vite configuration
  }
});
```

### 2. Add Content

Create pages in `src/pages/`:

```astro
---
// src/pages/about.astro
export const title = "About Us";
---

<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>Welcome to our about page!</p>
  </body>
</html>
```

### 3. Create Components

Add reusable components in `src/components/`:

```astro
---
// src/components/Button.astro
export interface Props {
  text: string;
  href?: string;
  variant?: 'primary' | 'secondary';
}

const { text, href, variant = 'primary' } = Astro.props;
---

{href ? (
  <a href={href} class={`btn btn-${variant}`}>
    {text}
  </a>
) : (
  <button class={`btn btn-${variant}`}>
    {text}
  </button>
)}

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
  }
  
  .btn-secondary {
    background: #6b7280;
    color: white;
  }
</style>
```

## Framework Integration

### 1. Adding React Components

```bash
# Install React integration
npm install @astrojs/react react react-dom
```

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()]
});
```

Create React component:

```jsx
// src/components/Counter.jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

Use in Astro page:

```astro
---
// src/pages/interactive.astro
import Counter from '../components/Counter.jsx';
---

<html>
  <head>
    <title>Interactive Page</title>
  </head>
  <body>
    <h1>Interactive Counter</h1>
    <Counter client:load />
  </body>
</html>
```

### 2. Adding Vue Components

```bash
# Install Vue integration
npm install @astrojs/vue vue
```

### 3. Adding Svelte Components

```bash
# Install Svelte integration
npm install @astrojs/svelte svelte
```

## Content Management

### 1. Content Collections

Create content in `src/content/`:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
  }),
});

export const collections = { blog };
```

Add blog posts:

```markdown
---
# src/content/blog/first-post.md
title: "My First Post"
description: "This is my first blog post"
pubDate: 2024-01-01
author: "John Doe"
---

# My First Post

This is the content of my first blog post.
```

### 2. Dynamic Pages

Create dynamic routes:

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<html>
  <head>
    <title>{entry.data.title}</title>
  </head>
  <body>
    <article>
      <h1>{entry.data.title}</h1>
      <p>By {entry.data.author} on {entry.data.pubDate.toDateString()}</p>
      <Content />
    </article>
  </body>
</html>
```

## Styling Options

### 1. CSS/SCSS

```astro
---
// Component with scoped styles
---

<div class="card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

<style>
  .card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
  }
</style>
```

### 2. Tailwind CSS

```bash
# Install Tailwind
npm install @astrojs/tailwind tailwindcss
```

```javascript
// astro.config.mjs
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()]
});
```

### 3. CSS Modules

```astro
---
import styles from './Card.module.css';
---

<div class={styles.card}>
  <h2 class={styles.title}>Card Title</h2>
</div>
```

## Performance Optimization

### 1. Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image 
  src={heroImage} 
  alt="Hero image"
  width={800}
  height={400}
  loading="lazy"
/>
```

### 2. Code Splitting

```astro
---
// Lazy load components
import { lazy } from 'astro/ssr';

const HeavyComponent = lazy(() => import('../components/HeavyComponent.astro'));
---

<HeavyComponent client:visible />
```

## Testing

### 1. Unit Testing with Vitest

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### 2. Component Testing

```typescript
// tests/Button.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Button from '../src/components/Button.astro';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button text="Click me" />);
    expect(getByText('Click me')).toBeInTheDocument();
  });
});
```

## Deployment

### 1. Static Site Deployment

```bash
# Build for production
npm run build

# Output will be in dist/ directory
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### 3. Netlify Deployment

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## Common Use Cases

### 1. Marketing Website

- Hero sections with CTAs
- Feature showcases
- Customer testimonials
- Contact forms
- SEO optimization

### 2. Documentation Site

- Markdown content
- Search functionality
- Navigation sidebar
- Code syntax highlighting
- Version management

### 3. Blog Platform

- Content collections
- RSS feeds
- Tag/category filtering
- Author profiles
- Comment systems

## Best Practices

### 1. Performance

- Use static generation when possible
- Optimize images with Astro's Image component
- Minimize JavaScript bundle size
- Implement proper caching strategies

### 2. SEO

- Include proper meta tags
- Use semantic HTML
- Implement structured data
- Optimize for Core Web Vitals

### 3. Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Test with screen readers

## Troubleshooting

### Common Issues

#### 1. Build Errors
**Cause:** TypeScript type errors or missing dependencies
**Solution:** Check console output and fix type issues

#### 2. Component Not Rendering
**Cause:** Missing client directive for interactive components
**Solution:** Add appropriate `client:*` directive

#### 3. Styling Issues
**Cause:** CSS specificity or scoping problems
**Solution:** Use scoped styles or CSS modules

## Additional Resources

- [Astro Documentation](https://docs.astro.build/)
- [Astro Integrations](https://astro.build/integrations/)
- [Frontend Performance Best Practices](../frontend-performance.md)
- [Accessibility Guidelines](../accessibility-guidelines.md)

## Contributing

To improve this template:

1. **Test new features** with the latest Astro version
2. **Update dependencies** regularly
3. **Document changes** thoroughly
4. **Maintain backward compatibility** when possible
