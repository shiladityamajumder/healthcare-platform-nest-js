# Pricing bounded context

<p><img src="https://img.shields.io/badge/Domain-Pricing-9333EA?logo=moneygram&logoColor=white" alt="Pricing bounded context" /></p>

Price books, effective prices, promotions/tax inputs, and tax rules.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. Its handlers return `not-implemented`; no pricing route or persistence workflow is live.

## Feature inventory

- `price-books` — manage price books
- `set-price` — set product prices
- `get-effective-price` — resolve an effective price
- `tax-rules` — manage tax rules

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement effective-date and currency rules, deterministic tax behavior, authorization, caching strategy, audit, persistence, and integration tests before activation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/pricing` for cross-context imports. Keep pricing SQL and provider adapters private. Pricing results consumed by orders must cross a documented facade or event contract.
