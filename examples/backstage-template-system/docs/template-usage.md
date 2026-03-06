# System Template Usage Guide

This guide explains how to use the **System** template effectively to define and document systems in your organization.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- Understanding of your organization's architecture and systems
- Knowledge of how components relate to systems
- Required permissions to create catalog entities

### Understanding This Template

**Template Type:** System
**Primary Use Case:** Define logical groupings of related components
**Purpose:** Organize architecture and establish system boundaries

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for "System Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

Fill in the required parameters for your new system definition.

### 3. Post-Creation Documentation

After creating the system, update the documentation to include:

- System architecture overview
- Component relationships
- External interfaces
- Deployment information
- Monitoring and observability

## System Definition

### Architecture Documentation

Document the system's:
- Core components and their responsibilities
- Data flow between components
- External dependencies
- API contracts and interfaces

### Component Registration

Register components with the system by adding the system reference:

```yaml
# component catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: user-api
spec:
  type: service
  owner: backend-team
  system: user-management  # Reference to your system
```

## Best Practices

### 1. Clear Boundaries

- Define what belongs in the system
- Document interfaces with other systems
- Establish ownership and responsibilities

### 2. Documentation

- Keep system documentation current
- Include architecture diagrams
- Document decision rationale

### 3. Component Organization

- Group related components logically
- Avoid overly large systems
- Consider team boundaries

## Resources

- [Backstage System Documentation](https://backstage.io/docs/features/software-catalog/descriptor-format#kind-system)
- [Software Architecture Documentation](../architecture-guidelines.md)
