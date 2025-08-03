# Development Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

## Quick Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-better-t-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   **For the server (apps/server):**

   ```bash
   cd apps/server
   cp .env.example .env
   ```

   **For the web app (apps/web):**

   ```bash
   cd apps/web
   cp .env.example .env
   ```

4. **Generate a better auth secret key**

   ```bash
   # Generate the secret key for your Better Auth instance
   pnpx @better-auth/cli@latest secret
   ```

   **Alternative:** You can generate the secret key by clicking the **Generate Secret** button on the [Better Auth website](https://www.better-auth.com/docs/installation#set-environment-variables).

   **IMPORTANT:** Copy this value and replace `your-secret-key-here-replace-with-strong-random-string` in `apps/server/.env`

5. **Set up the database**

   ```bash
   cd apps/server
   create an sqlite db file and name it local.db
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start the development servers**

   ```bash
   # From the root directory
   pnpm dev
   ```

   This will start:
   - Backend server on http://localhost:3000
   - Frontend web app on http://localhost:3001

## Environment Variables

### Server (apps/server/.env)

- `PORT`: Server port (default: 3000)
- `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:3001)
- `BETTER_AUTH_SECRET`: Secret key for Better Auth (REQUIRED - generate a strong random string)
- `BETTER_AUTH_URL`: Backend URL for Better Auth (default: http://localhost:3000)
- `DATABASE_URL`: Database connection string (default: file:./local.db for SQLite)

### Web App (apps/web/.env)

- `VITE_SERVER_URL`: Backend server URL (default: http://localhost:3000)

## Production Setup

For production, update the environment variables accordingly:

- Generate a strong `BETTER_AUTH_SECRET`
- Use a production database (PostgreSQL, MySQL) instead of SQLite
- Update `CORS_ORIGIN` to your frontend domain
- Update `BETTER_AUTH_URL` to your backend domain
- Update `VITE_SERVER_URL` to your backend domain

## Troubleshooting

### Database Issues

If you encounter database-related errors:

```bash
cd apps/server
rm -f local.db  # Remove the existing database file
npx prisma migrate reset  # Reset and recreate the database
npx prisma generate  # Regenerate Prisma client
```

### Port Conflicts

If ports 3000 or 3001 are in use, update the following:

- Server port: Change `PORT` in `apps/server/.env`
- Web app port: Update the dev script in `apps/web/package.json`
- Update `CORS_ORIGIN` and `VITE_SERVER_URL` accordingly
