# Database platform

<p><img src="https://img.shields.io/badge/Platform-PostgreSQL%20%7C%20MongoDB-4169E1?logo=postgresql&logoColor=white" alt="Database platform" /></p>

Shared database adapters for the externally managed healthcare PostgreSQL database, with optional MongoDB support.

## PostgreSQL

`PostgresDatabase` owns one `pg` connection pool and exposes:

- `query<Row>(text, values)` for parameterized SQL;
- `transaction(work)` for `BEGIN`/`COMMIT`/`ROLLBACK` lifecycle;
- automatic reuse of the active transaction client through `AsyncLocalStorage`.

Repositories must pass values separately from SQL text, use the supplied `SqlExecutor`/`PostgresDatabase`, and never create a second pool or commit inside a repository. `TABLES` contains fixed schema-qualified identifiers for the external database, and the exported row interfaces provide compile-time query result shapes.

## MongoDB

`MongoDatabase` is an optional adapter. Set `MONGO_ENABLED=true` and provide `MONGO_URI` and `MONGO_DATABASE` to create/connect the client. It exposes `db`, `isEnabled`, and `ping()` and closes the client during shutdown. No current API feature requires MongoDB.

## Scope and limitations

This library does not use an ORM and does not run migrations, DDL, schema synchronization, or seed operations. The PostgreSQL schema must exist before the API starts handling database-backed routes. The identity/RBAC seed is a separate command under `tools/seed` and only writes master data.
