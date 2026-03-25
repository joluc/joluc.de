# Build stage
FROM hugomods/hugo:0.146.0 AS builder

WORKDIR /src
COPY . .

RUN hugo --minify

# Production stage
FROM nginx:1.27-alpine

COPY --from=builder /src/public /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
