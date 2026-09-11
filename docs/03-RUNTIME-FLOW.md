# Runtime and request flow

This guide follows the actual startup and request path in the current repository, separating NestJS wiring from feature behavior.

## Current-state note

The current AppModule composes platform libraries, BaseModule, and HealthModule. Most feature slices under libs/modules are scaffolds and are not automatically live endpoints until their context module is imported into AppModule and their handler is implemented.

## Startup path

1. apps/api/src/main.ts creates Nest with FastifyAdapter.
2. Nest resolves AppModule imports and providers.
3. Platform modules initialize configuration, logging, database, HTTP behavior, and cache.
4. configureApplication applies the API prefix, URI versioning, validation, Swagger, and shutdown hooks.
5. The app listens on PORT, defaulting to 3000.

Main files: main.ts starts the process; bootstrap/configure-application.ts configures global HTTP behavior; app.module.ts is the runtime wiring map.

## Request path

Client -> Fastify -> prefix/version routing -> request context -> DTO validation -> controller -> execution boundary -> handler -> domain/ports -> repository or provider -> database -> response interceptor -> client.

## HTTP kernel

HttpKernelModule registers RequestContextMiddleware, OperationExecutionInterceptor, ApiResponseInterceptor, and ApiExceptionFilter. Do not duplicate ordinary response envelopes, exception serialization, logging, or request IDs in every controller.

ValidationPipe transforms input, allows only DTO-declared fields, and rejects unknown fields. That is why request DTOs are part of the public API contract.

## Execution and data

For ordinary controller work, OperationExecutionInterceptor calls ExecutionService. It records the operation and normally opens a PostgreSQL transaction. An exception rolls the transaction back and is then handled by the API exception filter. Use @NonTransactional only for endpoints such as health checks that must work while PostgreSQL is unavailable.

A handler coordinates the use case. It should not depend on HTTP details or run raw SQL directly. Repositories use PostgresDatabase or the supplied SQL executor so queries join the active transaction. Schema files describe database row shapes; they do not create tables or run migrations.

## Trace a feature

1. Find the route in api/http/v1/<feature>.controller.ts.
2. Read its request and response DTOs.
3. Follow the command/query to application/<feature>.handler.ts.
4. Follow only the owner module domain and infrastructure collaborators.
5. Read **tests**/<feature>.handler.spec.ts for expected behavior.
6. Check the context module and AppModule to confirm the endpoint is actually composed.

For a 404 inspect route/version/module registration. For validation failure inspect the request DTO. For response shape inspect the response interceptor and API conventions. For transaction problems inspect ExecutionService and repository executor use.
