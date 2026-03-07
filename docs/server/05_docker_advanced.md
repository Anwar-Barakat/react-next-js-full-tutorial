# Advanced Docker Guide

A comprehensive deep-dive into Dockerfiles, Docker Compose, networking, production best practices, and container orchestration for full-stack developers.

---

## Table of Contents

1. [Dockerfile Fundamentals](#1-dockerfile-fundamentals)
2. [Dockerfile Instructions (FROM, RUN, COPY, CMD, ENTRYPOINT)](#2-dockerfile-instructions-from-run-copy-cmd-entrypoint)
3. [WORKDIR, EXPOSE, ENV, and ARG](#3-workdir-expose-env-and-arg)
4. [Multi-Stage Builds](#4-multi-stage-builds)
5. [.dockerignore File](#5-dockerignore-file)
6. [What is Docker Compose?](#6-what-is-docker-compose)
7. [Docker Compose File Structure](#7-docker-compose-file-structure)
8. [Services, Volumes, and Networks](#8-services-volumes-and-networks)
9. [Docker Compose for Laravel + MySQL + Redis + Nginx](#9-docker-compose-for-laravel--mysql--redis--nginx)
10. [Docker Compose for Next.js + PostgreSQL](#10-docker-compose-for-nextjs--postgresql)
11. [Volumes and Data Persistence](#11-volumes-and-data-persistence)
12. [Docker Networking (Bridge, Host, None)](#12-docker-networking-bridge-host-none)
13. [Docker Registry and Docker Hub](#13-docker-registry-and-docker-hub)
14. [Production Best Practices](#14-production-best-practices)
15. [Health Checks](#15-health-checks)
16. [Common Docker Commands Cheat Sheet](#16-common-docker-commands-cheat-sheet)
17. [Debugging Containers](#17-debugging-containers)
18. [Docker vs Kubernetes](#18-docker-vs-kubernetes)
19. [Common Docker Interview Questions](#19-common-docker-interview-questions)

---

> **Prerequisite:** This guide assumes you already understand what Docker is, how it differs from virtual machines, and the difference between images and containers. For those fundamentals, see [CI/CD & Docker Guide](./02_cicd_docker.md).

---

## 1. Dockerfile Fundamentals

A **Dockerfile** is a plain text file that contains a set of instructions for building a Docker image. Think of it as a recipe: each instruction is a step, and the final result is a fully prepared image ready to run as a container.

> **Analogy:** If a Docker image is a frozen meal, the Dockerfile is the recipe card. It tells Docker exactly what ingredients to gather, how to prepare them, and how to package the final product.

**How `docker build` works:**

When you run `docker build`, Docker reads the Dockerfile and executes each instruction **layer by layer**. Every instruction (like `RUN`, `COPY`, or `ADD`) creates a new read-only layer on top of the previous one. These layers are stacked to form the final image.

```bash
# Build an image from a Dockerfile in the current directory
docker build -t myapp:1.0 .

# Build with a specific Dockerfile
docker build -f Dockerfile.prod -t myapp:prod .

# Build with no cache (forces fresh build)
docker build --no-cache -t myapp:1.0 .
```

**What is Build Context?**

The `.` at the end of `docker build -t myapp .` is the **build context** -- the set of files and directories Docker sends to the Docker daemon for building the image. Everything in that directory (and subdirectories) gets packaged up and sent to the daemon.

- If your build context is 2 GB of node_modules, Docker sends all 2 GB to the daemon, even if you never use those files
- This is why `.dockerignore` is critical (covered in Section 5)
- The build context determines what files `COPY` and `ADD` can access

**Layer Caching and Why Instruction Order Matters:**

Docker caches each layer. If an instruction hasn't changed since the last build, Docker reuses the cached layer instead of rebuilding it. But here is the catch: **if any layer changes, all subsequent layers are rebuilt**.

This means instruction order is crucial for fast builds:

```dockerfile
# BAD ORDER - copying source code before installing dependencies
# Any code change invalidates the npm install cache
COPY . /app
RUN npm install

# GOOD ORDER - install dependencies first, then copy source code
# Dependencies are only reinstalled when package.json changes
COPY package.json package-lock.json /app/
RUN npm install
COPY . /app
```

**Why does this matter?**

- Your `package.json` rarely changes, but your source code changes constantly
- By copying `package.json` first, the `npm install` layer stays cached across most builds
- This can save minutes on every build

**In short:** A Dockerfile is a step-by-step recipe for creating images. Docker builds layer by layer, caches each layer, and rebuilds from the point of change. Always order instructions from least-changing to most-changing for faster builds.

---

## 2. Dockerfile Instructions (FROM, RUN, COPY, CMD, ENTRYPOINT)

These are the core instructions you will use in nearly every Dockerfile.

### FROM -- The Base Image

Every Dockerfile starts with `FROM`. It sets the base image your application builds upon.

```dockerfile
# Full image - largest, includes everything
FROM node:20

# Slim - smaller, removed docs and uncommon packages
FROM node:20-slim

# Alpine - smallest, uses musl libc instead of glibc
FROM node:20-alpine

# PHP variants
FROM php:8.3-fpm
FROM php:8.3-fpm-alpine
```

**Choosing the right base image:**

- **Full (`node:20`)** -- use for development or when you need system tools. Largest size (~900 MB+)
- **Slim (`node:20-slim`)** -- good balance of size and compatibility. Medium size (~200 MB)
- **Alpine (`node:20-alpine`)** -- smallest footprint (~50 MB). Uses `apk` instead of `apt`. Some packages may not compile due to musl libc

### RUN -- Execute Commands

`RUN` executes commands during the build process. Each `RUN` creates a new layer.

```dockerfile
# BAD - each RUN creates a separate layer
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# GOOD - combine commands with && to create a single layer
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

Combining commands with `&&` reduces the number of layers and keeps the image smaller. Always clean up package manager caches in the same `RUN` instruction.

### COPY vs ADD

Both copy files from the build context into the image, but they behave differently.

```dockerfile
# COPY - straightforward file/directory copy
COPY package.json /app/package.json
COPY src/ /app/src/

# ADD - same as COPY, but also:
# 1. Auto-extracts .tar.gz archives
# 2. Can download from URLs (not recommended)
ADD archive.tar.gz /app/
ADD https://example.com/file.txt /app/   # Don't do this
```

**Best practice:** Always use `COPY` unless you specifically need tar extraction. `ADD` has unexpected behaviors that can surprise you. If you need to download files, use `RUN curl` or `RUN wget` instead.

### CMD vs ENTRYPOINT -- The Critical Difference

This is one of the most misunderstood concepts in Docker. Both define what runs when a container starts, but they serve different purposes.

```dockerfile
# CMD - the default command (can be overridden)
CMD ["node", "server.js"]

# ENTRYPOINT - the fixed executable (cannot be easily overridden)
ENTRYPOINT ["node", "server.js"]
```

| Feature | CMD | ENTRYPOINT |
|---------|-----|------------|
| **Purpose** | Default command/arguments | Fixed executable |
| **Override** | Easily overridden by `docker run` args | Requires `--entrypoint` flag to override |
| **Multiple** | Last CMD wins | Last ENTRYPOINT wins |
| **Use case** | Default behavior that users may change | Container should always run this |
| **Combined** | Provides default args to ENTRYPOINT | Defines the executable |

**Common pattern -- using them together:**

```dockerfile
# ENTRYPOINT sets the executable
# CMD provides default arguments
ENTRYPOINT ["node"]
CMD ["server.js"]

# docker run myapp              → runs: node server.js
# docker run myapp app.js       → runs: node app.js (CMD overridden)
```

### Exec Form vs Shell Form

```dockerfile
# Exec form (preferred) - runs directly, no shell processing
CMD ["node", "server.js"]
ENTRYPOINT ["python", "app.py"]

# Shell form - runs through /bin/sh -c, supports variable expansion
CMD node server.js
ENTRYPOINT python app.py
```

**Always prefer exec form** because:
- Signals (like SIGTERM for graceful shutdown) are sent directly to the process
- Shell form wraps the process in `/bin/sh -c`, which may not forward signals
- Exec form is more predictable and explicit

### Practical Dockerfile: PHP/Laravel Application

```dockerfile
FROM php:8.3-fpm-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first (for caching)
COPY composer.json composer.lock ./

# Install dependencies (no dev for production)
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application code
COPY . .

# Generate optimized autoload
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
```

### Practical Dockerfile: Node.js/Next.js Application

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
```

**In short:** `FROM` sets your base, `RUN` executes build commands (combine with `&&`), `COPY` is preferred over `ADD`, `CMD` provides defaults that can be overridden, and `ENTRYPOINT` locks the executable. Always use exec form for `CMD` and `ENTRYPOINT`.

---

## 3. WORKDIR, EXPOSE, ENV, and ARG

These instructions configure the environment inside your Docker image.

### WORKDIR -- Set the Working Directory

`WORKDIR` sets the working directory for all subsequent instructions (`RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`). If the directory does not exist, Docker creates it automatically.

```dockerfile
# Set working directory
WORKDIR /app

# All subsequent commands run from /app
COPY package.json .       # copies to /app/package.json
RUN npm install            # runs in /app
CMD ["npm", "start"]       # runs in /app

# You can use WORKDIR multiple times
WORKDIR /app
WORKDIR src                # now in /app/src
WORKDIR ../config          # now in /app/config
```

**Best practice:** Always use `WORKDIR` instead of `RUN cd /some/path && command`. `WORKDIR` persists across instructions; `cd` inside `RUN` only applies to that single instruction.

### EXPOSE -- Document the Port

`EXPOSE` tells Docker (and humans reading the Dockerfile) which port the application listens on. It does **not** actually publish the port -- you still need `-p` when running the container.

```dockerfile
# Document that the app listens on port 3000
EXPOSE 3000

# You can expose multiple ports
EXPOSE 80
EXPOSE 443

# Expose with protocol
EXPOSE 8080/tcp
EXPOSE 8080/udp
```

**Important:** `EXPOSE` is purely informational. To actually make the port accessible from the host, use `docker run -p 3000:3000`.

### ENV -- Environment Variables

`ENV` sets environment variables that persist in the running container. They are available both during build time and at runtime.

```dockerfile
# Set environment variables
ENV NODE_ENV=production
ENV APP_PORT=3000

# Use in subsequent instructions
RUN echo "Building for $NODE_ENV"

# Multiple variables (legacy syntax, still works)
ENV APP_NAME="My App" \
    APP_VERSION="1.0.0" \
    APP_DEBUG=false
```

### ARG -- Build-time Variables

`ARG` defines variables that are only available during the build process. They do **not** persist in the final image.

```dockerfile
# Define a build argument with a default value
ARG NODE_VERSION=20

# Use it in FROM
FROM node:${NODE_VERSION}-alpine

# Define more build arguments
ARG BUILD_ENV=production
ARG API_URL

# Use in RUN
RUN echo "Building for environment: $BUILD_ENV"
```

```bash
# Pass build arguments at build time
docker build --build-arg NODE_VERSION=18 --build-arg API_URL=https://api.example.com -t myapp .
```

### ENV vs ARG Comparison

| Feature | ENV | ARG |
|---------|-----|-----|
| **Available at** | Build time + Runtime | Build time only |
| **Scope** | Persists in the image and containers | Only during `docker build` |
| **Persistence** | Stored in the image layers | Not stored in the final image |
| **Override** | `docker run -e VAR=value` | `docker build --build-arg VAR=value` |
| **Use case** | App config (NODE_ENV, PORT) | Build config (version, environment) |
| **Security** | Visible in running container | Not in final image (but visible in build history) |

**Important security note:** Neither `ENV` nor `ARG` should be used for secrets. Build arguments are visible in `docker history`. Use Docker secrets or mount secrets at runtime instead.

### LABEL -- Image Metadata

`LABEL` adds metadata to the image. It does not affect the image behavior but helps with organization and discovery.

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0"
LABEL description="Production API server"
LABEL org.opencontainers.image.source="https://github.com/user/repo"

# Multiple labels in one instruction
LABEL maintainer="dev@example.com" \
      version="1.0" \
      description="Production API server"
```

```bash
# View labels on an image
docker inspect --format='{{json .Config.Labels}}' myapp:1.0
```

**In short:** Use `WORKDIR` to set directories (not `cd`), `EXPOSE` to document ports (does not publish them), `ENV` for runtime config, `ARG` for build-time variables, and `LABEL` for metadata. Remember that `ARG` values disappear after the build; `ENV` values persist.

---

## 4. Multi-Stage Builds

Multi-stage builds are one of Docker's most powerful features for creating lean production images. They allow you to use multiple `FROM` instructions in a single Dockerfile, where each `FROM` begins a new build stage.

> **Analogy:** Imagine building a house. You need scaffolding, cranes, and tools during construction, but you don't keep them inside the finished house. Multi-stage builds work the same way -- you use heavy tools in the build stage, then copy only the finished product to a clean runtime stage.

**Why multi-stage builds matter:**

- **Smaller images** -- the final image only contains what the app needs to run, not build tools
- **Better security** -- no compilers, package managers, or source code in production
- **Simpler Dockerfiles** -- no need for complex scripts to clean up build artifacts

### Node.js Multi-Stage Build Example

```dockerfile
# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Copy only what we need from the build stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"]
```

### Next.js Standalone Multi-Stage Build

Next.js has a built-in `standalone` output mode that makes multi-stage builds even more efficient:

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Enable standalone output in next.config.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Copy only the standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER appuser

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Image Size Comparison

| Approach | Image Size |
|----------|-----------|
| Single stage (full node + all deps + source) | ~1.2 GB |
| Single stage with cleanup scripts | ~800 MB |
| Multi-stage (build + runtime) | ~200 MB |
| Multi-stage with standalone output | ~120 MB |
| Multi-stage with Alpine + standalone | ~80 MB |

The difference is dramatic. A 1.2 GB image reduced to 80 MB means faster deploys, less bandwidth, less storage, and a smaller attack surface.

**In short:** Multi-stage builds let you separate the build environment from the runtime environment. Use a heavy image with all build tools in the first stage, then copy only the compiled output to a minimal final image. This dramatically reduces image size and improves security.

---

## 5. .dockerignore File

The `.dockerignore` file tells Docker which files and directories to exclude from the build context. It works just like `.gitignore` but for Docker builds.

**Why you need a .dockerignore:**

- **Reduces build context size** -- Docker does not send excluded files to the daemon, making builds faster
- **Excludes secrets** -- prevents `.env` files, SSH keys, and credentials from accidentally ending up in the image
- **Avoids conflicts** -- prevents host `node_modules` from overwriting container dependencies
- **Smaller images** -- unnecessary files don't bloat your image

### .dockerignore for Laravel

```bash
# Version control
.git
.gitignore

# Dependencies (installed inside container)
vendor/
node_modules/

# Environment files (contain secrets)
.env
.env.*
!.env.example

# IDE and editor files
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Testing
tests/
phpunit.xml
.phpunit.result.cache

# CI/CD
.github/
.gitlab-ci.yml

# Docker files (avoid recursive context)
docker-compose*.yml
Dockerfile*

# Documentation
docs/
README.md
CHANGELOG.md

# Storage (logs, cache - generated at runtime)
storage/logs/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*

# Build artifacts
public/hot
public/storage
```

### .dockerignore for Next.js

```bash
# Version control
.git
.gitignore

# Dependencies (installed inside container)
node_modules/

# Environment files
.env
.env.local
.env.*.local

# Build output (rebuilt inside container)
.next/
out/
build/

# IDE and editor files
.idea/
.vscode/
*.swp

# OS files
.DS_Store
Thumbs.db

# Testing
__tests__/
coverage/
jest.config.*
cypress/
playwright/

# CI/CD
.github/
.gitlab-ci.yml

# Docker files
docker-compose*.yml
Dockerfile*
.dockerignore

# Documentation
docs/
README.md
*.md

# Storybook
.storybook/
storybook-static/

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

**In short:** Always create a `.dockerignore` in your project root. It keeps the build context small, prevents secrets from leaking into images, and makes builds significantly faster. Think of it as a mandatory companion to your Dockerfile.

---

## 6. What is Docker Compose?

**Docker Compose** is a tool for defining and running **multi-container** Docker applications. Instead of running multiple `docker run` commands with complex flags, you define your entire application stack in a single YAML file.

> **Analogy:** If a Dockerfile is the recipe for one dish, Docker Compose is the full dinner menu. It describes all the dishes (services), how they should be prepared, and how they relate to each other.

**Why Docker Compose?**

Most real applications need more than one container. A typical web app might need:
- An application server (Node.js or PHP-FPM)
- A web server (Nginx)
- A database (MySQL or PostgreSQL)
- A cache layer (Redis)
- A queue worker

Without Compose, you would need to run each container separately, create networks manually, and manage volumes by hand. Compose handles all of this with a single command.

```bash
# Start all services defined in docker-compose.yml
docker compose up

# Start in detached mode (background)
docker compose up -d

# Stop and remove all containers, networks
docker compose down

# Stop and remove everything including volumes (deletes data!)
docker compose down -v

# Rebuild images and start
docker compose up --build

# View running services
docker compose ps

# View logs
docker compose logs -f
```

**Compose v1 vs Compose v2:**

| Feature | Compose v1 (Legacy) | Compose v2 (Current) |
|---------|---------------------|----------------------|
| **Command** | `docker-compose` (hyphenated) | `docker compose` (space) |
| **Implementation** | Standalone Python binary | Docker CLI plugin (Go) |
| **Performance** | Slower | Faster |
| **Status** | Deprecated (end-of-life June 2023) | Actively maintained |
| **Install** | Separate install | Built into Docker Desktop |

**Always use Compose v2** (`docker compose` with a space). If you see tutorials using `docker-compose` with a hyphen, they are using the legacy version.

**In short:** Docker Compose lets you define multi-container applications in a single YAML file. One command (`docker compose up`) starts your entire stack. Always use Compose v2 with `docker compose` (no hyphen).

---

## 7. Docker Compose File Structure

A Docker Compose file (`docker-compose.yml`) has a clear, hierarchical structure. Let's break down every key part.

```yaml
# Top-level keys
services:     # Required - define your containers
  app:        # Service name (you choose this)
    build: .                    # Build from Dockerfile in current directory
    image: myapp:1.0            # Or use a pre-built image
    container_name: my-app      # Custom container name
    ports:
      - "3000:3000"             # host:container port mapping
    volumes:
      - ./src:/app/src          # bind mount for development
      - node_modules:/app/node_modules  # named volume
    environment:                # inline environment variables
      - NODE_ENV=production
      - DB_HOST=database
    env_file:                   # load variables from file
      - .env
    depends_on:                 # startup order
      - database
      - redis
    restart: unless-stopped     # restart policy
    networks:
      - app-network

  database:
    image: mysql:8.0
    volumes:
      - db-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: myapp
    networks:
      - app-network

volumes:       # Named volumes (Docker-managed)
  db-data:
  node_modules:

networks:      # Custom networks
  app-network:
    driver: bridge
```

**Service Configuration Options Explained:**

- **`build`** -- path to the directory containing the Dockerfile, or an object with `context` and `dockerfile` keys
- **`image`** -- use a pre-built image from a registry. If both `build` and `image` are specified, Compose builds and tags the image
- **`ports`** -- maps host ports to container ports. Format: `"HOST:CONTAINER"`
- **`volumes`** -- mount directories or named volumes into the container
- **`environment`** -- set environment variables directly (visible in the file)
- **`env_file`** -- load environment variables from one or more `.env` files (keeps secrets out of the YAML)
- **`depends_on`** -- controls startup order (but does not wait for the service to be "ready")
- **`restart`** -- defines the restart policy (covered in detail in Section 15)

**Three Ways to Set Environment Variables:**

```yaml
services:
  app:
    # Method 1: Inline (visible in docker-compose.yml)
    environment:
      - DB_HOST=database
      - DB_PORT=3306

    # Method 2: From .env file in the same directory
    # Docker Compose automatically reads .env
    # Use ${VARIABLE} syntax in docker-compose.yml
    ports:
      - "${APP_PORT:-3000}:3000"   # defaults to 3000 if not set

    # Method 3: Explicit env_file
    env_file:
      - .env
      - .env.local
```

**Build Configuration Options:**

```yaml
services:
  app:
    # Simple build
    build: .

    # Detailed build configuration
    build:
      context: .                    # build context directory
      dockerfile: Dockerfile.prod   # specific Dockerfile
      args:                         # build arguments
        NODE_VERSION: 20
        BUILD_ENV: production
      target: runner                # target a specific stage in multi-stage build
```

**In short:** The Compose file has three top-level keys: `services` (your containers), `volumes` (persistent storage), and `networks` (container communication). Each service can be built from a Dockerfile or pulled from a registry, with ports, volumes, environment variables, and dependencies configured declaratively.

---

## 8. Services, Volumes, and Networks

Understanding how services, volumes, and networks interact is the key to mastering Docker Compose.

### Multiple Services

Each service in your Compose file becomes a running container. Services can communicate with each other by name when on the same network.

```yaml
services:
  # Service 1: Web application
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  # Service 2: Database
  db:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Service 3: Cache
  cache:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
```

Notice how the `app` service references `db` and `cache` by their service names. Docker Compose creates a default network and registers each service name as a DNS hostname.

### Named Volumes vs Bind Mounts

```yaml
services:
  app:
    volumes:
      # Bind mount - maps a host directory to container directory
      # Great for development (live code reloading)
      - ./src:/app/src

      # Named volume - Docker manages the storage location
      # Great for persistent data (databases, uploads)
      - uploads:/app/uploads

  db:
    volumes:
      # Named volume for database data
      - db-data:/var/lib/mysql

      # Bind mount for initial SQL scripts
      - ./init-db:/docker-entrypoint-initdb.d

# Declare named volumes at the top level
volumes:
  uploads:
  db-data:
```

### Custom Networks

By default, Compose creates a single network for all services. You can create custom networks to isolate groups of services.

```yaml
services:
  # Frontend can talk to API but not directly to the database
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    networks:
      - frontend-network

  # API can talk to both frontend and database
  api:
    build: ./api
    ports:
      - "8000:8000"
    networks:
      - frontend-network
      - backend-network

  # Database is isolated to the backend network
  db:
    image: postgres:16-alpine
    networks:
      - backend-network

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
```

In this setup, the `frontend` service cannot reach the `db` service directly because they are on different networks. Only the `api` service, which is on both networks, can bridge communication.

### depends_on and Startup Order

`depends_on` controls the **order** in which services start, but it does **not** wait for a service to be "ready" (e.g., for a database to accept connections).

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy    # Wait for health check to pass
      redis:
        condition: service_started    # Just wait for container to start

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
```

Using `condition: service_healthy` with a health check ensures your app only starts after the database is actually ready to accept connections.

**In short:** Services are your containers, named by you and discoverable by name on the same network. Use bind mounts for development (live reloading) and named volumes for persistent data. Custom networks let you isolate service groups. Use `depends_on` with health checks to control startup order reliably.

---

## 9. Docker Compose for Laravel + MySQL + Redis + Nginx

This is a complete, production-ready Docker Compose setup for a Laravel application. It includes four services: the PHP application (with PHP-FPM), Nginx as a reverse proxy, MySQL as the database, and Redis for caching and queues.

### docker-compose.yml

```yaml
services:
  # PHP Application (Laravel)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: laravel-app
    restart: unless-stopped
    working_dir: /var/www/html
    volumes:
      - .:/var/www/html
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    environment:
      - DB_CONNECTION=mysql
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_DATABASE=${DB_DATABASE:-laravel}
      - DB_USERNAME=${DB_USERNAME:-laravel}
      - DB_PASSWORD=${DB_PASSWORD:-secret}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - laravel-network

  # Nginx Web Server
  nginx:
    image: nginx:1.25-alpine
    container_name: laravel-nginx
    restart: unless-stopped
    ports:
      - "${APP_PORT:-80}:80"
    volumes:
      - .:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - laravel-network

  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: laravel-mysql
    restart: unless-stopped
    ports:
      - "${DB_EXTERNAL_PORT:-3306}:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootsecret}
      MYSQL_DATABASE: ${DB_DATABASE:-laravel}
      MYSQL_USER: ${DB_USERNAME:-laravel}
      MYSQL_PASSWORD: ${DB_PASSWORD:-secret}
    volumes:
      - mysql-data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - laravel-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: laravel-redis
    restart: unless-stopped
    ports:
      - "${REDIS_EXTERNAL_PORT:-6379}:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    networks:
      - laravel-network

  # Queue Worker (optional but common)
  queue:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: laravel-queue
    restart: unless-stopped
    working_dir: /var/www/html
    volumes:
      - .:/var/www/html
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    depends_on:
      - app
      - redis
    networks:
      - laravel-network

volumes:
  mysql-data:
    driver: local
  redis-data:
    driver: local

networks:
  laravel-network:
    driver: bridge
```

### Dockerfile (PHP-FPM for Laravel)

```dockerfile
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    xml \
    opcache

# Install Redis PHP extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
```

### Nginx Configuration (docker/nginx/default.conf)

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php index.html;

    # Max upload size
    client_max_body_size 100M;

    # Serve static files directly
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Pass PHP requests to PHP-FPM
    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_buffering off;
    }

    # Deny access to .ht files
    location ~ /\.ht {
        deny all;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Usage:**

```bash
# Start the entire stack
docker compose up -d

# Run Laravel migrations
docker compose exec app php artisan migrate

# Run Laravel seeder
docker compose exec app php artisan db:seed

# View application logs
docker compose logs -f app

# Enter the PHP container
docker compose exec app sh

# Stop everything
docker compose down
```

**In short:** This setup gives you a complete Laravel development and production environment. Nginx handles HTTP requests and forwards PHP to PHP-FPM. MySQL and Redis use named volumes for data persistence. The queue worker runs as a separate container using the same image.

---

## 10. Docker Compose for Next.js + PostgreSQL

A complete Docker Compose setup for a Next.js application with PostgreSQL, optimized with multi-stage builds and hot-reloading for development.

### docker-compose.yml (Development)

```yaml
services:
  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev          # Use the development stage
    container_name: nextjs-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      # Bind mount for hot reloading
      - .:/app
      # Anonymous volume to prevent overwriting node_modules
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-secret}@postgres:5432/${POSTGRES_DB:-nextapp}
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-devsecret}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - nextjs-network

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: nextjs-postgres
    restart: unless-stopped
    ports:
      - "${POSTGRES_EXTERNAL_PORT:-5432}:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-secret}
      POSTGRES_DB: ${POSTGRES_DB:-nextapp}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - nextjs-network

volumes:
  postgres-data:
    driver: local

networks:
  nextjs-network:
    driver: bridge
```

### docker-compose.prod.yml (Production Override)

```yaml
services:
  app:
    build:
      target: runner         # Use the production stage
    ports:
      - "3000:3000"
    volumes: []              # No bind mounts in production
    environment:
      - NODE_ENV=production
    restart: always
```

### Multi-Stage Dockerfile

```dockerfile
# ============================================
# Stage 1: Base - shared between dev and prod
# ============================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ============================================
# Stage 3: Development (with hot reload)
# ============================================
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "dev"]

# ============================================
# Stage 4: Build for production
# ============================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================
# Stage 5: Production runner
# ============================================
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 appuser

COPY --from=builder /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

USER appuser

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Usage:**

```bash
# Development with hot reloading
docker compose up -d

# Production build and run
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Run database migrations (Prisma example)
docker compose exec app npx prisma migrate dev

# Generate Prisma client
docker compose exec app npx prisma generate

# Open Prisma Studio
docker compose exec app npx prisma studio

# View logs
docker compose logs -f app
```

**Key points about hot-reloading in Docker:**

- The bind mount (`- .:/app`) syncs your local files into the container
- The anonymous volume (`- /app/node_modules`) prevents host `node_modules` from overwriting the container's `node_modules`
- Next.js Fast Refresh works through the bind mount -- any file change triggers an automatic reload
- The `target: dev` in the build config selects the development stage which runs `npm run dev`

**In short:** Use multi-stage Dockerfiles to support both development (hot reload with bind mounts) and production (standalone optimized build) from a single file. Use `docker-compose.prod.yml` as an override file for production-specific settings.

---

## 11. Volumes and Data Persistence

Containers are **ephemeral** by default -- when a container is removed, all data inside it is lost. Volumes solve this by providing persistent storage that survives container lifecycle events.

Docker offers three types of storage:

### Named Volumes (Docker-Managed)

Docker creates and manages these volumes in a special location on the host (usually `/var/lib/docker/volumes/`). You do not need to know or care about the exact path.

```bash
# Create a named volume
docker volume create my-data

# Use it in docker run
docker run -v my-data:/app/data myapp

# List volumes
docker volume ls

# Inspect a volume
docker volume inspect my-data

# Remove a volume
docker volume rm my-data

# Remove all unused volumes
docker volume prune
```

```yaml
# In docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:           # Docker manages this
    driver: local
```

### Bind Mounts (Host Directory)

Bind mounts map a specific directory on the host to a directory in the container. Changes are reflected immediately in both directions.

```bash
# Bind mount using -v
docker run -v /home/user/project:/app myapp

# Bind mount using --mount (more explicit)
docker run --mount type=bind,source=/home/user/project,target=/app myapp
```

```yaml
# In docker-compose.yml
services:
  app:
    volumes:
      - ./src:/app/src           # relative path = bind mount
      - /home/user/data:/data    # absolute path = bind mount
```

### tmpfs Mounts (In-Memory)

tmpfs mounts are stored in the host's memory only. They are never written to the host filesystem and are removed when the container stops. Useful for sensitive data that should not persist.

```bash
# tmpfs mount
docker run --tmpfs /app/tmp myapp

# With size limit
docker run --mount type=tmpfs,destination=/app/tmp,tmpfs-size=100m myapp
```

### Volume Comparison Table

| Feature | Named Volume | Bind Mount | tmpfs |
|---------|-------------|------------|-------|
| **Managed by** | Docker | You (host path) | Memory |
| **Host location** | `/var/lib/docker/volumes/` | Any path you choose | RAM only |
| **Persistence** | Survives container removal | Always available | Lost on container stop |
| **Performance** | Good (Docker optimized) | Host-dependent | Fastest (in-memory) |
| **Portability** | Portable across hosts | Host-specific paths | Not persistent |
| **Best for** | Databases, uploads | Development (live editing) | Secrets, temp files |
| **Pre-populated** | Yes (copies from container) | No (overwrites container) | No |

### Backup and Restore Volumes

```bash
# Backup a volume to a tar file
docker run --rm \
  -v db-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz -C /data .

# Restore a volume from a tar file
docker run --rm \
  -v db-data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd /data && tar xzf /backup/db-backup.tar.gz"
```

### Volume Drivers

For advanced use cases, Docker supports volume drivers that can store data on remote systems like NFS, AWS EBS, or cloud storage.

```yaml
volumes:
  nfs-data:
    driver: local
    driver_opts:
      type: nfs
      o: addr=192.168.1.100,rw
      device: ":/path/to/shared"
```

**In short:** Use named volumes for databases and persistent data (Docker manages them for you). Use bind mounts for development (live code editing). Use tmpfs for temporary or sensitive data that should never touch disk. Always back up your volumes before destructive operations.

---

## 12. Docker Networking (Bridge, Host, None)

Docker networking controls how containers communicate with each other and with the outside world.

### Bridge Network (Default)

When you run a container without specifying a network, Docker attaches it to the default **bridge** network. Containers on the same bridge network can communicate using IP addresses.

```bash
# Run a container on the default bridge network
docker run -d --name web nginx

# Inspect the default bridge network
docker network inspect bridge
```

However, the **default bridge** does not provide DNS resolution by container name. For that, you need a custom bridge network.

### Custom Bridge Network (Recommended)

Custom bridge networks provide **automatic DNS resolution** -- containers can reach each other by name.

```bash
# Create a custom network
docker network create my-network

# Run containers on the custom network
docker run -d --name api --network my-network node-api
docker run -d --name db --network my-network postgres

# Now 'api' can connect to 'db' using the hostname 'db'
# Example: postgresql://postgres:secret@db:5432/myapp
```

```yaml
# Docker Compose creates custom bridge networks by default
services:
  api:
    build: .
    networks:
      - backend

  db:
    image: postgres:16
    networks:
      - backend

networks:
  backend:
    driver: bridge    # This is the default driver
```

### Host Network

The **host** network removes network isolation entirely. The container shares the host's network stack directly.

```bash
# Run with host networking
docker run --network host nginx
# Nginx is now accessible on port 80 of the host without -p mapping
```

- **Pros:** Best performance (no NAT overhead), simplest configuration
- **Cons:** No port isolation, potential port conflicts, only works on Linux
- **Use case:** Performance-critical applications, monitoring tools

### None Network

The **none** network disables all networking for the container. The container has no external connectivity.

```bash
# Run with no network
docker run --network none alpine
```

- **Use case:** Security-sensitive batch processing, offline computation

### Network Comparison

| Network Type | DNS by Name | Port Mapping | Isolation | Use Case |
|-------------|-------------|--------------|-----------|----------|
| **Default Bridge** | No (IP only) | Required (`-p`) | Yes | Quick testing |
| **Custom Bridge** | Yes | Required (`-p`) | Yes | Multi-container apps |
| **Host** | N/A (uses host) | Not needed | No | Performance, monitoring |
| **None** | No networking | None | Complete | Security, batch jobs |

### Container-to-Container Communication

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"        # Exposed to host
    environment:
      - API_URL=http://backend:8000   # Access backend by service name

  backend:
    build: ./backend
    # No ports mapping - only accessible from other containers
    expose:
      - "8000"              # Document the port, don't publish it
    environment:
      - DB_HOST=database     # Access db by service name

  database:
    image: postgres:16
    # No ports mapping - only accessible from other containers
    expose:
      - "5432"
```

**Key insight:** Use `ports` to make a service accessible from the host machine (e.g., your browser). Use `expose` to document which ports a service uses internally without publishing them to the host. Containers on the same network can always communicate on any port regardless of `ports` or `expose`.

### Port Publishing

```bash
# Publish a port: -p HOST_PORT:CONTAINER_PORT
docker run -p 8080:80 nginx          # host:8080 → container:80
docker run -p 127.0.0.1:8080:80 nginx # only localhost
docker run -p 80:80 -p 443:443 nginx  # multiple ports

# Publish all exposed ports to random host ports
docker run -P nginx
```

**In short:** Always use custom bridge networks (not the default bridge) for multi-container apps -- they provide DNS resolution by container name. Use host networking only for performance-critical Linux applications. Services on the same Compose network can communicate by service name without publishing ports.

---

## 13. Docker Registry and Docker Hub

A **Docker registry** is a storage and distribution system for Docker images. It is where you push (upload) and pull (download) images.

**Docker Hub** is the default public registry. When you run `docker pull nginx`, Docker fetches the image from Docker Hub.

### Pushing and Pulling Images

```bash
# Pull an image from Docker Hub
docker pull nginx
docker pull nginx:1.25-alpine       # specific tag
docker pull node:20-slim

# Tag your image for pushing
docker tag myapp:latest username/myapp:1.0
docker tag myapp:latest username/myapp:latest

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push username/myapp:1.0
docker push username/myapp:latest

# Pull your pushed image on another machine
docker pull username/myapp:1.0
```

### Image Naming Convention

Docker image names follow this format:

```
[registry/]repository[:tag]
```

```bash
# Docker Hub (default registry)
nginx                        # official image, latest tag
nginx:1.25-alpine            # official image, specific tag
username/myapp:1.0           # user repository

# Private registries
ghcr.io/username/myapp:1.0                  # GitHub Container Registry
123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0  # AWS ECR
registry.gitlab.com/group/project:1.0       # GitLab Registry
```

### Tagging Strategy

```bash
# Tag with version
docker tag myapp username/myapp:1.0.0
docker tag myapp username/myapp:1.0
docker tag myapp username/myapp:1
docker tag myapp username/myapp:latest

# Tag with git commit SHA (for traceability)
docker tag myapp username/myapp:abc123f

# Tag with environment
docker tag myapp username/myapp:staging
docker tag myapp username/myapp:production
```

**Best practices for tagging:**

- Always use specific version tags in production (never just `latest`)
- Tag with both semantic version and git SHA for traceability
- The `latest` tag is not special -- it is just a convention. Docker uses it as the default if no tag is specified
- Push multiple tags for the same image (e.g., `1.0.0`, `1.0`, `1`, and `latest`)

### Private Registries

```bash
# GitHub Container Registry (GHCR)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker tag myapp ghcr.io/username/myapp:1.0
docker push ghcr.io/username/myapp:1.0

# AWS Elastic Container Registry (ECR)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag myapp 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:1.0
```

**In short:** Docker Hub is the default registry for public images. Use `docker tag` to name your images with a registry prefix, repository name, and version tag. Always use specific version tags in production, not `latest`. For private images, use GHCR, ECR, or GitLab Registry.

---

## 14. Production Best Practices

Running Docker in production requires careful attention to security, performance, and reliability. Here are the essential practices every team should follow.

### Use Specific Tags, Never `latest`

```dockerfile
# BAD - what version is this? Could change unexpectedly
FROM node:latest
FROM postgres:latest

# GOOD - pinned, reproducible, predictable
FROM node:20.11-alpine
FROM postgres:16.2-alpine
```

### Use Multi-Stage Builds

Keep build tools, source code, and devDependencies out of the production image (see Section 4).

### Run as Non-Root User

By default, containers run as root. This is a security risk -- if an attacker escapes the container, they have root access to the host.

```dockerfile
# Create a non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Set ownership of application files
COPY --chown=appuser:appgroup . /app

# Switch to non-root user
USER appuser

CMD ["node", "server.js"]
```

### Minimize Layers

Each `RUN`, `COPY`, and `ADD` instruction creates a layer. Combine related commands.

```dockerfile
# BAD - 4 layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# GOOD - 1 layer
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*
```

### Vulnerability Scanning

```bash
# Scan with Trivy (free, open-source)
trivy image myapp:1.0

# Scan with Snyk
snyk container test myapp:1.0

# Scan with Docker Scout (built into Docker Desktop)
docker scout cves myapp:1.0

# Scan during CI/CD pipeline
docker build -t myapp:1.0 .
trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:1.0
```

### Set Resource Limits

Prevent a single container from consuming all host resources.

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "1.0"           # Max 1 CPU core
          memory: 512M          # Max 512 MB RAM
        reservations:
          cpus: "0.25"          # Guaranteed 0.25 CPU
          memory: 128M          # Guaranteed 128 MB RAM
```

### Use Read-Only Filesystem

```yaml
services:
  app:
    read_only: true            # Container filesystem is read-only
    tmpfs:
      - /tmp                   # Allow writing to /tmp only
      - /app/cache             # Allow writing to cache directory
    volumes:
      - uploads:/app/uploads   # Named volume for uploads
```

### Log to stdout/stderr

Docker expects applications to log to standard output and standard error. Do not write log files inside the container.

```dockerfile
# PHP/Laravel - symlink logs to stdout/stderr
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
```

```typescript
// Node.js - just use console (it goes to stdout/stderr)
console.log("Application started");    // stdout
console.error("Something failed");     // stderr

// Don't do this in containers:
// fs.writeFileSync('/app/logs/app.log', message);
```

### Bad vs Good Practice Comparison

| Bad Practice | Good Practice |
|-------------|---------------|
| `FROM node:latest` | `FROM node:20.11-alpine` |
| Running as root | `USER appuser` (non-root) |
| Single-stage build with all dev tools | Multi-stage build, minimal runtime image |
| No `.dockerignore` | Comprehensive `.dockerignore` |
| Secrets in `ENV` or `ARG` | Docker secrets or runtime env injection |
| Writing logs to files | Log to `stdout`/`stderr` |
| No resource limits | CPU and memory limits set |
| No vulnerability scanning | Trivy/Snyk in CI/CD pipeline |
| `COPY . .` without `.dockerignore` | `.dockerignore` + selective `COPY` |
| No health checks | `HEALTHCHECK` instruction configured |
| Writable root filesystem | `read_only: true` with targeted tmpfs |
| Storing data in container | Named volumes for persistent data |

**In short:** Production Docker demands discipline. Pin image versions, run as non-root, use multi-stage builds, scan for vulnerabilities, set resource limits, and log to stdout/stderr. Every shortcut in development becomes a risk in production.

---

## 15. Health Checks

Health checks tell Docker how to determine if a container is actually working, not just running. A container can be "running" but the application inside might be crashed, stuck, or unresponsive.

### HEALTHCHECK in Dockerfile

```dockerfile
# Basic health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Health check for PHP-FPM
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD php-fpm-healthcheck || exit 1

# Health check with wget (for Alpine images without curl)
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1
```

**Parameters explained:**

- **`--interval`** -- time between health checks (default: 30s)
- **`--timeout`** -- maximum time for the check to complete (default: 30s)
- **`--start-period`** -- grace period for the container to start up (default: 0s)
- **`--retries`** -- consecutive failures before marking unhealthy (default: 3)

### Health Check in Docker Compose

```yaml
services:
  app:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      start_period: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  mysql:
    image: mysql:8.0
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### HTTP Health Endpoint in Laravel

```php
// routes/web.php or routes/api.php
Route::get('/health', function () {
    try {
        // Check database connection
        DB::connection()->getPdo();

        // Check Redis connection
        Redis::ping();

        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'services' => [
                'database' => 'connected',
                'redis' => 'connected',
            ],
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'error' => $e->getMessage(),
        ], 503);
    }
});
```

### HTTP Health Endpoint in Next.js

```typescript
// app/api/health/route.ts (App Router)
import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    // Check database connection
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
```

### Restart Policies

Restart policies work hand-in-hand with health checks. When a container becomes unhealthy, Docker can automatically restart it based on the configured policy.

| Policy | Behavior |
|--------|----------|
| **`no`** | Never restart (default) |
| **`always`** | Always restart, even if manually stopped (restarts on Docker daemon restart) |
| **`unless-stopped`** | Restart unless explicitly stopped by the user (does not restart on daemon restart if stopped) |
| **`on-failure`** | Restart only if the container exits with a non-zero exit code. Optional max retry count |

```yaml
services:
  # Production web server - always keep running
  app:
    restart: unless-stopped

  # Database - always keep running
  db:
    restart: unless-stopped

  # One-time migration job - only restart on failure
  migrate:
    restart: "on-failure"

  # Development - no automatic restarts
  dev:
    restart: "no"
```

```bash
# Command line restart policies
docker run --restart=always nginx
docker run --restart=unless-stopped postgres
docker run --restart=on-failure:5 myapp   # max 5 retries
```

**In short:** Health checks go beyond "is the container running?" to "is the application actually working?" Define HTTP health endpoints that check database connections and critical services. Pair health checks with restart policies so Docker automatically recovers unhealthy containers.

---

## 16. Common Docker Commands Cheat Sheet

This is a comprehensive reference for the Docker commands you will use most frequently, organized by category.

### Image Commands

| Command | Description |
|---------|-------------|
| `docker build -t name:tag .` | Build an image from a Dockerfile |
| `docker build -f Dockerfile.prod -t name:tag .` | Build with a specific Dockerfile |
| `docker build --no-cache -t name:tag .` | Build without using cache |
| `docker images` | List all local images |
| `docker image ls` | List all local images (same as above) |
| `docker rmi image_name:tag` | Remove an image |
| `docker image prune` | Remove dangling (untagged) images |
| `docker image prune -a` | Remove all unused images |
| `docker tag source:tag target:tag` | Create a new tag for an image |
| `docker pull image:tag` | Pull an image from a registry |
| `docker push image:tag` | Push an image to a registry |
| `docker history image:tag` | Show image layer history |
| `docker save image:tag -o file.tar` | Export an image to a tar file |
| `docker load -i file.tar` | Import an image from a tar file |

### Container Commands

| Command | Description |
|---------|-------------|
| `docker run -d --name c image` | Run a container in detached mode |
| `docker run -it image sh` | Run interactively with a shell |
| `docker run -p 8080:80 image` | Run with port mapping |
| `docker run -v vol:/data image` | Run with a volume |
| `docker run --rm image` | Run and auto-remove on exit |
| `docker run -e VAR=val image` | Run with environment variable |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers (including stopped) |
| `docker stop container` | Gracefully stop a container |
| `docker start container` | Start a stopped container |
| `docker restart container` | Restart a container |
| `docker rm container` | Remove a stopped container |
| `docker rm -f container` | Force remove a running container |
| `docker exec -it container sh` | Execute a command in a running container |
| `docker logs container` | View container logs |
| `docker logs -f --tail 100 container` | Follow last 100 log lines |
| `docker cp file container:/path` | Copy files to a container |
| `docker cp container:/path file` | Copy files from a container |

### Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker compose up` | Start all services |
| `docker compose up -d` | Start in detached mode |
| `docker compose up --build` | Rebuild and start |
| `docker compose down` | Stop and remove containers, networks |
| `docker compose down -v` | Also remove volumes |
| `docker compose ps` | List running services |
| `docker compose logs -f` | Follow all service logs |
| `docker compose logs -f service` | Follow a specific service's logs |
| `docker compose exec service cmd` | Execute a command in a service |
| `docker compose build` | Build all images |
| `docker compose pull` | Pull all images |
| `docker compose restart` | Restart all services |
| `docker compose stop` | Stop services without removing |
| `docker compose config` | Validate and view the Compose file |

### Network Commands

| Command | Description |
|---------|-------------|
| `docker network ls` | List all networks |
| `docker network create name` | Create a network |
| `docker network rm name` | Remove a network |
| `docker network inspect name` | Show network details |
| `docker network connect net container` | Connect a container to a network |
| `docker network disconnect net container` | Disconnect from a network |
| `docker network prune` | Remove all unused networks |

### Volume Commands

| Command | Description |
|---------|-------------|
| `docker volume ls` | List all volumes |
| `docker volume create name` | Create a volume |
| `docker volume rm name` | Remove a volume |
| `docker volume inspect name` | Show volume details |
| `docker volume prune` | Remove all unused volumes |

### System Commands

| Command | Description |
|---------|-------------|
| `docker system df` | Show Docker disk usage |
| `docker system prune` | Remove unused data (containers, images, networks) |
| `docker system prune -a --volumes` | Remove everything unused (including volumes) |
| `docker info` | Display system-wide information |
| `docker version` | Show Docker version |
| `docker stats` | Live resource usage for all containers |
| `docker inspect container_or_image` | Detailed JSON info about any Docker object |

---

## 17. Debugging Containers

When things go wrong inside a container, you need the right tools and techniques to diagnose and fix the problem.

### View Logs

Logs are your first line of defense. Always check logs before anything else.

```bash
# View all logs
docker logs container_name

# Follow logs in real-time (like tail -f)
docker logs -f container_name

# Show last 50 lines and follow
docker logs -f --tail 50 container_name

# Show logs with timestamps
docker logs -t container_name

# Show logs since a specific time
docker logs --since "2024-01-01T00:00:00" container_name
docker logs --since 30m container_name   # last 30 minutes

# Docker Compose logs
docker compose logs -f              # all services
docker compose logs -f app db       # specific services
```

### Shell into a Running Container

```bash
# Bash shell (most full images)
docker exec -it container_name bash

# Shell (Alpine images use sh, not bash)
docker exec -it container_name sh

# Run a specific command
docker exec container_name cat /etc/hosts
docker exec container_name env     # view environment variables

# Run as root (even if container runs as non-root)
docker exec -u root -it container_name sh

# Docker Compose equivalent
docker compose exec app sh
docker compose exec db psql -U postgres
```

### Inspect Container Details

```bash
# Full JSON details about a container
docker inspect container_name

# Get specific information with format flag
docker inspect --format='{{.State.Status}}' container_name
docker inspect --format='{{.NetworkSettings.IPAddress}}' container_name
docker inspect --format='{{json .Config.Env}}' container_name
docker inspect --format='{{.State.Health.Status}}' container_name

# Get the container's IP address
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name
```

### Monitor Resource Usage

```bash
# Live resource stats for all running containers
docker stats

# Stats for specific containers
docker stats container1 container2

# One-time snapshot (no streaming)
docker stats --no-stream

# Output: CPU %, MEM USAGE/LIMIT, NET I/O, BLOCK I/O
```

### View File System Changes

```bash
# See what files changed inside the container since it started
docker diff container_name

# Output:
# A = Added
# C = Changed
# D = Deleted
```

### View Image Layer History

```bash
# See how an image was built, layer by layer
docker history myapp:1.0

# Show full commands (not truncated)
docker history --no-trunc myapp:1.0
```

### Common Debugging Scenarios

**Container exits immediately:**

```bash
# Check the exit code
docker ps -a --filter "name=container_name"

# View the last logs before exit
docker logs container_name

# Common causes:
# Exit code 0 - CMD finished (no foreground process)
# Exit code 1 - Application error
# Exit code 137 - Killed (OOM or docker stop)
# Exit code 139 - Segmentation fault

# Run interactively to debug
docker run -it myapp:1.0 sh
```

**Container is running but app is not responding:**

```bash
# Check if the port is actually listening inside the container
docker exec container_name netstat -tlnp
# or
docker exec container_name ss -tlnp

# Check if the process is running
docker exec container_name ps aux

# Check container health status
docker inspect --format='{{json .State.Health}}' container_name

# Test connectivity from inside
docker exec container_name curl -v http://localhost:3000
```

**Cannot connect to a service from another container:**

```bash
# Check if containers are on the same network
docker network inspect network_name

# Test DNS resolution from inside a container
docker exec container_name nslookup other_service

# Test connectivity
docker exec container_name ping other_service
docker exec container_name curl http://other_service:port
```

**Out of disk space:**

```bash
# Check Docker disk usage
docker system df

# Detailed breakdown
docker system df -v

# Clean up unused resources
docker system prune          # containers, networks, dangling images
docker system prune -a       # also unused images
docker volume prune          # unused volumes
docker builder prune         # build cache
```

**In short:** Debug containers in this order: (1) check logs, (2) shell into the container, (3) inspect the container details, (4) check resource usage. The exit code tells you why a container stopped. Use `docker system df` and `prune` to reclaim disk space.

---

## 18. Docker vs Kubernetes

**Docker** handles building and running individual containers. **Kubernetes (K8s)** is a container **orchestration** platform that manages hundreds or thousands of containers across multiple machines.

> **Analogy:** Docker is like driving a single car. Kubernetes is like managing an entire fleet of delivery trucks -- routing them, replacing broken ones, scaling up during rush hour, and making sure every package gets delivered.

### What Kubernetes Does

- **Auto-scaling** -- automatically adds or removes container instances based on load
- **Self-healing** -- restarts crashed containers, replaces unresponsive ones, kills containers that fail health checks
- **Load balancing** -- distributes traffic across container instances
- **Rolling updates** -- deploys new versions with zero downtime
- **Service discovery** -- containers find each other automatically
- **Secret management** -- securely stores and injects credentials

### Key Kubernetes Concepts

- **Pod** -- the smallest deployable unit. Usually one container per pod, but can be multiple tightly coupled containers
- **Service** -- a stable network endpoint that routes traffic to pods (like a load balancer)
- **Deployment** -- defines the desired state (how many replicas, which image, update strategy)
- **Namespace** -- virtual clusters for organizing resources (e.g., `dev`, `staging`, `production`)
- **Ingress** -- manages external HTTP/HTTPS access to services
- **ConfigMap / Secret** -- externalized configuration and sensitive data
- **Node** -- a physical or virtual machine that runs pods

### When Docker Compose is Enough

- Small to medium applications (less than 10 services)
- Single server deployments
- Small teams (1-10 developers)
- Development and testing environments
- Side projects and MVPs
- Apps with predictable traffic

### When You Need Kubernetes

- Large-scale applications with many microservices
- Need auto-scaling based on traffic
- Multi-server (cluster) deployments
- Zero-downtime deployments are critical
- Self-healing is required (automatic restart, replacement)
- Multiple teams managing different services
- Enterprise-grade security and compliance requirements

### Docker Compose vs Kubernetes Comparison

| Feature | Docker Compose | Kubernetes |
|---------|---------------|------------|
| **Complexity** | Simple YAML | Steep learning curve |
| **Scope** | Single host | Multi-host cluster |
| **Scaling** | Manual (`docker compose up --scale app=3`) | Auto-scaling (HPA) |
| **Self-healing** | Restart policies only | Full self-healing (reschedule, replace) |
| **Load balancing** | Basic (with Nginx) | Built-in service load balancing |
| **Rolling updates** | Manual | Built-in with rollback |
| **Networking** | Simple bridge networks | Advanced (CNI plugins, network policies) |
| **Storage** | Local volumes | Persistent volumes with cloud integration |
| **Secrets** | `.env` files | Encrypted secrets, RBAC |
| **Monitoring** | `docker stats` | Prometheus, Grafana integration |
| **Setup time** | Minutes | Hours to days |
| **Cloud managed** | No | Yes (EKS, GKE, AKS) |
| **Best for** | Development, small production | Large-scale production |

### Managed Kubernetes Services

If you decide to use Kubernetes, you do not need to set it up from scratch. Cloud providers offer managed Kubernetes:

- **AWS EKS** (Elastic Kubernetes Service)
- **Google GKE** (Google Kubernetes Engine)
- **Azure AKS** (Azure Kubernetes Service)
- **DigitalOcean Kubernetes**

These handle the control plane (master nodes) for you, so you only manage your workloads.

**In short:** Docker Compose is perfect for small to medium applications on a single server. Kubernetes is for large-scale, multi-server deployments that need auto-scaling, self-healing, and zero-downtime updates. Most projects start with Compose and migrate to Kubernetes only when they outgrow it. Do not introduce Kubernetes unless you genuinely need it.

---

## 19. Common Docker Interview Questions

These are the most frequently asked Docker questions in technical interviews, with concise, clear answers.

**Q1: What is the difference between CMD and ENTRYPOINT?**

`CMD` provides the default command that can be overridden when running the container with `docker run`. `ENTRYPOINT` sets the fixed executable that always runs. When both are used, `CMD` provides default arguments to `ENTRYPOINT`. Use `ENTRYPOINT` when the container should always run the same program, and `CMD` when you want to provide defaults that users can change.

**Q2: What are multi-stage builds and why use them?**

Multi-stage builds use multiple `FROM` instructions in a single Dockerfile. Each `FROM` starts a new build stage. You can copy artifacts from one stage to another using `COPY --from=stage_name`. The primary benefit is smaller production images because build tools, source code, and devDependencies are left behind in earlier stages. A typical Node.js image can go from 1.2 GB to under 100 MB with multi-stage builds.

**Q3: How do you reduce Docker image size?**

Use a minimal base image (Alpine), use multi-stage builds to separate build and runtime, combine `RUN` commands with `&&` to reduce layers, clean up package manager caches in the same layer, use `.dockerignore` to exclude unnecessary files, only install production dependencies in the final stage, and remove temporary files during the build.

**Q4: What is the difference between COPY and ADD?**

Both copy files from the build context into the image. `COPY` does a straightforward copy. `ADD` has two extra features: it auto-extracts compressed tar archives and can download files from URLs. Best practice is to always use `COPY` unless you specifically need tar extraction. For downloading files, use `RUN curl` or `RUN wget` instead of `ADD` with a URL.

**Q5: How do containers communicate with each other?**

Containers on the same Docker network can communicate using container names as hostnames (DNS resolution). In Docker Compose, all services are placed on the same default network automatically. For custom isolation, you can create multiple networks and attach services to specific ones. Containers on different networks cannot communicate unless a shared network or service bridges them.

**Q6: How do you persist data in Docker containers?**

Containers are ephemeral -- data is lost when a container is removed. To persist data, use Docker volumes. Named volumes are managed by Docker and stored in `/var/lib/docker/volumes/`. Bind mounts map a specific host directory to a container directory. For databases, always use named volumes. For development, bind mounts enable live code editing.

**Q7: What is the difference between `docker run` and `docker exec`?**

`docker run` creates and starts a **new container** from an image. `docker exec` runs a command inside an **already running** container. Use `docker run` to start services. Use `docker exec` to debug, inspect, or run maintenance commands inside a running container.

**Q8: What are Docker layers and how does caching work?**

Every instruction in a Dockerfile (`FROM`, `RUN`, `COPY`, `ADD`) creates a read-only layer. Docker caches these layers. During a rebuild, if an instruction and its inputs have not changed, Docker reuses the cached layer. However, if one layer changes, all subsequent layers are invalidated. This is why you should order instructions from least-changing (install dependencies) to most-changing (copy source code).

**Q9: How do you handle secrets in Docker?**

Never put secrets in `ENV`, `ARG`, or bake them into the image. `ARG` values appear in `docker history`. `ENV` values are accessible in running containers. Instead, use Docker secrets (for Swarm/Kubernetes), mount secrets as files at runtime, use environment variables passed at `docker run` time (not build time), or use a secrets manager like HashiCorp Vault or AWS Secrets Manager.

**Q10: What happens when you run `docker compose down -v`?**

`docker compose down` stops and removes all containers and networks defined in the Compose file. The `-v` flag additionally removes all named volumes declared in the `volumes` section. This means **all persistent data is deleted** -- databases, uploaded files, everything stored in named volumes. Use with extreme caution in production.

**Q11: What is the difference between `expose` and `ports` in Docker Compose?**

`expose` documents which ports the container listens on but does not publish them to the host. It is informational for inter-container communication. `ports` maps container ports to host ports, making them accessible from outside Docker. Containers on the same network can always communicate on any port regardless of `expose` or `ports` settings.

**Q12: How would you debug a container that keeps crashing?**

First, check the exit code with `docker ps -a`. Then view the logs with `docker logs container_name`. If the container exits too quickly, run it interactively with `docker run -it image sh` to inspect the environment. Check `docker inspect` for configuration issues. If it is an OOM kill (exit code 137), increase the memory limit. If it is an application error (exit code 1), fix the code and rebuild.

---

> **What's Next?** Now that you understand advanced Docker concepts, consider exploring container orchestration with Kubernetes for large-scale deployments, or dive into CI/CD pipelines that automate building, testing, and deploying Docker images. See the [CI/CD & Docker Guide](./02_cicd_docker.md) for pipeline fundamentals.
