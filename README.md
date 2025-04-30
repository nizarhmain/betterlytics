# Better Analytics

A modern, privacy-focused analytics platform built with Rust and ClickHouse.

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [pnpm](https://pnpm.io/) (package manager)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Lindharden/better-analytics.git
cd better-analytics
```

### 2. Environment Setup

Create a copy of the `.env.example` file and rename it to `.env` and adjust environment variables accordingly - most can be left as is.

### 3. Start ClickHouse database

```bash
docker-compose up -d
```

This will start a ClickHouse instance with:
- HTTP interface on port 8123
- Native interface on port 9000
- Data persisted in `./data/clickhouse`

### 4. Run Database Migrations

```bash
pnpm install
pnpm migrate
```

This will:
- Install all dependencies
- Create the necessary database and tables
- Set up materialized views for analytics

### 5. Start the Backend Server

```bash
cd backend
cargo run
```

The Rust server will:
- Start on port 3001
- Connect to ClickHouse
- Handle analytics events
- Provide API endpoints for the dashboard

### 6. Start the Dashboard

```bash
pnpm dev
```

The dashboard will:
- Start on port 3000
- Connect to the backend API
- Show real-time analytics

## Project Structure

```
better-analytics/
├── backend/           # Rust server
├── dashboard/         # Next.js dashboard
├── migrations/        # Database migrations
├── scripts/           # Migration runner
├── static/            # Static files where the tracking script is located
├── docker-compose.yml # Docker Compose file for Clickhouse
└── package.json       # Root package.json
```

## Development

### Creating New Migrations

To create a new database migration, create a new file in the `migrations` directory and ensure the file is named like `1_migration_name.sql` where the number is the next available number in the sequence of existing migrations.

### Running Performance Tests

Run the following command to run a performance test, where TARGET_URL is the URL of the backend server, VUS is the number of virtual users, and DURATION is the duration of the test:

```bash
k6 run -e TARGET_URL=http://localhost:3001/track -e VUS=100 -e DURATION=1m k6-perf-test.js
```

## Deployment

A docker-compose file will be added in the future to deploy the backend and dashboard as a single service.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

The AGPL-3.0 license means:
- You are free to use, modify, and distribute this software
- Any modifications or derivative works must also be licensed under AGPL-3.0
- You must make the source code available when distributing the software
- If you run a modified version of the software on a server and make it available to others, you must make the source code available to them
- The software comes with no warranty

This license ensures that the software remains free and open source, and that any improvements or modifications to it are also shared with the community.

## References

### Articles relevant to performance:
https://www.highlight.io/blog/lw5-clickhouse-performance-optimization
https://clickhouse.com/docs/operations/overview
https://clickhouse.com/docs/guides/inserting-data
https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse
https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse#data-needs-to-be-batched-for-optimal-performance

### Kafka:
https://clickhouse.com/docs/integrations/kafka/clickhouse-kafka-connect-sink