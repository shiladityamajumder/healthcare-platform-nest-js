# Contributing

## Before coding

Read [architecture](02-ARCHITECTURE.md), [module boundaries](04-MODULE-BOUNDARIES.md), and the README for the owning context. Confirm whether the change affects a public contract, schema, security control, or operational behavior.

## Change ownership

Keep a pull request focused on one bounded context or one cross-cutting concern. Cross-context edits are acceptable when the public contract or integration behavior genuinely changes; explain the dependency in the pull request.

Do not move code into `libs/shared-kernel` or `libs/platform` only to remove local duplication. Promote code only when its ownership is stable and its abstraction is genuinely domain-neutral or technical.

## Pull request checklist

- [ ] Scope and owning context are clear.
- [ ] Public API or facade changes have been reviewed by consumers.
- [ ] Database query or table-contract changes are reviewed with the external database owner.
- [ ] Security, audit, privacy, and idempotency impact is addressed.
- [ ] Unit tests cover the business rule.
- [ ] Integration/e2e tests cover relevant boundaries.
- [ ] Documentation and ADRs are updated when required.
- [ ] `pnpm check` passes.

## Local verification

```bash
pnpm architecture:check
pnpm lint
pnpm test
pnpm build
```

Keep commits reviewable and avoid committing generated output, local `.env` files, secrets, or patient data.
