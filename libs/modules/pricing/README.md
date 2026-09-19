# Pricing bounded context

<p><img src="https://img.shields.io/badge/Domain-Pricing-9333EA?logo=moneygram&logoColor=white" alt="Pricing bounded context" /></p>

Price books, effective prices, promotions/tax inputs, and tax rules.

## Current status

This context is implemented and composed into the API. It uses validated transport DTOs, an application service behind a repository port, and parameterized PostgreSQL persistence against the externally managed `pricing` schema.

## Feature inventory

- `price-books` — list, create, retrieve, version-check, deactivate, and reactivate effective-dated books
- `product-prices` — list and create non-overlapping effective-dated product prices
- `tax-rules` — list, create, retrieve, version-check, deactivate, and reactivate tax rules

The HTTP paths mirror the former product service under `/api/v1`: `/price-books`, `/product-prices`, and `/tax-rules`. Inventory, order, checkout, payment, promotion-redemption, and effective-price evaluation workflows are not part of this implementation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/pricing` for cross-context imports. Keep pricing SQL and provider adapters private. Pricing results consumed by orders must cross a documented facade or event contract.
