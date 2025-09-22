# Use Node.js 22 LTS Alpine for security and small image size
FROM node:22-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory and set ownership
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app

# Switch to non-root user for security
USER node

# Copy package files for dependency caching
COPY --chown=node:node package*.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm@latest

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
COPY --chown=node:node . .
EXPOSE 3000
CMD ["dumb-init", "pnpm", "dev"]

# Build stage
FROM base AS build
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile
COPY --chown=node:node . .
RUN pnpm build

# Production stage with nginx
FROM nginx:alpine AS production

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create nginx user and group if they don't exist
RUN addgroup -g 101 -S nginx || true
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true

# Copy built application
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html \
    && chmod -R 755 /var/cache/nginx /var/log/nginx /var/run /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Use dumb-init to handle signals properly
CMD ["dumb-init", "nginx", "-g", "daemon off;"]