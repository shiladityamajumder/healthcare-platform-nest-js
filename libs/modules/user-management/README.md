# UserManagement bounded context

Owns its HTTP endpoints, application use cases, domain model, persistence adapters, tests, and public cross-module contract.

## Dependency rule

Code outside this module may import only `@modules/user-management`. It must never import this module's `src/features`, `src/domain`, or `src/infrastructure` paths directly.
