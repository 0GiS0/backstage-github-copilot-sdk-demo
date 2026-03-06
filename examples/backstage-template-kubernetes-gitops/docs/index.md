# Kubernetes GitOps Template Documentation

## Overview

This template helps you bootstrap a GitOps repository for Kubernetes. It is designed to work with tools like ArgoCD or Flux.

## Directory Structure

The generated repository will have the following structure:

```
.
├── .devcontainer/      # Development environment configuration
├── apps/               # Application manifests (Helm releases, Kustomize overlays)
├── clusters/           # Cluster-specific configurations
│   └── [cluster-name]/ # Configuration for the specific cluster
├── infrastructure/     # Infrastructure components (Ingress controllers, Cert-manager, etc.)
├── catalog-info.yaml   # Backstage catalog entity
└── README.md           # Repository documentation
```

## Getting Started

After creating the repository:

1. Clone the repository.
2. Open it in VS Code (it will prompt to reopen in Container).
3. Start adding your Kubernetes manifests to the `apps` or `infrastructure` directories.
4. Configure your GitOps controller (ArgoCD/Flux) to watch this repository.
