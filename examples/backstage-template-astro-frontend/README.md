# Astro Frontend Template

<!-- Badges (templated) -->
<p align="left">
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/${{values.github_organization}}/${{values.repo_name}}/ci.yml?branch=main&label=CI&logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/security/code-scanning"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/${{values.github_organization}}/${{values.repo_name}}/codeql.yml?branch=main&label=CodeQL&logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/issues"><img alt="Issues" src="https://img.shields.io/github/issues/${{values.github_organization}}/${{values.repo_name}}?logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/pulls"><img alt="PRs" src="https://img.shields.io/github/issues-pr/${{values.github_organization}}/${{values.repo_name}}?logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/${{values.github_organization}}/${{values.repo_name}}?logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/${{values.github_organization}}/${{values.repo_name}}" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/network/dependencies"><img alt="Dependabot" src="https://img.shields.io/badge/Dependabot-enabled-success?logo=dependabot" /></a>
</p>

This template allows you to create unto nuevto aplicación frontend with Astro, TypeScript and prácticas modernas of development web.

## What does this template include?

### Technologies and frameworks
- **Astro** for sitios web modernos and rápidos
- **TypeScript** for tipado estático
- **Tailwind CSS** for estithe utilitarios
- **Vue.js/React** componentes (configurable)
- **Vite** como bundler of development
- **ESLint** and **Prettier** for calidad of código

### Project structure
- `src/` - Código fuente of the aplicación
  - `pages/` - Páginas of the aplicación (rutas)
  - `components/` - Componentes reutilizables
  - `layouts/` - Layouts of página
  - `styles/` - Estithe globales
- `.devcontainer/` - Configuración for development in contenedores

### Included features
- **Static Site Generation (SSG)** por defecto
- **Server Siof Rendering (SSR)** opcional
- **API Routes** for funcionalidad backend ligera
- **Image optimization** automática
- **SEO optimizado** with metto tags
- **PWA ready** configuration preparada
- **Hot reload** for development

### DevOps and CI/CD
- **GitHub Actions** for CI/CD and deploy
- **Vercel/Netlify** deploand automático
- **Docker** for despliegues containerizados
- **DevContainer** for development consistente
- **Dependabot** for actualizaciones of npm
- **Lighthouse CI** for auditorías of performance

## Usage

1. Use this template from Backstage
2. Complete the form with:
   - Project name (in kebab-case)
   - Descripción of the aplicación
   - System it belongs to
   - Tier of servicio (normalmente tier-3 for frontends)
   - Responsible team

3. The template will create:
   - Repositorio with estructurto Astro optimizada
   - Branch protection configuration
   - Pipelines of CI/CD for deployment
   - Initial documentation

## Generated structure

```
my-frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   └── about.astro
│   ├── components/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── styles/
│       └── global.css
├── public/
│   ├── favicon.ico
│   └── images/
├── .devcontainer/
│   └── devcontainer.json
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Included best practices

- **Performance first** with Astro Islands
- **Accessibility** (a11y) consideraciones
- **SEO optimization** with metto tags dinámicos
- **Core Web Vitals** optimización
- **Modern CSS** with Tailwind and CSS Grid/Flexbox
- **Component composition** patterns
- **Static assets** optimization
- **Bundle splitting** automático

## Development configuration

- **Dev server** with hot reload in puerto 4321
- **TypeScript** checking automático
- **ESLint** and **Prettier** configureds
- **Tailwind CSS** with JIT compilation
- **Image optimization** with `@astrojs/image`
- **VS Code** extensions recomendadas

## Deployment

- **Static hosting** optimizado (Vercel, Netlify, GitHub Pages)
- **CDN ready** with optimización of assets
- **Environment variables** for configuration
- **Build optimization** automática

## Support

- **Documentation**: Check the generated documentation in `docs/`
- **Issues**: Report problems in the template repository
- **Slack**: #platform-team channthe for support
