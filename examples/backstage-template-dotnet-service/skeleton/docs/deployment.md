# Deployment

This guide covers deployment options and strategies for the BACKSTAGE_ENTITY_NAME service.

## Overview

BACKSTAGE_ENTITY_NAME is designed to be deployment-ready with multiple deployment options supporting different environments and requirements.

## Prerequisites

### For All Deployments
- .NET 9.0 Runtime (or SDK for development)
- Network access for HTTP traffic
- Sufficient memory and CPU resources

### For Production
- SSL/TLS certificate for HTTPS
- Monitoring and logging infrastructure
- Load balancer (for high availability)
- Database (when replacing in-memory storage)

## Local Development Deployment

### Using .NET CLI

```bash
# Clone the repository
git clone <repository-url>
cd BACKSTAGE_ENTITY_NAME

# Restore dependencies
dotnet restore

# Run in development mode
dotnet run --project src

# The API will be available at http://localhost:8080
```

### Using Dev Container

```bash
# Prerequisites: Docker and VS Code with Dev Containers extension

# Open in VS Code
code .

# Reopen in container (Ctrl+Shift+P -> "Dev Containers: Reopen in Container")
# The container will automatically build and start the application
```

## Production Deployment

### Build for Production

```bash
# Create optimized production build
dotnet publish src -c Release -o ./publish

# Output will be in ./publish directory
```

### Self-Contained Deployment

```bash
# Build with runtime included (no .NET installation required on target)
dotnet publish src -c Release -r linux-x64 --self-contained -o ./publish

# For Windows
dotnet publish src -c Release -r win-x64 --self-contained -o ./publish

# For macOS
dotnet publish src -c Release -r osx-x64 --self-contained -o ./publish
```

## Environment Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ASPNETCORE_ENVIRONMENT` | Runtime environment | `Production` | `Development`, `Staging`, `Production` |
| `ASPNETCORE_URLS` | Server binding URLs | `http://localhost:8080` | `http://0.0.0.0:8080;https://0.0.0.0:8443` |
| `Logging__LogLevel__Default` | Default log level | `Information` | `Debug`, `Information`, `Warning` |

### Configuration Files

#### appsettings.json (Development)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

#### appsettings.Production.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    }
  },
  "AllowedHosts": "yourdomain.com,*.yourdomain.com"
}
```

## Cloud Deployment Options

### Azure App Service

#### Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name myResourceGroup --location "East US"

# Create App Service plan
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux

# Create web app
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myUniqueAppName --runtime "DOTNETCORE:9.0"

# Deploy from local directory
az webapp deployment source config-zip --resource-group myResourceGroup --name myUniqueAppName --src ./publish.zip
```

#### Using GitHub Actions

```yaml
# .github/workflows/deploy-azure.yml
name: Deploy to Azure App Service

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '9.0.x'
    
    - name: Build and publish
      run: |
        dotnet restore
        dotnet build --configuration Release
        dotnet publish src -c Release -o ./publish
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'your-app-name'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./publish
```

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk application
eb init -p "64bit Amazon Linux 2 v2.2.0 running .NET Core" myapp

# Create environment and deploy
eb create production-env

# Deploy updates
eb deploy
```

### Google Cloud Run

```bash
# Build and publish
dotnet publish src -c Release -o ./publish

# Create Dockerfile
# (See Docker section below)

# Build and push container
gcloud builds submit --tag gcr.io/PROJECT-ID/backstage-entity-name

# Deploy to Cloud Run
gcloud run deploy backstage-entity-name \
  --image gcr.io/PROJECT-ID/backstage-entity-name \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/BACKSTAGE_ENTITY_NAME.csproj", "src/"]
RUN dotnet restore "src/BACKSTAGE_ENTITY_NAME.csproj"
COPY . .
WORKDIR "/src/src"
RUN dotnet build "BACKSTAGE_ENTITY_NAME.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "BACKSTAGE_ENTITY_NAME.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BACKSTAGE_ENTITY_NAME.dll"]
```

### Docker Commands

```bash
# Build image
docker build -t backstage-entity-name .

