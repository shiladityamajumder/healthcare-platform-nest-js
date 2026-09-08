# API conventions

- URI versioning: `/api/v1/...`.
- Each feature owns its controller and DTOs.
- Controllers are thin: authentication/authorization metadata, transport validation, call a use case, return result.
- Stable success envelope and error envelope are platform-level HTTP concerns.
- The global envelope is `{ success, message, data, error, meta }`; `meta` carries request, correlation, API-version and timestamp context.
- Throw shared-kernel application errors from use cases; do not construct HTTP error responses in domain or application code.
- Pagination, idempotency keys and correlation/request IDs should be standardized globally.
- Never leak TypeORM entities or external-provider responses as public API models.
- Breaking API changes require a new API version or explicit migration plan.

## Recommended route ownership

```text
Auth registration  -> libs/modules/auth/src/features/registration/api/http/v1
File upload        -> libs/modules/file-management/src/features/initiate-upload/api/http/v1
Notification send  -> libs/modules/notifications/src/features/send-notification/api/http/v1
```

There is intentionally no shared `apps/api/controllers` folder.
