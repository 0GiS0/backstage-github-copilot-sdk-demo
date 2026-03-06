resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.cluster_name}-${var.environment}"
  location = var.location
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${var.cluster_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "aks-${var.cluster_name}-${var.environment}"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = var.environment
    Owner       = var.owner
  }
}