# Run container
docker run -d -p 8080:8080 --name api-container backstage-entity-name

# View logs
docker logs api-container

# Stop container
docker stop api-container
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=http://+:8080
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Optional: Add database service
  # database:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: memes
  #     POSTGRES_USER: api_user
  #     POSTGRES_PASSWORD: secure_password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:
```

### Run with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Kubernetes Deployment

### Deployment Manifest

```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backstage-entity-name
  labels:
    app: backstage-entity-name
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backstage-entity-name
  template:
    metadata:
      labels:
        app: backstage-entity-name
    spec:
      containers:
      - name: api
        image: backstage-entity-name:latest
        ports:
        - containerPort: 8080
        env:
        - name: ASPNETCORE_ENVIRONMENT
          value: "Production"
        - name: ASPNETCORE_URLS
          value: "http://+:8080"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: backstage-entity-name-service
spec:
  selector:
    app: backstage-entity-name
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

### Deploy to Kubernetes

```bash
# Apply deployment
kubectl apply -f k8s-deployment.yml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# View logs
kubectl logs -l app=backstage-entity-name

# Scale deployment
kubectl scale deployment backstage-entity-name --replicas=5
```

## Monitoring and Health Checks

### Health Check Endpoint

The service provides a health check endpoint at `/health`:

```bash
# Check service health
curl http://your-domain.com/health

# Expected response:
{
  "status": "OK",
  "service": "BACKSTAGE_ENTITY_NAME",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### Monitoring Setup

#### Application Insights (Azure)

```csharp
// Add to Program.cs
builder.Services.AddApplicationInsightsTelemetry();
```

#### Custom Metrics

```csharp
// Add custom health checks
builder.Services.AddHealthChecks()
    .AddCheck("database", () => HealthCheckResult.Healthy("Database is responsive"))
    .AddCheck("external_api", () => HealthCheckResult.Healthy("External API is responsive"));
```

## Security Considerations

### Production Security Checklist

- [ ] **HTTPS Only**: Force HTTPS redirects
- [ ] **Security Headers**: Add security headers
- [ ] **CORS**: Restrict CORS to specific origins
- [ ] **Authentication**: Implement authentication/authorization
- [ ] **Secrets Management**: Use secure secret storage
- [ ] **Input Validation**: Validate all inputs
- [ ] **Rate Limiting**: Implement rate limiting
- [ ] **Monitoring**: Set up security monitoring

### HTTPS Configuration

```csharp
// Add to Program.cs for production
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
```

## Performance Optimization

### Production Optimizations

1. **Enable Response Compression**
```csharp
builder.Services.AddResponseCompression();
app.UseResponseCompression();
```

2. **Configure Request Limits**
```csharp
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 30000000;
});
```

3. **Enable Output Caching**
```csharp
builder.Services.AddOutputCache();
app.UseOutputCache();
```

## Troubleshooting

### Common Issues

1. **Port Binding Issues**
   - Check if port is already in use
   - Verify firewall settings
   - Use different port if needed

2. **Memory Issues**
   - Monitor memory usage
   - Adjust container/VM resources
   - Check for memory leaks

3. **Performance Issues**
   - Enable logging to identify bottlenecks
   - Monitor database performance
   - Check network latency

### Debugging Production Issues

```bash
# View application logs
kubectl logs -f deployment/backstage-entity-name

# Check resource usage
kubectl top pods

# Describe pod for detailed information
kubectl describe pod <pod-name>
```

## Backup and Recovery

### Database Backup (When Applicable)

```bash
# PostgreSQL backup
pg_dump -h localhost -U username -d database_name > backup.sql

# Restore
psql -h localhost -U username -d database_name < backup.sql
```

### Configuration Backup

- Store configuration in version control
- Use infrastructure as code (Terraform, ARM templates)
- Maintain environment-specific configurations
- Regular backup of secrets and certificates

This deployment guide provides comprehensive options for deploying BACKSTAGE_ENTITY_NAME in various environments, from local development to production cloud deployments.
