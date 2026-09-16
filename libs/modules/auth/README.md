# Authentication bounded context

<p><img src="https://img.shields.io/badge/Status-Implemented-16A34A?logo=auth0&logoColor=white" alt="Authentication context implemented" /></p>

Identity registration, credentials, verification, sessions, JWTs, current-user access, and RBAC administration. This is the only business bounded context currently imported by `apps/api/src/app.module.ts`.

## Implemented feature areas

- `capabilities` — auth capability flags and `/.well-known/jwks.json` metadata; explicitly non-transactional.
- `registration` — email registration, phone OTP registration, email-verification request, and email verification.
- `login` — password login, phone OTP request, and phone OTP verification.
- `session-management` — refresh rotation, logout, logout-other-sessions, logout-all, list sessions, and revoke one session.
- `password-management` — forgot-password OTP, reset verification, reset, authenticated password change, and password creation.
- `current-user` — get/update `users/me` and read current-user authorization.
- `administration` — user status/session administration, user-role assignments, roles, permissions, and role-permission replacement.
- `identity` — internal identity normalization and persistence helpers used by registration and login; it is not a separate controller.

The controllers, services, repositories, SQL loader, token service, validation schemas, and focused workflow helpers in this context are implemented. The external PostgreSQL schema and identity/RBAC master data must exist before database-backed routes can succeed.

## HTTP surface

The global prefix is `/api` and URI versioning defaults to `v1`, so the normal base is `/api/v1`.

| Area                      | Routes                                                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Capabilities              | `GET /auth/capabilities`, `GET /auth/.well-known/jwks.json`                                                                                                                                   |
| Registration              | `POST /auth/register/email`, `POST /auth/register/phone/request-otp`, `POST /auth/register/phone/verify-otp`, `POST /auth/email-verification/request`, `POST /auth/email-verification/verify` |
| Login                     | `POST /auth/login/password`, `POST /auth/login/phone/request-otp`, `POST /auth/login/phone/verify-otp`                                                                                        |
| Sessions                  | `POST /auth/token/refresh`, `POST /auth/logout`, `POST /auth/logout/others`, `POST /auth/logout/all`, `GET /auth/sessions`, `DELETE /auth/sessions/:sessionId`                                |
| Current user              | `GET /users/me`, `PATCH /users/me`, `GET /auth/users/me/authorization`                                                                                                                        |
| Password                  | `POST /auth/password/forgot`, `POST /auth/password/reset/verify-otp`, `POST /auth/password/reset`, `PUT /auth/password`, `POST /auth/password`                                                |
| User administration       | `GET/PATCH/POST /admin/users...` for user lookup, status, logout-all, and role assignments                                                                                                    |
| Role administration       | `GET/POST/PATCH/DELETE /admin/roles...`, including `PUT /admin/roles/:roleId/permissions`                                                                                                     |
| Permission administration | `GET/POST/PATCH/DELETE /admin/permissions...`                                                                                                                                                 |

See the generated Swagger document at `/api/docs` for request schemas, examples, status codes, bearer security, and the exact nested administration routes.

## Internal structure

```text
src/
├── application/
│   ├── notifications/       provider-neutral OTP message construction
│   └── workflow/            cross-feature identity, OTP, token, and permission workflows
├── contracts/               ports, context helpers, phone validation, Swagger decorators
├── features/
│   ├── administration/      protected RBAC and user administration
│   ├── capabilities/        public capability/JWKS discovery
│   ├── current-user/        authenticated self-service endpoints
│   ├── identity/            identity validation and persistence helpers
│   ├── login/               password and phone login
│   ├── password-management/ password recovery and change
│   ├── registration/        email/phone registration and verification
│   └── session-management/  refresh and session lifecycle
└── infrastructure/
    ├── persistence/         parameterized SQL, SQL loader, and repository adapters
    └── token/               JWT creation, verification, and hashing
```

The public boundary is `src/public-api.ts`, which exports only `AuthModule` and the intentionally narrow `AuthFacade` contract. Consumers must use `@modules/auth`; they must not import feature services, repositories, token adapters, or SQL.

## Persistence and transaction behavior

Auth uses parameterized raw SQL through the shared `PostgresDatabase`; it does not use an ORM, entity metadata, schema synchronization, migrations, or DDL. SQL files are under `src/infrastructure/persistence/sql` and are loaded by the auth persistence adapter. The loader first checks for a compiled SQL asset and then falls back to the source-tree file; verify SQL asset packaging when producing a deployment artifact because the current Nest build reports that this asset pattern is not matched.

The global `OperationExecutionInterceptor` opens one PostgreSQL transaction for normal HTTP handlers. Auth repositories automatically reuse the active transaction client through `AsyncLocalStorage`. Identity creation, OTP consumption, password reset, RBAC changes, and session rotation therefore commit or roll back as one operation. Refresh-token rotation locks the current session row so concurrent reuse cannot rotate the same session twice.

The capabilities and JWKS routes use `@NonTransactional()` so discovery remains available when PostgreSQL is unavailable. All other auth handlers are transactional by default.

## Authentication and authorization behavior

- Passwords are hashed with Argon2; password policy is controlled by `PASSWORD_MIN_LENGTH` and requires three of four character classes.
- Access and refresh tokens are signed separately and include a server-side session identifier.
- Refresh tokens are stored as hashes and rotated on use.
- Protected routes validate both the bearer access token and its active server-side session.
- Administration routes enforce explicit permissions such as `identity.users.read`, `identity.roles.manage`, and `identity.permissions.manage`.
- Registration assigns `DEFAULT_ROLE_CODE` and requires that role to exist in the database.
- OTPs are stored as hashes, expire, are single-use, track attempts, and enforce resend/attempt limits from environment configuration.
- `OTP_DEV_EXPOSE_CODE=true` returns a development OTP in responses. Keep it false outside local development.

`AuthNotificationMessageService` builds provider-neutral SMS/email payloads for login, registration, email verification, and password recovery. Provider dispatch is still a TODO: no SMS/email is sent and no notification row is written by the current auth implementation.

## Request and response flow

```text
RequestContextMiddleware
  -> request/correlation/trace IDs and completion logging
OperationExecutionInterceptor
  -> operation logging and one PostgreSQL transaction
Auth controller
  -> DTO validation -> feature service -> workflow/repository
PostgresDatabase
  -> active transaction client -> parameterized SQL
ApiResponseInterceptor / ApiExceptionFilter
  -> standard success or error envelope
```

Use the shared Swagger decorators in `src/contracts/swagger.ts` when adding routes. Keep request schemas separate from database row shapes and preserve the public response envelope.
