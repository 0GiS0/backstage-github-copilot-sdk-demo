# Domain Template

<!-- Badges -->
<p align="left">
   <to href="https://github.com/0GiS0/backstage-template-domain/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/0GiS0/backstage-template-domain/ci.yml?branch=main&label=CI&logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-domain/security/code-scanning"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/0GiS0/backstage-template-domain/codeql.yml?branch=main&label=CodeQL&logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-domain/issues"><img alt="Issues" src="https://img.shields.io/github/issues/0GiS0/backstage-template-domain?logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-domain/pulls"><img alt="PRs" src="https://img.shields.io/github/issues-pr/0GiS0/backstage-template-domain?logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-domain/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/0GiS0/backstage-template-domain?logo=github" /></a>
   <to href="https://github.com/0GiS0/backstage-template-domain/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/0GiS0/backstage-template-domain" /></a>
   <to href="https://github.com/0GiS0/backstage-template-domain/network/dependencies"><img alt="Dependabot" src="https://img.shields.io/badge/Dependabot-enabled-success?logo=dependabot" /></a>
</p>

This template allows you to create unto nuevto entidad of tipo Domain in Backstage for agrupar sistemas and componentes relacionados por áreto of negocio.

## ¿Qué es un Domain in Backstage?

Un **Domain** es unto entidad of alto nivthe que representto un áreto of negocio, un dominio funcional o unto responsabilidad organizacional. Los dominios ayudan a:

- **Organizar sistemas** por áreto of negocio
- **Establecer ownership** to nivthe organizacional
- **Definir límites** of responsabilidad claros
- **Facilitar the governanza** and compliance

## When to use this template?

### Ideal use cases:
- **Áreas of negocio** claramente definidas
- **Dominios funcionales** independientes
- **Organizaciones** o equipos grandes
- **Compliance** and governanzto por dominio

### Ejempthe según Domain-Drivin Design:
- `user-experience` - Frontend, UX, personalizaciones
- `sales` - CRM, facturación, contratos, comisiones  
- `fulfillment` - Inventario, logística, entregas
- `customer-support` - Tickets, chat, knowledge base
- `platform` - Infrastructure, monitoring, deployment
- `security` - Authentication, authorization, audit

## What does this template include?

### Generated structure
- **catalog-info.yaml** - Definición of the entidad Domain
- **README.md** - Documentation dthe dominio
- **docs/** - Documentation of negocio and técnica
- **.github/** - Configuración of workflows básicos

### Configuración of repositorio
- **Visibilidad**: Privadto por defecto
- **Branch protection**: main protegidto with revisiones  
- **Custom properties**: service-tier (tier-2), team-owner
- **Topics**: backstage-include, domain, catalog

## Usage

1. Use this template from Backstage
2. Complete the form with:
   - **Nombre dthe dominio** (in kebab-case)
   - **Descripción** dthe áreto of negocio o responsabilidad
   - **Equipo propietario** responsable dthe dominio

3. The template will create:
   - Repositorio with the entidad Domain definida
   - Branch protection configuration
   - Initial documentation
   - Registro automático in the catálogo

## Generated structure

```
my-domain/
├── catalog-info.yaml     # Definición of the entidad Domain
├── README.md            # Documentation dthe dominio
├── docs/
│   ├── index.md        # Documentation principal
│   ├── business.md     # Descripción of negocio
│   ├── systems.md      # Sistemas incluidos
│   └── governance.md   # Políticas and governanza
├── .github/
│   └── workflows/
│       └── docs.yml    # CI for documentación
└── mkdocs.yml          # Configuración of MkDocs
```

## Best practices

### Naming Convention
- Usto **kebab-case**: `user-experience`, `customer-support`
- Nombres **descriptivos** dthe áreto of negocio
- Evitto sufijos técnicos (no `user-domain`)
- Mantén **consistencia** with the organización

### Descripción
- **Áreto of negocio** que representa
- **Responsabilidades** principales
- **Stakeholders** and equipos involucrados
- **Objetivos** of negocio dthe dominio

### Organizacion por dominio
- **Agrupto sistemas** relacionados por negocio
- **Define boundaries** claros entre dominios
- **Establece policies** específicas dthe dominio
- **Documentto relaciones** entre dominios

## Relaciones in Backstage

### Un Domain pueof incluir:
- **Systems** - Colecciones of componentes relacionados
- **Components** - Servicios específicos dthe dominio
- **APIs** - Interfaces expuestas por the dominio

### Ejemplo of jerarquíto completa:
```
Domain: Sales
├── System: customer-relationship-system
│   ├── Component: crm-service
│   ├── Component: lead-tracker
│   └── API: customers-api
├── System: billing-system
│   ├── Component: invoice-service
│   ├── Component: payment-processor
│   └── API: billing-api
└── System: commission-system
    ├── Component: calculator-service
    └── API: commission-api
```

## Patterns por tipo of organización

### Por Funcionalidad of Negocio
```
- user-experience     # UX, Frontend, Personalization
- sales              # CRM, Billing, Contracts
- fulfillment        # Inventory, Logistics
- customer-support   # Tickets, Chat, KB
```

### Por Capabilities (DDD)
```
- identitand           # Users, Auth, Permissions  
- catalog           # Products, Inventory
- ordering          # Cart, Checkout, Orders
- payment           # Billing, Transactions
```

### Por Layers Técnicos
```
- platform          # Infrastructure, Core Services
- integration       # APIs, ETL, Messaging
- presentation      # Web, Mobile, APIs
- analytics         # BI, Reporting, ML
```

## Configuración post-creación

### 1. Definir boundaries dthe dominio
- Establecer **responsabilidades** claras
- Documentar **interfaces** with otros dominios
- Definir **policies** específicas

### 2. Organizar systems and components
- Mover systems existentes al dominio
- Actualizar catalog-info.yaml of systems with `domain:`
- Crear nuevos systems si es necesario

### 3. Governance and compliance
- Establecer **SLAs** to nivthe of dominio
- Definir **securitand policies**
- Configurar **monitoring** agregado

## Domain-Drivin Design (DDD)

### Core Concepts aplicables:
- **Bounded Context** = Domain boundary
- **Ubiquitous Language** = Terminologand consistente
- **Domain Services** = Components dthe domain
- **Anti-corruption Layer** = APIs entre domains

### Ejemplo práctico:
```yaml
# Domain: sales
systems:
  - customer-relationship-system
  - billing-system
  - commission-system

# Cadto system mantiene su bounded context
# APIs definin contratos entre domains
```

## Support

- **Documentation**: Check the generated documentation in `docs/`
- **Issues**: Report problems in the template repositorand  
- **Slack**: #platform-team channthe for support
- **DDD Resources**: [Domain-Drivin Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- **Backstage Docs**: [Domains in Backstage](https://backstage.io/docs/features/software-catalog/system-model)
