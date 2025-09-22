# Use Node.js 22 LTS Alpine for security and small image size
FROM node:22-alpine AS base

# Install dumb-init and pnpm globally as root
RUN apk add --no-cache dumb-init && \
    npm install -g pnpm@latest

# Create app directory and set ownership
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app

# Switch to non-root user for security
USER node

# Copy package files for dependency caching
COPY --chown=node:node package*.json ./
COPY --chown=node:node pnpm-lock.yaml* ./

# Development stage
FROM base AS development
ENV NODE_ENV=development
RUN pnpm install
COPY --chown=node:node . .
EXPOSE 3001
CMD ["dumb-init", "pnpm", "start:dev"]

# Build stage
FROM base AS build
ENV NODE_ENV=production
RUN pnpm install
COPY --chown=node:node . .
RUN pnpm build && pnpm prune --prod

# Production stage
FROM node:22-alpine AS production

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /usr/src/app

# Switch to non-root user
USER node

# Copy production dependencies and built application
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --from=build --chown=node:node /usr/src/app/package.json ./

# Expose port
EXPOSE 3001

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "dist/main.js"]