@echo off
setlocal enabledelayedexpansion

REM =============================================================================
REM My Better T-App Setup Script
REM =============================================================================
REM Deletes .env, creates fresh one, starts Docker, then generates Better Auth secret
REM =============================================================================

echo  Setting up My Better T-App...
echo ==================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Step 1: Delete existing .env and create fresh one
echo  Deleting existing .env and creating fresh one...
if exist .env del .env
(
echo # Frontend Environment Variables
echo VITE_SERVER_URL=http://localhost:3000
echo.
echo # Backend Environment Variables
echo PORT=3000
echo CORS_ORIGIN=http://localhost:3001
echo BETTER_AUTH_URL=http://localhost:3000
echo DATABASE_URL=file:./local.db
echo BETTER_AUTH_SECRET=placeholder-secret-will-be-replaced
) > .env

echo  Created fresh .env file with placeholder secret

REM Step 2: Clean up any existing database directory
echo  Cleaning up database files...
if exist "apps\server\local.db" rmdir /s /q "apps\server\local.db" 2>nul

REM Step 3: Build and start Docker containers
echo  Building and starting Docker containers...
docker compose down --remove-orphans >nul 2>&1
docker compose up --build -d

REM Step 4: Wait for services to start
echo  Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Step 5: Create database tables
echo  Creating database tables...
docker compose exec server npx prisma migrate dev --name init --skip-generate

REM Step 6: Generate Better Auth secret - FIXED EXTRACTION
echo  Generating Better Auth secret...
for /f "tokens=2 delims==" %%i in ('docker compose exec -T server pnpx @better-auth/cli@latest secret 2^>nul ^| findstr "BETTER_AUTH_SECRET="') do (
    set "SECRET=%%i"
)

REM Clean up the secret (remove carriage returns and trailing whitespace)
set "SECRET=!SECRET: =!"
set "SECRET=!SECRET:~0,-1!"

if "!SECRET!"=="" (
    echo  Failed to generate secret. Check logs: docker compose logs server
    pause
    exit /b 1
)

echo  Generated secret: !SECRET!

REM Step 7: Update .env file with real secret
echo  Updating .env with real Better Auth secret...
powershell -Command "(Get-Content .env) -replace 'BETTER_AUTH_SECRET=placeholder-secret-will-be-replaced', 'BETTER_AUTH_SECRET=!SECRET!' | Set-Content .env"

REM Step 8: Restart server with new secret
echo  Restarting server with new secret...
docker compose restart server
timeout /t 5 /nobreak >nul

echo.
echo  SUCCESS! Your My Better T-App is now running!
echo ==============================================
echo  Frontend: http://localhost:3001
echo  Backend:  http://localhost:3000
echo  Prisma Studio: http://localhost:5555
echo.
echo  Fresh .env file created with all variables!
echo  Better Auth secret generated and configured!
echo  Database tables created successfully!
echo.
pause