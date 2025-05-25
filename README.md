# Better Analytics

<div align="center">

<img src=".github/assets/logo-dark-raw.png" alt="Better Analytics Logo" width="120">

**A modern, Cookieless & privacy-focused analytics platform built for the future**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/) [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![ClickHouse](https://img.shields.io/badge/ClickHouse-FFCC01?style=flat&logo=clickhouse&logoColor=black)](https://clickhouse.com/) [![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)


[🚀 Quick Start](#getting-started) • [📖 Documentation](#project-structure) • [🤝 Contributing](#contributing) • [📄 License](#license)

</div>

---

## 🌟 Why Better Analytics?

Better Analytics is a **high-performance, privacy-first** analytics platform that puts you in control of your data. Built with modern technologies like Rust and ClickHouse, it delivers lightning-fast insights while respecting user privacy.

**Our core principles:**

- 🔒 **Privacy-First**: GDPR compliant, no third-party tracking
- 🍪 **Cookieless**: No cookies required, respects user privacy
- ⚡ **Lightning Fast**: Built on Rust and ClickHouse for maximum performance
- 📊 **Real-time Insights**: Live dashboard with instant data updates
- 🎯 **Lightweight Tracking**: Minimal impact on your website's performance
- 🔧 **Self-Hosted**: Complete control over your data and infrastructure
- 📱 **Modern UI**: Beautiful, responsive dashboard built with Next.js 15 and React 19
- 🚀 **Scalable**: Handles millions of events with ease
- 🛠️ **Developer Friendly**: Easy to deploy, customize, and extend

### 🚀 Complete Feature Set

#### 📊 Core Analytics
| Feature | Description |
|---------|-------------|
| **Real-time Dashboard** | Live visitor tracking with instant updates powered by Clickhouse |
| **Page Analytics** | Detailed page views, bounce rates, and engagement metrics |
| **Referrer Tracking** | Complete referral source analysis and traffic attribution |
| **Geographic Insights** | Global visitor mapping with MaxMind GeoIP integration |
| **Device & Browser Detection** | Comprehensive device, OS, and browser analytics |
| **Campaign Tracking** | UTM parameter tracking and marketing campaign analysis |
| **User Journey Mapping** | Visualize complete user paths through your site |
| **Conversion Funnels** | Track multi-step conversion processes and drop-off points |
| **Custom Events** | Track any custom interactions and business metrics |
| **Real-time Visitor Feed** | See live visitor activity as it happens |

#### 🛠️ Platform & Integration
| Feature | Description |
|---------|-------------|
| **Modern UI** | Beautiful dashboard built with Next.js 15, React 19, and Tailwind CSS |
| **Lightweight Script** | Minimal tracking script with zero performance impact |
| **Easy Integration** | Simple one-line script installation |
| **Docker Deployment** | One-command deployment with Docker Compose |
| **Performance Optimized** | Built on ClickHouse for sub-second query responses |



## 📸 Dashboard Preview

<div align="center">

### Overview
![Dashboard Overview](.github/assets/betterlytics-showcase-overview.png)

### Geography Insights
![Real-time Analytics](.github/assets/betterlytics-showcase-geography.png)

### User Journey Diagram
![Detailed Reports](.github/assets/betterlytics-showcase-journey.png)

### Devices Breakdown
![Detailed Reports](.github/assets/betterlytics-showcase-devices.png)

### Pages Breakdown
![Detailed Reports](.github/assets/betterlytics-showcase-pages.png)

... and much more

</div>

## ⚡ Performance Benchmarks

Betterlytics is built for speed. Here's how it performs:

### Request Handling
| Metric | Value | Notes |
|--------|-------|-------|
| **Requests/Second** | 25,000+ | Single instance, standard hardware |
| **Response Time** | <5ms | P95 for tracking requests |
| **Memory Usage** | x | Rust backend at steady state |
| **CPU Usage** | x | During normal operation |

### Query Performance
| Query Type | Response Time | Dataset Size |
|------------|---------------|--------------|
| **Overview Page** | x | 1M+ events |
| **Page Analytics** | x | 10M+ events |
| **User-Journey** | x | 100M+ events |
| **Geographic Data** | x | Global dataset |

### Scalability
- **Events/Day**: Tested up to 100M+ events
- **Concurrent Users**: 1,000+ dashboard users
- **Data Retention**: Unlimited (depends on storage)
- **Geographic Distribution**: Multi-region support

> 📊 **Benchmarks performed on**: 4-core CPU, 8GB RAM, SSD storage  
> 🔄 **Last updated**: [Date to be added]  

## 🚀 Quick Start

Get Better Analytics running in minutes:

```bash
git clone https://github.com/Lindharden/better-analytics.git
cd better-analytics
pnpm install
pnpm run compose
```

That's it! Your analytics dashboard will be available at `http://localhost:3000`

📖 **[Full Setup Guide →](SETUP.md)** | 🐳 **[Docker Setup →](SETUP.md#docker-setup)** | 🛠️ **[Development →](SETUP.md#development)**

---

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

## 🗺️ Roadmap

We're constantly working to improve Betterlytics. Here's what's coming next:

### 🚧 In Development
- 🔌 **REST API** - Full API access for custom integrations and data export
- ☁️ **Cloud Hosting** - Managed hosting option for easy deployment

### 🎯 Planned Features
- 🔔 **Alerts & Notifications** - Custom alerts for traffic spikes and anomalies
- 📊 **Advanced Reporting** - Scheduled reports and custom dashboards
- 🔗 **Integrations** - Connect with popular tools (Slack, Discord, Webhooks)
- 📈 **A/B Testing** - Built-in experimentation platform
- 🤖 **AI Insights** - Automated insights and recommendations
- 📱 **Mobile App** - Native mobile dashboard for iOS and Android

### 💡 Ideas & Suggestions
Have an idea for Betterlytics? We'd love to hear it! 
- Open an [issue](https://github.com/Lindharden/better-analytics/issues) to suggest new features
- Join our discussions to share your thoughts
- Contribute code to help us build these features faster

---

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

---

## 👥 Community

Join our small community of developers and privacy advocates:

- 💬 **[Discord](https://discord.gg/betterlytics)** - Get help, share ideas, and connect with other users and developers
- 🦋 **[Bluesky](https://bsky.app/profile/betterlytics.bsky.social)** - Follow us for updates and announcements
- 🐛 **[GitHub Issues](https://github.com/Lindharden/better-analytics/issues)** - Report bugs and request features
- 💡 **[GitHub Discussions](https://github.com/Lindharden/better-analytics/discussions)** - Ask questions and share feedback