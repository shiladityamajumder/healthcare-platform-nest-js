# Healthcare Platform Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-12-E0234E?logo=nestjs&logoColor=white" alt="NestJS 12" />
  <img src="https://img.shields.io/badge/Runtime-Node.js%2022%2B-339933?logo=nodedotjs&logoColor=white" alt="Node.js 22 or newer" />
  <img src="https://img.shields.io/badge/API-Fastify%205-000000?logo=fastify&logoColor=white" alt="Fastify 5" />
  <img src="https://img.shields.io/badge/Data-PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

NestJS 12 modular monolith for a healthcare platform. The repository contains one Fastify API, PostgreSQL-backed authentication, catalog, and pricing contexts, reusable platform infrastructure, and scaffolded business contexts that are ready for vertical-slice implementation.

> **Current status:** `AuthModule`, `CatalogModule`, and `PricingModule` are composed into the running API. Auth provides identity/session/RBAC workflows; Catalog and Pricing provide the product, reference-master, price-book, product-price, and tax-rule APIs. The remaining bounded contexts are scaffolds and are not production endpoints yet. This repository is not a compliance certification or a production-ready healthcare system by itself.

## At a glance

| Area                | Current implementation                                                        |
| ------------------- | ----------------------------------------------------------------------------- |
| Runtime             | Node.js 22+                                                                   |
| Framework           | NestJS 12 on Fastify 5                                                        |
| Language            | TypeScript 5.9, strict mode                                                   |
| Package manager     | pnpm 11.17                                                                    |
| Primary persistence | PostgreSQL through `pg`, parameterized raw SQL                                |
| Optional adapters   | MongoDB and Redis; disabled by default and not required by the live auth flow |
| API documentation   | Swagger at `/api/docs` when `DOCS_ENABLED=true`                               |
| API versioning      | URI versioning; default route prefix is `/api/v1`                             |
| Deployment shape    | One stateless API process                                                     |
| Boundary check      | `pnpm architecture:check`                                                     |

## Documentation

- [Documentation hub](docs/00-README.md)
- [Getting oriented](docs/01-GETTING-ORIENTED.md)
- [Architecture](docs/02-ARCHITECTURE.md)
- [Runtime flow](docs/03-RUNTIME-FLOW.md)
- [Module boundaries](docs/04-MODULE-BOUNDARIES.md)
- [Libraries guide](docs/05-LIBS-GUIDE.md)
- [API conventions](docs/07-API-CONVENTIONS.md)
- [Database](docs/08-DATABASE.md)
- [Adding a feature](docs/10-ADDING-A-FEATURE.md)
- [Testing](docs/11-TESTING.md)
- [Deployment](docs/13-DEPLOYMENT.md)
- [Security](docs/15-SECURITY.md)
- [Identity master-data seed](docs/17-IDENTITY-MASTER-DATA-SEED.md)

The README in each bounded context is the local feature inventory. Auth, Catalog, and Pricing document implemented contracts; the remaining context READMEs document scaffold scope and limitations.

## Local development

### Prerequisites

- Node.js 22 or newer
- pnpm 11.17 or another compatible pnpm 11 release
- Docker Desktop or another Docker runtime
- An externally managed PostgreSQL schema containing the identity/RBAC tables required by auth

### Start the API

```bash
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d postgres
pnpm start:dev
```

On PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

The API listens on `http://localhost:3000` by default. The compose file starts PostgreSQL only; it does not run migrations or seed data. Run the identity master-data command after the required external schema/migrations are available.

**Build-layout note:** the current Nest monorepo build emits the entry point at `dist/apps/api/apps/api/src/main.js`, while the `start:prod` package script targets `dist/apps/api/main.js`. Align those paths before using the production start command or packaging a deployment image.

