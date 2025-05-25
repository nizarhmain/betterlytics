# Better Analytics Setup Guide

This guide will walk you through setting up Betterlytics on your local machine or server.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [pnpm](https://pnpm.io/) (package manager)

## Quick Setup

For the fastest setup experience:

```bash
git clone https://github.com/Lindharden/better-analytics.git
cd better-analytics
pnpm install
pnpm run compose
pnpm run dashboard
```

Your dashboard will be available at `http://localhost:3000`

## Detailed Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Lindharden/better-analytics.git
cd better-analytics
```

### 2. Environment Setup

Create environment files for each component:

#### Root Environment
```bash
cp .env.example .env
```

#### Backend Environment
```bash
cp backend/.env.example backend/.env
```

#### Dashboard Environment
```bash
cp better-analytics-dashboard/.env.example better-analytics-dashboard/.env
```

> **Note:** Most environment variables can be left as their default values for local development.

### 3. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the entire monorepo.

### 4. Start Docker Services

```bash
pnpm run compose
```

This command will:
- Start a ClickHouse instance with:
  - HTTP interface on port 8123
  - Native interface on port 9000
  - Data persisted in `./data/clickhouse`
- Start a PostgreSQL instance with:
  - HTTP interface on port 5432
  - Data persisted in `./data/postgres`
- Run migrations for ClickHouse & PostgreSQL
- Generate the Prisma client for the dashboard
- Seed PostgreSQL with basic data

### 5. Start the Backend Server

```bash
pnpm run backend
```

The Rust server will:
- Start on port 3001
- Connect to ClickHouse
- Handle analytics events

### 6. Start the Dashboard

```bash
pnpm run dashboard
```

The dashboard will:
- Start on port 3000
- Connect to the backend API
- Show real-time analytics

## Docker Setup

### Using Docker Compose (Recommended)

The easiest way to run Better Analytics is using Docker Compose:

```bash
docker-compose up -d
```

This will start all services in the background.

## Production Deployment

### Environment Variables

For production, ensure you set:

```bash
# Security
DATABASE_URL=your_production_db_url
CLICKHOUSE_URL=your_production_clickhouse_url
JWT_SECRET=your_secure_jwt_secret

# Performance
RUST_LOG=info
NODE_ENV=production
```

### Docker Production Setup

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling

For high-traffic deployments:

1. Use multiple backend instances behind a load balancer
2. Configure ClickHouse clustering
3. Use Redis for session storage
4. Enable database connection pooling

## Next Steps

- [Contributing Guide](CONTRIBUTING.md)
- [API Documentation](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Architecture Overview](README.md#architecture) 