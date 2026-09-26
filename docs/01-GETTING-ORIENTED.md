# 📘 Get oriented: this NestJS codebase for developers from other frameworks

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

This guide explains the NestJS codebase for developers coming from other backend frameworks.
This is the recommended first document if you already know backend development but do not know NestJS. It maps familiar ideas from Express, FastAPI, Django, Spring, Rails, ASP.NET, or Laravel to the code in this repository.

The project is a modular monolith: one Node.js process and deployment, with separate business areas kept behind explicit source-code boundaries. The architecture is mature enough to guide development, but many feature handlers are deliberately scaffolds rather than completed healthcare workflows. Treat an existing feature folder as a contract and a starting point, not proof that the endpoint is production-ready.

## 🔹 The shortest useful mental model

NestJS is TypeScript server-side application structure built on top of an HTTP adapter. Here the adapter is Fastify. NestJS gives the project modules, dependency injection, decorators, validation hooks, interceptors, exception filters, and testing helpers.

| If you know                     | The closest idea here                                 | Where to look                               |
| ------------------------------- | ----------------------------------------------------- | ------------------------------------------- |
| Express/Fastify route handler   | Controller method                                     | libs/modules/.../features/_/_.controller.ts |
| FastAPI router + Pydantic model | Controller + request schema                           | Auth `features/<feature>` folders           |
| Django view + form/serializer   | Controller + schema/DTO                               | features/<feature>                          |
| Spring controller/service       | Nest controller + application service                 | Auth `features/<feature>` folders           |
| Rails controller/service object | Controller + service                                  | Auth `features/<feature>` folders           |
| Dependency-injection container  | Nest module providers/imports/exports                 | *.module.ts                                 |
| Middleware                      | Nest middleware, guards, interceptors, filters, pipes | libs/platform/http                          |
| ORM model/entity                | Not used here; raw PostgreSQL row interfaces are used | libs/platform/database/src/schema           |

## 🔹 Core NestJS concepts

Start with a module: it is the dependency container and registration boundary. A feature module registers its controller and application service/handler; AppModule assembles the currently live feature and platform modules.

Controllers translate HTTP requests and responses. Schemas/DTOs describe validated input and public output; they are not database rows or domain objects. Injectable services or handlers coordinate business work through constructor-injected collaborators. Auth, Catalog, and Pricing use application services and private repositories; the remaining contexts still use the scaffolded handler shape.

Decorators beginning with @ are framework wiring: @Module declares a container, @Controller owns a route, @Get/@Post declare endpoints, and @Injectable marks a constructible provider.

## 🔹 Read the repository in this order

1. Read the root README, then docs/02-ARCHITECTURE.md and docs/04-MODULE-BOUNDARIES.md.
2. Open apps/api/src/main.ts, then bootstrap/configure-application.ts, then app.module.ts. This is server creation, global setup, and module wiring.
3. Read docs/03-RUNTIME-FLOW.md and inspect libs/platform/http plus libs/platform/execution.
4. Choose one context in libs/modules, read its README, and follow one feature from controller to schema/DTO, service or handler, repository/port, and test.
5. Use docs/05-LIBS-GUIDE.md and docs/06-LIBS-REFERENCE.md before changing a library.

## 🔹 Where code belongs

- apps/api is the HTTP composition root, not a home for business workflows.
- libs/modules/<context> owns a business capability such as Orders, Inventory, or Patients.
- libs/platform owns reusable technical behavior: HTTP, database, configuration, logging, and execution.
- libs/shared-kernel contains only small domain-neutral primitives.

The aliases in tsconfig.json are boundaries: use @platform/<package> for technical code, @shared/... for stable neutral primitives, and only @modules/<name> to consume another bounded context. Do not import another module internal file.

## 🔹 Before you implement

Choose the owning context first. Define request and response schemas/DTOs if the work is HTTP-facing. Keep the controller thin, put workflow decisions in a service/handler or domain code, use the owner module contract for cross-context work, and add focused tests. Read docs/03-RUNTIME-FLOW.md, docs/05-LIBS-GUIDE.md, docs/10-ADDING-A-FEATURE.md, and docs/11-TESTING.md next.
