# Kubernetes GitOps Template

This template scaffolds a repository designed for managing Kubernetes clusters using GitOps principles. It provides a structured layout for applications, cluster configurations, and infrastructure components.

## Features

- **Standard GitOps Structure**: Organized folders for `apps`, `clusters`, and `infrastructure`.
- **DevContainer Ready**: Pre-configured development environment with `kubectl`, `helm`, `kustomize`, and other essential tools.
- **Best Practices**: Encourages separation of concerns and declarative configuration.

## Usage

1. Fill in the repository name and description.
2. Select the owning team.
3. Specify the cluster name and environment (e.g., development, production).
4. The template will generate a repository with the necessary folder structure and configuration files.

## Included Tools in DevContainer

- `kubectl`
- `helm`
- `kustomize`
- `argocd` CLI
- `flux` CLI
- `yq`
- `jq`
