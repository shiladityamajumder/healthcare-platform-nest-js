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

## Reading paths

### New contributor

1. [Project README](../README.md)
2. [Architecture](ARCHITECTURE.md)
3. [Module boundaries](MODULE-BOUNDARIES.md)
4. [Contributing](CONTRIBUTING.md)
5. [Adding a feature](ADDING-A-FEATURE.md)

### API or domain work

1. [API conventions](API-CONVENTIONS.md)
2. [Bounded-context template](MODULE-TEMPLATE.md)
3. [Database conventions](DATABASE.md)
4. [Testing strategy](TESTING.md)

### Operations and security

1. [Deployment model](DEPLOYMENT.md)
2. [Observability](OBSERVABILITY.md)
3. [Security architecture](SECURITY.md)

### Architectural history

The [ADR index](ADR/) contains the accepted decisions behind the modular monolith, feature slices, persistence ownership, and cross-module communication model.

## Documentation standards

- Document the current behavior, not the intended end state.
- Prefer small, durable rules over implementation narration.
- Link to source-of-truth code or configuration where a detail is likely to change.
- Update the relevant document in the same pull request as the behavior change.
- Use an ADR for decisions that affect multiple modules, data ownership, public contracts, or operational topology.
- Mark planned work as planned; do not describe scaffolding as a completed capability.

## Scope note

This handbook describes the repository architecture and engineering practices. Healthcare privacy, security, retention, and regulatory obligations still require a product-specific threat model, legal review, and operational controls before production deployment.
