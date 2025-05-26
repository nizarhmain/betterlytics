# Contributing to Betterlytics

<div align="center">

**Help us build the future of privacy-first analytics**

[![Contributors](https://img.shields.io/github/contributors/Lindharden/better-analytics.svg)](https://github.com/Lindharden/better-analytics/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/Lindharden/better-analytics.svg)](https://github.com/Lindharden/better-analytics/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/Lindharden/better-analytics.svg)](https://github.com/Lindharden/better-analytics/pulls)
[![License](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[🚀 Quick Start](#-quick-start) • [🛠️ Development](#️-development-workflow) • [🧪 Testing](#-testing) • [📝 Code Style](#-code-style) • [🔄 Pull Requests](#-pull-request-process) • [🐛 Issues](#-issue-guidelines-not-strictly-required-to-adhere-to-yet) • [🆘 Help](#-getting-help)

</div>

---

## 🌟 Why Contribute?

Betterlytics is more than just an analytics platform - it's a movement towards privacy-respecting web analytics. By contributing, you're helping to:

- 🔒 **Protect user privacy** across the web
- 🚀 **Advance open source** analytics technology
- 🌍 **Build a better internet** for everyone
- 💡 **Learn cutting-edge** technologies (Rust, ClickHouse, React 19, Next.js 15, and more)

---

## 🚀 Quick Start

Get your development environment ready in minutes:

<table>
<tr>
<td width="50%" valign="top">

### 🍴 Fork & Clone

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/better-analytics.git
cd better-analytics

# Add upstream remote
git remote add upstream https://github.com/Lindharden/better-analytics.git
```

</td>
<td width="50%" valign="top">

### ⚡ Setup & Run

```bash
# Install dependencies & start services
pnpm install
pnpm run compose

# Start development servers
pnpm run backend    # Port 3001
pnpm run dashboard  # Port 3000
```

</td>
</tr>
</table>

**📖 Need detailed setup?** See our [Setup Guide](SETUP.md) for comprehensive instructions.

---

## 🛠️ Development Workflow

### 📋 Prerequisites

<table>
<tr>
<td width="20%" align="center">

**🐳 Docker**
Required for databases

</td>
<td width="20%" align="center">

**🟢 Node.js**
v18+ for dashboard

</td>
<td width="20%" align="center">

**🦀 Rust**
Latest stable

</td>
<td width="20%" align="center">

**📦 pnpm**
Package manager

</td>
<td width="20%" align="center">

**🔧 Git**
Version control

</td>
</tr>
</table>

### 🏗️ Project Architecture

```
betterlytics/
├── 🦀 backend/                 # Rust server (Axum + ClickHouse)
│   ├── src/                   # Source code
│   ├── Cargo.toml             # Dependencies
│   └── .env.example           # Environment template
├── ⚛️ dashboard/               # Next.js 15 + React 19 + Tailwind css
│   ├── src/                   # Source code
│   ├── package.json           # Dependencies
│   └── .env.example           # Environment template
├── 🗃️ migrations/              # Database migrations
├── 🛠️ scripts/                # Build utilities
├── 📄 static/                 # Tracking script
└── 🐳 docker-compose.yml      # Services
```

### ⚡ Development Commands

<table>
<tr>
<td width="50%" valign="top">

#### 🚀 Quick Commands

```bash
# Install dependencies
pnpm install

# Start everything
pnpm run compose

# Development servers
pnpm run backend
pnpm run dashboard
```

</td>
<td width="50%" valign="top">

#### 🔧 Build & Test

```bash
# Build for production
pnpm build

# Run tests
pnpm test

# Performance testing
pnpm run perf-test
```

</td>
</tr>
</table>

---

## 🗃️ Database Development

### 📝 Creating Migrations

#### Naming Convention

```bash
# Pattern: {number}_description.sql
migrations/
├── 1_initial_schema.sql
├── 2_add_user_sessions.sql
└── 3_add_custom_events.sql
```

See existing migrations for examples on how to create migrations.

---

## 🧪 Testing - WIP

### 🎯 Testing Strategy

<table>
<tr>
<td width="33%" valign="top">

#### 🦀 Backend Tests

```bash
# Run Rust tests
cargo test

# With coverage
cargo tarpaulin
```

**Focus**: API endpoints, data processing, performance

</td>
<td width="33%" valign="top">

#### ⚛️ Frontend Tests

```bash
# Run React tests
pnpm test:frontend

# Watch mode
pnpm test:watch
```

**Focus**: Components, user interactions, data flow

</td>
<td width="33%" valign="top">

#### 🚀 Performance Tests

```bash
# Load testing
pnpm run performance
```

**Focus**: Throughput, response times, scalability

</td>
</tr>
</table>

### 📊 Performance Testing

Test the analytics ingestion performance:

```bash
k6 run -e TARGET_URL=http://localhost:3001/track -e VUS=100 -e DURATION=1m k6-perf-test.js

# or run the following command to test with standard configurations:
pnpm run performance
```

**Parameters**:

- `TARGET_URL`: Backend server URL
- `VUS`: Virtual users (concurrent connections)
- `DURATION`: Test duration

---

## 📝 Code Style

### 🦀 Rust Guidelines

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting

### ⚛️ TypeScript/React Guidelines

- Follow existing ESLint configuration
- Use Prettier for formatting
- Prefer functional components with hooks
- Use TypeScript strictly (no `any` types)

### 📝 Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

<table>
<tr>
<td width="50%" valign="top">

#### 🏷️ Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

</td>
<td width="50%" valign="top">

#### ✨ Examples

```
feat(backend): add user session tracking
fix(dashboard): resolve memory leak in real-time updates
docs(readme): update installation instructions
test(api): add integration tests for analytics endpoint
```

</td>
</tr>
</table>

---

## 🔄 Pull Request Process

### 📋 Before Submitting

<table>
<tr>
<td width="25%" align="center">

**✅ Code Quality**

- [ ] Follows style guidelines
- [ ] Passes all tests
- [ ] No linting errors

</td>
<td width="25%" align="center">

**📚 Documentation**

- [ ] Updates relevant docs
- [ ] Adds code comments
- [ ] Updates CHANGELOG

</td>
<td width="25%" align="center">

**🧪 Testing**

- [ ] Adds new tests
- [ ] Maintains coverage
- [ ] Manual testing done

</td>
<td width="25%" align="center">

**🔍 Review Ready**

- [ ] Clear description
- [ ] Links related issues
- [ ] Screenshots if UI

</td>
</tr>
</table>

### 📝 PR Template (Not strictly required to adhere to yet)

```markdown
## 📋 Description

Brief description of changes and motivation

## 🔄 Type of Change

- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💥 Breaking change
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI changes

## 🧪 Testing

- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed
- [ ] Performance impact assessed

## 📸 Screenshots (if applicable)

Add screenshots for UI changes

## 📝 Additional Notes

Any additional context or considerations
```

### 🔍 Review Process

1. **Automated checks** must pass (CI/CD, linting, tests)
2. **Code review** by at least one maintainer
3. **Manual testing** is a must for all changes
4. **Documentation review** if docs are updated
5. **Merge** after approval and passing checks

---

## 🐛 Issue Guidelines (Not strictly required to adhere to yet)

### Bug Reports

<table>
<tr>
<td width="50%" valign="top">

#### 📋 Include This Information when applicable

- **Operating system** and version
- **Browser** (for dashboard issues)
- **Node.js version** (`node --version`)
- **Rust version** (`rustc --version`)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Error messages** and logs
- **Screenshots** if applicable

</td>
<td width="50%" valign="top">

#### 🔍 Before Reporting

- [ ] Search existing issues
- [ ] Try latest version
- [ ] Check documentation
- [ ] Minimal reproduction case
- [ ] Clear, descriptive title

</td>
</tr>
</table>

### Feature Requests

If possible, include:

- **Clear description** of the feature
- **Use case** and motivation
- **Proposed implementation** (if you have ideas)
- **Alternatives considered**
- **Mockups/wireframes** (for UI features)

Although any feature requests are welcome, and we'll gladly help refine the issues you create!

---

## 🆘 Getting Help

<table>
<tr>
<td width="25%" align="center">

### 💬 Discord

[![Discord](https://img.shields.io/badge/Discord-Join-7289da.svg)](https://discord.gg/vwqSvPn6sP)

Real-time help and discussion

</td>
<td width="25%" align="center">

### 🐛 GitHub Issues

[![Issues](https://img.shields.io/badge/Issues-Report-red.svg)](https://github.com/Lindharden/better-analytics/issues)

Bug reports and feature requests

</td>
<td width="25%" align="center">

### 💡 Discussions

[![Discussions](https://img.shields.io/badge/Discussions-Ask-blue.svg)](https://github.com/Lindharden/better-analytics/discussions)

Questions and ideas

</td>
<td width="25%" align="center">

### 📧 Email

[![Email](https://img.shields.io/badge/Email-Security-orange.svg)](mailto:security@betterlytics.io)

Security issues only

</td>
</tr>
</table>

---

## 📚 Technical Resources

### ⚡ Performance Optimization

- [ClickHouse Performance Optimization](https://www.highlight.io/blog/lw5-clickhouse-performance-optimization)
- [ClickHouse Operations Overview](https://clickhouse.com/docs/operations/overview)
- [ClickHouse Data Insertion Guide](https://clickhouse.com/docs/guides/inserting-data)
- [Asynchronous Data Inserts in ClickHouse](https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse)
- [Data Batching for Optimal Performance](https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse#data-needs-to-be-batched-for-optimal-performance)

### 🔗 Integrations

- [ClickHouse Kafka Connect Sink](https://clickhouse.com/docs/integrations/kafka/clickhouse-kafka-connect-sink)

### 🦀 Rust Development

- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Tokio Documentation](https://tokio.rs/)
- [Axum Web Framework](https://docs.rs/axum/latest/axum/)

### ⚛️ Frontend Development

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 📄 License

By contributing to Betterlytics, you agree that your contributions will be licensed under the AGPL-3.0 license.

---

<div align="center">

**Ready to contribute?** 🚀 [Fork the repository](https://github.com/Lindharden/better-analytics/fork) and start building!

Made with ❤️ by the Betterlytics team

</div>
