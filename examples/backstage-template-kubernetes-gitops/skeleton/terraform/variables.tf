variable "cluster_name" {
  description = "The name of the Kubernetes cluster"
  type        = string
  default     = "${{ values.clusterName }}"
}

variable "environment" {
  description = "The environment (e.g., development, production)"
  type        = string
  default     = "${{ values.environment }}"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "owner" {
  description = "Owner of the infrastructure"
  type        = string
  default     = "${{ values.owner }}"
}
