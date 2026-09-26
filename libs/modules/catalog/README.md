# 🧾 Catalog bounded context

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p><img src="https://img.shields.io/badge/Domain-Catalog-0891B2?logo=databricks&logoColor=white" alt="Catalog bounded context" /></p>

<p align="center">
  <img src="../../../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

Products, brands, categories, and supporting product taxonomy.

## 📍 Current status

This context is implemented and composed into the API. It uses transport DTOs, an application service behind a repository port, and parameterized PostgreSQL persistence against the externally managed `catalog` schema.

## 🧩 Feature inventory

- `products` — create, retrieve, search, list, update, replace details, bulk status, deactivate, and reactivate products
- `brands` — list and lifecycle management
- `manufacturers` — list and lifecycle management
- `categories` — hierarchical list/tree and lifecycle management
- `salts` — list and lifecycle management
- `dosage-forms` — list and lifecycle management
- `units` — list and lifecycle management

The HTTP paths mirror the former product service under `/api/v1`: `/products`, `/brands`, `/manufacturers`, `/categories`, `/salts`, `/dosage-forms`, and `/units`. Product aggregates include variants, identifiers, salts, attributes, localized content, media, and regulatory data.

Inventory-dependent filters and availability calculations are deliberately excluded. Product summaries therefore return `availableQuantity` as `"0"` until an inventory boundary is implemented. The module does not create or modify database schemas.

## 🔒 Boundary rules

Use only `src/public-api.ts` through `@modules/catalog` from outside the context. Keep product persistence and provider adapters private. Database row shapes under `@platform/database` describe the externally managed schema; they do not create or synchronize catalog tables.
