# Engineering documentation

This directory is the maintained engineering handbook for the Healthcare Platform Backend. It records decisions that should remain stable across feature work, reviews, and deployments.

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Modular%20Monolith-6B46C1" alt="Modular monolith" />
  <img src="https://img.shields.io/badge/API-Fastify-000000?logo=fastify&logoColor=white" alt="Fastify API" />
  <img src="https://img.shields.io/badge/Data-PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL data platform" />
</p>

> **Implementation snapshot:** `AuthModule`, `CatalogModule`, and `PricingModule` are composed into the API. Authentication/session/RBAC, product catalog/reference masters, and core price/tax workflows are implemented; the other bounded contexts remain command/handler scaffolds until their handlers and persistence workflows are completed.

## Reading paths

### New to NestJS or this codebase

1. [Get oriented](01-GETTING-ORIENTED.md) — a framework-neutral mental model and a practical reading route.
2. [Runtime flow](03-RUNTIME-FLOW.md) — follow an HTTP request from Fastify through NestJS, the libraries, and PostgreSQL.
3. [Libraries guide](05-LIBS-GUIDE.md) — what belongs in `libs/`, how its layers connect, and where to add code.
4. [Libraries reference](06-LIBS-REFERENCE.md) — the complete package and feature inventory.

### New contributor

1. [Project README](../README.md)
2. [Architecture](02-ARCHITECTURE.md)
3. [Module boundaries](04-MODULE-BOUNDARIES.md)
4. [Contributing](12-CONTRIBUTING.md)
5. [Adding a feature](10-ADDING-A-FEATURE.md)

### API or domain work

1. [API conventions](07-API-CONVENTIONS.md)
2. [Bounded-context template](09-MODULE-TEMPLATE.md)
3. [Database conventions](08-DATABASE.md)
4. [Testing strategy](11-TESTING.md)

### Operations and security

1. [Deployment model](13-DEPLOYMENT.md)
2. [Observability](14-OBSERVABILITY.md)
3. [Security architecture](15-SECURITY.md)
4. [Identity master-data seed](17-IDENTITY-MASTER-DATA-SEED.md)

### Architectural history

The [ADR](16-ADR.md) contains the accepted decisions behind the modular monolith, feature slices, persistence ownership, and cross-module communication model.

## Documentation coverage

All documents in this folder are kept intentionally: onboarding, architecture, API, persistence, testing, deployment, observability, security, contribution rules, templates, and architectural decisions address different stages of development. The four learning guides above complement them; they do not replace the detailed reference documents.

## Documentation standards

- Document the current behavior, not the intended end state.
- Prefer small, durable rules over implementation narration.
- Link to source-of-truth code or configuration where a detail is likely to change.
- Update the relevant document in the same pull request as the behavior change.
- Use an ADR for decisions that affect multiple modules, data ownership, public contracts, or operational topology.
- Mark planned work as planned; do not describe scaffolding as a completed capability.

## Scope note

This handbook describes the repository architecture and engineering practices. Healthcare privacy, security, retention, and regulatory obligations still require a product-specific threat model, legal review, and operational controls before production deployment.
