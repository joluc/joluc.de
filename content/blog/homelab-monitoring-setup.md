---
title: "My Homelab Monitoring Setup: From Chaos to Clarity"
date: 2024-03-12T14:30:00+00:00
tags: ["homelab", "monitoring", "kubernetes", "prometheus", "grafana"]
image: "/images/gallery-image.jpg"
---

# My Homelab Monitoring Setup: From Chaos to Clarity

Running a homelab is like having a mini data center in your house. It's exciting, educational, and sometimes overwhelming. After months of trial and error, I've finally built a monitoring setup that gives me complete visibility into my infrastructure. Let me share the journey and the lessons learned.

## The Challenge: Monitoring Distributed Chaos

My homelab started simple—just a few VMs running basic services. But as I added more services, containers, and complexity, I quickly realized I needed proper monitoring. The challenge wasn't just technical; it was about understanding what to monitor and why.

### The Evolution of My Setup

**Phase 1: Basic Monitoring**
- Simple uptime checks
- Basic resource monitoring
- Manual log checking

**Phase 2: Centralized Logging**
- ELK stack setup
- Log aggregation
- Basic dashboards

**Phase 3: Comprehensive Observability**
- Prometheus + Grafana
- Distributed tracing
- Custom dashboards
- Automated alerting

## Current Infrastructure

### Hardware Stack

- **Main Server**: Intel NUC with 32GB RAM, 1TB NVMe
- **Storage**: Synology NAS with 4TB RAID
- **Network**: Ubiquiti Dream Machine Pro
- **Backup**: Raspberry Pi 4 for critical services

### Software Stack

```yaml
# Kubernetes cluster overview
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
        - name: storage
          mountPath: /prometheus
      volumes:
      - name: config
        configMap:
          name: prometheus-config
      - name: storage
        persistentVolumeClaim:
          claimName: prometheus-storage
```

## Monitoring Architecture

### Metrics Collection

I use Prometheus to collect metrics from various sources:

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Kubernetes cluster metrics
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  # Node metrics
  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  # Pod metrics
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

### Custom Dashboards

I've created several custom dashboards for different aspects of my homelab:

#### Infrastructure Overview
- CPU, memory, and disk usage across all nodes
- Network traffic and latency
- Storage utilization and I/O

#### Application Metrics
- Service health and response times
- Error rates and status codes
- Business metrics (user registrations, API calls)

#### Security Monitoring
- Failed login attempts
- Unusual network traffic
- Certificate expiration dates

```json
{
  "dashboard": {
    "title": "Homelab Infrastructure",
    "panels": [
      {
        "title": "Node CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - (avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "{{instance}}"
          }
        ]
      }
    ]
  }
}
```

## Log Management

### Centralized Logging with Loki

I use Grafana Loki for log aggregation, which is much more lightweight than Elasticsearch for my use case:

```yaml
# loki-config.yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /tmp/loki/index
  filesystem:
    directory: /tmp/loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

### Log Parsing and Analysis

I use Promtail to collect logs from various sources:

```yaml
# promtail-config.yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_loki_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_loki_io_path]
        action: replace
        target_label: __path__
        regex: (.+)
```

## Distributed Tracing

### Jaeger Setup

For distributed tracing, I use Jaeger to track requests across my microservices:

```yaml
# jaeger-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 16686
        - containerPort: 14268
        env:
        - name: COLLECTOR_OTLP_ENABLED
          value: "true"
```

### Application Instrumentation

I instrument my applications with OpenTelemetry:

```go
// Example Go application with tracing
package main

import (
    "context"
    "net/http"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/trace"
)

func main() {
    tracer := otel.Tracer("my-service")

    http.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
        ctx, span := tracer.Start(r.Context(), "get-users")
        defer span.End()

        // Process request...
        span.SetAttributes(
            attribute.String("http.method", r.Method),
            attribute.String("http.url", r.URL.String()),
        )

        w.WriteHeader(http.StatusOK)
    })

    http.ListenAndServe(":8080", nil)
}
```

## Alerting Strategy

### Alert Categories

I've organized my alerts into several categories:

1. **Critical Infrastructure** - Service down, disk full, high CPU
2. **Application Health** - High error rates, slow response times
3. **Security** - Failed logins, unusual traffic patterns
4. **Maintenance** - Certificate expiration, backup failures

### Alert Rules

```yaml
# alert-rules.yaml
groups:
- name: infrastructure
  rules:
  - alert: HighCPUUsage
    expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage on {{ $labels.instance }}"
      description: "CPU usage is above 80% for more than 5 minutes"

  - alert: DiskSpaceLow
    expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 85
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Disk space low on {{ $labels.instance }}"
      description: "Disk usage is above 85% for more than 5 minutes"

- name: applications
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High error rate for {{ $labels.service }}"
      description: "Error rate is above 10% for more than 2 minutes"
```

## Lessons Learned

### Start Simple, Scale Gradually

Don't try to monitor everything at once. Start with the most critical services and gradually expand your monitoring coverage.

### Context is Everything

Always include context in your metrics and logs. A metric without context is just a number.

### Automation is Key

Manual monitoring doesn't scale. Invest time in automated alerting and dashboard generation.

### Documentation Matters

Document your monitoring setup, alert procedures, and runbooks. Future you will thank you.

## Tools and Techniques

### Prometheus Querying

```promql
# Top 10 services by request rate
topk(10, sum(rate(http_requests_total[5m])) by (service))

# Memory usage by container
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100

# Network errors
rate(container_network_receive_errors_total[5m])
```

### Log Analysis

```logql
# Error rate by service
sum(rate({job="api"} |= "ERROR" [5m])) by (service)

# Top error messages
sum(count_over_time({job="api"} |= "ERROR" [1h])) by (message)
```

## The Future of My Homelab

I'm constantly evolving my setup. Next on my list:

- **Service mesh** with Istio for better observability
- **eBPF-based monitoring** for kernel-level insights
- **AI-powered anomaly detection** for automated problem detection
- **Chaos engineering** to test system resilience

## Conclusion

Building a comprehensive monitoring setup for a homelab is a journey of continuous improvement. The key is to start somewhere and iterate. My current setup gives me complete visibility into my infrastructure, but I'm always looking for ways to improve.

The most important lesson I've learned is that monitoring isn't just about collecting data—it's about understanding your systems and using that understanding to make them better.

---

*What's your homelab monitoring setup like? I'd love to hear about your experiences, favorite tools, and lessons learned. Let's share knowledge and build better systems together!*
