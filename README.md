# joluc.de

Personal website and blog about cloud engineering, observability, and software development.

## Features

- Cloud engineering insights and tutorials
- Observability and monitoring best practices
- Live Prometheus metrics dashboard
- Blog with technical articles
- Portfolio section

## Local Development

```bash
# Start development server
hugo server

# Build for production
hugo --minify
```

## Deployment

### Docker

```bash
docker build -t joluc-de .
docker run -p 8080:80 joluc-de
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## Tech Stack

- [Hugo](https://gohugo.io/) - Static site generator
- [Chart.js](https://www.chartjs.org/) - Charts for metrics visualization
- nginx - Production web server
- Kubernetes - Container orchestration

## License

MIT
