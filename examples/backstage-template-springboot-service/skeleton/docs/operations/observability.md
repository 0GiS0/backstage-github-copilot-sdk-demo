# Observability

## Spring Actuator Endpoints

The service exposes several actuator endpoints for monitoring:

| Endpoint | Description |
|----------|-------------|
| `/actuator/health` | Health check status |
| `/actuator/info` | Application information |
| `/actuator/metrics` | Application metrics |
| `/actuator/prometheus` | Prometheus format metrics |

## Health Checks

### Basic Health

```bash
curl http://localhost:8080/actuator/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

### Kubernetes Probes

- **Liveness**: `/actuator/health/liveness`
- **Readiness**: `/actuator/health/readiness`

## Metrics

### Key Metrics

| Metric | Description |
|--------|-------------|
| `http.server.requests` | HTTP request metrics |
| `jvm.memory.used` | JVM memory usage |
| `jvm.gc.pause` | Garbage collection pauses |
| `hikaricp.connections.active` | Database connections |

### Prometheus Integration

```yaml
# prometheus.yml scrape config
scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

## Logging

### Log Levels

Configure in `application.yml`:

```yaml
logging:
  level:
    root: INFO
    com.example.demo: DEBUG
    org.springframework.web: INFO
```

### Structured Logging

The service uses SLF4J with Logback. Logs include:

- Timestamp
- Log level
- Thread name
- Logger name
- Message

### Log Aggregation

For production, configure log shipping to:

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Grafana Loki
- Splunk

## Tracing

For distributed tracing, add Micrometer Tracing:

```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>
```

## Dashboard

Create a Grafana dashboard with panels for:

1. Request rate and latency
2. Error rate
3. JVM memory and GC
4. Database connection pool
5. Custom business metrics