| Endpoint                     | Purpose                                                               |
| ---------------------------- | --------------------------------------------------------------------- |
| `GET /api`                   | Version-neutral service metadata                                      |
| `GET /api/health/live`       | Process liveness; does not query dependencies                         |
| `GET /api/health/ready`      | Current readiness placeholder; returns `ok` without dependency checks |
| `GET /api/docs`              | Swagger UI when enabled                                               |
| `GET /api/docs/openapi.json` | OpenAPI JSON when docs are enabled                                    |
| `GET /api/docs/openapi.yaml` | OpenAPI YAML when docs are enabled                                    |

Versioned auth routes are served under `/api/v1`. The API wraps successful results and errors in the platform response envelope and includes request, correlation, API-version, timestamp, and optional pagination metadata.

## Common commands

```bash
pnpm start:dev          # development server with watch mode
pnpm start:debug        # watch mode with the Node debugger
pnpm start:prod         # package script; see the build-layout note above
pnpm build              # compile the API and libraries
pnpm lint               # ESLint for apps, libs, and tools
pnpm lint:fix           # ESLint with automatic fixes
pnpm format             # format the repository
pnpm format:check       # verify formatting
pnpm test               # Jest unit and feature tests
pnpm test:unit          # Jest excluding apps/api/test/e2e
pnpm test:e2e           # API e2e configuration
pnpm architecture:check # enforce import boundaries
pnpm seed:identity:check
pnpm seed:identity
pnpm check              # format, architecture, lint, test, and build
```

The seed command reads `tools/seed/identity-rbac-manifest.json`. It inserts or updates identity master data only; it does not create database tables or run migrations. Use `--check-only` to validate the manifest without writing.

## Repository shape

```text
apps/api/                 API composition root, bootstrap, health, metadata, e2e tests
libs/modules/             Business bounded contexts and vertical feature slices
libs/platform/            Config, PostgreSQL/MongoDB, Redis, HTTP, execution, logging, and technical adapters
libs/shared-kernel/       Small domain-neutral errors and primitives
tools/architecture/       Static dependency-boundary check
tools/seed/               Identity/RBAC seed script and manifest
docs/                     Engineering handbook and ADRs
```

Each business context has a root module and `src/public-api.ts`. Cross-context code may import only the public API alias such as `@modules/auth`; implementation paths, SQL, repositories, and feature internals remain private.

## Bounded contexts

The current contexts are `auth`, `user-management`, `organizations`, `patients`, `practitioners`, `file-management`, `catalog`, `pricing`, `inventory`, `orders`, `payments`, `notifications`, `prescriptions`, `appointments`, and `audit`.

Auth, Catalog, and Pricing are composed by `apps/api/src/app.module.ts`. Auth uses flat feature folders with controllers, schemas, services, repositories, and shared workflow/notification helpers. Catalog and Pricing use HTTP feature slices over application services, repository ports, and private PostgreSQL adapters.

The remaining contexts currently use command/handler-oriented vertical slices. Their controllers, DTOs, commands, handlers, modules, tests, and facade contracts describe intended ownership, but the handlers are placeholders and the context modules are not imported by the API composition root.

## Configuration and persistence

Copy `.env.example` to `.env`. The default local configuration enables the PostgreSQL client and authentication, disables MongoDB and Redis, enables Swagger, and uses `DATABASE_HOST`/`DATABASE_NAME`/`DATABASE_USER`/`DATABASE_PASSWORD` unless `DATABASE_URL` is supplied.

The database platform uses a shared `pg` pool, parameterized SQL, and `AsyncLocalStorage` to reuse the current transaction client. The execution interceptor wraps HTTP handlers in one logged operation and PostgreSQL transaction by default. Controllers marked `@NonTransactional()`—including metadata, health, and auth capabilities/JWKS—do not open a transaction. There are no ORM entities, schema synchronization, migrations, or DDL scripts in this repository.

MongoDB and Redis are optional adapters. Set their enabled flags and connection settings only when a feature actually needs them. Never commit credentials, JWT secrets, patient data, payment data, or provider secrets.

## Engineering contract

Before opening a pull request:

```bash
pnpm architecture:check
pnpm format:check
pnpm lint
pnpm test
pnpm build
```

When a public module contract, database assumption, API behavior, runtime boundary, or operational decision changes, update the relevant context README and engineering documentation.
