---
title: "What the Logs? — Observations from the Trenches"
date: 2026-01-20T11:16:00+01:00
tags: ["logging", "observability", "opensearch", "otel", "fluent", "sre"]
image: "/images/gallery-image.jpg"
---

# What the Logs? — Observations from the Trenches

> After years of working with logging infrastructure at scale, I've learned that logs are both your <mark>best friend and your worst enemy</mark> at 3 AM.

As a software engineer working in infrastructure at a large company, I spend a lot of time thinking about logs. Not the romantic kind of thinking — more like the "why is this service logging 500GB per day" kind of thinking. Over time, I've gathered some observations and best practices that I thought would be worth sharing.

## Log Conventions

> The first lesson I learned: without conventions, logs become <mark>noise</mark>. And noise at scale is expensive.

In our infrastructure, we process <mark>billions of log lines daily</mark>. Early on, we learned that consistency isn't just nice to have — it's essential for sanity.

### Log Levels

Standard log levels provide a hierarchy of severity:

```
TRACE   - Extremely detailed diagnostic information
DEBUG   - Detailed information for debugging
INFO    - General informational messages
WARN    - Warning messages for potentially harmful situations
ERROR   - Error events that might still allow the application to continue
FATAL   - Severe errors that cause application termination
```

### What I've Learned About Best Practices

These aren't theoretical — they're lessons from production incidents and late-night debugging sessions.

**DO:**
- Use <mark>structured logging</mark> (JSON format) — parsing plain text at scale is a nightmare
- Include <mark>correlation IDs</mark> for request tracing — you'll thank yourself later
- Log at appropriate levels — I've seen services that log everything at INFO
- Include context (user ID, request ID, service name) — future you needs this
- Use consistent timestamp formats (ISO 8601) — timezone bugs are the worst

**DON'T:**
- Log <mark>sensitive data</mark> (passwords, tokens, PII) — compliance teams will find you
- Log excessively in <mark>hot paths</mark> — we once had a service that brought down our log cluster
- Use string concatenation for log messages — structured fields are searchable
- Ignore log rotation and retention — storage isn't free

---

## Types of Logs

> In our infrastructure, we deal with multiple log types, each serving a different purpose.

### Application Logs

Standard application output capturing business logic, errors, and state changes.

```json
{
  "timestamp": "2026-01-20T11:16:40Z",
  "level": "INFO",
  "service": "payment-service",
  "message": "Payment processed successfully",
  "transaction_id": "txn_abc123",
  "amount": 99.99,
  "currency": "EUR"
}
```

### Access Logs

HTTP request/response logs from web servers and proxies.

```
192.168.1.100 - - [20/Jan/2026:11:16:40 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0"
```

### Audit Logs

> **Critical for compliance:** Security-focused logs tracking <mark>who did what, when, and from where</mark>.

```json
{
  "timestamp": "2026-01-20T11:16:40Z",
  "event_type": "user.login",
  "actor": "user@example.com",
  "source_ip": "203.0.113.42",
  "user_agent": "Mozilla/5.0",
  "result": "success",
  "mfa_used": true
}
```

### System Logs

Operating system and infrastructure logs (syslog, systemd journals).

### Security Logs

Authentication attempts, authorization failures, intrusion detection events.

---

## Log Formats

> **My recommendation:** Start with <mark>JSON</mark> and never look back. I've spent too many hours writing regex parsers for custom log formats.

### Plain Text

Simple but hard to parse consistently. I've seen too many variations of this in production.

```
2026-01-20 11:16:40 INFO Payment processed for user 12345
```

### JSON (Recommended)

Structured, parseable, and widely supported.

```json
{
  "timestamp": "2026-01-20T11:16:40Z",
  "level": "INFO",
  "message": "Payment processed",
  "user_id": 12345,
  "service": "payment-service"
}
```

### Logfmt

Key-value pairs, human-readable and machine-parseable.

```
timestamp=2026-01-20T11:16:40Z level=INFO message="Payment processed" user_id=12345
```

### Common Log Format (CLF)

Standard for web server access logs.

```
127.0.0.1 - frank [20/Jan/2026:11:16:40 +0000] "GET /api/users HTTP/1.1" 200 2326
```

### Syslog

Traditional Unix logging format with facility and severity.

```
<34>Jan 20 11:16:40 hostname app[1234]: User login successful
```

---

## Multiline Logs

> **The challenge:** This is where many logging pipelines break. <mark>Stack traces spanning multiple lines</mark> need special handling.

I can't count how many times I've debugged an issue only to find that our log collector split a Java stack trace into <mark>47 separate log entries</mark>.

### The Problem

