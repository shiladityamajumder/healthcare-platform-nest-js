# Identity master-data seed

The NestJS equivalent of `auth_service/scripts/seed_identity_master_data.py` is
[`tools/seed/seed-identity-master-data.ts`](../tools/seed/seed-identity-master-data.ts),
with its static RBAC manifest in
[`tools/seed/identity-rbac-manifest.json`](../tools/seed/identity-rbac-manifest.json).

## Why this exists

The identity service and the NestJS platform share the externally managed
PostgreSQL `identity` schema. This command installs the canonical RBAC master
data needed by authentication and authorization:

- managed permissions;
- managed system roles;
- exact role-to-permission mappings.

It is safe to run repeatedly. Each run takes one PostgreSQL transaction,
serializes concurrent runs with an advisory lock, creates missing records,
updates managed definitions, and removes stale mappings only for roles owned by
this manifest.

The seed deliberately does not create users, user profiles, memberships,
facilities, API clients, credentials, or any other business data. It also does
not delete roles or permissions outside the manifest. Permissions are
capabilities only; domain services must still enforce ownership, scope,
purpose-of-use, consent, and other domain invariants.

## Prerequisites

- Run the externally owned `healthcare_db` identity migrations first.
- Use Node.js 22+ and pnpm 11.
- Copy `.env.example` to `.env` and set valid PostgreSQL values.
- Keep `DATABASE_ENABLED=true` (the default) because the seed needs the
  PostgreSQL adapter.
- Ensure `DEFAULT_ROLE_CODE` is one of the seeded roles; it defaults to
  `customer`.

## Run it

From `healthcare-platform-nest-js/`:

```bash
pnpm install --frozen-lockfile
pnpm seed:identity:check
pnpm seed:identity
```

Use the check command whenever you only want to validate the static manifest;
it does not load NestJS or connect to PostgreSQL.

The normal command loads `.env` through the same Nest configuration module as
the API, opens one PostgreSQL transaction, and prints created/updated/removal
counts. A successful second run should report zero changes.

PowerShell uses the same pnpm commands. To run with an explicitly selected
environment, set the variables before invoking the command, for example:

```powershell
$env:DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/healthcare'
pnpm seed:identity
```

## Operational notes

Run this after a fresh database migration and before registering users or
starting workflows that require role resolution. Review the output in deployment
logs. If the command fails, its transaction is rolled back; resolve the database
or manifest issue and rerun it.
