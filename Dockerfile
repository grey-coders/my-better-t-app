# Base stage for dependencies
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.11.1

# Set working directory
WORKDIR /app

# Copy package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder

# Copy source code
COPY . .

# Build web application
RUN pnpm --filter web build

# Production stage for web
FROM nginx:alpine AS web

# Copy built web files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the web port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]