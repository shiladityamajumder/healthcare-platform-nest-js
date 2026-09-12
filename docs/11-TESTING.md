# Testing strategy

Tests should provide fast feedback at the lowest level that proves the behavior, with a small number of high-value end-to-end journeys.

## Test layers

| Layer        | Purpose                                                     | Typical location                |
| ------------ | ----------------------------------------------------------- | ------------------------------- |
| Unit         | Business rules and services/handlers with ports mocked      | Feature test directories         |
| Integration  | Repository, SQL, transaction, and provider adapter behavior | Context test suites             |
| Contract     | Public facades, events, and external provider contracts     | Context or platform tests       |
| E2E          | High-value HTTP journeys across the composed application    | `apps/api/test/e2e`             |
| Architecture | Forbidden dependency detection                              | `pnpm architecture:check`       |

Mock ports and contracts, not NestJS internals. Use disposable real infrastructure when SQL behavior, transaction semantics, serialization, or provider integration is the behavior under test.

## Commands

```bash
pnpm test
pnpm test:unit
pnpm test:e2e
pnpm architecture:check
```

## Expectations

- Test success, validation, authorization, conflict, retry, and failure paths.
- Add regression coverage for every production bug.
- Keep tests deterministic and independent; avoid shared mutable state.
- Do not treat a generated service/handler that returns `not-implemented` as feature coverage.
- E2E tests should exercise stable user journeys, not duplicate every unit-level validation case.
