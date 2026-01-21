# Build stage
FROM hugomods/hugo:latest AS builder

WORKDIR /src
COPY . .

# Build the site
RUN hugo --minify

# Serve stage
FROM nginx:alpine

# Copy built site from builder
COPY --from=builder /src/public /usr/share/nginx/html

# Copy custom nginx config if needed (optional, using default for now, but ready for extension)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
