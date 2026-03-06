# System Template

Template for creating system definitions in Backstage catalog.

## Overview

This Backstage software template helps teams define and document systems within their organization's software architecture, providing a logical grouping of related components and services.

## Template Information

**Template Type:** System
**Primary Purpose:** Define and document software systems
**Usage:** Architectural organization and system documentation

This template generates projects with:

- System definition and documentation
- Component and service groupings
- Architecture documentation
- System boundaries and interfaces
- Complete documentation structure with TechDocs
- Integration with Backstage catalog

## Quick Start

### Using this Template in Backstage

1. **Navigate to Backstage:** Open your Backstage instance
2. **Create Component:** Click "Create Component"
3. **Select Template:** Choose "System Template"
4. **Fill Form:** Complete the required information
5. **Create:** Click "Create" to generate your new system

### Template Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | System name (kebab-case) | ✅ |
| **Description** | System description and purpose | ✅ |
| **Owner** | System owner (team responsible) | ✅ |
| **Domain** | Domain this system belongs to | ✅ |

## Generated Project Structure

```
my-system/
├── README.md                 # System overview and documentation
├── catalog-info.yaml        # Backstage system registration
├── mkdocs.yml               # TechDocs configuration
├── docs/                    # System documentation
│   ├── index.md            # Main system documentation
│   ├── architecture.md     # System architecture overview
│   ├── components.md       # Components and services
│   ├── interfaces.md       # External interfaces
│   ├── deployment.md       # Deployment architecture
│   └── monitoring.md       # Monitoring and observability
└── diagrams/               # Architecture diagrams
    ├── system-context.md   # System context diagrams
    └── component-diagram.md # Component interaction diagrams
```

## Features

### 🏗️ System Architecture

- **Component organization** and relationships
- **System boundary** definitions
- **Interface documentation** with external systems
- **Data flow** and integration patterns
- **Deployment architecture** documentation

### 📚 TechDocs Integration

- **MkDocs configuration** for documentation generation
- **Comprehensive documentation structure** for system knowledge
- **Material theme** for professional documentation appearance
- **Search functionality** across system documentation
- **Automatic integration** with Backstage TechDocs

### 🔧 Catalog Integration

- **System entity** properly registered in Backstage
- **Component relationships** clearly defined
- **Domain association** and hierarchy
- **Team ownership** and responsibility mapping

## Typical Use Cases

This template is ideal for:

- **Microservices architecture** organization
- **System boundary** establishment
- **Cross-team coordination** and communication
- **Architecture documentation** centralization
- **Component relationship** mapping

## Getting Started After Creation

1. **Define system boundaries** and responsibilities
2. **Map existing components** to the system
3. **Document system interfaces** and dependencies
4. **Create architecture diagrams** and documentation
5. **Register components** with system reference in Backstage

## Resources

- [Backstage System Documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-system)
- [Software Architecture Documentation](../architecture-guidelines.md)