```
2026-01-20 11:16:40 ERROR Exception occurred
java.lang.NullPointerException: Cannot invoke method on null object
    at com.example.Service.process(Service.java:42)
    at com.example.Controller.handle(Controller.java:28)
    at javax.servlet.http.HttpServlet.service(HttpServlet.java:790)
```

**Without proper handling, each line becomes a separate log entry, breaking context.**

### Solutions

**Pattern-based detection:**
```yaml
# Fluent Bit multiline parser
[PARSER]
    Name   multiline-java
    Format regex
    Regex  /^(?<time>\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/
```

**Start pattern matching:**
```yaml
# Match lines starting with timestamp
multiline.pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
multiline.negate: true
multiline.match: after
```

**Language-specific parsers:**
- Java stack traces
- Python tracebacks
- Go panic dumps

---

## Log Agents

> In our infrastructure, we've used both OTEL and Fluent Bit extensively. Here's what I've learned.

Log agents are the workhorses of your logging pipeline. Choose wisely — you'll be living with this decision for a while.

### OpenTelemetry Collector (OTEL)

> **My current favorite:** OTEL is the direction we're moving for <mark>unified telemetry</mark>.

We started migrating to OTEL last year, and while there's a learning curve, the unified approach to <mark>logs, metrics, and traces</mark> is worth it.

**Architecture:**
```
Receivers → Processors → Exporters
```

**Configuration Example:**

```yaml
receivers:
  filelog:
    include: [/var/log/app/*.log]
    operators:
      - type: json_parser

processors:
  batch:
    timeout: 10s
  resource:
    attributes:
      - key: service.name
        value: payment-service

exporters:
  opensearch:
    endpoint: https://opensearch.example.com:9200
    index: logs-app-{yyyy.MM.dd}

service:
  pipelines:
    logs:
      receivers: [filelog]
      processors: [batch, resource]
      exporters: [opensearch]
```

**Why we chose OTEL:**
- Unified telemetry (logs, metrics, traces) — <mark>one agent to rule them all</mark>
- <mark>Vendor-neutral</mark> — no lock-in
- Active development and community — issues get fixed quickly
- Extensible with custom processors — we've written several

### Fluent Bit / Fluentd

> **Kubernetes workhorse:** Before OTEL, Fluent Bit was our go-to for Kubernetes log collection.

Fluent Bit's tiny memory footprint (<mark>sub-1MB</mark>) makes it perfect for running as a DaemonSet on every node.

**Fluent Bit Configuration:**

```ini
[INPUT]
    Name    tail
    Path    /var/log/containers/*.log
    Parser  docker
    Tag     kube.*

[FILTER]
    Name      kubernetes
    Match     kube.*
    Merge_Log On

[OUTPUT]
    Name  opensearch
    Match *
    Host  opensearch.logging.svc
    Index logs
```

**Fluentd vs Fluent Bit:**

| Feature | Fluentd | Fluent Bit |
|---------|---------|------------|
| Language | Ruby | C |
| Memory footprint | ~40MB | ~650KB |
| Plugins | 500+ | Core plugins |
| Use case | Aggregation | Edge collection |

---

## Audit Logging

> **Non-negotiable:** When compliance asks for audit logs, you better have them. And they better be <mark>immutable</mark>.

Audit logging is where infrastructure meets compliance. In a large company, this isn't optional — it's a <mark>requirement</mark>.

### What We Log in Audit Trails

Based on our compliance requirements (GDPR, SOC 2, and internal policies):
- Authentication events (login, logout, MFA)
- Authorization decisions (access granted/denied)
- Data access (read, write, delete)
- Configuration changes
- Administrative actions
- Security events (failed auth, suspicious activity)

**Compliance standards:**

| Standard | Focus Area |
|----------|------------|
| **GDPR** | Data access and processing |
| **SOC 2** | Security controls and monitoring |
| **PCI DSS** | Payment card data access |
| **HIPAA** | Healthcare data access |

### Audit Log Format

```json
{
  "timestamp": "2026-01-20T11:16:40.123Z",
  "event_id": "evt_abc123",
  "event_type": "data.access",
  "actor": {
    "user_id": "user_123",
    "email": "admin@example.com",
    "ip_address": "203.0.113.42",
    "user_agent": "Mozilla/5.0"
  },
  "resource": {
    "type": "customer_record",
    "id": "cust_456",
    "action": "read"
  },
  "result": "success",
  "metadata": {
    "session_id": "sess_789",
    "request_id": "req_abc",
    "service": "customer-api"
  }
}
```

### OTEL for Audit Logging

OpenTelemetry can handle audit logs through structured log records:

