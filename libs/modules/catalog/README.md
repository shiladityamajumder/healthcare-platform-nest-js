# Catalog bounded context

<p><img src="https://img.shields.io/badge/Domain-Catalog-0891B2?logo=databricks&logoColor=white" alt="Catalog bounded context" /></p>

Products, brands, categories, and supporting product taxonomy.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. All current handlers return `not-implemented`; the database schema interfaces exist in the platform library, but this context has no live repository workflow.

## Feature inventory

- `brands` — brand management
- `categories` — category management
- `create-product` — product creation
- `get-product` — product retrieval
- `list-products` — product listing
- `update-product` — product updates

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement product identifiers, taxonomy relationships, validation, authorization, persistence, search/list pagination, audit, and integration tests before activation.

## Boundary rules

Use only `src/public-api.ts` through `@modules/catalog` from outside the context. Keep product persistence and provider adapters private. Database row shapes under `@platform/database` describe the externally managed schema; they do not create or synchronize catalog tables.
