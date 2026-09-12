# Security architecture

Security controls belong in the design of each workflow, not only in middleware. Healthcare data and payment flows require explicit authorization, auditability, and operational review.

## Identity and access

- Authentication establishes identity; authorization evaluates permissions and resource policy.
- Keep token signing, password hashing, refresh-token rotation, revocation, and replay protection in auth's application/infrastructure collaborators (`libs/modules/auth/src/application` and `libs/modules/auth/src/infrastructure`).
- Enforce tenant, organization, patient, practitioner, and resource ownership checks in the application use case.
- Use least-privilege service accounts and database roles.

## Sensitive workflows

- Files are accessed through opaque identifiers and authorization checks; storage paths are not authority.
- Payment webhooks require signature verification, idempotency, replay protection, and durable processing.
- Security-relevant actions record actor, subject, action, correlation ID, timestamp, and outcome in the audit context.
- Never log tokens, passwords, health records, payment secrets, or file contents.
- Validate and constrain all external input; do not trust client-supplied organization or user identifiers.

## Secrets and configuration

Secrets belong in runtime secret management. `.env.example` may contain names and safe local defaults, but never real credentials or signing keys. Replace the sample JWT secrets before any non-local deployment.

## Release requirements

Before production, complete a threat model, dependency and container scanning, penetration testing appropriate to risk, incident-response procedures, backup/restore validation, retention review, and jurisdiction-specific privacy/compliance review.

The scaffold documents security direction; it does not certify the implementation or satisfy regulatory obligations on its own.
