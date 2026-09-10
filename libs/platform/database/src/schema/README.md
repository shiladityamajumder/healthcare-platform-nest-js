# PostgreSQL row shapes

This directory contains plain TypeScript interfaces describing rows returned by the externally managed PostgreSQL database. They are generated from the authoritative database definitions and are compile-time types only.

They do not create tables, alter the schema, run migrations, synchronize metadata, or perform validation at runtime. Use them as the generic type parameter for `PostgresDatabase.query()` in module-owned raw SQL repositories.

PostgreSQL values are represented according to the `pg` driver defaults used by this project: `BIGINT` and `NUMERIC` are strings to avoid precision loss, `TIMESTAMP WITH TIME ZONE` is `Date`, `DATE` is an ISO date string, `JSONB` is `unknown`, and `BYTEA` is `Buffer`.
