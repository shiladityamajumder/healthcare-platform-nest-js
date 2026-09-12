# Libraries guide

This is the detailed map for code under libs/. Read it before adding a file or importing from another library.

## Three kinds of library

| Location                | Owns                                                | May depend on                        | Must not become                  |
| ----------------------- | --------------------------------------------------- | ------------------------------------ | -------------------------------- |
| libs/modules/<context>  | Business capability, rules, feature APIs, contracts | Own context, platform, shared-kernel | A shared grab bag                |
| libs/platform/<package> | Reusable technical runtime behavior                 | External technical libraries         | A business module                |
| libs/shared-kernel      | Tiny stable, domain-neutral primitives              | Nothing business/platform-specific   | A common folder for random types |

Dependency direction is inward: controller -> application service/handler -> domain/ports. Infrastructure implements ports and depends inward. A business context can be consumed by another context only through @modules/<name>, which points to public-api.ts.

## A business context

Each directory in libs/modules is a bounded context such as Auth, Orders, Inventory, or Patients. It owns its business decisions and externally visible contract. Its README names the capability and feature inventory; docs/06-LIBS-REFERENCE.md lists every current context and feature.

The root <context>.module.ts registers the context. public-api.ts is the only supported cross-context import surface. contracts/*.facade.ts contains narrow interfaces or tokens for callers that really need a synchronous answer. Auth additionally keeps internal contracts under `src/contracts`, application orchestration under `src/application`, and technical adapters under `src/infrastructure`.

## Feature slice files

Every feature folder is a vertical slice. The repeated file names are deliberate: learn one slice and you can navigate all of them.

| File                              | Job                                              | Write here when                                       |
| --------------------------------- | ------------------------------------------------ | ----------------------------------------------------- |
| <feature>.module.ts               | Registers the controller, service/handler, and providers | You add a provider or feature-level import       |
| <feature>.controller.ts           | Route, schema/DTO binding, HTTP status                  | You expose a use case through HTTP                 |
| <feature>.schema.ts or DTO        | Validated input contract                                | The client can send new input                      |
| <feature>.service.ts              | Coordinates feature business behavior                   | You add workflow decisions                         |
| <feature>.repository.ts           | Owns feature persistence                                | The feature reads or writes its data               |
| application/*.command.ts          | Input object for a scaffolded use case                  | A handler needs explicit structured input          |
| application/*.handler.ts          | Coordinates a scaffolded use case                       | You add handler-based workflow decisions           |
| feature tests                      | Focused behavior proof                                  | You change rules or collaboration expectations     |

Controllers do not contain SQL or complex business branching. Services and handlers do not know raw HTTP request objects. Schemas/DTOs do not double as database rows. This separation is the main reason the files are useful rather than redundant.

Auth's current flat shape is:

```text
features/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.schema.ts
├── <feature>.service.ts
└── <feature>.repository.ts       # only when that feature owns persistence
```

Registration owns identity and OTP repositories, session-management owns
session persistence, and administration owns RBAC persistence. Do not recreate
one giant auth repository or service.

If a handler is currently a not-implemented placeholder, implement the rule, authorization, persistence behavior, audit needs, and tests together. Do not treat the scaffold return value as a usable business result.

## Platform libraries

Platform packages are technical utilities shared by the process. They must not import a business module. Import them through their @platform/<package> alias.

| Package       | Main files and use                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| config        | platform-config.module.ts and platform-configuration.ts load configuration                                                    |
| database      | database.module.ts, postgres/, mongo/, transaction/, and schema/ provide connections, transaction context, and row interfaces |
| http          | http-kernel.module.ts plus context/, errors/, and response/ provide global request behavior                                   |
| execution     | execution.service.ts, interceptor, and decorator provide operation logging and transaction boundaries                         |
| cache         | cache.module.ts is the cache integration seam                                                                                 |
| logging       | logging.module.ts owns runtime logging wiring                                                                                 |
| observability | observability.module.ts is the metrics/tracing seam                                                                           |
| messaging     | messaging.module.ts is the asynchronous messaging seam                                                                        |
| security      | security.module.ts is the shared security-policy seam                                                                         |

Most of these packages are intentionally light scaffolds. Add an integration only when a real use case needs it; keep provider-specific code behind the platform package rather than leaking an SDK into a business module.

## Database schema files

libs/platform/database/src/schema is a catalog of TypeScript row interfaces, grouped by database domain such as identity, customer, clinical, catalog, commerce, payment, warehouse, and platform. A file like schema/catalog/products.ts describes the columns returned by catalog.products. index.ts files re-export the group; table-names.ts centralizes table identifiers.

These are not ORM entities: they do not own migrations, synchronize tables, or contain business behavior. Use them to type parameterized raw SQL in the owning repository. Keep table writes in the owning bounded context even though the row interface is centrally visible.

## Shared kernel

shared-kernel contains Entity, DomainEvent, IntegrationEvent, ApplicationError, and Page primitives. Use one only when the concept is stable and has the same meaning in many contexts. Context-specific concepts must stay in their owner module.

## How to write code in libs

1. Pick the owning context; do not place business logic in apps/api or platform.
2. Copy the shape of the nearest feature, not just a class name.
3. Add DTO/controller code only for an HTTP boundary.
4. Put orchestration in the service or handler and reusable rules in domain code.
5. Depend on a port or facade, never another context internal path.
6. Keep provider and SQL details private to infrastructure or platform.
7. Register the new provider/module and write a focused feature test.
8. Run pnpm architecture:check, pnpm lint, pnpm test, and pnpm build.

For the actual package and feature inventory, use docs/06-LIBS-REFERENCE.md. For the full feature checklist, use docs/10-ADDING-A-FEATURE.md.
