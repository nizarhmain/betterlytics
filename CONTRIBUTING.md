# Contributing to Better Analytics

Thank you for your interest in contributing to Better Analytics! This guide will help you get started with development and contributing to the project.

## Getting Started

### Prerequisites for Development

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://www.rust-lang.org/) (latest stable)
- [pnpm](https://pnpm.io/) (package manager)
- [Git](https://git-scm.com/)

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/better-analytics.git
   cd better-analytics
   ```
3. **Follow the setup guide**: See [SETUP.md](SETUP.md) for detailed installation instructions
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Development Commands

```bash
# Install dependencies
pnpm install

# Start all services (databases + backend + frontend)
pnpm run compose

# Start backend only
pnpm run backend

# Start dashboard only
pnpm run dashboard

# Run tests
pnpm test

# Build for production
pnpm build

# Run Migrations
pnpm run migrate
```

### Project Structure

```
better-analytics/
├── backend/                # Rust backend server
│   ├── src/                # Source code
│   ├── Cargo.toml          # Rust dependencies
│   └── .env.example        # Environment template
├── dashboard/              # Next.js dashboard
│   ├── src/                # Source code
│   ├── package.json        # Node dependencies
│   └── .env.example        # Environment template
├── migrations/             # Database migrations
├── scripts/                # Build and utility scripts
├── static/                 # Static files (tracking script)
└── docker-compose.yml      # Docker services
```

## Database Development

### Creating New Migrations

To create a new database migration:

1. Create a new file in the `migrations` directory
2. Name it following the pattern: `{number}_migration_name.sql`
3. Ensure the number is the next in sequence

Example:
```bash
touch migrations/5_add_user_sessions.sql
```

### Migration Guidelines

- **Always test migrations** on a copy of production data
- **Make migrations reversible** when possible
- **Document breaking changes** in the migration file
- **Use descriptive names** that explain what the migration does

Example migration file:
```sql
-- migrations/5_add_user_sessions.sql
-- Add user session tracking

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id String,
    session_start DateTime,
    session_end Nullable(DateTime),
    page_views UInt32 DEFAULT 0
) ENGINE = MergeTree()
ORDER BY (user_id, session_start);
```

## Testing

### Running Tests

TODO

### Performance Testing

Test the performance of the analytics backend:

```bash
k6 run -e TARGET_URL=http://localhost:3001/track -e VUS=100 -e DURATION=1m k6-perf-test.js
```

Parameters:
- `TARGET_URL`: The URL of your backend server
- `VUS`: Number of virtual users
- `DURATION`: Duration of the test

### Writing Tests

- **Backend**: Use Rust's built-in testing framework
- **Frontend**: Not yet included
- **Integration**: Use the k6 performance testing setup
- **Coverage**: Aim for >80% test coverage on new code

## Code Style

### Rust (Backend)

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Document public APIs with doc comments

### TypeScript/React (Frontend)

- Follow the existing ESLint configuration
- Use Prettier for formatting
- Prefer functional components with hooks
- Use TypeScript strictly (no `any` types)

### Commit Messages

Use conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(backend): add user session tracking
fix(dashboard): resolve memory leak in real-time updates
docs(readme): update installation instructions
```

## Pull Request Process

1. **Ensure your code follows** the style guidelines
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Run the full test suite** and ensure it passes
5. **Create a pull request** with:
   - Clear title and description
   - Reference to any related issues
   - Screenshots for UI changes
   - Performance impact notes if applicable

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Performance Impact
Describe any performance implications
```

## Issue Guidelines

### Reporting Bugs

Include:
- **Operating system** and version
- **Node.js version** (`node --version`)
- **Rust version** (`rustc --version`)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Error messages** and logs
- **Screenshots** if applicable

### Feature Requests

Include:
- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**

## Development Tips

### Hot Reloading

- **Frontend**: Next.js provides hot reloading out of the box
- **Backend**: Use `cargo watch` for auto-recompilation:
  ```bash
  cargo install cargo-watch
  cargo watch -x run
  ```

### Debugging

- **Backend**: Use `RUST_LOG=debug` for verbose logging
- **Frontend**: Use browser dev tools and React DevTools
- **Database**: Use ClickHouse's web interface at `http://localhost:8123/play`

### Common Development Tasks

```bash
# Reset database
docker-compose down -v
pnpm run compose

# View logs
docker-compose logs -f clickhouse
docker-compose logs -f postgres
```

## Getting Help

- **Discord**: Join our development Discord (link in README)
- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact maintainers directly for security issues

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

By contributing to Betterlytics, you agree that your contributions will be licensed under the AGPL-3.0 license.