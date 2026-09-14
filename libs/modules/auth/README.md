# 🔐 Authentication bounded context

Identity entry points, credentials, sessions, and verification workflows.

## Ownership

This context owns its HTTP endpoints, application use cases, domain rules, persistence adapters, tests, and cross-module contract. Consumers outside the context may import only `@modules/auth`; implementation paths under `src/features`, `src/domain`, and `src/infrastructure` are private.

## Feature inventory

- `capabilities`
- `registration`
- `login`
- `session-management`
- `password-management`
- `current-user`
- `administration`

Each active workflow is a Nest feature module with its controller and service under
`src/features/<workflow>`. Auth infrastructure is registered once by
`src/infrastructure/auth-infrastructure.module.ts`. Workflow services provide the HTTP-facing
entry points, while repositories live beside the feature that owns the data.

Cross-feature orchestration lives under `src/application/workflow`, contracts live
under `src/contracts`, and infrastructure adapters live under `src/infrastructure`.

The intended feature shape is deliberately flat:

```text
features/<workflow>/
├── <workflow>.module.ts
├── <workflow>.controller.ts
├── <workflow>.service.ts
├── <workflow>.schema.ts
└── <workflow>.repository.ts   # when the feature owns persistence
```

Identity and OTP persistence are in `features/registration`, session persistence
is in `features/session-management`, and role/permission persistence is in
`features/administration`. `src/infrastructure/persistence/auth.repository.ts`
is only a small DI composition facade used by reusable workflow helpers; it
contains no SQL.
Repositories use parameterized SQL through the shared transaction-aware
`PostgresDatabase`. No ORM, entities, schema
synchronization, migration execution, or database table changes are used by this
context.

SQL statements are kept in `src/infrastructure/persistence/sql/auth.sql` and
loaded by the auth persistence adapter. Services contain no SQL and repositories
bind request values separately from SQL text. Repository operations that need a
read-after-write, such as user creation, user updates, RBAC replacement, and
paginated user listing, use one SQL statement with CTEs or window functions.
Argon2 password verification and application token generation remain outside SQL
because they are application responsibilities; those flows may therefore need
more than one database round trip.

The initial port preserves the FastAPI endpoint paths and camel-case request/response fields. Authentication/session operations run inside the existing operation-execution transaction boundary, which supplies unified execution logging and rollback behavior. Public capability and JWKS discovery endpoints are explicitly marked non-transactional.

## Request, logging, and transaction flow

For the API application, auth requests pass through this platform flow:

```text
RequestContextMiddleware
  -> assigns request/correlation IDs and logs response completion
OperationExecutionInterceptor
  -> logs operation start/failure/completion and opens one PostgreSQL transaction
Auth controller -> feature service -> feature repository
  -> every PostgresDatabase.query reuses the active transaction client
ApiResponseInterceptor / ApiExceptionFilter
  -> emits the unified success or error response structure
```

All auth routes are transactional by default. The only exceptions are the two
read-only capabilities/JWKS routes, which use `@NonTransactional()`. Multi-step
flows such as identity creation, OTP consumption, password reset, RBAC
permission replacement, and session rotation therefore commit together or roll
back together. Refresh rotation additionally locks the session row so concurrent
use of one refresh token cannot succeed twice.

The auth module itself does not inject a second logger or open nested
transactions. It uses the platform middleware/interceptor/database layers so
there is one request ID, one operation log, and one transaction boundary per
HTTP operation.

## Swagger

Auth controllers use the reusable decorators in `src/contracts/swagger.ts`. Request schemas
describe required/optional fields and examples; route decorators explain the use case and show
the unified success envelope. Protected routes also expose the required bearer authorization
header and security scheme in `/api/docs`. Session-creation flows document optional
`X-Device-Id` and `X-Device-Type` headers. These decorators change documentation only; they do
not change routes, authentication behavior, or database tables.

## Notification messages

`src/application/notifications/auth-notification-message.service.ts` builds the provider-neutral
SMS/email payload for every OTP flow. It currently covers phone login, phone registration, email
verification, and password recovery. It produces a template key, destination, expiry, plain-text
content, and HTML content for email. `AuthWorkflowService.issueOtp()` stores the challenge first,
then builds the message. The provider dispatch is intentionally left as a commented `TODO` until
the notification service is implemented; no SMS or email is sent yet, and no notification tables
are written.

## Boundary notes

- Keep business rules inside this context.
- Expose only narrow, real contracts through `src/public-api.ts`.
- Keep SQL repositories, query files, and provider adapters private.
- Use integration events or a documented facade for cross-context collaboration.
