# ${{ values.name }}

${{ values.description }}

## Overview

This repository manages the Kubernetes manifests for the **${{ values.clusterName }}** cluster in the **${{ values.environment }}** environment. It follows GitOps practices.

## Directory Structure

- **apps/**: Contains application manifests (Helm releases, Kustomize overlays).
- **clusters/**: Contains cluster-specific configurations (e.g., ArgoCD Applications, Flux Kustomizations).
- **infrastructure/**: Contains core infrastructure components (e.g., Ingress Controllers, Service Mesh, Monitoring, ArgoCD).

## Development

This repository is configured with a DevContainer that includes all necessary tools:
- `kubectl`
- `helm`
- `kustomize`

To start working, simply open this repository in VS Code and click "Reopen in Container".

## Cluster Information

- **Name**: ${{ values.clusterName }}
- **Environment**: ${{ values.environment }}
- **Owner**: ${{ values.owner }}
