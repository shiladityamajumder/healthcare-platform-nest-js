# Security architecture notes

- Authentication verifies identity; authorization evaluates permissions/policies. Keep them separate.
- Password hashing/token signing/provider SDKs live under Auth infrastructure, not controllers.
- Use short-lived access tokens, rotation/revocation strategy for refresh tokens, and replay protection.
- Sensitive secrets come from runtime secret management, never repository `.env` files.
- Object/file access uses opaque IDs and authorization checks; do not expose storage-provider bucket paths as authority.
- Payment webhooks require signature verification, idempotency and durable processing.
- Audit security-relevant actions with actor, subject, correlation ID, timestamp and outcome.
- Avoid logging tokens, passwords, health records, payment secrets or file contents.

Before production, perform a dedicated threat model and compliance review for the jurisdictions in which the healthcare platform operates.
