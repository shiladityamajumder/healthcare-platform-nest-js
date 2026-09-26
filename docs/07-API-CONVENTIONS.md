# 📘 API conventions

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="72" alt="NestJS logo" />
</p>

<p align="center">
  <img src="../assets/readme/healthcare-platform-banner.png" alt="Abstract healthcare platform backend architecture banner" width="100%" />
</p>

The HTTP API is versioned, typed at the boundary, and consistent in success and failure responses. Controllers translate transport concerns; application services or handlers own use-case orchestration.

## 🔹 Addressing

- Global prefix: `/api` by default (`API_PREFIX`).
- URI versioning: `/v1` by default (`API_VERSION`).
- A typical feature route is `/api/v1/auth/login`.
- Health routes are version-neutral: `/api/health/live` and `/api/health/ready`.
- Swagger UI is `/api/docs` by default when `DOCS_ENABLED=true` (the `/api` segment follows `API_PREFIX`).

Auth Swagger documentation is explicit: auth request DTOs describe each field, controllers
describe the purpose and success response of every operation, and protected routes declare the
required `Authorization: Bearer <access-token>` header. Login, registration, OTP, refresh, and
password-recovery routes are public; current-user, session-management, password change/set, and
administration routes require the bearer access token. Optional `X-Device-Id` and
`X-Device-Type` headers are documented on flows that create or rotate a session.

Breaking changes require a new API version or a documented migration plan. Do not silently change the meaning of an existing field.

## 🔹 Response envelopes

Successful responses use:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "error": null,
  "meta": {
    "requestId": "...",
    "correlationId": "...",
    "apiVersion": "v1",
    "timestamp": "2026-01-01T00:00:00.000Z"
  }
}
```

Errors use `success: false`, `data: null`, and an error object containing a stable `code` and non-sensitive `details`. Pagination metadata belongs under `meta.pagination`.

Swagger success examples show this complete envelope, including `meta.requestId`,
`meta.correlationId`, `meta.apiVersion`, and `meta.timestamp`, so the interactive documentation
matches the response produced by `ApiResponseInterceptor`.

## 🔹 Controller rules

- Keep controllers thin: validation, authorization metadata, service/handler invocation, and transport mapping.
- Use request schemas/DTOs; do not expose persistence models or provider responses.
- Use `ValidationPipe` rules already configured at bootstrap: transformation, whitelisting, and rejection of unknown properties.
- Map business failures to shared application errors. Domain and application layers must not construct HTTP responses.
- Preserve `X-Request-ID`, `X-Correlation-ID`, and `X-API-Version` for supportability.

## 🔹 Write safety

Use idempotency keys for retryable commands that create or mutate financial, inventory, appointment, or externally visible state. Validate webhook signatures before parsing business payloads and make delivery processing idempotent.
