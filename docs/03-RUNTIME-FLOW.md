# Runtime and request flow

This guide follows the actual startup and request path in the current repository, separating NestJS wiring from feature behavior.

## Current-state note

The current AppModule composes platform libraries, BaseModule, HealthModule, and AuthModule. Auth routes are live; most other feature slices under libs/modules are scaffolds and are not automatically live endpoints until their context module is imported into AppModule and their service/handler is implemented.

## Startup path

1. apps/api/src/main.ts creates Nest with FastifyAdapter.
2. Nest resolves AppModule imports and providers.
3. Platform modules initialize configuration, logging, database, HTTP behavior, and cache.
4. configureApplication applies the API prefix, URI versioning, validation, Swagger, and shutdown hooks.
5. The app listens on PORT, defaulting to 3000.

Main files: main.ts starts the process; bootstrap/configure-application.ts configures global HTTP behavior; app.module.ts is the runtime wiring map.

## Request path

Client -> Fastify -> prefix/version routing -> request context -> schema/DTO validation -> controller -> execution boundary -> service/handler -> repository or provider -> database -> response interceptor -> client.

## HTTP kernel

HttpKernelModule registers RequestContextMiddleware, OperationExecutionInterceptor, ApiResponseInterceptor, and ApiExceptionFilter. Do not duplicate ordinary response envelopes, exception serialization, logging, or request IDs in every controller.

ValidationPipe transforms input, allows only DTO-declared fields, and rejects unknown fields. That is why request DTOs are part of the public API contract.

## Execution and data

For ordinary controller work, OperationExecutionInterceptor calls ExecutionService. It records the operation and normally opens a PostgreSQL transaction. An exception rolls the transaction back and is then handled by the API exception filter. Use @NonTransactional only for endpoints such as health checks that must work while PostgreSQL is unavailable.

A service or handler coordinates the use case. It should not depend on HTTP details or run raw SQL directly. Repositories use PostgresDatabase or the supplied SQL executor so queries join the active transaction. Request schema files validate transport input; database row interfaces describe returned columns and do not create tables or run migrations.

Auth follows this concrete path:

```text
features/<feature>/<feature>.controller.ts
  -> <feature>.schema.ts
  -> <feature>.service.ts
  -> feature repository or application/workflow/auth-workflow.service.ts
  -> PostgresDatabase.query()
```

Its registration, password, session, OTP, and RBAC writes are rolled back as a
unit when any step fails. Refresh rotation additionally uses a row lock to
prevent two concurrent requests from consuming one refresh token.

## Trace a feature

1. Find the route in `features/<feature>/<feature>.controller.ts`.
2. Read its request schema/DTO.
3. Follow the feature service or application handler.
4. Follow only the owner module repository, domain, and infrastructure collaborators.
5. Read the feature tests for expected behavior.
6. Check the context module and AppModule to confirm the endpoint is actually composed.

For a 404 inspect route/version/module registration. For validation failure inspect the request DTO. For response shape inspect the response interceptor and API conventions. For transaction problems inspect ExecutionService and repository executor use.
