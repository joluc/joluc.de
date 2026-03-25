---
title: "Build"
date: 2026-01-21T17:27:00+01:00
---

Beep Boop Beep. Welcome behind the scene of my website. Some nerdy details about how this website is built, deployed, and verified. I love minimalism but nerdy stuff too. So here we go.

## Integrity

The <mark>SHA256 hash</mark> represents the cryptographic fingerprint of my website. That's how you came here. This number changes with every deployment, providing a way to verify you're seeing the intended version of the website.

**Current Build:**
```
8519e97da47030acb662402ca68c52eb16a693af8b78a3cb55b6be6d620699a4
```

You can verify the hash by running the following command yourself:

```bash
curl -s https://joluc.de | sha256sum
```

I like the SHA256 hash.

## Build Process

Ok, some more details of how this webiste is built.

### Technology Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) (v0.149.1+extended)
- **Hosting**: GitHub Pages / Cloudflare Pages
- **Source Control**: Git
- **CI/CD**: GitHub Actions

### Build Pipeline

1. **Source**: Content written in Markdown, templates in Go HTML
2. **Build**: Hugo generates static HTML/CSS/JS
3. **Hash**: SHA256 calculated from homepage
4. **Deploy**: Static files pushed to hosting
5. **Verify**: Hash updated in footer

### Local Development

```bash
# Clone repository
git clone https://github.com/joluc/joluc.de.git

# Install Hugo
brew install hugo

# Run development server
hugo server -D

# Build for production
hugo --minify
```

## Infrastructure

### Hosting Architecture

- **CDN**: Cloudflare for global distribution
- **SSL/TLS**: Automatic HTTPS with Let's Encrypt
- **DNS**: Cloudflare DNS with DNSSEC
- **Monitoring**: Prometheus metrics from homelab

### Performance

- **Static Generation**: Pre-rendered HTML for instant loading
- **Asset Optimization**: Minified CSS/JS, optimized images
- **Caching**: Aggressive CDN caching with cache busting
- **HTTP/2**: Modern protocol support

### Signals Integration

The homepage features live Prometheus metrics from a demo instance:

- **CPU Usage**: `rate(process_cpu_seconds_total[1m])`
- **Memory Usage**: `process_resident_memory_bytes`
- **Goroutines**: `go_goroutines`

These charts demonstrate real-time observability principles in action.

## Deployment History

Each deployment creates a new SHA256 hash. Here's how to track changes:

```bash
# Check current hash
curl -s https://joluc.de | sha256sum

# Compare with footer value
# If they match, you're seeing the intended build
```

## Source Code

This website is built in the open. You can:

- **View Source**: Right-click → View Page Source
- **Inspect**: Use browser DevTools
- **Verify**: Check SHA256 hash matches footer
- **Contribute**: Suggest improvements via GitHub

## Security

### Content Security

- **Static Site**: No server-side code execution
- **No Database**: No SQL injection vectors
- **No User Input**: Minimal attack surface
- **HTTPS Only**: Encrypted in transit

### Privacy

- **No Tracking**: No Google Analytics or third-party trackers
- **No Cookies**: Session-less architecture
- **No Personal Data**: No data collection
- **Local Storage**: Only for dark mode preference

## Questions?

If you have questions about the build process, infrastructure, or want to verify the integrity of this site, feel free to reach out:

- **Email**: contact@joluc.de
- **GitHub**: [@joluc](https://github.com/joluc)

---

*Last updated: {{ dateFormat "2006-01-02" now }}*
