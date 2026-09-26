# 📘 Libraries reference

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

This catalog is the current navigation index for libs/. Most scaffolded feature folders use the command/handler pattern explained in 05-LIBS-GUIDE.md. Auth is the implemented service-based variant with feature controllers, schemas, services, and focused repositories. Many non-auth handlers are scaffolds; the catalog describes code shape, not production readiness.

## 🔹 Business contexts and feature slices

| Context         | Feature folders                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| appointments    | availability, book-appointment, cancel-appointment, reschedule-appointment                               |
| audit           | get-audit-entry, search-audit-log                                                                        |
| auth            | capabilities, registration, login, session-management, password-management, current-user, administration |
| catalog         | brands, categories, create-product, get-product, list-products, update-product                           |
| file-management | complete-upload, delete-file, generate-download-url, get-file, initiate-upload                           |
| inventory       | adjust-stock, get-stock, release-reservation, reserve-stock, transfer-stock, warehouses                  |
| notifications   | delivery-status, preferences, send-notification, templates                                               |
| orders          | cancel-order, create-order, get-order, list-orders, returns, update-status                               |
| organizations   | create-organization, facilities, get-organization, update-organization                                   |
| patients        | addresses, consents, create-profile, get-profile, update-profile                                         |
| payments        | capture-payment, create-payment, refund-payment, webhook                                                 |
| practitioners   | create-profile, get-profile, licenses, update-profile                                                    |
| prescriptions   | attach-document, create-prescription, get-prescription, review-prescription                              |
| pricing         | get-effective-price, price-books, set-price, tax-rules                                                   |
| user-management | activate-user, create-user, get-user, list-users, roles, update-user                                     |

Every context also contains a root module, public API entry point, contract facade, and README. Most scaffolded feature folders contain the repeated command/handler pattern described in 05-LIBS-GUIDE.md. Auth instead keeps each feature's controller, schema, service, and feature-owned repository together, with cross-feature contracts under `src/contracts`, orchestration under `src/application/workflow`, and adapters under `src/infrastructure`.

## 🔹 Platform packages

| Package       | Source areas                                                      | Purpose                                                    |
| ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| cache         | cache.module.ts, index.ts                                         | Future shared cache wiring seam                            |
| config        | platform-config.module.ts, platform-configuration.ts, index.ts    | Environment/configuration loading                          |
| database      | database.module.ts; postgres; mongo; transaction; schema          | Connections, transaction handling, and typed row contracts |
| execution     | execution.module.ts, execution.service.ts, interceptor, decorator | Operation logging and transaction boundary                 |
| http          | http-kernel.module.ts; context; errors; response                  | Middleware, exception handling, response formatting        |
| logging       | logging.module.ts, index.ts                                       | Runtime logging seam                                       |
| messaging     | messaging.module.ts, index.ts                                     | Asynchronous messaging seam                                |
| observability | observability.module.ts, index.ts                                 | Metrics/tracing seam                                       |
| security      | security.module.ts, index.ts                                      | Shared security policy seam                                |

## 🔹 Database row-contract groups

The database schema tree has an index.ts plus one row-interface file per table. The groups are appointment, catalog, clinical, commerce, compliance, customer, diagnostics, finance, fulfillment, identity, insurance, logistics, marketplace, membership, notification, organization, payment, platform, pricing, procurement, risk, search, support, and warehouse. Each file name is the corresponding table name, such as schema/catalog/products.ts or schema/payment/payment_intents.ts.

## 🔹 Shared kernel files

| File                                            | Purpose                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| application/page.ts                             | Shared pagination/result primitive                 |
| contracts/integration-event.ts                  | Stable event contract for asynchronous integration |
| domain/entity.ts                                | Minimal base entity with an identifier             |
| domain/domain-event.ts                          | Minimal domain-event base contract                 |
| errors/application-error.ts and errors/index.ts | Shared application error model and exports         |

Do not add a context-specific model here. If removing a type from shared-kernel would affect only one business area, it belongs in that area instead.
