# Shared kernel

<p><img src="https://img.shields.io/badge/Architecture-Framework%20Neutral-334155?logo=typescript&logoColor=white" alt="Framework-neutral shared kernel" /></p>

Small, stable, framework-neutral contracts shared across bounded contexts. If a type belongs to Auth, Orders, Inventory, Patients, or another business context, it does **not** belong here.

## Current contents

- `application/page.ts` — transport-neutral page request/result shapes
- `contracts/integration-event.ts` — versioned integration-event envelope
- `domain/domain-event.ts` — minimal domain-event contract
- `errors/application-error.ts` — stable application, validation, auth, authorization, conflict, timeout, external-service, database, and infrastructure errors

Business modules throw shared-kernel errors without depending on Nest or Fastify. The platform HTTP filter maps those errors to HTTP statuses and the standard API error envelope. Keep this library dependency-free from platform and business modules; avoid turning it into a generic `common/` dumping ground.
