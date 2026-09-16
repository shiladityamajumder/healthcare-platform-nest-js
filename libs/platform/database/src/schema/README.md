# PostgreSQL row shapes

<p><img src="https://img.shields.io/badge/Contract-Row%20Shapes-4169E1?logo=typescript&logoColor=white" alt="PostgreSQL row shape contracts" /></p>

This directory contains plain TypeScript interfaces for rows returned by the externally managed PostgreSQL database. The root export groups shapes by schema, including identity, organization, customer, catalog, clinical, appointment, diagnostics, pricing, commerce, payment, finance, insurance, membership, procurement, warehouse, fulfillment, logistics, notification, support, compliance, risk, platform, and search.

Use these interfaces as the generic row type for `PostgresDatabase.query<Row>()`. Use the fixed `TABLES` constants for known schema-qualified table names; never interpolate user input into SQL identifiers or SQL text.

These files are compile-time contracts only. They do not create tables, alter schemas, run migrations, synchronize metadata, validate runtime input, or replace request DTOs. Keep their property names and PostgreSQL representations synchronized with the authoritative database definitions. With the `pg` defaults used here, `BIGINT` and `NUMERIC` are strings, timestamps with time zone are `Date`, dates are ISO strings, `JSONB` is `unknown`, and `BYTEA` is `Buffer`.
