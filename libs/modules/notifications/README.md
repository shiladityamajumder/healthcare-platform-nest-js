# Notifications bounded context

<p><img src="https://img.shields.io/badge/Domain-Notifications-DB2777?logo=maildotru&logoColor=white" alt="Notifications bounded context" /></p>

Notification requests, templates, user preferences, and delivery status.

## Current status

This context is a command/handler-oriented scaffold and is not imported by the API composition root. All current handlers return `not-implemented`; provider dispatch and notification persistence are not live.

## Feature inventory

- `send-notification` — submit a notification for delivery
- `templates` — manage notification templates
- `preferences` — manage user channel preferences
- `delivery-status` — inspect delivery state

Each feature contains the intended module, controller, command, request/response DTOs, handler, and focused test shape. Implement provider adapters, retries, idempotency, template rendering, preference enforcement, delivery callbacks, redaction, audit, and integration tests before activation.

Auth currently builds provider-neutral OTP messages in its own application layer, but it does not dispatch them through this context yet.

## Boundary rules

Consumers may import only `src/public-api.ts` through `@modules/notifications`. Keep provider credentials, message payloads, queues, and delivery persistence private. Never log OTPs, access tokens, or notification secrets.
