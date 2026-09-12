# Healthcare Platform Backend

NestJS modular monolith for a healthcare platform. The repository is organized around business capabilities, with one deployable API and explicit boundaries between bounded contexts.

<p align="center">
  <a href="https://nestjs.com/" target="_blank" rel="noreferrer">
    <img src="https://nestjs.com/img/logo-small.svg" width="96" alt="NestJS logo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white" alt="NestJS 12" />
  <img src="https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js 22 or newer" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white" alt="Fastify 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 17" />
  <img src="https://img.shields.io/badge/pnpm-11.17-F69220?logo=pnpm&logoColor=white" alt="pnpm 11.17" />
</p>

> **Repository status:** architecture and feature scaffolding are in place. The auth context has implemented controller/service/repository flows; many other context handlers remain intentional placeholders and must be implemented before production use. This repository is not, by itself, a compliance certification or a production-ready healthcare system.

## At a glance

| Area                    | Decision                                     |
| ----------------------- | -------------------------------------------- |
| Runtime                 | Node.js 22+                                  |
| Framework               | NestJS 12 on Fastify                         |
| Language                | TypeScript 5, strict mode                    |
| Package manager         | pnpm 11.17                                   |
| Primary database        | PostgreSQL 17 + parameterized raw SQL (`pg`) |
| Optional infrastructure | MongoDB and Redis                            |
| API documentation       | Swagger at `/api/docs` when enabled          |
| Deployment shape        | One stateless API deployable                 |
| Architecture guard      | `pnpm architecture:check`                    |

## Start here

- [Documentation hub](docs/00-README.md) — curated entry point for engineering docs.
- [Get oriented](docs/01-GETTING-ORIENTED.md) — recommended first read for developers coming from another framework.
- [Runtime flow](docs/03-RUNTIME-FLOW.md) — trace a request from the API to its libraries and database.
- [Libraries guide](docs/05-LIBS-GUIDE.md) — how to understand and extend everything under `libs/`.
- [Architecture](docs/02-ARCHITECTURE.md) — runtime shape and dependency direction.
- [Module boundaries](docs/04-MODULE-BOUNDARIES.md) — import rules enforced in CI.
- [Adding a feature](docs/10-ADDING-A-FEATURE.md) — implementation workflow.
- [API conventions](docs/07-API-CONVENTIONS.md) — versioning, envelopes, and errors.
- [Deployment](docs/13-DEPLOYMENT.md) — local and production topology.

## Local development

### Prerequisites

- Node.js 22 or newer
- pnpm 11.17 or a compatible pnpm 11 release
- Docker Desktop or another Docker runtime

### Bootstrap

```bash
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d postgres
pnpm start:dev
```

On PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

The API listens on `http://localhost:3000` by default.

| Endpoint                | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `GET /api/health/live`  | Process liveness; version-neutral                           |
| `GET /api/health/ready` | Readiness endpoint; version-neutral in the current scaffold |
| `GET /api/docs`         | Swagger UI when `DOCS_ENABLED=true`                         |

The default API version is `v1`, so versioned feature routes are served under `/api/v1/...`.

## Common commands

```bash
pnpm start:dev          # * development server with watch mode
pnpm lint               # * ESLint
pnpm test               # * unit and repository test suite
pnpm test:e2e           # * API e2e suite
pnpm architecture:check
pnpm build
pnpm check              # * architecture check, lint, tests, and build
```

## Repository shape

```text
apps/api/                 API composition root, bootstrap, health checks, e2e tests
libs/modules/             Business bounded contexts
libs/platform/            Technical infrastructure shared by the runtime
libs/shared-kernel/       Small stable cross-cutting domain contracts
tools/architecture/       Static dependency-boundary checks
docs/                     Engineering documentation and ADRs
```

Each business module owns its feature API, application services or handlers, domain code, persistence adapters, and tests. Cross-module consumers may import only the module's `public-api.ts` entry point.

## Bounded contexts

The bounded-context libraries live under `libs/modules`. Each bounded context owns a composition module and groups its HTTP workflows under `src/features/<workflow>`. The active auth context is composed into `apps/api/src/app.module.ts`; other contexts remain scaffolds until their workflows are implemented and composed.

The module READMEs under [`libs/modules`](libs/modules) list the current feature slices for each context. Auth is the currently implemented context and uses flat feature folders with controllers, services, schemas, and focused repositories. Other contexts describe scaffolded capability surfaces and do not imply that every workflow is fully implemented. Shared technical concerns such as database access, request middleware, logging, execution boundaries, and response/error handling remain centralized under `libs/platform` and `libs/shared-kernel`.

## Configuration

Copy `.env.example` to `.env` for local work. PostgreSQL is required by the default database configuration. MongoDB and Redis are opt-in integrations controlled by `MONGO_ENABLED` and `REDIS_ENABLED`.

Never commit real credentials, signing keys, patient data, payment data, or provider secrets. See [security architecture](docs/15-SECURITY.md) before connecting external systems.

## Engineering contract

Before opening a pull request:

```bash
pnpm architecture:check
pnpm lint
pnpm test
pnpm build
```

For changes that affect a public module contract, database schema, API behavior, or operational behavior, update the relevant documentation and ADR when the decision is durable.
