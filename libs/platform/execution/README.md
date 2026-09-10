# Execution platform

`ExecutionService` is the single application-operation boundary. It logs start, success, expected rejection, timeout, and unexpected failure events. By default it also opens a PostgreSQL transaction; any exception is rethrown after the transaction has been rolled back.

HTTP controllers are wrapped automatically by `OperationExecutionInterceptor`. Therefore feature handlers can call repositories normally without local `try/catch` or logger boilerplate. Health and metadata endpoints use `@NonTransactional()` because they must work when PostgreSQL is unavailable.

For non-HTTP workflows, use the same boundary explicitly:

```ts
return this.execution.execute(
  { operation: 'organizations.create', transactional: true },
  async (sql) => {
    const organization = await repository.insert(sql, input);
    await repository.addOwner(sql, organization.id, actorId);
    return organization;
  },
);
```

Repositories must use the supplied `SqlExecutor` or `PostgresDatabase.query()`. The latter automatically uses the active transaction client through `AsyncLocalStorage`. Never create a second pool, call `pool.query()` directly, or commit inside a repository.

Timeouts are intended for operations whose database driver calls honor cancellation. A timed-out operation is still rolled back by the execution boundary.
