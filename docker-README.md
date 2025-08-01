# Docker Setup for My Better T App (Web Only)

This document provides instructions for running the web application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Building and Running

### Using Docker Compose (Recommended)

To build and start the web application:

```bash
# Build the application locally first
pnpm install
pnpm build

# Start the Docker container
docker-compose up -d
```

This will start the web application in detached mode.

To view logs:

```bash
docker-compose logs -f
```

To stop the container:

```bash
docker-compose down
```

### Using Docker Directly

If you prefer to build and run the container separately:

1. Build the image:
   ```bash
   docker build --target web -t my-better-t-app-web .
   ```

2. Run the web application:
   ```bash
   docker run -d -p 80:80 --name my-better-t-app-web my-better-t-app-web
   ```

## Accessing the Application

- Web application: http://localhost

## Important Notes

- This Docker setup only includes the web frontend, not the backend server.
- API requests to `/api/*` endpoints will return a 404 error with a JSON message.
- For a complete application with backend functionality, you would need to run the server separately.

## Development Workflow

For development, it's recommended to use the local development setup with `pnpm dev` instead of Docker. The Docker setup is primarily intended for production or testing production-like environments.

## Troubleshooting

### Container Fails to Start

Check the logs for more information:

```bash
docker logs my-better-t-app-web
```

### Rebuilding After Changes

If you make changes to the application, you need to rebuild the Docker image:

```bash
docker-compose build
# or
docker-compose up -d --build