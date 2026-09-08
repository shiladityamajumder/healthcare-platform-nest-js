# Contributing

## Ownership

Use CODEOWNERS per bounded context. Routine work in Auth, Files and Notifications should occur in different directory trees.

## Pull requests

Prefer one bounded context/feature per PR. If a change requires edits across several modules, document why and whether the public contract should change instead.

## Shared-code rule

Do not move code into `shared-kernel` or `platform` merely to avoid duplication. Two small duplicated functions are often cheaper than coupling unrelated domains. Extract only stable technical or domain-neutral abstractions.

## Before pushing

```bash
pnpm architecture:check
pnpm lint
pnpm test
pnpm build
```
