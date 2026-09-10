# Database platform

The application uses PostgreSQL through the `pg` driver and parameterized raw SQL. The database already exists before the NestJS process starts; this library does not use an ORM, entities, synchronization, migrations, DDL, or seed execution.

Use the exported `TABLES` constants and `PostgresDatabase` from `@platform/database` in module-owned SQL repositories for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations.
