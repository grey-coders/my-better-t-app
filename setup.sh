#!/bin/bash

# =============================================================================
# My Better T-App Setup Script
# =============================================================================
# Deletes .env, creates fresh one, starts Docker, then generates Better Auth secret
# =============================================================================

set -e  # Exit on any error

echo " Setting up My Better T-App..."
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo " Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    echo " Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Step 1: Delete existing .env and create fresh one
echo " Deleting existing .env and creating fresh one..."
rm -f .env
cat > .env << EOF
# Frontend Environment Variables
VITE_SERVER_URL=http://localhost:3000

# Backend Environment Variables
PORT=3000
CORS_ORIGIN=http://localhost:3001
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=file:./local.db
BETTER_AUTH_SECRET=placeholder-secret-will-be-replaced
EOF

echo " Created fresh .env file with placeholder secret"

# Step 2: Clean up any existing database directory
echo " Cleaning up database files..."
rm -rf ./apps/server/local.db 2>/dev/null || true

# Step 3: Build and start Docker containers
echo " Building and starting Docker containers..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose up --build -d

# Step 4: Wait for services to start
echo " Waiting for services to start..."
sleep 15

# Step 5: Create database tables
echo " Creating database tables..."
docker compose exec server npx prisma migrate dev --name init --skip-generate

# Step 6: Generate Better Auth secret - FIXED EXTRACTION
echo " Generating Better Auth secret..."
SECRET=$(docker compose exec -T server pnpx @better-auth/cli@latest secret 2>/dev/null | grep "BETTER_AUTH_SECRET=" | cut -d'=' -f2 | tr -d '\r\n')

if [ -z "$SECRET" ]; then
    echo " Failed to generate secret. Check logs: docker compose logs server"
    exit 1
fi

echo " Generated secret: $SECRET"

# Step 7: Update .env file with real secret
echo " Updating .env with real Better Auth secret..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/placeholder-secret-will-be-replaced/$SECRET/" .env
else
    sed -i "s/placeholder-secret-will-be-replaced/$SECRET/" .env
fi

# Step 8: Restart server with new secret
echo " Restarting server with new secret..."
docker compose restart server
sleep 5

echo ""
echo " SUCCESS! Your My Better T-App is now running!"
echo "=============================================="
echo " Frontend: http://localhost:3001"
echo " Backend:  http://localhost:3000"
echo " Prisma Studio: http://localhost:5555"
echo ""
echo " Fresh .env file created with all variables!"
echo " Better Auth secret generated and configured!"
echo " Database tables created successfully!"
echo ""