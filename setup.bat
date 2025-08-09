@echo off
setlocal enabledelayedexpansion

REM =============================================================================
REM My Better T-App Setup Script
REM =============================================================================
REM Creates global .env file, starts Docker, then generates Better Auth secret
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

REM Step 1: Create global .env file with placeholder secret
echo  Creating global .env file...
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

echo  Created .env file with placeholder secret

REM Step 2: Build and start Docker containers
echo  Building and starting Docker containers...
docker compose down --remove-orphans >nul 2>&1
docker compose up --build -d

REM Step 3: Wait for services to start
echo  Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Step 4: Generate Better Auth secret using running container
echo  Generating Better Auth secret...
set "SECRET="
for /f "delims=" %%i in ('docker compose exec -T server pnpx @better-auth/cli@latest secret 2^>nul') do (
    set "line=%%i"
    echo !line! | findstr /v "npm" >nul
    if !errorlevel! equ 0 (
        set "SECRET=!line!"
    )
)

REM Clean up the secret (remove carriage returns)
set "SECRET=!SECRET: =!"
for /f "delims=" %%i in ("!SECRET!") do set "SECRET=%%i"

if "!SECRET!"=="" (
    echo  Failed to generate secret. Check logs: docker compose logs server
    pause
    exit /b 1
)

REM Step 5: Update .env file with real secret
echo  Updating .env with real Better Auth secret...
powershell -Command "(Get-Content .env) -replace 'BETTER_AUTH_SECRET=placeholder-secret-will-be-replaced', 'BETTER_AUTH_SECRET=!SECRET!' | Set-Content .env"

REM Step 6: Restart server with new secret
echo  Restarting server with new secret...
docker compose restart server
timeout /t 3 /nobreak >nul

echo.
echo  SUCCESS! Your My Better T-App is now running!
echo ==============================================
echo  Frontend: http://localhost:3001
echo  Backend:  http://localhost:3000
echo.
echo  Global .env file created with all variables!
echo  Better Auth secret generated and configured!
echo.
pause