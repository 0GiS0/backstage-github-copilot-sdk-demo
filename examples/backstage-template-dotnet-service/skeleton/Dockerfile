# Intentionally insecure / inefficient Dockerfile for demonstration & scanning
# BAD PRACTICES INCLUDED ON PURPOSE:
# 1. Uses latest tag (no version pin -> supply chain risk)
# 2. Single-stage build (larger image, exposes SDK & build tools)
# 3. Runs as root (no USER directive)
# 4. Copies entire context (potentially secrets, .git, docs)
# 5. Leaves build artifacts, no cleanup
# 6. Exposes port with default (no documentation of intent)
# 7. ARG with a secret-like value baked into final image
# 8. No HEALTHCHECK
# 9. Uses dotnet watch (not suitable for production)
# 10. No explicit CA trust / update, missing immutability best practices
#
# DO NOT USE THIS IN PRODUCTION. A secure multi-stage example is documented in docs/deployment.md

ARG DOTNET_VERSION=9.0
FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS insecure

# Intentionally baking secret-like value (should use build-time secrets or env injection)
ARG FAKE_API_KEY="hardcoded-dev-secret"
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    COMPlus_EnableDiagnostics=0 \
    FAKE_API_KEY=${FAKE_API_KEY}

# Copy EVERYTHING (bad: expands attack surface & image size)
COPY . /app
WORKDIR /app/src

# Restore & build in the same layer (limits layer caching efficiency)
RUN dotnet restore && \
    dotnet build -c Debug --no-restore

# Expose default port
EXPOSE 8080

# Start with dotnet watch (inefficient for container runtime)
ENTRYPOINT ["dotnet", "watch", "run", "--project", "BACKSTAGE_ENTITY_NAME.csproj"]
