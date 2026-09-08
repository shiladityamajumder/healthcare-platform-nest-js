# Testing strategy

## Feature unit tests

Located with the feature under `__tests__`. Mock ports, not framework internals.

## Module integration tests

Test repository adapters against a real disposable PostgreSQL database/container where SQL behavior matters.

## Contract tests

Protect public module facades and external provider adapters.

## E2E tests

`apps/api/test/e2e` covers high-value user journeys across modules, not every validation branch.

## Architecture tests

`pnpm architecture:check` prevents forbidden dependencies and should run before unit tests in CI.
