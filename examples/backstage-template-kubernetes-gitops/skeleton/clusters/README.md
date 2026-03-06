# Cluster Configuration

Place your cluster-specific configurations here. This is typically where you define the entry points for your GitOps controller (e.g., ArgoCD Application sets or Flux Kustomizations).

Example structure:
```
clusters/
  ${{ values.clusterName }}/
    bootstrap.yaml
```
