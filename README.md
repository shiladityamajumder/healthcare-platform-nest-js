# Healthcare Platform Backend — NestJS Modular Monolith

A production-oriented **modular monolith** skeleton: one deployable NestJS application, many strongly isolated bounded contexts.

This repository intentionally separates business capabilities more aggressively than a conventional `controllers/services/entities` Nest project. The goal is to let teams work on Auth, Files, Notifications, Orders, Inventory, Payments, etc. with minimal shared-file contention and clear extraction boundaries if any module becomes a microservice later.

## Start here

1. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
2. Read [`docs/MODULE-BOUNDARIES.md`](docs/MODULE-BOUNDARIES.md) before adding imports.
3. Use [`docs/ADDING-A-FEATURE.md`](docs/ADDING-A-FEATURE.md) for feature work.
4. Run `pnpm architecture:check` in CI and locally.

## Important rule

A module owns its API, application logic, domain model and persistence adapters. There is no global business `controllers/`, `services/`, `repositories/`, `dto/`, or `entities/` folder.

## Local bootstrap

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm start:dev
```

Swagger: `http://localhost:3000/docs`
Health: `GET /api/health/live`

The generated feature handlers are placeholders by design; business implementation comes next.
