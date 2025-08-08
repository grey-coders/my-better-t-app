# =============================================================================
# DOCKERFILE FOR SERVER BACKEND APPLICATION
# =============================================================================
# Node.js server with Express, tRPC, Prisma, and Better Auth
# Uses tsx for development with hot reloading
# =============================================================================

# Use Node.js Alpine for smaller image size
FROM node:20-alpine

# Install system dependencies needed for Prisma and SQLite
# sqlite and openssl are required for Prisma with SQLite database
RUN apk add --no-cache sqlite openssl libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm package manager
RUN npm install -g pnpm

# Copy package files first for better Docker layer caching
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies
RUN pnpm install

# Copy Prisma schema first to generate client
COPY prisma ./prisma

# Generate Prisma client
# This creates the client code needed for database operations
RUN pnpm prisma generate

# Copy all source code and configuration files
COPY . .

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port 3000 (server default port)
EXPOSE 3000

# Start development server with tsx watch for hot reloading
# Environment variables will be provided by docker-compose
CMD ["pnpm", "run", "dev"]
