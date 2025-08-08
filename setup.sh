#!/bin/bash

# =============================================================================
# My Better T-App Setup Script
# =============================================================================
# Creates global .env file, starts Docker, then generates Better Auth secret
# =============================================================================

set -e  # Exit on any error

echo " Setting up My Better T-App..."
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo " Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo " Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Step 1: Create global .env file with placeholder secret
echo " Creating global .env file..."
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

echo " Created .env file with placeholder secret"

# Step 2: Build and start Docker containers
echo " Building and starting Docker containers..."
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose up --build -d

# Step 3: Wait for services to start
echo " Waiting for services to start..."
sleep 10

# Step 4: Generate Better Auth secret using running container
echo " Generating Better Auth secret..."
SECRET=$(docker-compose exec -T server pnpx @better-auth/cli@latest secret 2>/dev/null | grep -v "npm" | tail -1 | tr -d '\r\n')

if [ -z "$SECRET" ]; then
    echo " Failed to generate secret. Check logs: docker-compose logs server"
    exit 1
fi

# Step 5: Update .env file with real secret
echo " Updating .env with real Better Auth secret..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/placeholder-secret-will-be-replaced/$SECRET/" .env
else
    sed -i "s/placeholder-secret-will-be-replaced/$SECRET/" .env
fi

# Step 6: Restart server with new secret
echo " Restarting server with new secret..."
docker-compose restart server
sleep 3

echo ""
echo " SUCCESS! Your My Better T-App is now running!"
echo "=============================================="
echo " Frontend: http://localhost:3001"
echo " Backend:  http://localhost:3000"
echo ""
echo " Global .env file created with all variables!"
echo " Better Auth secret generated and configured!"