```go
logger := global.Logger("audit")

logger.Emit(ctx, log.Record{
    Severity: log.SeverityInfo,
    Body: log.StringValue("User accessed customer data"),
    Attributes: []log.KeyValue{
        log.String("event.type", "data.access"),
        log.String("actor.user_id", "user_123"),
        log.String("resource.type", "customer_record"),
    },
})
```

### Auditbeat

Elastic's Auditbeat monitors system audit frameworks (auditd on Linux).

**Configuration:**

```yaml
auditbeat.modules:
- module: file_integrity
  paths: [/etc, /usr/bin]

- module: system
  datasets: [login, process, user]

output.opensearch:
  hosts: ["https://opensearch:9200"]
  index: "auditbeat-%{+yyyy.MM.dd}"
```

**Use cases:**
- File integrity monitoring
- Process execution tracking
- User login/logout events
- Package installation monitoring
- Network socket monitoring

---

## OpenSearch for Log Storage

> **Our choice:** We run a large OpenSearch cluster (fork of Elasticsearch) for log storage and search.

Managing <mark>petabytes of logs</mark> taught me a lot about index strategies, retention policies, and query optimization.

### Index Strategy

**Time-based indices:**
```
logs-app-2026.01.20
logs-app-2026.01.21
logs-app-2026.01.22
```

**Why time-based indices?**

We learned this the hard way after trying to delete old logs from a <mark>single massive index</mark>.
- Easy retention management (delete old indices)
- Optimized query performance (time-range queries)
- Efficient rollover and archival

### Index Templates

Define mappings and settings for index patterns:

```json
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "index.lifecycle.name": "logs-policy"
    },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level": { "type": "keyword" },
        "message": { "type": "text" },
        "service": { "type": "keyword" }
      }
    }
  }
}
```

### Index Lifecycle Management (ILM)

Automate index rollover, retention, and deletion:

```json
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": { "max_age": "1d", "max_size": "50gb" }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": { "shrink": { "number_of_shards": 1 } }
      },
      "delete": {
        "min_age": "30d",
        "actions": { "delete": {} }
      }
    }
  }
}
```

### Data Streams

Modern approach for time-series data:

```json
PUT _index_template/logs-template
{
  "index_patterns": ["logs-*"],
  "data_stream": {}
}

PUT _data_stream/logs-app
```

**Why data streams?**
- Automatic index generation
- Built-in rollover
- Simplified management

### Query Examples

**Search for errors in the last hour:**
```json
GET logs-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  }
}
```

**Aggregate errors by service:**
```json
GET logs-*/_search
{
  "size": 0,
  "query": {
    "term": { "level": "ERROR" }
  },
  "aggs": {
    "by_service": {
      "terms": { "field": "service" }
    }
  }
}
```

---

## Putting It All Together

**Our current logging stack:**

```
Applications (JSON logs)
    ↓
Fluent Bit / OTEL Collector (collection)
    ↓
Processing & Enrichment
    ↓
OpenSearch (storage & search)
    ↓
OpenSearch Dashboards (visualization)
```

### Lessons Learned

> **What I wish I knew earlier:** These are the principles that would have saved us <mark>countless hours</mark>.

1. **Use structured logging** (JSON) from the start — <mark>retrofitting is painful</mark>
2. **Include correlation IDs** for distributed tracing — debugging microservices without this is <mark>impossible</mark>
3. **Choose the right log agent** for your environment — we use both OTEL and Fluent Bit
4. **Implement proper multiline handling** for stack traces — don't learn this the hard way
5. **Separate audit logs** from application logs — different retention, different access controls
6. **Use time-based indices** in OpenSearch — makes retention management <mark>trivial</mark>
7. **Implement ILM policies** for retention management — <mark>automate everything</mark>
8. **Monitor your logging pipeline** — it's critical infrastructure that can <mark>fail</mark>
9. **Don't log sensitive data** — PII in logs is a <mark>compliance nightmare</mark>
10. **Test log queries** before you need them in production — <mark>3 AM is not the time to learn query syntax</mark>

---

## Final Thoughts

> Logging is infrastructure. <mark>Treat it like infrastructure</mark>.

After years of working with logs at scale, I've learned that good logging isn't just about collecting data — it's about making that data <mark>useful when you need it most</mark>.

Whether you're using OTEL for unified telemetry, Fluent Bit for lightweight collection, or OpenSearch for powerful search and analytics, the key is **consistency, structure, and intentionality**.

The best logging strategy is the one that helps you sleep better at night. When something breaks at 3 AM (and it will), your logs should tell you <mark>exactly what happened, when, and why</mark>.

> That's the difference between <mark>guessing and knowing</mark>. And in production, guessing is expensive.

**What the logs?** Now you know what I know.
