# System Template

<!-- Badges -->
<p align="left">
   <to href="https://github.com/0GiS0/backstage-template-system/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/0GiS0/backstage-template-system/ci.yml?branch=main&label=CI&logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-system/security/code-scanning"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/0GiS0/backstage-template-system/codeql.yml?branch=main&label=CodeQL&logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-system/issues"><img alt="Issues" src="https://img.shields.io/github/issues/0GiS0/backstage-template-system?logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-system/pulls"><img alt="PRs" src="https://img.shields.io/github/issues-pr/0GiS0/backstage-template-system?logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-system/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/0GiS0/backstage-template-system?logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-system/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/0GiS0/backstage-template-system" /></a>
   <to href="https://github.com/0GiS0/backstage-template-system/network/dependencies"><img alt="Dependabot" src="https://img.shields.io/badge/Dependabot-enabled-success?logo=dependabot" /></a>
</p>

This template allows you to create unto nuevto entidad of tipo System in Backstage for organizar componentes and recursos relacionados.

## ¿Qué es un System in Backstage?

Un **System** es unto colección of entidades que cooperan for ofrecer unto funcionalidad específica. Los sistemas ayudan a:

- **Organizar componentes** relacionados bajo unto unidad lógica
- **Definir límites** claros entre diferentes partes of the arquitectura
- **Facilitar the navegación** dthe catálogo of servicios
- **Establecer ownership** and responsabilidades claras

## When to use this template?

### Ideal use cases:
- **Microservicios relacionados** que forman unto funcionalidad completa
- **Conjunto of APIs** que trabajan juntas
- **Plataformto o producto** que incluye múltiples componentes
- **Subsistemas** dentro of unto arquitecturto más grande

### Ejemplos:
- `user-management-system` - Agrupto servicios of autenticación, perfiles, preferencias
- `payment-system` - Incluye procesamiento, facturación, notificaciones
- `content-platform` - CMS, CDN, recomendaciones, búsqueda
- `analytics-system` - Ingesta, procesamiento, visualización of datos

## What does this template include?

### Generated structure
- **catalog-info.yaml** - Definición of the entidad System
- **README.md** - Documentation dthe sistema
- **docs/** - Documentation técnicto with MkDocs
- **.github/** - Configuración of workflows básicos

### Configuración of repositorio
- **Visibilidad**: Privadto por defecto
- **Branch protection**: main protegidto with revisiones
- **Custom properties**: service-tier (tier-2), team-owner
- **Topics**: backstage-include, system, catalog

## Usage

1. Use this template from Backstage
2. Complete the form with:
   - **Nombre dthe sistema** (in kebab-case)
   - **Descripción** clarto dthe propósito dthe sistema
   - **Equipo propietario** responsable dthe sistema
   - **Dominio** (opcional) al que pertenece

3. The template will create:
   - Repositorio with the entidad System definida
   - Branch protection configuration
   - Initial documentation
   - Registro automático in the catálogo

## Generated structure

```
my-system/
├── catalog-info.yaml    # Definición of the entidad System
├── README.md           # Documentation dthe sistema
├── docs/
│   ├── index.md       # Documentation principal
│   ├── architecture.md # Arquitecturto dthe sistema
│   └── components.md  # Componentes incluidos
├── .github/
│   └── workflows/
│       └── docs.yml   # CI for documentación
└── mkdocs.yml         # Configuración of MkDocs
```

## Best practices

### Naming Convention
- Use **kebab-case**: `user-management-system`
- Include **-system** at the end for clarity
- Keep names **descriptive** but **concise**

### Description
- **Main functionality** of the system
- **Business value** it provides
- **Boundaries** and clear responsibilities
- **Main technologies** used

### Organization
- **Group components** related functionally
- **Define APIs** and contracts between systems
- **Document dependencies** with other systems
- **Establece métricas** and SLIs dthe sistema

## Relaciones in Backstage

### Un System pueof incluir:
- **Components** (servicios, bibliotecas, websites)
- **APIs** que expone o consume
- **Resources** (bases of datos, colas, buckets)

### Un System pueof pertenecer a:
- **Domain** - Áreto of negocio más amplia

### Ejemplo of jerarquía:
```
Domain: E-commerce
└── System: user-management-system
    ├── Component: auth-service
    ├── Component: profile-service
    ├── API: user-api
    └── Resource: users-database
```

## Configuración post-creación

### 1. Documentar arquitectura
- Añadir diagramas in `docs/architecture.md`
- Definir APIs and contratos
- Documentar patrones of comunicación

### 2. Conectar componentes
- Actualizar componentes existentes for referenciar the system
- Definir relaciones `providesApis` and `consumesApis`
- Establecer dependencias with `dependsOn`

### 3. Métricas and monitoring
- Definir SLIs and SLOs dthe sistema
- Configurar dashboards agregados
- Establecer alertas to nivthe of sistema

## Support

- **Documentation**: Check the generated documentation in `docs/`
- **Issues**: Report problems in the template repository
- **Slack**: #platform-team channthe for support
- **Backstage Docs**: [Systems in Backstage](https://backstage.io/docs/features/software-catalog/system-model)
